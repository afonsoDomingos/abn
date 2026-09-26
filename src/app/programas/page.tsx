import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function ProgramasPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Programas ABN</h1>
          <p>Programas de incubação, aceleração e capacitação para empreendedores africanos.</p>
        </div>

        <div className={styles.programsGrid}>
          <div className={styles.programCard}>
            <div className={styles.programIcon}>🚀</div>
            <h2>ABN Startup 180</h2>
            <p>Programa de incubação intensiva de 180 dias para startups em fase inicial.</p>
            <a href="/programas/startup-180" className={styles.btn}>Saber mais</a>
          </div>

          <div className={styles.programCard}>
            <div className={styles.programIcon}>🤝</div>
            <h2>Clube dos Empreendedores</h2>
            <p>Comunidade exclusiva para networking, mentoria e oportunidades de negócios.</p>
            <a href="/programas/clube-empreendedores" className={styles.btn}>Saber mais</a>
          </div>

          <div className={styles.programCard}>
            <div className={styles.programIcon}>🏢</div>
            <h2>Clubes das Startups (Moçambique)</h2>
            <p>Hubs locais de apoio a startups em Maputo e outras cidades moçambicanas.</p>
            <a href="/programas/clubes-startups-mocambique" className={styles.btn}>Saber mais</a>
          </div>

          <div className={styles.programCard}>
            <div className={styles.programIcon}>🏢</div>
            <h2>Clubes das Startups (Angola)</h2>
            <p>Hubs locais de apoio a startups em Luanda e outras cidades angolanas.</p>
            <a href="/programas/clubes-startups-angola" className={styles.btn}>Saber mais</a>
          </div>

          <div className={styles.programCard}>
            <div className={styles.programIcon}>🧠</div>
            <h2>Mentalidade Empreendedora</h2>
            <p>Formação em mindset e soft skills para empreendedores em crescimento.</p>
            <a href="/programas/mentalidade-empreendedora" className={styles.btn}>Saber mais</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}