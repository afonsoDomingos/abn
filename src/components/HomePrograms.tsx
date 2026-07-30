'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './HomePrograms.module.css';

interface Program {
  _id: string;
  title: string;
  description: string;
  phase?: string;
  duration?: string;
  status: string;
  image?: string;
}

export default function HomePrograms() {
  const { language } = useLanguage();
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.programs) {
          setPrograms(data.programs.filter((p: Program) => p.status === 'ativo').slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  if (programs.length === 0) return null;

  const phaseColors: Record<string, string> = {
    'Incubação & Aceleração': '#d4af37',
    'Desenvolvimento': '#3498db',
    'Formação': '#2ecc71',
    'Networking': '#e67e22',
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>
            🚀 {language === 'pt' ? 'Programas ABN' : 'ABN Programs'}
          </span>
          <h2 className={styles.title}>
            {language === 'pt' ? 'Programas de Incubação & Aceleração' : 'Incubation & Acceleration Programs'}
          </h2>
          <p className={styles.subtitle}>
            {language === 'pt'
              ? 'Desde a ideia até ao crescimento: acompanhamos empreendedores em cada etapa da jornada.'
              : 'From idea to growth: we support entrepreneurs at every step of the journey.'}
          </p>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {programs.map(prog => {
            const phaseColor = phaseColors[prog.phase || ''] || '#d4af37';
            return (
              <Link key={prog._id} href="/programas" className={styles.card}>
                {prog.image && (
                  <div className={styles.cardImage}>
                    <img src={prog.image} alt={prog.title} />
                  </div>
                )}
                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    {prog.phase && (
                      <span
                        className={styles.phaseBadge}
                        style={{ color: phaseColor, background: `${phaseColor}15`, border: `1px solid ${phaseColor}30` }}
                      >
                        {prog.phase}
                      </span>
                    )}
                    {prog.duration && (
                      <span className={styles.durationBadge}>⏱️ {prog.duration}</span>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{prog.title}</h3>
                  <p className={styles.cardDesc}>
                    {prog.description.slice(0, 140)}...
                  </p>
                  <div className={styles.cardAction}>
                    <span className={styles.actionBtn}>
                      {language === 'pt' ? 'Saber Mais' : 'Learn More'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className={styles.footer}>
          <Link href="/programas" className={styles.ctaBtn}>
            {language === 'pt' ? 'Ver Todos os Programas →' : 'View All Programs →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
