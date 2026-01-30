import styles from './Skeleton.module.css';
import classNames from 'classnames';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rectangle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ 
  variant = 'rectangle', 
  width, 
  height,
  className 
}: SkeletonProps) {
  return (
    <div 
      className={classNames(styles.skeleton, styles[variant], className)}
      style={{ width, height }}
    />
  );
}
