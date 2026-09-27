'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart } from 'lucide-react';
import UserMenu from './UserMenu';
import styles from './ShopNavbar.module.css';

interface ShopNavbarProps {
  onSearch?: (term: string) => void;
  onSelectCategory?: (categoryName?: string) => void;
}

const QUICK_SUGGESTIONS = [
  { name: 'Curso Empreendedor Profissional', category: 'Formações', href: '/loja?q=curso' },
  { name: 'Gestão Financeira para PMEs', category: 'Formações', href: '/loja?q=gestão' },
  { name: 'Consultoria Estratégica ABN', category: 'Serviços', href: '/loja?q=consultoria' },
  { name: 'Assessoria Jurídica e Legal', category: 'Serviços', href: '/loja?q=jurídico' },
  { name: 'Produtos e Soluções da Rede', category: 'Produtos', href: '/loja?q=produtos' },
  { name: 'Kit Empreendedor ABN', category: 'Produtos', href: '/loja?q=kit' },
  { name: 'ABN Business Leaders Connect', category: 'Eventos', href: '/loja?q=leaders' },
  { name: 'Summit Anual ABN Maputo', category: 'Eventos', href: '/loja?q=summit' },
  { name: 'Clube dos Empreendedores', category: 'Programas ABN', href: '/loja?q=clube' },
  { name: 'Programa de Incubação', category: 'Programas ABN', href: '/loja?q=incubação' },
];

const SEARCH_CATEGORIES = ['Formações', 'Serviços', 'Produtos', 'Eventos', 'Programas ABN'];

export default function ShopNavbar({ onSearch, onSelectCategory }: ShopNavbarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  const updateCartCount = () => {
    try {
      const stored = localStorage.getItem('abn_cart');
      if (stored) {
        const items = JSON.parse(stored);
        setCartCount(Array.isArray(items) ? items.length : 0);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Sync initial search query from URL if available
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setSearchTerm(q);
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      })
      .catch(() => {});

    updateCartCount();

    const handleStorage = () => updateCartCount();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('cart-updated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cart-updated', handleStorage);
    };
  }, []);

  const executeSearch = (term: string) => {
    setIsOpenPreview(false);
    if (onSearch) {
      onSearch(term);
      // Smooth scroll to products results section
      const el = document.getElementById('produtos-lista') || document.getElementById('explore-categorias');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push(`/loja?q=${encodeURIComponent(term)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsOpenPreview(false);
    if (onSearch) onSearch('');
  };

  // Filter preview suggestions
  const matchingSuggestions = searchTerm.trim().length >= 1
    ? QUICK_SUGGESTIONS.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <header className={styles.shopNavbar}>
      <div className={styles.container}>
        {/* Logo ABN */}
        <Link href="/" className={styles.logo}>
          <img src="/abn-logo.png" alt="ABN" className={styles.logoImg} />
          <div className={styles.brandText}>
            <span className={styles.abnTitle}>ABN</span>
            <span className={styles.abnSubtitle}>AfroBiz Network</span>
          </div>
        </Link>

        {/* Barra de Pesquisa Centralizada com Live Preview */}
        <div className={styles.searchWrapper}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="O que procura hoje? Produtos, serviços, formações..."
              value={searchTerm}
              onFocus={() => {
                if (searchTerm.trim().length >= 1) setIsOpenPreview(true);
              }}
              onChange={(e) => {
                const val = e.target.value;
                setSearchTerm(val);
                setIsOpenPreview(val.trim().length >= 1);
                if (onSearch) onSearch(val);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpenPreview(false);
              }}
            />
            {searchTerm && (
              <button 
                type="button" 
                onClick={handleClear} 
                className={styles.clearBtn} 
                title="Limpar pesquisa"
                aria-label="Limpar pesquisa"
              >
                ✕
              </button>
            )}
            <button type="submit" className={styles.searchSubmitBtn} title="Pesquisar">
              Pesquisar
            </button>
          </form>

          {/* Dropdown Live Preview de Pesquisa */}
          {isOpenPreview && (
            <>
              <div className={styles.backdrop} onClick={() => setIsOpenPreview(false)} />
              <div className={styles.searchDropdown}>
                {matchingSuggestions.length > 0 ? (
                  <div className={styles.dropdownSection}>
                    <div className={styles.dropdownHeader}>
                      Sugestões correspondentes
                    </div>
                    {matchingSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setSearchTerm(item.name);
                          executeSearch(item.name);
                        }}
                      >
                        <Search size={14} className={styles.itemSearchIcon} />
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemCategory}>{item.category}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.dropdownEmpty}>
                    Pressione <strong>Enter</strong> para ver todos os resultados para "{searchTerm}"
                  </div>
                )}

                {/* Filtro rápido por categorias */}
                <div className={styles.dropdownCategories}>
                  <span className={styles.catLabel}>Categorias Rápidas:</span>
                  <div className={styles.catPills}>
                    {SEARCH_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={styles.catPill}
                        onClick={() => {
                          setSearchTerm(cat);
                          executeSearch(cat);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div 
                  className={styles.dropdownFooter}
                  onClick={() => executeSearch(searchTerm)}
                >
                  <span>Ver todos os resultados na loja</span>
                  <span>→</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Links da Direita */}
        <nav className={styles.navRight}>
          <button 
            type="button" 
            className={styles.navLink}
            onClick={() => {
              if (onSelectCategory) {
                onSelectCategory();
              } else {
                const el = document.getElementById('explore-categorias');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Categorias
          </button>

          <Link href="/loja/vender" className={`${styles.navLink} ${styles.sellerLink}`}>
            Vender na ABN
          </Link>

          {currentUser ? (
            <UserMenu />
          ) : (
            <Link href="/login" className={styles.navLink}>
              Entrar
            </Link>
          )}

          <Link href="/loja/checkout" className={styles.cartBtn} title="Carrinho">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount > 9 ? '9+' : cartCount}</span>
            )}
          </Link>
        </nav>
      </div>

      {/* Barra de pesquisa mobile */}
      <div className={styles.mobileSearchRow}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="O que procura hoje? Produtos, serviços..."
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              if (onSearch) onSearch(val);
            }}
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={handleClear} 
              className={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </form>
      </div>
    </header>
  );
}
