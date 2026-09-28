'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import styles from './Partners.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Partners() {
  const { t } = useLanguage();
  const [partners, setPartners] = useState([
    { name: 'African Union', logo: '', category: 'Institucional' },
    { name: 'AfDB', logo: '', category: 'Financeiro' },
    { name: 'UNDP', logo: '🇺🇳', category: 'Internacional' },
    { name: 'TechHub Luanda', logo: '', category: 'Tecnologia' },
    { name: 'Startup Moçambique', logo: '', category: 'Ecossistema' },
    { name: 'Global Invest', logo: '', category: 'Investimento' },
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
    <section className={styles.partners} id="parceiros">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.badge}>{t.partners.badge}</p>
          <h2 className={styles.title}>{t.partners.heading}</h2>
          <p className={styles.subtitle}>
            {t.partners.subtitle}
          </p>
        </div>

        <div className={styles.grid}>
          {partners.map((partner: any, i) => {
            const isImage = partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/'));
            const content = (
              <div key={i} className={styles.partnerCard}>
                <div className={styles.logoWrapper}>
                  {isImage ? (
                    <img src={partner.logo} alt={partner.name} className={styles.logoImg} />
                  ) : (
                    <span className={styles.icon}>{partner.logo ? partner.logo : <Building2 size={32} />}</span>
                  )}
                </div>
                <div className={styles.partnerInfo}>
                  <h3 className={styles.partnerName}>{partner.name}</h3>
                  {partner.category && (
                    <span className={styles.partnerCategory}>{partner.category}</span>
                  )}
                </div>
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

        <div className={styles.ctaSection}>
          <Link href="/parceiros" className={styles.ctaButton}>
            {t.partners.viewAll}
          </Link>
          <Link href="/seja-parceiro" className={styles.secondaryButton}>
            {t.partners.becomePartner}
          </Link>
        </div>
      </div>
    </section>
  );
}
