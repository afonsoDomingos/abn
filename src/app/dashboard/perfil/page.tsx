'use client';

import { useEffect, useState } from 'react';
import styles from './Perfil.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setName(u.name);
      setEmail(u.email);
    }
    setLoading(false);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name,
          email,
          password: password || undefined
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setPassword('');
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao atualizar perfil.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>A carregar...</div>;
  if (!user) return <div className={styles.error}>Acesso negado. Por favor, faça login.</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-gradient-gold">O Meu Perfil</h1>
        <p>Gira as tuas informações pessoais e credenciais de acesso.</p>
      </header>

      <div className={styles.container}>
        <div className={`glass ${styles.card}`}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.info}>
              <h3>{name}</h3>
              <span className={styles.roleBadge}>{user.role}</span>
            </div>
          </div>

          {msg.text && (
            <div className={`${styles.alert} ${styles[msg.type]}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Nome Completo</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Nova Senha (deixe em branco para manter a atual)</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
