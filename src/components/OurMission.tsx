'use client';

import { useLanguage } from '@/lib/LanguageContext';
import styles from './OurMission.module.css';
import { useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

export default function OurMission() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'about' | 'mission' | 'vision'>('about');
  const [missionImages, setMissionImages] = useState<string[]>(['/mission_team.png']);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Safely get translations for current language, fallback to 'pt' if needed
  const langKey = (language === 'pt' || language === 'en' || language === 'fr') ? language : 'pt';
  const tContent = translations[langKey].essence;

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.mission_images) {
          setMissionImages(data.configs.mission_images);
        }
      });
  }, []);

  useEffect(() => {
    if (missionImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % missionImages.length);
    }, 4000); // changes every 4 seconds
    return () => clearInterval(interval);
  }, [missionImages]);

  return (
    <section className={styles.section} id="missao">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Image with wavy background pattern */}
          <div className={styles.imageColumn}>
            <div className={styles.patternBackground}>
              <div className={styles.wavyPattern}></div>
            </div>
            <div className={styles.imageWrapper}>
              {missionImages.map((imgUrl, idx) => (
                <img 
                  key={idx}
                  src={imgUrl} 
                  alt={tContent.title} 
                  className={styles.image}
                  style={{
                    position: idx === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: idx === currentImageIndex ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    zIndex: idx === currentImageIndex ? 2 : 1
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Text Content (About / Mission / Vision) */}
          <div className={styles.contentColumn}>
            <span className={styles.badge}>
              {tContent.badge}
            </span>

            {/* Tab Selectors */}
            <div className={styles.tabsHeader}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'about' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('about')}
              >
                {tContent.tabs.about}
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'mission' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('mission')}
              >
                {tContent.tabs.mission}
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'vision' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('vision')}
              >
                {tContent.tabs.vision}
              </button>
            </div>

            {/* Tab Contents */}
            <div className={styles.tabBody}>
              {activeTab === 'about' && (
                <div>
                  <h3 className={styles.tabTitle}>{tContent.title}</h3>
                  <p className={styles.text}>{tContent.text}</p>
                  <p className={styles.conectaLabel}>{tContent.conectaText}</p>
                  <div className={styles.connectionsGrid}>
                    {tContent.connections.map((conn, idx) => (
                      <div key={idx} className={styles.connectionItem}>
                        <span className={styles.bulletDot}></span>
                        <span>{conn}</span>
                      </div>
                    ))}
                  </div>
                  <p className={styles.closingText}>{tContent.closing}</p>
                </div>
              )}

              {activeTab === 'mission' && (
                <div>
                  <h3 className={styles.tabTitle}>{tContent.tabs.mission}</h3>
                  <p className={styles.text} style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--foreground)', lineHeight: 1.6 }}>
                    {tContent.missionText}
                  </p>
                </div>
              )}

              {activeTab === 'vision' && (
                <div>
                  <h3 className={styles.tabTitle}>{tContent.tabs.vision}</h3>
                  <p className={styles.text} style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--foreground)', lineHeight: 1.6 }}>
                    {tContent.visionText}
                  </p>
                </div>
              )}
            </div>

            {/* Tagline Stamp */}
            <div className={styles.tagline}>
              {tContent.tagline}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
