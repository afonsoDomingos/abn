import Link from 'next/link';
import SidebarFooter from './SidebarFooter';
import UserMenu from '@/components/UserMenu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '40px', marginBottom: '0.5rem', display: 'block' }} />
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Admin Panel</div>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/usuarios">Usuários</Link>
          <Link href="/admin/servicos">Serviços</Link>
          <Link href="/admin/pagamentos">Pagamentos</Link>
          <Link href="/admin/configuracoes">Configurações</Link>
        </nav>
        <SidebarFooter />
      </aside>
      <main className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <h2>Painel de Gestão</h2>
          <UserMenu />
        </header>
        <div className={styles.adminContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
