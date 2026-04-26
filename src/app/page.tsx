import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      
      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={`${styles.ctaBox} glass`}>
          <div 
            className={styles.promoImage} 
            style={{ backgroundImage: `url('/ADS01.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          ></div>
          <h2>Pronto para transformar o seu negócio?</h2>
          <p>Junte-se à maior rede de empreendedores afro-descendentes e tenha acesso a recursos exclusivos.</p>
          <button className="btn-primary">Criar Conta Gratuita</button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3>ABN</h3>
            <p>AfroBiz Network</p>
          </div>
          
          <div className={styles.socials}>
            <a href="https://instagram.com/afro44879" target="_blank">Instagram</a>
            <a href="https://www.linkedin.com/in/abn-afrobiz-network-43967a367/" target="_blank">LinkedIn</a>
            <a href="https://web.facebook.com/profile.php?id=61574066674222" target="_blank">Facebook</a>
            <a href="https://wa.me/258845773974" target="_blank">WhatsApp</a>
          </div>

          <p className={styles.copy}>© 2026 AfroBiz Network. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
