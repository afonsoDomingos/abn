'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Search,
  Filter,
  Star,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  ShieldCheck,
  Building2,
  Rocket,
  DollarSign,
  ChevronRight,
  Globe,
  MapPin,
  CheckCircle2,
  FileText,
  Users,
  Target,
  BarChart3,
  Briefcase,
  X,
  MessageSquare,
  Sparkles,
  Zap,
  ArrowUpRight,
  Video,
  Check
} from 'lucide-react';
import styles from './Investidor.module.css';

interface TeamMember {
  name: string;
  role: string;
  linkedin?: string;
  avatar?: string;
}

interface DataRoomDoc {
  title: string;
  category: string;
  size?: string;
  fileUrl?: string;
}

interface DealOpportunity {
  _id: string;
  name: string;
  type: 'startup' | 'empresa';
  category: string;
  sector: string;
  location: string;
  country: string;
  stage: string;
  businessModel: string;
  description: string;
  logo: string;
  website?: string;
  owner?: {
    name: string;
    email: string;
    phone?: string;
  };
  fundingGoal: string;
  fundingGoalNumber?: number;
  equityOffered: number;
  valuation: string;
  minTicket: string;
  instrument: string;
  growthPotential: string;
  score: number;
  traction: {
    mrr: string;
    arr: string;
    cac: string;
    ltv: string;
    runwayMonths: number;
    burnRate: string;
    activeClients: number;
    churnRate: string;
    momGrowth: string;
  };
  pitch: string;
  pitchDeckUrl?: string;
  dataRoom?: DataRoomDoc[];
  team?: TeamMember[];
  market?: {
    tam: string;
    sam: string;
    som: string;
    competitors: string;
    differentiators: string;
  };
  status: string;
}

interface WatchlistItem {
  businessId: string;
  notes?: string;
  rating?: number;
  addedAt: string;
}

interface MeetingItem {
  businessId: string;
  businessName: string;
  founderName: string;
  date: string;
  time: string;
  topic: string;
  status: string;
  meetingLink?: string;
  notes?: string;
}

const SECTORS_LIST = [
  'Todos',
  'Fintech',
  'AgriTech & Clima',
  'HealthTech',
  'Logística',
  'Clean Energy & Clima',
  'EdTech',
  'E-commerce'
];

const COUNTRIES_LIST = [
  'Todos',
  'Guiné-Bissau',
  'Moçambique',
  'Angola',
  'Cabo Verde',
  'São Tomé e Príncipe',
  'Portugal',
  'África do Sul'
];

const STAGES_LIST = [
  'Todos',
  'Ideação',
  'MVP',
  'Pre-Seed',
  'Seed',
  'Série A',
  'Tração & Escala'
];

const MODELS_LIST = [
  'Todos',
  'B2B',
  'B2C',
  'Marketplace',
  'B2B SaaS',
  'B2B Transacional',
  'Assinatura'
];

export default function InvestidorPage() {
  const [deals, setDeals] = useState<DealOpportunity[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Navegação Principal de Abas
  const [mainTab, setMainTab] = useState<'dealflow' | 'watchlist' | 'meetings' | 'markets'>('dealflow');

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [quickPill, setQuickPill] = useState<'all' | 'startup' | 'empresa' | 'watchlist'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Todos');
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [selectedStage, setSelectedStage] = useState('Todos');
  const [selectedModel, setSelectedModel] = useState('Todos');
  const [selectedGrowth, setSelectedGrowth] = useState('Todos');
  const [selectedTicket, setSelectedTicket] = useState('Todos');

  // Deal Room Modal
  const [dealRoomOpen, setDealRoomOpen] = useState(false);
  const [activeDeal, setActiveDeal] = useState<DealOpportunity | null>(null);
  const [dealRoomTab, setDealRoomTab] = useState<'overview' | 'pitch' | 'traction' | 'team' | 'market' | 'terms' | 'action'>('overview');

  // Formulário de Reunião
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingDeal, setMeetingDeal] = useState<DealOpportunity | null>(null);
  const [meetDate, setMeetDate] = useState('');
  const [meetTime, setMeetTime] = useState('14:00');
  const [meetTopic, setMeetTopic] = useState('Due Diligence & Apresentação');
  const [meetNotes, setMeetNotes] = useState('');
  const [savingMeeting, setSavingMeeting] = useState(false);

  // Formulário de Manifestação de Interesse (Term Sheet)
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryDeal, setInquiryDeal] = useState<DealOpportunity | null>(null);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [proposedTicket, setProposedTicket] = useState('$25,000');
  const [proposedInstrument, setProposedInstrument] = useState('SAFE');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Edição de Nota Privada na Watchlist
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Mensagens de Sucesso / Alerta
  const [alert, setAlert] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchInvestmentsData();
  }, []);

  const fetchInvestmentsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/investments');
      const data = await res.json();
      if (data.success) {
        setDeals(data.deals || []);
        setWatchlist(data.watchlist || []);
        setMeetings(data.meetings || []);
        setStats(data.stats || null);
      }
    } catch (e) {
      console.error('Erro ao buscar dados de investimentos:', e);
    } finally {
      setLoading(false);
    }
  };

  // Watchlist Toggle
  const handleToggleWatchlist = async (businessId: string) => {
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_watchlist', businessId })
      });
      const data = await res.json();
      if (data.success) {
        setWatchlist(data.watchlist || []);
        setAlert({ type: 'success', text: data.message });
        setTimeout(() => setAlert(null), 3500);
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro ao atualizar watchlist.' });
    }
  };

  // Salvar Nota da Watchlist
  const handleSaveNotes = async (businessId: string) => {
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_notes', businessId, notes: tempNoteText })
      });
      const data = await res.json();
      if (data.success) {
        setWatchlist(data.watchlist || []);
        setEditingNotesId(null);
        setAlert({ type: 'success', text: 'Notas privadas salvas com sucesso.' });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro ao salvar notas.' });
    }
  };

  // Agendar Reunião
  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDeal || !meetDate || !meetTime) return;

    setSavingMeeting(true);
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule_meeting',
          businessId: meetingDeal._id,
          businessName: meetingDeal.name,
          founderName: meetingDeal.owner?.name || 'Fundador',
          date: meetDate,
          time: meetTime,
          topic: meetTopic,
          notes: meetNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings || []);
        setMeetingModalOpen(false);
        setAlert({ type: 'success', text: 'Reunião de Due Diligence agendada com sucesso! Link virtual criado.' });
        setTimeout(() => setAlert(null), 4000);
      } else {
        setAlert({ type: 'error', text: data.error || 'Erro ao agendar reunião.' });
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSavingMeeting(false);
    }
  };

  // Enviar Manifestação de Interesse (Term Sheet)
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryDeal || !inquiryMsg) return;

    setSubmittingInquiry(true);
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_inquiry',
          businessId: inquiryDeal._id,
          message: inquiryMsg,
          proposedTicket,
          instrument: proposedInstrument
        })
      });
      const data = await res.json();
      if (data.success) {
        setInquiryModalOpen(false);
        setInquiryMsg('');
        setAlert({ type: 'success', text: 'Proposta confidencial enviada com sucesso ao fundador!' });
        setTimeout(() => setAlert(null), 4000);
      } else {
        setAlert({ type: 'error', text: data.error || 'Erro ao enviar proposta.' });
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Filtragem dos Deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // 1. Pesquisa textual
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = deal.name.toLowerCase().includes(term);
        const matchSector = deal.sector.toLowerCase().includes(term);
        const matchLocation = deal.location.toLowerCase().includes(term);
        const matchDesc = deal.description.toLowerCase().includes(term);
        if (!matchName && !matchSector && !matchLocation && !matchDesc) return false;
      }

      // 2. Quick Pill
      if (quickPill === 'startup' && deal.type !== 'startup') return false;
      if (quickPill === 'empresa' && deal.type !== 'empresa') return false;
      if (quickPill === 'watchlist' && !watchlist.some(w => w.businessId === deal._id)) return false;

      // 3. País
      if (selectedCountry !== 'Todos' && !deal.country.toLowerCase().includes(selectedCountry.toLowerCase())) return false;

      // 4. Setor
      if (selectedSector !== 'Todos' && !deal.sector.toLowerCase().includes(selectedSector.toLowerCase())) return false;

      // 5. Estágio
      if (selectedStage !== 'Todos' && !deal.stage.toLowerCase().includes(selectedStage.toLowerCase())) return false;

      // 6. Modelo de Negócio
      if (selectedModel !== 'Todos' && !deal.businessModel.toLowerCase().includes(selectedModel.toLowerCase())) return false;

      // 7. Potencial de Crescimento
      if (selectedGrowth !== 'Todos' && deal.growthPotential !== selectedGrowth) return false;

      return true;
    });
  }, [deals, searchTerm, quickPill, selectedCountry, selectedSector, selectedStage, selectedModel, selectedGrowth, watchlist]);

  // Lista de Deals que estão na Watchlist
  const watchlistDeals = useMemo(() => {
    return deals.filter(d => watchlist.some(w => w.businessId === d._id));
  }, [deals, watchlist]);

  const openDealRoom = (deal: DealOpportunity, initialTab: 'overview' | 'pitch' | 'traction' | 'team' | 'market' | 'terms' | 'action' = 'overview') => {
    setActiveDeal(deal);
    setDealRoomTab(initialTab);
    setDealRoomOpen(true);
  };

  const openMeetingScheduler = (deal: DealOpportunity) => {
    setMeetingDeal(deal);
    setMeetDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
    setMeetingModalOpen(true);
  };

  const openInquiryModal = (deal: DealOpportunity) => {
    setInquiryDeal(deal);
    setInquiryModalOpen(true);
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '6rem 1rem', color: '#64748b' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #ff6b00', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ marginTop: '1rem', fontWeight: 600 }}>A carregar Portal do Investidor &amp; Deal Room ABN...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {/* Alertas */}
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

      {/* ── HEADER EXECUTIVO DO INVESTIDOR ── */}
      <header className={styles.heroHeader}>
        <div className={styles.heroTop}>
          <div>
            <div className={styles.badgeInvestor}>
              <TrendingUp size={14} /> Portal do Investidor • Deal Room ABN
            </div>
            <h1 className={styles.heroTitle}>Inteligência de Investimento &amp; Dealflow</h1>
            <p className={styles.heroDesc}>
              Aceda a startups de alto crescimento e PMEs estruturadas em África e na Diáspora. Analise métricas financeiras auditadas, aceda a data rooms confidenciais e co-invista com a rede ABN.
            </p>
          </div>

          <div className={styles.heroActions}>
            <button 
              className={styles.btnSecondary}
              onClick={() => {
                setQuickPill('watchlist');
                setMainTab('watchlist');
              }}
            >
              <Star size={16} color="#f59e0b" /> Minha Watchlist ({watchlist.length})
            </button>
            <button 
              className={styles.btnPrimary}
              onClick={() => setMainTab('meetings')}
            >
              <Calendar size={16} /> Reuniões ({meetings.filter(m => m.status === 'agendada').length})
            </button>
          </div>
        </div>

        {/* Métricas Rápidas do Ecossistema */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Briefcase size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{stats?.totalDeals || deals.length}</div>
              <div className={styles.statLabel}>Oportunidades no Radar</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <DollarSign size={22} />
            </div>
            <div>
              <div className={styles.statValue}>
                ${(stats?.totalVolumeSeeking ? (stats.totalVolumeSeeking / 1000000).toFixed(1) + 'M' : '$1.1M')}
              </div>
              <div className={styles.statLabel}>Volume Total em Captação</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Globe size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{stats?.countriesCount || 4} Mercados</div>
              <div className={styles.statLabel}>Presença África &amp; CPLP</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Star size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{watchlist.length} Negócios</div>
              <div className={styles.statLabel}>Em Acompanhamento</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── ABAS DE NAVEGAÇÃO SUPERIOR ── */}
      <nav className={styles.navTabs}>
        <button 
          className={`${styles.navTab} ${mainTab === 'dealflow' ? styles.navTabActive : ''}`}
          onClick={() => setMainTab('dealflow')}
        >
          <Rocket size={18} />
          <span>Dealflow &amp; Oportunidades</span>
          <span className={styles.tabBadge}>{filteredDeals.length}</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'watchlist' ? styles.navTabActive : ''}`}
          onClick={() => setMainTab('watchlist')}
        >
          <Star size={18} />
          <span>Minha Watchlist</span>
          <span className={styles.tabBadge}>{watchlist.length}</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'meetings' ? styles.navTabActive : ''}`}
          onClick={() => setMainTab('meetings')}
        >
          <Calendar size={18} />
          <span>Reuniões &amp; Contactos</span>
          <span className={styles.tabBadge}>{meetings.length}</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'markets' ? styles.navTabActive : ''}`}
          onClick={() => setMainTab('markets')}
        >
          <BarChart3 size={18} />
          <span>Setores &amp; Inteligência de Mercado</span>
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
         ABA 1: DEALFLOW & OPORTUNIDADES
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'dealflow' && (
        <>
          {/* Barra de Pesquisa e Filtros */}
          <div className={styles.searchFilterBar}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrap}>
                <Search size={18} className={styles.searchIcon} />
                <input 
                  type="text" 
                  className={styles.searchInput}
                  placeholder="Pesquisar por nome, setor, cidade, país ou tecnologia..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Pílulas Rápidas */}
              <div className={styles.quickPills}>
                <button 
                  className={`${styles.pillBtn} ${quickPill === 'all' ? styles.pillBtnActive : ''}`}
                  onClick={() => setQuickPill('all')}
                >
                  Todos ({deals.length})
                </button>
                <button 
                  className={`${styles.pillBtn} ${quickPill === 'startup' ? styles.pillBtnActive : ''}`}
                  onClick={() => setQuickPill('startup')}
                >
                  <Rocket size={14} /> Startups
                </button>
                <button 
                  className={`${styles.pillBtn} ${quickPill === 'empresa' ? styles.pillBtnActive : ''}`}
                  onClick={() => setQuickPill('empresa')}
                >
                  <Building2 size={14} /> Empresas / PMEs
                </button>
                <button 
                  className={`${styles.pillBtn} ${quickPill === 'watchlist' ? styles.pillBtnActive : ''}`}
                  onClick={() => setQuickPill('watchlist')}
                >
                  <Star size={14} color="#f59e0b" /> Guardadas ({watchlist.length})
                </button>
              </div>

              {/* Botão de Toggle de Filtros Avançados */}
              <button 
                className={`${styles.filterToggleBtn} ${showAdvancedFilters ? styles.filterToggleBtnActive : ''}`}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter size={16} /> Filtros Multicritério
              </button>
            </div>

            {/* Gaveta de Filtros Avançados */}
            {showAdvancedFilters && (
              <div className={styles.filterDrawer}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>País / Mercado</label>
                  <select 
                    className={styles.filterSelect}
                    value={selectedCountry}
                    onChange={e => setSelectedCountry(e.target.value)}
                  >
                    {COUNTRIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Setor</label>
                  <select 
                    className={styles.filterSelect}
                    value={selectedSector}
                    onChange={e => setSelectedSector(e.target.value)}
                  >
                    {SECTORS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Estágio</label>
                  <select 
                    className={styles.filterSelect}
                    value={selectedStage}
                    onChange={e => setSelectedStage(e.target.value)}
                  >
                    {STAGES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Modelo de Negócio</label>
                  <select 
                    className={styles.filterSelect}
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                  >
                    {MODELS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Potencial de Crescimento</label>
                  <select 
                    className={styles.filterSelect}
                    value={selectedGrowth}
                    onChange={e => setSelectedGrowth(e.target.value)}
                  >
                    <option value="Todos">Todos</option>
                    <option value="Muito Alto">Muito Alto</option>
                    <option value="Alto">Alto</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button 
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', width: '100%', color: '#475569' }}
                    onClick={() => {
                      setSelectedCountry('Todos');
                      setSelectedSector('Todos');
                      setSelectedStage('Todos');
                      setSelectedModel('Todos');
                      setSelectedGrowth('Todos');
                      setSearchTerm('');
                    }}
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Grid de Cards de Oportunidades */}
          {filteredDeals.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <Building2 size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <h3 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>Nenhuma oportunidade encontrada</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Tente ajustar os termos de pesquisa ou limpar os filtros selecionados.</p>
            </div>
          ) : (
            <div className={styles.dealsGrid}>
              {filteredDeals.map(deal => {
                const isSaved = watchlist.some(w => w.businessId === deal._id);
                return (
                  <div key={deal._id} className={styles.dealCard}>
                    <div>
                      <div className={styles.dealCardHeader}>
                        <img 
                          src={deal.logo || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150'} 
                          alt={deal.name}
                          className={styles.dealLogo}
                          onError={(e) => { (e.currentTarget as HTMLElement).setAttribute('src', '/abn-logo.png'); }}
                        />
                        <div className={styles.dealHeadInfo}>
                          <span className={styles.dealSectorBadge}>{deal.sector}</span>
                          <h3 className={styles.dealName}>{deal.name}</h3>
                          <div className={styles.dealLocation}>
                            <MapPin size={13} /> {deal.location}
                          </div>
                        </div>

                        {/* Botão de Watchlist */}
                        <button 
                          className={`${styles.watchlistBtn} ${isSaved ? styles.watchlistBtnActive : ''}`}
                          onClick={() => handleToggleWatchlist(deal._id)}
                          title={isSaved ? 'Remover da Watchlist' : 'Guardar na Watchlist'}
                        >
                          <Star size={18} fill={isSaved ? '#f59e0b' : 'none'} />
                        </button>
                      </div>

                      {/* Descrição */}
                      <p className={styles.dealDesc}>{deal.description}</p>

                      {/* Tags */}
                      <div className={styles.tagsRow}>
                        <span className={styles.dealTag}>{deal.stage}</span>
                        <span className={styles.dealTag}>{deal.businessModel}</span>
                        <span className={`${styles.dealTag} ${styles.dealTagScore}`}>Score ABN: {deal.score}/100</span>
                        <span className={`${styles.dealTag} ${styles.dealTagGreen}`}>Potencial: {deal.growthPotential}</span>
                      </div>

                      {/* Painel Financeiro */}
                      <div className={styles.financialSummary}>
                        <div className={styles.finBox}>
                          <span className={styles.finLabel}>Valor Procurado</span>
                          <span className={`${styles.finValue} ${styles.finHighlight}`}>{deal.fundingGoal}</span>
                        </div>
                        <div className={styles.finBox}>
                          <span className={styles.finLabel}>Equity Oferecida</span>
                          <span className={styles.finValue}>{deal.equityOffered}%</span>
                        </div>
                        <div className={styles.finBox}>
                          <span className={styles.finLabel}>Valuation Pre-Money</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{deal.valuation}</span>
                        </div>
                        <div className={styles.finBox}>
                          <span className={styles.finLabel}>Ticket Mínimo</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{deal.minTicket}</span>
                        </div>
                      </div>

                      {/* Tração Rápida */}
                      <div className={styles.tractionRow}>
                        <div>MRR: <span className={styles.tractionMetric}>{deal.traction?.mrr || 'N/D'}</span></div>
                        <div>Crescimento: <span className={styles.tractionMetric} style={{ color: '#059669' }}>{deal.traction?.momGrowth || '+15%'}</span></div>
                        <div>Clientes: <span className={styles.tractionMetric}>{deal.traction?.activeClients || 0}</span></div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className={styles.cardActions}>
                      <button 
                        className={styles.btnDealRoom}
                        onClick={() => openDealRoom(deal, 'overview')}
                      >
                        <ShieldCheck size={16} /> Abrir Deal Room
                      </button>
                      <button 
                        className={styles.btnMeetSmall}
                        onClick={() => openMeetingScheduler(deal)}
                        title="Agendar Pitch Call / Due Diligence"
                      >
                        <Calendar size={15} /> Reunião
                      </button>
                      <button 
                        className={styles.btnMeetSmall}
                        onClick={() => openInquiryModal(deal)}
                        title="Manifestar Interesse / Term Sheet"
                      >
                        <DollarSign size={15} /> Proposta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 2: MINHA WATCHLIST
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'watchlist' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', fontFamily: 'Outfit' }}>
                Startups e Empresas Acompanhadas ({watchlist.length})
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Mantenha um pipeline privado de acompanhamento com notas confidenciais de due diligence.
              </p>
            </div>
            <button 
              className={styles.btnSecondary}
              onClick={() => setMainTab('dealflow')}
              style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
            >
              + Explorar Mais Oportunidades
            </button>
          </div>

          {watchlistDeals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <Star size={48} color="#fcd34d" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>A sua watchlist ainda está vazia</h4>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>
                Clique no ícone de estrela em qualquer oportunidade do Dealflow para adicioná-la a este painel.
              </p>
              <button 
                className={styles.btnPrimary} 
                onClick={() => setMainTab('dealflow')}
              >
                Ver Oportunidades Disponíveis
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {watchlistDeals.map(deal => {
                const watchItem = watchlist.find(w => w.businessId === deal._id);
                const isEditing = editingNotesId === deal._id;

                return (
                  <div key={deal._id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                          src={deal.logo} 
                          alt={deal.name}
                          style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                          onError={(e) => { (e.currentTarget as HTMLElement).setAttribute('src', '/abn-logo.png'); }}
                        />
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff6b00', textTransform: 'uppercase' }}>{deal.sector}</div>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>{deal.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 {deal.location} • Rodada: {deal.fundingGoal} ({deal.equityOffered}%)</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button 
                          className={styles.btnDealRoom}
                          style={{ padding: '0.55rem 1rem' }}
                          onClick={() => openDealRoom(deal)}
                        >
                          <ShieldCheck size={16} /> Deal Room
                        </button>
                        <button 
                          className={styles.btnMeetSmall}
                          onClick={() => openMeetingScheduler(deal)}
                        >
                          <Calendar size={15} /> Agendar Call
                        </button>
                        <button 
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                          onClick={() => handleToggleWatchlist(deal._id)}
                          title="Remover da watchlist"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Bloco de Notas Privadas do Investidor */}
                    <div className={styles.notesArea}>
                      <h6>
                        <FileText size={14} /> Notas Privadas do Investidor (Visíveis apenas para si)
                      </h6>
                      {isEditing ? (
                        <div>
                          <textarea 
                            rows={3} 
                            className={styles.notesTextarea}
                            value={tempNoteText}
                            onChange={e => setTempNoteText(e.target.value)}
                            placeholder="Adicione observações sobre a equipa, dúvidas para o pitch, tese de investimento..."
                          />
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button 
                              className={styles.btnPrimary} 
                              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                              onClick={() => handleSaveNotes(deal._id)}
                            >
                              Salvar Notas
                            </button>
                            <button 
                              className={styles.btnSecondary} 
                              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', color: '#334155', borderColor: '#cbd5e1' }}
                              onClick={() => setEditingNotesId(null)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: watchItem?.notes ? '#451a03' : '#92400e', fontStyle: watchItem?.notes ? 'normal' : 'italic' }}>
                            {watchItem?.notes || 'Nenhuma anotação registada ainda. Clique em "Editar" para adicionar notas.'}
                          </p>
                          <button 
                            style={{ background: 'none', border: '1px solid #fcd34d', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#92400e', cursor: 'pointer' }}
                            onClick={() => {
                              setEditingNotesId(deal._id);
                              setTempNoteText(watchItem?.notes || '');
                            }}
                          >
                            Editar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 3: REUNIÕES & CONTACTOS
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'meetings' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', fontFamily: 'Outfit' }}>
                Reuniões de Due Diligence &amp; Pitch Calls
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Acompanhe as sessões agendadas com os fundadores dos negócios qualificados.
              </p>
            </div>
            <button 
              className={styles.btnPrimary}
              onClick={() => {
                if (deals.length > 0) openMeetingScheduler(deals[0]);
              }}
            >
              + Agendar Nova Reunião
            </button>
          </div>

          {meetings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <Calendar size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>Nenhuma reunião agendada de momento</h4>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>
                Pode agendar sessões virtuais diretamente a partir de qualquer oportunidade no Dealflow.
              </p>
              <button 
                className={styles.btnSecondary} 
                onClick={() => setMainTab('dealflow')}
                style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
              >
                Explorar Oportunidades
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {meetings.map((meet, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,107,0,0.1)', color: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Video size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '6px', background: meet.status === 'agendada' ? '#ecfdf5' : '#f1f5f9', color: meet.status === 'agendada' ? '#059669' : '#64748b' }}>
                          {meet.status}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{meet.businessName}</h4>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '3px' }}>
                        👤 Com: <strong style={{ color: '#334155' }}>{meet.founderName}</strong> • Pauta: <em>{meet.topic}</em>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="#ff6b00" /> {meet.date}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
                        <Clock size={13} /> {meet.time} (Fuso Local)
                      </div>
                    </div>

                    {meet.meetingLink && (
                      <a 
                        href={meet.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnPrimary}
                        style={{ padding: '0.55rem 1.1rem', textDecoration: 'none' }}
                      >
                        <Video size={16} /> Entrar na Sala
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 4: SETORES & MERCADOS
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'markets' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', fontFamily: 'Outfit' }}>
            Radar de Mercados &amp; Setores Estratégicos
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 2rem 0' }}>
            Panorama de atratividade de capital nos ecossistemas da ABN (África Subsariana &amp; CPLP).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,107,0,0.1)', color: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={20} />
                </div>
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>Top Setores por Atração de Capital</h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>💳 Fintech &amp; Pagamentos</span>
                  <strong style={{ color: '#ff6b00' }}>38% do volume</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>🌱 AgriTech &amp; Biorrefinarias</span>
                  <strong style={{ color: '#059669' }}>26% do volume</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>☀️ Energia Solar &amp; Clima</span>
                  <strong style={{ color: '#0284c7' }}>18% do volume</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>🚚 Logística &amp; Supply Chain</span>
                  <strong style={{ color: '#7c3aed' }}>12% do volume</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>🏥 HealthTech &amp; Telemedicina</span>
                  <strong style={{ color: '#db2777' }}>6% do volume</strong>
                </li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(5,150,105,0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={20} />
                </div>
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>Polos Regionais em Destaque</h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>🇬🇼 Guiné-Bissau (Agro &amp; Fintech)</span>
                  <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem' }}>Alta Escalabilidade</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>🇲🇿 Moçambique (Health &amp; Logística)</span>
                  <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem' }}>Mercado Expansivo</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>🇦🇴 Angola (Cargas &amp; Retalho B2B)</span>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem' }}>Volume &amp; Tração</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>🇨🇻 Cabo Verde (Energia &amp; Blue Economy)</span>
                  <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem' }}>Hub Tecnológico</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL COMPLETO: DEAL ROOM (DUE DILIGENCE APROFUNDADO)
      ───────────────────────────────────────────────────────────── */}
      {dealRoomOpen && activeDeal && (
        <div className={styles.modalOverlay} onClick={() => setDealRoomOpen(false)}>
          <div className={styles.dealRoomModal} onClick={e => e.stopPropagation()}>
            
            {/* Header do Deal Room */}
            <div className={styles.modalHeader}>
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setDealRoomOpen(false)}
              >
                <X size={20} />
              </button>

              <div className={styles.modalCompanyHeader}>
                <img 
                  src={activeDeal.logo} 
                  alt={activeDeal.name}
                  className={styles.modalLogo}
                  onError={(e) => { (e.currentTarget as HTMLElement).setAttribute('src', '/abn-logo.png'); }}
                />
                <div className={styles.modalHeaderMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#ff6b00', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {activeDeal.stage}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>• {activeDeal.sector}</span>
                  </div>
                  <h2>{activeDeal.name}</h2>
                  <div className={styles.modalSubMeta}>
                    <span>📍 {activeDeal.location}</span>
                    {activeDeal.website && (
                      <a href={activeDeal.website} target="_blank" rel="noopener noreferrer" style={{ color: '#ff8c38', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={13} /> Website <ExternalLink size={11} />
                      </a>
                    )}
                    <span>Score ABN: <strong style={{ color: '#fff' }}>{activeDeal.score}/100</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Abas Internas do Deal Room */}
            <nav className={styles.dealRoomTabs}>
              <button 
                className={`${styles.drTab} ${dealRoomTab === 'overview' ? styles.drTabActive : ''}`}
                onClick={() => setDealRoomTab('overview')}
              >
                Visão Geral
              </button>
              <button 
                className={`${styles.drTab} ${dealRoomTab === 'pitch' ? styles.drTabActive : ''}`}
                onClick={() => setDealRoomTab('pitch')}
              >
                Pitch &amp; Deck
              </button>
              <button 
                className={`${styles.drTab} ${dealRoomTab === 'traction' ? styles.drTabActive : ''}`}
                onClick={() => setDealRoomTab('traction')}
              >
                Métricas de Tração
              </button>
              <button 
                className={`${styles.drTab} ${dealRoomTab === 'team' ? styles.drTabActive : ''}`}
                onClick={() => setDealRoomTab('team')}
              >
                Equipa &amp; Fundadores
              </button>
              <button 
                className={`${styles.drTab} ${dealRoomTab === 'market' ? styles.drTabActive : ''}`}
                onClick={() => setDealRoomTab('market')}
              >
                Mercado &amp; Estratégia
              </button>
              <button 
                className={`${styles.drTab} ${dealRoomTab === 'terms' ? styles.drTabActive : ''}`}
                onClick={() => setDealRoomTab('terms')}
              >
                Termos do Deal
              </button>
              <button 
                className={`${styles.drTab} ${dealRoomTab === 'action' ? styles.drTabActive : ''}`}
                onClick={() => setDealRoomTab('action')}
                style={{ color: '#ff8c38' }}
              >
                + Proposta / Reunião
              </button>
            </nav>

            {/* Corpo do Deal Room */}
            <div className={styles.modalBody}>
              
              {/* 1. VISÃO GERAL */}
              {dealRoomTab === 'overview' && (
                <div>
                  <h4 className={styles.sectionTitle}><Sparkles size={18} color="#ff6b00" /> Resumo Executivo</h4>
                  <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    {activeDeal.description}
                  </p>

                  <h4 className={styles.sectionTitle}><DollarSign size={18} color="#ff6b00" /> Destaques da Rodada de Captação</h4>
                  <div className={styles.dealTermsGrid}>
                    <div className={styles.termItem}>
                      <h5>Valor Procurado</h5>
                      <p style={{ color: '#ff6b00' }}>{activeDeal.fundingGoal}</p>
                    </div>
                    <div className={styles.termItem}>
                      <h5>Equity Disponível</h5>
                      <p>{activeDeal.equityOffered}%</p>
                    </div>
                    <div className={styles.termItem}>
                      <h5>Valuation Estimado</h5>
                      <p>{activeDeal.valuation}</p>
                    </div>
                    <div className={styles.termItem}>
                      <h5>Ticket Mínimo de Entrada</h5>
                      <p>{activeDeal.minTicket}</p>
                    </div>
                  </div>

                  <h4 className={styles.sectionTitle}><ShieldCheck size={18} color="#ff6b00" /> Documentos no Data Room</h4>
                  <div className={styles.docList}>
                    {(activeDeal.dataRoom && activeDeal.dataRoom.length > 0 ? activeDeal.dataRoom : [
                      { title: 'Executive Summary ABN 2026', category: 'pitch_deck', size: '3.4 MB' },
                      { title: 'Auditoria & Demonstrações Financeiras', category: 'financeiro', size: '2.1 MB' },
                      { title: 'Certidões Comerciais & Estatutos', category: 'legal', size: '1.2 MB' }
                    ]).map((doc, i) => (
                      <div key={i} className={styles.docItem}>
                        <div className={styles.docInfo}>
                          <FileText size={20} color="#ff6b00" />
                          <div>
                            <div className={styles.docTitle}>{doc.title}</div>
                            <span className={styles.docSize}>{doc.category} • {doc.size || 'PDF'}</span>
                          </div>
                        </div>
                        <button 
                          className={styles.btnDownload}
                          onClick={() => window.open(activeDeal.pitchDeckUrl || '#', '_blank')}
                        >
                          <Download size={14} /> Download Seguro
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. PITCH & DECK */}
              {dealRoomTab === 'pitch' && (
                <div>
                  <h4 className={styles.sectionTitle}><Rocket size={18} color="#ff6b00" /> Elevator Pitch</h4>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
                    <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6, color: '#1e293b', fontStyle: 'italic' }}>
                      "{activeDeal.pitch}"
                    </p>
                  </div>

                  <h4 className={styles.sectionTitle}><FileText size={18} color="#ff6b00" /> Pitch Deck Oficial</h4>
                  <div style={{ background: '#0f172a', borderRadius: '16px', padding: '2rem', textAlign: 'center', color: '#fff', marginBottom: '2rem' }}>
                    <FileText size={48} color="#ff6b00" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Apresentação a Investidores (Deck Completo)</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                      Dossiê confidencial com modelo de negócio detalhado, roadmap de expansão, cap table e projeções financeiras.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                      <a 
                        href={activeDeal.pitchDeckUrl || 'https://afrobiznetwork.com'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.btnPrimary}
                        style={{ textDecoration: 'none' }}
                      >
                        <Download size={16} /> Descarregar Pitch Deck (PDF)
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. MÉTRICAS DE TRAÇÃO */}
              {dealRoomTab === 'traction' && (
                <div>
                  <h4 className={styles.sectionTitle}><BarChart3 size={18} color="#ff6b00" /> Indicadores-Chave de Performance (KPIs)</h4>
                  <div className={styles.kpiCardGrid}>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiCardLabel}>Receita Mensal Recorrente (MRR)</div>
                      <div className={`${styles.kpiCardValue} ${styles.kpiGreen}`}>{activeDeal.traction?.mrr}</div>
                    </div>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiCardLabel}>Receita Anualizada (ARR)</div>
                      <div className={styles.kpiCardValue}>{activeDeal.traction?.arr}</div>
                    </div>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiCardLabel}>Crescimento MoM</div>
                      <div className={`${styles.kpiCardValue} ${styles.kpiGreen}`}>{activeDeal.traction?.momGrowth}</div>
                    </div>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiCardLabel}>Clientes Ativos</div>
                      <div className={styles.kpiCardValue}>{activeDeal.traction?.activeClients}</div>
                    </div>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiCardLabel}>Custo de Aquisição (CAC)</div>
                      <div className={styles.kpiCardValue}>{activeDeal.traction?.cac}</div>
                    </div>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiCardLabel}>Lifetime Value (LTV)</div>
                      <div className={styles.kpiCardValue}>{activeDeal.traction?.ltv}</div>
                    </div>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiCardLabel}>Runway Atual</div>
                      <div className={styles.kpiCardValue}>{activeDeal.traction?.runwayMonths} Meses</div>
                    </div>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiCardLabel}>Taxa de Queima (Burn Rate)</div>
                      <div className={styles.kpiCardValue}>{activeDeal.traction?.burnRate}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. EQUIPA */}
              {dealRoomTab === 'team' && (
                <div>
                  <h4 className={styles.sectionTitle}><Users size={18} color="#ff6b00" /> Liderança &amp; Fundadores</h4>
                  <div className={styles.teamGrid}>
                    {(activeDeal.team && activeDeal.team.length > 0 ? activeDeal.team : [
                      { name: activeDeal.owner?.name || 'Fundador Principal', role: 'CEO & Fundador', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
                      { name: 'Equipa Técnica ABN', role: 'CTO & Co-Fundador', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' }
                    ]).map((m, i) => (
                      <div key={i} className={styles.teamCard}>
                        <img 
                          src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'} 
                          alt={m.name}
                          className={styles.teamAvatar}
                          onError={(e) => { (e.currentTarget as HTMLElement).setAttribute('src', '/abn-logo.png'); }}
                        />
                        <div>
                          <div className={styles.teamName}>{m.name}</div>
                          <div className={styles.teamRole}>{m.role}</div>
                          {m.linkedin && (
                            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                              LinkedIn <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeDeal.owner?.email && (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem 1.4rem', borderRadius: '12px', fontSize: '0.88rem', color: '#475569' }}>
                      <strong>Contacto Direto do Fundador:</strong> {activeDeal.owner.name} ({activeDeal.owner.email}) {activeDeal.owner.phone ? `• ${activeDeal.owner.phone}` : ''}
                    </div>
                  )}
                </div>
              )}

              {/* 5. MERCADO */}
              {dealRoomTab === 'market' && (
                <div>
                  <h4 className={styles.sectionTitle}><Globe size={18} color="#ff6b00" /> Dimensionamento de Mercado (TAM / SAM / SOM)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.2rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>TAM (Total Addressable Market)</span>
                      <h4 style={{ margin: '6px 0 0 0', color: '#0f172a', fontSize: '1.1rem' }}>{activeDeal.market?.tam || '$1.5B+ Mercado Regional'}</h4>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.2rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>SAM (Serviceable Available)</span>
                      <h4 style={{ margin: '6px 0 0 0', color: '#0f172a', fontSize: '1.1rem' }}>{activeDeal.market?.sam || '$250M Segmento Acessível'}</h4>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.2rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>SOM (Serviceable Obtainable)</span>
                      <h4 style={{ margin: '6px 0 0 0', color: '#ff6b00', fontSize: '1.1rem' }}>{activeDeal.market?.som || '$35M Alvo a 3 Anos'}</h4>
                    </div>
                  </div>

                  <h4 className={styles.sectionTitle}><Target size={18} color="#ff6b00" /> Diferenciais Competitivos &amp; Moat</h4>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.6, color: '#334155' }}>
                    <strong>Barreiras à Entrada &amp; Vantagem:</strong><br />
                    {activeDeal.market?.differentiators || 'Posição pioneira, tecnologia proprietária, rede de distribuição local exclusiva e certificação ABN.'}
                  </div>
                </div>
              )}

              {/* 6. TERMOS DO DEAL */}
              {dealRoomTab === 'terms' && (
                <div>
                  <h4 className={styles.sectionTitle}><DollarSign size={18} color="#ff6b00" /> Estrutura Proposta da Operação</h4>
                  <div className={styles.dealTermsGrid}>
                    <div className={styles.termItem}>
                      <h5>Instrumento de Investimento</h5>
                      <p>{activeDeal.instrument}</p>
                    </div>
                    <div className={styles.termItem}>
                      <h5>Valor Procurado</h5>
                      <p style={{ color: '#ff6b00' }}>{activeDeal.fundingGoal}</p>
                    </div>
                    <div className={styles.termItem}>
                      <h5>Equity Oferecida</h5>
                      <p>{activeDeal.equityOffered}%</p>
                    </div>
                    <div className={styles.termItem}>
                      <h5>Valuation Estimado</h5>
                      <p>{activeDeal.valuation}</p>
                    </div>
                    <div className={styles.termItem}>
                      <h5>Ticket Mínimo</h5>
                      <p>{activeDeal.minTicket}</p>
                    </div>
                    <div className={styles.termItem}>
                      <h5>Governança &amp; Conselho</h5>
                      <p>1 Assento Observador</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button 
                      className={styles.btnPrimary}
                      style={{ flex: 1, padding: '0.9rem' }}
                      onClick={() => setDealRoomTab('action')}
                    >
                      <DollarSign size={18} /> Submeter Term Sheet / Manifestar Interesse
                    </button>
                    <button 
                      className={styles.btnSecondary}
                      style={{ padding: '0.9rem 1.4rem', color: '#0f172a', borderColor: '#cbd5e1' }}
                      onClick={() => {
                        setDealRoomOpen(false);
                        openMeetingScheduler(activeDeal);
                      }}
                    >
                      <Calendar size={18} /> Agendar Pitch Call
                    </button>
                  </div>
                </div>
              )}

              {/* 7. AÇÃO / PROPOSTA DE INVESTIMENTO */}
              {dealRoomTab === 'action' && (
                <div>
                  <h4 className={styles.sectionTitle}><MessageSquare size={18} color="#ff6b00" /> Manifestação de Interesse / Proposta Confidencial</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Envie os termos preliminares que pretende discutir com o fundador da <strong>{activeDeal.name}</strong>.
                  </p>

                  <form onSubmit={handleSubmitInquiry} className={styles.actionForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Ticket Proposto</label>
                        <input 
                          type="text" 
                          value={proposedTicket} 
                          onChange={e => setProposedTicket(e.target.value)} 
                          placeholder="Ex: $25,000"
                          required 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Instrumento Pretendido</label>
                        <select 
                          value={proposedInstrument} 
                          onChange={e => setProposedInstrument(e.target.value)}
                        >
                          <option value="SAFE">SAFE (Simple Agreement for Future Equity)</option>
                          <option value="Equity">Equity Direto (Quota / Ações)</option>
                          <option value="Dívida Conversível">Dívida Conversível (Convertible Note)</option>
                          <option value="Revenue Share">Participação em Receita</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: '1.2rem' }}>
                      <label>Mensagem Confidencial &amp; Perguntas Preliminares</label>
                      <textarea 
                        rows={4} 
                        value={inquiryMsg}
                        onChange={e => setInquiryMsg(e.target.value)}
                        placeholder="Descreva o perfil do seu fundo/anjo, o valor que agrega além do capital e eventuais dúvidas sobre tração..."
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className={styles.btnPrimary}
                      disabled={submittingInquiry}
                      style={{ width: '100%', padding: '0.85rem' }}
                    >
                      {submittingInquiry ? 'A submeter proposta...' : 'Enviar Manifestação Confidencial'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE AGENDAMENTO DE REUNIÃO ── */}
      {meetingModalOpen && meetingDeal && (
        <div className={styles.modalOverlay} onClick={() => setMeetingModalOpen(false)}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '520px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#0f172a', color: '#ffffff', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase' }}>Pitch Call &amp; Due Diligence</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Outfit' }}>Reunião com {meetingDeal.name}</h3>
              </div>
              <button 
                onClick={() => setMeetingModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleScheduleMeeting} style={{ padding: '1.5rem' }}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Data Pretendida</label>
                  <input 
                    type="date" 
                    value={meetDate} 
                    onChange={e => setMeetDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Horário</label>
                  <input 
                    type="time" 
                    value={meetTime} 
                    onChange={e => setMeetTime(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <label>Pauta da Sessão</label>
                <select 
                  value={meetTopic} 
                  onChange={e => setMeetTopic(e.target.value)}
                >
                  <option value="Due Diligence & Apresentação">Due Diligence &amp; Apresentação Geral</option>
                  <option value="Aprofundamento Financeiro & Cap Table">Aprofundamento Financeiro &amp; Cap Table</option>
                  <option value="Validação de Tecnologia & Produto">Validação de Tecnologia &amp; Produto</option>
                  <option value="Negociação de Term Sheet">Negociação de Term Sheet</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label>Notas adicionais para o fundador</label>
                <textarea 
                  rows={3}
                  value={meetNotes}
                  onChange={e => setMeetNotes(e.target.value)}
                  placeholder="Temas prioritários que gostaria que o fundador preparasse..."
                />
              </div>

              <button 
                type="submit" 
                className={styles.btnPrimary} 
                disabled={savingMeeting}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {savingMeeting ? 'A agendar reunião...' : 'Confirmar Agendamento'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL RÁPIDO DE PROPOSTA ── */}
      {inquiryModalOpen && inquiryDeal && (
        <div className={styles.modalOverlay} onClick={() => setInquiryModalOpen(false)}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '520px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#0f172a', color: '#ffffff', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase' }}>Term Sheet / Manifestação</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Outfit' }}>Proposta para {inquiryDeal.name}</h3>
              </div>
              <button 
                onClick={() => setInquiryModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitInquiry} style={{ padding: '1.5rem' }}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Ticket Proposto</label>
                  <input 
                    type="text" 
                    value={proposedTicket} 
                    onChange={e => setProposedTicket(e.target.value)} 
                    placeholder="Ex: $25,000"
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Instrumento</label>
                  <select 
                    value={proposedInstrument} 
                    onChange={e => setProposedInstrument(e.target.value)}
                  >
                    <option value="SAFE">SAFE</option>
                    <option value="Equity">Equity</option>
                    <option value="Dívida Conversível">Dívida Conversível</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label>Mensagem Confidencial ao Fundador</label>
                <textarea 
                  rows={4}
                  value={inquiryMsg}
                  onChange={e => setInquiryMsg(e.target.value)}
                  placeholder="Escreva os termos de interesse e próximos passos..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className={styles.btnPrimary} 
                disabled={submittingInquiry}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {submittingInquiry ? 'A enviar...' : 'Enviar Proposta'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
