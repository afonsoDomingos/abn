'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('empreendedor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao registar');
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
        <Link href="/" className={styles.backHome}>
          ← Voltar ao Site
        </Link>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Junte-se à Rede</h1>
          <p>Comece a sua jornada empresarial hoje.</p>
        </div>

        {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem', background: 'rgba(255,77,77,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,77,77,0.2)' }}>{error}</div>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Nome Completo</label>
            <input 
              type="text" 
              placeholder="Seu nome" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Tipo de Perfil</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="empreendedor">Empreendedor</option>
              <option value="startup">Startup</option>
              <option value="investidor">Investidor</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
          
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
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'A registar...' : 'Criar Conta'}
          </button>
        </form>
        
        <p className={styles.footerText}>
          Já tem uma conta? <Link href="/login" className="text-gradient-gold">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
