'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  FlaskConical,
  Briefcase,
  Sparkles,
  Calendar,
  Users,
  BookOpen,
  Building2,
  Globe,
  Plus,
  X,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  Clock,
  Rocket,
  ArrowRight,
  Search,
  FileText,
  Award
} from 'lucide-react';
import styles from './Universidade.module.css';

type TabType = 'geral' | 'perfil' | 'programas' | 'investigacao' | 'estagios' | 'desafios' | 'eventos' | 'ecossistema';

export default function UniversidadePage() {
  const [loading, setLoading] = useState(true);
  const [uniData, setUniData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('geral');
  const [toastMsg, setToastMsg] = useState('');

  // Modal states
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Form states
  const [programForm, setProgramForm] = useState({ title: '', level: 'licenciatura', area: '', duration: '', mode: 'presencial', enrollmentOpen: true, applicationLink: '', description: '' });
  const [researchForm, setResearchForm] = useState({ title: '', area: '', description: '', status: 'em_andamento', leadResearcher: '', fundingSource: '', publicationUrl: '', year: '' });
  const [internshipForm, setInternshipForm] = useState({ title: '', department: '', area: '', duration: '', description: '', requirements: '', applicationDeadline: '', slots: '5' });
  const [challengeForm, setChallengeForm] = useState({ title: '', description: '', prize: '', theme: '', deadline: '' });
  const [eventForm, setEventForm] = useState({ title: '', date: '', type: 'Conferência / Seminário', location: 'Campus Universitário', description: '', registrationLink: '' });
  const [profileForm, setProfileForm] = useState({ universityName: '', headline: '', universityType: 'publica', country: '', city: '', website: '', institutionalBio: '', foundedYear: '', researchAreas: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/university');
      const data = await res.json();
      if (data.success) {
        setUniData(data);
        const p = data.universityProfile;
        if (p) {
          setProfileForm({
            universityName: p.universityName || '',
            headline: p.headline || '',
            universityType: p.universityType || 'publica',
            country: p.country || '',
            city: p.city || '',
            website: p.website || '',
            institutionalBio: p.institutionalBio || '',
            foundedYear: p.foundedYear || '',
            researchAreas: Array.isArray(p.researchAreas) ? p.researchAreas.join(', ') : ''
          });
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const toast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 4000); };

  const postAction = async (action: string, payload: object, onSuccess: () => void) => {
    try {
      const res = await fetch('/api/university', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      const data = await res.json();
      if (data.success) { toast(data.message); onSuccess(); fetchData(); }
      else toast(data.message || 'Erro ao processar pedido.');
    } catch (e) { toast('Erro de conexão.'); }
  };

  if (loading) return (
    <div className={styles.container} style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <GraduationCap size={52} color="#059669" />
      <h3 style={{ marginTop: '1rem', color: '#0f172a' }}>Carregando Portal Académico...</h3>
    </div>
  );

  const profile = uniData?.universityProfile || {};
  const eco = uniData?.ecossystemSummary || {};
  const metrics = profile.metrics || {};
  const programs = profile.programs || [];
  const research = profile.researchProjects || [];
  const internships = profile.internships || [];
  const challenges = profile.innovationChallenges || [];
  const events = profile.events || [];
  const startups = profile.connectedStartups || [];

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'geral', label: 'Visão Geral', icon: <TrendingUp size={16} /> },
    { id: 'perfil', label: 'Perfil Institucional', icon: <Building2 size={16} /> },
    { id: 'programas', label: 'Programas', icon: <BookOpen size={16} />, count: programs.length },
    { id: 'investigacao', label: 'Investigação & I&D', icon: <FlaskConical size={16} />, count: research.length },
    { id: 'estagios', label: 'Estágios', icon: <Briefcase size={16} />, count: internships.length },
    { id: 'desafios', label: 'Desafios Inovação', icon: <Sparkles size={16} />, count: challenges.length },
    { id: 'eventos', label: 'Eventos', icon: <Calendar size={16} />, count: events.length },
    { id: 'ecossistema', label: 'Ecossistema', icon: <Globe size={16} /> }
  ];

  return (
    <div className={styles.container}>
      {toastMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.85rem 1.4rem', borderRadius: '14px', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', position: 'sticky', top: '1rem', zIndex: 100 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* ── Executive Banner ── */}
      <div className={styles.executiveBanner}>
        <div className={styles.bannerOrb} />
        <div className={styles.bannerContent}>
          <div>
            <div className={styles.bannerTag}>
              <GraduationCap size={14} /> Hub Académico & Inovação ABN
            </div>
            <h1 className={styles.bannerTitle}>{profile.universityName || 'Universidade Parceira ABN'}</h1>
            <p className={styles.bannerSubtitle}>
              {profile.headline || 'Polo de ciência, investigação e empreendedorismo conectado ao maior ecossistema de negócios lusófono.'}
            </p>
            {profile.accreditations?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {profile.accreditations.map((a: string, i: number) => (
                  <span key={i} style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.74rem', fontWeight: 700 }}>
                    ✓ {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.bannerActions}>
            <button className={styles.btnPrimary} onClick={() => setShowProgramModal(true)}>
              <Plus size={16} /> Publicar Programa
            </button>
            <button className={styles.btnSecondary} onClick={() => setShowChallengeModal(true)}>
              <Sparkles size={16} /> Lançar Desafio
            </button>
            <button className={styles.btnSecondary} onClick={() => setShowProfileModal(true)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)' }}>
              ✏️ Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className={styles.kpisGrid}>
        {[
          { label: 'Estudantes', value: Number(metrics.totalStudents || 8500).toLocaleString('pt-PT'), icon: '🎓', bg: 'rgba(5,150,105,0.1)' },
          { label: 'Investigadores', value: metrics.totalResearchers || 142, icon: '🔬', bg: 'rgba(99,102,241,0.1)' },
          { label: 'Publicações Científicas', value: metrics.totalPublications || 87, icon: '📄', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Spin-offs & Startups', value: metrics.totalSpinOffs || startups.length || 14, icon: '🚀', bg: 'rgba(236,72,153,0.1)' },
          { label: 'Estágios Abertos', value: internships.filter((i: any) => i.status === 'aberto').length || metrics.totalInternshipsOffered || 120, icon: '💼', bg: 'rgba(14,165,233,0.1)' },
        ].map(kpi => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiIconBox} style={{ background: kpi.bg }}>{kpi.icon}</div>
            <div>
              <div className={styles.kpiValue}>{kpi.value}</div>
              <div className={styles.kpiLabel}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Navigation Tabs ── */}
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span style={{ background: activeTab === tab.id ? '#059669' : '#e2e8f0', color: activeTab === tab.id ? '#fff' : '#64748b', borderRadius: '999px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: 800 }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── ABA 1: VISÃO GERAL ── */}
      {activeTab === 'geral' && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}><TrendingUp size={20} color="#059669" /> Visão Geral do Hub Académico</h3>
              <p className={styles.sectionSubtitle}>Monitorize a presença da sua instituição, impacto gerado e oportunidades de ligação ao ecossistema.</p>
            </div>
          </div>

          {/* Resumo do Perfil */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '1px solid #6ee7b7', borderRadius: '20px', padding: '1.6rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                {profile.universityLogo || '🎓'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{profile.universityName}</h4>
                <p style={{ margin: '3px 0 6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                  {profile.city}, {profile.country} · Fundada em {profile.foundedYear || '—'} · <a href={profile.website} target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: 600 }}>{profile.website}</a>
                </p>
                {Array.isArray(profile.researchAreas) && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {profile.researchAreas.slice(0, 4).map((a: string, i: number) => (
                      <span key={i} style={{ background: '#ffffff', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#047857' }}>{a}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowProfileModal(true)}>
              ✏️ Editar Perfil Institucional
            </button>
          </div>

          {/* Destaques rápidos: programas, research, internships */}
          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <BookOpen size={20} color="#059669" />
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Últimos Programas Publicados</h4>
                </div>
                {programs.slice(0, 3).map((p: any, i: number) => (
                  <div key={i} style={{ padding: '0.65rem 0', borderBottom: i < 2 && programs.length > 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{p.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.level?.replace('_', ' ')} · {p.mode} · {p.duration}</div>
                  </div>
                ))}
              </div>
              <button className={styles.btnLight} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('programas')}>
                Ver todos os programas →
              </button>
            </div>

            <div className={styles.card}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <FlaskConical size={20} color="#6366f1" />
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Investigação em Destaque</h4>
                </div>
                {research.slice(0, 2).map((r: any, i: number) => (
                  <div key={i} style={{ padding: '0.65rem 0', borderBottom: i === 0 && research.length > 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{r.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.area} · {r.status === 'em_andamento' ? '🟢 Em Andamento' : (r.status === 'publicado' ? '📄 Publicado' : '✅ Concluído')}</div>
                  </div>
                ))}
              </div>
              <button className={styles.btnLight} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('investigacao')}>
                Ver todos os projetos →
              </button>
            </div>

            <div className={styles.card}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <Sparkles size={20} color="#f59e0b" />
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Desafios de Inovação Ativos</h4>
                </div>
                {challenges.filter((c: any) => c.status === 'aberto').slice(0, 2).map((c: any, i: number) => (
                  <div key={i} style={{ padding: '0.65rem 0', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{c.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>🏆 {c.prize} · {c.applicantsCount || 0} candidatos</div>
                  </div>
                ))}
              </div>
              <button className={styles.btnLight} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('desafios')}>
                Gerir desafios →
              </button>
            </div>
          </div>

          {/* Spin-offs & Startups */}
          {startups.length > 0 && (
            <>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Rocket size={18} color="#059669" /> Startups, Spin-offs & Alumni Empreendedores
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                {startups.map((s: any, i: number) => (
                  <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0.85rem 1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🚀</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.sector} · {s.type === 'spin_off' ? 'Spin-off' : (s.type === 'incubada' ? 'Incubada' : 'Alumni')} · {s.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── ABA 2: PERFIL INSTITUCIONAL ── */}
      {activeTab === 'perfil' && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}><Building2 size={20} color="#059669" /> Perfil Institucional</h3>
              <p className={styles.sectionSubtitle}>Informações públicas visíveis para startups, empresas e investidores que procuram parceiros académicos.</p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowProfileModal(true)}>✏️ Editar Perfil</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.8rem', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem' }}>
                  {profile.universityLogo || '🎓'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{profile.universityName}</h4>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                    {profile.universityType?.replace('_', ' ').toUpperCase()} · {profile.city}, {profile.country} · Fundada em {profile.foundedYear || '—'}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                {profile.institutionalBio}
              </p>
              {profile.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                  <Globe size={16} color="#059669" />
                  <a href={profile.website} target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: 700 }}>{profile.website}</a>
                </div>
              )}
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.8rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FlaskConical size={18} color="#6366f1" /> Áreas de Investigação
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(Array.isArray(profile.researchAreas) ? profile.researchAreas : []).map((a: string, i: number) => (
                  <span key={i} style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '4px 12px', fontSize: '0.82rem', fontWeight: 700 }}>{a}</span>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.8rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#f59e0b" /> Acreditações & Certificações
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(Array.isArray(profile.accreditations) ? profile.accreditations : []).map((a: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                    <CheckCircle2 size={16} color="#16a34a" /> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ABA 3: PROGRAMAS ── */}
      {activeTab === 'programas' && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}><BookOpen size={20} color="#059669" /> Programas Académicos</h3>
              <p className={styles.sectionSubtitle}>Licenciaturas, mestrados, doutoramentos, pós-graduações e formação executiva publicados na plataforma ABN.</p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowProgramModal(true)}><Plus size={16} /> Publicar Programa</button>
          </div>

          <div className={styles.cardsGrid}>
            {programs.map((p: any, i: number) => (
              <div key={i} className={styles.card}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className={`${styles.cardBadge} ${p.level === 'mestrado' ? styles.badgePurple : (p.level === 'doutoramento' ? styles.badgeBlue : (p.level === 'formacao_executiva' ? styles.badgeAmber : styles.badgeGreen))}`}>
                      {p.level?.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: p.enrollmentOpen ? '#16a34a' : '#dc2626' }}>
                      {p.enrollmentOpen ? '● Inscrições Abertas' : '● Inscrições Encerradas'}
                    </span>
                  </div>
                  <h4 className={styles.cardTitle}>{p.title}</h4>
                  <p className={styles.cardDesc}>{p.description}</p>
                </div>
                <div className={styles.cardMeta}>
                  <span>🗓️ {p.duration} · {p.mode}</span>
                  {p.applicationLink && (
                    <a href={p.applicationLink} target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Candidatar <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ABA 4: INVESTIGAÇÃO ── */}
      {activeTab === 'investigacao' && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}><FlaskConical size={20} color="#6366f1" /> Investigação, I&amp;D &amp; Publicações</h3>
              <p className={styles.sectionSubtitle}>Projetos científicos em andamento, conclusão e publicações internacionais dos centros de investigação.</p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowResearchModal(true)}><Plus size={16} /> Publicar Investigação</button>
          </div>

          {research.map((r: any, i: number) => (
            <div key={i} className={styles.researchRow}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '6px' }}>{r.area}</span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: r.status === 'em_andamento' ? '#16a34a' : (r.status === 'publicado' ? '#3b82f6' : '#6b7280') }}>
                    {r.status === 'em_andamento' ? '🟢 Em Andamento' : (r.status === 'publicado' ? '📄 Publicado' : '✅ Concluído')}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{r.title}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>{r.description}</p>
                <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                  {r.leadResearcher && <span>👤 {r.leadResearcher}</span>}
                  {r.fundingSource && <span>💰 {r.fundingSource}</span>}
                  {r.year && <span>📅 {r.year}</span>}
                </div>
              </div>
              {r.publicationUrl && (
                <a href={r.publicationUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eef2ff', color: '#4f46e5', padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
                  <FileText size={14} /> Ver Publicação
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── ABA 5: ESTÁGIOS ── */}
      {activeTab === 'estagios' && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}><Briefcase size={20} color="#059669" /> Oportunidades de Estágio</h3>
              <p className={styles.sectionSubtitle}>Estágios curriculares, extracurriculares e colaborações de investigação para estudantes e recém-licenciados.</p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowInternshipModal(true)}><Plus size={16} /> Publicar Estágio</button>
          </div>

          {internships.map((int: any, i: number) => (
            <div key={i} className={styles.internshipRow}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '6px' }}>{int.area}</span>
                  <span className={`${styles.statusDot} ${int.status === 'aberto' ? styles.statusOpen : (int.status === 'em_selecao' ? styles.statusPending : styles.statusClosed)}`}>
                    ● {int.status === 'aberto' ? 'Candidaturas Abertas' : (int.status === 'em_selecao' ? 'Em Seleção' : 'Encerrado')}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{int.title}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#475569' }}>{int.description}</p>
                <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                  {int.department && <span>🏛️ {int.department}</span>}
                  {int.duration && <span>🗓️ {int.duration}</span>}
                  {int.slots && <span>👥 {int.slots} vagas</span>}
                  {int.applicationDeadline && <span>⏰ Prazo: {int.applicationDeadline}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <Link href="/dashboard/oportunidades" className={styles.btnPrimary} style={{ fontSize: '0.82rem', padding: '8px 14px' }}>
                  Ver Candidatos
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ABA 6: DESAFIOS DE INOVAÇÃO ── */}
      {activeTab === 'desafios' && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}><Sparkles size={20} color="#f59e0b" /> Desafios de Inovação &amp; Hackathons</h3>
              <p className={styles.sectionSubtitle}>Competições académicas, hackathons e desafios corporativos lançados pela universidade para a comunidade ABN.</p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowChallengeModal(true)}><Plus size={16} /> Lançar Desafio</button>
          </div>

          <div className={styles.cardsGrid}>
            {challenges.map((c: any, i: number) => (
              <div key={i} className={styles.challengeCard}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '6px' }}>{c.theme || 'Inovação'}</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: c.status === 'aberto' ? '#059669' : '#6b7280' }}>
                      {c.status === 'aberto' ? '● Candidaturas Abertas' : '● Encerrado'}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>{c.title}</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#047857', lineHeight: 1.5 }}>{c.description}</p>
                  <div style={{ background: '#ffffff', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Prémio &amp; Benefícios</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>🏆 {c.prize}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.83rem', color: '#047857' }}>
                  <span>👥 {c.applicantsCount || 0} candidatos · ⏰ {c.deadline}</span>
                  <Link href="/dashboard/oportunidades" style={{ fontWeight: 700, color: '#059669', textDecoration: 'none' }}>
                    Gerir →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ABA 7: EVENTOS ── */}
      {activeTab === 'eventos' && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}><Calendar size={20} color="#059669" /> Eventos Académicos &amp; Conferências</h3>
              <p className={styles.sectionSubtitle}>Conferências internacionais, simpósios, workshops e eventos de ligação academia-empresa.</p>
            </div>
            <button className={styles.btnPrimary} onClick={() => setShowEventModal(true)}><Plus size={16} /> Publicar Evento</button>
          </div>

          <div className={styles.cardsGrid}>
            {events.map((ev: any, i: number) => (
              <div key={i} className={styles.card}>
                <div>
                  <span className={`${styles.cardBadge} ${styles.badgeTeal}`}>{ev.type}</span>
                  <h4 className={styles.cardTitle}>{ev.title}</h4>
                  <p className={styles.cardDesc}>{ev.description}</p>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    📅 {ev.date} &nbsp;·&nbsp; 📍 {ev.location}
                  </div>
                </div>
                <div className={styles.cardMeta}>
                  <span className={`${styles.statusDot} ${ev.status === 'aberto' ? styles.statusOpen : styles.statusClosed}`}>
                    ● {ev.status === 'aberto' ? 'Inscrições Abertas' : 'Encerrado'}
                  </span>
                  {ev.registrationLink && (
                    <a href={ev.registrationLink} target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Inscrever <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ABA 8: ECOSSISTEMA ── */}
      {activeTab === 'ecossistema' && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}><Globe size={20} color="#059669" /> Ligação ao Ecossistema ABN</h3>
              <p className={styles.sectionSubtitle}>Procure startups, empresas e parceiros que pretendem colaborar com o ensino superior e a investigação.</p>
            </div>
          </div>

          {/* Stats do Ecossistema */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: '🚀', label: 'Startups à Procura de Parcerias Académicas', value: eco.startupsLookingForPartners || 24, color: '#ecfdf5', textColor: '#047857' },
              { icon: '🏢', label: 'Empresas com Desafios de Inovação Aberta', value: eco.companiesOffering || 18, color: '#eff6ff', textColor: '#1d4ed8' },
              { icon: '💼', label: 'Pedidos de Estágio em Aberto', value: eco.openInternshipRequests || 9, color: '#fefce8', textColor: '#92400e' },
              { icon: '🏆', label: 'Desafios de Inovação Ativos na Rede', value: eco.innovationChallengesActive || 6, color: '#fdf4ff', textColor: '#6b21a8' },
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.color, border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: stat.textColor, fontFamily: 'Outfit, sans-serif' }}>{stat.value}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', lineHeight: 1.35, marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Procura de Startups */}
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0f172a' }}>Como a Universidade Pode Conectar-se ao Ecossistema</h4>
          <div className={styles.cardsGrid}>
            {[
              { icon: '🔍', title: 'Procurar Startups', desc: 'Encontre startups e empreendedores interessados em projetos de investigação aplicada, co-criação e acesso a infraestrutura académica.', link: '/dashboard/oportunidades', label: 'Explorar Startups' },
              { icon: '🏢', title: 'Conectar com Empresas', desc: 'Estabeleça projetos de inovação aberta com PMEs e corporações que necessitam de expertise académica, R&D e capital humano especializado.', link: '/dashboard/networking', label: 'Ver Empresas' },
              { icon: '🤝', title: 'Encontrar Parceiros ABN', desc: 'Procure universidades parceiras, centros de investigação e aceleradoras que possam co-financiar e co-executar programas de impacto.', link: '/dashboard/networking', label: 'Explorar Parcerias' },
              { icon: '🌍', title: 'Participar em Desafios', desc: 'Submeta soluções e equipas académicas aos desafios de inovação lançados por empresas parceiras no ecossistema ABN.', link: '/dashboard/oportunidades', label: 'Ver Desafios' }
            ].map((item, i) => (
              <div key={i} className={styles.card}>
                <div>
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
                <Link href={item.link} className={styles.btnPrimary} style={{ marginTop: '1.25rem', justifyContent: 'center' }}>
                  {item.label} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAIS
      ───────────────────────────────────────────────────────────── */}

      {/* Modal: Publicar Programa */}
      {showProgramModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProgramModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Publicar Programa Académico</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowProgramModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); postAction('add_program', programForm, () => { setShowProgramModal(false); setProgramForm({ title: '', level: 'licenciatura', area: '', duration: '', mode: 'presencial', enrollmentOpen: true, applicationLink: '', description: '' }); }); }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome do Programa / Curso *</label>
                <input className={styles.formInput} required placeholder="Ex: Mestrado em Gestão da Inovação e Empreendedorismo" value={programForm.title} onChange={e => setProgramForm({ ...programForm, title: e.target.value })} />
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nível Académico</label>
                  <select className={styles.formSelect} value={programForm.level} onChange={e => setProgramForm({ ...programForm, level: e.target.value })}>
                    <option value="licenciatura">Licenciatura</option>
                    <option value="mestrado">Mestrado</option>
                    <option value="doutoramento">Doutoramento</option>
                    <option value="pos_graduacao">Pós-Graduação</option>
                    <option value="formacao_executiva">Formação Executiva</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Modalidade</label>
                  <select className={styles.formSelect} value={programForm.mode} onChange={e => setProgramForm({ ...programForm, mode: e.target.value })}>
                    <option value="presencial">Presencial</option>
                    <option value="online">Online</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Área de Conhecimento</label>
                  <input className={styles.formInput} placeholder="Ex: Engenharia, Saúde, Gestão..." value={programForm.area} onChange={e => setProgramForm({ ...programForm, area: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Duração</label>
                  <input className={styles.formInput} placeholder="Ex: 4 anos, 2 anos, 18 meses" value={programForm.duration} onChange={e => setProgramForm({ ...programForm, duration: e.target.value })} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Link de Candidatura</label>
                <input className={styles.formInput} type="url" placeholder="https://..." value={programForm.applicationLink} onChange={e => setProgramForm({ ...programForm, applicationLink: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição do Programa</label>
                <textarea className={styles.formTextarea} rows={3} placeholder="Objetivos, competências desenvolvidas e saídas profissionais..." value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnLight} onClick={() => setShowProgramModal(false)}>Cancelar</button>
                <button type="submit" className={styles.btnPrimary}>Publicar Programa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publicar Investigação */}
      {showResearchModal && (
        <div className={styles.modalOverlay} onClick={() => setShowResearchModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Publicar Projeto de Investigação</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowResearchModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); postAction('add_research', researchForm, () => { setShowResearchModal(false); setResearchForm({ title: '', area: '', description: '', status: 'em_andamento', leadResearcher: '', fundingSource: '', publicationUrl: '', year: '' }); }); }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título do Projeto *</label>
                <input className={styles.formInput} required placeholder="Ex: IA para Detecção Precoce de Cancro em África" value={researchForm.title} onChange={e => setResearchForm({ ...researchForm, title: e.target.value })} />
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Área Científica</label>
                  <input className={styles.formInput} placeholder="Ex: Saúde, Agro, Energia..." value={researchForm.area} onChange={e => setResearchForm({ ...researchForm, area: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Estado</label>
                  <select className={styles.formSelect} value={researchForm.status} onChange={e => setResearchForm({ ...researchForm, status: e.target.value })}>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Investigador Principal</label>
                  <input className={styles.formInput} placeholder="Prof. Dr. ..." value={researchForm.leadResearcher} onChange={e => setResearchForm({ ...researchForm, leadResearcher: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Financiamento / Bolsa</label>
                  <input className={styles.formInput} placeholder="Ex: FCT, AfDB, EU Horizon..." value={researchForm.fundingSource} onChange={e => setResearchForm({ ...researchForm, fundingSource: e.target.value })} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição</label>
                <textarea className={styles.formTextarea} rows={3} placeholder="Objetivos, metodologia e impacto esperado..." value={researchForm.description} onChange={e => setResearchForm({ ...researchForm, description: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Link da Publicação (DOI / URL)</label>
                <input className={styles.formInput} placeholder="https://doi.org/..." value={researchForm.publicationUrl} onChange={e => setResearchForm({ ...researchForm, publicationUrl: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnLight} onClick={() => setShowResearchModal(false)}>Cancelar</button>
                <button type="submit" className={styles.btnPrimary}>Publicar Investigação</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publicar Estágio */}
      {showInternshipModal && (
        <div className={styles.modalOverlay} onClick={() => setShowInternshipModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Publicar Oportunidade de Estágio</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowInternshipModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); postAction('add_internship', { ...internshipForm, requirements: internshipForm.requirements.split('\n').filter(Boolean) }, () => { setShowInternshipModal(false); setInternshipForm({ title: '', department: '', area: '', duration: '', description: '', requirements: '', applicationDeadline: '', slots: '5' }); }); }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título do Estágio *</label>
                <input className={styles.formInput} required placeholder="Ex: Estágio em Inteligência Artificial — Lab de Inovação" value={internshipForm.title} onChange={e => setInternshipForm({ ...internshipForm, title: e.target.value })} />
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Departamento</label>
                  <input className={styles.formInput} placeholder="Ex: Dep. de Informática" value={internshipForm.department} onChange={e => setInternshipForm({ ...internshipForm, department: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Área Temática</label>
                  <input className={styles.formInput} placeholder="Ex: IA, Agro, Saúde..." value={internshipForm.area} onChange={e => setInternshipForm({ ...internshipForm, area: e.target.value })} />
                </div>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Duração</label>
                  <input className={styles.formInput} placeholder="Ex: 3 meses, 6 meses" value={internshipForm.duration} onChange={e => setInternshipForm({ ...internshipForm, duration: e.target.value })} />
                </div>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nº de Vagas</label>
                    <input className={styles.formInput} type="number" value={internshipForm.slots} onChange={e => setInternshipForm({ ...internshipForm, slots: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Prazo de Candidatura</label>
                    <input className={styles.formInput} type="date" value={internshipForm.applicationDeadline} onChange={e => setInternshipForm({ ...internshipForm, applicationDeadline: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição</label>
                <textarea className={styles.formTextarea} rows={2} placeholder="Atividades, objetivos e contexto do estágio..." value={internshipForm.description} onChange={e => setInternshipForm({ ...internshipForm, description: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Requisitos (1 por linha)</label>
                <textarea className={styles.formTextarea} rows={3} placeholder="3.º ano de Informática ou Gestão&#10;Noções de Python&#10;Inglês Básico" value={internshipForm.requirements} onChange={e => setInternshipForm({ ...internshipForm, requirements: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnLight} onClick={() => setShowInternshipModal(false)}>Cancelar</button>
                <button type="submit" className={styles.btnPrimary}>Publicar Estágio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lançar Desafio de Inovação */}
      {showChallengeModal && (
        <div className={styles.modalOverlay} onClick={() => setShowChallengeModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Lançar Desafio de Inovação / Hackathon</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowChallengeModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); postAction('add_challenge', challengeForm, () => { setShowChallengeModal(false); setChallengeForm({ title: '', description: '', prize: '', theme: '', deadline: '' }); }); }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título do Desafio *</label>
                <input className={styles.formInput} required placeholder="Ex: Hackathon 48h — Soluções AgriTech para PMEs" value={challengeForm.title} onChange={e => setChallengeForm({ ...challengeForm, title: e.target.value })} />
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tema Central</label>
                  <input className={styles.formInput} placeholder="Ex: FinTech, Saúde, Clima..." value={challengeForm.theme} onChange={e => setChallengeForm({ ...challengeForm, theme: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Prazo de Candidatura</label>
                  <input className={styles.formInput} type="date" value={challengeForm.deadline} onChange={e => setChallengeForm({ ...challengeForm, deadline: e.target.value })} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Prémio &amp; Benefícios</label>
                <input className={styles.formInput} placeholder="Ex: 5.000 € + Aceleração ABN + Pitch para Investidores" value={challengeForm.prize} onChange={e => setChallengeForm({ ...challengeForm, prize: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição do Desafio</label>
                <textarea className={styles.formTextarea} rows={3} placeholder="Problema a resolver, critérios de avaliação e público-alvo..." value={challengeForm.description} onChange={e => setChallengeForm({ ...challengeForm, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnLight} onClick={() => setShowChallengeModal(false)}>Cancelar</button>
                <button type="submit" className={styles.btnPrimary}>Lançar Desafio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publicar Evento */}
      {showEventModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEventModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Publicar Evento Académico</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowEventModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); postAction('add_event', eventForm, () => { setShowEventModal(false); setEventForm({ title: '', date: '', type: 'Conferência / Seminário', location: 'Campus Universitário', description: '', registrationLink: '' }); }); }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título do Evento *</label>
                <input className={styles.formInput} required placeholder="Ex: Conferência Internacional de Empreendedorismo 2026" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Data</label>
                  <input className={styles.formInput} type="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tipo de Evento</label>
                  <select className={styles.formSelect} value={eventForm.type} onChange={e => setEventForm({ ...eventForm, type: e.target.value })}>
                    <option>Conferência / Seminário</option>
                    <option>Simpósio Científico</option>
                    <option>Workshop Técnico</option>
                    <option>Feira de Emprego & Estágios</option>
                    <option>Hackathon Académico</option>
                    <option>Webinar Internacional</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Local</label>
                <input className={styles.formInput} placeholder="Ex: Auditório Central, Campus Norte, Online..." value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Link de Inscrição / Mais Info</label>
                <input className={styles.formInput} type="url" placeholder="https://..." value={eventForm.registrationLink} onChange={e => setEventForm({ ...eventForm, registrationLink: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição</label>
                <textarea className={styles.formTextarea} rows={2} placeholder="Programa geral, oradores e objetivos do evento..." value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnLight} onClick={() => setShowEventModal(false)}>Cancelar</button>
                <button type="submit" className={styles.btnPrimary}>Publicar Evento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Perfil Institucional */}
      {showProfileModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProfileModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Editar Perfil Institucional</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowProfileModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); postAction('update_profile', { ...profileForm, researchAreas: profileForm.researchAreas.split(',').map((s: string) => s.trim()).filter(Boolean) }, () => setShowProfileModal(false)); }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome da Universidade *</label>
                <input className={styles.formInput} required value={profileForm.universityName} onChange={e => setProfileForm({ ...profileForm, universityName: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Headline Institucional</label>
                <input className={styles.formInput} placeholder="Ex: Polo de Ciência e Inovação para o Desenvolvimento Sustentável" value={profileForm.headline} onChange={e => setProfileForm({ ...profileForm, headline: e.target.value })} />
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tipo de Instituição</label>
                  <select className={styles.formSelect} value={profileForm.universityType} onChange={e => setProfileForm({ ...profileForm, universityType: e.target.value })}>
                    <option value="publica">Pública</option>
                    <option value="privada">Privada</option>
                    <option value="politecnico">Politécnico</option>
                    <option value="instituto">Instituto</option>
                    <option value="academia">Academia</option>
                    <option value="centro_investigacao">Centro de Investigação</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ano de Fundação</label>
                  <input className={styles.formInput} placeholder="Ex: 1976" value={profileForm.foundedYear} onChange={e => setProfileForm({ ...profileForm, foundedYear: e.target.value })} />
                </div>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>País</label>
                  <input className={styles.formInput} value={profileForm.country} onChange={e => setProfileForm({ ...profileForm, country: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cidade</label>
                  <input className={styles.formInput} value={profileForm.city} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website Institucional</label>
                <input className={styles.formInput} type="url" value={profileForm.website} onChange={e => setProfileForm({ ...profileForm, website: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Áreas de Investigação (separadas por vírgula)</label>
                <input className={styles.formInput} placeholder="Ex: Inteligência Artificial, Agroecologia, Energia Renovável" value={profileForm.researchAreas} onChange={e => setProfileForm({ ...profileForm, researchAreas: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Apresentação Institucional</label>
                <textarea className={styles.formTextarea} rows={3} value={profileForm.institutionalBio} onChange={e => setProfileForm({ ...profileForm, institutionalBio: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className={styles.btnLight} onClick={() => setShowProfileModal(false)}>Cancelar</button>
                <button type="submit" className={styles.btnPrimary}>Guardar Perfil</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
