'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { t, language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hubs, setHubs] = useState<Array<{ name: string; slug: string }>>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Fetch Hubs & check user session on mount
  useEffect(() => {
    fetch('/api/hubs')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.hubs) {
          setHubs(data.hubs);
        }
      })
      .catch(() => { });

    const checkUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) { }
      }

      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      } catch (e) { }
    };

    checkUser();

    window.addEventListener('user-profile-updated', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('user-profile-updated', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

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

  const dashboardPath = currentUser?.role === 'admin' ? '/admin' : '/dashboard';
  const dashboardLabel = currentUser?.role === 'admin' ? '👑 Painel Admin' : '📊 Ir para o Meu Painel';

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <img src="/icon.png" alt="ABN Logo" className={styles.logoImg} />
            <div className={styles.brandText}>
              <span className={styles.abn}>ABN</span>
              <span className={styles.network}>AfroBiz Network</span>
            </div>
          </Link>

          <div className={styles.links}>
            {/* 1. Programas & Soluções Dropdown */}
            <div className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                {language === 'pt' ? 'Programas & Soluções' : 'Programs & Solutions'} <span className={styles.arrow}>▼</span>
              </span>
              <div className={styles.dropdownMenu}>
                <Link href="/incubacao" onClick={closeMenu}>🚀 {t.nav.incubator}</Link>
                <Link href="/marketplace" onClick={closeMenu}>💼 {t.nav.marketplace}</Link>
                <Link href="/oportunidades" onClick={closeMenu}>💰 Oportunidades &amp; Bolsas</Link>
                <Link href="/#cursos" onClick={closeMenu}>📚 Academia &amp; Cursos</Link>
              </div>
            </div>

            {/* 2. Mídia & Conteúdo Dropdown */}
            <div className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                {language === 'pt' ? 'Mídia & Conteúdo' : 'Media & Content'} <span className={styles.arrow}>▼</span>
              </span>
              <div className={styles.dropdownMenu}>
                <Link href="/noticias" onClick={closeMenu}>📰 Notícias &amp; Atualidades</Link>
                <Link href="/eventos" onClick={closeMenu}>📅 Eventos &amp; Summits</Link>
                <Link href="/galeria" onClick={closeMenu}>🖼️ Galeria de Fotos</Link>
                <Link href="/#artigos" onClick={closeMenu}>📢 A Voz do Empreendedor</Link>
              </div>
            </div>

            {/* 3. Sobre ABN Dropdown */}
            <div className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                {language === 'pt' ? 'Sobre ABN' : 'About ABN'} <span className={styles.arrow}>▼</span>
              </span>
              <div className={styles.dropdownMenu}>
                <Link href="/impacto" onClick={closeMenu}>🌟 {t.nav.impact}</Link>
                <Link href="/mensagem-do-presidente" onClick={closeMenu}>📜 Mensagem do Presidente</Link>
                <Link href="/equipa" onClick={closeMenu}>👥 Equipa Executiva</Link>
                <Link href="/especialistas" onClick={closeMenu}>👨‍🏫 Especialistas &amp; Mentores</Link>
                <Link href="/parceiros" onClick={closeMenu}>🤝 {t.nav.connections}</Link>
                <div className={styles.divider}></div>
                <div className={styles.dropdownHeader}>
                  📍 {language === 'pt' ? 'Delegações / Hubs' : 'Hubs'}
                </div>
                {hubs.length === 0 ? (
                  <Link href="/country/quinebissau" onClick={closeMenu}>
                    Guiné-Bissau
                  </Link>
                ) : (
                  hubs.map(hub => (
                    <Link key={hub.slug} href={`/country/${hub.slug}`} onClick={closeMenu}>
                      {hub.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link href="/contacto">Contacto</Link>
          </div>

          <div className={styles.actions}>
            <LanguageSelector />

            {currentUser ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/login" className={styles.login}>{t.nav.login}</Link>
                <Link href="/registro" className={`btn-primary ${styles.navbarBtn}`}>{t.nav.join}</Link>
              </>
            )}
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
            <img src="/icon.png" alt="ABN Logo" className={styles.logoImg} />
            <span className={styles.abn}>ABN</span>
          </Link>
          <button className={styles.closeBtn} onClick={closeMenu} aria-label="Fechar menu">✕</button>
        </div>

        <nav className={styles.drawerNav}>
          {currentUser && (
            <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '12px 14px', borderRadius: '12px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {(currentUser.profileImage || currentUser.avatar) ? (
                <img
                  src={currentUser.profileImage || currentUser.avatar}
                  alt={currentUser.name || 'User'}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff6b00', flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                  {(currentUser.name || 'Membro').substring(0, 2).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px', minWidth: 0 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  👋 Olá, {(currentUser.name || 'Membro').split(' ')[0]}
                </span>
                <Link
                  href={dashboardPath}
                  onClick={closeMenu}
                  style={{
                    background: '#ff6b00',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'block'
                  }}
                >
                  {dashboardLabel}
                </Link>
              </div>
            </div>
          )}

          <div className={styles.drawerSectionTitle}>🚀 Programas &amp; Soluções</div>
          <Link href="/incubacao" onClick={closeMenu}>🚀 {t.nav.incubator}</Link>
          <Link href="/marketplace" onClick={closeMenu}>💼 {t.nav.marketplace}</Link>
          <Link href="/oportunidades" onClick={closeMenu}>💰 Oportunidades &amp; Bolsas</Link>
          <Link href="/#cursos" onClick={closeMenu}>📚 Academia &amp; Cursos</Link>

          <div className={styles.drawerSectionTitle}>📰 Mídia &amp; Conteúdo</div>
          <Link href="/noticias" onClick={closeMenu}>📰 Notícias &amp; Atualidades</Link>
          <Link href="/eventos" onClick={closeMenu}>📅 Eventos &amp; Summits</Link>
          <Link href="/galeria" onClick={closeMenu}>🖼️ Galeria de Fotos</Link>
          <Link href="/#artigos" onClick={closeMenu}>📢 A Voz do Empreendedor</Link>

          <div className={styles.drawerSectionTitle}>🏛️ Sobre ABN</div>
          <Link href="/impacto" onClick={closeMenu}>🌟 {t.nav.impact}</Link>
          <Link href="/mensagem-do-presidente" onClick={closeMenu}>📜 Mensagem do Presidente</Link>
          <Link href="/equipa" onClick={closeMenu}>👥 Equipa Executiva</Link>
          <Link href="/especialistas" onClick={closeMenu}>👨‍🏫 Especialistas &amp; Mentores</Link>
          <Link href="/parceiros" onClick={closeMenu}>🤝 {t.nav.connections}</Link>

          <div className={styles.drawerSectionTitle}>
            📍 {language === 'pt' ? 'Delegações' : language === 'fr' ? 'Délégations' : 'Hubs'}
          </div>
          <div className={styles.drawerHubsList}>
            {hubs.length === 0 ? (
              <Link href="/country/quinebissau" onClick={closeMenu} className={styles.drawerHubLink}>
                Guiné-Bissau
              </Link>
            ) : (
              hubs.map(hub => (
                <Link key={hub.slug} href={`/country/${hub.slug}`} onClick={closeMenu} className={styles.drawerHubLink}>
                  {hub.name}
                </Link>
              ))
            )}
          </div>

          <Link href="/contacto" onClick={closeMenu} style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>📞 Contacto</Link>
        </nav>

        <div className={styles.drawerActions}>
          <LanguageSelector />
          {!currentUser && (
            <>
              <Link href="/login" className={styles.drawerLogin} onClick={closeMenu}>
                {t.nav.login}
              </Link>
              <Link href="/registro" className="btn-primary" onClick={closeMenu} style={{ textAlign: 'center' }}>
                {t.nav.join}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
