'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PresidentMessage from '@/components/PresidentMessage';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './page.module.css';

export default function MensagemDoPresidentePage() {
  const { t, language } = useLanguage();
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [shopEnabled, setShopEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.mensagem_presidente) {
          setBannerUrl(data.configs.page_banners.mensagem_presidente);
        }
        if (data.configs?.shop_enabled !== undefined) {
          setShopEnabled(data.configs.shop_enabled);
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

        <Footer shopEnabled={shopEnabled} />

        <FloatingWhatsApp />
        <ScrollToTop />
      </main>
    </>
  );
}
