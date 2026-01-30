import styles from './PlaceholderImage.module.css';

interface PlaceholderImageProps {
  type: 'background' | 'character' | 'evidence';
  alt?: string;
}

export function PlaceholderImage({ type, alt }: PlaceholderImageProps) {
  const icons = {
    background: '🖼️',
    character: '👤',
    evidence: '🔍'
  };
  
  return (
    <div className={styles.placeholder} aria-label={alt}>
      <span className={styles.icon}>{icons[type]}</span>
    </div>
  );
}
