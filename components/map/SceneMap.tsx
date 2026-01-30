'use client';

import { useMission } from '@/context/MissionContext';
import { SceneNode } from './SceneNode';
import styles from './SceneMap.module.css';

export function SceneMap() {
  const { config, isLoading, error, getSceneStatus, resetProgress, progress } = useMission();
  
  if (isLoading) {
    return <div className={styles.loading}>Cargando misión...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }
  
  if (!config) {
    return null;
  }
  
  const completedScenes = Object.values(progress?.scenes ?? {}).filter(
    s => s.status === 'completed'
  ).length;
  
  const handleReset = () => {
    if (window.confirm('¿Reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
      resetProgress();
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.premise}>
        <p>{config.storyPremise}</p>
      </div>
      
      <div 
        className={styles.grid}
        style={{ 
          '--columns-mobile': config.ui.map.columnsMobile 
        } as React.CSSProperties}
      >
        {config.scenes.map((scene, index) => (
          <SceneNode
            key={scene.id}
            id={scene.id}
            icon={scene.node.icon}
            label={scene.node.label}
            status={getSceneStatus(scene.id)}
            sceneNumber={index + 1}
          />
        ))}
      </div>
      
      {completedScenes > 0 && (
        <div className={styles.resetContainer}>
          <button className={styles.resetButton} onClick={handleReset}>
            🔄 Reiniciar progreso
          </button>
        </div>
      )}
    </div>
  );
}
