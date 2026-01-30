'use client';

import { useCallback, useRef } from 'react';

type SoundType = 'correct' | 'incorrect' | 'click' | 'complete' | 'unlock';

const soundPaths: Record<SoundType, string> = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  click: '/sounds/click.mp3',
  complete: '/sounds/complete.mp3',
  unlock: '/sounds/unlock.mp3',
};

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const play = useCallback((type: SoundType) => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(soundPaths[type]);
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors - browser may block audio
      });
    } catch {
      // Audio not available
    }
  }, []);
  
  return { play };
}
