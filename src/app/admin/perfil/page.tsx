'use client';

import { useState, useEffect } from 'react';
import styles from '../configuracoes/Config.module.css'; // Reusing styles

export default function ProfilePage() {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    profileImage: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    // Get user from localStorage (mocking session)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(prev => ({
        ...prev,
        id: parsed.id || parsed._id,
        name: parsed.name,
        email: parsed.email,
        profileImage: parsed.profileImage || '/perfil09.jpg'
      }));
    }
    setLoading(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.password && user.password !== user.confirmPassword) {
      setMsg({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          password: user.password || undefined
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMsg({ type: 'success', text: '✅ Perfil atualizado com sucesso!' });
        // Update local storage
        localStorage.setItem('user', JSON.stringify({ ...data.user, profileImage: user.profileImage }));
        setTimeout(() => setMsg({ type: '', text: '' }), 3000);
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao atualizar perfil.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de conexão.' });
    }
    setSaving(false);
  };

  if (loading) return <div className={styles.loading}><div className={styles.spinner}></div></div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-gradient-gold">Editar Meu Perfil</h1>
        <p>Atualize suas informações pessoais e credenciais de acesso.</p>
      </header>

      {msg.text && (
        <div className={`${styles.toast} ${msg.type === 'error' ? styles.errorToast : ''}`}>
          {msg.text}
        </div>
      )}

      <div className={styles.grid}>
        <section className={`glass ${styles.section}`}>
          <h3>Informações Pessoais</h3>
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.field}>
              <label>Avatar (URL da Imagem)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className={styles.avatarPreview} style={{ width: '60px', height: '60px' }}>
                  <img src={user.profileImage || '/perfil09.jpg'} alt="Avatar" />
                </div>
                <input 
                  type="text" 
                  value={user.profileImage} 
                  onChange={e => setUser({...user, profileImage: e.target.value})}
                  placeholder="URL da imagem..."
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Nome Completo</label>
              <input 
                type="text" 
                value={user.name} 
                onChange={e => setUser({...user, name: e.target.value})}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input 
                type="email" 
                value={user.email} 
                onChange={e => setUser({...user, email: e.target.value})}
                required
              />
            </div>

            <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }} />
            
            <h3>Alterar Senha</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1rem' }}>Deixe em branco para manter a senha atual.</p>

            <div className={styles.field}>
              <label>Nova Senha</label>
              <input 
                type="password" 
                value={user.password} 
                onChange={e => setUser({...user, password: e.target.value})}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className={styles.field}>
              <label>Confirmar Nova Senha</label>
              <input 
                type="password" 
                value={user.confirmPassword} 
                onChange={e => setUser({...user, confirmPassword: e.target.value})}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '1rem' }}>
              {saving ? 'Guardando...' : 'Salvar Alterações'}
            </button>
          </form>
        </section>

        <section className={`glass ${styles.section}`}>
          <h3>Dicas de Segurança</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
            <li>• Use uma senha forte com letras, números e símbolos.</li>
            <li>• Não compartilhe suas credenciais de acesso com ninguém.</li>
            <li>• Mantenha seu email de contato sempre atualizado.</li>
            <li>• Verifique se o URL do avatar é de uma fonte segura (HTTPS).</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
