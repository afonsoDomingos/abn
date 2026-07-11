'use client';

import { useLanguage } from '@/lib/LanguageContext';
import styles from './OurMission.module.css';
import { useState } from 'react';
import { translations } from '@/lib/translations';

export default function OurMission() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'about' | 'mission' | 'vision'>('about');
  
  // Safely get translations for current language, fallback to 'pt' if needed
  const langKey = (language === 'pt' || language === 'en' || language === 'fr') ? language : 'pt';
  const tContent = translations[langKey].essence;

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
              <img 
                src="/mission_team.png" 
                alt={tContent.title} 
                className={styles.image}
              />
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
