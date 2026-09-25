'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart } from 'lucide-react';
import UserMenu from './UserMenu';
import styles from './ShopNavbar.module.css';

interface ShopNavbarProps {
  onSearch?: (term: string) => void;
  onSelectCategory?: () => void;
}

export default function ShopNavbar({ onSearch, onSelectCategory }: ShopNavbarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

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

        {/* Barra de Pesquisa Centralizada */}
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="O que procura hoje? Produtos, serviços, formações..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
        </form>

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
              setSearchTerm(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
        </form>
      </div>
    </header>
  );
}
