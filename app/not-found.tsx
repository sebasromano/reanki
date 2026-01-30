import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.icon}>🔍</span>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Página no encontrada</h2>
        <p className={styles.message}>
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/" className={styles.homeLink}>
          ← Volver al mapa
        </Link>
      </div>
    </div>
  );
}
