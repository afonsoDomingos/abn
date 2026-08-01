'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidebarFooter from './SidebarFooter';
import UserMenu from '@/components/UserMenu';
import styles from './Admin.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  Rocket,
  BarChart3,
  CalendarDays,
  Newspaper,
  ImageIcon,
  Target,
  ClipboardList,
  MessageSquare,
  Mail,
  CreditCard,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Menu,
  Users as UsersIcon,
  UserCheck,
  Building,
  Award
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>('admin');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role) setUserRole(u.role);
      } catch (e) {}
    }
  }, []);

  const isCollaborator = userRole === 'collaborator' || userRole === 'colaborador';

  const RESTRICTED_COLLABORATOR_ROUTES = [
    '/admin/usuarios',
    '/admin/colaboradores',
    '/admin/pagamentos',
    '/admin/configuracoes',
    '/admin/hubs',
    '/admin/departamentos',
    '/admin/equipa'
  ];

  const rawNavGroups: NavGroup[] = [
    {
      title: 'Geral',
      items: [
        { href: '/admin', label: t.admin.dashboard, icon: <LayoutDashboard size={18} /> },
        { href: '/admin/usuarios', label: t.admin.users, icon: <Users size={18} /> },
        { href: '/admin/especialistas', label: 'Especialistas & Mentores', icon: <Award size={18} /> },
        { href: '/admin/equipa', label: 'Equipa', icon: <UsersIcon size={18} /> },
        { href: '/admin/departamentos', label: 'Departamentos', icon: <Building size={18} /> },
        { href: '/admin/colaboradores', label: 'Colaboradores', icon: <UserCheck size={18} /> },
        { href: '/admin/servicos', label: t.admin.services, icon: <Briefcase size={18} /> },
      ]
    },
    {
      title: 'Conteúdo',
      items: [
        { href: '/admin/cursos', label: 'Cursos', icon: <BookOpen size={18} /> },
        { href: '/admin/programas', label: 'Programas', icon: <Rocket size={18} /> },
        { href: '/admin/impacto', label: 'Impacto', icon: <BarChart3 size={18} /> },
        { href: '/admin/eventos', label: 'Eventos', icon: <CalendarDays size={18} /> },
        { href: '/admin/noticias', label: 'Notícias', icon: <Newspaper size={18} /> },
        { href: '/admin/galeria', label: 'Galeria', icon: <ImageIcon size={18} /> },
        { href: '/admin/oportunidades', label: 'Oportunidades', icon: <Target size={18} /> },
      ]
    },
    {
      title: 'Comunicação',
      items: [
        { href: '/admin/inscricoes', label: 'Inscrições', icon: <UserCheck size={18} /> },
        { href: '/admin/solicitacoes', label: 'Solicitações', icon: <ClipboardList size={18} /> },
        { href: '/admin/mensagens', label: 'Mensagens', icon: <MessageSquare size={18} /> },
        { href: '/admin/comunicacao', label: 'Envio de E-mails', icon: <Mail size={18} /> },
      ]
    },
    {
      title: 'Sistema',
      items: [
        { href: '/admin/pagamentos', label: t.admin.payments, icon: <CreditCard size={18} /> },
        { href: '/admin/configuracoes', label: t.admin.settings, icon: <Settings size={18} /> },
        { href: '/admin/hubs', label: 'Delegações', icon: <Building2 size={18} /> },
      ]
    }
  ];

  // Filter groups for Collaborator
  const navGroups = rawNavGroups.map(group => ({
    ...group,
    items: group.items.filter(item => !isCollaborator || !RESTRICTED_COLLABORATOR_ROUTES.includes(item.href))
  })).filter(group => group.items.length > 0);

  const isRestrictedRouteForCollaborator = isCollaborator && RESTRICTED_COLLABORATOR_ROUTES.includes(pathname);

  return (
    <div className={`${styles.adminLayout} ${collapsed ? styles.adminLayoutCollapsed : ''}`}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
        {/* Brand */}
        <div className={styles.sidebarBrand}>
          {!collapsed && (
            <img src="/abn-logo.png" alt="ABN" style={{ height: '36px', display: 'block' }} />
          )}
          {collapsed && (
            <img src="/icon.png" alt="ABN" style={{ height: '32px', display: 'block', margin: '0 auto' }} />
          )}
        </div>

        {/* Toggle button */}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          {navGroups.map(group => (
            <div key={group.title} className={styles.navGroup}>
              {!collapsed && (
                <span className={styles.navGroupTitle}>{group.title}</span>
              )}
              {group.items.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <SidebarFooter isCollapsed={collapsed} />
      </aside>

      {/* Main */}
      <main className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className={styles.mobileToggle} onClick={() => setCollapsed(!collapsed)}>
              <Menu size={20} />
            </button>
            <h2 className={styles.headerTitle}>{t.admin.panel}</h2>
            {isCollaborator ? (
              <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
                👤 Colaborador
              </span>
            ) : (
              <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', border: '1px solid #ffedd5' }}>
                ⚡ Administrador
              </span>
            )}
          </div>
          <UserMenu />
        </header>

        <div className={styles.adminContent}>
          {isRestrictedRouteForCollaborator ? (
            <div style={{ background: '#ffffff', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.04)', maxWidth: '600px', margin: '3rem auto' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Acesso Restrito ao Administrador</h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Esta seção requer privilégios de Administrador. O seu perfil de <strong>Colaborador</strong> tem acesso liberado para gestão de inscrições, cursos, programas, eventos, mensagens e conteúdos.
              </p>
              <Link href="/admin" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', display: 'inline-block' }}>
                Voltar ao Painel Operacional
              </Link>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
