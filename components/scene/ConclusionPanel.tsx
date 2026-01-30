'use client';

import { useState, useEffect } from 'react';
import { ConclusionUnlock, Evidence } from '@/types/mission';
import { useMission } from '@/context/MissionContext';
import { EvidenceCard } from '../feedback/EvidenceCard';
import styles from './ConclusionPanel.module.css';

interface ConclusionPanelProps {
  conclusion: ConclusionUnlock;
  evidence: Evidence[];
  sceneId: string;
  onComplete: () => void;
}

export function ConclusionPanel({ 
  conclusion, 
  evidence, 
  sceneId,
  onComplete 
}: ConclusionPanelProps) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceCollected, setEvidenceCollected] = useState(false);
  const { completeScene, collectEvidence, progress } = useMission();
  
  // Check if evidence was already collected (returning to completed scene)
  const isAlreadyCollected = progress?.collectedEvidence.some(
    ce => ce.sceneId === sceneId
  ) ?? false;
  
  useEffect(() => {
    // If already collected, show evidence immediately
    if (isAlreadyCollected) {
      setShowEvidence(true);
      setEvidenceCollected(true);
    } else {
      // Animate in the evidence after a delay
      const timer = setTimeout(() => {
        setShowEvidence(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isAlreadyCollected]);
  
  const handleCollectEvidence = () => {
    evidence.forEach(e => collectEvidence(sceneId, e));
    setEvidenceCollected(true);
  };
  
  const handleComplete = () => {
    completeScene(sceneId);
    onComplete();
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.conclusionBox}>
        <div className={styles.stamp}>CASO RESUELTO</div>
        
        <div className={styles.conclusionContent}>
          <h2 className={styles.title}>Conclusión</h2>
          <p className={styles.text}>{conclusion.textEs}</p>
        </div>
      </div>
      
      {showEvidence && evidence.length > 0 && (
        <div className={styles.evidenceSection}>
          <h3 className={styles.evidenceTitle}>
            {evidenceCollected ? 'Evidencia Recolectada' : 'Nueva Evidencia Descubierta'}
          </h3>
          
          <div className={styles.evidenceGrid}>
            {evidence.map((item, index) => (
              <EvidenceCard 
                key={index}
                evidence={item}
                isNew={!evidenceCollected && !isAlreadyCollected}
              />
            ))}
          </div>
          
          {!evidenceCollected && !isAlreadyCollected ? (
            <button 
              className={styles.collectButton}
              onClick={handleCollectEvidence}
            >
              📥 Recoger Evidencia
            </button>
          ) : (
            <button 
              className={styles.continueButton}
              onClick={handleComplete}
            >
              Volver al Mapa →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
