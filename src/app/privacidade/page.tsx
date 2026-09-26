import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function PrivacidadePage() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        <div className={styles.content}>
          <h1>Política de Privacidade</h1>
          
          <div className={styles.notice}>
            <p><strong>Nota:</strong> A política de privacidade oficial da ABN será disponibilizada brevemente pela direção.</p>
          </div>

          <div className={styles.section}>
            <h2>1. Recolha de Dados</h2>
            <p>A ABN recolhe informações pessoais fornecidas voluntariamente pelos utilizadores durante o registo e utilização da plataforma.</p>
          </div>

          <div className={styles.section}>
            <h2>2. Utilização de Dados</h2>
            <p>Os dados são utilizados para fornecer serviços personalizados, melhorar a plataforma e comunicar informações relevantes do ecossistema ABN.</p>
          </div>

          <div className={styles.section}>
            <h2>3. Partilha de Dados</h2>
            <p>A ABN não partilha dados pessoais com terceiros sem consentimento explícito, exceto quando exigido por lei.</p>
          </div>

          <div className={styles.section}>
            <h2>4. Segurança</h2>
            <p>Implementamos medidas de segurança adequadas para proteger as informações dos utilizadores contra acesso não autorizado.</p>
          </div>

          <div className={styles.section}>
            <h2>5. Cookies</h2>
            <p>A plataforma utiliza cookies para melhorar a experiência do utilizador. Pode gerir as preferências de cookies através do banner de consentimento.</p>
          </div>

          <div className={styles.section}>
            <h2>6. Direitos do Utilizador</h2>
            <p>Os utilizadores têm direito a aceder, corrigir ou eliminar os seus dados pessoais. Para exercer estes direitos, contacte-nos.</p>
          </div>

          <div className={styles.section}>
            <h2>7. Contacto</h2>
            <p>Para questões sobre privacidade, contacte: info@abnafrobiznetwork.com</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}