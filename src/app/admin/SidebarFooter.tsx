'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import styles from './Admin.module.css';

export default function SidebarFooter() {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className={styles.sidebarFooter}>
      <Link href="/" className={styles.footerLink}>
        <Home size={18} />
        <span>Ir para Home</span>
      </Link>
      <button onClick={handleLogout} className={`${styles.footerLink} ${styles.logout}`}>
        <LogOut size={18} />
        <span>Sair</span>
      </button>
    </div>
  );
}
