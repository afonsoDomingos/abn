'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Calendar,
  Clock,
  Star,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Video,
  DollarSign,
  Briefcase,
  Search,
  Filter,
  MessageSquare,
  Globe,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Edit3,
  Plus
} from 'lucide-react';
import styles from './Mentoria.module.css';

interface MentorItem {
  _id: string;
  name: string;
  role: string;
  headline: string;
  country: string;
  city?: string;
  profileImage: string;
  specialization: string[];
  yearsOfExperience: number;
  languages: string[];
  hourlyRate: string;
  pricePerSession: number;
  abnCommissionPercent: number;
  rating: number;
  reviewsCount: number;
  sessionsCompleted: number;
  bio: string;
  certifications: { title: string; issuer: string; year: string }[];
  supportedCompanies: { name: string; logo: string; year: string }[];
  availability: {
    days: string[];
    hours: string;
    mode: string;
    isAcceptingNewMentees: boolean;
  };
}

interface MentorshipSessionItem {
  _id: string;
  mentor: any;
  mentee: any;
  menteeName: string;
  menteeEmail: string;
  menteeBusinessName: string;
  topic: string;
  objective: string;
  businessStage: string;
  date: string;
  time: string;
  duration: string;
  status: 'pendente' | 'confirmada' | 'concluida' | 'cancelada';
  price: number;
  abnFee: number;
  mentorEarnings: number;
  meetingLink?: string;
  mentorNotes?: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
  createdAt: string;
}

export default function MentoriaPage() {
  const [activeRole, setActiveRole] = useState('mentor');
  const [mainTab, setMainTab] = useState<'overview' | 'requests' | 'sessions' | 'mentees' | 'profile' | 'reviews' | 'explore'>('overview');
  const [loading, setLoading] = useState(true);

  // Dados do Mentor
  const [mentorData, setMentorData] = useState<any>(null);
  const [sessions, setSessions] = useState<MentorshipSessionItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<MentorshipSessionItem[]>([]);
  const [confirmedSessions, setConfirmedSessions] = useState<MentorshipSessionItem[]>([]);
  const [completedSessions, setCompletedSessions] = useState<MentorshipSessionItem[]>([]);
  const [mentorStats, setMentorStats] = useState<any>(null);

  // Diretório de Mentores (para Empreendedores)
  const [allMentors, setAllMentors] = useState<MentorItem[]>([]);
  const [mySessions, setMySessions] = useState<MentorshipSessionItem[]>([]);

  // Filtros de Mentores
  const [mentorSearch, setMentorSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todos');
  const [selectedCountry, setSelectedCountry] = useState('Todos');
  const [selectedPriceMode, setSelectedPriceMode] = useState('Todos');

  // Modais
  const [selectedMentorDetail, setSelectedMentorDetail] = useState<MentorItem | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [targetMentor, setTargetMentor] = useState<MentorItem | null>(null);

  // Form de Solicitação de Mentoria (Empreendedor)
  const [reqTopic, setReqTopic] = useState('Estratégia de Validação & MVP');
  const [reqObjective, setReqObjective] = useState('');
  const [reqBusinessName, setReqBusinessName] = useState('');
  const [reqStage, setReqStage] = useState('MVP');
  const [reqDate, setReqDate] = useState('');
  const [reqTime, setReqTime] = useState('15:00');
  const [submittingReq, setSubmittingReq] = useState(false);

  // Form de Avaliação Pós-Sessão
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSession, setReviewSession] = useState<MentorshipSessionItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Edição do Perfil do Mentor
  const [profileForm, setProfileForm] = useState<any>({
    headline: '',
    yearsOfExperience: 8,
    specialization: '',
    languages: 'Português, Inglês',
    pricePerSession: 0,
    days: 'Segunda, Quarta, Sexta',
    hours: '14:00 - 18:00',
    bio: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Alerta
  const [alert, setAlert] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    // 1. Verificar papel ativo
    const storedActiveRole = localStorage.getItem('abn_active_role') || 'mentor';
    setActiveRole(storedActiveRole);

    if (storedActiveRole === 'mentor') {
      setMainTab('overview');
      fetchMentorDashboard();
    } else {
      setMainTab('explore');
      fetchMentorExplorer();
    }
  }, []);

  const fetchMentorDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentorship?view=mentor');
      const data = await res.json();
      if (data.success) {
        setMentorData(data.profile);
        setSessions(data.sessions || []);
        setPendingRequests(data.pendingRequests || []);
        setConfirmedSessions(data.confirmedSessions || []);
        setCompletedSessions(data.completedSessions || []);
        setMentorStats(data.stats || null);

        // Preencher form de perfil
        if (data.profile) {
          setProfileForm({
            headline: data.profile.headline || '',
            yearsOfExperience: data.profile.yearsOfExperience || 8,
            specialization: (data.profile.specialization || []).join(', '),
            languages: (data.profile.languages || []).join(', '),
            pricePerSession: data.profile.pricePerSession || 0,
            days: (data.profile.availability?.days || []).join(', ') || 'Segunda, Quarta, Sexta',
            hours: data.profile.availability?.hours || '14:00 - 18:00',
            bio: data.profile.bio || ''
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorExplorer = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentorship?view=explore');
      const data = await res.json();
      if (data.success) {
        setAllMentors(data.mentors || []);
        setMySessions(data.mySessions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Ação de Aceitar / Concluir Sessão pelo Mentor
  const handleUpdateStatus = async (sessionId: string, status: 'confirmada' | 'concluida' | 'cancelada') => {
    try {
      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', sessionId, status })
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', text: data.message });
        setTimeout(() => setAlert(null), 3500);
        fetchMentorDashboard();
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro ao atualizar sessão.' });
    }
  };

  // Submeter Solicitação de Mentoria (Empreendedor)
  const handleSubmitMentorshipRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMentor || !reqTopic || !reqDate || !reqTime) return;

    setSubmittingReq(true);
    try {
      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_mentorship',
          mentorId: targetMentor._id,
          topic: reqTopic,
          objective: reqObjective,
          businessName: reqBusinessName,
          businessStage: reqStage,
          date: reqDate,
          time: reqTime,
          price: targetMentor.pricePerSession
        })
      });
      const data = await res.json();
      if (data.success) {
        setRequestModalOpen(false);
        setAlert({ type: 'success', text: data.message });
        setTimeout(() => setAlert(null), 4000);
        fetchMentorExplorer();
      } else {
        setAlert({ type: 'error', text: data.error || 'Erro ao submeter pedido.' });
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSubmittingReq(false);
    }
  };

  // Salvar Avaliação (Empreendedor)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewSession) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_review',
          sessionId: reviewSession._id,
          mentorId: typeof reviewSession.mentor === 'object' ? reviewSession.mentor._id : reviewSession.mentor,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewModalOpen(false);
        setAlert({ type: 'success', text: data.message });
        setTimeout(() => setAlert(null), 4000);
        fetchMentorExplorer();
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro ao enviar avaliação.' });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Salvar Perfil do Mentor
  const handleSaveMentorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const specArray = profileForm.specialization.split(',').map((s: string) => s.trim()).filter(Boolean);
      const langArray = profileForm.languages.split(',').map((l: string) => l.trim()).filter(Boolean);
      const daysArray = profileForm.days.split(',').map((d: string) => d.trim()).filter(Boolean);

      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          headline: profileForm.headline,
          yearsOfExperience: profileForm.yearsOfExperience,
          specialization: specArray,
          languages: langArray,
          pricePerSession: profileForm.pricePerSession,
          hourlyRate: profileForm.pricePerSession ? `$${profileForm.pricePerSession} / Sessão` : 'Gratuito (ABN Cohort)',
          availability: {
            days: daysArray,
            hours: profileForm.hours,
            mode: 'online',
            isAcceptingNewMentees: true
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', text: 'Perfil profissional e disponibilidade atualizados com sucesso!' });
        setTimeout(() => setAlert(null), 3500);
      }
    } catch (e) {
      setAlert({ type: 'error', text: 'Erro ao salvar perfil.' });
    } finally {
      setSavingProfile(false);
    }
  };

  // Filtro de Mentores no Explorador
  const filteredMentors = useMemo(() => {
    return allMentors.filter(m => {
      if (mentorSearch.trim()) {
        const q = mentorSearch.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchRole = m.role.toLowerCase().includes(q);
        const matchCountry = m.country.toLowerCase().includes(q);
        const matchSpec = m.specialization.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchRole && !matchCountry && !matchSpec) return false;
      }
      if (selectedSpecialty !== 'Todos' && !m.specialization.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))) return false;
      if (selectedCountry !== 'Todos' && !m.country.toLowerCase().includes(selectedCountry.toLowerCase())) return false;
      if (selectedPriceMode === 'Gratuito' && m.pricePerSession > 0) return false;
      if (selectedPriceMode === 'Premium' && m.pricePerSession === 0) return false;
      return true;
    });
  }, [allMentors, mentorSearch, selectedSpecialty, selectedCountry, selectedPriceMode]);

  const openBookModal = (mentor: MentorItem) => {
    setTargetMentor(mentor);
    setReqDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
    setRequestModalOpen(true);
  };

  return (
    <div className={styles.container}>

      {/* Alerta Flutuante */}
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

      {/* ── HEADER EXECUTIVO DE MENTORIA ── */}
      <header className={styles.heroHeader}>
        <div className={styles.heroTop}>
          <div>
            <div className={styles.badgeMentor}>
              <Compass size={14} /> Hub de Mentoria &amp; Aceleração ABN
            </div>
            <h1 className={styles.heroTitle}>Programa de Mentoria Estratégica</h1>
            <p className={styles.heroDesc}>
              Apoie o crescimento e a tração de novos negócios africanos ou encontre mentores seniores credenciados para guiar o seu modelo de negócio, governança e captação de investimento.
            </p>
          </div>

          <div className={styles.heroActions}>
            {/* Seletor de Modo (Mentor vs Empreendedor) */}
            <button 
              className={`${styles.btnSecondary} ${mainTab === 'explore' ? styles.btnPrimary : ''}`}
              onClick={() => {
                setMainTab('explore');
                if (allMentors.length === 0) fetchMentorExplorer();
              }}
            >
              <Users size={16} /> Encontrar Mentores
            </button>
            <button 
              className={`${styles.btnPrimary} ${mainTab === 'overview' ? styles.btnPrimary : ''}`}
              onClick={() => {
                setMainTab('overview');
                fetchMentorDashboard();
              }}
            >
              <Compass size={16} /> Minha Área de Mentor
            </button>
          </div>
        </div>

        {/* Estatísticas de Impacto */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Clock size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{mentorStats?.hoursDonated || 24} Horas</div>
              <div className={styles.statLabel}>Mentoria Dedicada</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Star size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{mentorStats?.averageRating || '4.9'} ★</div>
              <div className={styles.statLabel}>Avaliação Média</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Briefcase size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{mentorStats?.totalMentees || 14} Startups</div>
              <div className={styles.statLabel}>Aceleradas no Hub</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <Calendar size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{pendingRequests.length} Pedidos</div>
              <div className={styles.statLabel}>Aguardando Resposta</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── ABAS DE NAVEGAÇÃO ── */}
      <nav className={styles.navTabs}>
        <button 
          className={`${styles.navTab} ${mainTab === 'overview' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('overview'); fetchMentorDashboard(); }}
        >
          <Compass size={17} />
          <span>Visão Geral</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'requests' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('requests'); fetchMentorDashboard(); }}
        >
          <Calendar size={17} />
          <span>Pedidos de Mentoria</span>
          {pendingRequests.length > 0 && <span className={styles.tabBadge} style={{ background: '#f59e0b', color: '#fff' }}>{pendingRequests.length}</span>}
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'sessions' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('sessions'); fetchMentorDashboard(); }}
        >
          <Clock size={17} />
          <span>Agenda &amp; Sessões</span>
          <span className={styles.tabBadge}>{confirmedSessions.length}</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'mentees' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('mentees'); fetchMentorDashboard(); }}
        >
          <Users size={17} />
          <span>Startups Acompanhadas</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'profile' ? styles.navTabActive : ''}`}
          onClick={() => setMainTab('profile')}
        >
          <Edit3 size={17} />
          <span>Meu Perfil &amp; Disponibilidade</span>
        </button>

        <button 
          className={`${styles.navTab} ${mainTab === 'explore' ? styles.navTabActive : ''}`}
          onClick={() => { setMainTab('explore'); fetchMentorExplorer(); }}
          style={{ marginLeft: 'auto', color: '#ff6b00' }}
        >
          <Sparkles size={17} />
          <span>Diretório de Mentores ABN 🌟</span>
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
         ABA 1: VISÃO GERAL (DASHBOARD DO MENTOR)
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'overview' && (
        <div>
          {/* Próximas Sessões Imediatas */}
          <div className={styles.contentCard} style={{ marginBottom: '2rem' }}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}><Clock size={20} color="#059669" /> Próximas Sessões Agendadas</h3>
                <p className={styles.sectionSubtitle}>Sessões confirmadas prontas para realização via Google Meet.</p>
              </div>
              <button 
                className={styles.btnSecondary} 
                onClick={() => setMainTab('sessions')}
                style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
              >
                Ver Agenda Completa →
              </button>
            </div>

            {confirmedSessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                <Calendar size={36} style={{ color: '#cbd5e1', margin: '0 auto 0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Nenhuma sessão confirmada para os próximos dias.</p>
              </div>
            ) : (
              <div>
                {confirmedSessions.slice(0, 2).map(sess => (
                  <div key={sess._id} className={styles.sessionCard}>
                    <div className={styles.sessionLeft}>
                      <div className={styles.sessionIconBox}>
                        <Video size={24} />
                      </div>
                      <div>
                        <h4 className={styles.sessionTitle}>{sess.topic}</h4>
                        <div className={styles.sessionMeta}>
                          Empreendedor: <strong>{sess.menteeName}</strong> ({sess.menteeBusinessName || 'Startup'}) • Fase: {sess.businessStage}
                        </div>
                      </div>
                    </div>

                    <div className={styles.sessionRight}>
                      <div className={styles.sessionDateTime}>
                        <div className={styles.sessionDate}><Calendar size={14} color="#ff6b00" /> {sess.date}</div>
                        <div className={styles.sessionTime}><Clock size={13} /> {sess.time} ({sess.duration})</div>
                      </div>

                      {sess.meetingLink && (
                        <a 
                          href={sess.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.btnMeet}
                        >
                          <Video size={16} /> Entrar na Sala
                        </a>
                      )}

                      <button 
                        style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.65rem 1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                        onClick={() => handleUpdateStatus(sess._id, 'concluida')}
                      >
                        ✓ Concluir Sessão
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pedidos Recentes Pendentes */}
          <div className={styles.contentCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}><Calendar size={20} color="#f59e0b" /> Novos Pedidos de Mentoria ({pendingRequests.length})</h3>
                <p className={styles.sectionSubtitle}>Empreendedores que solicitaram a sua orientação estratégica.</p>
              </div>
              <button 
                className={styles.btnSecondary} 
                onClick={() => setMainTab('requests')}
                style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
              >
                Gerir Todos os Pedidos →
              </button>
            </div>

            {pendingRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Todos os pedidos de mentoria foram respondidos!</p>
              </div>
            ) : (
              <div className={styles.requestList}>
                {pendingRequests.slice(0, 2).map(req => (
                  <div key={req._id} className={styles.requestCard}>
                    <div className={styles.requestTop}>
                      <div className={styles.menteeInfo}>
                        <div className={styles.menteeAvatar}>
                          {req.menteeName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className={styles.menteeName}>{req.menteeName}</h4>
                          <div className={styles.menteeStartup}>🏢 {req.menteeBusinessName} • Estágio: {req.businessStage}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className={styles.requestBadge}>Pendente</span>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                          Proposto para: <strong>{req.date} às {req.time}</strong>
                        </div>
                      </div>
                    </div>

                    <div className={styles.requestTopicBox}>
                      <div className={styles.requestTopicTitle}>Pauta: {req.topic}</div>
                      {req.objective && <p className={styles.requestObjective}>{req.objective}</p>}
                    </div>

                    <div className={styles.requestActions}>
                      <button 
                        className={styles.btnAccept}
                        onClick={() => handleUpdateStatus(req._id, 'confirmada')}
                      >
                        <Check size={16} /> Aceitar &amp; Gerar Sala
                      </button>
                      <button 
                        className={styles.btnDecline}
                        onClick={() => handleUpdateStatus(req._id, 'cancelada')}
                      >
                        <X size={16} /> Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 2: PEDIDOS DE MENTORIA (INBOUND)
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'requests' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Calendar size={22} color="#f59e0b" /> Caixa de Entrada de Pedidos</h2>
              <p className={styles.sectionSubtitle}>Analise o estágio do negócio e o objetivo da sessão antes de aceitar.</p>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>Sem pedidos pendentes</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Quando novos empreendedores solicitarem a sua mentoria, os pedidos surgirão aqui.</p>
            </div>
          ) : (
            <div className={styles.requestList}>
              {pendingRequests.map(req => (
                <div key={req._id} className={styles.requestCard}>
                  <div className={styles.requestTop}>
                    <div className={styles.menteeInfo}>
                      <div className={styles.menteeAvatar}>
                        {req.menteeName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className={styles.menteeName}>{req.menteeName}</h4>
                        <div className={styles.menteeStartup}>
                          🏢 {req.menteeBusinessName} • Contacto: {req.menteeEmail} • Estágio: {req.businessStage}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={styles.requestBadge}>Pendente</span>
                      <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 800, marginTop: '4px' }}>
                        {req.date} às {req.time}
                      </div>
                      {req.price > 0 && (
                        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                          Valor: ${req.price} (Seus honorários: ${req.mentorEarnings} • ABN: ${req.abnFee})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.requestTopicBox}>
                    <div className={styles.requestTopicTitle}>Pauta Proposta: {req.topic}</div>
                    <p className={styles.requestObjective}>
                      {req.objective || 'O empreendedor não adicionou notas complementares para esta sessão.'}
                    </p>
                  </div>

                  <div className={styles.requestActions}>
                    <button 
                      className={styles.btnAccept}
                      onClick={() => handleUpdateStatus(req._id, 'confirmada')}
                    >
                      <Check size={16} /> Aceitar &amp; Gerar Sala Virtual
                    </button>
                    <button 
                      className={styles.btnDecline}
                      onClick={() => handleUpdateStatus(req._id, 'cancelada')}
                    >
                      <X size={16} /> Recusar Pedido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 3: AGENDA & SESSÕES
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'sessions' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Clock size={22} color="#059669" /> Agenda de Mentoria</h2>
              <p className={styles.sectionSubtitle}>Sessões agendadas com link de videoconferência gerado.</p>
            </div>
          </div>

          {confirmedSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <Calendar size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>Sem sessões agendadas de momento</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Aceite pedidos na caixa de entrada para preencher a sua agenda de mentoria.</p>
            </div>
          ) : (
            <div>
              {confirmedSessions.map(sess => (
                <div key={sess._id} className={styles.sessionCard}>
                  <div className={styles.sessionLeft}>
                    <div className={styles.sessionIconBox}>
                      <Video size={24} />
                    </div>
                    <div>
                      <h4 className={styles.sessionTitle}>{sess.topic}</h4>
                      <div className={styles.sessionMeta}>
                        Com: <strong>{sess.menteeName}</strong> ({sess.menteeBusinessName}) • Duração: {sess.duration}
                      </div>
                      {sess.objective && (
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>
                          Objetivo: {sess.objective}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.sessionRight}>
                    <div className={styles.sessionDateTime}>
                      <div className={styles.sessionDate}><Calendar size={14} color="#ff6b00" /> {sess.date}</div>
                      <div className={styles.sessionTime}><Clock size={13} /> {sess.time}</div>
                    </div>

                    {sess.meetingLink && (
                      <a 
                        href={sess.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnMeet}
                      >
                        <Video size={16} /> Entrar na Sala
                      </a>
                    )}

                    <button 
                      style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.65rem 1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                      onClick={() => handleUpdateStatus(sess._id, 'concluida')}
                    >
                      ✓ Concluir Sessão
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Histórico de Concluídas */}
          {completedSessions.length > 0 && (
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '0 0 1rem 0' }}>Sessões Concluídas Recentemente ({completedSessions.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {completedSessions.map(c => (
                  <div key={c._id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem 1.2rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#0f172a' }}>{c.topic}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.menteeName} ({c.menteeBusinessName}) • {c.date}</div>
                    </div>
                    <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Concluída
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 4: STARTUPS ACOMPANHADAS & HISTÓRICO
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'mentees' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Users size={22} color="#ff6b00" /> Startups &amp; Mentees Apoiados</h2>
              <p className={styles.sectionSubtitle}>Histórico de acompanhamento e evolução dos fundadores sob a sua mentoria.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {[
              { name: 'Bissau Pay', founder: 'Fatoumata Djaló', sector: 'Fintech', stage: 'Seed', sessions: 4, score: 89 },
              { name: 'EcoSustento', founder: 'Mamadu Baldé', sector: 'AgriTech', stage: 'Tração', sessions: 6, score: 91 },
              { name: 'KuraMoz Health', founder: 'Dra. Luísa Mondlane', sector: 'HealthTech', stage: 'Seed', sessions: 3, score: 87 },
              { name: 'BioPack MZ', founder: 'Inocêncio Paulino', sector: 'Sustentabilidade', stage: 'MVP', sessions: 2, score: 82 }
            ].map((m, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase' }}>{m.sector}</span>
                    <h4 style={{ margin: '2px 0 0 0', fontSize: '1.15rem', color: '#0f172a' }}>{m.name}</h4>
                  </div>
                  <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                    Score: {m.score}/100
                  </span>
                </div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Fundador: <strong>{m.founder}</strong> • Estágio: {m.stage}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem' }}>
                  <span>{m.sessions} Sessões Realizadas</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>Em Aceleração Ativa</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 5: MEU PERFIL PROFISSIONAL & DISPONIBILIDADE
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'profile' && (
        <div className={styles.contentCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}><Edit3 size={22} color="#ff6b00" /> Perfil Profissional de Mentor</h2>
              <p className={styles.sectionSubtitle}>Atualize a sua biografia, áreas de especialidade, agenda e modelo de honorários.</p>
            </div>
          </div>

          <form onSubmit={handleSaveMentorProfile}>
            <div className={styles.profileEditorGrid}>
              <div className={styles.formGroup}>
                <label>Headline / Especialidade Principal</label>
                <input 
                  type="text" 
                  value={profileForm.headline}
                  onChange={e => setProfileForm({ ...profileForm, headline: e.target.value })}
                  placeholder="Ex: Especialista em IA, Validação de MVP e Captação de Capital"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Anos de Experiência Executiva</label>
                <input 
                  type="number" 
                  value={profileForm.yearsOfExperience}
                  onChange={e => setProfileForm({ ...profileForm, yearsOfExperience: e.target.value })}
                  min={1}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Especializações (separadas por vírgula)</label>
                <input 
                  type="text" 
                  value={profileForm.specialization}
                  onChange={e => setProfileForm({ ...profileForm, specialization: e.target.value })}
                  placeholder="Ex: Inteligência Artificial, Finanças, Pitch Deck, Go-to-Market"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Idiomas de Atendimento</label>
                <input 
                  type="text" 
                  value={profileForm.languages}
                  onChange={e => setProfileForm({ ...profileForm, languages: e.target.value })}
                  placeholder="Ex: Português, Inglês, Francês"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Dias da Semana Disponíveis</label>
                <input 
                  type="text" 
                  value={profileForm.days}
                  onChange={e => setProfileForm({ ...profileForm, days: e.target.value })}
                  placeholder="Ex: Terça-feira, Quinta-feira"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Janela de Horário Preferencial</label>
                <input 
                  type="text" 
                  value={profileForm.hours}
                  onChange={e => setProfileForm({ ...profileForm, hours: e.target.value })}
                  placeholder="Ex: 14:00 - 18:00 (Fuso Local)"
                  required
                />
              </div>

              {/* Modelo de Preço & Retenção ABN */}
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '0.95rem', color: '#0f172a' }}>Preço por Sessão (USD)</label>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 8px 0' }}>
                  Defina <strong>$0</strong> para mentoria 100% Pro-Bono (voluntária nos programas ABN Cohort). Se definir um valor (ex: $40), a ABN retém <strong>15% de taxa de facilitação/plataforma</strong> e o mentor recebe <strong>85% líquido</strong>.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="number" 
                    value={profileForm.pricePerSession}
                    onChange={e => setProfileForm({ ...profileForm, pricePerSession: e.target.value })}
                    min={0}
                    step={5}
                    style={{ width: '160px' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                    {profileForm.pricePerSession > 0 ? (
                      <span>Líquido para o Mentor: <strong>${(profileForm.pricePerSession * 0.85).toFixed(2)}</strong> • Comissão ABN (15%): <strong>${(profileForm.pricePerSession * 0.15).toFixed(2)}</strong></span>
                    ) : (
                      <span style={{ color: '#059669', fontWeight: 700 }}>Mentoria Voluntária Pro-Bono (ABN Cohort)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                className={styles.btnPrimary}
                disabled={savingProfile}
              >
                {savingProfile ? 'A guardar...' : 'Guardar Alterações do Perfil'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 6: DIRETÓRIO DE MENTORES (VISÃO DO EMPREENDEDOR)
      ───────────────────────────────────────────────────────────── */}
      {mainTab === 'explore' && (
        <div>
          {/* Barra de Pesquisa e Filtros de Mentores */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.2rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Pesquisar por nome, especialidade, país ou competência..."
                value={mentorSearch}
                onChange={e => setMentorSearch(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem' }}
              />
            </div>

            <select 
              value={selectedSpecialty} 
              onChange={e => setSelectedSpecialty(e.target.value)}
              style={{ padding: '0.65rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', background: '#f8fafc' }}
            >
              <option value="Todos">Todas as Especialidades</option>
              <option value="Inteligência Artificial">Inteligência Artificial &amp; Tech</option>
              <option value="Captação de Investimento">Finanças &amp; Investimento</option>
              <option value="Validação">Validação de MVP</option>
              <option value="Liderança">Liderança &amp; Impacto</option>
              <option value="Energia">Clean Energy &amp; Clima</option>
            </select>

            <select 
              value={selectedCountry} 
              onChange={e => setSelectedCountry(e.target.value)}
              style={{ padding: '0.65rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', background: '#f8fafc' }}
            >
              <option value="Todos">Todos os Países</option>
              <option value="Moçambique">Moçambique</option>
              <option value="Guiné-Bissau">Guiné-Bissau</option>
              <option value="Angola">Angola</option>
              <option value="Cabo Verde">Cabo Verde</option>
            </select>

            <select 
              value={selectedPriceMode} 
              onChange={e => setSelectedPriceMode(e.target.value)}
              style={{ padding: '0.65rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', background: '#f8fafc' }}
            >
              <option value="Todos">Todas as Modalidades</option>
              <option value="Gratuito">Gratuito (ABN Cohort)</option>
              <option value="Premium">Sessão Executiva Paga</option>
            </select>
          </div>

          {/* Grid de Mentores */}
          <div className={styles.mentorGrid}>
            {filteredMentors.map(mentor => (
              <div key={mentor._id} className={styles.mentorCard}>
                <div>
                  <div className={styles.mentorCardTop}>
                    <img 
                      src={mentor.profileImage || '/abn-logo.png'} 
                      alt={mentor.name}
                      className={styles.mentorPhoto}
                      onError={(e) => { (e.currentTarget as HTMLElement).setAttribute('src', '/abn-logo.png'); }}
                    />
                    <div className={styles.mentorHeaderMeta}>
                      <span style={{ fontSize: '0.72rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase' }}>
                        📍 {mentor.country}
                      </span>
                      <h3 className={styles.mentorName}>{mentor.name}</h3>
                      <p className={styles.mentorHeadline}>{mentor.headline}</p>
                      <div className={styles.mentorRatingBadge}>
                        ★ {mentor.rating} ({mentor.reviewsCount} avaliações)
                      </div>
                    </div>
                  </div>

                  {/* Especializações */}
                  <div className={styles.specTags}>
                    {mentor.specialization.slice(0, 3).map((s, i) => (
                      <span key={i} className={styles.specTag}>{s}</span>
                    ))}
                  </div>

                  {/* Preço e Disponibilidade */}
                  <div className={styles.mentorPricingRow}>
                    <span>Sessão 1-on-1:</span>
                    <span className={styles.mentorPrice}>{mentor.hourlyRate}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className={styles.mentorCardActions}>
                  <button 
                    className={styles.btnBook}
                    onClick={() => openBookModal(mentor)}
                  >
                    <Calendar size={16} /> Solicitar Mentoria
                  </button>
                  <button 
                    className={styles.btnProfile}
                    onClick={() => setSelectedMentorDetail(mentor)}
                  >
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL DE DETALHES DO MENTOR ── */}
      {selectedMentorDetail && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMentorDetail(null)}>
          <div className={styles.mentorModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button className={styles.modalCloseBtn} onClick={() => setSelectedMentorDetail(null)}>
                <X size={20} />
              </button>
              <img 
                src={selectedMentorDetail.profileImage || '/abn-logo.png'} 
                alt={selectedMentorDetail.name}
                style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }}
                onError={(e) => { (e.currentTarget as HTMLElement).setAttribute('src', '/abn-logo.png'); }}
              />
              <div>
                <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 800 }}>{selectedMentorDetail.country}</span>
                <h2 style={{ margin: 0, fontSize: '1.45rem', color: '#ffffff' }}>{selectedMentorDetail.name}</h2>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{selectedMentorDetail.role}</div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Biografia &amp; Trajetória</h4>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {selectedMentorDetail.bio}
              </p>

              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Especialidades</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {selectedMentorDetail.specialization.map((s, idx) => (
                  <span key={idx} style={{ background: '#f1f5f9', color: '#0f172a', padding: '4px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                    {s}
                  </span>
                ))}
              </div>

              {selectedMentorDetail.supportedCompanies?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Empresas &amp; Startups Apoiadas</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedMentorDetail.supportedCompanies.map((c, i) => (
                      <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                        {c.logo} {c.name} ({c.year})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Condições da Sessão</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>{selectedMentorDetail.hourlyRate}</div>
                </div>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => {
                    setSelectedMentorDetail(null);
                    openBookModal(selectedMentorDetail);
                  }}
                >
                  <Calendar size={16} /> Solicitar Mentoria Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE SOLICITAÇÃO DE MENTORIA ── */}
      {requestModalOpen && targetMentor && (
        <div className={styles.modalOverlay} onClick={() => setRequestModalOpen(false)}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '540px', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#0f172a', color: '#ffffff', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase' }}>Sessão de Mentoria</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Outfit' }}>Agendar com {targetMentor.name}</h3>
              </div>
              <button 
                onClick={() => setRequestModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitMentorshipRequest} style={{ padding: '1.5rem' }}>
              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <label>Tema da Mentoria</label>
                <select 
                  value={reqTopic}
                  onChange={e => setReqTopic(e.target.value)}
                >
                  <option value="Estratégia de Validação & MVP">Estratégia de Validação &amp; MVP</option>
                  <option value="Modelagem Financeira & Cap Table">Modelagem Financeira &amp; Cap Table</option>
                  <option value="Preparação de Pitch Deck para Investidores">Preparação de Pitch Deck para Investidores</option>
                  <option value="Arquitetura de Software & IA">Arquitetura de Software &amp; IA</option>
                  <option value="Go-To-Market & Aquisição B2B">Go-To-Market &amp; Aquisição B2B</option>
                  <option value="Estruturação Jurídica & Governança">Estruturação Jurídica &amp; Governança</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nome do Negócio / Startup</label>
                  <input 
                    type="text" 
                    value={reqBusinessName}
                    onChange={e => setReqBusinessName(e.target.value)}
                    placeholder="Ex: Minha Startup"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Estágio Atual</label>
                  <select 
                    value={reqStage}
                    onChange={e => setReqStage(e.target.value)}
                  >
                    <option value="Ideação">Ideação</option>
                    <option value="MVP">MVP</option>
                    <option value="Validação">Validação</option>
                    <option value="Seed / Tração">Seed / Tração</option>
                    <option value="Escala">Escala</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Data Pretendida</label>
                  <input 
                    type="date" 
                    value={reqDate}
                    onChange={e => setReqDate(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Horário Pretendido</label>
                  <input 
                    type="time" 
                    value={reqTime}
                    onChange={e => setReqTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1.2rem' }}>
                <label>Objetivo &amp; Desafio Principal</label>
                <textarea 
                  rows={3}
                  value={reqObjective}
                  onChange={e => setReqObjective(e.target.value)}
                  placeholder="Descreva o desafio que quer desbloquear nesta sessão para o mentor se preparar..."
                  required
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.82rem', color: '#64748b', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Valor: <strong>{targetMentor.hourlyRate}</strong></span>
                {targetMentor.pricePerSession > 0 ? (
                  <span style={{ color: '#059669', fontWeight: 700 }}>Pagamento na Confirmação</span>
                ) : (
                  <span style={{ color: '#059669', fontWeight: 700 }}>Sem Custo (ABN Cohort)</span>
                )}
              </div>

              <button 
                type="submit" 
                className={styles.btnPrimary} 
                disabled={submittingReq}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {submittingReq ? 'A enviar solicitação...' : 'Confirmar Solicitação de Mentoria'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
