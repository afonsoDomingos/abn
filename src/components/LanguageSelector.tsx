'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './LanguageSelector.module.css';

const FlagPT = () => (
  <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="256" fill="#4b9246"/>
    <path d="M0 256c0 141.4 114.6 256 256 256V0C114.6 0 0 114.6 0 256z" fill="#f00"/>
    <circle cx="256" cy="256" r="85.3" fill="#ff0"/>
  </svg>
);

const FlagEN = () => (
  <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="256" fill="#00247d"/>
    <path d="M512 256a256 256 0 1 0-512 0c0 4.3.1 8.5.3 12.8L193 268.8l125.8 125.9 12.8.3 180.4-139z" fill="#fff"/>
    <path d="M0 256c0 4.3.1 8.5.3 12.8L193 268.8 318.8 394.7 331.6 395 512 256a256 256 0 0 0-512 0z" fill="#fff"/>
    <path d="M256 0v512h64V0h-64zM0 224v64h512v-64H0z" fill="#cf142b"/>
  </svg>
);

const FlagFR = () => (
  <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="256" fill="#fff"/>
    <path d="M0 256c0 111.4 71.2 206.1 170.7 241.1V14.9C71.2 49.9 0 144.6 0 256z" fill="#002395"/>
    <path d="M341.3 14.9v482.2c99.5-35 170.7-129.7 170.7-241.1s-71.2-206.1-170.7-241.1z" fill="#ed2939"/>
  </svg>
);

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'pt', name: 'Português', short: 'PT', flag: <FlagPT /> },
    { code: 'en', name: 'English', short: 'EN', flag: <FlagEN /> },
    { code: 'fr', name: 'Français', short: 'FR', flag: <FlagFR /> },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar idioma"
      >
        <span className={styles.flagIcon}>{currentLang.flag}</span>
        <span className={styles.shortName}>{currentLang.short}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.option} ${language === lang.code ? styles.activeOption : ''}`}
              onClick={() => {
                setLanguage(lang.code as any);
                setIsOpen(false);
              }}
            >
              <span className={styles.flagIcon}>{lang.flag}</span>
              <span className={styles.fullName}>{lang.name}</span>
              {language === lang.code && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
