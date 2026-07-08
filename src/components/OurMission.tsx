'use client';

import { useLanguage } from '@/lib/LanguageContext';
import styles from './OurMission.module.css';

export default function OurMission() {
  const { language } = useLanguage();

  return (
    <section className={styles.section} id="missao">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Image with wavy background pattern */}
          <div className={styles.imageColumn}>
            <div className={styles.patternBackground}>
              {/* Wavy background decoration */}
              <div className={styles.wavyPattern}></div>
            </div>
            <div className={styles.imageWrapper}>
              <img 
                src="/mission_team.png" 
                alt={language === 'pt' ? 'Nossa Missão' : 'Our Mission'} 
                className={styles.image}
              />
            </div>
          </div>

          {/* Right Column: Mission Text Content */}
          <div className={styles.contentColumn}>
            <span className={styles.badge}>
              {language === 'pt' ? 'Nossa Missão' : 'Our Mission'}
            </span>
            <h2 className={styles.title}>
              {language === 'pt' ? 'Empreendedorismo para um mundo melhor' : 'Entrepreneurship for a better world'}
            </h2>
            <p className={styles.text}>
              {language === 'pt' ? (
                'A ABN – AfroBiz Network é uma plataforma dedicada a impulsionar o ecossistema de inovação e empreendedorismo em África. Nós fornecemos aos jovens empreendedores ferramentas digitais, mentoria especializada, conexões com redes de investidores e oportunidades de financiamento para construir negócios de impacto, sustentáveis e lucrativos que contribuam para uma sociedade mais inclusiva.'
              ) : (
                'ABN – AfroBiz Network is a platform dedicated to boosting the innovation and entrepreneurship ecosystem in Africa. We provide young entrepreneurs with digital tools, expert mentorship, investor network connections, and funding opportunities to build impactful, sustainable, and profitable businesses that contribute to a more inclusive society.'
              )}
            </p>
            <div className={styles.btnWrapper}>
              <a href="/incubacao" className="btn-outline">
                {language === 'pt' ? 'Saber mais' : 'Read more'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
