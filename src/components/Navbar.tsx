'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Globe } from 'lucide-react';
import styles from './Navbar.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { t, language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hubs, setHubs] = useState<Array<{ name: string; slug: string }>>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [shopEnabled, setShopEnabled] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Moçambique');

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

    // Fetch shop enabled status
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.shop_enabled !== undefined) {
          setShopEnabled(data.configs.shop_enabled);
        }
      })
      .catch(() => { });
  }, []);

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

  useEffect(() => {
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
  const dashboardLabel = currentUser?.role === 'admin' ? 'Painel Admin' : 'Ir para o Meu Painel';

  const countries = [
    { name: 'Moçambique', currency: 'MZN', flag: '🇲🇴' },
    { name: 'Angola', currency: 'AOA', flag: '🇦🇴' },
    { name: 'Guiné-Bissau', currency: 'XOF', flag: '🇬🇼' },
    { name: 'São Tomé e Príncipe', currency: 'STN', flag: '🇸🇹' },
    { name: 'Cabo Verde', currency: 'CVE', flag: '🇨🇻' }
  ];

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <img src="/abn-logo.png" alt="ABN Logo" className={styles.logoImg} />
            <div className={styles.brandText}>
              <span className={styles.abn}>ABN</span>
              <span className={styles.network}>AfroBiz Network</span>
            </div>
          </Link>

          <div className={styles.links}>
            <Link href="/">Início</Link>

            {/* Programas Dropdown */}
            <div className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                Programas <span className={styles.arrow}>▼</span>
              </span>
              <div className={styles.dropdownMenu}>
                <Link href="/programas/startup-180" onClick={closeMenu}>ABN Startup 180</Link>
                <Link href="/programas/clube-empreendedores" onClick={closeMenu}>Clube dos Empreendedores</Link>
                <Link href="/programas/clubes-startups-mocambique" onClick={closeMenu}>Clubes das Startups (Moçambique)</Link>
                <Link href="/programas/clubes-startups-angola" onClick={closeMenu}>Clubes das Startups (Angola)</Link>
                <Link href="/programas/mentalidade-empreendedora" onClick={closeMenu}>Mentalidade Empreendedora</Link>
              </div>
            </div>

            <Link href="/academia">Academia</Link>
            <Link href="/loja" onClick={closeMenu}><ShoppingBag size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Loja ABN</Link>
            <Link href="/especialistas">Especialistas</Link>
            <Link href="/parceiros">Parceiros</Link>

            {/* Representações Dropdown */}
            <div className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                Representações <span className={styles.arrow}>▼</span>
              </span>
              <div className={styles.dropdownMenu}>
                {hubs.length === 0 ? (
                  <>
                    <Link href="/country/quinebissau" onClick={closeMenu}>Guiné-Bissau</Link>
                    <Link href="/country/angola" onClick={closeMenu}>Angola</Link>
                    <Link href="/country/saotome" onClick={closeMenu}>São Tomé e Príncipe</Link>
                    <Link href="/country/caboverde" onClick={closeMenu}>Cabo Verde</Link>
                  </>
                ) : (
                  hubs.map(hub => (
                    <Link key={hub.slug} href={`/country/${hub.slug}`} onClick={closeMenu}>
                      {hub.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link href="/impacto">Impacto</Link>

            {/* Sobre Dropdown */}
            <div className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                Sobre <span className={styles.arrow}>▼</span>
              </span>
              <div className={styles.dropdownMenu}>
                <Link href="/#missao" onClick={closeMenu}>Quem Somos</Link>
                <Link href="/mensagem-do-presidente" onClick={closeMenu}>Mensagem do Presidente</Link>
                <Link href="/equipa" onClick={closeMenu}>Equipa</Link>
                <Link href="/noticias" onClick={closeMenu}>Notícias</Link>
                <Link href="/galeria" onClick={closeMenu}>Galeria</Link>
              </div>
            </div>

            <Link href="/contacto">Contacto</Link>
          </div>

          <div className={styles.actions}>
            {/* Currency Selector */}
            <div className={styles.currencySelector}>
              <select 
                value={selectedCountry} 
                onChange={(e) => setSelectedCountry(e.target.value)}
                className={styles.currencySelect}
              >
                {countries.map(country => (
                  <option key={country.name} value={country.name}>
                    {country.flag} {country.currency}
                  </option>
                ))}
              </select>
            </div>

            <LanguageSelector />

            {/* Botões fixos */}
            <Link href="/programas/clube-empreendedores" className={styles.btnClub}>
              Aderir ao Clube
            </Link>

            {currentUser ? (
              <UserMenu />
            ) : (
              <Link href="/login" className={styles.btnLogin}>Entrar</Link>
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
            <img src="/abn-logo.png" alt="ABN Logo" className={styles.logoImg} />
            <span className={styles.abn}>ABN</span>
          </Link>
          <button className={styles.closeBtn} onClick={closeMenu} aria-label="Fechar menu">✕</button>
        </div>

        <nav className={styles.drawerNav}>
          {currentUser && (
            <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '12px 14px', borderRadius: '12px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={currentUser.profileImage || currentUser.avatar || '/abn-logo.png'}
                alt={currentUser.name || 'User'}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff6b00', flexShrink: 0 }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/abn-logo.png';
                  (e.currentTarget as HTMLImageElement).style.objectFit = 'contain';
                  (e.currentTarget as HTMLImageElement).style.padding = '4px';
                  (e.currentTarget as HTMLImageElement).style.background = '#fff7ed';
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px', minWidth: 0 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Olá, {(currentUser.name || 'Membro').split(' ')[0]}
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

          <Link href="/" onClick={closeMenu}>Início</Link>

          <div className={styles.drawerSectionTitle}>Programas</div>
          <Link href="/programas/startup-180" onClick={closeMenu}>ABN Startup 180</Link>
          <Link href="/programas/clube-empreendedores" onClick={closeMenu}>Clube dos Empreendedores</Link>
          <Link href="/programas/clubes-startups-mocambique" onClick={closeMenu}>Clubes das Startups (Moçambique)</Link>
          <Link href="/programas/clubes-startups-angola" onClick={closeMenu}>Clubes das Startups (Angola)</Link>
          <Link href="/programas/mentalidade-empreendedora" onClick={closeMenu}>Mentalidade Empreendedora</Link>

          <Link href="/academia" onClick={closeMenu}>Academia</Link>
          <Link href="/loja" onClick={closeMenu}><ShoppingBag size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Loja ABN</Link>
          <Link href="/especialistas" onClick={closeMenu}>Especialistas</Link>
          <Link href="/parceiros" onClick={closeMenu}>Parceiros</Link>

          <div className={styles.drawerSectionTitle}>Representações</div>
          {hubs.length === 0 ? (
            <>
              <Link href="/country/quinebissau" onClick={closeMenu} className={styles.drawerHubLink}>Guiné-Bissau</Link>
              <Link href="/country/angola" onClick={closeMenu} className={styles.drawerHubLink}>Angola</Link>
              <Link href="/country/saotome" onClick={closeMenu} className={styles.drawerHubLink}>São Tomé e Príncipe</Link>
              <Link href="/country/caboverde" onClick={closeMenu} className={styles.drawerHubLink}>Cabo Verde</Link>
            </>
          ) : (
            hubs.map(hub => (
              <Link key={hub.slug} href={`/country/${hub.slug}`} onClick={closeMenu} className={styles.drawerHubLink}>
                {hub.name}
              </Link>
            ))
          )}

          <Link href="/impacto" onClick={closeMenu}>Impacto</Link>

          <div className={styles.drawerSectionTitle}>Sobre</div>
          <Link href="/#missao" onClick={closeMenu}>Quem Somos</Link>
          <Link href="/mensagem-do-presidente" onClick={closeMenu}>Mensagem do Presidente</Link>
          <Link href="/equipa" onClick={closeMenu}>Equipa</Link>
          <Link href="/noticias" onClick={closeMenu}>Notícias</Link>
          <Link href="/galeria" onClick={closeMenu}>Galeria</Link>

          <Link href="/contacto" onClick={closeMenu} style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>Contacto</Link>
        </nav>

        <div className={styles.drawerActions}>
          <LanguageSelector />
          {!currentUser && (
            <Link href="/login" className={styles.drawerLogin} onClick={closeMenu}>
              Entrar
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
