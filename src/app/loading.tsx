import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.spinnerContainer}>
                <div className={styles.glowRing} />
                <div className={styles.glowRingInner} />
                <div className={styles.logoBox}>
                    <img src="/icon.png" alt="ABN Logo" className={styles.logoImg} />
                </div>
            </div>

            <div className={styles.textWrapper}>
                <span className={styles.title}>AfroBiz Network</span>
                <span className={styles.subtitle}>
                    A processar
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
