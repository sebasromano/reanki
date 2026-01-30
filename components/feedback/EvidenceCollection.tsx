'use client';

import Link from 'next/link';
import { useMission } from '@/context/MissionContext';
import { EvidenceCard } from './EvidenceCard';
import styles from './EvidenceCollection.module.css';

export function EvidenceCollection() {
  const { config, progress, isLoading } = useMission();
  
  if (isLoading) {
    return <div className={styles.loading}>Cargando evidencia...</div>;
  }
  
  if (!config || !progress) {
    return <div className={styles.error}>No hay datos disponibles</div>;
  }
  
  const collectedEvidence = progress.collectedEvidence;
  const totalPossible = config.scenes.reduce(
    (sum, scene) => sum + scene.rewardEvidence.length, 
    0
  );
  
  // Group evidence by scene
  const evidenceByScene = config.scenes.map(scene => {
    const sceneEvidence = scene.rewardEvidence.map(evidence => ({
      ...evidence,
      isCollected: collectedEvidence.some(
        ce => ce.sceneId === scene.id && ce.evidenceTitle === evidence.title
      )
    }));
    
    return {
      sceneId: scene.id,
      sceneLabel: scene.node.label,
      sceneIcon: scene.node.icon,
      evidence: sceneEvidence
    };
  });
  
  const progressPercent = totalPossible > 0 
    ? (collectedEvidence.length / totalPossible) * 100 
    : 0;
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Volver al mapa</Link>
        <h1 className={styles.title}>🗂️ Colección de Evidencia</h1>
        <p className={styles.subtitle}>
          {collectedEvidence.length} / {totalPossible} piezas recolectadas
        </p>
      </header>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      <div className={styles.scenesList}>
        {evidenceByScene.map(sceneGroup => (
          <section key={sceneGroup.sceneId} className={styles.sceneSection}>
            <h2 className={styles.sceneTitle}>
              <span className={styles.sceneIcon}>{sceneGroup.sceneIcon}</span>
              {sceneGroup.sceneLabel}
            </h2>
            
            <div className={styles.evidenceGrid}>
              {sceneGroup.evidence.map((evidence, index) => (
                evidence.isCollected ? (
                  <EvidenceCard 
                    key={index}
                    evidence={evidence}
                  />
                ) : (
                  <div key={index} className={styles.lockedCard}>
                    <span className={styles.lockIcon}>🔒</span>
                    <span className={styles.lockedText}>Sin descubrir</span>
                  </div>
                )
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
