'use client';

import { motion } from 'framer-motion';
import styles from './Partners.module.css';

const partners = [
  { name: 'African Union', logo: '🌍' },
  { name: 'AfDB', logo: '🏦' },
  { name: 'UNDP', logo: '🇺🇳' },
  { name: 'TechHub Luanda', logo: '💻' },
  { name: 'Startup Moçambique', logo: '🚀' },
  { name: 'Global Invest', logo: '📈' },
];

export default function Partners() {
  return (
    <section className={styles.partners}>
      <div className={styles.container}>
        <p className={styles.title}>Parceiros Estratégicos & Apoio</p>
        <div className={styles.grid}>
          {partners.concat(partners).map((partner, i) => (
            <div key={i} className={styles.logoItem}>
              <span className={styles.icon}>{partner.logo}</span>
              <span className={styles.name}>{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
