'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from '@/components/UserMenu';
import styles from './Colaborador.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  CalendarDays,
  MessageSquare,
  Target,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu
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

export default function ColaboradorLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navGroups: NavGroup[] = [
    {
      title: 'Geral',
      items: [
        { href: '/colaborador', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { href: '/colaborador/perfil', label: 'Perfil', icon: <Settings size={18} /> },
      ]
    },
    {
      title: 'Gestão',
      items: [
        { href: '/colaborador/usuarios', label: 'Usuários', icon: <Users size={18} /> },
        { href: '/colaborador/atividades', label: 'Atividades', icon: <Target size={18} /> },
        { href: '/colaborador/eventos', label: 'Eventos', icon: <CalendarDays size={18} /> },
        { href: '/colaborador/programas', label: 'Programas', icon: <BookOpen size={18} /> },
      ]
    },
    {
      title: 'Comunicação',
      items: [
        { href: '/colaborador/mensagens', label: 'Mensagens', icon: <MessageSquare size={18} /> },
      ]
    }
  ];

  return (
    <div className={`${styles.colaboradorLayout} ${collapsed ? styles.colaboradorLayoutCollapsed : ''}`}>
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
      </aside>

      {/* Main */}
      <main className={styles.colaboradorMain}>
        <header className={styles.colaboradorHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className={styles.mobileToggle} onClick={() => setCollapsed(!collapsed)}>
              <Menu size={20} />
            </button>
            <h2 className={styles.headerTitle}>Painel Colaborador</h2>
          </div>
          <UserMenu />
        </header>
        <div className={styles.colaboradorContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
