'use client';

import { useEffect, useState } from 'react';
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
              <h3 style={{ color: '#1c1917' }}>Portfólio de Análise</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                  14<span style={{ fontSize: '1rem', color: '#666' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>
                    Startups em aceleração ativa elegíveis para investimento imediato.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#1c1917' }}>Progresso de Credenciação</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>
                <li>✅ Registo de Perfil de Investidor</li>
                <li>✅ Setores de Preferência Indicados</li>
                <li>❌ Primeiro Compromisso de Financiamento</li>
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
              <div className={styles.resourceIcon}>📊</div>
              <h4>VC Trends em África</h4>
              <p>Relatório Semestral - PDF</p>
            </div>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon}>🤝</div>
              <h4>Guia de Co-Investimento</h4>
              <p>Boas Práticas & Compliance</p>
            </div>
          </div>
        </>
      )}

      {/* 2. DEFAULT ENTERPRENEUR / STARTUP DASHBOARD */}
      {role !== 'investidor' && (
        <>
          <div className={styles.welcome}>
            <h1>Olá, <span className="text-gradient-gold">{userName}</span>!</h1>
            <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Bem-vindo ao seu painel de crescimento. Aqui está o progresso do seu projeto.</p>
          </div>

          <div className={styles.progressGrid}>
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#1c1917' }}>ABN Score</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                  {score}<span style={{ fontSize: '1rem', color: '#666' }}>/100</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${score}%` }}></div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>
                    {score < 50 ? 'Fase Inicial de Configuração' : score < 100 ? 'Projeto Estruturado' : 'Pronto para Investimento! 🚀'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#1c1917' }}>Progresso do Perfil</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>
                <li>{checklist.profile ? '✅' : '❌'} Registo de Perfil Completo</li>
                <li>{checklist.business ? '✅' : '❌'} Startup Registada</li>
                <li>{checklist.pitchDeck ? '✅' : '❌'} Modelo de Negócio Descrito</li>
                <li>{checklist.website ? '✅' : '❌'} Website Indicado</li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>📊 Analytics & Desempenho</h2>
          </div>

          {/* Analytics Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '2rem' }}>👁️</span>
              <h4 style={{ margin: '8px 0 2px 0', fontSize: '0.9rem', color: '#555' }}>Visitas ao Perfil</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>148</div>
              <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700 }}>+12% este mês</span>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '2rem' }}>🚀</span>
              <h4 style={{ margin: '8px 0 2px 0', fontSize: '0.9rem', color: '#555' }}>Visualizações do Projeto</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>320</div>
              <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700 }}>+8% esta semana</span>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '2rem' }}>🤝</span>
              <h4 style={{ margin: '8px 0 2px 0', fontSize: '0.9rem', color: '#555' }}>Interessados</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>12</div>
              <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700 }}>Mentores/Investidores</span>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '2rem' }}>📥</span>
              <h4 style={{ margin: '8px 0 2px 0', fontSize: '0.9rem', color: '#555' }}>Downloads do Pitch</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>45</div>
              <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700 }}>Taxa conv: 14%</span>
            </div>
            
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '2rem' }}>💬</span>
              <h4 style={{ margin: '8px 0 2px 0', fontSize: '0.9rem', color: '#555' }}>Mensagens</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>4</div>
              <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700 }}>Novas respostas</span>
            </div>
          </div>

          {/* Growth & Evolution Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* 1. Crescimento Mensal (Bar Chart) */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#1c1917', fontSize: '1.1rem', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>📈 Crescimento Mensal (Visualizações)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', padding: '0 10px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                {[
                  { m: 'Jan', h: '30%', v: '90' },
                  { m: 'Fev', h: '45%', v: '140' },
                  { m: 'Mar', h: '60%', v: '190' },
                  { m: 'Abr', h: '75%', v: '240' },
                  { m: 'Mai', h: '95%', v: '320' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{item.v}</div>
                    <div style={{ width: '24px', height: item.h, background: 'linear-gradient(to top, var(--secondary) 0%, var(--primary) 100%)', borderRadius: '6px 6px 0 0' }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>{item.m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Evolução do Negócio (Pipeline) */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#1c1917', fontSize: '1.1rem', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>🏆 Evolução do Negócio</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  { label: 'Ideação', status: 'done', desc: 'Conceito da ideia e equipa inicial' },
                  { label: 'Validação', status: 'done', desc: 'Entrevistas de problemas e estudo de mercado' },
                  { label: 'Mínimo Produto Viável (MVP)', status: 'current', desc: 'Versão de testes da plataforma / serviço' },
                  { label: 'Tração & Escala', status: 'pending', desc: 'Vendas recorrentes e expansão territorial' }
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: step.status === 'done' ? '#2ecc71' : step.status === 'current' ? 'var(--primary)' : 'rgba(0,0,0,0.08)',
                      color: step.status === 'pending' ? '#888' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {step.status === 'done' ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1c1917', fontWeight: 700 }}>
                        {step.label} {step.status === 'current' && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(255,107,0,0.1)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>Atual</span>}
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#666', lineHeight: 1.3 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
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
            <h2>Recursos Recomendados</h2>
          </div>

          <div className={styles.resources}>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon}>🎬</div>
              <h4>Como Atrair Investidores</h4>
              <p>Workshop em vídeo - 45 min</p>
            </div>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon}>📄</div>
              <h4>Template de Business Plan</h4>
              <p>Documento Estruturado</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
