'use client';

import { motion } from 'framer-motion';
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
            <motion.div 
              key={i} 
              className={styles.statItem}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
