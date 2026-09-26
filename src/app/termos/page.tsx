import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function TermosPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        <div className={styles.content}>
          <h1>Termos de Uso</h1>
          
          <div className={styles.notice}>
            <p><strong>Nota:</strong> Os termos oficiais da ABN serão disponibilizados brevemente pela direção.</p>
          </div>

          <div className={styles.section}>
            <h2>1. Aceitação dos Termos</h2>
            <p>Ao aceder e utilizar a plataforma AfroBiz Network (ABN), você concorda com estes termos de uso e com a nossa política de privacidade.</p>
          </div>

          <div className={styles.section}>
            <h2>2. Uso da Plataforma</h2>
            <p>A plataforma ABN destina-se a profissionais, empreendedores, startups, investidores e instituições interessadas no ecossistema de negócios africano.</p>
          </div>

          <div className={styles.section}>
            <h2>3. Responsabilidades do Utilizador</h2>
            <p>Os utilizadores comprometem-se a fornecer informações verdadeiras e atualizadas, bem como a respeitar as normas de conduta da comunidade ABN.</p>
          </div>

          <div className={styles.section}>
            <h2>4. Propriedade Intelectual</h2>
            <p>Todo o conteúdo da plataforma ABN, incluindo textos, imagens, logótipos e design, é propriedade da Afrobiz Network ABN, SU, Lda.</p>
          </div>

          <div className={styles.section}>
            <h2>5. Limitação de Responsabilidade</h2>
            <p>A ABN não se responsabiliza por danos diretos ou indiretos resultantes do uso da plataforma.</p>
          </div>

          <div className={styles.section}>
            <h2>6. Contacto</h2>
            <p>Para questões sobre estes termos, contacte: info@abnafrobiznetwork.com</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}