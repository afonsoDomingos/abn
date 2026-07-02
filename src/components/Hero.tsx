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
      <div className={styles.backgroundWrapper}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentBanner}
            className={styles.background}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ 
              backgroundImage: `linear-gradient(var(--hero-overlay), var(--hero-overlay)), url('${(content.banners && content.banners[currentBanner]) || '/img01.jpg'}')`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center 20%' 
            }}
          />
        </AnimatePresence>
        
        <motion.div 
          className={styles.circle1}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div 
          className={styles.circle2}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        ></motion.div>
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {t.hero.badge}
          </motion.div>
          
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {displayTitle}
          </motion.h1>
          
          <motion.p
            className={styles.description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {displayDesc}
          </motion.p>
          
          <motion.div 
            className={styles.cta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button className="btn-primary">{t.hero.start}</button>
            <button className="btn-outline">{t.hero.impact}</button>
          </motion.div>
 
          <motion.div 
            className={styles.promo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            {t.hero.offer}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
