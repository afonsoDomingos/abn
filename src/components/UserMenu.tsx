'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './UserMenu.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function UserMenu() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Administrador', profileImage: '' });
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name || 'Administrador',
        profileImage: parsed.profileImage || ''
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className={styles.userMenuContainer} ref={menuRef}>
      <div className={styles.userInfo} onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '4px' }}>
          <span className={styles.userName}>{user.name}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary, #d4af37)', opacity: 0.9, fontWeight: 700, textTransform: 'uppercase' }}>
            Admin
          </span>
        </div>
        {user.profileImage ? (
          <div 
            className={styles.avatar}
            style={{ backgroundImage: `url('${user.profileImage}')` }}
          ></div>
        ) : (
          <div className={styles.avatarInitials}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link href="/admin/perfil" onClick={() => setIsOpen(false)} className={styles.menuItem}>
            {t.admin.editProfile}
          </Link>
          <Link href="/" onClick={() => setIsOpen(false)} className={styles.menuItem}>
            🏠 {t.admin.goHome}
          </Link>
          <div className={styles.separator}></div>
          <button onClick={handleLogout} className={`${styles.menuItem} ${styles.logout}`}>
            🚪 {t.admin.logout}
          </button>
        </div>
      )}
    </div>
  );
}
