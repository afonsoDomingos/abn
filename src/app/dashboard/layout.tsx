import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Link href="/">
            <span className="text-gradient-gold">ABN</span>
          </Link>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/dashboard" className={styles.active}>Início</Link>
          <Link href="/dashboard/perfil">Meu Perfil</Link>
          <Link href="/dashboard/projetos">Meus Projetos</Link>
          <Link href="/dashboard/servicos">Serviços</Link>
          <Link href="/dashboard/formacao">Formação</Link>
          <Link href="/dashboard/mensagens">Mensagens</Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/login" className={styles.logout}>Sair</Link>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.search}>
            <input type="text" placeholder="Pesquisar recursos, mentores..." />
          </div>
          <div className={styles.userArea}>
            <div className={styles.notifications}>🔔</div>
            <div className={styles.userProfile}>
              <span>Empreendedor</span>
              <div 
                className={styles.avatar}
                style={{ backgroundImage: `url('/Perfil05.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
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
