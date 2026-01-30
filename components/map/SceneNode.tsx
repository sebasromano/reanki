'use client';

import Link from 'next/link';
import { SceneStatus } from '@/types/progress';
import styles from './SceneNode.module.css';

interface SceneNodeProps {
  id: string;
  icon: string;
  label: string;
  status: SceneStatus;
  sceneNumber: number;
}

export function SceneNode({ id, icon, label, status, sceneNumber }: SceneNodeProps) {
  const isClickable = status !== 'locked';
  
  const nodeContent = (
    <div 
      className={`${styles.node} ${styles[status]}`}
      aria-label={`${label} - ${getStatusLabel(status)}`}
    >
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
        {status === 'completed' && (
          <span className={styles.checkmark}>✓</span>
        )}
        {status === 'locked' && (
          <span className={styles.lock}>🔒</span>
        )}
      </div>
      <span className={styles.number}>Escena {sceneNumber}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
  
  if (!isClickable) {
    return nodeContent;
  }
  
  return (
    <Link href={`/scene/${id}`} className={styles.link}>
      {nodeContent}
    </Link>
  );
}

function getStatusLabel(status: SceneStatus): string {
  switch (status) {
    case 'locked': return 'Bloqueada';
    case 'unlocked': return 'Disponible';
    case 'in_progress': return 'En progreso';
    case 'completed': return 'Completada';
  }
}
