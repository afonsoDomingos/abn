'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
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
        localStorage.setItem('user', JSON.stringify(data.user));
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
      <div className={styles.authCard}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
          <Link href="/" className={styles.backHome}>
            <ArrowLeft size={16} /> Voltar ao Site
          </Link>
        </div>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Bem-vindo de Volta</h1>
          <p>Entre na sua conta ABN para continuar.</p>
        </div>
        
        {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem', background: 'rgba(255,77,77,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,77,77,0.2)' }}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <div className={styles.inputWrapper}>
              <input 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <Mail className={styles.inputIcon} size={18} />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Palavra-passe</label>
            <div className={styles.inputWrapper}>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <Lock className={styles.inputIcon} size={18} />
            </div>
          </div>
          
          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" /> Lembrar-me
            </label>
            <Link href="/recuperar" className={styles.forgot}>Esqueceu a senha?</Link>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '14px', width: '100%' }}>
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
