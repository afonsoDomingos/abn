'use client';

import { useEffect, useState } from 'react';
import { Rocket, Users, Target, CheckCircle2, XCircle, BarChart3, Star, Clock, Calendar, FileText, Download } from 'lucide-react';
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
         3. DEFAULT ENTREPRENEUR / STARTUP DASHBOARD (ULTRA CLEAN)
      ───────────────────────────────────────────────────────────── */}
      {role !== 'investidor' && role !== 'mentor' && (
        <>
          {/* Header & Status Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.3rem 0', fontSize: '2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                Olá, <span className="text-gradient-gold">{userName}</span> 👋
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
                Acompanhe o desenvolvimento e os serviços ativos da sua startup no ABN Hub.
              </p>
            </div>

            {/* Active Membership Banner Card */}
            <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '20px', padding: '1.2rem 1.6rem', boxShadow: '0 10px 25px rgba(15,23,42,0.12)', display: 'flex', alignItems: 'center', gap: '1.2rem', border: '1px solid rgba(255,107,0,0.25)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(255,107,0,0.15)', color: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                🏛️
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ff6b00', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Membro Registado</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>🟢 Ativo</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
                  {userInscricoes && userInscricoes.length > 0
                    ? `Clube ABN — ${userInscricoes[0].nivelAdesao?.toUpperCase() || 'Membro Oficial'}`
                    : 'Clube dos Empreendedores ABN'}
                </div>
              </div>
            </div>
          </div>

          {/* 1. Minhas Candidaturas em Destaque */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ padding: '1.75rem', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#0f172a', fontSize: '1.05rem', margin: 0, fontFamily: 'Outfit', fontWeight: 800 }}>
                  📋 Minhas Candidaturas &amp; Inscrições
                </h3>
                <span style={{ fontSize: '0.75rem', background: '#f0fdf4', color: '#16a34a', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>
                  {userInscricoes.length} Registadas
                </span>
              </div>

              {loadingInscricoes ? (
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>A carregar candidaturas...</div>
              ) : userInscricoes.length === 0 ? (
                <div style={{ background: '#f8fafc', border: '1px border-dashed #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                  Nenhuma candidatura pendente. Explore os programas e oportunidades abertos na plataforma!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {userInscricoes.map((i, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{i.programaTitulo || `Clube ABN — ${i.nivelAdesao?.toUpperCase() || 'Membro'}`}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Data: {new Date(i.createdAt).toLocaleDateString('pt-PT')}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', background: i.status === 'aprovado' ? '#dcfce7' : '#fef3c7', color: i.status === 'aprovado' ? '#15803d' : '#b45309' }}>
                        {i.status === 'aprovado' ? '🟢 Aprovado' : '⏳ Em Verificação'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. Pipeline de Incubação (4 Fases Diretas) */}
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

