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

      {/* 2. MENTOR DASHBOARD */}
      {role === 'mentor' && (
        <>
          <div className={styles.welcome}>
            <h1>Olá, Mentor <span className="text-gradient-gold">{userName}</span>!</h1>
            <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Bem-vindo ao seu painel de mentoria. Guie e acelere a próxima geração de startups em África.</p>
          </div>

          <div className={styles.progressGrid}>
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#1c1917' }}>Sessões de Aceleração</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                  4<span style={{ fontSize: '1rem', color: '#666' }}> startups</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>
                    Projetos sob orientação direta no ABN Hub.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${styles.progressCard} glass`}>
              <h3 style={{ color: '#1c1917' }}>Requisitos de Mentor</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>
                <li>✅ Registo de Mentor verificado pela ABN</li>
                <li>✅ Disponibilidade de Horário de Mentoria</li>
                <li>❌ Especialização e Skills especificadas</li>
              </ul>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Próximos Compromissos</h2>
          </div>

          <div className={styles.tasks}>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={true} readOnly />
              <span>Configurar horários semanais disponíveis</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Avaliar pitch decks de novas startups mentoradas</span>
            </div>
            <div className={styles.taskItem}>
              <input type="checkbox" checked={false} readOnly />
              <span>Agendar sessões 1-on-1 de planeamento estratégico</span>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <h2>Recursos para Mentores</h2>
          </div>

          <div className={styles.resources}>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon}>📚</div>
              <h4>Metodologias de Aceleração</h4>
              <p>Manual ABN para Mentores - 2026</p>
            </div>
            <div className={`${styles.resourceCard} glass`}>
              <div className={styles.resourceIcon}>📐</div>
              <h4>Framework de Planeamento</h4>
              <p>Template OKRs para Mentoria</p>
            </div>
          </div>
        </>
      )}

      {/* 3. DEFAULT ENTERPRENEUR / STARTUP DASHBOARD */}
      {role !== 'investidor' && role !== 'mentor' && (
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
