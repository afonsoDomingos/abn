'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PresidentMessage from '@/components/PresidentMessage';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './page.module.css';

export default function MensagemDoPresidentePage() {
  const { t, language } = useLanguage();
  const [bannerUrl, setBannerUrl] = useState<string>('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.mensagem_presidente) {
          setBannerUrl(data.configs.page_banners.mensagem_presidente);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Banner Section */}
        <div 
          className={styles.heroBanner}
          style={bannerUrl ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Mensagem Oficial</span>
            <h1 className={styles.heroTitle}>Mensagem do Presidente</h1>
            <p className={styles.heroSub}>
              Uma palavra de boas-vindas e visão estratégica do Fundador e Presidente da AfroBiz Network.
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <svg className={styles.wave} viewBox="0 0 1440 48" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32 C360,60 1080,0 1440,32 L1440,48 L0,48 Z" fill="#f8fafc"/>
        </svg>

        {/* Component */}
        <PresidentMessage showFullPageLayout={true} />

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <div className={styles.footerContainer}>
              <div className={styles.footerGrid}>
                <div className={styles.footerBrand}>
                  <Link href="/" className={styles.footerLogo}>
                    <img src="/icon.png" alt="ABN Logo" className={styles.footerLogoImg} />
                    <div className={styles.footerLogoText}>
                      <span className={styles.footerAbn}>ABN</span>
                      <span className={styles.footerNetwork}>AfroBiz Network</span>
                    </div>
                  </Link>
                </div>
                <div className={styles.footerLinksGrid}>
                  <div className={styles.footerLinkCol}>
                    <Link href="/mensagem-do-presidente">{language === 'pt' ? 'MENSAGEM DO PRESIDENTE' : 'PRESIDENT MESSAGE'}</Link>
                  </div>
                  <div className={styles.footerLinkCol}>
                    <Link href="/equipa">{language === 'pt' ? 'EQUIPA' : 'TEAM'}</Link>
                  </div>
                  <div className={styles.footerLinkCol}>
                    <Link href="/#missao">{language === 'pt' ? 'NOSSA MISSÃO' : 'OUR MISSION'}</Link>
                  </div>
                  <div className={styles.footerLinkCol}>
                    <Link href="/incubacao">{language === 'pt' ? 'PROGRAMAS' : 'PROGRAMS'}</Link>
                  </div>
                  <div className={styles.footerLinkCol}>
                    <Link href="/parceiros">{language === 'pt' ? 'PARCEIROS' : 'PARTNERS'}</Link>
                  </div>
                  <div className={styles.footerLinkCol}>
                    <Link href="/contacto">{language === 'pt' ? 'CONTACTO' : 'CONTACT'}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footerMiddle}>
            <div className={styles.footerContainer}>
              <div className={styles.footerBar}>
                <div className={styles.copyright}>
                  Copyright © ABN {new Date().getFullYear()} | Powered by <a href="http://isvibe.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Vibe</a>
                </div>
                <div className={styles.socials}>
                  <a href="https://www.instagram.com/abnafrobiznetwork?igsh=dTlvYndmcXA4NmVh" target="_blank" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61574066674222" target="_blank" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/abn-afrobiz-network-43967a367?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <FloatingWhatsApp />
        <ScrollToTop />
      </main>
    </>
  );
}
