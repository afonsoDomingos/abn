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
  Home,
  ChevronRight,
  ChevronLeft,
  Bell,
  Settings
} from 'lucide-react';
import styles from './Colaborador.module.css';

export default function ColaboradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState({ name: 'Colaborador', profileImage: '', role: 'colaborator' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userRole = (parsed.role || '').toLowerCase();
        if (userRole === 'admin') {
          window.location.href = '/admin';
          return;
        }
        if (userRole !== 'collaborator' && userRole !== 'colaborador') {
          window.location.href = '/dashboard';
          return;
        }
        setUser({
          name: parsed.name || 'Colaborador',
          profileImage: parsed.profileImage || '',
          role: parsed.role || 'colaborator'
        });
      } catch (e) {}
    }

    fetchNotifications();

    const closeDropdowns = () => {
      setDropdownOpen(false);
      setNotifOpen(false);
    };
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {}
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    if (path === '/colaborador') {
      return pathname === '/colaborador';
    }
    return pathname ? pathname.startsWith(path) : false;
  };

  return (
    <div className={styles.colaboradorLayout}>
      {/* Overlay to close sidebar on mobile click outside */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 990 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''} ${collapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarBrand} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            {!collapsed ? (
              <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '50px' }} />
            ) : (
              <img src="/icon.png" alt="ABN Logo" style={{ height: '32px', display: 'block', margin: '0 auto' }} />
            )}
          </Link>
          <button 
            className={styles.mobileToggleClose} 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Botão de Colapso */}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <nav className={styles.sidebarNav}>
          <Link href="/colaborador" className={isActive('/colaborador') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Dashboard' : undefined}>
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link href="/colaborador/perfil" className={isActive('/colaborador/perfil') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Perfil' : undefined}>
            <UserIcon size={18} />
            {!collapsed && <span>Perfil</span>}
          </Link>
          <Link href="/colaborador/usuarios" className={isActive('/colaborador/usuarios') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Usuários' : undefined}>
            <Users size={18} />
            {!collapsed && <span>Usuários</span>}
          </Link>
          <Link href="/colaborador/atividades" className={isActive('/colaborador/atividades') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Atividades' : undefined}>
            <Target size={18} />
            {!collapsed && <span>Atividades</span>}
          </Link>
          <Link href="/colaborador/eventos" className={isActive('/colaborador/eventos') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Eventos' : undefined}>
            <CalendarDays size={18} />
            {!collapsed && <span>Eventos</span>}
          </Link>
          <Link href="/colaborador/programas" className={isActive('/colaborador/programas') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Programas' : undefined}>
            <BookOpen size={18} />
            {!collapsed && <span>Programas</span>}
          </Link>
          <Link href="/colaborador/mensagens" className={isActive('/colaborador/mensagens') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Mensagens' : undefined}>
            <MessageSquare size={18} />
            {!collapsed && <span>Mensagens</span>}
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link 
            href="/" 
            title={collapsed ? 'Página Inicial' : undefined}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '8px',
              color: '#475569',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: '10px',
              marginBottom: '0.5rem',
              transition: 'all 0.2s',
              textDecoration: 'none',
              border: '1px solid #e2e8f0',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#0f172a';
              (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#475569';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {collapsed ? '🏠' : '← Página Inicial'}
          </Link>
          <button onClick={handleLogout} className={styles.logout} style={{ background: 'none', border: 'none', textAlign: collapsed ? 'center' : 'left', width: '100%', cursor: 'pointer' }}>
            {collapsed ? '🚪' : 'Sair'}
          </button>
        </div>
      </aside>
      
      <main className={`${styles.colaboradorMain} ${collapsed ? styles.colaboradorMainCollapsed : ''}`}>
        <header className={styles.colaboradorHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className={styles.mobileToggle} 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className={styles.search}>
              <input type="text" placeholder="Pesquisar..." />
            </div>
          </div>
          <div className={styles.userArea}>
            {/* SININHO DE NOTIFICAÇÕES */}
            <div style={{ position: 'relative' }}>
              <button
                className={styles.notifications}
                onClick={(e) => {
                  e.stopPropagation();
                  setNotifOpen(!notifOpen);
                  setDropdownOpen(false);
                }}
                style={{ background: 'none', border: 'none', position: 'relative', cursor: 'pointer' }}
                title="Notificações"
              >
                <Bell size={20} color="#475569" />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ff6b00',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notif Dropdown */}
              {notifOpen && (
                <div 
                  className={styles.dropdown}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '320px', right: 0, padding: '1rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', fontFamily: 'Outfit' }}>
                      Notificações {unreadCount > 0 && `(${unreadCount})`}
                    </span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead} 
                        style={{ background: 'none', border: 'none', color: '#ff6b00', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Marcar lidas
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center', padding: '1.5rem 0' }}>
                      Sem notificações de momento.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.map((n) => (
                        <Link
                          key={n._id}
                          href={n.link || '/colaborador'}
                          onClick={() => setNotifOpen(false)}
                          style={{
                            display: 'block',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: n.read ? '#f8fafc' : '#fff7ed',
                            border: `1px solid ${n.read ? '#e2e8f0' : '#ffedd5'}`,
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>{n.message}</div>
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                            {new Date(n.createdAt).toLocaleDateString('pt-PT')}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className={styles.profileContainer}>
              <div 
                className={styles.userProfile}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                  setNotifOpen(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{user.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#ff6b00', textTransform: 'capitalize', fontWeight: 700 }}>
                    {user.role}
                  </span>
                </div>
                {user.profileImage ? (
                  <img
                    className={styles.avatar}
                    src={user.profileImage}
                    alt={user.name || 'User'}
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/abn-logo.png';
                      (e.currentTarget as HTMLImageElement).style.objectFit = 'contain';
                      (e.currentTarget as HTMLImageElement).style.padding = '4px';
                      (e.currentTarget as HTMLImageElement).style.background = '#fff7ed';
                    }}
                  />
                ) : (
                  <div className={styles.avatarInitials}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                  <Link href="/colaborador/perfil" onClick={() => setDropdownOpen(false)} className={styles.dropdownItem}>
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
        <div className={styles.colaboradorContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
