'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role?: string; profileImage?: string }>({ name: 'Membro', role: 'user' });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read session from cookie or localStorage
    try {
      const match = document.cookie.match(new RegExp('(^| )abn_session=([^;]+)'));
      if (match) {
        const decoded = JSON.parse(decodeURIComponent(match[2]));
        setUser({
          name: decoded.name || 'Membro',
          role: decoded.role || 'user',
          profileImage: decoded.avatar || ''
        });
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser({
            name: parsed.name || 'Membro',
            role: parsed.role || 'user',
            profileImage: parsed.avatar || ''
          });
        }
      }
    } catch (e) {}

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isAdmin = user.role === 'admin';
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';
  const dashboardLabel = isAdmin ? '👑 Painel Admin' : '📊 O Meu Painel';

  return (
    <div className={styles.userMenuContainer} ref={menuRef}>
      <div className={styles.userInfo} onClick={() => setIsOpen(!isOpen)} title={user.name}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '2px' }}>
          <span className={styles.userName}>{user.name.split(' ')[0]}</span>
        </div>
        {user.profileImage ? (
          <div 
            className={styles.avatar}
            style={{ backgroundImage: `url('${user.profileImage}')` }}
          ></div>
        ) : (
          <div className={styles.avatarInitials}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link href={dashboardPath} onClick={() => setIsOpen(false)} className={styles.menuItem}>
            {dashboardLabel}
          </Link>
          <Link href={isAdmin ? '/admin/perfil' : '/dashboard'} onClick={() => setIsOpen(false)} className={styles.menuItem}>
            👤 Editar Perfil
          </Link>
          <div className={styles.separator}></div>
          <button onClick={handleLogout} className={`${styles.menuItem} ${styles.logout}`}>
            🚪 Terminar Sessão
          </button>
        </div>
      )}
    </div>
  );
}
