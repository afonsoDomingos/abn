import Link from 'next/link';
import styles from './Auth.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.authPage}>
      <div className={`${styles.authCard} glass`}>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Junte-se à Rede</h1>
          <p>Comece a sua jornada empresarial hoje.</p>
        </div>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Nome Completo</label>
            <input type="text" placeholder="Seu nome" required />
          </div>

          <div className={styles.inputGroup}>
            <label>Tipo de Perfil</label>
            <select required>
              <option value="empreendedor">Empreendedor</option>
              <option value="startup">Startup</option>
              <option value="investidor">Investidor</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="seu@email.com" required />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Palavra-passe</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          
          <button type="submit" className="btn-primary">Criar Conta</button>
        </form>
        
        <p className={styles.footerText}>
          Já tem uma conta? <Link href="/login" className="text-gradient-gold">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
