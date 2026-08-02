'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './CallToActionBanner.module.css';

export default function CallToActionBanner() {
  const { language } = useLanguage();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Decorative glowing background elements */}
          <div className={styles.glowOrange} />
          <div className={styles.glowBlue} />

          <div className={styles.content}>
            <span className={styles.badge}>
              🚀 {language === 'pt' ? 'CANDIDATURAS ABERTAS' : 'APPLICATIONS OPEN'}
            </span>

            <h2 className={styles.title}>
              {language === 'pt'
                ? 'Tens uma Ideia ou Startup? Transforma o teu Negócio!'
                : 'Have an Idea or Startup? Scale Your Business Today!'}
            </h2>

            <p className={styles.description}>
              {language === 'pt'
                ? 'Inscreve-te no programa ABN Startup 180. Recebe mentoria personalizada de especialistas, apoio ao plano de negócios, capacitação digital e acesso a redes de financiamento.'
                : 'Enroll in the ABN Startup 180 program. Receive personalized expert mentoring, business plan support, digital skills, and access to funding networks.'}
            </p>

            <div className={styles.highlights}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>✨</span>
                <span>{language === 'pt' ? 'Incubação & Aceleração' : 'Incubation & Acceleration'}</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>👨‍🏫</span>
                <span>{language === 'pt' ? 'Mentoria com Especialistas' : 'Expert Mentorship'}</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>💰</span>
                <span>{language === 'pt' ? 'Acesso a Oportunidades & Capital' : 'Access to Funding & Capital'}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/incubacao" className={styles.btnPrimary}>
                {language === 'pt' ? 'Candidatar a Minha Startup →' : 'Apply My Startup →'}
              </Link>
              <Link href="/contacto" className={styles.btnSecondary}>
                {language === 'pt' ? 'Falar com a Equipa' : 'Talk to Our Team'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
