import Link from 'next/link';
import styles from './Auth.module.css';

export default function LoginPage() {
  return (
    <div className={styles.authPage}>
      <div className={`${styles.authCard} glass`}>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Bem-vindo de Volta</h1>
          <p>Entre na sua conta ABN para continuar.</p>
        </div>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="seu@email.com" required />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Palavra-passe</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          
          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" /> Lembrar-me
            </label>
            <Link href="/recuperar" className={styles.forgot}>Esqueceu a senha?</Link>
          </div>
          
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
        
        <p className={styles.footerText}>
          Não tem uma conta? <Link href="/registro" className="text-gradient-gold">Registe-se aqui</Link>
        </p>
      </div>
    </div>
  );
}
