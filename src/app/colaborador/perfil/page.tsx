'use client';

import { useEffect, useState } from 'react';
import { cookies } from 'next/headers';
import styles from './Perfil.module.css';

export default function ColaboradorPerfil() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from session
    const getUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>A carregar...</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className="text-gradient-gold">Perfil</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
        Gerencie suas informações de perfil
      </p>

      {user && (
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className={styles.profileInfo}>
              <h2>{user.name}</h2>
              <p className={styles.email}>{user.email}</p>
              <span className={styles.roleBadge}>Colaborador</span>
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.detailGroup}>
              <label>Departamento</label>
              <p>{user.department || 'Não definido'}</p>
            </div>
            <div className={styles.detailGroup}>
              <label>Telefone</label>
              <p>{user.phone || 'Não definido'}</p>
            </div>
            <div className={styles.detailGroup}>
              <label>LinkedIn</label>
              {user.linkedin ? (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                  {user.linkedin}
                </a>
              ) : (
                <p>Não definido</p>
              )}
            </div>
            <div className={styles.detailGroup}>
              <label>Bio</label>
              <p>{user.bio || 'Não definido'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
