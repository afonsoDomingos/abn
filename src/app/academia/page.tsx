import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Courses from '@/components/Courses';
import { GraduationCap, User, Briefcase } from 'lucide-react';
import styles from './page.module.css';

export default function AcademiaPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Academia ABN</h1>
          <p>Formação e capacitação para empreendedores em todos os níveis. Cursos, workshops e certificações para impulsionar o seu negócio.</p>
        </div>

        <div className={styles.content}>
          <div className={styles.hero}>
            <h2>Desenvolva as suas competências com cursos certificados</h2>
            <p>Na Academia ABN, oferecemos formação prática e especializada ministrada por mentores e especialistas com vasta experiência no mercado africano.</p>
          </div>

          <div className={styles.benefits}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><GraduationCap size={48} /></div>
              <h3>Certificação Oficial</h3>
              <p>Certificados reconhecidos que atestam as competências adquiridas nos nossos cursos.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><User size={48} /></div>
              <h3>Mentores Especialistas</h3>
              <p>Aprenda com profissionais experientes que lideram projetos reais no ecossistema.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><Briefcase size={48} /></div>
              <h3>Conteúdo Prático</h3>
              <p>Formação focada em casos reais e aplicação imediada no seu negócio.</p>
            </div>
          </div>

          <div className={styles.coursesSection}>
            <Courses />
          </div>

          <div className={styles.cta}>
            <h2>Pronto para começar a sua formação?</h2>
            <p>Inscreva-se nos nossos cursos e acelere o desenvolvimento do seu negócio.</p>
            <a href="/dashboard/formacao" className={styles.btn}>Aceder à Formação</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}