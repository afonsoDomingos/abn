'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Erro ao entrar');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={`${styles.authCard} glass`}>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Bem-vindo de Volta</h1>
          <p>Entre na sua conta ABN para continuar.</p>
        </div>
        
        {error && <div style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Palavra-passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" /> Lembrar-me
            </label>
            <Link href="/recuperar" className={styles.forgot}>Esqueceu a senha?</Link>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
        
        <p className={styles.footerText}>
          Não tem uma conta? <Link href="/registro" className="text-gradient-gold">Registe-se aqui</Link>
        </p>
      </div>
    </div>
  );
}
