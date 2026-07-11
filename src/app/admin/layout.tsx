'use client';

import Link from 'next/link';
import SidebarFooter from './SidebarFooter';
import UserMenu from '@/components/UserMenu';
import styles from './Admin.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '40px', marginBottom: '0.5rem', display: 'block' }} />
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Admin Panel</div>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin">{t.admin.dashboard}</Link>
          <Link href="/admin/usuarios">{t.admin.users}</Link>
          <Link href="/admin/servicos">{t.admin.services}</Link>
          <Link href="/admin/solicitacoes">📋 Solicitações</Link>
          <Link href="/admin/mensagens">💬 Mensagens</Link>
          <Link href="/admin/pagamentos">{t.admin.payments}</Link>
          <Link href="/admin/configuracoes">{t.admin.settings}</Link>
          <Link href="/admin/hubs">🏢 Delegações</Link>
        </nav>
        <SidebarFooter />
      </aside>
      <main className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <h2>{t.admin.panel}</h2>
          <UserMenu />
        </header>
        <div className={styles.adminContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
