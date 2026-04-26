import Link from 'next/link';
import styles from './Admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <img src="/abn logo.png" alt="ABN Logo" style={{ height: '40px', marginBottom: '0.5rem', display: 'block' }} />
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Admin Panel</div>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin" className={styles.active}>Dashboard</Link>
          <Link href="/admin/usuarios">Usuários</Link>
          <Link href="/admin/servicos">Serviços</Link>
          <Link href="/admin/pagamentos">Pagamentos</Link>
          <Link href="/admin/configuracoes">Configurações</Link>
        </nav>
      </aside>
      <main className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <h2>Painel de Gestão</h2>
          <div className={styles.adminUser}>
            <span>Administrador</span>
            <div 
              className={styles.avatar}
              style={{ backgroundImage: `url('/perfil09.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
          </div>
        </header>
        <div className={styles.adminContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
