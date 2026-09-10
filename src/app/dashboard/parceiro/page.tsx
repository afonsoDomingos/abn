'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Handshake,
  Building2,
  FileText,
  Calendar,
  Sparkles,
  TrendingUp,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Mail,
  Phone,
  Globe,
  Award,
  AlertCircle,
  FileCheck,
  Megaphone,
  Briefcase,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import styles from './Parceiro.module.css';

export default function ParceiroDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [partnerStatus, setPartnerStatus] = useState<'candidato' | 'em_analise' | 'aprovado'>('candidato');
  const [isApproved, setIsApproved] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'perfil' | 'projetos' | 'eventos' | 'oportunidades' | 'documentos'>('geral');
  const [statusMessage, setStatusMessage] = useState('');

  // Modais
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Formulários
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'Aceleração & Inovação',
    budget: '',
    goals: '',
    startDate: '',
    endDate: ''
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    location: 'Online ABN Meet',
    type: 'Webinar Executivo',
    link: ''
  });

  const [docForm, setDocForm] = useState({
    title: '',
    category: 'Acordo / Protocolo Oficial',
    fileUrl: ''
  });

  const [profileForm, setProfileForm] = useState({
    organizationName: '',
    headline: '',
    sector: '',
    country: '',
    city: '',
    website: '',
    institutionalBio: '',
    focalPointName: '',
    focalPointRole: '',
    focalPointEmail: '',
    focalPointPhone: ''
  });

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/partners');
      const data = await res.json();
      if (data.success) {
        setPartnerData(data);
        setPartnerStatus(data.partnerStatus || 'candidato');
        setIsApproved(data.isApproved || false);

        // Preencher form de perfil
        const p = data.partnerProfile;
        if (p) {
          setProfileForm({
            organizationName: p.organizationName || '',
            headline: p.headline || '',
            sector: p.sector || '',
            country: p.country || '',
            city: p.city || '',
            website: p.website || '',
            institutionalBio: p.institutionalBio || '',
            focalPointName: p.focalPoint?.name || '',
            focalPointRole: p.focalPoint?.role || '',
            focalPointEmail: p.focalPoint?.email || '',
            focalPointPhone: p.focalPoint?.phone || ''
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDemoStatus = async () => {
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_status_demo' })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        setTimeout(() => setStatusMessage(''), 4000);
        fetchPartnerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_project',
          ...projectForm,
          goals: projectForm.goals.split('\n').filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowProjectModal(false);
        setProjectForm({ title: '', description: '', category: 'Aceleração & Inovação', budget: '', goals: '', startDate: '', endDate: '' });
        fetchPartnerData();
      }
    } catch (e) {}
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_event',
          ...eventForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowEventModal(false);
        setEventForm({ title: '', date: '', location: 'Online ABN Meet', type: 'Webinar Executivo', link: '' });
        fetchPartnerData();
      }
    } catch (e) {}
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title) return;
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_document',
          ...docForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowDocModal(false);
        setDocForm({ title: '', category: 'Acordo / Protocolo Oficial', fileUrl: '' });
        fetchPartnerData();
      }
    } catch (e) {}
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          organizationName: profileForm.organizationName,
          headline: profileForm.headline,
          sector: profileForm.sector,
          country: profileForm.country,
          city: profileForm.city,
          website: profileForm.website,
          institutionalBio: profileForm.institutionalBio,
          focalPoint: {
            name: profileForm.focalPointName,
            role: profileForm.focalPointRole,
            email: profileForm.focalPointEmail,
            phone: profileForm.focalPointPhone
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowEditProfileModal(false);
        fetchPartnerData();
      }
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <Handshake size={48} color="#6366f1" style={{ animation: 'bounce 1s infinite' }} />
        <h3 style={{ marginTop: '1rem', color: '#0f172a' }}>Carregando Portal Institucional do Parceiro...</h3>
      </div>
    );
  }

  const profile = partnerData?.partnerProfile || {};
  const metrics = profile.metrics || { startupsSupported: 0, jointInitiatives: 0, capitalMobilized: '0 €', communityReach: 0 };
  const projects = profile.jointProjects || [];
  const events = profile.jointEvents || [];
  const campaigns = profile.campaigns || [];
  const documents = profile.documents || [];
  const abnContacts = partnerData?.abnInstitutionalContacts || [];

  return (
    <div className={styles.container}>
      {/* Mensagem temporária de status */}
      {statusMessage && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.85rem 1.4rem', borderRadius: '14px', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {statusMessage}
        </div>
      )}

      {/* ── Executive Header Banner ── */}
      <div className={styles.executiveBanner}>
        <div className={styles.bannerOrb} />
        <div className={styles.bannerContent}>
          <div>
            {isApproved ? (
              <div className={`${styles.bannerTag} ${styles.bannerTagApproved}`}>
                <ShieldCheck size={14} /> Parceiro Institucional Oficial ABN
              </div>
            ) : (
              <div className={`${styles.bannerTag} ${styles.bannerTagCandidate}`}>
                <Clock size={14} /> Candidatura Institucional em Avaliação
              </div>
            )}

            <h1 className={styles.bannerTitle}>
              {profile.organizationName || 'Organização Parceira'}
            </h1>
            <p className={styles.bannerSubtitle}>
              {profile.headline || 'Parceria estratégica estruturante para empoderamento do ecossistema empresarial e inovação nos países africanos e de língua portuguesa.'}
            </p>
          </div>

          <div className={styles.bannerActions}>
            {isApproved && (
              <button 
                className={styles.btnPrimary}
                onClick={() => setShowProjectModal(true)}
              >
                <Plus size={16} /> Propor Projeto Conjunto
              </button>
            )}

            <Link href="/parceiros" className={styles.btnSecondary}>
              <Globe size={16} /> Página Pública de Parcerias
            </Link>

            {/* Toggle de Demonstração (Permite testar de imediato as duas visões) */}
            <button 
              className={styles.btnDemoToggle}
              onClick={handleToggleDemoStatus}
              title="Alternar entre estado de Candidato e Parceiro Aprovado para testes de desenvolvimento"
            >
              <Layers size={13} /> {isApproved ? 'Ver como Candidato' : 'Simular Aprovação Oficial'}
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         CENÁRIO 1: CANDIDATO A PARCEIRO (Status: candidato / em_analise)
      ───────────────────────────────────────────────────────────── */}
      {!isApproved && (
        <div className={styles.candidateCard}>
          <div className={styles.candidateHeader}>
            <div className={styles.candidateIconBadge}>
              ⏳
            </div>
            <div>
              <h2 className={styles.candidateTitle}>Processo de Adesão &amp; Auditoria Institucional</h2>
              <p className={styles.candidateDesc}>
                A sua candidatura através de <strong>"Torne-se Parceiro ABN"</strong> foi recebida com sucesso e está a ser analisada pela Direção de Relações Institucionais e Parcerias Estratégicas.
              </p>
            </div>
          </div>

          {/* Timeline das 5 Etapas de Validação */}
          <div className={styles.timelineGrid}>
            <div className={`${styles.timelineStep} ${styles.timelineStepDone}`}>
              <div className={`${styles.stepNumber} ${styles.stepNumberDone}`}>✓</div>
              <h4 className={styles.stepTitle}>1. Candidatura Submetida</h4>
              <p className={styles.stepDesc}>Dossiê inicial, categoria e proposta de cooperação registados na plataforma.</p>
            </div>

            <div className={`${styles.timelineStep} ${styles.timelineStepActive}`}>
              <div className={`${styles.stepNumber} ${styles.stepNumberActive}`}>2</div>
              <h4 className={styles.stepTitle}>2. Due Diligence &amp; Conformidade</h4>
              <p className={styles.stepDesc}>Verificação de conformidade jurídica, alinhamento aos ODS e histórico de atuação.</p>
            </div>

            <div className={styles.timelineStep}>
              <div className={`${styles.stepNumber} ${styles.stepNumberPending}`}>3</div>
              <h4 className={styles.stepTitle}>3. Reunião de Alinhamento</h4>
              <p className={styles.stepDesc}>Sessão executiva com a Direção da ABN para definição de metas conjuntas.</p>
            </div>

            <div className={styles.timelineStep}>
              <div className={`${styles.stepNumber} ${styles.stepNumberPending}`}>4</div>
              <h4 className={styles.stepTitle}>4. Protocolo &amp; MOU</h4>
              <p className={styles.stepDesc}>Elaboração e assinatura oficial do Memorando de Entendimento (MOU).</p>
            </div>

            <div className={styles.timelineStep}>
              <div className={`${styles.stepNumber} ${styles.stepNumberPending}`}>5</div>
              <h4 className={styles.stepTitle}>5. Credencial Ativa</h4>
              <p className={styles.stepDesc}>Desbloqueio total do Hub do Parceiro e anúncio oficial na rede ABN.</p>
            </div>
          </div>

          {/* Resumo da Candidatura e Contacto de Apoio */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem', background: '#f8fafc', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Ponto Focal Indicado</span>
              <h4 style={{ margin: '4px 0 2px 0', color: '#0f172a' }}>{profile.focalPoint?.name || 'Não indicado'}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                {profile.focalPoint?.role || 'Representante Institucional'} · {profile.focalPoint?.email || 'N/D'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Contacto Rápido de Suporte</span>
              <h4 style={{ margin: '4px 0 2px 0', color: '#0f172a' }}>Gabinete de Parcerias ABN</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                Email: <a href="mailto:parcerias@afrobiznet.com" style={{ color: '#ff6b00', fontWeight: 700 }}>parcerias@afrobiznet.com</a> · Tel: +245 955 00 1122
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button 
                className={styles.btnPrimary} 
                onClick={handleToggleDemoStatus}
                style={{ fontSize: '0.84rem' }}
              >
                <Sparkles size={16} /> Testar Visão Aprovada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         CENÁRIO 2: PARCEIRO APROVADO (Hub Institucional Completo)
      ───────────────────────────────────────────────────────────── */}
      {isApproved && (
        <>
          {/* Métricas de Resultados da Parceria */}
          <div className={styles.kpisGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIconBox} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                🚀
              </div>
              <div>
                <div className={styles.kpiValue}>{metrics.startupsSupported || 42}</div>
                <div className={styles.kpiLabel}>Startups Apoiadas</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIconBox} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                🤝
              </div>
              <div>
                <div className={styles.kpiValue}>{projects.length || metrics.jointInitiatives || 4}</div>
                <div className={styles.kpiLabel}>Projetos com a ABN</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIconBox} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                💰
              </div>
              <div>
                <div className={styles.kpiValue}>{metrics.capitalMobilized || '70.000 €'}</div>
                <div className={styles.kpiLabel}>Recursos &amp; Fundos</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIconBox} style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                👥
              </div>
              <div>
                <div className={styles.kpiValue}>{Number(metrics.communityReach || 20500).toLocaleString('pt-PT')}</div>
                <div className={styles.kpiLabel}>Alcance Comunitário</div>
              </div>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'geral' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('geral')}
            >
              <TrendingUp size={16} /> Resultados &amp; Visão Geral
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'perfil' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              <Building2 size={16} /> Perfil Institucional
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'projetos' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('projetos')}
            >
              <Handshake size={16} /> Projetos com ABN ({projects.length})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'eventos' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('eventos')}
            >
              <Calendar size={16} /> Eventos &amp; Campanhas ({events.length + campaigns.length})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'oportunidades' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('oportunidades')}
            >
              <Sparkles size={16} /> Oportunidades
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'documentos' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('documentos')}
            >
              <FileText size={16} /> Documentos &amp; Contactos ({documents.length})
            </button>
          </div>

          {/* ── ABA 1: VISÃO GERAL & RESULTADOS ── */}
          {activeTab === 'geral' && (
            <div>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 className={styles.sectionTitle}><TrendingUp size={20} color="#4f46e5" /> Resultados Estratégicos da Cooperação</h3>
                  <p className={styles.sectionSubtitle}>Acompanhe o impacto direto das iniciativas conjuntas entre a sua organização e o ecossistema ABN.</p>
                </div>
              </div>

              {/* Destaque do Protocolo Vigente */}
              <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', border: '1px solid #c7d2fe', borderRadius: '20px', padding: '1.6rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#4f46e5', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    📜
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase' }}>Protocolo de Cooperação ABN</span>
                    <h4 style={{ margin: '3px 0 2px 0', fontSize: '1.1rem', color: '#0f172a' }}>Memorando de Entendimento (MOU) Válido até 2027</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Status: <strong>Ativo &amp; Reconhecido Oficialmente</strong> · Foco: Capacitação e Aceleração de Startups.</p>
                  </div>
                </div>
                <a 
                  href="/docs/protocolo-parceria-abn-oficial.pdf" 
                  target="_blank"
                  className={styles.btnSecondary}
                  style={{ color: '#1e1b4b', background: '#ffffff', borderColor: '#c7d2fe' }}
                >
                  <FileText size={16} /> Ver Protocolo Assinado
                </a>
              </div>

              {/* Projetos Ativos em Destaque */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0f172a' }}>Projetos Conjuntos em Execução</h3>
              <div className={styles.cardsGrid}>
                {projects.slice(0, 2).map((p: any, i: number) => (
                  <div key={i} className={styles.projectCard}>
                    <div>
                      <span className={styles.projectCategory}>{p.category || 'Cooperação'}</span>
                      <h4 className={styles.projectTitle}>{p.title}</h4>
                      <p className={styles.projectDesc}>{p.description}</p>
                      
                      {Array.isArray(p.goals) && p.goals.length > 0 && (
                        <div style={{ margin: '0.8rem 0' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Metas &amp; Entregáveis:</span>
                          <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#64748b' }}>
                            {p.goals.map((g: string, idx: number) => (
                              <li key={idx}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className={styles.projectMeta}>
                      <span>Orçamento: <strong>{p.budget}</strong></span>
                      <span style={{ color: p.status === 'em_andamento' ? '#16a34a' : '#d97706', fontWeight: 700 }}>
                        {p.status === 'em_andamento' ? '🟢 Em Andamento' : '🟡 Planeamento'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ABA 2: PERFIL INSTITUCIONAL ── */}
          {activeTab === 'perfil' && (
            <div>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 className={styles.sectionTitle}><Building2 size={20} color="#4f46e5" /> Perfil Institucional da Organização</h3>
                  <p className={styles.sectionSubtitle}>Gerencie os dados institucionais, apresentação pública e pontos de contacto oficiais da parceria.</p>
                </div>
                <button 
                  className={styles.btnSecondary}
                  style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
                  onClick={() => setShowEditProfileModal(true)}
                >
                  ✏️ Editar Perfil Institucional
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                      {profile.organizationLogo || '🏢'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{profile.organizationName}</h4>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                        {profile.sector} · {profile.city}, {profile.country}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {profile.institutionalBio || 'Organização parceira oficial da ABN AfroBiz Network.'}
                  </p>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.86rem' }}>
                    {profile.website && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} color="#6366f1" />
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>
                          {profile.website}
                        </a>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={16} color="#f59e0b" />
                      <span>Categoria: <strong>{profile.partnerType?.toUpperCase() || 'ESTRATÉGICO'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Ponto Focal Oficial */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.8rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="#4f46e5" /> Ponto Focal &amp; Representante Institucional
                  </h4>
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <h5 style={{ margin: '0 0 2px 0', fontSize: '1.05rem', color: '#0f172a' }}>
                      {profile.focalPoint?.name || 'Não cadastrado'}
                    </h5>
                    <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 700 }}>
                      {profile.focalPoint?.role || 'Coordenador Institucional'}
                    </span>

                    <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={14} color="#94a3b8" /> {profile.focalPoint?.email || 'N/D'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} color="#94a3b8" /> {profile.focalPoint?.phone || 'N/D'}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    O ponto focal recebe as comunicações formais, convocatórias de comitê consultivo e atualizações dos programas conjuntos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── ABA 3: PROJETOS COM ABN ── */}
          {activeTab === 'projetos' && (
            <div>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 className={styles.sectionTitle}><Handshake size={20} color="#4f46e5" /> Projetos Conjuntos com a ABN</h3>
                  <p className={styles.sectionSubtitle}>Iniciativas bilaterais estruturadas, programas de aceleração co-financiados e ações de impacto.</p>
                </div>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => setShowProjectModal(true)}
                >
                  <Plus size={16} /> Propor Novo Projeto
                </button>
              </div>

              {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
                  <Handshake size={42} color="#94a3b8" />
                  <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#0f172a' }}>Nenhum projeto conjunto cadastrado</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Inicie a sua primeira iniciativa conjunta com a ABN clicando no botão acima.</p>
                </div>
              ) : (
                <div className={styles.cardsGrid}>
                  {projects.map((p: any, idx: number) => (
                    <div key={idx} className={styles.projectCard}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span className={styles.projectCategory}>{p.category}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: p.status === 'em_andamento' ? '#16a34a' : (p.status === 'concluido' ? '#3b82f6' : '#d97706') }}>
                            {p.status === 'em_andamento' ? '● Em Andamento' : (p.status === 'concluido' ? '✓ Concluído' : '⏳ Planeamento')}
                          </span>
                        </div>
                        <h4 className={styles.projectTitle}>{p.title}</h4>
                        <p className={styles.projectDesc}>{p.description}</p>

                        {Array.isArray(p.goals) && p.goals.length > 0 && (
                          <div style={{ margin: '0.8rem 0' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Metas Principais:</span>
                            <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#64748b' }}>
                              {p.goals.map((g: string, i: number) => (
                                <li key={i}>{g}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className={styles.projectMeta}>
                        <div>
                          <span>Orçamento: <strong>{p.budget || 'Sob proposta'}</strong></span>
                        </div>
                        <div style={{ fontSize: '0.78rem' }}>
                          {p.startDate} {p.endDate ? `→ ${p.endDate}` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ABA 4: EVENTOS & CAMPANHAS ── */}
          {activeTab === 'eventos' && (
            <div>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 className={styles.sectionTitle}><Calendar size={20} color="#4f46e5" /> Eventos &amp; Campanhas Conjuntas</h3>
                  <p className={styles.sectionSubtitle}>Webinars bilaterais, fóruns de investimento e campanhas de alcance comunitário no ecossistema.</p>
                </div>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => setShowEventModal(true)}
                >
                  <Plus size={16} /> Agendar Evento / Webinar
                </button>
              </div>

              {/* Sub-seção de Eventos */}
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0f172a' }}>Eventos Co-Organizados</h4>
              <div className={styles.cardsGrid} style={{ marginBottom: '2.5rem' }}>
                {events.map((ev: any, idx: number) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#eef2ff', color: '#4f46e5', padding: '3px 8px', borderRadius: '6px' }}>{ev.type}</span>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.05rem', color: '#0f172a' }}>{ev.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>📍 {ev.location} · 📅 {ev.date}</p>
                    </div>

                    <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>● {ev.status?.toUpperCase() || 'CONFIRMADO'}</span>
                      {ev.link && (
                        <a href={ev.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff6b00', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          Aceder à Sala <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-seção de Campanhas */}
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0f172a' }}>Campanhas de Divulgação &amp; Atração</h4>
              <div className={styles.cardsGrid}>
                {campaigns.map((camp: any, idx: number) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px' }}>Campanha Ativa</span>
                    <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.05rem', color: '#0f172a' }}>{camp.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>Canais: <strong>{camp.channel}</strong></p>
                    <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>
                      Impacto estimado: <span style={{ color: '#ff6b00' }}>{camp.reach}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ABA 5: OPORTUNIDADES ── */}
          {activeTab === 'oportunidades' && (
            <div>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 className={styles.sectionTitle}><Sparkles size={20} color="#4f46e5" /> Oportunidades &amp; Desafios de Inovação</h3>
                  <p className={styles.sectionSubtitle}>Lançamento de bolsas, desafios corporativos e linhas de apoio para o ecossistema ABN.</p>
                </div>
                <Link href="/dashboard/oportunidades" className={styles.btnPrimary}>
                  <Plus size={16} /> Publicar Oportunidade
                </Link>
              </div>

              <div className={styles.cardsGrid}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.6rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '8px' }}>Desafio de Inovação Aberta</span>
                  <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.15rem', color: '#0f172a' }}>Desafio Corporativo: Soluções FinTech para Inclusão</h4>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Iniciativa bilateral buscando startups que ofereçam pagamentos offline e microcrédito simplificado para comerciantes de mercados locais.
                  </p>
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Prémio / Piloto: 15.000 €</span>
                    <Link href="/dashboard/oportunidades" style={{ fontSize: '0.82rem', color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
                      Gerir Candidaturas →
                    </Link>
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.6rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#eef2ff', color: '#4f46e5', padding: '3px 10px', borderRadius: '8px' }}>Bolsas &amp; Créditos Cloud</span>
                  <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.15rem', color: '#0f172a' }}>Créditos Cloud &amp; Infraestrutura Tecnológica</h4>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Disponibilização de pacotes de $5,000 em créditos de infraestrutura para startups em fase de MVP graduadas nos programas ABN.
                  </p>
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>20 Startups Beneficiadas</span>
                    <span style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700 }}>Em Atribuição</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ABA 6: DOCUMENTOS & CONTACTOS ── */}
          {activeTab === 'documentos' && (
            <div>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 className={styles.sectionTitle}><FileText size={20} color="#4f46e5" /> Repositório Oficial &amp; Linha Direta ABN</h3>
                  <p className={styles.sectionSubtitle}>Documentos formais, acordos bilaterais assinados e equipa institucional de suporte permanente.</p>
                </div>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => setShowDocModal(true)}
                >
                  <Plus size={16} /> Adicionar Documento
                </button>
              </div>

              {/* Lista de Documentos */}
              <div style={{ marginBottom: '2.5rem' }}>
                {documents.map((doc: any, idx: number) => (
                  <div key={idx} className={styles.docRow}>
                    <div className={styles.docInfo}>
                      <div className={styles.docIcon}>📄</div>
                      <div>
                        <h5 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>{doc.title}</h5>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{doc.category}</span>
                      </div>
                    </div>
                    <a 
                      href={doc.fileUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.btnSecondary}
                      style={{ color: '#0f172a', borderColor: '#cbd5e1', padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                    >
                      <ExternalLink size={14} /> Download / Ver
                    </a>
                  </div>
                ))}
              </div>

              {/* Linha Direta Institucional ABN */}
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={18} color="#4f46e5" /> Contactos Oficiais da Direção ABN
              </h4>
              <div className={styles.contactsGrid}>
                {abnContacts.map((c: any, idx: number) => (
                  <div key={idx} className={styles.contactCard}>
                    <div className={styles.contactRole}>{c.role}</div>
                    <h5 className={styles.contactName}>{c.name}</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={14} color="#6366f1" />
                        <a href={`mailto:${c.email}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>{c.email}</a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} color="#6366f1" />
                        <span>{c.phone}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                        🕒 {c.availability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAIS
      ───────────────────────────────────────────────────────────── */}

      {/* 1. Modal: Propor Projeto Conjunto */}
      {showProjectModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProjectModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Propor Novo Projeto Conjunto com ABN
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowProjectModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título do Projeto *</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  placeholder="Ex: Programa de Capacitação em Energia Solar e PMEs" 
                  required
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Categoria Estratégica</label>
                <select 
                  className={styles.formSelect}
                  value={projectForm.category}
                  onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                >
                  <option value="Aceleração & Inovação">Aceleração &amp; Inovação</option>
                  <option value="Inovação Aberta B2B">Inovação Aberta B2B</option>
                  <option value="Capacitação & Educação">Capacitação &amp; Educação</option>
                  <option value="Financiamento & Linhas de Crédito">Financiamento &amp; Linhas de Crédito</option>
                  <option value="Internacionalização & Exportação">Internacionalização &amp; Exportação</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição &amp; Escopo do Projeto</label>
                <textarea 
                  className={styles.formTextarea} 
                  rows={3} 
                  placeholder="Resuma os objetivos, impacto esperado e estrutura de cooperação..."
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Orçamento Previsto</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    placeholder="Ex: 30.000 €" 
                    value={projectForm.budget}
                    onChange={e => setProjectForm({ ...projectForm, budget: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Data de Início Pretendida</label>
                  <input 
                    type="date" 
                    className={styles.formInput} 
                    value={projectForm.startDate}
                    onChange={e => setProjectForm({ ...projectForm, startDate: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Metas &amp; Entregáveis (1 por linha)</label>
                <textarea 
                  className={styles.formTextarea} 
                  rows={3} 
                  placeholder="20 PMEs formadas&#10;5 contratos-piloto assinados&#10;Relatório de impacto publicado"
                  value={projectForm.goals}
                  onChange={e => setProjectForm({ ...projectForm, goals: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowProjectModal(false)} style={{ color: '#0f172a' }}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Submeter Proposta à ABN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Agendar Evento Conjunto */}
      {showEventModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEventModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Agendar Evento / Webinar Co-Organizado
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowEventModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título do Evento *</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  placeholder="Ex: Fórum de Financiamento Bilateral Lusófono" 
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Data Prevista</label>
                  <input 
                    type="date" 
                    className={styles.formInput} 
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Formato / Tipo</label>
                  <select 
                    className={styles.formSelect}
                    value={eventForm.type}
                    onChange={e => setEventForm({ ...eventForm, type: e.target.value })}
                  >
                    <option value="Webinar Executivo">Webinar Executivo</option>
                    <option value="Mesa Redonda B2B">Mesa Redonda B2B</option>
                    <option value="Conferência Anual">Conferência Anual</option>
                    <option value="Workshop Técnico">Workshop Técnico</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Local ou Link Virtual (Google Meet / Zoom)</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  placeholder="Ex: https://meet.google.com/abn-parceria" 
                  value={eventForm.link}
                  onChange={e => setEventForm({ ...eventForm, link: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowEventModal(false)} style={{ color: '#0f172a' }}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Adicionar Documento */}
      {showDocModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDocModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Registar Documento no Repositório Oficial
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowDocModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDoc}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome do Documento *</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  placeholder="Ex: Anexo I - Plano de Trabalho Operacional 2026" 
                  required
                  value={docForm.title}
                  onChange={e => setDocForm({ ...docForm, title: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Categoria</label>
                <select 
                  className={styles.formSelect}
                  value={docForm.category}
                  onChange={e => setDocForm({ ...docForm, category: e.target.value })}
                >
                  <option value="Acordo / Protocolo Oficial">Acordo / Protocolo Oficial</option>
                  <option value="Relatório de Impacto">Relatório de Impacto</option>
                  <option value="Identidade Visual & Comunicação">Identidade Visual &amp; Comunicação</option>
                  <option value="Ata de Reunião">Ata de Reunião</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>URL do Ficheiro (PDF ou Nuvem)</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  placeholder="https://exemplo.com/documento.pdf" 
                  value={docForm.fileUrl}
                  onChange={e => setDocForm({ ...docForm, fileUrl: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowDocModal(false)} style={{ color: '#0f172a' }}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Editar Perfil Institucional */}
      {showEditProfileModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditProfileModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Editar Perfil Institucional &amp; Ponto Focal
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowEditProfileModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome da Organização *</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  required
                  value={profileForm.organizationName}
                  onChange={e => setProfileForm({ ...profileForm, organizationName: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Headline / Slogan Institucional</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  value={profileForm.headline}
                  onChange={e => setProfileForm({ ...profileForm, headline: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Setor de Atividade</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={profileForm.sector}
                    onChange={e => setProfileForm({ ...profileForm, sector: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>País</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={profileForm.country}
                    onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website Oficial</label>
                <input 
                  type="url" 
                  className={styles.formInput} 
                  value={profileForm.website}
                  onChange={e => setProfileForm({ ...profileForm, website: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Apresentação Institucional (Bio)</label>
                <textarea 
                  className={styles.formTextarea} 
                  rows={3} 
                  value={profileForm.institutionalBio}
                  onChange={e => setProfileForm({ ...profileForm, institutionalBio: e.target.value })}
                />
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#4f46e5' }}>
                  Dados do Ponto Focal Oficial
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nome do Ponto Focal</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={profileForm.focalPointName}
                      onChange={e => setProfileForm({ ...profileForm, focalPointName: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cargo Oficial</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={profileForm.focalPointRole}
                      onChange={e => setProfileForm({ ...profileForm, focalPointRole: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Direto</label>
                    <input 
                      type="email" 
                      className={styles.formInput} 
                      value={profileForm.focalPointEmail}
                      onChange={e => setProfileForm({ ...profileForm, focalPointEmail: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Telefone / WhatsApp</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={profileForm.focalPointPhone}
                      onChange={e => setProfileForm({ ...profileForm, focalPointPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowEditProfileModal(false)} style={{ color: '#0f172a' }}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
