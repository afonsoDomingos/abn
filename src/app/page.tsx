'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Services from "@/components/Services";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";
import styles from "./page.module.css";
import { useLanguage } from "@/lib/LanguageContext";

import { Reveal } from "@/components/Reveal";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <>
      <div className="bg-glow">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
      </div>
      
      <main className={styles.main}>
        <Navbar />
        <Hero />
        
        <Reveal>
          <Partners />
        </Reveal>

        <Reveal>
          <Services />
        </Reveal>
        
        <section className={styles.innerWrapper}>
          <Stats />
          
          <Reveal>
            <Features />
          </Reveal>

          <Reveal>
            <HowItWorks />
          </Reveal>

          <Reveal>
            <Testimonials />
          </Reveal>

          <Reveal>
            <FAQ />
          </Reveal>
          
          {/* Final CTA Section */}
          <section className={styles.ctaSection}>
            <div className={`${styles.ctaBox} glass`}>
              <div 
                className={styles.promoImage} 
                style={{ backgroundImage: `url('/ADS01.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
              <div className={styles.ctaContent}>
                <h2 className="text-gradient-gold">{t.cta.title}</h2>
                <p>{t.cta.desc}</p>
                <div className={styles.ctaActions}>
                  <button className="btn-primary">{t.cta.create}</button>
                  <button className="btn-secondary">{t.cta.consult}</button>
                </div>
              </div>
            </div>
          </section>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerGrid}>
              <div className={styles.footerBrand}>
                <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '60px', marginBottom: '1.25rem' }} />
                <p>{t.footer.brandDesc}</p>
              </div>
              
              <div className={styles.footerLinks}>
                <div className={styles.linkColumn}>
                  <h4>{t.footer.explore}</h4>
                  <a href="/marketplace">{t.nav.marketplace}</a>
                  <a href="/incubacao">{t.nav.incubator}</a>
                  <a href="/admin">{t.footer.dashboard || (language === 'pt' ? 'Meu Painel' : 'My Dashboard')}</a>
                </div>
                <div className={styles.linkColumn}>
                  <h4>{t.footer.institutional}</h4>
                  <a href="#impacto">{t.nav.impact}</a>
                  <a href="#como-funciona">{t.howItWorks.title}</a>
                  <a href="/registro">{t.nav.join}</a>
                </div>
                <div className={styles.linkColumn}>
                  <h4>{t.footer.support}</h4>
                  <a href="https://wa.me/258845773974" target="_blank">WhatsApp</a>
                  <p>admin@abn.com</p>
                  <div className={styles.socialIcons}>
                    <a href="https://instagram.com/afro44879" target="_blank" aria-label="Instagram">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://web.facebook.com/profile.php?id=61574066674222" target="_blank" aria-label="Facebook">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/abn-afrobiz-network-43967a367/" target="_blank" aria-label="LinkedIn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.footerBottom}>
              <p>© {new Date().getFullYear()} ABN – AfroBiz Network. {t.footer.rights}</p>
              <div className={styles.legalLinks}>
                <span>{t.footer.terms}</span>
                <span>{t.footer.privacy}</span>
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
