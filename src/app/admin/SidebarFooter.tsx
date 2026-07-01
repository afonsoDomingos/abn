'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import styles from './Admin.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function SidebarFooter() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className={styles.sidebarFooter}>
      <Link href="/" className={styles.footerLink}>
        <Home size={18} />
        <span>{t.admin.goHome}</span>
      </Link>
      <button onClick={handleLogout} className={`${styles.footerLink} ${styles.logout}`}>
        <LogOut size={18} />
        <span>{t.admin.logout}</span>
      </button>
    </div>
  );
}
