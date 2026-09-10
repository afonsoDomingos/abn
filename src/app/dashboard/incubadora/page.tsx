'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Rocket,
  Building2,
  Users,
  Compass,
  Calendar,
  DollarSign,
  Award,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  X,
  ExternalLink,
  Target,
  FileText,
  AlertCircle,
  Briefcase,
  Star,
  Check,
  Zap,
  Filter
} from 'lucide-react';
import styles from './Incubadora.module.css';

type TabType = 'visao_geral' | 'startups' | 'programas' | 'candidaturas' | 'mentores' | 'investidores' | 'eventos' | 'avaliacoes' | 'scout';

export default function IncubadoraPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('visao_geral');
  const [toastMsg, setToastMsg] = useState('');

  // Radar / Scouting states
  const [scoutStartups, setScoutStartups] = useState<any[]>([]);
  const [scoutSearch, setScoutSearch] = useState('');
  const [scoutSector, setScoutSector] = useState('');
  const [scoutCountry, setScoutCountry] = useState('');
  const [scoutingLoading, setScoutingLoading] = useState(false);

  // Modals
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showStartupModal, setShowStartupModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Forms
  const [programForm, setProgramForm] = useState({ name: '', batch: 'Cohort 2026.1', stage: 'seed', duration: '4 meses', equityPercent: '0', grantAmountEur: '15000', slotsAvailable: '8', applicationDeadline: '', description: '', perks: '' });
  const [startupForm, setStartupForm] = useState({ startupName: '', founderName: '', founderEmail: '', sector: 'Fintech', stage: 'Seed', batch: 'Cohort 2026.1', healthScore: '85', mrrEur: '3000', capitalRaisedEur: '25000', jobsCount: '4', pitchDeckUrl: '', notes: '' });
  const [mentorForm, setMentorForm] = useState({ name: '', role: '', company: '', specialty: 'Estratégia & Captação', email: '', assignedStartups: '' });
  const [investorForm, setInvestorForm] = useState({ investorName: '', fundName: '', investorType: 'vc', targetTicketEur: '50.000 € - 150.000 €', focusSectors: 'Fintech, Agrotech', email: '' });
  const [eventForm, setEventForm] = useState({ title: '', eventType: 'demo_day', date: '', time: '15:00 UTC', location: 'Hub Principal / Online', speakers: '', registrationUrl: '' });
  const [evalForm, setEvalForm] = useState({ startupName: '', evaluator: 'Comité ABN', teamScore: '85', productScore: '80', marketScore: '80', tractionScore: '75', strengths: '', challenges: '', recommendations: '' });
  const [profileForm, setProfileForm] = useState({ organizationName: '', organizationType: 'aceleradora', headline: '', bio: '', country: '', city: '', website: '', foundedYear: '' });

  useEffect(() => {
    fetchIncubatorData();
  }, []);

  const fetchIncubatorData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/incubator');
      const json = await res.json();
      if (json.success) {
        setData(json);
        const inc = json.incubator;
        if (inc) {
          setProfileForm({
            organizationName: inc.organizationName || '',
            organizationType: inc.organizationType || 'aceleradora',
            headline: inc.headline || '',
            bio: inc.bio || '',
            country: inc.country || '',
            city: inc.city || '',
            website: inc.website || '',
            foundedYear: inc.foundedYear || ''
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchScoutStartups = async () => {
    try {
      setScoutingLoading(true);
      const query = new URLSearchParams();
      query.set('view', 'scout');
      if (scoutSector) query.set('sector', scoutSector);
      if (scoutCountry) query.set('country', scoutCountry);
      const res = await fetch(`/api/incubator?${query.toString()}`);
      const json = await res.json();
      if (json.success) {
        setScoutStartups(json.startups || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setScoutingLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'scout') {
      fetchScoutStartups();
    }
  }, [activeTab, scoutSector, scoutCountry]);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAction = async (action: string, payload: object, onSuccess: () => void) => {
    try {
      const res = await fetch('/api/incubator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      const json = await res.json();
      if (json.success) {
        toast(json.message);
        onSuccess();
        fetchIncubatorData();
      } else {
        toast(json.message || 'Erro ao processar');
      }
    } catch (e) {
      toast('Erro de ligação ao servidor.');
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <Building2 size={54} color="#4f46e5" style={{ animation: 'pulse 1.5s infinite' }} />
        <h3 style={{ marginTop: '1rem', color: '#0f172a', fontFamily: 'Outfit' }}>A carregar Hub da Incubadora &amp; Aceleradora...</h3>
      </div>
    );
  }

  const inc = data?.incubator || {};
  const metrics = inc.metrics || {};
  const startups = inc.startups || [];
  const programs = inc.programs || [];
  const applications = inc.applications || [];
  const mentors = inc.mentors || [];
  const investors = inc.investors || [];
  const events = inc.events || [];
  const evaluations = inc.evaluations || [];

  return (
    <div className={styles.container}>
      {toastMsg && <div className={styles.toast}>{toastMsg}</div>}

      {/* Hero Banner Executivo */}
      <div className={styles.heroCard}>
        <div className={styles.heroContent}>
          <div>
            <div className={styles.badgeTag}>
              <Award size={13} /> {inc.organizationType === 'aceleradora' ? 'Aceleradora Oficial ABN' : 'Hub de Incubação ABN'}
            </div>
            <h1 className={styles.heroTitle}>{inc.organizationName || 'Hub de Incubação & Aceleração'}</h1>
            <p className={styles.heroSubtitle}>
              {inc.headline || 'Gestão integrada de coortes de aceleração, avaliação contínua de startups, mentores, investidores e scouting no ecossistema ABN.'}
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#a5b4fc', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📍 {inc.city || 'Bissau'}, {inc.country || 'Guiné-Bissau'}</span>
              <span>📅 Fundada em {inc.foundedYear || '2022'}</span>
              {inc.website && (
                <a href={inc.website} target="_blank" rel="noreferrer" style={{ color: '#c7d2fe', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  {inc.website.replace('https://', '')} <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => setShowStartupModal(true)}>
              <Plus size={16} /> Adicionar Startup
            </button>
            <button className={styles.btnOutline} style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }} onClick={() => setShowProgramModal(true)}>
              <Rocket size={15} /> Novo Programa
            </button>
            <button className={styles.btnOutline} style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }} onClick={() => setShowProfileModal(true)}>
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsBar}>
        <button className={`${styles.tabButton} ${activeTab === 'visao_geral' ? styles.tabActive : ''}`} onClick={() => setActiveTab('visao_geral')}>
          <TrendingUp size={16} /> Visão Geral &amp; Resultados
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'startups' ? styles.tabActive : ''}`} onClick={() => setActiveTab('startups')}>
          <Rocket size={16} /> Startups ({startups.length})
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'programas' ? styles.tabActive : ''}`} onClick={() => setActiveTab('programas')}>
          <Building2 size={16} /> Programas ({programs.length})
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'candidaturas' ? styles.tabActive : ''}`} onClick={() => setActiveTab('candidaturas')}>
          <Target size={16} /> Candidaturas ({applications.length})
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'mentores' ? styles.tabActive : ''}`} onClick={() => setActiveTab('mentores')}>
          <Users size={16} /> Mentores ({mentors.length})
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'investidores' ? styles.tabActive : ''}`} onClick={() => setActiveTab('investidores')}>
          <DollarSign size={16} /> Investidores ({investors.length})
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'eventos' ? styles.tabActive : ''}`} onClick={() => setActiveTab('eventos')}>
          <Calendar size={16} /> Eventos ({events.length})
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'avaliacoes' ? styles.tabActive : ''}`} onClick={() => setActiveTab('avaliacoes')}>
          <FileText size={16} /> Avaliações ({evaluations.length})
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'scout' ? styles.tabActive : ''}`} onClick={() => setActiveTab('scout')} style={{ background: activeTab === 'scout' ? undefined : '#fef3c7', color: activeTab === 'scout' ? undefined : '#b45309', border: activeTab === 'scout' ? undefined : '1px solid #fde68a' }}>
          <Search size={16} /> Radar de Startups 🔍
        </button>
      </div>

      {/* ── TAB 1: VISÃO GERAL & RESULTADOS ── */}
      {activeTab === 'visao_geral' && (
        <>
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}><Rocket size={20} /></div>
              <div>
                <div className={styles.kpiValue}>{metrics.totalStartupsIncubated || startups.length}</div>
                <div className={styles.kpiLabel}>Total Incubadas</div>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Zap size={20} /></div>
              <div>
                <div className={styles.kpiValue}>{metrics.activeStartups || 12}</div>
                <div className={styles.kpiLabel}>Ativas em Cohorte</div>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>💰</div>
              <div>
                <div className={styles.kpiValue}>{(metrics.totalCapitalRaisedEur || 1450000).toLocaleString('pt-PT')} €</div>
                <div className={styles.kpiLabel}>Capital Levantado</div>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>👥</div>
              <div>
                <div className={styles.kpiValue}>{metrics.jobsCreated || 185}</div>
                <div className={styles.kpiLabel}>Empregos Criados</div>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>📈</div>
              <div>
                <div className={styles.kpiValue}>{metrics.survivalRatePercent || 82}%</div>
                <div className={styles.kpiLabel}>Taxa de Sobrevivência</div>
              </div>
            </div>
          </div>

          {/* Quick Summary Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Próximo Demo Day */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#ede9fe', color: '#6d28d9', padding: '4px 10px', borderRadius: '20px' }}>
                  Próximo Grande Marco
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>28 de Maio, 2026</span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>Demo Day ABN Acelera 2026</h3>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
                Apresentação ao vivo de 8 startups finalistas perante uma banca de investidores anjo e fundos de capital de risco da CPLP e Europa.
              </p>
              <button className={styles.btnPrimary} style={{ fontSize: '0.82rem', padding: '8px 16px' }} onClick={() => setActiveTab('investidores')}>
                Gerir Investidores Convidados →
              </button>
            </div>

            {/* Candidaturas a Aguardar Decisão */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px' }}>
                  ⏳ Funil de Admissão
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{applications.filter((a: any) => a.status === 'pendente' || a.status === 'entrevista').length} pendentes</span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>Candidaturas em Revisão</h3>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
                Novas startups submeteram pitch decks para a turma de Primavera. Conduza entrevistas e aprove os fundadores selecionados.
              </p>
              <button className={styles.btnPrimary} style={{ fontSize: '0.82rem', padding: '8px 16px', background: '#0284c7' }} onClick={() => setActiveTab('candidaturas')}>
                Avaliar Candidaturas ({applications.length}) →
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 2: STARTUPS INCUBADAS ── */}
      {activeTab === 'startups' && (
        <>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Rocket size={22} color="#4f46e5" /> Portfólio de Startups ({startups.length})
              </h2>
              <p className={styles.sectionSubtitle}>
                Acompanhamento em tempo real da evolução, saúde diagnóstica, tração e captação das startups da incubadora.
              </p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowStartupModal(true)}>
              <Plus size={16} /> Adicionar Startup
            </button>
          </div>

          <div className={styles.cardsGrid}>
            {startups.map((s: any, idx: number) => {
              const health = s.healthScore || 80;
              const healthColor = health >= 80 ? '#16a34a' : health >= 65 ? '#d97706' : '#dc2626';
              return (
                <div key={idx} className={styles.startupCard}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span className={`${styles.statusPill} ${s.status === 'ativa' ? styles.statusAtiva : s.status === 'graduada' ? styles.statusGraduada : styles.statusRisco}`}>
                        {s.status === 'ativa' ? 'Ativa' : s.status === 'graduada' ? 'Graduada' : 'Em Risco'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{s.batch}</span>
                    </div>

                    <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>{s.startupName}</h3>
                    <p style={{ margin: '0 0 10px', fontSize: '0.84rem', color: '#64748b' }}>
                      {s.founderName || 'Fundador'} · {s.sector} · {s.stage}
                    </p>

                    {/* Health Score */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700 }}>
                      <span style={{ color: '#475569' }}>Diagnóstico de Saúde</span>
                      <span style={{ color: healthColor }}>{health}/100</span>
                    </div>
                    <div className={styles.healthBarContainer}>
                      <div className={styles.healthBar} style={{ width: `${health}%`, background: healthColor }} />
                    </div>

                    {/* KPIs Mini Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>MRR</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{(s.mrrEur || 0).toLocaleString('pt-PT')} €</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>CAPTAÇÃO</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4f46e5' }}>{(s.capitalRaisedEur || 0).toLocaleString('pt-PT')} €</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>EMPREGOS</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#16a34a' }}>{s.jobsCount || 2}</div>
                      </div>
                    </div>

                    {s.notes && (
                      <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#475569', fontStyle: 'italic', background: '#f1f5f9', padding: '8px 12px', borderRadius: '10px' }}>
                        "{s.notes}"
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button
                      className={styles.btnOutline}
                      style={{ flex: 1, padding: '7px 10px', fontSize: '0.78rem' }}
                      onClick={() => {
                        setEvalForm(prev => ({ ...prev, startupName: s.startupName }));
                        setShowEvalModal(true);
                      }}
                    >
                      <Award size={14} /> Avaliar
                    </button>
                    {s.pitchDeckUrl && (
                      <a href={s.pitchDeckUrl} target="_blank" rel="noreferrer" className={styles.btnOutline} style={{ padding: '7px 10px', fontSize: '0.78rem' }}>
                        Deck <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── TAB 3: PROGRAMAS & COHORTES ── */}
      {activeTab === 'programas' && (
        <>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Building2 size={22} color="#4f46e5" /> Programas &amp; Turmas de Aceleração ({programs.length})
              </h2>
              <p className={styles.sectionSubtitle}>
                Crie e gerencie chamadas abertas, bolsas financeiras, contrapartidas e cronograma das cohortes.
              </p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowProgramModal(true)}>
              <Plus size={16} /> Criar Programa
            </button>
          </div>

          <div className={styles.cardsGrid}>
            {programs.map((p: any, idx: number) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: p.status === 'inscricoes_abertas' ? '#dcfce7' : '#f1f5f9', color: p.status === 'inscricoes_abertas' ? '#15803d' : '#475569' }}>
                    {p.status === 'inscricoes_abertas' ? '🟢 Inscrições Abertas' : p.status === 'em_andamento' ? '⏳ Em Andamento' : '📅 Brevemente'}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4f46e5' }}>{p.batch}</span>
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>{p.name}</h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
                  {p.description || 'Programa intensivo focado em validação de mercado, modelo financeiro e escalabilidade.'}
                </p>

                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#334155' }}>
                  <div><strong>Duração:</strong> {p.duration} · <strong>Estágio:</strong> {p.stage?.toUpperCase()}</div>
                  <div>💰 <strong>Bolsa / Grant:</strong> {(p.grantAmountEur || 0).toLocaleString('pt-PT')} € {p.equityPercent ? `(${p.equityPercent}% equity)` : '(Equity-Free)'}</div>
                  <div>👥 <strong>Vagas:</strong> {p.slotsAvailable} startups</div>
                  {p.applicationDeadline && <div>📅 <strong>Prazo:</strong> {p.applicationDeadline}</div>}
                </div>

                {p.perks && p.perks.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Benefícios incluídos:</div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {p.perks.map((perk: string, i: number) => (
                        <li key={i}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB 4: CANDIDATURAS RECEBIDAS ── */}
      {activeTab === 'candidaturas' && (
        <>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Target size={22} color="#4f46e5" /> Funil de Seleção &amp; Candidaturas ({applications.length})
              </h2>
              <p className={styles.sectionSubtitle}>
                Avalie os pitch decks submetidos, pontue as equipas e aprove novos fundadores para as turmas.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {applications.map((app: any, idx: number) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>{app.startupName}</h3>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: app.status === 'aprovada' ? '#dcfce7' : app.status === 'entrevista' ? '#e0f2fe' : app.status === 'rejeitada' ? '#fee2e2' : '#fef3c7',
                      color: app.status === 'aprovada' ? '#15803d' : app.status === 'entrevista' ? '#0369a1' : app.status === 'rejeitada' ? '#b91c1c' : '#b45309'
                    }}>
                      {app.status === 'aprovada' ? '🟢 Aprovada' : app.status === 'entrevista' ? '🔵 Em Entrevista' : app.status === 'rejeitada' ? '🔴 Rejeitada' : '⏳ Pendente'}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 8px', fontSize: '0.84rem', color: '#64748b' }}>
                    👤 <strong>{app.founderName}</strong> ({app.founderEmail} · {app.founderPhone}) · 🌍 {app.country}
                  </p>
                  <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                    "{app.pitchSummary}"
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Programa: <strong>{app.programApplied}</strong> · Estágio: {app.stage} · Submetido: {new Date(app.submittedAt).toLocaleDateString('pt-PT')}
                  </div>
                  {app.reviewerNotes && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#0284c7', background: '#f0f9ff', padding: '6px 12px', borderRadius: '8px' }}>
                      📝 Nota do Comité: {app.reviewerNotes} (Nota: {app.evaluationScore}/100)
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className={styles.btnPrimary}
                    style={{ background: '#16a34a', fontSize: '0.8rem', padding: '8px 14px' }}
                    onClick={() => handleAction('review_application', { applicationId: app._id, newStatus: 'aprovada', reviewerNotes: 'Aprovada para a turma!', evaluationScore: 90 }, () => {})}
                  >
                    <Check size={14} /> Aprovar
                  </button>
                  <button
                    className={styles.btnOutline}
                    style={{ color: '#0284c7', borderColor: '#0284c7', fontSize: '0.8rem', padding: '8px 14px' }}
                    onClick={() => handleAction('review_application', { applicationId: app._id, newStatus: 'entrevista', reviewerNotes: 'Entrevista de alinhamento convocada.' }, () => {})}
                  >
                    Entrevista
                  </button>
                  <button
                    className={styles.btnOutline}
                    style={{ color: '#dc2626', borderColor: '#dc2626', fontSize: '0.8rem', padding: '8px 14px' }}
                    onClick={() => handleAction('review_application', { applicationId: app._id, newStatus: 'rejeitada', reviewerNotes: 'Perfil fora do escopo da coorte.' }, () => {})}
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB 5: BOLSA DE MENTORES ── */}
      {activeTab === 'mentores' && (
        <>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Users size={22} color="#4f46e5" /> Rede de Mentores da Incubadora ({mentors.length})
              </h2>
              <p className={styles.sectionSubtitle}>
                Especialistas seniores alocados para sessões 1:1 e conselho estratégico aos fundadores.
              </p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowMentorModal(true)}>
              <Plus size={16} /> Adicionar Mentor
            </button>
          </div>

          <div className={styles.cardsGrid}>
            {mentors.map((m: any, idx: number) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {m.avatar || '🧑‍🏫'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>{m.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.role} · {m.company}</div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', fontSize: '0.82rem', color: '#334155', marginBottom: '12px' }}>
                  <strong>Especialidade:</strong> {m.specialty}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>⭐ Avaliação: <strong>{m.rating || 5.0}/5.0</strong></span>
                  <span>💬 {m.sessionsCompleted || 0} sessões concluídas</span>
                </div>

                {m.assignedStartups && m.assignedStartups.length > 0 && (
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                    <strong>Startups acompanhadas:</strong> {m.assignedStartups.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB 6: INVESTIDORES & DEAL ROOM ── */}
      {activeTab === 'investidores' && (
        <>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <DollarSign size={22} color="#4f46e5" /> Rede de Investidores &amp; Deal Room ({investors.length})
              </h2>
              <p className={styles.sectionSubtitle}>
                Fundos de capital de risco e business angels parceiros convidados para os Demo Days e rodadas de captação.
              </p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowInvestorModal(true)}>
              <Plus size={16} /> Adicionar Investidor
            </button>
          </div>

          <div className={styles.cardsGrid}>
            {investors.map((inv: any, idx: number) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: '#ede9fe', color: '#6d28d9' }}>
                    {inv.investorType?.toUpperCase() || 'VC'}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>{inv.investorName}</h3>
                <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '12px' }}>{inv.fundName || 'Fundo Independente'}</div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                  <div>💰 <strong>Ticket Alvo:</strong> {inv.targetTicketEur}</div>
                  <div>🏷️ <strong>Setores:</strong> {Array.isArray(inv.focusSectors) ? inv.focusSectors.join(', ') : inv.focusSectors}</div>
                  <div>✉️ <strong>Contacto:</strong> {inv.email || 'deals@abn.network'}</div>
                </div>

                {inv.interestedStartups && inv.interestedStartups.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
                    Startups no radar: {inv.interestedStartups.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB 7: EVENTOS & DEMO DAYS ── */}
      {activeTab === 'eventos' && (
        <>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Calendar size={22} color="#4f46e5" /> Calendário de Eventos &amp; Demo Days ({events.length})
              </h2>
              <p className={styles.sectionSubtitle}>
                Bancas avaliadoras, masterclasses práticas e apresentações para investidores.
              </p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowEventModal(true)}>
              <Plus size={16} /> Agendar Evento
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {events.map((ev: any, idx: number) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                    {ev.eventType?.replace('_', ' ')}
                  </span>
                  <h3 style={{ margin: '6px 0 4px', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>{ev.title}</h3>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    📅 {ev.date} às {ev.time} · 📍 {ev.location}
                  </div>
                  {ev.speakers && <div style={{ fontSize: '0.8rem', color: '#4f46e5', marginTop: '4px' }}>🎤 Oradores / Banca: {ev.speakers}</div>}
                </div>

                {ev.registrationUrl && (
                  <a href={ev.registrationUrl} target="_blank" rel="noreferrer" className={styles.btnOutline} style={{ fontSize: '0.82rem' }}>
                    Link de Acesso <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB 8: AVALIAÇÕES DIAGNÓSTICAS ── */}
      {activeTab === 'avaliacoes' && (
        <>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <FileText size={22} color="#4f46e5" /> Relatórios de Avaliação Diagnóstica ({evaluations.length})
              </h2>
              <p className={styles.sectionSubtitle}>
                Diagnósticos periódicos de maturidade e evolução dos fundadores nos critérios de Equipa, Produto, Mercado e Tração.
              </p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowEvalModal(true)}>
              <Plus size={16} /> Nova Avaliação
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {evaluations.map((ev: any, idx: number) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>{ev.startupName}</h3>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#4f46e5', background: '#ede9fe', padding: '4px 14px', borderRadius: '20px' }}>
                    Score: {ev.overallScore || 80}/100
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                  📅 Data: {ev.evaluationDate} · 👤 Avaliador: {ev.evaluator}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Equipa</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{ev.teamScore}/100</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Produto</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{ev.productScore}/100</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Mercado</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{ev.marketScore}/100</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Tração</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{ev.tractionScore}/100</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  {ev.strengths && <div><strong>Fortalezas:</strong> <span style={{ color: '#16a34a' }}>{ev.strengths}</span></div>}
                  {ev.challenges && <div><strong>Desafios:</strong> <span style={{ color: '#dc2626' }}>{ev.challenges}</span></div>}
                  {ev.recommendations && <div><strong>Recomendações:</strong> <span style={{ color: '#4f46e5' }}>{ev.recommendations}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB 9: RADAR DE STARTUPS (DESCOBERTA / SCOUTING) ── */}
      {activeTab === 'scout' && (
        <>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Search size={22} color="#4f46e5" /> Radar de Startups do Ecossistema ABN
              </h2>
              <p className={styles.sectionSubtitle}>
                Pesquise ativamente startups registadas na rede ABN para recrutar e convidar para as próximas turmas de aceleração.
              </p>
            </div>
          </div>

          {/* Search Filters */}
          <div className={styles.radarSearchBox}>
            <input
              type="text"
              className={styles.radarInput}
              placeholder="Procurar por nome da startup ou palavra-chave..."
              value={scoutSearch}
              onChange={e => setScoutSearch(e.target.value)}
            />
            <select className={styles.formSelect} style={{ width: 'auto', minWidth: '160px' }} value={scoutSector} onChange={e => setScoutSector(e.target.value)}>
              <option value="">Todos os Setores</option>
              <option value="Fintech">Fintech</option>
              <option value="Agrotech">Agrotech</option>
              <option value="Logística">Logística</option>
              <option value="Healthtech">Healthtech</option>
              <option value="Cleantech">Cleantech & Energia</option>
              <option value="Edtech">Edtech</option>
            </select>
            <select className={styles.formSelect} style={{ width: 'auto', minWidth: '160px' }} value={scoutCountry} onChange={e => setScoutCountry(e.target.value)}>
              <option value="">Todos os Países</option>
              <option value="Guiné-Bissau">Guiné-Bissau</option>
              <option value="Angola">Angola</option>
              <option value="Moçambique">Moçambique</option>
              <option value="Cabo Verde">Cabo Verde</option>
              <option value="Portugal">Portugal</option>
            </select>
            <button className={styles.btnPrimary} onClick={fetchScoutStartups}>
              <Filter size={15} /> Filtrar
            </button>
          </div>

          {scoutingLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>A pesquisar no radar ABN...</div>
          ) : (
            <div className={styles.cardsGrid}>
              {scoutStartups
                .filter(s => !scoutSearch || s.name.toLowerCase().includes(scoutSearch.toLowerCase()) || s.headline.toLowerCase().includes(scoutSearch.toLowerCase()))
                .map((sc: any, idx: number) => (
                  <div key={idx} className={styles.startupCard}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: '12px' }}>
                          {sc.stage}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>🌍 {sc.country}</span>
                      </div>

                      <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>{sc.name}</h3>
                      <div style={{ fontSize: '0.82rem', color: '#4f46e5', fontWeight: 700, marginBottom: '8px' }}>
                        👤 {sc.founder} · 🏷️ {sc.sector}
                      </div>

                      <p style={{ margin: '0 0 12px', fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                        {sc.headline}
                      </p>

                      <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                        <div>💵 <strong>MRR:</strong> {sc.mrr} · 📈 <strong>Tração:</strong> {sc.traction}</div>
                        <div>💰 <strong>Captação Procurada:</strong> {sc.seeking}</div>
                      </div>
                    </div>

                    <button
                      className={styles.btnPrimary}
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
                      onClick={() => {
                        handleAction('add_startup', {
                          startupName: sc.name,
                          founderName: sc.founder,
                          founderEmail: sc.contact,
                          sector: sc.sector,
                          stage: sc.stage,
                          notes: `Startup convidada via Radar ABN (${sc.seeking})`
                        }, () => {});
                      }}
                    >
                      <Plus size={15} /> Convidar para a Incubadora
                    </button>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {/* ── MODAIS ── */}

      {/* Modal 1: Adicionar Startup */}
      {showStartupModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Adicionar Startup ao Portfólio</h3>
              <button className={styles.closeButton} onClick={() => setShowStartupModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome da Startup *</label>
              <input type="text" className={styles.formInput} value={startupForm.startupName} onChange={e => setStartupForm({ ...startupForm, startupName: e.target.value })} placeholder="ex: GuinéPay" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Fundador / CEO</label>
                <input type="text" className={styles.formInput} value={startupForm.founderName} onChange={e => setStartupForm({ ...startupForm, founderName: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input type="email" className={styles.formInput} value={startupForm.founderEmail} onChange={e => setStartupForm({ ...startupForm, founderEmail: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Setor</label>
                <input type="text" className={styles.formInput} value={startupForm.sector} onChange={e => setStartupForm({ ...startupForm, sector: e.target.value })} placeholder="Fintech, Agrotech..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Estágio</label>
                <select className={styles.formSelect} value={startupForm.stage} onChange={e => setStartupForm({ ...startupForm, stage: e.target.value })}>
                  <option value="Ideação">Ideação</option>
                  <option value="MVP">MVP</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Tração">Tração</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>MRR (€)</label>
                <input type="number" className={styles.formInput} value={startupForm.mrrEur} onChange={e => setStartupForm({ ...startupForm, mrrEur: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Captação (€)</label>
                <input type="number" className={styles.formInput} value={startupForm.capitalRaisedEur} onChange={e => setStartupForm({ ...startupForm, capitalRaisedEur: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Empregos</label>
                <input type="number" className={styles.formInput} value={startupForm.jobsCount} onChange={e => setStartupForm({ ...startupForm, jobsCount: e.target.value })} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Observações / Foco de Mentoria</label>
              <textarea className={styles.formTextarea} value={startupForm.notes} onChange={e => setStartupForm({ ...startupForm, notes: e.target.value })} placeholder="ex: Precisa de suporte na expansão comercial..." />
            </div>
            <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleAction('add_startup', startupForm, () => setShowStartupModal(false))}>
              Integrar no Portfólio
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: Criar Programa */}
      {showProgramModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Criar Programa de Aceleração</h3>
              <button className={styles.closeButton} onClick={() => setShowProgramModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome do Programa *</label>
              <input type="text" className={styles.formInput} value={programForm.name} onChange={e => setProgramForm({ ...programForm, name: e.target.value })} placeholder="ex: Acelera Bissau Tech 2026" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Turma / Cohort</label>
                <input type="text" className={styles.formInput} value={programForm.batch} onChange={e => setProgramForm({ ...programForm, batch: e.target.value })} placeholder="Cohort 2026.1" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Duração</label>
                <input type="text" className={styles.formInput} value={programForm.duration} onChange={e => setProgramForm({ ...programForm, duration: e.target.value })} placeholder="ex: 16 semanas" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bolsa Financeira (€)</label>
                <input type="number" className={styles.formInput} value={programForm.grantAmountEur} onChange={e => setProgramForm({ ...programForm, grantAmountEur: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Vagas</label>
                <input type="number" className={styles.formInput} value={programForm.slotsAvailable} onChange={e => setProgramForm({ ...programForm, slotsAvailable: e.target.value })} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Descrição do Programa</label>
              <textarea className={styles.formTextarea} value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Benefícios (separados por vírgula)</label>
              <input type="text" className={styles.formInput} value={programForm.perks} onChange={e => setProgramForm({ ...programForm, perks: e.target.value })} placeholder="Mentoria 1:1, Demo Day, Créditos Cloud" />
            </div>
            <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleAction('create_program', programForm, () => setShowProgramModal(false))}>
              Publicar Programa
            </button>
          </div>
        </div>
      )}

      {/* Modal 3: Adicionar Mentor */}
      {showMentorModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Vincular Mentor à Incubadora</h3>
              <button className={styles.closeButton} onClick={() => setShowMentorModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome Completo *</label>
              <input type="text" className={styles.formInput} value={mentorForm.name} onChange={e => setMentorForm({ ...mentorForm, name: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cargo / Função</label>
                <input type="text" className={styles.formInput} value={mentorForm.role} onChange={e => setMentorForm({ ...mentorForm, role: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Empresa / Instituição</label>
                <input type="text" className={styles.formInput} value={mentorForm.company} onChange={e => setMentorForm({ ...mentorForm, company: e.target.value })} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Especialidade Principal</label>
              <input type="text" className={styles.formInput} value={mentorForm.specialty} onChange={e => setMentorForm({ ...mentorForm, specialty: e.target.value })} placeholder="Finanças, Growth Marketing, IA..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input type="email" className={styles.formInput} value={mentorForm.email} onChange={e => setMentorForm({ ...mentorForm, email: e.target.value })} />
            </div>
            <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleAction('add_mentor', mentorForm, () => setShowMentorModal(false))}>
              Vincular Mentor
            </button>
          </div>
        </div>
      )}

      {/* Modal 4: Adicionar Investidor */}
      {showInvestorModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Registar Investidor Parceiro</h3>
              <button className={styles.closeButton} onClick={() => setShowInvestorModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome do Investidor *</label>
              <input type="text" className={styles.formInput} value={investorForm.investorName} onChange={e => setInvestorForm({ ...investorForm, investorName: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome do Fundo</label>
                <input type="text" className={styles.formInput} value={investorForm.fundName} onChange={e => setInvestorForm({ ...investorForm, fundName: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tipo de Investidor</label>
                <select className={styles.formSelect} value={investorForm.investorType} onChange={e => setInvestorForm({ ...investorForm, investorType: e.target.value })}>
                  <option value="vc">Venture Capital (VC)</option>
                  <option value="angel">Business Angel</option>
                  <option value="family_office">Family Office</option>
                  <option value="impacto">Fundo de Impacto</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Ticket Médio</label>
              <input type="text" className={styles.formInput} value={investorForm.targetTicketEur} onChange={e => setInvestorForm({ ...investorForm, targetTicketEur: e.target.value })} placeholder="ex: 25.000 € - 100.000 €" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Setores de Foco (vírgula)</label>
              <input type="text" className={styles.formInput} value={investorForm.focusSectors} onChange={e => setInvestorForm({ ...investorForm, focusSectors: e.target.value })} placeholder="Fintech, Agrotech, Saúde..." />
            </div>
            <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleAction('add_investor', investorForm, () => setShowInvestorModal(false))}>
              Registar no Deal Room
            </button>
          </div>
        </div>
      )}

      {/* Modal 5: Agendar Evento */}
      {showEventModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Agendar Evento / Demo Day</h3>
              <button className={styles.closeButton} onClick={() => setShowEventModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Título do Evento *</label>
              <input type="text" className={styles.formInput} value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="ex: Demo Day ABN Acelera 2026" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tipo</label>
                <select className={styles.formSelect} value={eventForm.eventType} onChange={e => setEventForm({ ...eventForm, eventType: e.target.value })}>
                  <option value="demo_day">Demo Day</option>
                  <option value="pitch_session">Pitch Session</option>
                  <option value="workshop">Workshop</option>
                  <option value="masterclass">Masterclass</option>
                  <option value="office_hours">Office Hours</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Data</label>
                <input type="date" className={styles.formInput} value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Localização</label>
              <input type="text" className={styles.formInput} value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} />
            </div>
            <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleAction('schedule_event', eventForm, () => setShowEventModal(false))}>
              Publicar Evento
            </button>
          </div>
        </div>
      )}

      {/* Modal 6: Nova Avaliação Diagnóstica */}
      {showEvalModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Avaliação Diagnóstica da Startup</h3>
              <button className={styles.closeButton} onClick={() => setShowEvalModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Startup Avaliada *</label>
              <select className={styles.formSelect} value={evalForm.startupName} onChange={e => setEvalForm({ ...evalForm, startupName: e.target.value })}>
                <option value="">Selecione a Startup...</option>
                {startups.map((s: any, idx: number) => (
                  <option key={idx} value={s.startupName}>{s.startupName}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Equipa</label>
                <input type="number" min="0" max="100" className={styles.formInput} value={evalForm.teamScore} onChange={e => setEvalForm({ ...evalForm, teamScore: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Produto</label>
                <input type="number" min="0" max="100" className={styles.formInput} value={evalForm.productScore} onChange={e => setEvalForm({ ...evalForm, productScore: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mercado</label>
                <input type="number" min="0" max="100" className={styles.formInput} value={evalForm.marketScore} onChange={e => setEvalForm({ ...evalForm, marketScore: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tração</label>
                <input type="number" min="0" max="100" className={styles.formInput} value={evalForm.tractionScore} onChange={e => setEvalForm({ ...evalForm, tractionScore: e.target.value })} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fortalezas Identificadas</label>
              <input type="text" className={styles.formInput} value={evalForm.strengths} onChange={e => setEvalForm({ ...evalForm, strengths: e.target.value })} placeholder="ex: Boa execução de produto..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Desafios Críticos</label>
              <input type="text" className={styles.formInput} value={evalForm.challenges} onChange={e => setEvalForm({ ...evalForm, challenges: e.target.value })} placeholder="ex: Dificuldade na captação B2B..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Recomendações do Comité</label>
              <textarea className={styles.formTextarea} value={evalForm.recommendations} onChange={e => setEvalForm({ ...evalForm, recommendations: e.target.value })} placeholder="ex: Agendar mentoria de pricing e rever pitch deck." />
            </div>
            <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleAction('submit_evaluation', evalForm, () => setShowEvalModal(false))}>
              Registar Relatório
            </button>
          </div>
        </div>
      )}

      {/* Modal 7: Editar Perfil da Incubadora */}
      {showProfileModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Editar Perfil da Incubadora</h3>
              <button className={styles.closeButton} onClick={() => setShowProfileModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome da Organização</label>
              <input type="text" className={styles.formInput} value={profileForm.organizationName} onChange={e => setProfileForm({ ...profileForm, organizationName: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tipo</label>
                <select className={styles.formSelect} value={profileForm.organizationType} onChange={e => setProfileForm({ ...profileForm, organizationType: e.target.value })}>
                  <option value="aceleradora">Aceleradora</option>
                  <option value="incubadora">Incubadora</option>
                  <option value="hub_inovacao">Hub de Inovação</option>
                  <option value="fabrica_startups">Fábrica de Startups</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ano de Fundação</label>
                <input type="text" className={styles.formInput} value={profileForm.foundedYear} onChange={e => setProfileForm({ ...profileForm, foundedYear: e.target.value })} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Lema / Headline</label>
              <input type="text" className={styles.formInput} value={profileForm.headline} onChange={e => setProfileForm({ ...profileForm, headline: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>País</label>
                <input type="text" className={styles.formInput} value={profileForm.country} onChange={e => setProfileForm({ ...profileForm, country: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cidade</label>
                <input type="text" className={styles.formInput} value={profileForm.city} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Website</label>
              <input type="text" className={styles.formInput} value={profileForm.website} onChange={e => setProfileForm({ ...profileForm, website: e.target.value })} />
            </div>
            <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleAction('update_profile', profileForm, () => setShowProfileModal(false))}>
              Guardar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
