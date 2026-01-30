'use client';

import { useEffect, useState } from 'react';
import styles from './Confetti.module.css';

interface ConfettiProps {
  trigger: boolean;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

const colors = ['#c9a227', '#4a6fa5', '#8b4513', '#27ae60', '#c0392b'];

export function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger]);
  
  if (particles.length === 0) return null;
  
  return (
    <div className={styles.container} aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
