'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Briefcase, 
  Package, 
  Calendar, 
  Users, 
  ArrowRight, 
  ShoppingCart,
  Store,
  Video
} from 'lucide-react';
import ShopNavbar from '@/components/ShopNavbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import styles from './LojaModern.module.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: string;
  stock: number;
  productType?: 'digital' | 'physical' | 'service';
  digital?: boolean;
}

// 1. Categorias Oficiais da Loja
const STORE_CATEGORIES = [
  { id: 'Formações', name: 'Formações', icon: GraduationCap },
  { id: 'Serviços', name: 'Serviços', icon: Briefcase },
  { id: 'Produtos', name: 'Produtos', icon: Package },
  { id: 'Eventos', name: 'Eventos', icon: Calendar },
  { id: 'Programas ABN', name: 'Programas ABN', icon: Users },
];

// Destaques fixos/curados conforme imagem de referência
const DEFAULT_FEATURED = [
  {
    _id: 'default-1',
    tag: 'ABN Academia',
    name: 'Curso Empreendedor Profissional',
    subtitle: 'Online · 12 a 17 de Outubro',
    price: 2000,
    priceFormatted: '2.000 MT',
    category: 'Formações',
    bgClass: 'bgDark',
    icon: GraduationCap,
    actionText: 'Comprar',
    href: '/loja/checkout?item=curso-empreendedor'
  },
  {
    _id: 'default-2',
    tag: 'ABN',
    name: 'Adesão ao Clube dos Empreendedores',
    subtitle: 'Rede, mentoria e oportunidades',
    price: 0,
    priceFormatted: 'Adesão ABN',
    category: 'Programas ABN',
    bgClass: 'bgGreen',
    icon: Users,
    actionText: 'Aderir',
    href: '/registro?type=clube'
  },
  {
    _id: 'default-3',
    tag: 'ABN',
    name: 'ABN Business Leaders Connect',
    subtitle: 'Encontro online · 7 e 8 de Outubro',
    price: 0,
    priceFormatted: 'Inscrição',
    category: 'Eventos',
    bgClass: 'bgGold',
    icon: Video,
    actionText: 'Reservar',
    href: '/eventos'
  },
  {
    _id: 'default-4',
    tag: 'Empreendedor da Rede',
    name: 'Soluções & Produtos de Empreendedores',
    subtitle: 'Produtos e serviços de alta qualidade',
    price: 0,
    priceFormatted: 'Consultar',
    category: 'Produtos',
    bgClass: 'bgPlaceholder',
    isDashed: true,
    actionText: 'Comprar',
    href: '/marketplace'
  }
];

export default function Loja() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerUrl, setBannerUrl] = useState('/bannerlojaabn.png');

  useEffect(() => {
    // Buscar configurações (banner personalizado se houver)
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.loja) {
          setBannerUrl(data.configs.page_banners.loja);
        }
      })
      .catch(() => {});

    // Buscar produtos da API
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const scrollToCategories = () => {
    const el = document.getElementById('explore-categorias');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtragem dinâmica de produtos
  const dynamicFilteredProducts = products.filter(p => {
    const matchesCategory = !selectedCategory || 
      (p.category?.toLowerCase() || '').includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(p.category?.toLowerCase() || '');

    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className={styles.lojaPage}>
      {/* Menu Especial da Loja (Barra de busca, categorias, vender na ABN, entrar, carrinho) */}
      <ShopNavbar 
        onSearch={(term) => setSearchQuery(term)} 
        onSelectCategory={scrollToCategories}
      />

      {/* Hero com a Imagem de Fundo Oficial ABN e os dois Cards (Quero Comprar / Quero Vender) */}
      <section 
        className={styles.shopHero} 
        style={{ backgroundImage: `url('${bannerUrl}')` }}
      >
        <div className={styles.shopHeroOverlay}></div>
        
        <div className={styles.shopHeroContainer}>
          {/* Lado Esquerdo: Textos do Banner */}
          <div className={styles.shopHeroLeft}>
            <span className={styles.shopTag}>LOJA DIGITAL DA ABN</span>
            <h1 className={styles.shopHeading}>
              Bem-vindo à loja dos empreendedores.
            </h1>
            <p className={styles.shopSubheading}>
              Compre a quem faz negócio na rede ABN — ou abra a sua loja e venda a mais de 10 000 empreendedores.
            </p>
          </div>

          {/* Lado Direito: Cards de Ação */}
          <div className={styles.shopHeroCards}>
            {/* Card 1: Quero comprar */}
            <a href="#explore-categorias" className={`${styles.heroActionCard} ${styles.cardBuy}`}>
              <div className={styles.heroCardIconWrap}>
                <ShoppingCart size={24} />
              </div>
              <h3 className={styles.heroCardTitle}>Quero comprar</h3>
              <p className={styles.heroCardDesc}>
                Produtos, serviços e formações de empreendedores de confiança.
              </p>
              <span className={styles.heroCardLink}>
                Explorar a loja <ArrowRight size={15} />
              </span>
            </a>

            {/* Card 2: Quero vender */}
            <Link href="/registro?perfil=empreendedor" className={`${styles.heroActionCard} ${styles.cardSell}`}>
              <div className={styles.heroCardIconWrap}>
                <Store size={24} />
              </div>
              <h3 className={styles.heroCardTitle}>Quero vender</h3>
              <p className={styles.heroCardDesc}>
                Abra a sua loja em minutos e chegue a clientes em toda a rede ABN.
              </p>
              <span className={styles.heroCardLink}>
                Abrir a minha loja <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* 1. SEÇÃO EXPLORE POR CATEGORIA */}
        <section id="explore-categorias" className={styles.sectionCategory}>
          <h2 className={styles.sectionTitle}>Explore por categoria</h2>
          <div className={styles.categoryGrid}>
            {STORE_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`${styles.categoryCard} ${isActive ? styles.categoryCardActive : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div className={styles.categoryIconWrap}>
                    <Icon size={20} />
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. SEÇÃO EM DESTAQUE ESTA SEMANA */}
        <section className={styles.sectionFeatured}>
          <div className={styles.featuredHeader}>
            <h2 className={styles.sectionTitle}>
              {searchQuery 
                ? `Resultados para "${searchQuery}"`
                : selectedCategory 
                ? `Destaques em ${selectedCategory}` 
                : 'Em destaque esta semana'}
            </h2>
            <Link 
              href={selectedCategory ? `/marketplace?cat=${encodeURIComponent(selectedCategory)}` : '/marketplace'} 
              className={styles.seeAllLink}
            >
              Ver tudo <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.skeletonCard}></div>
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {/* Se houver produtos cadastrados na BD e categoria ou busca ativa */}
              {dynamicFilteredProducts.length > 0 ? (
                dynamicFilteredProducts.map((p) => (
                  <div key={p._id} className={styles.productCard}>
                    <div className={styles.cardTopBanner} style={{ background: '#f3f4f6' }}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} className={styles.cardTopImage} />
                      ) : (
                        <div className={styles.cardTopPlaceholder} style={{ color: '#476a52' }}>
                          <Package size={40} />
                        </div>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <span className={styles.cardTag}>{p.category || 'ABN'}</span>
                      <h3 className={styles.cardTitle}>{p.name}</h3>
                      <p className={styles.cardSubtitle}>{p.description}</p>

                      <div className={styles.cardFooter}>
                        <span className={styles.priceTag}>
                          {p.price > 0 ? `${p.price.toLocaleString()} MT` : 'Gratuito'}
                        </span>
                        <button
                          className={styles.btnAction}
                          onClick={() => router.push(`/loja/checkout?productId=${p._id}`)}
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (selectedCategory || searchQuery) ? (
                <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                  <Package size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>Nenhum item encontrado correspondente à pesquisa no momento.</p>
                </div>
              ) : (
                /* Cards padrão fiéis à referência */
                DEFAULT_FEATURED.map((item) => {
                  const TopIcon = item.icon;
                  const isBgClass = (styles as any)[item.bgClass] || '';
                  return (
                    <div 
                      key={item._id} 
                      className={`${styles.productCard} ${item.isDashed ? styles.dashedBorderCard : ''}`}
                    >
                      <div className={`${styles.cardTopBanner} ${isBgClass}`}>
                        {TopIcon ? (
                          <div className={styles.cardTopPlaceholder}>
                            <TopIcon size={44} />
                          </div>
                        ) : (
                          <span>[FOTO DO PRODUTO]</span>
                        )}
                      </div>

                      <div className={styles.cardBody}>
                        <span className={styles.cardTag}>{item.tag}</span>
                        <h3 className={styles.cardTitle}>{item.name}</h3>
                        <p className={styles.cardSubtitle}>{item.subtitle}</p>

                        <div className={styles.cardFooter}>
                          <span className={styles.priceTag}>{item.priceFormatted}</span>
                          <button
                            className={styles.btnAction}
                            onClick={() => router.push(item.href)}
                          >
                            {item.actionText}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>

        {/* 3. BANNER VENDER NA ABN */}
        <section className={styles.sellerSection}>
          <div className={styles.sellerBanner}>
            <div className={styles.sellerLeft}>
              <span className={styles.sellerTag}>VENDER NA ABN</span>
              <h2 className={styles.sellerHeading}>
                O seu negócio merece mais clientes.
              </h2>
              <Link href="/registro?perfil=empreendedor" className={styles.sellerBtn}>
                <Store size={18} />
                Abrir a minha loja
              </Link>
            </div>

            <div className={styles.sellerSteps}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <h4 className={styles.stepTitle}>Crie a sua conta</h4>
                <p className={styles.stepDesc}>
                  Registe-se com os dados do seu negócio e integre a comunidade.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <h4 className={styles.stepTitle}>Publique os produtos</h4>
                <p className={styles.stepDesc}>
                  Fotos, descrição e preço — e a sua loja fica imediatamente no ar.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <h4 className={styles.stepTitle}>Receba pedidos</h4>
                <p className={styles.stepDesc}>
                  Clientes de toda a rede ABN encontram, reservam e compram.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <FloatingWhatsApp />
    </main>
  );
}