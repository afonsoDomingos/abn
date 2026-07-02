'use client';

import { useEffect, useState } from 'react';
import styles from './Partners.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Partners() {
  const { t } = useLanguage();
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
        <p className={styles.title}>{t.partners.title}</p>
        <div className={styles.grid}>
          {partners.concat(partners).map((partner: any, i) => {
            const isImage = partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/'));
            const content = (
              <div key={i} className={styles.logoItem}>
                <div className={styles.iconWrapper}>
                  {isImage ? (
                    <img src={partner.logo} alt={partner.name} className={styles.logoImg} />
                  ) : (
                    <span className={styles.icon}>{partner.logo}</span>
                  )}
                  {partner.url && (
                    <div className={styles.hoverOverlay}>Visitar</div>
                  )}
                </div>
                <span className={styles.name}>{partner.name}</span>
              </div>
            );

            if (partner.url) {
              return (
                <a key={i} href={partner.url} target="_blank" rel="noopener noreferrer" className={styles.partnerLink}>
                  {content}
                </a>
              );
            }

            return content;
          })}
        </div>
      </div>
    </section>
  );
}
