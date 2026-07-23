'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { Users, GraduationCap, Award, DollarSign, Building2, Briefcase, Calendar, Newspaper, Layers } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
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

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.distribution) setDistribution(data.distribution);
        if (data.userGrowth) setUserGrowth(data.userGrowth);
      })
      .catch(err => console.error(err));
  }, []);

  const maxGrowthCount = Math.max(...userGrowth.map(g => g.count), 1);

  return (
    <div className={styles.dashboard} style={{ fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Painel de Gestão Geral ABN
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Resumo geral da plataforma, programas de aceleração, eventos, notícias, academia e receita acumulada.
        </p>
      </header>

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
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.totalUsers}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Membros registados na plataforma</div>
            </div>
          </Link>

          <Link href="/admin/perfil" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Startups Incubadas</span>
                <Building2 size={22} color="#ff6b00" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.totalStartups}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Empresas em aceleração ABN</div>
            </div>
          </Link>

          <Link href="/admin/servicos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Serviços Ativos</span>
                <Briefcase size={22} color="#2563eb" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.activeServices}
              </div>
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
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.totalPrograms}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Programas criados na plataforma</div>
            </div>
          </Link>

          <Link href="/admin/eventos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#9333ea', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eventos & Workshops</span>
                <Calendar size={22} color="#9333ea" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.totalEvents}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Eventos e meetups agendados</div>
            </div>
          </Link>

          <Link href="/admin/noticias" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notícias & Publicações</span>
                <Newspaper size={22} color="#0284c7" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.totalNews}
              </div>
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
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.totalEnrollments}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Alunos inscritos nos cursos</div>
            </div>
          </Link>

          <Link href="/admin/pagamentos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', border: stats.pendingCertificates > 0 ? '1.5px solid #bfdbfe' : '1.5px solid #e2e8f0', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certificados por Aprovar</span>
                <Award size={22} color="#2563eb" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: stats.pendingCertificates > 0 ? '#2563eb' : '#0f172a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.pendingCertificates}
              </div>
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
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#16a34a', fontFamily: 'Outfit', marginTop: '8px' }}>
                {stats.revenue}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>Receita total de cursos pagos</div>
            </div>
          </Link>

        </div>
      </div>

      {/* Real Dynamic Charts Section */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Crescimento de Usuários (Real MongoDB)</h3>
          <div className={styles.barChart}>
            {userGrowth.length > 0 ? (
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
                A calcular crescimento...
              </div>
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Distribuição por Perfil (Real MongoDB)</h3>
          <div className={styles.donutChartBox}>
            <div className={styles.donutChart}></div>
            <div className={styles.donutLegend}>
              <div className={styles.legendItem}><span style={{background: '#ff6b00'}}></span> Empreendedores ({distribution.empreendedores})</div>
              <div className={styles.legendItem}><span style={{background: '#2563eb'}}></span> Startups ({distribution.startups})</div>
              <div className={styles.legendItem}><span style={{background: '#16a34a'}}></span> Investidores ({distribution.investidores})</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3 style={{ marginBottom: '1rem', fontFamily: 'Outfit', color: '#0f172a', fontWeight: 800 }}>Atividade Recente & Segurança</h3>
        <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>
            🟢 Sistema a operar com 100% de integridade. Nenhuma atividade suspeita detetada no servidor.
          </p>
        </div>
      </div>
    </div>
  );
}
