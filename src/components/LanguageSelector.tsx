'use client';

import { useLanguage } from '@/lib/LanguageContext';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'pt', name: 'PT', flag: '🇵🇹' },
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
  ];

  return (
    <div className={styles.selector}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`${styles.btn} ${language === lang.code ? styles.active : ''}`}
          onClick={() => setLanguage(lang.code as any)}
          title={lang.name}
        >
          <span className={styles.flag}>{lang.flag}</span>
          <span className={styles.name}>{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
