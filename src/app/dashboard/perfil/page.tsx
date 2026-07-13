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
  const [profileImage, setProfileImage] = useState('');
  const [uploading, setUploading] = useState(false);
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
      setProfileImage(u.profileImage || '');
    }
    setLoading(false);
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMsg({ type: '', text: '' });
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProfileImage(data.url);
        setMsg({ type: 'success', text: 'Foto de perfil carregada com sucesso! Clique em Guardar Alterações para salvar.' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao carregar imagem.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de ligação ao carregar ficheiro.' });
    } finally {
      setUploading(false);
    }
  };

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
          profileImage,
          password: password || undefined
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setPassword('');
        // Force header update by reloading layout or trigger state (a simple window refresh is fine or let the state sync it)
        window.location.reload();
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
          <div className={styles.avatarSection} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                className={styles.avatar}
                style={profileImage ? { backgroundImage: `url('${profileImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}
              >
                {!profileImage && name.charAt(0).toUpperCase()}
              </div>
              <label style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>
                {uploading ? 'A enviar...' : 'Alterar Foto'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
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
