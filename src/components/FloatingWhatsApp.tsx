'use client';

import styles from './FloatingWhatsApp.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function FloatingWhatsApp() {
  const { t } = useLanguage();
  
  return (
    <a 
      href="https://wa.me/258845773974" 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.floatingBtn}
      title={t.nav.support}
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
      <span className={styles.tooltip}>{t.nav.support} ABN</span>
    </a>
  );
}
