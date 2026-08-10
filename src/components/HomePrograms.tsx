'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './HomePrograms.module.css';
import { motion } from 'framer-motion';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/programas/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleShareWhatsApp = (prog: Program) => {
    const url = `${window.location.origin}/programas/${prog._id}`;
    const text = language === 'pt'
      ? `Olá! Confira este programa da ABN - AfroBiz Network:\n\n*${prog.title}*\n${prog.description.slice(0, 160)}...\n\n🔗 Saiba mais em: ${url}`
      : `Hello! Check out this program by ABN - AfroBiz Network:\n\n*${prog.title}*\n${prog.description.slice(0, 160)}...\n\n🔗 Learn more: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareLinkedIn = (prog: Program) => {
    const url = `${window.location.origin}/programas/${prog._id}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareFacebook = (prog: Program) => {
    const url = `${window.location.origin}/programas/${prog._id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareTwitter = (prog: Program) => {
    const url = `${window.location.origin}/programas/${prog._id}`;
    const text = `Confira o programa *${prog.title}* da AfroBiz Network! 🚀`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareEmail = (prog: Program) => {
    const url = `${window.location.origin}/programas/${prog._id}`;
    const subject = `Programa ABN: ${prog.title}`;
    const body = `Olá!\n\nRecomendo este programa da AfroBiz Network:\n\n${prog.title}\n\n${prog.description.slice(0, 250)}...\n\nSaiba mais no link:\n${url}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
  };

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.programs) {
          setPrograms(data.programs.filter((p: Program) => p.status === 'ativo').slice(0, 3));
        }
      })
      .catch(() => { });
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
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
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
              <div key={prog._id} className={styles.card}>
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
                    <Link href={`/programas/${prog._id}`} className={styles.actionBtn}>
                      {language === 'pt' ? 'Saber Mais & Detalhes' : 'Learn More'}
                    </Link>
                    <div className={styles.shareGroup}>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={() => handleCopyLink(prog._id)}
                        title={language === 'pt' ? 'Copiar link direto do programa' : 'Copy direct link'}
                      >
                        {copiedId === prog._id ? '✅ Copiado!' : '🔗 Copiar Link'}
                      </button>
                      <button
                        type="button"
                        className={styles.waBtn}
                        onClick={() => handleShareWhatsApp(prog)}
                        title={language === 'pt' ? 'Partilhar no WhatsApp' : 'Share on WhatsApp'}
                      >
                        📱 Partilhar
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        style={{ background: '#0a66c2', color: '#ffffff' }}
                        onClick={() => handleShareLinkedIn(prog)}
                        title="Partilhar no LinkedIn"
                      >
                        in
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        style={{ background: '#1877f2', color: '#ffffff' }}
                        onClick={() => handleShareFacebook(prog)}
                        title="Partilhar no Facebook"
                      >
                        f
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        style={{ background: '#0f172a', color: '#ffffff' }}
                        onClick={() => handleShareTwitter(prog)}
                        title="Partilhar no Twitter / X"
                      >
                        𝕏
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        style={{ background: '#10b981', color: '#ffffff' }}
                        onClick={() => handleShareEmail(prog)}
                        title="Enviar por E-mail"
                      >
                        ✉️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className={styles.footer}>
          <Link href="/programas" className={styles.ctaBtn}>
            {language === 'pt' ? 'Ver Todos os Programas →' : 'View All Programs →'}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
