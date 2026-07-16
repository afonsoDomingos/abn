'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import styles from './Admin.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function SidebarFooter({ isCollapsed }: { isCollapsed?: boolean }) {
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className={styles.sidebarFooter}>
      <Link href="/" className={styles.footerLink} title={isCollapsed ? t.admin.goHome : undefined}>
        <Home size={18} />
        {!isCollapsed && <span>{t.admin.goHome}</span>}
      </Link>
      <button onClick={handleLogout} className={`${styles.footerLink} ${styles.logout}`} title={isCollapsed ? t.admin.logout : undefined}>
        <LogOut size={18} />
        {!isCollapsed && <span>{t.admin.logout}</span>}
      </button>
    </div>
  );
}
