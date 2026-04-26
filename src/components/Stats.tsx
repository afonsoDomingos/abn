import styles from './Stats.module.css';

const stats = [
  { label: 'Startups Incubadas', value: '150+' },
  { label: 'Capital Captado', value: '$2.5M' },
  { label: 'Mentores Especialistas', value: '45' },
  { label: 'Países em África', value: '12' }
];

export default function Stats() {
  return (
    <section className={styles.statsSection} id="impacto">
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
