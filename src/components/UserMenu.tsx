'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './UserMenu.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function UserMenu() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Administrador', profileImage: '/perfil09.jpg' });
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name || 'Administrador',
        profileImage: parsed.profileImage || '/perfil09.jpg'
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className={styles.userMenuContainer} ref={menuRef}>
      <div className={styles.userInfo} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.userName}>{user.name}</span>
        <div 
          className={styles.avatar}
          style={{ backgroundImage: `url('${user.profileImage}')` }}
        ></div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link href="/admin/perfil" onClick={() => setIsOpen(false)} className={styles.menuItem}>
            {t.admin.editProfile}
          </Link>
        </div>
      )}
    </div>
  );
}
