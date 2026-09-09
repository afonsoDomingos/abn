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
  Sparkles
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

    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInscricoes(false);
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
          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Portfólio de Análise & Deals</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  18<span style={{ fontSize: '1rem', color: '#64748b' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Startups em aceleração ativa no ABN Hub elegíveis para investimento imediato e co-financiamento.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={styles.progressCard}>
              <h3>Critérios de Credenciação</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Registo de Perfil de Investidor Concluído</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Setores e Teses de Investimento Ativos</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Acesso Liberado a Pitch Decks & Data Rooms</li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Ações Rápidas de Investimento</h2>
          </div>

          <div className={styles.tasks}>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={true} readOnly />
              <span>Explorar diretório de startups em rodada de financiamento</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Agendar reunião de Due Diligence com founders via ABN Hub</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Submeter Term Sheet ou manifestação de interesse preliminar</span>
            </div>
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
          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Atividade de Mentoria</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  8<span style={{ fontSize: '1rem', color: '#64748b' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Startups sob a sua mentoria estratégica nos setores de inovação e negócios.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={styles.progressCard}>
              <h3>Métricas do Mentor</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="var(--primary, #ff6b00)" /> Avaliação Média: <strong>4.9 / 5.0</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="var(--primary, #ff6b00)" /> Horas Doadas: <strong>16 Horas</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="var(--primary, #ff6b00)" /> Próxima Sessão: <strong>Terça-feira, 14:00</strong></li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Tarefas de Acompanhamento</h2>
          </div>

          <div className={styles.tasks}>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={true} readOnly />
              <span>Avaliar a descrição de negócios e pitch de novos fundadores</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Validar o plano de tração do primeiro trimestre das startups atribuídas</span>
            </div>
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
          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Consultorias &amp; Assessoria Técnica</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  5<span style={{ fontSize: '1rem', color: '#64748b' }}> projetos</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Demandas de especialidade técnica e diagnósticos ativos solicitados por empresas no Hub.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.progressCard}>
              <h3>Perfil de Especialista</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Credencial de Consultor ABN Ativa</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Catálogo de Serviços Disponível no Marketplace</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="var(--primary, #ff6b00)" /> Índice de Satisfação: <strong>98%</strong></li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Demandas de Especialistas Recentes</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', background: '#fff7ed', color: '#ea580c', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>Finanças &amp; Fiscalidade</span>
              <h4 style={{ margin: '8px 0 4px 0', fontSize: '1rem', color: '#0f172a' }}>Estruturação Fiscal para PMEs</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Solicitação para apoio em enquadramento societário e compliance bancário.</p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', background: '#f0fdf4', color: '#16a34a', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>Tecnologia &amp; Produto</span>
              <h4 style={{ margin: '8px 0 4px 0', fontSize: '1rem', color: '#0f172a' }}>Auditoria de Segurança &amp; Cloud</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Análise de infraestrutura cloud e arquitetura de microsserviços.</p>
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         4. EMPRESA / PME & PARCEIRO VIEW
      ───────────────────────────────────────────────────────────── */}
      {(activeRole === 'empresa' || activeRole === 'parceiro') && (
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
         6. DEFAULT / EMPREENDEDOR / STARTUP DASHBOARD
      ───────────────────────────────────────────────────────────── */}
      {(activeRole === 'empreendedor' || activeRole === 'startup') && (
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
