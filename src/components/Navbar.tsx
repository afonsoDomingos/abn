import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className="text-gradient-gold">ABN</span>
          <span className={styles.network}>AfroBiz Network</span>
        </Link>
        
        <div className={styles.links}>
          <Link href="#impacto">Impacto</Link>
          <Link href="#incubadora">Incubadora</Link>
          <Link href="#marketplace">Marketplace</Link>
          <Link href="#conexões">Conexões</Link>
        </div>

        <div className={styles.actions}>
          <Link href="/login" className={styles.login}>Entrar</Link>
          <Link href="/registro" className="btn-primary">Junte-se à ABN</Link>
        </div>
      </div>
    </nav>
  );
}
