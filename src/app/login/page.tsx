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
        const role = (data.user.role || '').toLowerCase();
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'collaborator' || role === 'colaborador') {
          router.push('/colaborador');
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
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.25rem' }}>
          <Link href="/" className={styles.backHome}>
            <ArrowLeft size={16} /> Voltar ao Site
          </Link>
        </div>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Bem-vindo de Volta</h1>
          <p>Entre na sua conta ABN para continuar.</p>
        </div>
        
        {error && (
          <div style={{ color: '#dc2626', marginBottom: '1.25rem', fontSize: '0.88rem', background: '#fef2f2', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #fecaca', fontWeight: 600 }}>
            {error}
          </div>
        )}

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
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '14px', width: '100%', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
