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
  ClipboardList,
  Building2,
  TrendingUp,
  DollarSign,
  Compass
} from 'lucide-react';
import styles from './Dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{
    name: string;
    profileImage: string;
    role: string;
    roles: string[];
  }>({ name: 'Empreendedor', profileImage: '', role: 'empreendedor', roles: ['empreendedor'] });
  const [activeRole, setActiveRole] = useState<string>('empreendedor');
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
        if (userRole === 'admin' || userRole === 'collaborator' || userRole === 'colaborador') {
          window.location.href = '/admin';
          return;
        }

        const userRoles: string[] = Array.isArray(parsed.roles) && parsed.roles.length > 0
          ? parsed.roles
          : [parsed.role || 'empreendedor'];

        const storedActiveRole = localStorage.getItem('abn_active_role');
        const currentActive = storedActiveRole && userRoles.includes(storedActiveRole)
          ? storedActiveRole
          : userRoles[0];

        setActiveRole(currentActive);
        setUser({
          name: parsed.name || 'Empreendedor',
          profileImage: parsed.profileImage || '',
          role: currentActive,
          roles: userRoles
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
          <Link href="/dashboard" className={isActive('/dashboard') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Dashboard' : undefined}>
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link href="/dashboard/perfil" className={isActive('/dashboard/perfil') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Perfil' : undefined}>
            <UserIcon size={18} />
            {!collapsed && <span>Perfil</span>}
          </Link>
          <Link href="/dashboard/negocios" className={isActive('/dashboard/negocios') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Negócios' : undefined}>
            <Building2 size={18} />
            {!collapsed && <span>Negócios</span>}
          </Link>
          <Link href="/dashboard/projetos" className={isActive('/dashboard/projetos') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Projetos' : undefined}>
            <Rocket size={18} />
            {!collapsed && <span>Projetos</span>}
          </Link>
          <Link href="/dashboard/oportunidades" className={isActive('/dashboard/oportunidades') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Oportunidades' : undefined}>
            <Target size={18} />
            {!collapsed && <span>Oportunidades</span>}
          </Link>
          <Link href="/dashboard/networking" className={isActive('/dashboard/networking') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Networking' : undefined}>
            <Users size={18} />
            {!collapsed && <span>Networking</span>}
          </Link>
          <Link href="/dashboard/servicos" className={isActive('/dashboard/servicos') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Serviços' : undefined}>
            <Briefcase size={18} />
            {!collapsed && <span>Serviços</span>}
          </Link>
          {(user.roles.includes('investidor') || activeRole === 'investidor') && (
            <Link 
              href="/dashboard/investimentos" 
              className={isActive('/dashboard/investimentos') ? styles.active : ''} 
              onClick={() => setSidebarOpen(false)} 
              title={collapsed ? 'Deal Room & Investimentos' : undefined}
              style={{ 
                background: isActive('/dashboard/investimentos') ? undefined : 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(245,158,11,0.08) 100%)', 
                border: isActive('/dashboard/investimentos') ? undefined : '1px solid rgba(16,185,129,0.25)', 
                color: isActive('/dashboard/investimentos') ? undefined : '#047857' 
              }}
            >
              <TrendingUp size={18} />
              {!collapsed && <span>Deal Room 💎</span>}
            </Link>
          )}
          {!(user.roles.includes('investidor') || activeRole === 'investidor') && (user.roles.includes('mentor') || activeRole === 'mentor') && (
            <Link href="/dashboard/investimentos" className={isActive('/dashboard/investimentos') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Investimentos' : undefined}>
              <TrendingUp size={18} />
              {!collapsed && <span>Investimentos</span>}
            </Link>
          )}
          {(user.roles.includes('startup') || activeRole === 'startup') && (
            <Link href="/dashboard/captacao" className={isActive('/dashboard/captacao') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Captação de Investimento' : undefined} style={{ background: isActive('/dashboard/captacao') ? undefined : 'linear-gradient(135deg, rgba(255,107,0,0.06) 0%, rgba(251,191,36,0.06) 100%)', border: isActive('/dashboard/captacao') ? undefined : '1px solid rgba(255,107,0,0.15)', color: isActive('/dashboard/captacao') ? undefined : '#b45309' }}>
              <TrendingUp size={18} />
              {!collapsed && <span>Captação 🚀</span>}
            </Link>
          )}
          {(user.roles.includes('empresa') || activeRole === 'empresa') && (
            <Link href="/dashboard/empresa" className={isActive('/dashboard/empresa') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Business Connect' : undefined} style={{ background: isActive('/dashboard/empresa') ? undefined : 'linear-gradient(135deg, rgba(14,165,233,0.07) 0%, rgba(99,102,241,0.07) 100%)', border: isActive('/dashboard/empresa') ? undefined : '1px solid rgba(14,165,233,0.18)', color: isActive('/dashboard/empresa') ? undefined : '#0369a1' }}>
              <DollarSign size={18} />
              {!collapsed && <span>Business Connect 🌐</span>}
            </Link>
          )}
          <Link 
            href="/dashboard/mentoria" 
            className={isActive('/dashboard/mentoria') ? styles.active : ''} 
            onClick={() => setSidebarOpen(false)} 
            title={collapsed ? 'Mentoria' : undefined}
            style={{ 
              background: isActive('/dashboard/mentoria') ? undefined : (user.roles.includes('mentor') || activeRole === 'mentor' ? 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(255,107,0,0.08) 100%)' : undefined),
              border: isActive('/dashboard/mentoria') ? undefined : (user.roles.includes('mentor') || activeRole === 'mentor' ? '1px solid rgba(245,158,11,0.25)' : undefined),
              color: isActive('/dashboard/mentoria') ? undefined : (user.roles.includes('mentor') || activeRole === 'mentor' ? '#b45309' : undefined)
            }}
          >
            <Compass size={18} />
            {!collapsed && <span>Mentoria {user.roles.includes('mentor') || activeRole === 'mentor' ? '🧭' : ''}</span>}
          </Link>
          <Link href="/dashboard/cursos" className={isActive('/dashboard/cursos') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Cursos' : undefined}>
            <BookOpen size={18} />
            {!collapsed && <span>Cursos</span>}
          </Link>
          <Link href="/dashboard/programas" className={isActive('/dashboard/programas') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Programas' : undefined}>
            <Rocket size={18} />
            {!collapsed && <span>Programas</span>}
          </Link>
          <Link href="/dashboard/eventos" className={isActive('/dashboard/eventos') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Eventos' : undefined}>
            <CalendarDays size={18} />
            {!collapsed && <span>Eventos</span>}
          </Link>
          <Link href="/dashboard/mensagens" className={isActive('/dashboard/mensagens') ? styles.active : ''} onClick={() => setSidebarOpen(false)} title={collapsed ? 'Mensagens' : undefined}>
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
      
      <main className={`${styles.mainContent} ${collapsed ? styles.mainContentCollapsed : ''}`}>
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
              <input type="text" placeholder="Pesquisar recursos, oportunidades, membros..." />
            </div>
          </div>
          <div className={styles.userArea}>
            {/* Seletor Rápido de Papel (Multi-Perfil) */}
            {user.roles && user.roles.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '5px 10px', borderRadius: '12px' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>Visão:</span>
                <select
                  value={activeRole}
                  onChange={(e) => {
                    const nextRole = e.target.value;
                    setActiveRole(nextRole);
                    localStorage.setItem('abn_active_role', nextRole);
                    window.dispatchEvent(new Event('abn_role_changed'));
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#ff6b00',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    outline: 'none',
                    textTransform: 'capitalize'
                  }}
                >
                  {user.roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}
            {/* 3. SININHO DE NOTIFICAÇÕES EM TEMPO REAL */}
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
                          href={n.link || '/dashboard'}
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
