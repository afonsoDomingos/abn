'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role?: string; profileImage?: string }>({ name: '', role: 'user' });
  const menuRef = useRef<HTMLDivElement>(null);

  const loadUserData = async () => {
    try {
      let profileImg = '';
      let userName = '';
      let userRole = '';

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        userName = parsed.name || '';
        userRole = parsed.role || '';
        profileImg = parsed.profileImage || parsed.avatar || '';
      }

      const match = document.cookie.match(new RegExp('(^| )abn_session=([^;]+)'));
      if (match) {
        const decoded = JSON.parse(decodeURIComponent(match[2]));
        if (!userName) userName = decoded.name || '';
        if (!userRole) userRole = decoded.role || '';
        if (!profileImg) profileImg = decoded.profileImage || decoded.avatar || '';
      }

      if (userName || profileImg) {
        setUser({
          name: userName || 'Utilizador',
          role: userRole || 'user',
          profileImage: profileImg
        });
      }

      // Fetch fresh profile directly from MongoDB
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const freshName = data.user.name || userName || 'Utilizador';
          const freshRole = data.user.role || userRole || 'user';
          const freshImg = data.user.profileImage || data.user.avatar || profileImg || '';

          setUser({
            name: freshName,
            role: freshRole,
            profileImage: freshImg
          });

          // Sync localStorage
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              localStorage.setItem('user', JSON.stringify({
                ...parsed,
                name: freshName,
                role: freshRole,
                profileImage: freshImg
              }));
            } catch (e) { }
          }
        }
      }
    } catch (e) { }
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
    } catch (e) { }
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isManagement = user.role === 'admin' || user.role === 'collaborator' || user.role === 'colaborador';
  const dashboardPath = isManagement ? '/admin' : '/dashboard';
  const dashboardLabel = isManagement ? (user.role === 'admin' ? 'Painel Admin' : 'Painel Operacional') : 'O Meu Painel';
  const profilePath = isManagement ? '/admin/perfil' : '/dashboard/perfil';

  const rawName = (user.name && user.name !== 'Membro') ? user.name : (user.role === 'admin' ? 'Administrador' : 'Utilizador');
  const displayName = rawName.split(' ')[0];
  const avatarSrc = user.profileImage || '';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className={styles.userMenuContainer} ref={menuRef}>
      <div className={styles.userInfo} onClick={() => setIsOpen(!isOpen)} title={rawName}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '4px' }}>
          <span className={styles.userName}>{displayName}</span>
        </div>
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={displayName}
            className={styles.avatar}
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className={styles.avatarInitials}>
            {initials}
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link
            href={dashboardPath}
            onClick={() => setIsOpen(false)}
            className={styles.menuItem}
          >
            {dashboardLabel}
          </Link>
          <Link
            href={profilePath}
            onClick={() => setIsOpen(false)}
            className={styles.menuItem}
          >
            Editar Meu Perfil &amp; Foto
          </Link>
          <div className={styles.separator}></div>
          <button onClick={handleLogout} className={`${styles.menuItem} ${styles.logout}`}>
            Terminar Sessão
          </button>
        </div>
      )}
    </div>
  );
}
