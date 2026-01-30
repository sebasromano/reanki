'use client';

import { useState } from 'react';
import styles from './CharacterPortrait.module.css';
import classNames from 'classnames';

interface CharacterPortraitProps {
  character: string;
  position?: 'left' | 'right';
  speaking?: boolean;
}

const characterMap: Record<string, string> = {
  'detective': '/assets/characters/detective.png',
  'butler': '/assets/characters/butler.png',
  'witness': '/assets/characters/witness-meek.png',
  'elderly': '/assets/characters/guest-elderly.png',
  'expert': '/assets/characters/expert-charming.png',
  'suspect': '/assets/characters/suspect-parole.png',
  'caterer': '/assets/characters/caterer.png',
};

export function CharacterPortrait({ 
  character, 
  position = 'left',
  speaking = false 
}: CharacterPortraitProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = characterMap[character] || characterMap['detective'];
  
  return (
    <div className={classNames(
      styles.portrait,
      styles[position],
      { [styles.speaking]: speaking }
    )}>
      {!imageError ? (
        <img 
          src={imageSrc}
          alt={`${character} character`}
          className={styles.image}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={styles.fallback}>
          <span>👤</span>
        </div>
      )}
    </div>
  );
}
