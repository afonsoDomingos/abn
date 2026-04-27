import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img src="/abn-logo.png" alt="ABN Logo" className={styles.logoImg} />
          <span className={styles.network}>AfroBiz Network</span>
        </Link>
        
        <div className={styles.links}>
          <Link href="#impacto">Impacto</Link>
          <Link href="#incubadora">Incubadora</Link>
          <Link href="#marketplace">Marketplace</Link>
          <Link href="#conexões">Conexões</Link>
        </div>

        <div className={styles.actions}>
          <a href="https://wa.me/258845773974" target="_blank" className={styles.whatsapp}>📞 Suporte</a>
          <Link href="/login" className={styles.login}>Entrar</Link>
          <Link href="/registro" className="btn-primary">Junte-se à ABN</Link>
        </div>
      </div>
    </nav>
  );
}
