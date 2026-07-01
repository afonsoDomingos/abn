'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../login/Auth.module.css';

export default function RecuperarPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Ocorreu um erro. Tente novamente.');
      }
    } catch {
      setStatus('error');
      setMessage('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={`${styles.authCard} glass`}>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Recuperar Senha</h1>
          <p>Introduza o seu email para receber as instruções de recuperação.</p>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>Email Enviado!</h3>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {message}
            </p>
            <Link href="/login" className="btn-primary" style={{ display: 'inline-block' }}>
              Voltar ao Login
            </Link>
          </div>
        ) : (
          <>
            {status === 'error' && (
              <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {message}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'A enviar...' : 'Enviar Link de Recuperação'}
              </button>
            </form>

            <p className={styles.footerText}>
              Lembrou-se da senha?{' '}
              <Link href="/login" className="text-gradient-gold">Voltar ao login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
