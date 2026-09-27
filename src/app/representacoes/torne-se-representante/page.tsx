import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function TorneSeRepresentantePage() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Torne-se Representante</h1>
          <p>Interessado em trazer a ABN para o seu país? Preencha o formulário abaixo e entraremos em contacto.</p>
        </div>

        <div className={styles.content}>
          <form className={styles.form}>
            <div className={styles.formSection}>
              <h2>Informação Pessoal</h2>
              
              <div className={styles.field}>
                <label htmlFor="nome">Nome Completo *</label>
                <input 
                  type="text" 
                  id="nome" 
                  name="nome" 
                  required 
                  placeholder="Seu nome completo"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="seu@email.com"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="telefone">Telefone *</label>
                <input 
                  type="tel" 
                  id="telefone" 
                  name="telefone" 
                  required 
                  placeholder="+258 84 000 0000"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="pais">País de Interesse *</label>
                <select id="pais" name="pais" required>
                  <option value="">Selecione o país</option>
                  <option value="Mocambique">Moçambique</option>
                  <option value="Angola">Angola</option>
                  <option value="Guine-Bissau">Guiné-Bissau</option>
                  <option value="Sao-Tome">São Tomé e Príncipe</option>
                  <option value="Cabo-Verde">Cabo Verde</option>
                  <option value="outro">Outro país (especifique abaixo)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="outroPais">Outro País</label>
                <input 
                  type="text" 
                  id="outroPais" 
                  name="outroPais" 
                  placeholder="Nome do país"
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2>Experiência Profissional</h2>
              
              <div className={styles.field}>
                <label htmlFor="profissao">Profissão / Cargo Atual *</label>
                <input 
                  type="text" 
                  id="profissao" 
                  name="profissao" 
                  required 
                  placeholder="Sua profissão ou cargo atual"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="experiencia">Experiência em Ecossistemas de Empreendedorismo *</label>
                <textarea 
                  id="experiencia" 
                  name="experiencia" 
                  required 
                  rows={4}
                  placeholder="Descreva sua experiência com ecossistemas de empreendedorismo, incubadoras, aceleradoras, etc."
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="motivacao">Motivação para ser Representante *</label>
                <textarea 
                  id="motivacao" 
                  name="motivacao" 
                  required 
                  rows={4}
                  placeholder="Por que deseja ser representante da ABN no seu país?"
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2>Recursos Disponíveis</h2>
              
              <div className={styles.field}>
                <label htmlFor="rede">Rede de Contactos Locais</label>
                <textarea 
                  id="rede" 
                  name="rede" 
                  rows={3}
                  placeholder="Descreva sua rede de contactos com empreendedores, investidores, instituições, etc."
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="estrutura">Estrutura Física Disponível</label>
                <textarea 
                  id="estrutura" 
                  name="estrutura" 
                  rows={3}
                  placeholder="Possui ou tem acesso a espaços físicos, escritórios, hubs, etc.?"
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.checkboxField}>
                <input 
                  type="checkbox" 
                  id="consentimento" 
                  name="consentimento" 
                  required
                />
                <label htmlFor="consentimento">
                  Concordo em receber comunicações da ABN — incluindo newsletters, oportunidades de negócios, eventos e informações relevantes do ecossistema AfroBiz Network.
                </label>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.btnSubmit}>Enviar Candidatura</button>
              <button type="button" className={styles.btnCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}