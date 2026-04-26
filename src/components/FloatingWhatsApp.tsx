'use client';

import styles from './FloatingWhatsApp.module.css';

export default function FloatingWhatsApp() {
  return (
    <a 
      href="https://wa.me/258845773974" 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.floatingBtn}
      title="Fale connosco no WhatsApp"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
      <span className={styles.tooltip}>Suporte ABN</span>
    </a>
  );
}
