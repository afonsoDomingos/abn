'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  return (
    <button onClick={handleLogout} className={styles.logout}>
      🚪 Sair
    </button>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState({ name: 'Empreendedor', profileImage: '/Perfil05.jpg' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'Empreendedor',
          profileImage: parsed.profileImage || '/Perfil05.jpg'
        });
      } catch (e) {}
    }
  }, []);

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Link href="/">
            <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '50px' }} />
          </Link>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/dashboard" className={styles.active}>🏠 Dashboard</Link>
          <Link href="/dashboard/perfil">👤 Perfil</Link>
          <Link href="/dashboard/projetos">🚀 Projetos</Link>
          <Link href="/dashboard/servicos">🛠️ Serviços</Link>
          <Link href="/dashboard/formacao">Formação</Link>
          <Link href="/dashboard/mensagens">💬 Mensagens</Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <LogoutButton />
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.search}>
            <input type="text" placeholder="Pesquisar recursos, mentores..." />
          </div>
          <div className={styles.userArea}>
            <div className={styles.notifications}>🔔</div>
            <div className={styles.userProfile}>
              <span>{user.name}</span>
              <div 
                className={styles.avatar}
                style={{ backgroundImage: `url('${user.profileImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
            </div>
          </div>
        </header>
        <div className={styles.scrollArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
