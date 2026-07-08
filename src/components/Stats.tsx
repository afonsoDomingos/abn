'use client';

import { motion } from 'framer-motion';
import styles from './Stats.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Stats() {
  const { language } = useLanguage();

  const statItems = [
    {
      value: '968',
      labelPT: 'Alumni',
      labelEN: 'Alumni',
      color: 'var(--accent)', // Green
      icon: (
        <svg viewBox="0 0 100 130" width="80" height="104" className={styles.pinSvg}>
          <path d="M50 10 C 15 10, 15 80, 50 120 C 85 80, 85 10, 50 10 Z" fill="var(--accent)" />
          {/* Person Icon */}
          <circle cx="50" cy="42" r="10" fill="#ffffff" />
          <path d="M32 66 C 32 56, 40 52, 50 52 C 60 52, 68 56, 68 66 Z" fill="#ffffff" />
        </svg>
      )
    },
    {
      value: '14+',
      labelPT: 'Parceiros Privados',
      labelEN: 'Private partners',
      color: 'var(--secondary)', // Blue
      icon: (
        <svg viewBox="0 0 100 130" width="80" height="104" className={styles.pinSvg}>
          <path d="M50 10 C 15 10, 15 80, 50 120 C 85 80, 85 10, 50 10 Z" fill="var(--secondary)" />
          {/* Handshake Icon */}
          <path d="M32 50 C 32 45, 36 42, 42 42 L 58 42 C 64 42, 68 45, 68 50 L 68 54 C 68 59, 64 62, 58 62 L 42 62 C 36 62, 32 59, 32 54 Z" fill="#ffffff" opacity="0.15" />
          <path d="M36 52 C 38 48, 44 48, 46 52 L 48 54 L 52 50 C 54 46, 60 46, 62 50 L 66 54 L 56 64 L 46 54 L 42 58 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      value: '13%',
      labelPT: 'Mulheres Empreendedoras',
      labelEN: 'Female entrepreneurs',
      color: 'var(--accent)', // Green
      icon: (
        <svg viewBox="0 0 100 130" width="80" height="104" className={styles.pinSvg}>
          <path d="M50 10 C 15 10, 15 80, 50 120 C 85 80, 85 10, 50 10 Z" fill="var(--accent)" />
          {/* Female symbol */}
          <circle cx="50" cy="40" r="11" stroke="#ffffff" strokeWidth="4" fill="none" />
          <line x1="50" y1="51" x2="50" y2="69" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <line x1="41" y1="60" x2="59" y2="60" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )
    },
    {
      value: '5K+',
      labelPT: 'Empregos Apoiados',
      labelEN: 'Jobs supported',
      color: 'var(--secondary)', // Blue
      icon: (
        <svg viewBox="0 0 100 130" width="80" height="104" className={styles.pinSvg}>
          <path d="M50 10 C 15 10, 15 80, 50 120 C 85 80, 85 10, 50 10 Z" fill="var(--secondary)" />
          {/* Person outline icon */}
          <circle cx="50" cy="40" r="9" fill="#ffffff" />
          <path d="M34 64 C 34 55, 41 51, 50 51 C 59 51, 66 55, 66 64 Z" fill="#ffffff" />
        </svg>
      )
    }
  ];

  return (
    <section className={styles.statsSection} id="impacto">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {language === 'pt' ? 'Nosso impacto' : 'Our impact'}
          </h2>
          <p className={styles.subtitle}>
            {language === 'pt' ? 'Deixe os números falarem' : 'Let the numbers speak'}
          </p>
        </div>

        <div className={styles.grid}>
          {statItems.map((stat, i) => (
            <motion.div 
              key={i} 
              className={styles.statItem}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className={styles.iconWrapper}>
                {stat.icon}
              </div>
              <div className={styles.value}>
                {stat.value}
              </div>
              <div className={styles.label}>
                {language === 'pt' ? stat.labelPT : stat.labelEN}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
