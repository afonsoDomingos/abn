import styles from '../loading.module.css';

export default function DashboardLoading() {
  return (
    <div className={styles.loadingOverlay} style={{ background: 'rgba(255, 255, 255, 0.92)' }}>
      <div className={styles.spinnerContainer}>
        <div className={styles.glowRing} />
        <div className={styles.glowRingInner} />
        <div className={styles.logoBox} style={{ border: '1px solid #e2e8f0' }}>
          <img src="/icon.png" alt="ABN Logo" className={styles.logoImg} />
        </div>
      </div>

      <div className={styles.textWrapper}>
        <span className={styles.title} style={{ background: 'none', color: '#0f172a' }}>O Meu Painel ABN</span>
        <span className={styles.subtitle}>
          A carregar a sua área de membro
          <span className={styles.dots}>
            <span />
            <span />
            <span />
          </span>
        </span>
      </div>
    </div>
  );
}
