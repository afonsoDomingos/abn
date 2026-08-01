'use client';

import { useEffect, useState } from 'react';
import { Eye, Rocket, Users, Download, MessageCircle, TrendingUp, Target, Video, FileText, CheckCircle2, XCircle, BarChart3, Star, Clock, Calendar, CheckSquare, Award, ArrowUpRight, Play, ExternalLink } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const [userName, setUserName] = useState('Empreendedor');
  const [role, setRole] = useState('empreendedor');
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
  const [loadingInscricoes, setLoadingInscricoes] = useState(true);

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
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Get user details
      const userStr = localStorage.getItem('user');
      let hasProfileDesc = false;
      let userRole = 'empreendedor';
      let userEmail = '';

      if (userStr) {
        const u = JSON.parse(userStr);
        setUserName(u.name || 'Empreendedor');
        userRole = u.role || 'empreendedor';
        userEmail = u.email || '';
        setRole(userRole);
        const r = userRole.toLowerCase();
        if (r === 'admin' || r === 'collaborator' || r === 'colaborador') {
          window.location.href = '/admin';
          return;
        }
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

      // 3. Fetch analytics
      const analyticsRes = await fetch('/api/user/analytics');
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData);
      }

      // 4. Fetch user's inscriptions / memberships
      try {
        const inscRes = await fetch('/api/clube/inscricoes');
        const inscData = await inscRes.json();
        if (inscData.inscricoes && userEmail) {
          const myInsc = inscData.inscricoes.filter((i: any) => i.email?.toLowerCase() === userEmail.toLowerCase());
          setUserInscricoes(myInsc);
        }
      } catch {
        // fallback
      } finally {
        setLoadingInscricoes(false);
      }
    } catch (e) {
      console.error(e);
      setLoadingInscricoes(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* ─────────────────────────────────────────────────────────────
         1. INVESTOR DASHBOARD
      ───────────────────────────────────────────────────────────── */}
      {role === 'investidor' && (
        <>
          <div className={styles.welcome}>
            <h1>Olá, <span className="text-gradient-gold">{userName}</span> 👋</h1>
            <p>Bem-vindo ao seu painel de investimento. Acompanhe a evolução de startups incubadas no ABN Hub.</p>
          </div>

          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Portfólio de Análise</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  14<span style={{ fontSize: '1rem', color: '#64748b' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Startups em aceleração ativa elegíveis para investimento imediato.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={styles.progressCard}>
              <h3>Progresso de Credenciação</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Registo de Perfil de Investidor</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#16a34a" /> Setores de Preferência Indicados</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><XCircle size={18} color="#cbd5e1" /> Primeiro Compromisso de Financiamento</li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Ações Recomendadas</h2>
          </div>

          <div className={styles.tasks}>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={true} readOnly />
              <span>Explorar diretório de projetos abertos</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Avaliar novos relatórios financeiros submetidos</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Agendar reuniões com fundadores via WhatsApp/Email</span>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Recursos para Investidores</h2>
          </div>

          <div className={styles.resources}>
            <div className={styles.resourceCard} onClick={() => setActiveResource({ title: 'VC Trends em África', type: 'doc', description: 'Relatório semestral de investimentos em venture capital em África e CPLP.' })}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(255, 107, 0, 0.08)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <BarChart3 size={28} color="var(--primary, #ff6b00)" />
              </div>
              <h4>VC Trends em África</h4>
              <p style={{ fontSize: '0.85rem' }}>Relatório Semestral - PDF</p>
            </div>
            <div className={styles.resourceCard} onClick={() => setActiveResource({ title: 'Guia de Co-Investimento', type: 'doc', description: 'Manual de melhores práticas de co-investimento e compliance para investidores anjo.' })}>
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
         2. MENTOR DASHBOARD
      ───────────────────────────────────────────────────────────── */}
      {role === 'mentor' && (
        <>
          <div className={styles.welcome}>
            <h1>Olá, <span className="text-gradient-gold">{userName}</span> 👋</h1>
            <p>Bem-vindo ao seu painel de mentoria. Acompanhe o progresso de startups e guie os fundadores do ecossistema.</p>
          </div>

          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>Atividade de Mentoria</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  6<span style={{ fontSize: '1rem', color: '#64748b' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    Acompanhando ativamente ideias inovadoras no ecossistema ABN.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={styles.progressCard}>
              <h3>Métricas do Mentor</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="var(--primary, #ff6b00)" /> Avaliação Média: <strong>{analytics?.stats?.averageRating ? analytics.stats.averageRating.toFixed(1) : '4.9'} / 5.0</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="var(--primary, #ff6b00)" /> Horas Doadas: <strong>{analytics?.stats?.mentorshipHours || 12} Horas</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="var(--primary, #ff6b00)" /> Próxima Sessão: <strong>Sexta-feira, 15:00</strong></li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Tarefas &amp; Avaliações</h2>
          </div>

          <div className={styles.tasks}>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Avaliar a descrição de negócios e pitch de novos fundadores</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Agendar sessões semanais de acompanhamento via WhatsApp/Meet</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={true} readOnly />
              <span>Participar no webinar de boas-vindas do ABN Hub</span>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Recursos para Mentores</h2>
          </div>

          <div className={styles.resources}>
            <div className={styles.resourceCard} onClick={() => setActiveResource({ title: 'Manual do Mentor ABN', type: 'doc', description: 'Metodologias de facilitação, perguntas chave e acompanhamento de empreendedores.' })}>
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
         3. DEFAULT ENTREPRENEUR / STARTUP DASHBOARD
      ───────────────────────────────────────────────────────────── */}
      {role !== 'investidor' && role !== 'mentor' && (
        <>
          {/* Header & Status Card */}
          <div className={styles.welcome} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.4rem 0', fontSize: '1.9rem', fontWeight: 800 }}>
                Olá, <span className="text-gradient-gold">{userName}</span> 👋
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                Bem-vindo ao seu painel de crescimento empresarial. Acompanhe a evolução e o progresso da sua startup.
              </p>
            </div>

            {/* Active Membership Banner Card */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderRadius: '16px', padding: '1.1rem 1.4rem', boxShadow: '0 10px 25px rgba(15,23,42,0.15)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,107,0,0.3)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,107,0,0.15)', color: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                🏛️
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ff6b00', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plano / Adesão Ativa</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>🟢 Ativo</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', marginTop: '0.15rem' }}>
                  {userInscricoes && userInscricoes.length > 0
                    ? `Clube ABN — ${userInscricoes[0].nivelAdesao?.toUpperCase() || 'Membro Oficial'}`
                    : 'Clube dos Empreendedores ABN'}
                </div>
              </div>
            </div>
          </div>

          {/* 1. Progress Grid: ABN Score & Checklist */}
          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <h3>ABN Score</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', fontFamily: 'Outfit' }}>
                  {score}<span style={{ fontSize: '1rem', color: '#64748b' }}>/100</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${score}%` }}></div>
                  </div>
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    {score < 50 ? 'Fase Inicial de Configuração' : score < 100 ? 'Projeto Estruturado' : 'Pronto para Investimento! 🚀'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={styles.progressCard}>
              <h3>Progresso do Perfil</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{checklist.profile ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#cbd5e1" />} Registo de Perfil Completo</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{checklist.business ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#cbd5e1" />} Startup Registada no Hub</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{checklist.pitchDeck ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#cbd5e1" />} Modelo de Negócio Descrito</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{checklist.website ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#cbd5e1" />} Website / Portfólio Indicado</li>
              </ul>
            </div>
          </div>

          {/* 2. Business Evolution Pipeline Grid */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ padding: '1.75rem 2rem', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
              <h3 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '1.5rem', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Target size={20} color="var(--primary, #ff6b00)" />
                Evolução do Negócio (Pipeline de Incubação)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {[
                  { label: '1. Ideação', desc: 'Conceito da ideia e definição da equipa inicial' },
                  { label: '2. Validação', desc: 'Entrevistas de problemas e estudo de mercado' },
                  { label: '3. Mínimo Produto Viável (MVP)', desc: 'Versão de testes da plataforma / serviço' },
                  { label: '4. Tração & Escala', desc: 'Vendas recorrentes e expansão territorial' }
                ].map((step, idx) => {
                  const phases = ['Ideação', 'Validação', 'Mínimo Produto Viável (MVP)', 'Tração & Escala'];
                  const currentPhaseIndex = business ? phases.indexOf(business.incubationPhase || 'Ideação') : 0;
                  let status = 'pending';
                  if (idx < currentPhaseIndex) status = 'done';
                  if (idx === currentPhaseIndex) status = 'current';

                  return (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          background: status === 'done' ? '#16a34a' : status === 'current' ? '#ff6b00' : '#e2e8f0',
                          color: status === 'pending' ? '#64748b' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 800
                        }}>
                          {status === 'done' ? '✓' : idx + 1}
                        </div>
                        {status === 'current' && (
                          <span style={{ fontSize: '0.7rem', color: '#ff6b00', background: '#fff7ed', border: '1px solid #ffedd5', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                            Etapa Atual
                          </span>
                        )}
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0f172a', fontWeight: 800 }}>
                        {step.label}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, fontWeight: 500 }}>
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Mentoria & Candidaturas Submetidas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Mentoria Card */}
            <div style={{ padding: '1.75rem 2rem', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#0f172a', fontSize: '1.1rem', margin: 0, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                  🤝 Mentoria &amp; Acompanhamento
                </h3>
                <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>ABN Hub</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.2rem 0' }}>
                Conecte-se com mentores especialistas do ecossistema ABN para acelerar o modelo de negócio da sua startup.
              </p>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ff6b00', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                  LS
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Leonel Sapite</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Especialista em Desenvolvimento &amp; Mentoria</div>
                </div>
                <a href="/dashboard/networking" style={{ background: '#ff6b00', color: '#ffffff', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                  Solicitar
                </a>
              </div>
            </div>

            {/* Minhas Candidaturas */}
            <div style={{ padding: '1.75rem 2rem', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#0f172a', fontSize: '1.1rem', margin: 0, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                  📋 Minhas Candidaturas
                </h3>
                <span style={{ fontSize: '0.75rem', background: '#f0fdf4', color: '#16a34a', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>{userInscricoes.length} Registadas</span>
              </div>

              {loadingInscricoes ? (
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1rem 0' }}>A carregar candidaturas...</div>
              ) : userInscricoes.length === 0 ? (
                <div style={{ background: '#f8fafc', border: '1px border-dashed #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                  Nenhuma candidatura enviada até ao momento. Explore as oportunidades e programas abertos!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {userInscricoes.map((i, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{i.programaTitulo || `Clube ABN — ${i.nivelAdesao}`}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Data: {new Date(i.createdAt).toLocaleDateString('pt-PT')}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', background: i.status === 'aprovado' ? '#dcfce7' : '#fef3c7', color: i.status === 'aprovado' ? '#15803d' : '#b45309' }}>
                        {i.status === 'aprovado' ? '🟢 Aprovado' : '⏳ Em Verificação'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5. Próximos Passos */}
          <div className={styles.sectionTitle}>
            <h2>Próximos Passos Recomendados</h2>
          </div>

          <div className={styles.tasks} style={{ marginBottom: '2.5rem' }}>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={checklist.business} readOnly />
              <span>Definição e Validação do Modelo de Negócio</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={checklist.pitchDeck} readOnly />
              <span>Escrever Descrição Detalhada &amp; Anexar Pitch Deck</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={checklist.website} readOnly />
              <span>Lançamento do Website / Link de Referência do Produto</span>
            </div>
          </div>

          {/* 6. Recursos & Ferramentas (Interativos) */}
          <div className={styles.sectionTitle}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Recursos &amp; Ferramentas para Download</h2>
          </div>

          <div className={styles.resources}>
            <div
              className={styles.resourceCard}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setActiveResource({
                title: 'Como Atrair Investidores',
                type: 'video',
                description: 'Workshop completo em vídeo de 45 minutos com estratégias de pitch e captação de investimento em África.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
              })}
            >
              <div className={styles.resourceIcon} style={{ background: 'rgba(255, 107, 0, 0.08)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Video size={28} color="var(--primary, #ff6b00)" />
              </div>
              <h4>Como Atrair Investidores</h4>
              <p style={{ fontSize: '0.85rem' }}>🎬 Assistir Workshop em vídeo (45 min)</p>
            </div>

            <div
              className={styles.resourceCard}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setActiveResource({
                title: 'Template de Business Plan ABN',
                type: 'doc',
                description: 'Modelo profissional estruturado para elaboração do plano de negócios e projeções financeiras da startup.',
                downloadUrl: '/docs/ABN_Business_Plan_Template.pdf'
              })}
            >
              <div className={styles.resourceIcon} style={{ background: 'rgba(255, 107, 0, 0.08)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={28} color="var(--primary, #ff6b00)" />
              </div>
              <h4>Template de Business Plan</h4>
              <p style={{ fontSize: '0.85rem' }}>📄 Descarregar Documento Estruturado</p>
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
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Pronto para preenchimento do plano de negócios da sua startup.</p>
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

