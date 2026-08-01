'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role?: string; profileImage?: string }>({ name: 'Membro', role: 'user' });
  const menuRef = useRef<HTMLDivElement>(null);

  const loadUserData = () => {
    try {
      let profileImg = '';
      let userName = 'Membro';
      let userRole = 'user';

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        userName = parsed.name || userName;
        userRole = parsed.role || userRole;
        profileImg = parsed.profileImage || parsed.avatar || '';
      }

      const match = document.cookie.match(new RegExp('(^| )abn_session=([^;]+)'));
      if (match) {
        const decoded = JSON.parse(decodeURIComponent(match[2]));
        userName = decoded.name || userName;
        userRole = decoded.role || userRole;
        if (!profileImg) profileImg = decoded.profileImage || decoded.avatar || '';
      }

      setUser({
        name: userName,
        role: userRole,
        profileImage: profileImg
      });
    } catch (e) {}
  };

  useEffect(() => {
    loadUserData();

    const handleProfileUpdate = () => {
      loadUserData();
    };

    window.addEventListener('user-profile-updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isManagement = user.role === 'admin' || user.role === 'collaborator' || user.role === 'colaborador';
  const dashboardPath = isManagement ? '/admin' : '/dashboard';
  const dashboardLabel = isManagement ? (user.role === 'admin' ? '⚡ Painel Admin' : '👤 Painel Operacional') : '📊 O Meu Painel';
  const profilePath = isManagement ? '/admin/perfil' : '/dashboard/perfil';

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
          <Link href={profilePath} onClick={() => setIsOpen(false)} className={styles.menuItem}>
            👤 Editar Meu Perfil &amp; Foto
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
