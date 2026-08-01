'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurMission from "@/components/OurMission";
import PresidentMessage from "@/components/PresidentMessage";
import HomePrograms from "@/components/HomePrograms";
import Services from "@/components/Services";
import HomeOpportunities from "@/components/HomeOpportunities";
import HomeEvents from "@/components/HomeEvents";
import Articles from "@/components/Articles";
import HomeTeam from "@/components/HomeTeam";
import Courses from "@/components/Courses";
import HomeSpecialists from "@/components/HomeSpecialists";
import Stats from "@/components/Stats";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";
import styles from "./page.module.css";
import { useLanguage } from "@/lib/LanguageContext";
import Link from 'next/link';

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <>
      <main className={styles.main}>
        <Navbar />
        <Hero />
        <OurMission />
        <PresidentMessage />
        <HomePrograms />
        <Services />
        <HomeOpportunities />
        <HomeEvents />
        <Courses />
        <HomeSpecialists />
        <Articles />
        <HomeTeam />
        <Stats />
        
        {/* Footer in style of Orange Corners */}
        <footer className={styles.footer}>
          {/* Level 1: Royal Blue Section */}
          <div className={styles.footerTop}>
            <div className={styles.footerContainer}>
              <div className={styles.footerGrid}>
                {/* Logo and Brand */}
                <div className={styles.footerBrand}>
                  <Link href="/" className={styles.footerLogo}>
                    <img src="/icon.png" alt="ABN Logo" className={styles.footerLogoImg} />
                    <div className={styles.footerLogoText}>
                      <span className={styles.footerAbn}>ABN</span>
                      <span className={styles.footerNetwork}>AfroBiz Network</span>
                    </div>
                  </Link>
                </div>
                
                {/* Vertical Links Columns */}
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
                    <Link href="/#artigos">{language === 'pt' ? 'NOVIDADES' : 'NEWS'}</Link>
                  </div>
                  <div className={styles.footerLinkCol}>
                    <Link href="/marketplace">{language === 'pt' ? 'SERVIÇOS' : 'SERVICES'}</Link>
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
          
          {/* Level 2: Dark Blue / Black copyright and social bar */}
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
                  <a href="https://youtu.be/BI1wkCFnuGY?si=zVbCkRWbCBYApRTh" target="_blank" aria-label="YouTube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                </div>
                
                <div className={styles.legal}>
                  <span>{language === 'pt' ? 'Acessibilidade' : 'Accessibility'}</span>
                  <span>|</span>
                  <span>{t.footer.terms}</span>
                  <span>|</span>
                  <span>{t.footer.privacy}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Level 3: White Partner Section */}
          <div className={styles.footerBottom}>
            <div className={styles.footerContainer}>
              <div className={styles.supportPartner}>
                <svg viewBox="0 0 40 40" width="30" height="30" className={styles.coatOfArms}>
                  <path d="M20 2 L 35 12 L 35 28 L 20 38 L 5 28 L 5 12 Z" fill="#2a4fa6" />
                  <path d="M20 8 L 28 14 L 28 26 L 20 32 L 12 26 L 12 14 Z" fill="#ffffff" />
                  <circle cx="20" cy="20" r="4" fill="#ff6b00" />
                </svg>
                <div className={styles.partnerInfo}>
                  <p className={styles.partnerHeading}>
                    {language === 'pt' ? 'Iniciativa ABN Ecosystem' : 'ABN Ecosystem Initiative'}
                  </p>
                  <p className={styles.partnerSubtext}>
                    {language === 'pt' 
                      ? 'Parceiro para o empoderamento económico e aceleração empresarial' 
                      : 'Partner for business acceleration and economic empowerment'}
                  </p>
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
