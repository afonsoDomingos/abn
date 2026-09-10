'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Rocket, 
  Users, 
  Target, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  Star, 
  Clock, 
  Calendar, 
  FileText, 
  Download, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  ExternalLink,
  Layers,
  ArrowRight,
  Award,
  Sparkles,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Zap,
  BarChart2,
  Globe,
  Compass,
  Handshake
} from 'lucide-react';
import { getClubStepTitle } from '@/lib/clubUtils';
import styles from './Dashboard.module.css';

const ROLE_LABELS: Record<string, { title: string; icon: string; desc: string }> = {
  empreendedor: { title: 'Empreendedor', icon: '🚀', desc: 'Acompanhe a aceleração de ideias, pipeline de incubação e cursos.' },
  startup: { title: 'Startup', icon: '💡', desc: 'Gestão de negócio escalável, captação de investimento e programas.' },
  empresa: { title: 'Empresa / PME', icon: '🏢', desc: 'Oportunidades de expansão, inovação aberta e conexões B2B.' },
  investidor: { title: 'Investidor', icon: '💰', desc: 'Portfólio de investimento, análise de risco e startups qualificadas.' },
  mentor: { title: 'Mentor', icon: '🧭', desc: 'Orientação de fundadores, doação de horas e sessões estratégicas.' },
  consultor: { title: 'Consultor / Especialista', icon: '🎯', desc: 'Demandas técnicas, consultorias especializadas e diagnósticos.' },
  parceiro: { title: 'Parceiro', icon: '🤝', desc: 'Alianças comerciais, soluções corporativas e cooperação institucional.' },
  universidade: { title: 'Universidade / Academia', icon: '🎓', desc: 'Projetos de I&D, polos científicos e ligação universidade-empresa.' },
  incubadora: { title: 'Incubadora / Aceleradora', icon: '🏛️', desc: 'Hub de incubação, capacitação e acompanhamento de cohortes.' },
  organizacao: { title: 'Organização / Instituição', icon: '🌐', desc: 'Programas de fomento, desenvolvimento socioeconómico e parcerias.' }
};

export default function DashboardPage() {
  const [userName, setUserName] = useState('Empreendedor');
  const [userRoles, setUserRoles] = useState<string[]>(['empreendedor']);
  const [activeRole, setActiveRole] = useState('empreendedor');
  const [business, setBusiness] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [checklist, setChecklist] = useState({
    profile: false,
    business: false,
    pitchDeck: false,
    website: false
  });
  const [analytics, setAnalytics] = useState<any>(null);
  const [userInscricoes, setUserInscricoes] = useState<any[]>([]);
  const [userCursos, setUserCursos] = useState<any[]>([]);
  const [userServicos, setUserServicos] = useState<any[]>([]);
  const [loadingInscricoes, setLoadingInscricoes] = useState(true);
  const [clientTab, setClientTab] = useState<'programas' | 'cursos' | 'servicos'>('programas');
  const [startupData, setStartupData] = useState<any>(null);
  const [loadingStartup, setLoadingStartup] = useState(false);

  // Modal para Recursos Recomendados
  const [activeResource, setActiveResource] = useState<{
    title: string;
    type: 'video' | 'doc';
    description: string;
    videoUrl?: string;
    downloadUrl?: string;
  } | null>(null);

  useEffect(() => {
    fetchDashboardData();

    const handleRoleChange = () => {
      const storedActiveRole = localStorage.getItem('abn_active_role');
      if (storedActiveRole) {
        setActiveRole(storedActiveRole);
      }
    };

    window.addEventListener('abn_role_changed', handleRoleChange);
    return () => window.removeEventListener('abn_role_changed', handleRoleChange);
  }, []);

  const switchActiveRole = (newRole: string) => {
    setActiveRole(newRole);
    localStorage.setItem('abn_active_role', newRole);
    window.dispatchEvent(new Event('abn_role_changed'));
  };

  const fetchDashboardData = async () => {
    try {
      // 1. Get user details from localStorage
      const userStr = localStorage.getItem('user');
      let hasProfileDesc = false;
      let userRole = 'empreendedor';
      let userEmail = '';
      let rolesArr: string[] = ['empreendedor'];

      if (userStr) {
        const u = JSON.parse(userStr);
        setUserName(u.name || 'Membro');
        userRole = u.role || 'empreendedor';
        userEmail = u.email || '';
        
        rolesArr = Array.isArray(u.roles) && u.roles.length > 0 
          ? u.roles 
          : [userRole];
        
        setUserRoles(rolesArr);

        const r = userRole.toLowerCase();
        if (r === 'admin' || r === 'collaborator' || r === 'colaborador') {
          window.location.href = '/admin';
          return;
        }

        const storedActive = localStorage.getItem('abn_active_role');
        const currentActive = storedActive && rolesArr.includes(storedActive)
          ? storedActive
          : rolesArr[0];

        setActiveRole(currentActive);
        hasProfileDesc = !!u.description || !!u.email;
      }

      // 2. Fetch business details
      const res = await fetch('/api/user/business');
      const data = await res.json();
      
      let hasBiz = false;
      let hasWeb = false;
      let hasDeck = false;

      if (data.success && data.business) {
        setBusiness(data.business);
        hasBiz = true;
        hasWeb = !!data.business.website;
        hasDeck = !!(data.business.description && data.business.description.length >= 30);
      }

      // Calculate score
      const checks = {
        profile: hasProfileDesc,
        business: hasBiz,
        pitchDeck: hasDeck,
        website: hasWeb
      };

      let calculatedScore = 0;
      if (checks.profile) calculatedScore += 25;
      if (checks.business) calculatedScore += 25;
      if (checks.pitchDeck) calculatedScore += 25;
      if (checks.website) calculatedScore += 25;

      setScore(calculatedScore);
      setChecklist(checks);

      // 3. Fetch user's inscriptions / memberships
      try {
        const inscRes = await fetch('/api/clube/inscricoes');
        const inscData = await inscRes.json();
        if (inscData.inscricoes && userEmail) {
          const myInsc = inscData.inscricoes.filter((i: any) => i.email?.toLowerCase() === userEmail.toLowerCase());
          setUserInscricoes(myInsc);
        }
      } catch (e) {}

      // 4. Fetch user's course enrollments / payments
      try {
        const payRes = await fetch('/api/payments');
        const payData = await payRes.json();
        if (payData.payments) {
          setUserCursos(payData.payments);
        }
      } catch (e) {}

      // 5. Fetch user's requested services
      try {
        const reqRes = await fetch('/api/requests');
        const reqData = await reqRes.json();
        if (reqData.requests) {
          setUserServicos(reqData.requests);
        }
      } catch (e) {}

      // 6. Fetch startup data if role includes startup
      try {
        const userStr2 = localStorage.getItem('user');
        if (userStr2) {
          const u2 = JSON.parse(userStr2);
          const rolesCheck: string[] = Array.isArray(u2.roles) && u2.roles.length > 0 ? u2.roles : [u2.role || 'empreendedor'];
          if (rolesCheck.includes('startup') || (u2.role || '').toLowerCase() === 'startup') {
            await fetchStartupData();
          }
        }
      } catch (e) {}

    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInscricoes(false);
    }
  };

  const fetchStartupData = async () => {
    setLoadingStartup(true);
    try {
      const res = await fetch('/api/user/startup');
      const data = await res.json();
      if (data.success && data.business) {
        setStartupData(data.business);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStartup(false);
    }
  };

  const currentRoleInfo = ROLE_LABELS[activeRole] || {
    title: activeRole.toUpperCase(),
    icon: '⚡',
    desc: 'Bem-vindo ao seu painel na ABN.'
  };

  return (
    <div className={styles.dashboard}>
      
      {/* ─────────────────────────────────────────────────────────────
         BARRA SUPERIOR: BOAS-VINDAS MULTI-PERFIL & SELETOR DE VISÃO
      ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        border: '1px solid rgba(255, 107, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, background: 'rgba(255,107,0,0.2)', color: '#ff6b00', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ABN Dashboard
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '3px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} /> Perfil Verificado
              </span>
            </div>
            <h1 style={{ margin: '0 0 0.35rem 0', fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>
              Olá, <span className="text-gradient-gold">{userName}</span> 👋
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
              {currentRoleInfo.desc}
            </p>
          </div>

          {/* Badge Perfil Ativo */}
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '0.85rem 1.25rem', textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Visão Ativa</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ff6b00', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
              <span>{currentRoleInfo.icon}</span> {currentRoleInfo.title}
            </div>
          </div>
        </div>

        {/* Multi-Perfis Selector Pills */}
        {userRoles.length > 1 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={14} /> Alternar Visão:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {userRoles.map(roleKey => {
                const info = ROLE_LABELS[roleKey] || { title: roleKey, icon: '⚡' };
                const isSelected = activeRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    onClick={() => switchActiveRole(roleKey)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: isSelected ? '1px solid #ff6b00' : '1px solid rgba(255,255,255,0.15)',
                      background: isSelected ? '#ff6b00' : 'rgba(255,255,255,0.08)',
                      color: isSelected ? '#ffffff' : '#e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{info.icon}</span>
                    <span>{info.title}</span>
                    {isSelected && <span style={{ fontSize: '0.68rem', opacity: 0.9 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
         1. INVESTOR DASHBOARD VIEW
      ───────────────────────────────────────────────────────────── */}
      {activeRole === 'investidor' && (
        <>
          {/* Banner Executivo de Acesso ao Deal Room */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            borderRadius: '20px',
            padding: '2rem',
            color: '#ffffff',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 107, 0, 0.15)', color: '#ff8c38', border: '1px solid rgba(255, 107, 0, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                <TrendingUp size={13} /> Portal do Investidor Ativo
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 6px 0', fontFamily: 'Outfit' }}>
                Dealflow &amp; Oportunidades de Co-Investimento
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '620px', margin: 0 }}>
                Explore rodadas de investimento abertas, aceda a pitch decks confidenciais e agende reuniões de due diligence com fundadores validados pelo ABN Hub.
              </p>
            </div>

            <Link 
              href="/dashboard/investimentos"
              style={{
                background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.85rem 1.6rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(255, 107, 0, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Abrir Deal Room Completo 💎</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Portfólio de Análise &amp; Deals</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  $1.1M<span style={{ fontSize: '0.9rem', color: '#64748b' }}> em captação</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    5 oportunidades qualificadas com rodadas ativas em Fintech, AgriTech, Logística e Energia Limpa.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={styles.progressCard}>
              <h3>Critérios de Credenciação</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Registo de Perfil de Investidor Concluído</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Setores e Teses de Investimento Ativos</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Acesso Liberado a Pitch Decks &amp; Data Rooms</li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Ações Rápidas de Investimento</h2>
          </div>

          <div className={styles.tasks}>
            <Link href="/dashboard/investimentos" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={true} readOnly />
                <span style={{ fontWeight: 600 }}>Explorar diretório de startups em rodada de financiamento no Deal Room →</span>
              </div>
            </Link>
            <Link href="/dashboard/investimentos" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={false} readOnly />
                <span style={{ fontWeight: 600 }}>Agendar reuniões de Due Diligence com fundadores via ABN Hub →</span>
              </div>
            </Link>
            <Link href="/dashboard/investimentos" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={false} readOnly />
                <span style={{ fontWeight: 600 }}>Submeter Term Sheet ou manifestação de interesse confidencial →</span>
              </div>
            </Link>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Recursos para Investidores</h2>
          </div>

          <div className={styles.resources}>
            <div className={styles.resourceCard} onClick={() => setActiveResource({ title: 'VC Trends em África e Lusofonia', type: 'doc', description: 'Relatório semestral de investimentos em venture capital e oportunidades em mercados CPLP.' })}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(255, 107, 0, 0.08)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <BarChart3 size={28} color="var(--primary, #ff6b00)" />
              </div>
              <h4>VC Trends em África</h4>
              <p style={{ fontSize: '0.85rem' }}>Relatório Semestral - PDF</p>
            </div>
            <div className={styles.resourceCard} onClick={() => setActiveResource({ title: 'Guia de Co-Investimento & Compliance', type: 'doc', description: 'Manual de melhores práticas de co-investimento e governança para investidores anjo e fundos.' })}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(255, 107, 0, 0.08)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Users size={28} color="var(--primary, #ff6b00)" />
              </div>
              <h4>Guia de Co-Investimento</h4>
              <p style={{ fontSize: '0.85rem' }}>Boas Práticas &amp; Compliance</p>
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         2. MENTOR DASHBOARD VIEW
      ───────────────────────────────────────────────────────────── */}
      {activeRole === 'mentor' && (
        <>
          {/* Banner Executivo de Acesso ao Portal de Mentoria */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            borderRadius: '20px',
            padding: '2rem',
            color: '#ffffff',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                <Compass size={13} /> Área do Mentor ABN
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 6px 0', fontFamily: 'Outfit' }}>
                Gestão de Mentorias, Sessões &amp; Mentees
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '620px', margin: 0 }}>
                Responda a pedidos de mentoria de fundadores, realize sessões virtuais com links integrados e configure a sua disponibilidade e especialidades.
              </p>
            </div>

            <Link 
              href="/dashboard/mentoria"
              style={{
                background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.85rem 1.6rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(255, 107, 0, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Aceder ao Portal de Mentoria 🧭</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Atividade de Mentoria</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  14<span style={{ fontSize: '1rem', color: '#64748b' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Fundadores e startups sob a sua mentoria estratégica no ecossistema ABN.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={styles.progressCard}>
              <h3>Métricas do Mentor</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="var(--primary, #ff6b00)" /> Avaliação Média: <strong>4.9 / 5.0 ★</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="var(--primary, #ff6b00)" /> Horas Doadas: <strong>24 Horas</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="var(--primary, #ff6b00)" /> Sessões Concluídas: <strong>18 Sessões</strong></li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Ações Rápidas de Mentoria</h2>
          </div>

          <div className={styles.tasks}>
            <Link href="/dashboard/mentoria" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={true} readOnly />
                <span style={{ fontWeight: 600 }}>Gerir pedidos de mentoria pendentes na caixa de entrada →</span>
              </div>
            </Link>
            <Link href="/dashboard/mentoria" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={false} readOnly />
                <span style={{ fontWeight: 600 }}>Aceder à sala virtual da próxima sessão agendada no Google Meet →</span>
              </div>
            </Link>
            <Link href="/dashboard/mentoria" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={false} readOnly />
                <span style={{ fontWeight: 600 }}>Atualizar disponibilidade semanal e especialidades no perfil →</span>
              </div>
            </Link>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Materiais de Apoio</h2>
          </div>

          <div className={styles.resources}>
            <div className={styles.resourceCard} onClick={() => setActiveResource({ title: 'Manual do Mentor ABN', type: 'doc', description: 'Metodologias e melhores práticas de orientação ágil para fundadores.' })}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(255, 107, 0, 0.08)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={28} color="var(--primary, #ff6b00)" />
              </div>
              <h4>Manual do Mentor ABN</h4>
              <p style={{ fontSize: '0.85rem' }}>Metodologias &amp; Práticas - PDF</p>
            </div>
            <div className={styles.resourceCard} onClick={() => setActiveResource({ title: 'Lean Startup Guia', type: 'doc', description: 'Ferramenta oficial de validação de hipóteses e MVPs para orientar fundadores.' })}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(255, 107, 0, 0.08)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Rocket size={28} color="var(--primary, #ff6b00)" />
              </div>
              <h4>Lean Startup Guia</h4>
              <p style={{ fontSize: '0.85rem' }}>Ferramenta de Validação de Ideias</p>
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         3. CONSULTOR / ESPECIALISTA VIEW
      ───────────────────────────────────────────────────────────── */}
      {activeRole === 'consultor' && (
        <>
          {/* Banner Executivo de Acesso ao Hub do Consultor */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            borderRadius: '20px',
            padding: '2rem',
            color: '#ffffff',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                <Briefcase size={13} /> Hub de Especialistas &amp; Consultoria ABN
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 6px 0', fontFamily: 'Outfit' }}>
                Mercado de Conhecimento &amp; Serviços Técnicos
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '620px', margin: 0 }}>
                Monetize o seu conhecimento especializado. Publique serviços, defina preçários (fixo, por hora ou sob orçamento), receba encomendas diretas e acompanhe o ciclo de vida dos projetos.
              </p>
            </div>

            <Link 
              href="/dashboard/servicos"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.85rem 1.6rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Gerir Serviços &amp; Pedidos</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Consultorias &amp; Contratos Ativos</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4f46e5', fontFamily: 'Outfit' }}>
                  5<span style={{ fontSize: '1rem', color: '#64748b' }}> projetos</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Demandas de especialidade técnica e contratos em execução solicitados por empresas e startups no Hub ABN.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.progressCard}>
              <h3>Métricas de Prática &amp; Reputação</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="#f59e0b" /> Avaliação dos Clientes: <strong>4.9 / 5.0 ★</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Taxa de Conclusão no Prazo: <strong>96%</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18} color="#4f46e5" /> Faturação Acumulada: <strong>14.500 €</strong></li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>10 Áreas Estratégicas de Especialidade ABN</h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
            {[
              'Consultoria', 'Contabilidade', 'Marketing', 'Direito empresarial', 
              'Tecnologia', 'Recursos humanos', 'Gestão', 'Exportação', 'Financiamento', 'Estratégia'
            ].map(cat => (
              <Link 
                key={cat}
                href="/dashboard/servicos?view=market"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#334155',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Briefcase size={12} color="#6366f1" />
                {cat}
              </Link>
            ))}
          </div>

          <div className={styles.sectionTitle}>
            <h2>Ações Rápidas do Especialista</h2>
          </div>

          <div className={styles.tasks}>
            <Link href="/dashboard/servicos" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={true} readOnly />
                <span style={{ fontWeight: 600 }}>Cadastrar ou atualizar pacotes de serviços e valores no catálogo →</span>
              </div>
            </Link>
            <Link href="/dashboard/servicos" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={false} readOnly />
                <span style={{ fontWeight: 600 }}>Responder a novos pedidos e cotações de empresas na caixa de entrada →</span>
              </div>
            </Link>
            <Link href="/dashboard/servicos" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={false} readOnly />
                <span style={{ fontWeight: 600 }}>Atualizar portfólio de cases com métricas quantificáveis de sucesso →</span>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         3b. PARCEIRO INSTITUCIONAL VIEW
      ───────────────────────────────────────────────────────────── */}
      {activeRole === 'parceiro' && (
        <>
          {/* Banner Executivo de Acesso ao Hub do Parceiro */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c4a6e 100%)',
            borderRadius: '20px',
            padding: '2rem',
            color: '#ffffff',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(99, 102, 241, 0.25)'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                <Handshake size={13} /> Parcerias Estratégicas ABN
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 6px 0', fontFamily: 'Outfit' }}>
                Cooperação Institucional &amp; Impacto no Ecossistema
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '620px', margin: 0 }}>
                Coordene programas estruturantes com a ABN. Acompanhe o ciclo de vida de projetos conjuntos, webinars e fóruns co-organizados, e o impacto direto gerado em startups e PMEs.
              </p>
            </div>

            <Link 
              href="/dashboard/parceiro"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.85rem 1.6rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Aceder à Área do Parceiro</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Impacto Comunitário &amp; Cooperação</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4f46e5', fontFamily: 'Outfit' }}>
                  42<span style={{ fontSize: '1rem', color: '#64748b' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Startups e PMEs impulsionadas através dos programas conjuntos com a ABN e fundos mobilizados.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.progressCard}>
              <h3>Métricas da Parceria Oficial</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} color="#16a34a" /> Protocolo / MOU: <strong>Válido até 2027</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Handshake size={18} color="#6366f1" /> Projetos em Execução: <strong>4 Iniciativas</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign size={18} color="#f59e0b" /> Recursos Mobilizados: <strong>70.000 €</strong></li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Iniciativas Bilaterais em Destaque</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', background: '#eef2ff', color: '#4f46e5', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>Aceleração &amp; Inovação</span>
              <h4 style={{ margin: '8px 0 4px 0', fontSize: '1rem', color: '#0f172a' }}>InovaÁfrica: Programa Agrotech 2026</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Capacitação e bolsa para 30 startups agrotech em Moçambique e Guiné-Bissau.</p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', background: '#f0fdf4', color: '#16a34a', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>Conferência B2B</span>
              <h4 style={{ margin: '8px 0 4px 0', fontSize: '1rem', color: '#0f172a' }}>Fórum Económico da Lusofonia &amp; ABN</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Webinar executivo e rodadas de matchmaking entre fundadores e investidores.</p>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Ações Rápidas de Parceria</h2>
          </div>

          <div className={styles.tasks}>
            <Link href="/dashboard/parceiro" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={true} readOnly />
                <span style={{ fontWeight: 600 }}>Acompanhar status e entregáveis dos projetos bilaterais ativos →</span>
              </div>
            </Link>
            <Link href="/dashboard/parceiro" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={false} readOnly />
                <span style={{ fontWeight: 600 }}>Propor novo projeto conjunto ou agendar evento co-organizado →</span>
              </div>
            </Link>
            <Link href="/dashboard/parceiro" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.taskItem} style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={false} readOnly />
                <span style={{ fontWeight: 600 }}>Consultar repositório de documentos oficiais e relatório trimestral →</span>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         4a. EMPRESA / PME DASHBOARD — Sofisticado
      ───────────────────────────────────────────────────────────── */}
      {activeRole === 'empresa' && (
        <>
          {/* Hero Banner PME */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c4a6e 100%)', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(14,165,233,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(14,165,233,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(14,165,233,0.25)', color: '#7dd3fc', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.8px', border: '1px solid rgba(14,165,233,0.35)' }}>🏢 Empresa / PME</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.3)' }}>🟢 Verificada</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>
                  {business?.name || 'Minha Empresa'}
                </h2>
                <p style={{ margin: '0.4rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                  Comércio & Indústria · PME · {business?.location || 'Guiné-Bissau'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/dashboard/empresa" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: '#ffffff', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(14,165,233,0.5)' }}>
                  <Globe size={16} /> Business Connect
                </Link>
                <Link href="/dashboard/negocios" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Building2 size={16} /> Gerir Negócio
                </Link>
              </div>
            </div>
          </div>

          {/* KPI Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Clientes Ativos', value: business?.clients?.length || 12, icon: '👤', bg: 'rgba(14,165,233,0.08)' },
              { label: 'Projetos', value: business?.stats?.projects || 8, icon: '📂', bg: 'rgba(99,102,241,0.08)' },
              { label: 'Fornecedores', value: business?.suppliers?.length || 5, icon: '📦', bg: 'rgba(16,185,129,0.08)' },
              { label: 'Pedidos Connect', value: 2, icon: '🔗', bg: 'rgba(245,158,11,0.08)' },
              { label: 'Mercados', value: '3 países', icon: '🌍', bg: 'rgba(139,92,246,0.08)' },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{kpi.icon}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit' }}>{kpi.value}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Business Connect Panel */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={20} color="#0ea5e9" /> Business Connect — Pedidos Ativos
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>Publique necessidades comerciais. A ABN procura correspondências na rede.</p>
              </div>
              <Link href="/dashboard/empresa" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none' }}>
                + Publicar Pedido
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                { icon: '🏪', label: 'Procuro Distribuidor', title: 'Procuro distribuidor em Angola', country: 'Angola', status: 'ativo', responses: 3, color: '#6366f1' },
                { icon: '💻', label: 'Procuro Parceiro Tecnológico', title: 'Digitalização e ERP — parceiro tecnológico', country: 'Portugal / GB', status: 'em_negociacao', responses: 7, color: '#8b5cf6' },
              ].map((c, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{c.title}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, background: c.status === 'ativo' ? '#dcfce7' : '#fef3c7', color: c.status === 'ativo' ? '#15803d' : '#d97706', padding: '2px 8px', borderRadius: '12px' }}>
                        {c.status === 'ativo' ? 'Ativo' : 'Em Negociação'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>🌍 {c.country} · 💬 {c.responses} respostas ABN</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/empresa" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0ea5e9', textDecoration: 'none' }}>
              Ver todos os pedidos e respostas →
            </Link>
          </div>

          {/* Desenvolvimento Empresarial */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowRight size={20} color="#6366f1" /> Desenvolvimento Empresarial
              </h3>
              <Link href="/dashboard/empresa" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6366f1', textDecoration: 'none' }}>Ver tudo →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem' }}>
              {[
                { icon: '🎯', label: 'Consultoria', color: 'rgba(99,102,241,0.08)' },
                { icon: '🌐', label: 'Internacionalização', color: 'rgba(14,165,233,0.08)' },
                { icon: '📢', label: 'Marketing', color: 'rgba(245,158,11,0.08)' },
                { icon: '🎓', label: 'Formação', color: 'rgba(16,185,129,0.08)' },
                { icon: '🧭', label: 'Mentoria', color: 'rgba(139,92,246,0.08)' },
                { icon: '♟️', label: 'Estratégia', color: 'rgba(239,68,68,0.08)' },
                { icon: '👥', label: 'Recursos Humanos', color: 'rgba(255,107,0,0.08)' },
                { icon: '🚀', label: 'Aceleração', color: 'rgba(15,23,42,0.06)' },
              ].map(item => (
                <Link key={item.label} href="/dashboard/empresa" style={{ textDecoration: 'none' }}>
                  <div style={{ background: item.color, borderRadius: '14px', padding: '1rem', textAlign: 'center', border: '1px solid transparent', transition: 'all 0.2s', cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>{item.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Full Dashboard */}
          <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1.5px solid #bae6fd', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🏢</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0c4a6e' }}>Painel Completo da Empresa</div>
                <div style={{ fontSize: '0.82rem', color: '#0369a1' }}>Dados, equipa, clientes, fornecedores, projetos e Business Connect.</div>
              </div>
            </div>
            <Link href="/dashboard/empresa" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: '#ffffff', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>
              <Building2 size={16} /> Gerir Empresa →
            </Link>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         4b. PARCEIRO VIEW
      ───────────────────────────────────────────────────────────── */}
      {activeRole === 'parceiro' && (
        <>
          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Oportunidades &amp; Conexões B2B</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  24<span style={{ fontSize: '1rem', color: '#64748b' }}> conexões</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Empresas qualificadas, fornecedores certificados e sinergias empresariais no ecossistema ABN.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.progressCard}>
              <h3>Rede Corporativa</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Selo de Empresa Parceira Oficial ABN</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Acesso ao Fórum de Negócios B2B</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Oportunidades de Compra &amp; Parcerias Estratégicas</li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Inovação Aberta &amp; Soluções de Startups</h2>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#475569' }}>
              Encontre startups e especialistas que solucionam desafios operacionais da sua organização através de tecnologias aplicadas.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard/oportunidades" className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                Explorar Oportunidades →
              </Link>
              <Link href="/dashboard/networking" className="btn-outline" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                Ver Diretório de Membros
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         5. UNIVERSIDADE / INCUBADORA / ORGANIZAÇÃO VIEW
      ───────────────────────────────────────────────────────────── */}
      {(activeRole === 'universidade' || activeRole === 'incubadora' || activeRole === 'organizacao') && (
        <>
          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Hub Institucional &amp; I&amp;D</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  12<span style={{ fontSize: '1rem', color: '#64748b' }}> projetos</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Iniciativas conjuntas de capacitação, transferência de tecnologia e ligação universidade-empresa.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.progressCard}>
              <h3>Compromisso Institucional</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Protocolo de Cooperação ABN Ativo</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Partilha de Bolsas &amp; Talentos Académicos</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Apoio ao Desenvolvimento de Startups Universitárias</li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Programas de Capacitação &amp; Fomento</h2>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#475569' }}>
              Divulgue bolsas de estudo, congressos científicos e programas de aceleração para toda a rede de empreendedores ABN.
            </p>
            <Link href="/dashboard/programas" className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
              Gerir Programas Institucionais →
            </Link>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         6a. STARTUP DASHBOARD — Sofisticado (apenas activeRole === 'startup')
      ───────────────────────────────────────────────────────────── */}
      {activeRole === 'startup' && (
        <>
          {/* Hero Banner da Startup */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(99,102,241,0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(251,191,36,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.8px', border: '1px solid rgba(99,102,241,0.4)' }}>
                      💡 Startup
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.3)' }}>
                      🟢 Ativo
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>
                    {startupData?.name || 'Minha Startup'}
                  </h2>
                  <p style={{ margin: '0.4rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
                    {startupData?.startupProfile?.sector || 'Tecnologia'} · {startupData?.startupProfile?.stage || 'MVP'} · {startupData?.startupProfile?.businessModel || 'B2B SaaS'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link href="/dashboard/captacao" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#6366f1', color: '#ffffff', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(99,102,241,0.5)', transition: 'all 0.2s' }}>
                    <TrendingUp size={16} /> Captação 🚀
                  </Link>
                  <Link href="/dashboard/negocios" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <Building2 size={16} /> Gerir Startup
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── STARTUP SCORE CARD ── */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Award size={20} color="#6366f1" />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                    Startup Score ABN
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                  Avaliação diagnóstica da plataforma baseada em 7 critérios.
                </p>
              </div>
              {/* Overall score circle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '90px' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                  <svg viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)', width: '90px', height: '90px' }}>
                    <circle cx="45" cy="45" r="38" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <circle
                      cx="45" cy="45" r="38" fill="none"
                      stroke="#6366f1" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 38}`}
                      strokeDashoffset={`${2 * Math.PI * 38 * (1 - (startupData?.startupScore?.total || 84) / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{startupData?.startupScore?.total || 84}</span>
                    <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>/100</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 800, marginTop: '4px' }}>Bom</span>
              </div>
            </div>

            {/* 7-Pillar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Equipa', key: 'team', icon: '👥', color: '#6366f1' },
                { label: 'Produto', key: 'product', icon: '🛠️', color: '#8b5cf6' },
                { label: 'Mercado', key: 'market', icon: '🌍', color: '#0ea5e9' },
                { label: 'Tração', key: 'traction', icon: '📈', color: '#10b981' },
                { label: 'Modelo de Negócio', key: 'businessModel', icon: '💼', color: '#f59e0b' },
                { label: 'Governança', key: 'governance', icon: '🏛️', color: '#ef4444' },
                { label: 'Potencial de Crescimento', key: 'growthPotential', icon: '🚀', color: '#ff6b00' }
              ].map(pillar => {
                const val = startupData?.startupScore?.[pillar.key] ?? 80;
                return (
                  <div key={pillar.key} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1rem' }}>{pillar.icon}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>{pillar.label}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: pillar.color }}>{val}</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${val}%`, background: pillar.color, borderRadius: '99px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer */}
            <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <AlertCircle size={16} color="#ca8a04" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#713f12', lineHeight: 1.5 }}>
                <strong>Aviso importante:</strong> O Startup Score é uma ferramenta diagnóstica interna da ABN e não constitui garantia de investimento, recomendação financeira, nem aval institucional. A pontuação é calculada automaticamente com base nos dados submetidos na plataforma e destina-se exclusivamente a fins de autoavaliação.
              </p>
            </div>
          </div>

          {/* ── KPIs de TRAÇÃO ── */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={20} color="#10b981" /> Métricas de Tração em Tempo Real
              </h3>
              <Link href="/dashboard/captacao" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Atualizar KPIs →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'MRR', value: startupData?.traction?.mrr || '$5,000', icon: '💵', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                { label: 'ARR', value: startupData?.traction?.arr || '$60,000', icon: '📊', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
                { label: 'Runway', value: `${startupData?.traction?.runwayMonths || 14} meses`, icon: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
                { label: 'Burn Rate', value: startupData?.traction?.burnRate || '$3,500/mês', icon: '🔥', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
                { label: 'Clientes Ativos', value: `${startupData?.traction?.activeClients || 45}`, icon: '👤', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
                { label: 'Crescimento MoM', value: startupData?.traction?.momGrowth || '18%', icon: '📈', color: '#ff6b00', bg: 'rgba(255,107,0,0.08)' }
              ].map(kpi => (
                <div key={kpi.label} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {kpi.icon}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit' }}>{kpi.value}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{kpi.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RODADA DE CAPTAÇÃO ATIVA ── */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '1.5px solid #bbf7d0', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                💰
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#064e3b' }}>Rodada de Captação Ativa</h4>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>
                    {startupData?.fundraising?.roundStatus || 'Aberta'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: 600 }}>
                    💵 Procura: <strong>{startupData?.fundraising?.seekingAmount || '$150,000'}</strong>
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: 600 }}>
                    📊 Valuation: <strong>{startupData?.fundraising?.valuation || '$1.5M Pre-Money'}</strong>
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: 600 }}>
                    🎯 Estágio: <strong>{startupData?.fundraising?.stage || 'Seed'}</strong>
                  </span>
                  <span style={{ fontSize: '0.82rem', color: startupData?.fundraising?.pitchDeckUrl ? '#065f46' : '#b45309', fontWeight: 600 }}>
                    {startupData?.fundraising?.pitchDeckUrl ? '✅ Pitch Deck carregado' : '⚠️ Pitch Deck em falta'}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/dashboard/captacao" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#10b981', color: '#ffffff', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              <DollarSign size={16} /> Gerir Captação
            </Link>
          </div>

          {/* ── PROGRAMA DE ACELERAÇÃO ── */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="#6366f1" /> Programa de Aceleração
              </h3>
              <Link href="/dashboard/captacao" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1', textDecoration: 'none' }}>
                Ver Detalhes →
              </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                {startupData?.acceleration?.programName || 'ABN Cohort Aceleração Global'}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6366f1' }}>
                {startupData?.acceleration?.progress || 45}% concluído
              </span>
            </div>
            <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ height: '100%', width: `${startupData?.acceleration?.progress || 45}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '99px', transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Mentores Atribuídos</div>
                {(startupData?.acceleration?.mentors?.length > 0 ? startupData.acceleration.mentors.slice(0, 2) : [
                  { name: 'Dr. Carlos Mendes', role: 'Serial Entrepreneur' },
                  { name: 'Ana Fernandes', role: 'VC Partner' }
                ]).map((m: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                      {m.name?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Próxima Sessão</div>
                {(startupData?.acceleration?.sessions?.length > 0 ? startupData.acceleration.sessions.filter((s: any) => s.status === 'Agendada').slice(0, 1) : [
                  { title: 'Estratégia de Go-to-Market', mentorName: 'Dr. Carlos Mendes', date: 'Amanhã, 14h00', status: 'Agendada' }
                ]).map((s: any, i: number) => (
                  <div key={i} style={{ marginTop: '6px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>com {s.mentorName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>{s.date}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Workshops</div>
                {(startupData?.acceleration?.workshops?.length > 0 ? startupData.acceleration.workshops.slice(0, 2) : [
                  { title: 'Fundraising & Term Sheets', instructor: 'Pedro Gomes', date: 'Sáb, 10h00' },
                  { title: 'Growth Hacking Avançado', instructor: 'Maria Silva', date: 'Dom, 11h00' }
                ]).map((w: any, i: number) => (
                  <div key={i} style={{ marginTop: '6px', paddingBottom: '6px', borderBottom: i === 0 ? '1px solid #e2e8f0' : 'none' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{w.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{w.instructor} · {w.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS para STARTUP ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { href: '/dashboard/captacao', icon: '🎯', label: 'Data Room', desc: 'Gerir documentos para investidores', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
              { href: '/dashboard/captacao', icon: '🤝', label: 'Solicitar Introdução', desc: 'Conectar com investidores ABN', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
              { href: '/dashboard/networking', icon: '🌍', label: 'Procurar Investidores', desc: 'Explorar o ecossistema ABN', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
              { href: '/dashboard/perfil', icon: '✏️', label: 'Atualizar Perfil', desc: 'Setor, modelo, equipa e produto', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' }
            ].map(action => (
              <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                    {action.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>{action.label}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>{action.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         6b. EMPREENDEDOR DASHBOARD
      ───────────────────────────────────────────────────────────── */}
      {activeRole === 'empreendedor' && (
        <>
          {/* Active Membership Banner Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '20px', padding: '1.2rem 1.6rem', boxShadow: '0 10px 25px rgba(15,23,42,0.12)', display: 'flex', alignItems: 'center', gap: '1.2rem', border: '1px solid rgba(255,107,0,0.25)', width: '100%' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(255,107,0,0.15)', color: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                🏛️
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ff6b00', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Membro Registado</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>🟢 Ativo</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
                  {userInscricoes && userInscricoes.length > 0
                    ? `${getClubStepTitle(userInscricoes[0].programaTitulo || 'Clube dos Empreendedores ABN')} — ${userInscricoes[0].nivelAdesao?.toUpperCase() || 'Membro Oficial'}`
                    : getClubStepTitle('Clube dos Empreendedores ABN')}
                </div>
              </div>
              <Link href="/dashboard/perfil" style={{ color: '#ff8c3a', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                Ver Perfil →
              </Link>
            </div>
          </div>

          {/* ── MÓDULO DE CRESCIMENTO & RECOMENDAÇÕES INTELIGENTES ── */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={22} color="#ff6b00" /> Crescimento &amp; Oportunidades do Ecossistema
                </h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                  Inteligência de matching para acelerar e financiar o seu negócio.
                </p>
              </div>
              <Link href="/dashboard/negocios" className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={15} /> Painel de Gestão do Negócio →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              {/* Card 1: Investimento */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,107,0,0.1)', color: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>
                    💰
                  </div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                    O seu negócio precisa de investimento?
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                    Submeta o seu Pitch Deck e conecte-se a investidores anjo e fundos de capital de risco no ABN Hub.
                  </p>
                </div>
                <Link href="/dashboard/projetos" style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 800, color: '#ff6b00', textDecoration: 'none' }}>
                  Submeter a Investidores →
                </Link>
              </div>

              {/* Card 2: Oportunidades Compatíveis */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>
                    🎯
                  </div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                    Existem 5 oportunidades compatíveis
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                    Encontramos editais, bolsas e linhas de fomento abertas com compatibilidade direta para o seu setor.
                  </p>
                </div>
                <Link href="/dashboard/oportunidades" style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 800, color: '#10b981', textDecoration: 'none' }}>
                  Ver 5 Oportunidades →
                </Link>
              </div>

              {/* Card 3: Mentores Disponíveis */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(126,34,206,0.1)', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>
                    🧭
                  </div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                    Existem 3 mentores disponíveis na sua área
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                    Especialistas líderes de mercado prontos para prestar mentoria estratégica e guiar a tração do negócio.
                  </p>
                </div>
                <Link href="/dashboard/networking" style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 800, color: '#7e22ce', textDecoration: 'none' }}>
                  Consultar Mentores →
                </Link>
              </div>

              {/* Card 4: Parceiros Internacionais */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>
                    🌐
                  </div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                    Há 2 parceiros internacionais interessados
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                    Empresas e câmaras de comércio nos mercados lusófonos e europeus abertas a acordos bilaterais.
                  </p>
                </div>
                <Link href="/dashboard/networking" style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 800, color: '#3b82f6', textDecoration: 'none' }}>
                  Conectar com Parceiros →
                </Link>
              </div>
            </div>
          </div>

          {/* Inscrições, Cursos & Serviços Solicitados */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ padding: '1.75rem', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
              
              {/* Tabs Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setClientTab('programas')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: clientTab === 'programas' ? '#ff6b00' : '#f8fafc',
                      color: clientTab === 'programas' ? '#ffffff' : '#64748b',
                      transition: 'all 0.2s'
                    }}
                  >
                    Programas &amp; Clube ({userInscricoes.length})
                  </button>
                  <button
                    onClick={() => setClientTab('cursos')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: clientTab === 'cursos' ? '#ff6b00' : '#f8fafc',
                      color: clientTab === 'cursos' ? '#ffffff' : '#64748b',
                      transition: 'all 0.2s'
                    }}
                  >
                    Cursos &amp; Formação ({userCursos.length})
                  </button>
                  <button
                    onClick={() => setClientTab('servicos')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: clientTab === 'servicos' ? '#ff6b00' : '#f8fafc',
                      color: clientTab === 'servicos' ? '#ffffff' : '#64748b',
                      transition: 'all 0.2s'
                    }}
                  >
                    Serviços Solicitados ({userServicos.length})
                  </button>
                </div>
              </div>

              {/* Tab Content 1: Programas & Clube */}
              {clientTab === 'programas' && (
                <div>
                  {loadingInscricoes ? (
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>A carregar candidaturas...</div>
                  ) : userInscricoes.length === 0 ? (
                    <div style={{ background: '#f8fafc', border: '1px border-dashed #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                      Nenhuma candidatura a programas pendente. Explore os programas abertos no Hub!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {userInscricoes.map((i, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{i.programaTitulo || `Clube ABN — ${i.nivelAdesao?.toUpperCase() || 'Membro'}`}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Data de Envio: {new Date(i.createdAt).toLocaleDateString('pt-PT')}</div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', background: i.status === 'aprovado' ? '#dcfce7' : '#fef3c7', color: i.status === 'aprovado' ? '#15803d' : '#b45309' }}>
                            {i.status === 'aprovado' ? '🟢 Aprovado' : '⏳ Em Verificação'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 2: Cursos & Formação */}
              {clientTab === 'cursos' && (
                <div>
                  {userCursos.length === 0 ? (
                    <div style={{ background: '#f8fafc', border: '1px border-dashed #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                      Ainda não está matriculado em nenhum curso. Consulte a secção de Cursos &amp; Formação!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {userCursos.map((c, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{c.courseTitle || 'Curso ABN'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Matrícula: {new Date(c.createdAt).toLocaleDateString('pt-PT')} — Valor: {c.amount || 'Gratuito'}</div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', background: c.status === 'aprovado' ? '#dcfce7' : '#fef3c7', color: c.status === 'aprovado' ? '#15803d' : '#b45309' }}>
                            {c.status === 'aprovado' ? '🟢 Aprovado / Ativo' : '⏳ Em Análise'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 3: Serviços Solicitados */}
              {clientTab === 'servicos' && (
                <div>
                  {userServicos.length === 0 ? (
                    <div style={{ background: '#f8fafc', border: '1px border-dashed #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                      Nenhum serviço solicitado até ao momento. Explore a área de Serviços &amp; Mentoria!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {userServicos.map((s, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{s.service || 'Serviço ABN'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Solicitado em: {new Date(s.createdAt).toLocaleDateString('pt-PT')}</div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', background: s.status === 'concluido' ? '#dcfce7' : s.status === 'em_andamento' ? '#dbeafe' : '#fef3c7', color: s.status === 'concluido' ? '#15803d' : s.status === 'em_andamento' ? '#1e40af' : '#b45309' }}>
                            {s.status === 'concluido' ? '🟢 Concluído' : s.status === 'em_andamento' ? '🔵 Em Andamento' : '⏳ Pendente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Pipeline de Incubação (4 Fases Diretas) */}
          <div style={{ padding: '1.75rem 2rem', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
              <Target size={20} color="var(--primary, #ff6b00)" />
              Evolução do Negócio (Pipeline de Incubação)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { label: '1. Ideação', desc: 'Conceito da ideia e equipa inicial' },
                { label: '2. Validação', desc: 'Estudo de mercado e problema' },
                { label: '3. MVP', desc: 'Versão inicial do produto / serviço' },
                { label: '4. Tração & Escala', desc: 'Vendas e crescimento ativo' }
              ].map((step, idx) => {
                const phases = ['Ideação', 'Validação', 'Mínimo Produto Viável (MVP)', 'Tração & Escala'];
                const currentPhaseIndex = business ? phases.indexOf(business.incubationPhase || 'Ideação') : 0;
                let status = 'pending';
                if (idx < currentPhaseIndex) status = 'done';
                if (idx === currentPhaseIndex) status = 'current';

                return (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ 
                        width: '26px', 
                        height: '26px', 
                        borderRadius: '50%', 
                        background: status === 'done' ? '#16a34a' : status === 'current' ? '#ff6b00' : '#e2e8f0',
                        color: status === 'pending' ? '#64748b' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 800
                      }}>
                        {status === 'done' ? '✓' : idx + 1}
                      </div>
                      {status === 'current' && (
                        <span style={{ fontSize: '0.68rem', color: '#ff6b00', background: '#fff7ed', border: '1px solid #ffedd5', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                          Atual
                        </span>
                      )}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>
                      {step.label}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.35, fontWeight: 500 }}>
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL DE RECURSO RECOMENDADO
      ───────────────────────────────────────────────────────────── */}
      {activeResource && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '600px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                  {activeResource.title}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Recurso Exclusivo ABN Hub</span>
              </div>
              <button onClick={() => setActiveResource(null)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, color: '#475569' }}>
                ✕
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {activeResource.description}
            </p>

            {activeResource.type === 'video' ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', background: '#000000', marginBottom: '1.5rem' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title={activeResource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</div>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#0f172a' }}>Modelo Oficial ABN (PDF/DOC)</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Pronto para preenchimento do plano de negócios e documentação.</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setActiveResource(null)}
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert('A descarregar recurso da biblioteca ABN...');
                  setActiveResource(null);
                }}
                style={{ background: 'var(--primary, #ff6b00)', color: '#ffffff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={16} /> Descarregar Recurso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
