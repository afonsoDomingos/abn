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
  ShoppingBag, 
  Video, 
  Store,
  Layers
} from 'lucide-react';
import Navbar from '@/components/Navbar';
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

// 1. Categorias Oficiais da Loja (conforme imagem)
const STORE_CATEGORIES = [
  { id: 'Formações', name: 'Formações', icon: GraduationCap },
  { id: 'Serviços', name: 'Serviços', icon: Briefcase },
  { id: 'Produtos', name: 'Produtos', icon: Package },
  { id: 'Eventos', name: 'Eventos', icon: Calendar },
  { id: 'Programas ABN', name: 'Programas ABN', icon: Users },
];

// Destaques fixos/curados conforme imagem caso a base de dados ainda esteja inicial
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

  useEffect(() => {
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
      setSelectedCategory(null); // Desmarca para ver todos
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // Filtragem dinâmica de produtos do banco de dados
  const dynamicFilteredProducts = selectedCategory
    ? products.filter(p => {
        const cat = p.category?.toLowerCase() || '';
        const selected = selectedCategory.toLowerCase();
        return cat.includes(selected) || selected.includes(cat);
      })
    : products;

  return (
    <main className={styles.lojaPage}>
      <Navbar />

      {/* Hero Header Limpo */}
      <header className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <ShoppingBag size={15} />
            <span>Loja & Ecossistema ABN</span>
          </div>
          <h1 className={styles.heroTitle}>Explore e Conecte-se</h1>
          <p className={styles.heroSub}>
            Encontre formações certificadas, serviços empresariais e produtos criados pela rede de empreendedores ABN.
          </p>
        </div>
      </header>

      <div className={styles.container}>
        {/* 1. SEÇÃO EXPLORE POR CATEGORIA */}
        <section className={styles.sectionCategory}>
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
              {selectedCategory ? `Destaques em ${selectedCategory}` : 'Em destaque esta semana'}
            </h2>
            <Link href={selectedCategory ? `/marketplace?cat=${encodeURIComponent(selectedCategory)}` : '/marketplace'} className={styles.seeAllLink}>
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
              {/* Se houver produtos cadastrados na BD e categoria ativa, exibe os do BD */}
              {dynamicFilteredProducts.length > 0 ? (
                dynamicFilteredProducts.map((p, idx) => (
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
              ) : selectedCategory ? (
                <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                  <Package size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>Nenhum item encontrado nesta categoria no momento.</p>
                </div>
              ) : (
                /* Cards padrão de referência fiel à imagem */
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