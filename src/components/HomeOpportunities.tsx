'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './HomeOpportunities.module.css';

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  category: string;
  amount?: string;
  deadline?: string;
  provider?: string;
  location?: string;
  applyLink?: string;
}

const catColors: Record<string, { color: string; bg: string }> = {
  'Financiamento': { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)' },
  'Bolsa de Estudo': { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  'Concurso': { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)' },
  'Aceleração': { color: '#ff6b00', bg: 'rgba(255, 107, 0, 0.12)' },
  'Emprego': { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  'Edital': { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)' },
};

export default function HomeOpportunities() {
  const { language } = useLanguage();
  const [opps, setOpps] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetch('/api/opportunities')
      .then(res => res.json())
      .then(data => {
        if (data.opportunities) setOpps(data.opportunities.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (opps.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>
            {language === 'pt' ? 'Oportunidades' : 'Opportunities'}
          </span>
          <h2 className={styles.title}>
            {language === 'pt' ? 'Oportunidades em Destaque' : 'Featured Opportunities'}
          </h2>
          <p className={styles.subtitle}>
            {language === 'pt'
              ? 'Editais, bolsas, financiamentos e concursos para acelerar o seu negócio em África.'
              : 'Grants, scholarships, funding and competitions to grow your business in Africa.'}
          </p>
        </div>

        {/* Cards list */}
        <div className={styles.list}>
          {opps.map(opp => {
            const cat = catColors[opp.category] || { color: '#ff6b00', bg: 'rgba(255, 107, 0, 0.12)' };
            return (
              <div
                key={opp._id}
                className={styles.item}
                style={{
                  borderLeft: `4px solid ${cat.color}`
                }}
              >
                <div className={styles.content}>
                  <div className={styles.metaRow}>
                    <span
                      className={styles.catBadge}
                      style={{ color: cat.color, background: cat.bg, borderColor: `${cat.color}35` }}
                    >
                      {opp.category}
                    </span>
                    {opp.location && (
                      <span className={styles.location}>
                        📍 {opp.location}
                      </span>
                    )}
                  </div>
                  <h3 className={styles.itemTitle}>{opp.title}</h3>
                  <p className={styles.itemDesc}>
                    {opp.description.slice(0, 140)}...
                  </p>
                </div>
                <div className={styles.actionBox}>
                  {opp.amount && (
                    <span className={styles.amount} style={{ color: cat.color }}>
                      {opp.amount}
                    </span>
                  )}
                  {opp.applyLink ? (
                    <a
                      href={opp.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.applyLinkBtn}
                      style={{
                        background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`,
                        color: '#ffffff'
                      }}
                    >
                      {language === 'pt' ? 'Candidatar →' : 'Apply →'}
                    </a>
                  ) : (
                    <Link href="/oportunidades" className={styles.moreLinkBtn}>
                      {language === 'pt' ? 'Ver Mais →' : 'See More →'}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className={styles.footer}>
          <Link href="/oportunidades" className={styles.ctaBtn}>
            {language === 'pt' ? 'Ver Todas as Oportunidades →' : 'View All Opportunities →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
