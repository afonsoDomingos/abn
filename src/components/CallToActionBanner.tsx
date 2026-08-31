'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './CallToActionBanner.module.css';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CallToActionBanner() {
  const { language } = useLanguage();

  // Typewriter for CTA title
  const TITLES_PT = [
    'Tens uma Ideia ou Startup? Transforma o teu Negócio!',
    'Acelera o teu Projeto com Mentores Especializados!',
    'Conecta-te a Investidores e Parceiros Estratégicos!',
  ];
  const TITLES_EN = [
    'Have an Idea or Startup? Scale Your Business Today!',
    'Accelerate Your Project with Expert Mentors!',
    'Connect to Investors and Strategic Partners!',
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [typedTitle, setTypedTitle] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => setCursorOn(v => !v), 520);
    return () => clearInterval(blink);
  }, []);

  // Typewriter logic
  useEffect(() => {
    const phrases = language === 'pt' ? TITLES_PT : TITLES_EN;
    const phrase = phrases[phraseIdx];
    let t: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < phrase.length) {
      t = setTimeout(() => {
        setTypedTitle(phrase.slice(0, charIdx + 1));
        setCharIdx(i => i + 1);
      }, 45);
    } else if (!deleting && charIdx === phrase.length) {
      t = setTimeout(() => setDeleting(true), 2500);
    } else if (deleting && charIdx > 0) {
      t = setTimeout(() => {
        setTypedTitle(phrase.slice(0, charIdx - 1));
        setCharIdx(i => i - 1);
      }, 22);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % phrases.length);
    }

    return () => clearTimeout(t);
  }, [charIdx, deleting, phraseIdx, language]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Decorative glowing background elements */}
          <div className={styles.glowOrange} />
          <div className={styles.glowBlue} />

          <div className={styles.content}>
            <span className={styles.badge}>
              {language === 'pt' ? 'CANDIDATURAS ABERTAS' : 'APPLICATIONS OPEN'}
            </span>

            <h2 className={styles.title}>
              {typedTitle}
              <span style={{
                display: 'inline-block',
                width: '3px',
                height: '0.85em',
                backgroundColor: '#ff6b00',
                marginLeft: '4px',
                verticalAlign: 'middle',
                borderRadius: '1px',
                opacity: cursorOn ? 1 : 0,
                transition: 'opacity 0.1s',
              }} />
            </h2>

            <p className={styles.description}>
              {language === 'pt'
                ? 'Inscreve-te no programa ABN Startup 180. Recebe mentoria personalizada de especialistas, apoio ao plano de negócios, capacitação digital e acesso a redes de financiamento.'
                : 'Enroll in the ABN Startup 180 program. Receive personalized expert mentoring, business plan support, digital skills, and access to funding networks.'}
            </p>

            <div className={styles.highlights}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>→</span>
                <span>{language === 'pt' ? 'Incubação & Aceleração' : 'Incubation & Acceleration'}</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>→</span>
                <span>{language === 'pt' ? 'Mentoria com Especialistas' : 'Expert Mentorship'}</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>→</span>
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
        </motion.div>
      </div>
    </section>
  );
}
