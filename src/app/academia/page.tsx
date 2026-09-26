import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
          <div className={styles.notice}>
            <p><strong>Nota:</strong> Os cursos e formações da Academia ABN serão disponibilizados brevemente pela direção.</p>
          </div>

          <div className={styles.section}>
            <h2>Cursos Disponíveis</h2>
            <p>Em breve, teremos uma gama completa de cursos presenciais e online cobrindo:</p>
            <ul>
              <li>Gestão Financeira para PMEs</li>
              <li>Marketing Digital para Empreendedores</li>
              <li>Liderança e Gestão de Equipas</li>
              <li>Planeamento Estratégico</li>
              <li>Vendas e Negociação</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Certificações</h2>
            <p>Ao completar os cursos da Academia ABN, os participantes recebem certificados oficiais que atestam as competências adquiridas.</p>
          </div>

          <div className={styles.cta}>
            <a href="/contacto" className={styles.btn}>Saber mais sobre cursos</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}