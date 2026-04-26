import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <Features />
      
      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={`${styles.ctaBox} glass`}>
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
          <p className={styles.copy}>© 2026 AfroBiz Network. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
