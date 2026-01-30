'use client';

import { ReactNode } from 'react';
import { Vignette } from './Vignette';
import { Header } from './Header';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <Vignette />
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
