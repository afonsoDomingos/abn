'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Stats.module.css';

export default function Stats() {
  const [stats, setStats] = useState([
    { label: 'Startups Incubadas', value: '150+' },
    { label: 'Capital Captado', value: '$2.5M' },
    { label: 'Mentores Especialistas', value: '45' },
    { label: 'Países em África', value: '12' }
  ]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.stats_content) {
          setStats(data.configs.stats_content);
        }
      });
  }, []);

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
