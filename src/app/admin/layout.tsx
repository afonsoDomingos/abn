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
          <span className="text-gradient-gold">ABN</span> Admin
        </div>
        <nav className={styles.sidebarNav}>
          <a href="/admin" className={styles.active}>Dashboard</a>
          <a href="/admin/users">Usuários</a>
          <a href="/admin/services">Serviços</a>
          <a href="/admin/payments">Pagamentos</a>
          <a href="/admin/settings">Configurações</a>
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
