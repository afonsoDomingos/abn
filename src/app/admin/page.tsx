'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    activeServices: 0,
    revenue: '0.00'
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
      });
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
          <h4>Receita (MT)</h4>
          <div className={styles.statValue}>{stats.revenue}</div>
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
              <div className={styles.legendItem}><span style={{background: 'var(--primary)'}}></span> Empreendedores ({distribution.empreendedores})</div>
              <div className={styles.legendItem}><span style={{background: 'var(--secondary)'}}></span> Startups ({distribution.startups})</div>
              <div className={styles.legendItem}><span style={{background: 'var(--accent)'}}></span> Investidores ({distribution.investidores})</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Atividade Recente</h3>
        <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Nenhuma atividade suspeita detectada.</p>
        </div>
      </div>
    </div>
  );
}
