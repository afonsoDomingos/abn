import Link from 'next/link';
import styles from '../login/Auth.module.css';

export default function RecuperarPage() {
  return (
    <div className={styles.authPage}>
      <div className={`${styles.authCard} glass`}>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Recuperar Senha</h1>
          <p>Introduza o seu email para receber as instruções de recuperação.</p>
        </div>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="seu@email.com" required />
          </div>
          
          <button type="submit" className="btn-primary">Enviar Link</button>
        </form>
        
        <p className={styles.footerText}>
          Lembrou-se da senha? <Link href="/login" className="text-gradient-gold">Voltar ao login</Link>
        </p>
      </div>
    </div>
  );
}
