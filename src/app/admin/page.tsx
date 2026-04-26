import styles from './Admin.module.css';

export default function AdminPage() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4>Total Usuários</h4>
          <div className={styles.statValue}>1,284</div>
        </div>
        <div className={styles.statCard}>
          <h4>Startups Incubadas</h4>
          <div className={styles.statValue}>42</div>
        </div>
        <div className={styles.statCard}>
          <h4>Serviços Ativos</h4>
          <div className={styles.statValue}>156</div>
        </div>
        <div className={styles.statCard}>
          <h4>Receita (KZ)</h4>
          <div className={styles.statValue}>2.4M</div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={`${styles.chartCard} glass`}>
          <h3>Crescimento de Usuários</h3>
          <div className={styles.barChart}>
            <div className={styles.bar} style={{ height: '40%' }}><span>Jan</span></div>
            <div className={styles.bar} style={{ height: '60%' }}><span>Fev</span></div>
            <div className={styles.bar} style={{ height: '45%' }}><span>Mar</span></div>
            <div className={styles.bar} style={{ height: '80%' }}><span>Abr</span></div>
            <div className={styles.bar} style={{ height: '95%' }}><span>Mai</span></div>
          </div>
        </div>

        <div className={`${styles.chartCard} glass`}>
          <h3>Distribuição por Perfil</h3>
          <div className={styles.donutChartBox}>
            <div className={styles.donutChart}></div>
            <div className={styles.donutLegend}>
              <div className={styles.legendItem}><span style={{background: 'var(--primary)'}}></span> Empreendedores (60%)</div>
              <div className={styles.legendItem}><span style={{background: 'var(--secondary)'}}></span> Startups (25%)</div>
              <div className={styles.legendItem}><span style={{background: 'var(--accent)'}}></span> Investidores (15%)</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Atividade Recente</h3>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Nenhuma atividade suspeita detectada.</p>
        </div>
      </div>
    </div>
  );
}
