'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route changes / scroll
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <svg className={styles.logoPin} viewBox="0 0 24 30" width="30" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18c0-6.63-5.37-12-12-12z" fill="var(--primary)" />
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="#ffffff" />
            </svg>
            <div className={styles.brandText}>
              <span className={styles.abn}>ABN</span>
              <span className={styles.network}>AfroBiz Network</span>
            </div>
          </Link>

          <div className={styles.links}>
            <Link href="/#impacto">{t.nav.impact}</Link>
            <Link href="/#incubadora">{t.nav.incubator}</Link>
            <Link href="/#marketplace">{t.nav.marketplace}</Link>
            <Link href="/#conexões">{t.nav.connections}</Link>
            <Link href="/equipa">Equipa</Link>
            <Link href="/contacto">Contacto</Link>
          </div>

          <div className={styles.actions}>
            <LanguageSelector />
            <a href="https://wa.me/258845773974" target="_blank" className={styles.whatsapp}>{t.nav.support}</a>
            <Link href="/login" className={styles.login}>{t.nav.login}</Link>
            <Link href="/registro" className={`btn-primary ${styles.navbarBtn}`}>{t.nav.join}</Link>
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayVisible : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <div className={styles.logoWrapper}>
              <img src="/abn-logo.png" alt="ABN Logo" className={styles.logoImg} />
            </div>
            <span className={styles.abn}>ABN</span>
          </Link>
          <button className={styles.closeBtn} onClick={closeMenu} aria-label="Fechar menu">✕</button>
        </div>

        <nav className={styles.drawerNav}>
          <Link href="/#impacto" onClick={closeMenu}>{t.nav.impact}</Link>
          <Link href="/#incubadora" onClick={closeMenu}>{t.nav.incubator}</Link>
          <Link href="/#marketplace" onClick={closeMenu}>{t.nav.marketplace}</Link>
          <Link href="/#conexões" onClick={closeMenu}>{t.nav.connections}</Link>
          <Link href="/equipa" onClick={closeMenu}>Equipa</Link>
          <Link href="/contacto" onClick={closeMenu}>Contacto</Link>
        </nav>

        <div className={styles.drawerActions}>
          <LanguageSelector />
          <a href="https://wa.me/258845773974" target="_blank" className={styles.whatsapp} onClick={closeMenu}>
            {t.nav.support}
          </a>
          <Link href="/login" className={`${styles.login} ${styles.drawerLogin}`} onClick={closeMenu}>
            {t.nav.login}
          </Link>
          <Link href="/registro" className="btn-primary" onClick={closeMenu} style={{ textAlign: 'center' }}>
            {t.nav.join}
          </Link>
        </div>
      </div>
    </>
  );
}
