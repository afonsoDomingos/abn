'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoWrapper}>
            <img src="/abn-logo.png" alt="ABN Logo" className={styles.logoImg} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.abn}>ABN</span>
            <span className={styles.divider}></span>
            <span className={styles.network}>AfroBiz Network</span>
          </div>
        </Link>
        
        <div className={styles.links}>
          <Link href="#impacto">{t.nav.impact}</Link>
          <Link href="#incubadora">{t.nav.incubator}</Link>
          <Link href="#marketplace">{t.nav.marketplace}</Link>
          <Link href="#conexões">{t.nav.connections}</Link>
        </div>

        <div className={styles.actions}>
          <LanguageSelector />
          <a href="https://wa.me/258845773974" target="_blank" className={styles.whatsapp}>{t.nav.support}</a>
          <Link href="/login" className={styles.login}>{t.nav.login}</Link>
          <Link href="/registro" className="btn-primary">{t.nav.join}</Link>
        </div>
      </div>
    </nav>
  );
}
