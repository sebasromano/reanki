# Agent Guidelines for This Project

## Asset Management Rules

### Removing Images with Associated Code

When asked to remove an image/asset from the project:

1. **Search for references first**: Before deleting an image, search for any code that references it:
   - CSS/SCSS files (background-image, url())
   - React components that import or use the image
   - Any other files that might reference the asset path

2. **Remove in order**:
   - Remove the import/usage from parent components
   - Delete the component file (if dedicated to that asset)
   - Delete the CSS/SCSS module (if dedicated to that asset)
   - Delete the image file itself
   - Remove the entry from `docs/assets-prompts.csv` (if applicable)

3. **Check for orphaned code**: After removal, verify no broken imports or references remain.

### Asset Generation

- Asset prompts are managed in `docs/assets-prompts.csv`
- Use `npm run generate-assets` to generate pending images
- Use `npm run generate-assets:dry` to preview without generating
