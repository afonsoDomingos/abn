'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User as UserIcon,
  Rocket,
  Target,
  Users,
  Briefcase,
  CalendarDays,
  BookOpen,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Home
} from 'lucide-react';
import styles from './Dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState({ name: 'Empreendedor', profileImage: '', role: 'user' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'Empreendedor',
          profileImage: parsed.profileImage || '',
          role: parsed.role || 'user'
        });
      } catch (e) {}
    }

    const closeDropdown = () => setDropdownOpen(false);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname ? pathname.startsWith(path) : false;
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Overlay to close sidebar on mobile click outside */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 990 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarBrand} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '50px' }} />
          </Link>
          <button 
            className={styles.mobileToggleClose} 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/dashboard" className={isActive('/dashboard') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/perfil" className={isActive('/dashboard/perfil') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
            <UserIcon size={18} />
            <span>Perfil</span>
          </Link>
          <Link href="/dashboard/projetos" className={isActive('/dashboard/projetos') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
            <Rocket size={18} />
            <span>Projetos</span>
          </Link>
          <Link href="/dashboard/oportunidades" className={isActive('/dashboard/oportunidades') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
            <Target size={18} />
            <span>Oportunidades</span>
          </Link>
          <Link href="/dashboard/networking" className={isActive('/dashboard/networking') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
            <Users size={18} />
            <span>Networking</span>
          </Link>
          <Link href="/dashboard/servicos" className={isActive('/dashboard/servicos') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
            <Briefcase size={18} />
            <span>Serviços</span>
          </Link>
          {(user.role === 'investidor' || user.role === 'mentor') && (
            <Link href="/dashboard/investimentos" className={isActive('/dashboard/investimentos') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
              <CalendarDays size={18} />
              <span>Investimentos</span>
            </Link>
          )}
          <Link href="/dashboard/formacao" className={isActive('/dashboard/formacao') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
            <BookOpen size={18} />
            <span>Formação</span>
          </Link>
          <Link href="/dashboard/mensagens" className={isActive('/dashboard/mensagens') ? styles.active : ''} onClick={() => setSidebarOpen(false)}>
            <MessageSquare size={18} />
            <span>Mensagens</span>
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.85rem',
              padding: '10px 16px',
              borderRadius: '10px',
              marginBottom: '0.5rem',
              transition: 'all 0.2s',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#fff';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            ← Página Inicial
          </Link>
          <button onClick={handleLogout} className={styles.logout} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className={styles.mobileToggle} 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className={styles.search}>
              <input type="text" placeholder="Pesquisar recursos, mentores..." />
            </div>
          </div>
          <div className={styles.userArea}>
            <div className={styles.notifications}>🔔</div>
            
            <div className={styles.profileContainer}>
              <div 
                className={styles.userProfile}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary, #d4af37)', textTransform: 'capitalize', opacity: 0.9, fontWeight: 700 }}>
                    {user.role}
                  </span>
                </div>
                {user.profileImage ? (
                  <div 
                    className={styles.avatar}
                    style={{ backgroundImage: `url('${user.profileImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  ></div>
                ) : (
                  <div className={styles.avatarInitials}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'E'}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                  <Link href="/dashboard/perfil" onClick={() => setDropdownOpen(false)} className={styles.dropdownItem}>
                    <UserIcon size={16} /> O Meu Perfil
                  </Link>
                  <Link href="/" onClick={() => setDropdownOpen(false)} className={styles.dropdownItem}>
                    <Home size={16} /> Página Inicial
                  </Link>
                  <div className={styles.separator}></div>
                  <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logout}`}>
                    <LogOut size={16} /> Terminar Sessão
                  </button>
                </div>
              )}
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
