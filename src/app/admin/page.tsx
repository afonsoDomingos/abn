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

      <div className={styles.recentActivity}>
        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Atividade Recente</h3>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Nenhuma atividade suspeita detectada.</p>
        </div>
      </div>
    </div>
  );
}
