'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../login/Auth.module.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !id) {
      setStatus('error');
      setMessage('Link de recuperação inválido ou incompleto.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/recuperar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage('Senha alterada com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Ocorreu um erro ao atualizar a senha.');
      }
    } catch {
      setStatus('error');
      setMessage('Erro de conexão ao servidor.');
    }
  };

  if (!token || !id) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h3 style={{ marginBottom: '0.75rem', color: '#ff4d4d' }}>Link Inválido</h3>
        <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Este link de redefinição de senha está incompleto ou expirou.
        </p>
        <Link href="/recuperar" className="btn-primary">
          Solicitar Novo Link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className="text-gradient-gold">Definir Nova Senha</h1>
        <p>Crie uma nova senha segura para a sua conta.</p>
      </div>

      {message && (
        <div
          style={{
            color: status === 'success' ? '#2ecc71' : '#ff4d4d',
            background: status === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 77, 77, 0.1)',
            padding: '0.75rem',
            borderRadius: '8px',
            border: `1px solid ${status === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 77, 77, 0.2)'}`,
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}
        >
          {message}
        </div>
      )}

      {status !== 'success' && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Nova Palavra-passe</label>
            <input
              type="password"
              placeholder="Mínimo de 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={status === 'loading'}
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirmar Nova Palavra-passe</label>
            <input
              type="password"
              placeholder="Repita a palavra-passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={status === 'loading'}
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ width: '100%', padding: '14px' }}>
            {status === 'loading' ? 'A atualizar...' : 'Atualizar Palavra-passe'}
          </button>
        </form>
      )}
    </>
  );
}

export default function NovaSenhaPage() {
  return (
    <div className={styles.authPage}>
      <div className={`${styles.authCard} glass`}>
        <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center' }}>A carregar formulário...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
