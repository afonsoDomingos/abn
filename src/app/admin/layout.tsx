'use client';

import { useState } from 'react';
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
  Building
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

  const navGroups: NavGroup[] = [
    {
      title: 'Geral',
      items: [
        { href: '/admin', label: t.admin.dashboard, icon: <LayoutDashboard size={18} /> },
        { href: '/admin/usuarios', label: t.admin.users, icon: <Users size={18} /> },
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
          </div>
          <UserMenu />
        </header>
        <div className={styles.adminContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
