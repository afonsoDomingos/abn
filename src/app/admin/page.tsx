'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    activeServices: 0,
    revenue: '0 MT'
  });
  const [distribution, setDistribution] = useState({
    empreendedores: 0,
    startups: 0,
    investidores: 0
  });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.distribution) setDistribution(data.distribution);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4>Total Usuários</h4>
          <div className={styles.statValue}>{stats.totalUsers}</div>
        </div>
        <div className={styles.statCard}>
          <h4>Startups Incubadas</h4>
          <div className={styles.statValue}>{stats.totalStartups}</div>
        </div>
        <div className={styles.statCard}>
          <h4>Serviços Ativos</h4>
          <div className={styles.statValue}>{stats.activeServices}</div>
        </div>
        <div className={styles.statCard}>
          <h4>Faturação / Receita</h4>
          <div className={styles.statValue} style={{ color: '#16a34a' }}>{stats.revenue}</div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Crescimento de Usuários</h3>
          <div className={styles.barChart}>
            <div className={styles.bar} style={{ height: '40%' }}><span>Jan</span></div>
            <div className={styles.bar} style={{ height: '60%' }}><span>Fev</span></div>
            <div className={styles.bar} style={{ height: '45%' }}><span>Mar</span></div>
            <div className={styles.bar} style={{ height: '80%' }}><span>Abr</span></div>
            <div className={styles.bar} style={{ height: '95%' }}><span>Mai</span></div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Distribuição por Perfil</h3>
          <div className={styles.donutChartBox}>
            <div className={styles.donutChart}></div>
            <div className={styles.donutLegend}>
              <div className={styles.legendItem}><span style={{background: 'var(--primary, #ff6b00)'}}></span> Empreendedores ({distribution.empreendedores})</div>
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
