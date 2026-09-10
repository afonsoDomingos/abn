'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Star,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Video,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  Check,
  X,
  Edit3,
  Award,
  Sparkles,
  BookOpen,
  Building2,
  Globe
} from 'lucide-react';
import styles from './Consultor.module.css';

interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  price: string;
  priceAmount?: number;
  pricingType: 'fixo' | 'por_hora' | 'sob_orcamento';
  category: string;
  deliveryTime: string;
  deliverables?: string[];
  consultant?: any;
  consultantName?: string;
  consultantTitle?: string;
  consultantAvatar?: string;
  salesCount?: number;
  rating?: number;
  status: 'ativo' | 'inativo';
}

interface ProjectOrder {
  _id: string;
  service?: any;
  serviceTitle: string;
  category: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientPhone?: string;
  projectScope: string;
  budget: string;
  budgetAmount: number;
  timeline: string;
  status: 'pendente' | 'em_negociacao' | 'em_andamento' | 'concluido' | 'cancelado';
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  notes?: string;
  createdAt: string;
}

const SPECIALTY_CATEGORIES = [
  'Todos',
  'Consultoria',
  'Contabilidade',
  'Marketing',
  'Direito empresarial',
  'Tecnologia',
  'Recursos humanos',
  'Gestão',
  'Exportação',
  'Financiamento',
  'Estratégia'
];

export default function ServicosConsultoriaPage() {
  const [activeRole, setActiveRole] = useState('consultor');
  const [mainTab, setMainTab] = useState<'services' | 'orders' | 'projects' | 'portfolio' | 'profile' | 'market'>('services');
  const [loading, setLoading] = useState(true);

  // Dados do Consultor
  const [myServices, setMyServices] = useState<ServiceItem[]>([]);
  const [myProjects, setMyProjects] = useState<ProjectOrder[]>([]);
  const [consultantStats, setConsultantStats] = useState<any>(null);
  const [consultantProfile, setConsultantProfile] = useState<any>(null);

  // Dados do Mercado de Especialistas
  const [marketServices, setMarketServices] = useState<ServiceItem[]>([]);
  const [myClientOrders, setMyClientOrders] = useState<any[]>([]);

  // Filtros do Mercado
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Modais
  const [createServiceModalOpen, setCreateServiceModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedTargetService, setSelectedTargetService] = useState<ServiceItem | null>(null);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);

  // Form Novo Serviço
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Consultoria');
  const [newServicePrice, setNewServicePrice] = useState('$200 / Projeto');
  const [newServicePriceAmount, setNewServicePriceAmount] = useState(200);
  const [newServicePricingType, setNewServicePricingType] = useState<'fixo' | 'por_hora' | 'sob_orcamento'>('fixo');
  const [newServiceDeliveryTime, setNewServiceDeliveryTime] = useState('5 a 7 dias úteis');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDeliverables, setNewServiceDeliverables] = useState('');
  const [submittingService, setSubmittingService] = useState(false);

  // Form de Contratação / Pedido (Cliente)
  const [orderScope, setOrderScope] = useState('');
  const [orderCompany, setOrderCompany] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderTimeline, setOrderTimeline] = useState('Imediato (1 a 2 semanas)');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Form Novo Case de Portfólio
  const [caseTitle, setCaseTitle] = useState('');
  const [caseClient, setCaseClient] = useState('');
  const [caseDesc, setCaseDesc] = useState('');
  const [caseMetric, setCaseMetric] = useState('+35% de Eficiência');
  const [caseLink, setCaseLink] = useState('');
  const [submittingCase, setSubmittingCase] = useState(false);

  // Form Perfil do Consultor
  const [profileHeadline, setProfileHeadline] = useState('');
  const [profileSpecialties, setProfileSpecialties] = useState('');
  const [profileYears, setProfileYears] = useState(7);
  const [profileHourlyRate, setProfileHourlyRate] = useState('$50 / Hora');
  const [profileBio, setProfileBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Alerta Flutuante
  const [alert, setAlert] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('abn_active_role') || 'consultor';
    setActiveRole(storedRole);

    if (storedRole === 'consultor') {
      setMainTab('services');
      fetchConsultantData();
    } else {
      setMainTab('market');
      fetchMarketData();
    }
  }, []);

  const fetchConsultantData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services?view=consultant');
      const data = await res.json();
      if (data.success) {
        setMyServices(data.services || []);
        setMyProjects(data.projects || []);
        setConsultantStats(data.stats || null);
        setConsultantProfile(data.profile || null);

        if (data.profile) {
          setProfileHeadline(data.profile.headline || '');
          setProfileSpecialties((data.profile.specialties || []).join(', '));
          setProfileYears(data.profile.yearsOfExperience || 7);
          setProfileHourlyRate(data.profile.hourlyRate || '$50 / Hora');
          setProfileBio(data.profile.bio || '');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketData = async (cat: string = selectedCategory) => {
    setLoading(true);
    try {
      const url = cat && cat !== 'Todos' 
        ? `/api/services?category=${encodeURIComponent(cat)}`
        : '/api/services';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMarketServices(data.services || []);
        setMyClientOrders(data.myOrders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Criar Serviço
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServiceDesc || !newServicePrice) return;

    setSubmittingService(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_service',
          name: newServiceName,
          category: newServiceCategory,
          price: newServicePrice,
          priceAmount: newServicePriceAmount,
          pricingType: newServicePricingType,
          deliveryTime: newServiceDeliveryTime,
          description: newServiceDesc,
          deliverables: newServiceDeliverables.split('\n').filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success) {
        setCreateServiceModalOpen(false);
        setAlert({ type: 'success', text: 'Serviço publicado com sucesso!' });
        setTimeout(() => setAlert(null), 3500);
        // Limpar form
        setNewServiceName('');
        setNewServiceDesc('');
        setNewServiceDeliverables('');
        fetchConsultantData();
      } else {
        setAlert({ type: 'error', text: data.error || 'Erro ao criar serviço.' });
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSubmittingService(false);
    }
  };

  // Atualizar Estado do Projeto
  const handleUpdateOrderStatus = async (projectId: string, status: string) => {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_order_status', projectId, status })
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', text: data.message });
        setTimeout(() => setAlert(null), 3500);
        fetchConsultantData();
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro ao atualizar projeto.' });
    }
  };

  // Adicionar Case ao Portfólio
  const handleAddPortfolioCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle || !caseDesc) return;

    setSubmittingCase(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_portfolio',
          title: caseTitle,
          client: caseClient,
          description: caseDesc,
          resultMetric: caseMetric,
          link: caseLink
        })
      });
      const data = await res.json();
      if (data.success) {
        setPortfolioModalOpen(false);
        setAlert({ type: 'success', text: 'Caso de sucesso adicionado ao seu Portfólio!' });
        setTimeout(() => setAlert(null), 3500);
        setCaseTitle('');
        setCaseDesc('');
        setCaseClient('');
        fetchConsultantData();
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro ao salvar case.' });
    } finally {
      setSubmittingCase(false);
    }
  };

  // Salvar Perfil do Consultor
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const specs = profileSpecialties.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          headline: profileHeadline,
          specialties: specs,
          yearsOfExperience: profileYears,
          hourlyRate: profileHourlyRate,
          bio: profileBio
        })
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', text: 'Perfil profissional atualizado com sucesso!' });
        setTimeout(() => setAlert(null), 3500);
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro ao salvar perfil.' });
    } finally {
      setSavingProfile(false);
    }
  };

  // Contratar / Solicitar Serviço (Cliente)
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetService || !orderScope) return;

    setSubmittingOrder(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'order_service',
          serviceId: selectedTargetService._id,
          serviceTitle: selectedTargetService.name,
          category: selectedTargetService.category,
          consultantId: selectedTargetService.consultant,
          consultantName: selectedTargetService.consultantName,
          projectScope: orderScope,
          budget: selectedTargetService.price,
          timeline: orderTimeline,
          company: orderCompany,
          phone: orderPhone
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderModalOpen(false);
        setAlert({ type: 'success', text: 'Proposta enviada com sucesso ao especialista!' });
        setTimeout(() => setAlert(null), 4000);
        setOrderScope('');
      } else {
        setAlert({ type: 'error', text: data.error || 'Erro ao enviar pedido.' });
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Filtragem no Mercado
  const filteredMarketServices = useMemo(() => {
    return marketServices.filter(srv => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = srv.name.toLowerCase().includes(q);
        const matchCat = srv.category.toLowerCase().includes(q);
        const matchDesc = srv.description.toLowerCase().includes(q);
        const matchConsultant = (srv.consultantName || '').toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc && !matchConsultant) return false;
      }
      if (selectedCategory !== 'Todos' && srv.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [marketServices, searchQuery, selectedCategory]);

  return (
    <div className={styles.container}>

      {/* Alerta */}
      {alert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1100,
          background: alert.type === 'success' ? '#059669' : '#dc2626',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
          <span>{alert.text}</span>
        </div>
      )}

      {/* ── HEADER EXECUTIVO DO CONSULTOR ── */}
      <header className={styles.heroHeader}>
        <div className={styles.heroTop}>
          <div>
            <div className={styles.badgeConsultor}>
              <Briefcase size={14} /> Hub de Consultoria &amp; Mercado de Especialistas ABN
            </div>
            <h1 className={styles.heroTitle}>Monetização de Expertise &amp; Conhecimento</h1>
            <p className={styles.heroDesc}>
              Ofereça consultorias especializadas e serviços de alto valor a startups e PMEs em África e na Diáspora. Defina preços, receba pedidos diretos e acompanhe entregas com segurança.
            </p>
          </div>

          <div className={styles.heroActions}>
            <button 
              className={`${styles.btnSecondary} ${mainTab === 'market' ? styles.btnPrimary : ''}`}
              onClick={() => {
                setMainTab('market');
                fetchMarketData();
              }}
            >
              <Globe size={16} /> Explorar Mercado de Especialistas
            </button>
            <button 
              className={styles.btnPrimary}
              onClick={() => setCreateServiceModalOpen(true)}
            >
              <Plus size={16} /> Criar Novo Serviço
            </button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Briefcase size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{consultantStats?.activeServicesCount || myServices.length} Serviços</div>
              <div className={styles.statLabel}>Pacotes Publicados</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Clock size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{consultantStats?.inProgressCount || 1} Projetos</div>
              <div className={styles.statLabel}>Em Andamento</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <DollarSign size={22} />
            </div>
            <div>
              <div className={styles.statValue}>${consultantStats?.totalRevenue || 2800}</div>
              <div className={styles.statLabel}>Receita Acumulada</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Star size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{consultantStats?.averageRating || '4.95'} ★</div>
              <div className={styles.statLabel}>Avaliação dos Clientes</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── ABAS DE NAVEGAÇÃO ── */}
      <nav className={styles.navTabs}>
        <button 
          className={`${styles.navTab} ${mainTab === 'services' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('services'); fetchConsultantData(); }}
        >
          <Briefcase size={17} />
          <span>Meus Serviços &amp; Pacotes</span>
          <span className={styles.tabBadge}>{myServices.length}</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'orders' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('orders'); fetchConsultantData(); }}
        >
          <Calendar size={17} />
          <span>Pedidos Recebidos</span>
          {consultantStats?.pendingCount > 0 && <span className={styles.tabBadge} style={{ background: '#f59e0b', color: '#fff' }}>{consultantStats.pendingCount}</span>}
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'projects' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('projects'); fetchConsultantData(); }}
        >
          <Clock size={17} />
          <span>Projetos &amp; Agenda</span>
          <span className={styles.tabBadge}>{myProjects.length}</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'portfolio' ? styles.navTabActive : ''}`}
          onClick={() => setMainTab('portfolio')}
        >
          <Award size={17} />
          <span>Portfólio &amp; Cases</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'profile' ? styles.navTabActive : ''}`}
          onClick={() => setMainTab('profile')}
        >
          <Edit3 size={17} />
          <span>Disponibilidade &amp; Perfil</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'market' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('market'); fetchMarketData(); }}
          style={{ marginLeft: 'auto', color: '#ff6b00' }}
        >
          <Globe size={17} />
          <span>Mercado de Especialistas ABN 🛒</span>
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
         ABA 1: MEUS SERVIÇOS & PACOTES
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'services' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Briefcase size={22} color="#ff6b00" /> Pacotes de Serviços Oferecidos</h2>
              <p className={styles.sectionSubtitle}>Crie e monetize os seus serviços nas 10 áreas estratégicas do ecossistema ABN.</p>
            </div>
            <button 
              className={styles.btnPrimary}
              onClick={() => setCreateServiceModalOpen(true)}
            >
              <Plus size={16} /> Publicar Novo Serviço
            </button>
          </div>

          {myServices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <Briefcase size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>Ainda não publicou nenhum serviço</h4>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>Comece por criar o seu primeiro serviço de consultoria, contabilidade, marketing ou tecnologia.</p>
              <button className={styles.btnPrimary} onClick={() => setCreateServiceModalOpen(true)}>
                + Criar Primeiro Serviço
              </button>
            </div>
          ) : (
            <div className={styles.servicesGrid}>
              {myServices.map(srv => (
                <div key={srv._id} className={styles.serviceCard}>
                  <div>
                    <div className={styles.serviceCardTop}>
                      <span className={styles.serviceCategoryBadge}>{srv.category}</span>
                      <h3 className={styles.serviceName}>{srv.name}</h3>
                      <p className={styles.serviceDesc}>{srv.description}</p>
                    </div>

                    {/* Entregáveis */}
                    {srv.deliverables && srv.deliverables.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                          O que está incluído:
                        </div>
                        <ul className={styles.deliverablesList}>
                          {srv.deliverables.map((d, i) => (
                            <li key={i} className={styles.deliverableItem}>
                              <span className={styles.deliverableCheck}>✓</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Preço e Prazo */}
                    <div className={styles.servicePriceRow}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Investimento:</span>
                        <div className={styles.servicePrice}>{srv.price}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Prazo:</span>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{srv.deliveryTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.serviceActions}>
                    <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> {srv.status === 'ativo' ? 'Ativo no Mercado' : 'Pausado'}
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748b' }}>
                      {srv.salesCount || 0} Contratações
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 2: PEDIDOS & CLIENTES (INBOUND)
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'orders' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Calendar size={22} color="#f59e0b" /> Pedidos de Contratação</h2>
              <p className={styles.sectionSubtitle}>Startups e empresas que solicitaram os seus serviços de consultoria.</p>
            </div>
          </div>

          <div className={styles.projectList}>
            {myProjects.filter(p => p.status === 'pendente' || p.status === 'em_negociacao').map(proj => (
              <div key={proj._id} className={styles.projectCard}>
                <div className={styles.projectTop}>
                  <div className={styles.clientMeta}>
                    <div className={styles.clientAvatar}>
                      {proj.clientName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{proj.clientName}</h4>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {proj.clientCompany} • {proj.clientEmail} {proj.clientPhone ? `• ${proj.clientPhone}` : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`${styles.statusBadge} ${styles.statusPendente}`}>{proj.status}</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                      Orçamento: {proj.budget}
                    </div>
                  </div>
                </div>

                <div className={styles.scopeBox}>
                  <strong>Serviço Requisitado:</strong> {proj.serviceTitle} ({proj.category})<br />
                  <strong>Desafio / Escopo:</strong> {proj.projectScope}<br />
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Prazo Desejado pelo Cliente: {proj.timeline}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <button 
                    className={styles.btnPrimary}
                    style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
                    onClick={() => handleUpdateOrderStatus(proj._id, 'em_andamento')}
                  >
                    <Check size={16} /> Aceitar Projeto &amp; Iniciar
                  </button>
                  <button 
                    className={styles.btnSecondary}
                    style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem', color: '#0f172a', borderColor: '#cbd5e1' }}
                    onClick={() => handleUpdateOrderStatus(proj._id, 'cancelado')}
                  >
                    <X size={16} /> Recusar Proposta
                  </button>
                </div>
              </div>
            ))}

            {myProjects.filter(p => p.status === 'pendente' || p.status === 'em_negociacao').length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Nenhum pedido pendente de momento.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 3: PROJETOS EM ANDAMENTO & AGENDA
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'projects' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Clock size={22} color="#059669" /> Projetos em Curso &amp; Entregas</h2>
              <p className={styles.sectionSubtitle}>Acompanhe marcos de consultoria, prazos e reuniões de alinhamento com clientes.</p>
            </div>
          </div>

          <div className={styles.projectList}>
            {myProjects.filter(p => p.status === 'em_andamento').map(proj => (
              <div key={proj._id} className={styles.projectCard}>
                <div className={styles.projectTop}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ff6b00', textTransform: 'uppercase' }}>{proj.category}</span>
                    <h4 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: '#0f172a' }}>{proj.serviceTitle}</h4>
                    <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Cliente: <strong>{proj.clientName}</strong> ({proj.clientCompany})</span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`${styles.statusBadge} ${styles.statusAndamento}`}>Em Andamento</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                      Valor: {proj.budget}
                    </div>
                  </div>
                </div>

                <div className={styles.scopeBox}>
                  <strong>Escopo do Projeto:</strong> {proj.projectScope}
                  {proj.notes && (
                    <div style={{ marginTop: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '6px', color: '#059669', fontWeight: 600 }}>
                      Notas de progresso: {proj.notes}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  {proj.meetingLink ? (
                    <a 
                      href={proj.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnPrimary}
                      style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                      <Video size={16} /> Entrar na Sala de Alinhamento
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Prazo: {proj.timeline}</span>
                  )}

                  <button 
                    style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    onClick={() => handleUpdateOrderStatus(proj._id, 'concluido')}
                  >
                    ✓ Marcar como Concluído
                  </button>
                </div>
              </div>
            ))}

            {/* Projetos Concluídos */}
            {myProjects.filter(p => p.status === 'concluido').length > 0 && (
              <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '0 0 1rem 0' }}>Projetos Concluídos &amp; Histórico</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {myProjects.filter(p => p.status === 'concluido').map(c => (
                    <div key={c._id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#0f172a' }}>{c.serviceTitle}</strong>
                        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{c.clientName} ({c.clientCompany}) • Faturado: {c.budget}</div>
                      </div>
                      <span className={`${styles.statusBadge} ${styles.statusConcluido}`}>Concluído</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 4: PORTFÓLIO & CASOS DE SUCESSO
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'portfolio' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Award size={22} color="#ff6b00" /> Portfólio de Casos de Sucesso</h2>
              <p className={styles.sectionSubtitle}>Demonstre resultados mensuráveis que comprovem a sua autoridade e expertise técnica.</p>
            </div>
            <button 
              className={styles.btnPrimary}
              onClick={() => setPortfolioModalOpen(true)}
            >
              <Plus size={16} /> Adicionar Caso de Sucesso
            </button>
          </div>

          <div className={styles.portfolioGrid}>
            {(consultantProfile?.portfolio && consultantProfile.portfolio.length > 0 ? consultantProfile.portfolio : [
              {
                title: 'Reestruturação Fiscal & Governança Corporativa',
                client: 'AgroBeira PME (Moçambique)',
                description: 'Implementação de plano de contas auditável e eliminação de contingências tributárias com poupança anual comprovada.',
                resultMetric: 'Economia de $18,000 / ano'
              },
              {
                title: 'Estratégia de Expansão e Contratos B2B',
                client: 'KabuSolar Solutions (Cabo Verde)',
                description: 'Redação de minutas contratuais de fornecimento e contratos PPA com grandes grupos hoteleiros.',
                resultMetric: '+40% Novos Contratos Fechados'
              },
              {
                title: 'Automação de Funil de Vendas e CRM',
                client: 'Bissau Pay & Tech',
                description: 'Integração de esteira digital de captação de clientes B2B via WhatsApp Business API e CRM.',
                resultMetric: 'Redução de 50% no CAC'
              }
            ]).map((item: any, idx: number) => (
              <div key={idx} className={styles.portfolioCard}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#0f172a' }}>{item.title}</h4>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '8px' }}>Cliente: <strong>{item.client}</strong></div>
                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {item.description}
                  </p>
                </div>
                <div>
                  {item.resultMetric && (
                    <div className={styles.metricBadge}>
                      <Sparkles size={13} /> {item.resultMetric}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 5: MEU PERFIL & DISPONIBILIDADE
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'profile' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Edit3 size={22} color="#ff6b00" /> Perfil Profissional de Especialista</h2>
              <p className={styles.sectionSubtitle}>Configure as suas áreas de atuação, honorários padrão e canais de atendimento.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Headline Profissional</label>
                <input 
                  type="text" 
                  value={profileHeadline}
                  onChange={e => setProfileHeadline(e.target.value)}
                  placeholder="Ex: Consultor Especialista em Contabilidade & Fiscalidade PME"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Anos de Experiência</label>
                <input 
                  type="number" 
                  value={profileYears}
                  onChange={e => setProfileYears(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Áreas de Especialidade (separadas por vírgula)</label>
                <input 
                  type="text" 
                  value={profileSpecialties}
                  onChange={e => setProfileSpecialties(e.target.value)}
                  placeholder="Contabilidade, Gestão, Direito empresarial, Financiamento..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Honorários de Referência</label>
                <input 
                  type="text" 
                  value={profileHourlyRate}
                  onChange={e => setProfileHourlyRate(e.target.value)}
                  placeholder="Ex: $50 / Hora ou Sob Orçamento"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
              <label>Biografia &amp; Resumo de Competências</label>
              <textarea 
                rows={4}
                value={profileBio}
                onChange={e => setProfileBio(e.target.value)}
                placeholder="Apresente o seu percurso, empresas que já atendeu e diferenciais técnicos..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                className={styles.btnPrimary}
                disabled={savingProfile}
              >
                {savingProfile ? 'A guardar...' : 'Guardar Perfil de Especialista'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 6: MERCADO DE ESPECIALISTAS ABN (CATÁLOGO GERAL)
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'market' && (
        <div>
          {/* Barra de Pesquisa e Filtros pelas 10 Categorias */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.2rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Pesquisar por serviço, consultor, especialidade ou entrega..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem' }}
              />
            </div>

            <select 
              value={selectedCategory} 
              onChange={e => {
                setSelectedCategory(e.target.value);
                fetchMarketData(e.target.value);
              }}
              style={{ padding: '0.65rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', background: '#f8fafc' }}
            >
              {SPECIALTY_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Catálogo de Serviços do Mercado */}
          <div className={styles.servicesGrid}>
            {filteredMarketServices.map(srv => (
              <div key={srv._id} className={styles.serviceCard}>
                <div>
                  <div className={styles.serviceCardTop}>
                    <span className={styles.serviceCategoryBadge}>{srv.category}</span>
                    <h3 className={styles.serviceName}>{srv.name}</h3>
                    <p className={styles.serviceDesc}>{srv.description}</p>
                  </div>

                  {srv.deliverables && srv.deliverables.length > 0 && (
                    <ul className={styles.deliverablesList}>
                      {srv.deliverables.slice(0, 3).map((d, i) => (
                        <li key={i} className={styles.deliverableItem}>
                          <span className={styles.deliverableCheck}>✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className={styles.servicePriceRow}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Investimento:</span>
                      <div className={styles.servicePrice}>{srv.price}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Prazo:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{srv.deliveryTime}</div>
                    </div>
                  </div>

                  {srv.consultantName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', fontSize: '0.82rem', color: '#475569' }}>
                      <img 
                        src={srv.consultantAvatar || '/abn-logo.png'} 
                        alt={srv.consultantName}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => { (e.currentTarget as HTMLElement).setAttribute('src', '/abn-logo.png'); }}
                      />
                      <span>Por: <strong>{srv.consultantName}</strong> {srv.consultantTitle ? `• ${srv.consultantTitle}` : ''}</span>
                    </div>
                  )}
                </div>

                <div className={styles.serviceActions}>
                  <button 
                    className={styles.btnPrimary}
                    style={{ width: '100%', padding: '0.75rem' }}
                    onClick={() => {
                      setSelectedTargetService(srv);
                      setOrderModalOpen(true);
                    }}
                  >
                    <Briefcase size={16} /> Contratar / Solicitar Proposta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: CRIAR NOVO SERVIÇO ── */}
      {createServiceModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setCreateServiceModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase' }}>Novo Serviço</span>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff', fontFamily: 'Outfit' }}>Publicar no Mercado ABN</h3>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setCreateServiceModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateService} className={styles.modalBody}>
              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <label>Título do Serviço</label>
                <input 
                  type="text" 
                  value={newServiceName} 
                  onChange={e => setNewServiceName(e.target.value)} 
                  placeholder="Ex: Auditoria Contábil & Conformidade Fiscal para PMEs"
                  required 
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Área Estratégica</label>
                  <select 
                    value={newServiceCategory}
                    onChange={e => setNewServiceCategory(e.target.value)}
                  >
                    {SPECIALTY_CATEGORIES.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Modelo de Preço</label>
                  <select 
                    value={newServicePricingType}
                    onChange={e => setNewServicePricingType(e.target.value as any)}
                  >
                    <option value="fixo">Preço Fixo / Pacote</option>
                    <option value="por_hora">Por Hora de Consultoria</option>
                    <option value="sob_orcamento">Sob Orçamento</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Valor / Preço Exibido</label>
                  <input 
                    type="text" 
                    value={newServicePrice} 
                    onChange={e => setNewServicePrice(e.target.value)} 
                    placeholder="Ex: $250 / Projeto ou $50 / Hora"
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Prazo de Entrega Estimado</label>
                  <input 
                    type="text" 
                    value={newServiceDeliveryTime} 
                    onChange={e => setNewServiceDeliveryTime(e.target.value)} 
                    placeholder="Ex: 5 a 7 dias úteis"
                    required 
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <label>Descrição Detalhada do Serviço</label>
                <textarea 
                  rows={3} 
                  value={newServiceDesc}
                  onChange={e => setNewServiceDesc(e.target.value)}
                  placeholder="Descreva a metodologia, benefícios para o cliente e valor agregado..."
                  required 
                />
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label>Entregáveis do Pacote (um por linha)</label>
                <textarea 
                  rows={3} 
                  value={newServiceDeliverables}
                  onChange={e => setNewServiceDeliverables(e.target.value)}
                  placeholder="Ex:&#10;Relatório de Diagnóstico Fiscal&#10;Balancete & DRE 12 meses&#10;Sessão de alinhamento de 60 min"
                />
              </div>

              <button 
                type="submit" 
                className={styles.btnPrimary}
                disabled={submittingService}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {submittingService ? 'A publicar...' : 'Publicar Serviço no Mercado'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CONTRATAR SERVIÇO (CLIENTE) ── */}
      {orderModalOpen && selectedTargetService && (
        <div className={styles.modalOverlay} onClick={() => setOrderModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase' }}>Solicitar Serviço</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontFamily: 'Outfit' }}>{selectedTargetService.name}</h3>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setOrderModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className={styles.modalBody}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Especialista:</span>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{selectedTargetService.consultantName || 'Especialista ABN'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Investimento:</span>
                  <div style={{ fontWeight: 800, color: '#059669', fontSize: '1.1rem' }}>{selectedTargetService.price}</div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Sua Empresa / Startup</label>
                  <input 
                    type="text" 
                    value={orderCompany} 
                    onChange={e => setOrderCompany(e.target.value)} 
                    placeholder="Ex: Minha Empresa Lda" 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={orderPhone} 
                    onChange={e => setOrderPhone(e.target.value)} 
                    placeholder="Ex: +258 84 000 0000" 
                    required 
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <label>Prazo Pretendido</label>
                <select 
                  value={orderTimeline}
                  onChange={e => setOrderTimeline(e.target.value)}
                >
                  <option value="Imediato (1 a 2 semanas)">Imediato (1 a 2 semanas)</option>
                  <option value="Próximo Mês">Próximo Mês</option>
                  <option value="A combinar com o especialista">A combinar com o especialista</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label>Descrição da Necessidade &amp; Escopo</label>
                <textarea 
                  rows={4} 
                  value={orderScope}
                  onChange={e => setOrderScope(e.target.value)}
                  placeholder="Explique o desafio do seu negócio e o que precisa que o especialista execute..."
                  required 
                />
              </div>

              <button 
                type="submit" 
                className={styles.btnPrimary}
                disabled={submittingOrder}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {submittingOrder ? 'A enviar solicitação...' : 'Enviar Pedido ao Especialista'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADICIONAR CASE AO PORTFÓLIO ── */}
      {portfolioModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setPortfolioModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase' }}>Portfólio</span>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff', fontFamily: 'Outfit' }}>Adicionar Caso de Sucesso</h3>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setPortfolioModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPortfolioCase} className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Título do Projeto</label>
                  <input 
                    type="text" 
                    value={caseTitle} 
                    onChange={e => setCaseTitle(e.target.value)} 
                    placeholder="Ex: Auditoria & Otimização Fiscal PME" 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nome do Cliente / Empresa Atendida</label>
                  <input 
                    type="text" 
                    value={caseClient} 
                    onChange={e => setCaseClient(e.target.value)} 
                    placeholder="Ex: AgroTech Moçambique" 
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Resultado Mensurável Alcançado</label>
                  <input 
                    type="text" 
                    value={caseMetric} 
                    onChange={e => setCaseMetric(e.target.value)} 
                    placeholder="Ex: Economia de $15,000 / ano ou +45% de Vendas" 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Link de Referência / Website</label>
                  <input 
                    type="text" 
                    value={caseLink} 
                    onChange={e => setCaseLink(e.target.value)} 
                    placeholder="https://..." 
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label>Descrição do Desafio &amp; Solução Implementada</label>
                <textarea 
                  rows={3} 
                  value={caseDesc}
                  onChange={e => setCaseDesc(e.target.value)}
                  placeholder="Explique o problema encontrado e a estratégia executada..."
                  required 
                />
              </div>

              <button 
                type="submit" 
                className={styles.btnPrimary}
                disabled={submittingCase}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {submittingCase ? 'A guardar...' : 'Adicionar ao Portfólio'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
