import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <div className="bg-glow">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
      </div>
      
      <main className={styles.main}>
        <Navbar />
        <Hero />
        <Partners />
        
        <section className={styles.innerWrapper}>
          <Stats />
          <Features />
          <HowItWorks />
          <Testimonials />
          <FAQ />
          
          {/* Final CTA Section */}
          <section className={styles.ctaSection}>
            <div className={`${styles.ctaBox} glass`}>
              <div 
                className={styles.promoImage} 
                style={{ backgroundImage: `url('/ADS01.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
              <div className={styles.ctaContent}>
                <h2 className="text-gradient-gold">Pronto para dar o salto?</h2>
                <p>Junte-se à maior rede de empreendedores afro e transforme o seu negócio hoje mesmo.</p>
                <div className={styles.ctaActions}>
                  <button className="btn-primary">Criar Conta Gratuita</button>
                  <button className="btn-secondary">Falar com Consultor</button>
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
                <p>Impulsionando o ecossistema de empreendedorismo em África através de tecnologia e conexões estratégicas.</p>
              </div>
              
              <div className={styles.footerLinks}>
                <div className={styles.linkColumn}>
                  <h4>Explorar</h4>
                  <a href="/marketplace">Marketplace</a>
                  <a href="/incubacao">Incubação</a>
                  <a href="/dashboard">Meu Painel</a>
                </div>
                <div className={styles.linkColumn}>
                  <h4>Institucional</h4>
                  <a href="#impacto">Impacto</a>
                  <a href="#como-funciona">Como Funciona</a>
                  <a href="/registro">Juntar-se à Rede</a>
                </div>
                <div className={styles.linkColumn}>
                  <h4>Suporte</h4>
                  <a href="https://wa.me/258845773974" target="_blank">WhatsApp</a>
                  <p>admin@abn.com</p>
                  <div className={styles.socialIcons}>
                    <a href="https://instagram.com/afro44879" target="_blank">📸</a>
                    <a href="https://web.facebook.com/profile.php?id=61574066674222" target="_blank">📘</a>
                    <a href="https://www.linkedin.com/in/abn-afrobiz-network-43967a367/" target="_blank">💼</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.footerBottom}>
              <p>© {new Date().getFullYear()} ABN – AfroBiz Network. Todos os direitos reservados.</p>
              <div className={styles.legalLinks}>
                <span>Termos</span>
                <span>Privacidade</span>
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
