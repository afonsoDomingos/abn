'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Features.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Features() {
  const { t, language } = useLanguage();
  const [features, setFeatures] = useState([
    {
      title: 'Incubação de Negócios',
      desc: 'Programas intensivos de 3 a 6 meses para validar e escalar o seu modelo de negócio.',
      icon: '🚀'
    },
    {
      title: 'Marketing & Tech',
      desc: 'Criamos a sua presença digital profissional, desde websites a apps de alta performance.',
      icon: '💻'
    },
    {
      title: 'Rede de Mentores',
      desc: 'Conecte-se com líderes de indústria e especialistas prontos para guiar a sua jornada.',
      icon: '🤝'
    },
    {
      title: 'Acesso a Capital',
      desc: 'Preparamos o seu pitch e conectamos a sua startup a investidores anjo e VC.',
      icon: '💰'
    }
  ]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.features_content) {
          setFeatures(data.configs.features_content);
        }
      });
  }, []);

  const getIcon = (icon: string) => {
    switch (icon) {
      case '🚀':
      case 'incubacao':
        return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"></path><path d="M12 15v5s.8 3.38 3 5c1.97 1.45 5 2 5 2"></path></svg>;
      case '💻':
      case 'tech':
        return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
      case '🤝':
      case 'mentoria':
        return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      case '💰':
      case 'capital':
        return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
      default:
        return <span>{icon}</span>;
    }
  };

  return (
    <section className={styles.features} id="incubadora">
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.badge}>{t.features.badge}</span>
          <h2 className={styles.title}>{t.features.title}</h2>
          <p className={styles.subtitle}>{t.features.subtitle}</p>
        </motion.div>
        
        <div className={styles.grid}>
          {features.map((f, i) => {
            const translated = language !== 'pt' && t.features.items[i] ? t.features.items[i] : null;
            return (
              <motion.div 
                key={i} 
                className={`${styles.card} glass`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className={styles.icon}>{getIcon(f.icon)}</div>
                <h3 className={styles.featureTitle}>{translated ? translated.title : f.title}</h3>
                <p className={styles.featureDescription}>{translated ? translated.desc : f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
