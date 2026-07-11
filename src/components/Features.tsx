'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Features.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Features() {
  const { t, language } = useLanguage();
  
  interface FeatureItem {
    num: string;
    title: string;
    bullets?: string[];
    desc?: string;
  }

  const defaultFeatures: FeatureItem[] = [
    {
      num: '01',
      title: 'INCUBAÇÃO E ACELERAÇÃO GLOBAL',
      bullets: [
        'Desenvolvimento de Startups e MPMEs',
        'Programas de incubação e aceleração',
        'Estruturação de modelos de negócio',
        'Mentoria estratégica e Smart Money'
      ]
    },
    {
      num: '02',
      title: 'CAPACITAÇÃO E EDUCAÇÃO EXECUTIVA',
      bullets: [
        'Formação empreendedora certificada',
        'Desenvolvimento de liderança',
        'Consultoria estratégica',
        'Capacitação técnica e empresarial'
      ]
    },
    {
      num: '03',
      title: 'INVESTIMENTO E PARTICIPAÇÃO',
      bullets: [
        'Venture Builder',
        'Gestão de portfólio',
        'Participação em negócios inovadores',
        'Curadoria de projetos de alto potencial'
      ]
    },
    {
      num: '04',
      title: 'NETWORKING E FACILITAÇÃO DE MERCADOS',
      bullets: [
        'Conexão intercontinental',
        'Corredores internacionais de negócios',
        'Plataforma digital de integração',
        'Parcerias e alianças estratégicas globais'
      ]
    },
    {
      num: '05',
      title: 'SUSTENTABILIDADE E POLÍTICAS PÚBLICAS',
      bullets: [
        'Soluções verdes e tecnológicas',
        'Economia circular',
        'Inclusão econômica',
        'Advocacy e influência institucional'
      ]
    }
  ];

  const [features, setFeatures] = useState<FeatureItem[]>(defaultFeatures);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.features_content) {
          setFeatures(data.configs.features_content);
        }
      });
  }, []);

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
            const itemNum = f.num || `0${i + 1}`;
            const itemTitle = translated ? translated.title : f.title;
            const itemBullets = translated ? translated.bullets : (f.bullets || []);

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
                <div className={styles.cardHeader}>
                  <span className={styles.cardNumber}>{itemNum}</span>
                  <h3 className={styles.featureTitle}>{itemTitle}</h3>
                </div>
                {itemBullets && itemBullets.length > 0 ? (
                  <ul className={styles.bulletsList}>
                    {itemBullets.map((bullet: string, idx: number) => (
                      <li key={idx} className={styles.bulletItem}>
                        <span className={styles.bulletCheck}></span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.featureDescription}>{translated ? translated.desc : f.desc}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
