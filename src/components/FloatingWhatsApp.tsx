'use client';

import { useState } from 'react';
import styles from './FloatingWhatsApp.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function FloatingWhatsApp() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  const socials = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/258845773974',
      bg: '#25d366',
      tooltip: language === 'pt' ? 'Conversar no WhatsApp' : 'Chat on WhatsApp',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/abnafrobiznetwork?igsh=dTlvYndmcXA4NmVh',
      bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      tooltip: language === 'pt' ? 'Siga-nos no Instagram' : 'Follow on Instagram',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61574066674222',
      bg: '#1877f2',
      tooltip: language === 'pt' ? 'Página do Facebook' : 'Facebook Page',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/abn-afrobiz-network-43967a367',
      bg: '#0a66c2',
      tooltip: language === 'pt' ? 'Conecte-se no LinkedIn' : 'Connect on LinkedIn',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://youtu.be/BI1wkCFnuGY?si=zVbCkRWbCBYApRTh',
      bg: '#ff0000',
      tooltip: language === 'pt' ? 'Canal do YouTube' : 'YouTube Channel',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
        </svg>
      )
    }
  ];

  return (
    <div className={styles.dockWrapper}>
      {/* Expanded Social Icons Stack */}
      <div className={`${styles.socialStack} ${isOpen ? styles.stackOpen : ''}`}>
        {socials.map((s, idx) => (
          <a
            key={idx}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            style={{ background: s.bg }}
            title={s.tooltip}
          >
            {s.icon}
            <span className={styles.tooltip}>{s.tooltip}</span>
          </a>
        ))}
      </div>

      {/* Main Trigger Button */}
      <button
        type="button"
        className={styles.triggerBtn}
        onClick={() => setIsOpen(!isOpen)}
        title={language === 'pt' ? 'Redes Sociais ABN' : 'ABN Social Networks'}
      >
        <span className={styles.triggerIcon}>
          {isOpen ? '✕' : '🌐'}
        </span>
        <span className={styles.triggerBadge}>
          {language === 'pt' ? 'Redes Sociais' : 'Socials'}
        </span>
      </button>
    </div>
  );
}
