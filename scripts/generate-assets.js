#!/usr/bin/env node

/**
 * DALL-E Asset Generator
 * 
 * Generates images from the CSV prompts file using OpenAI's DALL-E API.
 * 
 * Usage:
 *   node scripts/generate-assets.js                    # Generate all pending
 *   node scripts/generate-assets.js --category=background  # Only backgrounds
 *   node scripts/generate-assets.js --dry-run          # Show what would be generated
 *   node scripts/generate-assets.js --force            # Regenerate all (ignore status)
 *   node scripts/generate-assets.js --model=dall-e-2   # Use DALL-E 2 instead of 3
 */

import 'dotenv/config';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import * as readline from 'readline';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Configuration
const CSV_PATH = join(PROJECT_ROOT, 'docs', 'assets-prompts.csv');
const ASSETS_PATH = join(PROJECT_ROOT, 'public', 'assets');

// Pricing (per image)
const PRICING = {
  'dall-e-3': {
    '1024x1024': 0.04,
    '1024x1792': 0.08,
    '1792x1024': 0.08,
  },
  'dall-e-2': {
    '1024x1024': 0.02,
    '512x512': 0.018,
    '256x256': 0.016,
  },
};

// Size mapping by category
const SIZE_BY_CATEGORY = {
  'background': '1792x1024',  // Landscape for scenes
  'character': '1024x1792',   // Portrait for characters
  'evidence': '1024x1024',    // Square for icons
  'ui': '1024x1024',          // Square for UI elements
};

// DALL-E 2 only supports 1024x1024, 512x512, 256x256
const DALLE2_SIZE_FALLBACK = '1024x1024';

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = {
    category: null,
    dryRun: false,
    force: false,
    yes: false,
    model: 'dall-e-3',
    help: false,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--force') {
      args.force = true;
    } else if (arg === '--yes' || arg === '-y') {
      args.yes = true;
    } else if (arg.startsWith('--category=')) {
      args.category = arg.split('=')[1];
    } else if (arg.startsWith('--model=')) {
      args.model = arg.split('=')[1];
    }
  }

  return args;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
DALL-E Asset Generator

Usage:
  node scripts/generate-assets.js [options]

Options:
  --category=<name>   Only generate assets for specific category
                      (background, character, evidence, ui)
  --dry-run           Show what would be generated without making API calls
  --force             Regenerate all assets (ignore 'generated' status)
  --model=<model>     Use specific model (dall-e-3 or dall-e-2)
                      Default: dall-e-3
  --help, -h          Show this help message

Examples:
  node scripts/generate-assets.js
  node scripts/generate-assets.js --category=background
  node scripts/generate-assets.js --dry-run
  node scripts/generate-assets.js --model=dall-e-2 --category=ui
`);
}

/**
 * Read and parse the CSV file
 */
function readCSV() {
  const content = readFileSync(CSV_PATH, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
  });
}

/**
 * Write records back to CSV
 */
function writeCSV(records) {
  const output = stringify(records, {
    header: true,
    columns: ['category', 'asset_name', 'filename', 'status', 'prompt'],
  });
  writeFileSync(CSV_PATH, output);
}

/**
 * Create backup of CSV file
 */
function backupCSV() {
  const backupPath = CSV_PATH + '.backup';
  copyFileSync(CSV_PATH, backupPath);
  console.log(`📋 Created backup: ${backupPath}`);
}

/**
 * Filter records based on arguments
 */
function filterRecords(records, args) {
  let filtered = [...records];

  // Filter by category if specified
  if (args.category) {
    filtered = filtered.filter(r => r.category === args.category);
  }

  // Filter by status unless force is specified
  if (!args.force) {
    filtered = filtered.filter(r => r.status === 'pending');
  }

  return filtered;
}

/**
 * Get image size for a category
 */
function getSize(category, model) {
  if (model === 'dall-e-2') {
    return DALLE2_SIZE_FALLBACK;
  }
  return SIZE_BY_CATEGORY[category] || '1024x1024';
}

/**
 * Calculate estimated cost
 */
function calculateCost(records, model) {
  let total = 0;
  for (const record of records) {
    const size = getSize(record.category, model);
    const price = PRICING[model]?.[size] || 0.04;
    total += price;
  }
  return total;
}

/**
 * Ask for user confirmation
 */
async function confirm(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Download image from URL and save to file
 */
async function downloadImage(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  
  // Ensure directory exists
  const dir = dirname(filepath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  writeFileSync(filepath, buffer);
}

/**
 * Generate a single image
 */
async function generateImage(openai, record, model) {
  const size = getSize(record.category, model);
  
  console.log(`\n🎨 Generating: ${record.asset_name}`);
  console.log(`   Category: ${record.category}`);
  console.log(`   Size: ${size}`);
  console.log(`   Model: ${model}`);

  const response = await openai.images.generate({
    model: model,
    prompt: record.prompt,
    n: 1,
    size: size,
  });

  const imageUrl = response.data[0].url;
  
  // Determine output path based on category
  let categoryFolder = record.category;
  if (categoryFolder === 'background') {
    categoryFolder = 'backgrounds';
  } else if (categoryFolder === 'character') {
    categoryFolder = 'characters';
  }
  
  const outputPath = join(ASSETS_PATH, categoryFolder, record.filename);
  
  console.log(`   Downloading to: ${outputPath}`);
  await downloadImage(imageUrl, outputPath);
  
  console.log(`   ✅ Done!`);
  
  return outputPath;
}

/**
 * Add delay between API calls
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function
 */
async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    return;
  }

  console.log('🖼️  DALL-E Asset Generator\n');

  // Validate API key (skip for dry run)
  const apiKey = process.env.OPENAI_API_KEY;
  if (!args.dryRun && (!apiKey || apiKey === 'sk-your-api-key-here')) {
    console.error('❌ Error: OPENAI_API_KEY not set in .env file');
    console.error('   Please add your OpenAI API key to the .env file');
    process.exit(1);
  }

  // Validate model
  if (!['dall-e-2', 'dall-e-3'].includes(args.model)) {
    console.error(`❌ Error: Invalid model "${args.model}". Use "dall-e-2" or "dall-e-3"`);
    process.exit(1);
  }

  // Read and filter CSV
  const allRecords = readCSV();
  const toGenerate = filterRecords(allRecords, args);

  if (toGenerate.length === 0) {
    console.log('✨ No assets to generate!');
    if (!args.force) {
      console.log('   (Use --force to regenerate existing assets)');
    }
    return;
  }

  // Show summary
  console.log(`📊 Summary:`);
  console.log(`   Model: ${args.model}`);
  console.log(`   Total assets: ${allRecords.length}`);
  console.log(`   To generate: ${toGenerate.length}`);
  
  if (args.category) {
    console.log(`   Category filter: ${args.category}`);
  }
  if (args.force) {
    console.log(`   Mode: Force regenerate all`);
  }

  // Calculate and show cost
  const estimatedCost = calculateCost(toGenerate, args.model);
  console.log(`\n💰 Estimated cost: $${estimatedCost.toFixed(2)}`);

  // List assets to generate
  console.log('\n📋 Assets to generate:');
  for (const record of toGenerate) {
    const size = getSize(record.category, args.model);
    console.log(`   • [${record.category}] ${record.asset_name} (${size})`);
  }

  // Dry run stops here
  if (args.dryRun) {
    console.log('\n🏃 Dry run complete. No images were generated.');
    return;
  }

  // Confirm before proceeding (skip if --yes flag)
  if (!args.yes) {
    console.log('');
    const confirmed = await confirm('Proceed with generation? (y/n): ');
    if (!confirmed) {
      console.log('❌ Cancelled.');
      return;
    }
  } else {
    console.log('\n⚡ Auto-confirmed with --yes flag');
  }

  // Create backup
  backupCSV();

  // Initialize OpenAI client
  const openai = new OpenAI({ apiKey });

  // Generate images
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toGenerate.length; i++) {
    const record = toGenerate[i];
    console.log(`\n[${i + 1}/${toGenerate.length}]`);

    try {
      await generateImage(openai, record, args.model);
      
      // Update status in original records
      const originalIndex = allRecords.findIndex(
        r => r.filename === record.filename && r.category === record.category
      );
      if (originalIndex !== -1) {
        allRecords[originalIndex].status = 'generated';
      }
      
      // Save CSV after each successful generation (for resume capability)
      writeCSV(allRecords);
      successCount++;

      // Add delay between requests to respect rate limits
      if (i < toGenerate.length - 1) {
        console.log('   ⏳ Waiting 2 seconds before next request...');
        await delay(2000);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      failCount++;
      
      // Continue with next image
      if (i < toGenerate.length - 1) {
        console.log('   ⏳ Waiting 5 seconds before retry/next...');
        await delay(5000);
      }
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Generation Complete!');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   💰 Actual cost: ~$${(successCount * (PRICING[args.model]?.['1024x1024'] || 0.04)).toFixed(2)}`);
  
  if (failCount > 0) {
    console.log('\n💡 Tip: Run the script again to retry failed images.');
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
