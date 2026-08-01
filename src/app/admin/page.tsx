'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { Users, GraduationCap, Award, DollarSign, Building2, Briefcase, Calendar, Newspaper, Layers, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  createdAt: string;
  type: string;
  badge: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    activeServices: 0,
    totalPrograms: 0,
    totalEvents: 0,
    totalNews: 0,
    totalEnrollments: 0,
    pendingCertificates: 0,
    revenue: '0 MT'
  });
  const [distribution, setDistribution] = useState({
    empreendedores: 0,
    startups: 0,
    investidores: 0
  });
  const [userGrowth, setUserGrowth] = useState<Array<{ month: string; count: number }>>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [showActivityCard, setShowActivityCard] = useState(true);
  const [userRole, setUserRole] = useState('admin');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role) setUserRole(u.role);
      } catch (e) {}
    }

    setLoading(true);
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.distribution) setDistribution(data.distribution);
        if (data.userGrowth) setUserGrowth(data.userGrowth);
        if (data.recentActivities) setRecentActivities(data.recentActivities);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isCollaborator = userRole === 'collaborator' || userRole === 'colaborador';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recente';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
             ' às ' + 
             d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const maxGrowthCount = Math.max(...userGrowth.map(g => g.count), 1);

  // Spinner component
  const Spinner = ({ color = '#ff6b00' }: { color?: string }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', height: '2.2rem', marginTop: '8px' }}>
      <span style={{ 
        width: '24px', 
        height: '24px', 
        border: `3px solid ${color}30`, 
        borderTop: `3px solid ${color}`, 
        borderRadius: '50%', 
        animation: 'spin 0.8s linear infinite' 
      }} />
    </div>
  );

  if (isCollaborator) {
    return (
      <div className={styles.dashboard} style={{ fontFamily: 'Inter, sans-serif' }}>
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
              👤 Colaborador ABN
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>
            Painel Operacional
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, fontWeight: 500 }}>
            Ferramentas diárias para gestão de tarefas, validação de candidaturas e suporte a empreendedores.
          </p>
        </header>

        {/* 3 Cartões Diretos e Úteis */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <Link href="/admin/atividades" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.6rem', borderRadius: '20px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#c2410c', background: '#fff7ed', border: '1px solid #ffedd5', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, textTransform: 'uppercase' }}>Foco Diário</span>
                <Clock size={22} color="#c2410c" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', margin: '0 0 4px 0' }}>
                Minhas Atividades &amp; Tarefas
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                Consultar tarefas atribuídas, prazos e atualizar estados de execução.
              </p>
            </div>
          </Link>

          <Link href="/admin/inscricoes" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.6rem', borderRadius: '20px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, textTransform: 'uppercase' }}>Validação</span>
                <ShieldCheck size={22} color="#1d4ed8" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', margin: '0 0 4px 0' }}>
                Inscrições &amp; Candidaturas
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                Verificar pedidos de adesão de novos membros e programas ativos.
              </p>
            </div>
          </Link>

          <Link href="/admin/mensagens" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.6rem', borderRadius: '20px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, textTransform: 'uppercase' }}>Atendimento</span>
                <Users size={22} color="#15803d" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', margin: '0 0 4px 0' }}>
                Mensagens &amp; Suporte
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                Responder a dúvidas e pedidos de contacto recebidos dos empreendedores.
              </p>
            </div>
          </Link>
        </div>

        {/* Bloco de Ações Rápidas Úteis */}
        <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', margin: '0 0 1rem 0' }}>
            ⚡ Ações Operacionais Rápidas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Link href="/admin/atividades" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 18px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
              ➕ Abrir Minhas Atividades
            </Link>
            <Link href="/admin/inscricoes" className="btn-outline" style={{ textDecoration: 'none', padding: '12px 18px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', borderColor: '#cbd5e1', color: '#0f172a' }}>
              📋 Verificar Candidaturas
            </Link>
            <Link href="/admin/mensagens" className="btn-outline" style={{ textDecoration: 'none', padding: '12px 18px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', borderColor: '#cbd5e1', color: '#0f172a' }}>
              ✉️ Responder a Mensagens
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard} style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Painel de Gestão Geral ABN
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          Resumo geral da plataforma, programas de aceleração, eventos, notícias, academia e receita acumulada.
        </p>
      </header>

      {/* CARD COMPACTO DE DESTAQUE: ÚLTIMA AÇÃO IMPORTANTE NA PLATAFORMA */}
      {!loading && recentActivities.length > 0 && showActivityCard && (() => {
        const top = recentActivities[0];
        let actionLink = '/admin/usuarios';
        let actionLabel = 'Ver Usuários 👤';
        
        if (top.type === 'certificate') {
          actionLink = '/admin/pagamentos?filter=certificados';
          actionLabel = 'Ver Certificados 📜';
        } else if (top.type === 'enrollment') {
          actionLink = '/admin/pagamentos';
          actionLabel = 'Ver Inscrições Cursos 💳';
        } else if (top.type === 'club_inscription') {
          actionLink = '/admin/clube/inscricoes';
          actionLabel = 'Ver Inscrições Clube 🏛️';
        }

        return (
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
            border: '1.5px solid #ffedd5',
            borderRadius: '16px',
            padding: '1.1rem 1.4rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 24px rgba(255, 107, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            position: 'relative',
            animation: 'fadeInDown 0.35s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
              <div style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)', 
                color: '#ffffff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.4rem',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.25)'
              }}>
                {top.icon || '🔔'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    background: '#16a34a', 
                    color: '#ffffff', 
                    fontSize: '0.68rem', 
                    fontWeight: 800, 
                    padding: '3px 10px', 
                    borderRadius: '20px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.06em' 
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                    ÚLTIMA AÇÃO RECENTE
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                    ⏱️ {formatDate(top.createdAt)}
                  </span>
                </div>
                
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.98rem', fontWeight: 800 }}>
                  {top.title}
                </h4>
                <p style={{ margin: '3px 0 0 0', color: '#475569', fontSize: '0.86rem', fontWeight: 500 }}>
                  {top.desc}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link 
                href={actionLink}
                style={{
                  background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(255, 107, 0, 0.22)',
                  transition: 'all 0.2s'
                }}
              >
                {actionLabel}
              </Link>
              <button
                type="button"
                onClick={() => setShowActivityCard(false)}
                title="Fechar destaque"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })()}

      {/* SECÇÃO 1: ECOSSISTEMA & MEMBROS (3 Cartões) */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🏢 Ecossistema & Comunidade ABN
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          <Link href="/admin/usuarios" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Usuários</span>
                <Users size={22} color="#475569" />
              </div>
              {loading ? <Spinner color="#475569" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.totalUsers}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Membros registados na plataforma</div>
            </div>
          </Link>

          <Link href="/admin/perfil" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Startups Incubadas</span>
                <Building2 size={22} color="#ff6b00" />
              </div>
              {loading ? <Spinner color="#ff6b00" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.totalStartups}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Empresas em aceleração ABN</div>
            </div>
          </Link>

          <Link href="/admin/servicos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Serviços Ativos</span>
                <Briefcase size={22} color="#2563eb" />
              </div>
              {loading ? <Spinner color="#2563eb" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.activeServices}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Serviços de aceleração ativos</div>
            </div>
          </Link>

        </div>
      </div>

      {/* SECÇÃO 2: PROGRAMAS, EVENTOS & NOTÍCIAS (3 Cartões) */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🚀 Programas, Eventos & Notícias
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          <Link href="/admin/programas" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#2a4fa6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Programas de Aceleração</span>
                <Layers size={22} color="#2a4fa6" />
              </div>
              {loading ? <Spinner color="#2a4fa6" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.totalPrograms}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Programas criados na plataforma</div>
            </div>
          </Link>

          <Link href="/admin/eventos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#9333ea', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eventos & Workshops</span>
                <Calendar size={22} color="#9333ea" />
              </div>
              {loading ? <Spinner color="#9333ea" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.totalEvents}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Eventos e meetups agendados</div>
            </div>
          </Link>

          <Link href="/admin/noticias" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notícias & Publicações</span>
                <Newspaper size={22} color="#0284c7" />
              </div>
              {loading ? <Spinner color="#0284c7" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.totalNews}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Artigos e comunicados publicados</div>
            </div>
          </Link>

        </div>
      </div>

      {/* SECÇÃO 3: ACADEMIA, CERTIFICADOS & FINANCEIRO (3 Cartões) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🎓 Academia, Certificados & Faturação
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          <Link href="/admin/pagamentos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inscrições em Cursos</span>
                <GraduationCap size={22} color="#ff6b00" />
              </div>
              {loading ? <Spinner color="#ff6b00" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.totalEnrollments}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Alunos inscritos nos cursos</div>
            </div>
          </Link>

          <Link href="/admin/pagamentos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: stats.pendingCertificates > 0 ? '1.5px solid #bfdbfe' : '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certificados por Aprovar</span>
                <Award size={22} color="#2563eb" />
              </div>
              {loading ? <Spinner color="#2563eb" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: stats.pendingCertificates > 0 ? '#2563eb' : '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.pendingCertificates}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: stats.pendingCertificates > 0 ? '#2563eb' : '#64748b', marginTop: '4px', fontWeight: 700 }}>
                {stats.pendingCertificates > 0 ? '⚠️ Pedidos pendentes de aprovação' : 'Todos os certificados aprovados'}
              </div>
            </div>
          </Link>

          <Link href="/admin/pagamentos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #bbf7d0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(22,163,74,0.04)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faturação Aprovada</span>
                <DollarSign size={22} color="#16a34a" />
              </div>
              {loading ? <Spinner color="#16a34a" /> : (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#16a34a', fontFamily: 'Outfit', marginTop: '8px' }}>
                  {stats.revenue}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>Receita total de cursos pagos</div>
            </div>
          </Link>

        </div>
      </div>

      {/* Real Dynamic Charts Section */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Crescimento de Usuários</h3>
          <div className={styles.barChart}>
            {loading ? (
              <div style={{ fontSize: '0.85rem', color: '#ff6b00', fontWeight: 700, textAlign: 'center', width: '100%', paddingTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Spinner color="#ff6b00" /> A carregar métricas...
              </div>
            ) : userGrowth.length > 0 ? (
              userGrowth.map((g, idx) => {
                const heightPct = Math.max(15, Math.round((g.count / maxGrowthCount) * 100));
                return (
                  <div key={idx} className={styles.bar} style={{ height: `${heightPct}%` }} title={`${g.count} novos membros em ${g.month}`}>
                    <span>{g.month}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center', width: '100%', paddingTop: '2rem' }}>
                Sem dados de registos.
              </div>
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Distribuição por Perfil</h3>
          <div className={styles.donutChartBox}>
            <div className={styles.donutChart}></div>
            <div className={styles.donutLegend}>
              <div className={styles.legendItem}><span style={{background: '#ff6b00'}}></span> Empreendedores ({loading ? '...' : distribution.empreendedores})</div>
              <div className={styles.legendItem}><span style={{background: '#2563eb'}}></span> Startups ({loading ? '...' : distribution.startups})</div>
              <div className={styles.legendItem}><span style={{background: '#16a34a'}}></span> Investidores ({loading ? '...' : distribution.investidores})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Dynamic Activity & Audit Log Section with Timestamps */}
      <div className={styles.recentActivity}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'Outfit', color: '#0f172a', fontWeight: 800, margin: 0 }}>
            Atividade Recente & Log de Auditoria
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Sistema Seguro & Ativo
          </span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b00', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Spinner color="#ff6b00" /> A carregar log de atividade em tempo real...
            </div>
          ) : recentActivities.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
              🟢 Sistema a operar com 100% de integridade. Nenhuma atividade recente registada.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {recentActivities.map(act => (
                <div 
                  key={act.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 16px', 
                    background: '#f8fafc', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    flexWrap: 'wrap', 
                    gap: '0.8rem' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{act.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{act.title}</div>
                      <div style={{ fontSize: '0.83rem', color: '#475569', marginTop: '2px' }}>{act.desc}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {/* Timestamp Badge */}
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, background: '#ffffff', padding: '4px 10px', borderRadius: '50px', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} color="#64748b" /> {formatDate(act.createdAt)}
                    </span>

                    {/* Status Badge */}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      borderRadius: '50px',
                      background: act.badge === 'aprovado' || act.badge === 'Aprovado' ? '#f0fdf4' : act.badge === 'Novo' ? '#eff6ff' : '#fefce8',
                      color: act.badge === 'aprovado' || act.badge === 'Aprovado' ? '#16a34a' : act.badge === 'Novo' ? '#2563eb' : '#ca8a04',
                      border: `1px solid ${act.badge === 'aprovado' || act.badge === 'Aprovado' ? '#bbf7d0' : act.badge === 'Novo' ? '#bfdbfe' : '#fef08a'}`
                    }}>
                      {act.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
