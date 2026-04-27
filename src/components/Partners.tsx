'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Partners.module.css';

export default function Partners() {
  const [partners, setPartners] = useState([
    { name: 'African Union', logo: '🌍' },
    { name: 'AfDB', logo: '🏦' },
    { name: 'UNDP', logo: '🇺🇳' },
    { name: 'TechHub Luanda', logo: '💻' },
    { name: 'Startup Moçambique', logo: '🚀' },
    { name: 'Global Invest', logo: '📈' },
  ]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.partners_content) {
          setPartners(data.configs.partners_content);
        }
      });
  }, []);

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
