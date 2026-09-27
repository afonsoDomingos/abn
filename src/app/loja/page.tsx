'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  GraduationCap, 
  Briefcase, 
  Package, 
  Calendar, 
  Users, 
  ArrowRight, 
  ShoppingCart,
  Store,
  Video,
  ExternalLink
} from 'lucide-react';
import ShopNavbar from '@/components/ShopNavbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import TermsModal from '@/components/TermsModal';
import styles from './LojaModern.module.css';

interface ProductItem {
  _id: string;
  name: string;
  description: string;
  price: number | string;
  priceFormatted?: string;
  category: string;
  image?: string;
  tag?: string;
  actionText?: string;
  actionHref?: string;
  icon?: any;
  bgClass?: string;
  isDashed?: boolean;
}

// 1. Categorias Oficiais da Loja (5 categorias conforme o design)
const STORE_CATEGORIES = [
  { id: 'Formações', name: 'Formações', icon: GraduationCap },
  { id: 'Serviços', name: 'Serviços', icon: Briefcase },
  { id: 'Produtos', name: 'Produtos', icon: Package },
  { id: 'Eventos', name: 'Eventos', icon: Calendar },
  { id: 'Programas ABN', name: 'Programas ABN', icon: Users },
];

// Países disponíveis para filtro
const STORE_COUNTRIES = [
  { id: 'Todos', name: 'Todos os Países', flag: '' },
  { id: 'Moçambique', name: 'Moçambique', flag: '🇲🇴' },
  { id: 'Angola', name: 'Angola', flag: '🇦🇴' },
  { id: 'Guiné-Bissau', name: 'Guiné-Bissau', flag: '🇬🇼' },
  { id: 'São Tomé e Príncipe', name: 'São Tomé e Príncipe', flag: '🇸🇹' },
  { id: 'Cabo Verde', name: 'Cabo Verde', flag: '🇨🇻' },
];

// Destaques oficiais de referência exibidos quando nenhuma categoria estiver selecionada
const DEFAULT_FEATURED: ProductItem[] = [
  {
    _id: 'default-1',
    tag: 'ABN Academia',
    name: 'Curso Empreendedor Profissional',
    description: 'Online · 12 a 17 de Outubro com certificação executiva da rede ABN.',
    price: 2000,
    priceFormatted: '2.000 MT',
    category: 'Formações',
    bgClass: 'bgDark',
    icon: GraduationCap,
    actionText: 'Comprar',
    actionHref: '/loja/checkout?item=curso-empreendedor'
  },
  {
    _id: 'default-2',
    tag: 'ABN',
    name: 'Adesão ao Clube dos Empreendedores',
    description: 'Rede exclusiva, mentoria e oportunidades de negócios por toda África.',
    price: 'Adesão',
    priceFormatted: 'Adesão ABN',
    category: 'Programas ABN',
    bgClass: 'bgGreen',
    icon: Users,
    actionText: 'Aderir',
    actionHref: '/registro?type=clube'
  },
  {
    _id: 'default-3',
    tag: 'ABN',
    name: 'ABN Business Leaders Connect',
    description: 'Encontro executivo online de líderes e fundadores · 7 e 8 de Outubro.',
    price: 'Inscrição',
    priceFormatted: 'Inscrição',
    category: 'Eventos',
    bgClass: 'bgGold',
    icon: Video,
    actionText: 'Reservar',
    actionHref: '/eventos'
  },
  {
    _id: 'default-4',
    tag: 'Empreendedor da Rede',
    name: 'Produtos e Soluções dos Empreendedores',
    description: 'Catálogo de produtos físicos e digitais produzidos pelos membros ABN.',
    price: 'Consultar',
    priceFormatted: 'Consultar',
    category: 'Produtos',
    bgClass: 'bgPlaceholder',
    isDashed: true,
    actionText: 'Comprar',
    actionHref: '/marketplace'
  }
];

export default function Loja() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [courses, setCourses] = useState<ProductItem[]>([]);
  const [services, setServices] = useState<ProductItem[]>([]);
  const [events, setEvents] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    // Initialise from ?q= URL param (server-side safe fallback: '')
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('q') || '';
    }
    return '';
  });
  const [bannerUrl, setBannerUrl] = useState('/bannerlojaabn.png');
  
  // Terms acceptance
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Buscar configurações (banner)
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.loja) {
          setBannerUrl(data.configs.page_banners.loja);
        }
      })
      .catch(() => {});

    // Verificar se o utilizador está logado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    // Verificar aceitação de termos
    const checkTermsAcceptance = async () => {
      try {
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user && user._id) {
          const response = await fetch('/api/user/loja-terms', {
            headers: {
              'x-user-id': user._id
            }
          });
          const data = await response.json();
          if (data.userFound) {
            setTermsAccepted(data.accepted);
            // Não abrir modal automaticamente - apenas guardar estado
          }
        }
      } catch (e) {
        console.error('Erro ao verificar aceitação de termos:', e);
      }
    };

    checkTermsAcceptance();

    // Carregar em paralelo: Produtos, Cursos, Serviços e Eventos da plataforma
    Promise.all([
      fetch('/api/products').then(res => res.json()).catch(() => ({ products: [] })),
      fetch('/api/courses').then(res => res.json()).catch(() => ({ courses: [] })),
      fetch('/api/services').then(res => res.json()).catch(() => ({ services: [] })),
      fetch('/api/events').then(res => res.json()).catch(() => ({ events: [] }))
    ]).then(([prodData, coursesData, servData, eventsData]) => {
      // 1. Produtos do catálogo
      if (prodData.products && Array.isArray(prodData.products)) {
        setProducts(prodData.products.map((p: any) => ({
          _id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          priceFormatted: p.price > 0 ? `${Number(p.price).toLocaleString()} MT` : 'Gratuito',
          category: p.category || 'Produtos',
          image: p.image,
          tag: 'Loja ABN',
          actionText: 'Comprar',
          actionHref: `/loja/checkout?productId=${p._id}`
        })));
      }

      // 2. Cursos / Formações da ABN Academia
      if (coursesData.courses && Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses.map((c: any) => ({
          _id: c._id,
          name: c.title,
          description: c.desc || `${c.lessons || 1} aulas · ${c.duration || 'Flexível'}`,
          price: c.price || 'Gratuito',
          priceFormatted: typeof c.price === 'number' ? `${c.price.toLocaleString()} MT` : c.price,
          category: 'Formações',
          image: c.image,
          tag: 'ABN Academia',
          actionText: 'Ver Formação',
          actionHref: `/#cursos`
        })));
      }

      // 3. Serviços de Especialistas / Consultoria
      if (servData.services && Array.isArray(servData.services)) {
        setServices(servData.services.map((s: any) => ({
          _id: s._id,
          name: s.name,
          description: s.description,
          price: s.price || 'Sob Consulta',
          priceFormatted: s.price || 'Sob Consulta',
          category: 'Serviços',
          image: s.consultantAvatar,
          tag: s.consultantName || 'Especialista ABN',
          actionText: 'Contratar',
          actionHref: `/loja`
        })));
      }

      // 4. Eventos e Summits
      if (eventsData.events && Array.isArray(eventsData.events)) {
        setEvents(eventsData.events.map((e: any) => ({
          _id: e._id,
          name: e.title,
          description: `${e.location || 'Online'} · ${e.date || ''}`,
          price: 'Inscrição',
          priceFormatted: 'Aberto',
          category: 'Eventos',
          image: e.imageUrl,
          tag: e.category || 'Evento ABN',
          actionText: 'Reservar',
          actionHref: `/eventos`
        })));
      }

      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Desmarcar para ver destaques gerais
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleCountryClick = (countryId: string) => {
    if (selectedCountry === countryId) {
      setSelectedCountry(null); // Desmarcar para ver todos
    } else {
      setSelectedCountry(countryId);
    }
  };

  const scrollToCategories = () => {
    const el = document.getElementById('explore-categorias');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAcceptTerms = async () => {
    try {
      const user = currentUser;
      if (user && user._id) {
        const response = await fetch('/api/user/loja-terms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user._id
          },
          body: JSON.stringify({
            accepted: true,
            version: '1.0'
          })
        });
        const data = await response.json();
        if (data.success) {
          setTermsAccepted(true);
          setTermsModalOpen(false);
        }
      }
    } catch (e) {
      console.error('Erro ao aceitar termos:', e);
    }
  };

  const handleActionClick = (item: ProductItem) => {
    // Adicionar item ao carrinho no localStorage
    try {
      const stored = localStorage.getItem('abn_cart');
      let cart: any[] = stored ? JSON.parse(stored) : [];
      const exists = cart.some((i: any) => i._id === item._id);
      if (!exists) {
        cart.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
          image: item.image || ''
        });
        localStorage.setItem('abn_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch {}

    if (item.actionHref) {
      router.push(item.actionHref);
    } else {
      router.push(`/loja/checkout?productId=${item._id}`);
    }
  };

  // Coleta unificada de todos os itens do ecossistema
  const allItems: ProductItem[] = [
    ...products,
    ...courses,
    ...services,
    ...events,
    {
      _id: 'clube-membro',
      name: 'Adesão ao Clube dos Empreendedores',
      description: 'Acesso prioritário a rodadas de negócios, mentoria e networking internacional.',
      price: 'Adesão ABN',
      priceFormatted: 'Adesão ABN',
      category: 'Programas ABN',
      tag: 'ABN',
      actionText: 'Aderir',
      actionHref: '/registro?type=clube'
    },
    {
      _id: 'programa-incubacao',
      name: 'Programa de Incubação & Aceleração',
      description: 'Apoio técnico, espaço e captação de investimento para a sua empresa ou startup.',
      price: 'Candidatura',
      priceFormatted: 'Inscrições Abertas',
      category: 'Programas ABN',
      tag: 'ABN Incubadora',
      actionText: 'Candidatar',
      actionHref: '/incubacao'
    }
  ];

  // FILTRAGEM INTELIGENTE
  const filteredItems = allItems.filter(item => {
    // 1. Filtro por Categoria
    let matchesCat = true;
    if (selectedCategory) {
      const catLower = (item.category || '').toLowerCase();
      const selLower = selectedCategory.toLowerCase();

      if (selectedCategory === 'Formações') {
        matchesCat = catLower.includes('form') || catLower.includes('curso') || catLower.includes('academ');
      } else if (selectedCategory === 'Serviços') {
        matchesCat = catLower.includes('serv') || catLower.includes('consult') || catLower.includes('market') || catLower.includes('design') || catLower.includes('contab');
      } else if (selectedCategory === 'Produtos') {
        matchesCat = catLower.includes('prod') || catLower.includes('loja') || catLower.includes('físic') || catLower.includes('digit');
      } else if (selectedCategory === 'Eventos') {
        matchesCat = catLower.includes('event') || catLower.includes('summit') || catLower.includes('confer');
      } else if (selectedCategory === 'Programas ABN') {
        matchesCat = catLower.includes('program') || catLower.includes('clube') || catLower.includes('incub');
      } else {
        matchesCat = catLower.includes(selLower);
      }
    }

    // 2. Filtro por País (só para itens que têm sellerCountry)
    let matchesCountry = true;
    if (selectedCountry && selectedCountry !== 'Todos') {
      const itemCountry = (item as any).sellerCountry || 'Moçambique';
      matchesCountry = itemCountry === selectedCountry;
    }

    // 3. Filtro por Barra de Pesquisa
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      matchesSearch = (item.name || '').toLowerCase().includes(query) ||
                      (item.description || '').toLowerCase().includes(query) ||
                      (item.category || '').toLowerCase().includes(query) ||
                      (item.tag || '').toLowerCase().includes(query);
    }

    return matchesCat && matchesCountry && matchesSearch;
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
            <Link href="/loja/vender" className={`${styles.heroActionCard} ${styles.cardSell}`}>
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
                  title={`Filtrar por ${cat.name}`}
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

        {/* 1.5 SEÇÃO FILTRO POR PAÍS */}
        <section className={styles.sectionCountry}>
          <h2 className={styles.sectionTitle}>Filtrar por país do vendedor</h2>
          <div className={styles.countryGrid}>
            {STORE_COUNTRIES.map(country => {
              const isActive = selectedCountry === country.id;
              return (
                <button
                  key={country.id}
                  className={`${styles.countryCard} ${isActive ? styles.countryCardActive : ''}`}
                  onClick={() => handleCountryClick(country.id)}
                  title={`Filtrar por ${country.name}`}
                >
                  <span className={styles.countryFlag}>{country.flag}</span>
                  <span className={styles.countryName}>{country.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. SEÇÃO EM DESTAQUE ESTA SEMANA */}
        <section id="produtos-lista" className={styles.sectionFeatured}>
          <div className={styles.featuredHeader}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h2 className={styles.sectionTitle}>
                {searchQuery 
                  ? `Resultados para "${searchQuery}" (${filteredItems.length})`
                  : selectedCategory 
                  ? `Explorando: ${selectedCategory} (${filteredItems.length})` 
                  : 'Em destaque esta semana'}
              </h2>
              {(searchQuery || selectedCategory || selectedCountry) && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => { setSearchQuery(''); setSelectedCategory(null); setSelectedCountry(null); }}
                >
                   Limpar filtro
                </button>
              )}
            </div>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              className={styles.seeAllLink}
            >
              Ver tudo <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.skeletonCard}></div>
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {/* Se o usuário selecionou uma categoria OU digitou na busca */}
              {(selectedCategory || searchQuery.trim()) ? (
                filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item._id} className={styles.productCard}>
                      <div className={styles.cardTopBanner} style={{ background: '#f3f4f6' }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className={styles.cardTopImage} />
                        ) : (
                          <div className={styles.cardTopPlaceholder} style={{ color: '#476a52' }}>
                            <Package size={40} />
                          </div>
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        <span className={styles.cardTag}>{item.tag || item.category}</span>
                        <h3 className={styles.cardTitle}>{item.name}</h3>
                        <p className={styles.cardSubtitle}>{item.description}</p>

                        <div className={styles.cardFooter}>
                          <span className={styles.priceTag}>{item.priceFormatted}</span>
                          <button
                            className={styles.btnAction}
                            onClick={() => handleActionClick(item)}
                          >
                            {item.actionText || 'Comprar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                    <Package size={42} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#111827' }}>
                      Nenhum item encontrado
                    </h3>
                    <p>Não encontramos nenhum item correspondente na categoria selecionada.</p>
                  </div>
                )
              ) : (
                /* Estado Inicial de Destaques da Semana */
                DEFAULT_FEATURED.map((item) => {
                  const TopIcon = item.icon;
                  const isBgClass = (styles as any)[item.bgClass || ''] || '';
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
                          <div className={styles.cardTopPlaceholder} style={{ color: '#476a52' }}>
                            <Package size={40} />
                          </div>
                        )}
                      </div>

                      <div className={styles.cardBody}>
                        <span className={styles.cardTag}>{item.tag}</span>
                        <h3 className={styles.cardTitle}>{item.name}</h3>
                        <p className={styles.cardSubtitle}>{item.description}</p>

                        <div className={styles.cardFooter}>
                          <span className={styles.priceTag}>{item.priceFormatted}</span>
                          <button
                            className={styles.btnAction}
                            onClick={() => handleActionClick(item)}
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
              <Link href="/loja/vender" className={styles.sellerBtn}>
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

        {/* 4. FAQ DA LOJA */}
        <section className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
            <p className={styles.sectionDesc}>Dúvidas sobre a Loja Digital ABN</p>
          </div>
          <div className={styles.faqGrid}>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>Quanto custa vender na ABN?</h3>
              <p className={styles.faqAnswer}>
                Abrir uma loja na ABN é gratuito. O Vendedor define os preços dos seus produtos ou serviços e, sobre cada Pedido concluído, é aplicada uma comissão de acordo com o plano e a categoria do Item, conforme a Tabela de Preços em vigor. Também poderão existir serviços opcionais de visibilidade e destaque pago, destinados a aumentar a exposição dos produtos ou serviços dentro da Loja.
              </p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>Como funcionam os pagamentos?</h3>
              <p className={styles.faqAnswer}>
                Os pagamentos são processados através de M-Pesa, e-Mola, transferência bancária e outros meios disponíveis. A ABN retém o valor até à confirmação da entrega e transfere ao vendedor deduzida a comissão.
              </p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>Posso devolver um produto?</h3>
              <p className={styles.faqAnswer}>
                Sim, tem direito de desistência de 7 dias após receber o produto. Produtos digitais já descarregados ou serviços já iniciados não são elegíveis para devolução.
              </p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>A ABN é vendedora dos produtos?</h3>
              <p className={styles.faqAnswer}>
                Não. A ABN actua como intermediária. O contrato de compra e venda é celebrado directamente entre o Vendedor e o Comprador, salvo quando a própria ABN é a vendedora.
              </p>
            </div>
          </div>
          <div className={styles.termsLink}>
            <Link href="/loja/termos" className={styles.termsBtn}>
              Ver Termos e Condições da Loja
            </Link>
            {!termsAccepted && (
              <button 
                onClick={() => setTermsModalOpen(true)}
                className={styles.termsBtn}
                style={{ marginLeft: '1rem', background: 'var(--primary)', color: '#ffffff', border: 'none' }}
              >
                Aceitar Termos
              </button>
            )}
          </div>
        </section>
      </div>

      <FloatingWhatsApp />
      
      {/* Modal de Aceitação de Termos */}
      <TermsModal 
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onAccept={handleAcceptTerms}
      />
    </main>
  );
}