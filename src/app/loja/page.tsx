'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Search, MapPin, Package, BookOpen, Wrench, Gem, Clock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import styles from './Loja.module.css';
import type { ReactNode } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: string;
  stock: number;
}

const categoryIcons: Record<string, ReactNode> = {
  'Tecnologia': <Search size={16} />,
  'Marketing': <Search size={16} />,
  'Consultoria': <Search size={16} />,
  'Formação': <Search size={16} />,
  'Serviços': <Search size={16} />,
  'Todos': <MapPin size={16} />,
};

export default function Loja() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [categories, setCategories] = useState<string[]>([]);
  const [shopEnabled, setShopEnabled] = useState(false);

  const [bannerUrl, setBannerUrl] = useState('/bannerlojaabn.png');

  useEffect(() => {
    // Check if shop is enabled
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.shop_enabled !== undefined) {
          setShopEnabled(data.configs.shop_enabled);
        }
        if (data.configs?.page_banners?.loja) {
          setBannerUrl(data.configs.page_banners.loja);
        }
      })
      .catch(() => {});

    // Fetch products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
          const cats = ['Todos', ...Array.from(new Set<string>(data.products.map((p: Product) => p.category)))];
          setCategories(cats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'Todos' ? products : products.filter(p => p.category === filter);

  if (!shopEnabled) {
    return (
      <main className={styles.loja}>
        <Navbar />
        
        <header className={styles.header} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(10, 10, 10, 0.95) 100%), url('${bannerUrl}')` }}>
          <div className={styles.container}>
            <span className={styles.tag}><ShoppingBag size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Loja ABN</span>
            <h1 className="text-gradient-gold">Em Breve</h1>
            <p>A loja ABN estará disponível em breve. Esteja atento!</p>
          </div>
        </header>

        <section className={styles.comingSoonSection}>
          <div className={styles.comingSoonCard}>
            <div className={styles.comingSoonIcon}>
              <ShoppingBag size={64} />
            </div>
            <div className={styles.comingSoonContent}>
              <span className={styles.comingSoonBadge}>EM BREVE</span>
              <h2 className={styles.comingSoonTitle}>Loja ABN</h2>
              <p className={styles.comingSoonDesc}>
                Estamos a preparar uma plataforma completa de produtos e serviços para empreendedores. 
                Produtos digitais, cursos, materiais de formação e muito mais.
              </p>
              <div className={styles.poweredBySection}>
                <span className={styles.poweredByLabel}>Powered By</span>
                <a href="https://www.wehosthere.com/" target="_blank" rel="noopener noreferrer" className={styles.wehosthereLink}>
                  <img src="/wehosthere.png" alt="Wehosthere" className={styles.wehosthereLogo} />
                  <span>Wehosthere</span>
                </a>
              </div>
              <div className={styles.comingSoonFeatures}>
                <div className={styles.feature}>
                  <Package size={24} />
                  <span>Produtos Digitais</span>
                </div>
                <div className={styles.feature}>
                  <BookOpen size={24} />
                  <span>Cursos e Formação</span>
                </div>
                <div className={styles.feature}>
                  <Wrench size={24} />
                  <span>Ferramentas Empresariais</span>
                </div>
                <div className={styles.feature}>
                  <Gem size={24} />
                  <span>Conteúdos Premium</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FloatingWhatsApp />
      </main>
    );
  }

  return (
    <main className={styles.loja}>
      <Navbar />

      <header className={styles.header} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(10, 10, 10, 0.95) 100%), url('${bannerUrl}')` }}>
        <div className={styles.container}>
          <span className={styles.tag}><ShoppingBag size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Loja ABN</span>
          <h1 className="text-gradient-gold">Produtos e Serviços</h1>
          <p>Encontre os melhores produtos para impulsionar o seu negócio.</p>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.filters}>
            {loading
              ? ['Todos', 'Tecnologia', 'Marketing'].map(c => (
                  <button key={c} className={`${styles.filterBtn} ${c === 'Todos' ? styles.active : ''}`}>{c}</button>
                ))
              : categories.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {categoryIcons[cat] || <MapPin size={16} />} {cat}
                  </button>
                ))
            }
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3, 4].map(i => <div key={i} className={styles.skeletonCard}></div>)}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <Search size={48} />
              <p>Nenhum produto encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((product, i) => (
                <div key={product._id} className={styles.card} style={{ animationDelay: `${i * 0.08}s` }}>
                  <Link href={`/loja/${product._id}`} className={styles.cardLink}>
                    <div className={styles.cardImage}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          {categoryIcons[product.category] || '📦'}
                        </div>
                      )}
                    </div>
                    <span className={styles.category}>{product.category}</span>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    <p className={styles.cardDesc}>{product.description}</p>
                  </Link>
                  <div className={styles.cardFooter}>
                    <div className={styles.priceBox}>
                      <span className={styles.priceLabel}>Preço</span>
                      <span className={styles.price}>{product.price.toLocaleString()} MT</span>
                    </div>
                    <button
                      className={`btn-primary ${styles.ctaBtn}`}
                      disabled={product.status !== 'ativo' || (product.productType === 'physical' && product.stock === 0)}
                      onClick={() => window.location.href = `/loja/checkout?productId=${product._id}`}
                    >
                      {product.status !== 'ativo' ? 'Indisponível' :
                       product.productType === 'physical' && product.stock === 0 ? 'Esgotado' :
                       'Comprar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FloatingWhatsApp />
    </main>
  );
}