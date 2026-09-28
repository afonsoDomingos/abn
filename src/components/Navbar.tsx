'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Globe } from 'lucide-react';
import styles from './Navbar.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { t, language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [shopEnabled, setShopEnabled] = useState(false);
  
  // Scroll functionality
  const linksRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = linksRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  useEffect(() => {
    const container = linksRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkScrollability();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      checkScrollability();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (linksRef.current) {
      e.preventDefault();
      linksRef.current.scrollLeft += e.deltaY;
    }
  };

  // Check user session on mount
  useEffect(() => {
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

          <div 
            ref={linksRef}
            className={`${styles.links} ${canScrollLeft ? styles.canScrollLeft : ''} ${canScrollRight ? styles.canScrollRight : ''}`}
            onWheel={handleWheel}
          >
            <Link href="/">Início</Link>

            {/* Programas Dropdown */}
            <div className={styles.dropdown}>
              <Link href="/programas" className={styles.dropdownTrigger} onClick={closeMenu}>
                Programas <span className={styles.arrow}>▼</span>
              </Link>
              <div className={styles.dropdownMenu}>
                <Link href="/programas/startup-180" onClick={closeMenu}>ABN Startup 180</Link>
                <Link href="/clube-empreendedores" onClick={closeMenu}>Clube dos Empreendedores</Link>
                <Link href="/programas/clubes-startups-mocambique" onClick={closeMenu}>Clubes das Startups (Moçambique)</Link>
                <Link href="/programas/clubes-startups-angola" onClick={closeMenu}>Clubes das Startups (Angola)</Link>
                <Link href="/programas/mentalidade-empreendedora" onClick={closeMenu}>Mentalidade Empreendedora</Link>
              </div>
            </div>

            <Link href="/academia">Academia</Link>
            <Link href="/loja" onClick={closeMenu}><ShoppingBag size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Loja ABN</Link>
            <Link href="/especialistas">Especialistas</Link>

            {/* Parceiros Dropdown */}
            <div className={styles.dropdown}>
              <Link href="/parceiros" className={styles.dropdownTrigger} onClick={closeMenu}>
                Parceiros <span className={styles.arrow}>▼</span>
              </Link>
              <div className={styles.dropdownMenu}>
                <Link href="/parceiros" onClick={closeMenu}>Ver Parceiros</Link>
                <Link href="/seja-parceiro" onClick={closeMenu}>Seja Parceiro</Link>
              </div>
            </div>

            {/* Representações Dropdown */}
            <div className={styles.dropdown}>
              <Link href="/representacoes" className={styles.dropdownTrigger} onClick={closeMenu}>
                Representações <span className={styles.arrow}>▼</span>
              </Link>
              <div className={styles.dropdownMenu}>
                <Link href="/representacoes" onClick={closeMenu}>Ver Todas as Representações</Link>
                <div className={styles.divider}></div>
                <Link href="/country/mocambique" onClick={closeMenu}>Moçambique (Sede)</Link>
                <Link href="/country/angola" onClick={closeMenu}>Angola</Link>
                <Link href="/country/guinebissau" onClick={closeMenu}>Guiné-Bissau</Link>
                <Link href="/country/saotome" onClick={closeMenu}>São Tomé e Príncipe</Link>
                <Link href="/country/caboverde" onClick={closeMenu}>Cabo Verde</Link>
              </div>
            </div>

            <Link href="/impacto">Impacto</Link>

            {/* Sobre Dropdown */}
            <div className={styles.dropdown}>
              <Link href="/#missao" className={styles.dropdownTrigger} onClick={closeMenu}>
                Sobre <span className={styles.arrow}>▼</span>
              </Link>
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
          <button className={styles.closeBtn} onClick={closeMenu} aria-label="Fechar menu"></button>
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
          <Link href="/programas" onClick={closeMenu}>Ver Todos os Programas</Link>
          <Link href="/programas/startup-180" onClick={closeMenu}>ABN Startup 180</Link>
          <Link href="/clube-empreendedores" onClick={closeMenu}>Clube dos Empreendedores</Link>
          <Link href="/programas/clubes-startups-mocambique" onClick={closeMenu}>Clubes das Startups (Moçambique)</Link>
          <Link href="/programas/clubes-startups-angola" onClick={closeMenu}>Clubes das Startups (Angola)</Link>
          <Link href="/programas/mentalidade-empreendedora" onClick={closeMenu}>Mentalidade Empreendedora</Link>

          <Link href="/academia" onClick={closeMenu}>Academia</Link>
          <Link href="/loja" onClick={closeMenu}><ShoppingBag size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Loja ABN</Link>
          <Link href="/especialistas" onClick={closeMenu}>Especialistas</Link>

          <div className={styles.drawerSectionTitle}>Parceiros</div>
          <Link href="/parceiros" onClick={closeMenu}>Ver Parceiros</Link>
          <Link href="/seja-parceiro" onClick={closeMenu}>Seja Parceiro</Link>

          <div className={styles.drawerSectionTitle}>Representações</div>
          <Link href="/representacoes" onClick={closeMenu}>Ver Todas as Representações</Link>
          <Link href="/country/mocambique" onClick={closeMenu} className={styles.drawerHubLink}>Moçambique (Sede)</Link>
          <Link href="/country/angola" onClick={closeMenu} className={styles.drawerHubLink}>Angola</Link>
          <Link href="/country/guinebissau" onClick={closeMenu} className={styles.drawerHubLink}>Guiné-Bissau</Link>
          <Link href="/country/saotome" onClick={closeMenu} className={styles.drawerHubLink}>São Tomé e Príncipe</Link>
          <Link href="/country/caboverde" onClick={closeMenu} className={styles.drawerHubLink}>Cabo Verde</Link>

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
