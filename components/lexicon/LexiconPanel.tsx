'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMission } from '@/context/MissionContext';
import styles from './LexiconPanel.module.css';

export function LexiconPanel() {
  const { config, isLoading } = useMission();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'term' | 'translation'>('term');
  
  const filteredTerms = useMemo(() => {
    if (!config) return [];
    
    let terms = [...config.lexicon];
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(t => 
        t.term.toLowerCase().includes(query) ||
        t.translation.toLowerCase().includes(query)
      );
    }
    
    // Sort
    terms.sort((a, b) => {
      if (sortBy === 'term') {
        return a.term.localeCompare(b.term);
      }
      return a.translation.localeCompare(b.translation);
    });
    
    return terms;
  }, [config, searchQuery, sortBy]);
  
  if (isLoading) {
    return <div className={styles.loading}>Cargando léxico...</div>;
  }
  
  if (!config) {
    return <div className={styles.error}>No hay datos disponibles</div>;
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Volver al mapa</Link>
        <h1 className={styles.title}>📖 Léxico</h1>
        <p className={styles.subtitle}>
          {config.lexicon.length} términos disponibles
        </p>
      </header>
      
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Buscar término o traducción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Buscar términos"
        />
        
        <div className={styles.sortButtons}>
          <button
            className={sortBy === 'term' ? styles.sortActive : styles.sortButton}
            onClick={() => setSortBy('term')}
            aria-pressed={sortBy === 'term'}
          >
            A-Z (EN)
          </button>
          <button
            className={sortBy === 'translation' ? styles.sortActive : styles.sortButton}
            onClick={() => setSortBy('translation')}
            aria-pressed={sortBy === 'translation'}
          >
            A-Z (ES)
          </button>
        </div>
      </div>
      
      <div className={styles.termsList}>
        {filteredTerms.length === 0 ? (
          <p className={styles.noResults}>No se encontraron resultados</p>
        ) : (
          filteredTerms.map((term, index) => (
            <article key={index} className={styles.termCard}>
              <div className={styles.termHeader}>
                <span className={styles.termText}>{term.term}</span>
                <span className={styles.arrow}>→</span>
                <span className={styles.translation}>{term.translation}</span>
              </div>
              {term.note && (
                <p className={styles.note}>{term.note}</p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
