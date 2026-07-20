'use client';

import { useEffect, useState } from 'react';
import { Eye, Rocket, Users, Download, MessageCircle, TrendingUp, Target, Video, FileText, CheckCircle2, XCircle, BarChart3, Star, Clock, Calendar, CheckSquare } from 'lucide-react';
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Get user name and details
      const userStr = localStorage.getItem('user');
      let hasProfileDesc = false;
      let userRole = 'empreendedor';
      if (userStr) {
        const u = JSON.parse(userStr);
        setUserName(u.name || 'Empreendedor');
        userRole = u.role || 'empreendedor';
        setRole(userRole);
        if (userRole === 'admin') {
          window.location.href = '/admin';
          return;
        }
        hasProfileDesc = !!u.description || !!u.email;
      }

      // 2. Fetch business
      const res = await fetch('/api/user/business');
      const data = await res.json();
      
      let hasBiz = false;
      let hasWeb = false;
      let hasDeck = false;

      if (data.success && data.business) {
        setBusiness(data.business);
        hasBiz = true;
        hasWeb = !!data.business.website;
        // Pitch deck is simulated by business details descriptions length
        hasDeck = data.business.description && data.business.description.length >= 30;
      }

      // Calculate score
      let calculatedScore = 0;
      const checks = {
        profile: hasProfileDesc,
        business: hasBiz,
        pitchDeck: !!hasDeck,
        website: hasWeb
      };

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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* 1. INVESTOR DASHBOARD */}
      {role === 'investidor' && (
        <>
          <div className={styles.welcome}>
            <h1>Olá, <span className="text-gradient-gold">{userName}</span>!</h1>
            <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Bem-vindo ao seu painel de investimento. Acompanhe a evolução de startups incubadas no ABN Hub.</p>
          </div>

          <div className={styles.progressGrid}>
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#ffffff' }}>Portfólio de Análise</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                  14<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    Startups em aceleração ativa elegíveis para investimento imediato.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#ffffff' }}>Progresso de Credenciação</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#2ecc71" /> Registo de Perfil de Investidor</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="#2ecc71" /> Setores de Preferência Indicados</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><XCircle size={18} color="rgba(255,255,255,0.2)" /> Primeiro Compromisso de Financiamento</li>
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
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(212, 175, 55, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <BarChart3 size={32} color="var(--primary)" />
              </div>
              <h4>VC Trends em África</h4>
              <p style={{ fontSize: '0.85rem' }}>Relatório Semestral - PDF</p>
            </div>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(212, 175, 55, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Users size={32} color="var(--primary)" />
              </div>
              <h4>Guia de Co-Investimento</h4>
              <p style={{ fontSize: '0.85rem' }}>Boas Práticas & Compliance</p>
            </div>
          </div>
        </>
      )}

      {/* 2. MENTOR DASHBOARD */}
      {role === 'mentor' && (
        <>
          <div className={styles.welcome}>
            <h1>Olá, <span className="text-gradient-gold">{userName}</span>!</h1>
            <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Bem-vindo ao seu painel de mentoria. Acompanhe o progresso de startups e guie os fundadores do ecossistema.</p>
          </div>

          <div className={styles.progressGrid}>
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#ffffff' }}>Atividade de Mentoria</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                  6<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    Acompanhando ativamente ideias inovadoras de Guiné-Bissau e CPLP.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#ffffff' }}>Métricas do Mentor</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="var(--primary)" /> Avaliação Média: <strong>{analytics?.stats?.averageRating ? analytics.stats.averageRating.toFixed(1) : '4.9'} / 5.0</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="var(--primary)" /> Horas Doadas: <strong>{analytics?.stats?.mentorshipHours || 0} Horas</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="var(--primary)" /> Próxima Sessão: <strong>{analytics?.stats?.nextSession ? new Date(analytics.stats.nextSession).toLocaleDateString() : 'A Agendar'}</strong></li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Tarefas & Avaliações</h2>
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
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(212, 175, 55, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={32} color="var(--primary)" />
              </div>
              <h4>Manual do Mentor ABN</h4>
              <p style={{ fontSize: '0.85rem' }}>Metodologias & Práticas - PDF</p>
            </div>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(212, 175, 55, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Rocket size={32} color="var(--primary)" />
              </div>
              <h4>Lean Startup Guia</h4>
              <p style={{ fontSize: '0.85rem' }}>Ferramenta de Validação de Ideias</p>
            </div>
          </div>
        </>
      )}

      {/* 3. DEFAULT ENTREPRENEUR / STARTUP DASHBOARD */}
      {role !== 'investidor' && role !== 'mentor' && (
        <>
          <div className={styles.welcome}>
            <h1>Olá, <span className="text-gradient-gold">{userName}</span>!</h1>
            <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Bem-vindo ao seu painel de crescimento. Aqui está o progresso do seu projeto.</p>
          </div>

          <div className={styles.progressGrid}>
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#ffffff' }}>ABN Score</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                  {score}<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>/100</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${score}%` }}></div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    {score < 50 ? 'Fase Inicial de Configuração' : score < 100 ? 'Projeto Estruturado' : 'Pronto para Investimento! 🚀'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#ffffff' }}>Progresso do Perfil</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{checklist.profile ? <CheckCircle2 size={18} color="#2ecc71" /> : <XCircle size={18} color="rgba(255,255,255,0.2)" />} Registo de Perfil Completo</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{checklist.business ? <CheckCircle2 size={18} color="#2ecc71" /> : <XCircle size={18} color="rgba(255,255,255,0.2)" />} Startup Registada</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{checklist.pitchDeck ? <CheckCircle2 size={18} color="#2ecc71" /> : <XCircle size={18} color="rgba(255,255,255,0.2)" />} Modelo de Negócio Descrito</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{checklist.website ? <CheckCircle2 size={18} color="#2ecc71" /> : <XCircle size={18} color="rgba(255,255,255,0.2)" />} Website Indicado</li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={24} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Analytics & Desempenho</h2>
          </div>

          {/* Analytics Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '12px' }}>
                  <Eye size={20} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700, background: 'rgba(46, 204, 113, 0.1)', padding: '4px 8px', borderRadius: '20px' }}>+12%</span>
              </div>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Visitas ao Perfil</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>{analytics?.stats?.profileViews || 0}</div>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '12px' }}>
                  <Rocket size={20} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700, background: 'rgba(46, 204, 113, 0.1)', padding: '4px 8px', borderRadius: '20px' }}>+8%</span>
              </div>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Visitas ao Projeto</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>{analytics?.stats?.projectViews || 0}</div>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '12px' }}>
                  <Users size={20} color="var(--primary)" />
                </div>
              </div>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Interessados</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>{analytics?.stats?.interestedCount || 0}</div>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '12px' }}>
                  <Download size={20} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700, background: 'rgba(46, 204, 113, 0.1)', padding: '4px 8px', borderRadius: '20px' }}>14% tx</span>
              </div>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Downloads do Pitch</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>{analytics?.stats?.pitchDownloads || 0}</div>
            </div>
            
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '12px' }}>
                  <MessageCircle size={20} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700, background: 'rgba(46, 204, 113, 0.1)', padding: '4px 8px', borderRadius: '20px' }}>Novas</span>
              </div>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Mensagens</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>{analytics?.stats?.messagesCount || 0}</div>
            </div>
          </div>

          {/* Growth & Evolution Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* 1. Crescimento Mensal (Bar Chart) */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.5rem', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} color="var(--primary)" />
                Crescimento Mensal (Visualizações)
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', padding: '0 10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {(analytics?.monthlyGrowth || [
                  { month: 'Jan', height: '30%', views: '0' },
                  { month: 'Fev', height: '45%', views: '0' },
                  { month: 'Mar', height: '60%', views: '0' },
                  { month: 'Abr', height: '75%', views: '0' },
                  { month: 'Mai', height: '95%', views: '0' }
                ]).map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{item.views}</div>
                    <div style={{ width: '24px', height: item.height || '5%', background: 'linear-gradient(to top, var(--secondary) 0%, var(--primary) 100%)', borderRadius: '6px 6px 0 0' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Evolução do Negócio (Pipeline) */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.5rem', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="var(--primary)" />
                Evolução do Negócio
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  { label: 'Ideação', desc: 'Conceito da ideia e equipa inicial' },
                  { label: 'Validação', desc: 'Entrevistas de problemas e estudo de mercado' },
                  { label: 'Mínimo Produto Viável (MVP)', desc: 'Versão de testes da plataforma / serviço' },
                  { label: 'Tração & Escala', desc: 'Vendas recorrentes e expansão territorial' }
                ].map((step, idx) => {
                  const phases = ['Ideação', 'Validação', 'Mínimo Produto Viável (MVP)', 'Tração & Escala'];
                  const currentPhaseIndex = business ? phases.indexOf(business.incubationPhase || 'Ideação') : 0;
                  let status = 'pending';
                  if (idx < currentPhaseIndex) status = 'done';
                  if (idx === currentPhaseIndex) status = 'current';

                  return (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: status === 'done' ? '#2ecc71' : status === 'current' ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                      color: status === 'pending' ? 'rgba(255,255,255,0.4)' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {status === 'done' ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>
                        {step.label} {status === 'current' && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(255,107,0,0.1)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>Atual</span>}
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>{step.desc}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Próximos Passos</h2>
          </div>

          <div className={styles.tasks}>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={checklist.business} readOnly />
              <span>Definição do Modelo de Negócio</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={checklist.pitchDeck} readOnly />
              <span>Escrever Descrição Detalhada da Startup</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={checklist.website} readOnly />
              <span>Lançamento do Website / Link de Referência</span>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Recursos Recomendados</h2>
          </div>

          <div className={styles.resources}>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(212, 175, 55, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Video size={32} color="var(--primary)" />
              </div>
              <h4>Como Atrair Investidores</h4>
              <p style={{ fontSize: '0.85rem' }}>Workshop em vídeo - 45 min</p>
            </div>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon} style={{ background: 'rgba(212, 175, 55, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={32} color="var(--primary)" />
              </div>
              <h4>Template de Business Plan</h4>
              <p style={{ fontSize: '0.85rem' }}>Documento Estruturado</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
