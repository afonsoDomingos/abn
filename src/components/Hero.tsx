'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Hero() {
  const { t, language } = useLanguage();
  const [content, setContent] = useState({
    title: '',
    description: '',
    banners: []
  });

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.hero_content) {
          setContent(data.configs.hero_content);
        }
      });
  }, []);

  // Use translations if content from API is empty or we are not in PT
  // Note: For a real production app, the API should return translated content.
  const displayTitle = (language === 'pt' && content.title) ? content.title : t.hero.title;
  const displayDesc = (language === 'pt' && content.description) ? content.description : t.hero.desc;

  useEffect(() => {
    if (content.banners && content.banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % content.banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [content.banners]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroWrapper}>
        {/* Right side banner image */}
        <div 
          className={styles.bannerImage}
          style={{ backgroundImage: `url(${content.banners && content.banners.length > 0 ? content.banners[currentBanner] : '/hero_entrepreneurs.png'})` }}
        >
          {/* Orange round partner badge in top-right */}
          <div className={styles.partnerBadge}>
            <span className={styles.partnerText}>ABN</span>
          </div>
        </div>

        {/* Left side blue card */}
        <div className={styles.blueCard}>
          <div className={styles.blueCardContent}>
            <h1 className={styles.title}>
              {language === 'pt' ? 'Empreendedorismo para um mundo melhor' : 'Entrepreneurship for a better world'}
            </h1>
            <p className={styles.description}>
              {displayDesc}
            </p>
            <div className={styles.ctaWrapper}>
              <a href="/registro" className="btn-primary">
                {language === 'pt' ? 'Junte-se a nós' : 'Join us'}
              </a>
            </div>
          </div>

          {/* Overlapping Orange Pin */}
          <div className={styles.overlappingPin}>
            <svg viewBox="0 0 24 30" width="80" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18c0-6.63-5.37-12-12-12z" fill="#ff6b00" />
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="#ffffff" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
