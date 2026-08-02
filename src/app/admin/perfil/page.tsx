'use client';

import { useState, useEffect } from 'react';
import styles from '../configuracoes/Config.module.css';

export default function ProfilePage() {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    profileImage: '',
    phone: '',
    company: '',
    sector: '',
    linkedin: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(prev => ({
          ...prev,
          id: parsed.id || parsed._id || prev.id,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          profileImage: parsed.profileImage || parsed.avatar || prev.profileImage,
          phone: parsed.phone || prev.phone,
          company: parsed.company || prev.company,
          sector: parsed.sector || prev.sector,
          linkedin: parsed.linkedin || prev.linkedin,
          bio: parsed.bio || prev.bio
        }));
      } catch (e) {}
    }

    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const u = data.user;
          setUser(prev => ({
            ...prev,
            id: u._id || u.id || prev.id,
            name: u.name || prev.name,
            email: u.email || prev.email,
            profileImage: u.profileImage || prev.profileImage || '',
            phone: u.phone || prev.phone,
            company: u.company || prev.company,
            sector: u.sector || prev.sector,
            linkedin: u.linkedin || prev.linkedin,
            bio: u.bio || prev.bio
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        const newImg = data.url;
        setUser(prev => ({ ...prev, profileImage: newImg }));
        
        // Auto-save new profile image to database profile immediately
        const saveRes = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: newImg,
            phone: user.phone,
            company: user.company,
            sector: user.sector,
            linkedin: user.linkedin,
            bio: user.bio
          }),
        });

        const saveData = await saveRes.json();
        if (saveData.success) {
          const storedUser = localStorage.getItem('user');
          const parsedUser = storedUser ? JSON.parse(storedUser) : {};
          const updatedUser = { ...parsedUser, ...saveData.user, profileImage: newImg };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Trigger header update event instantly
          window.dispatchEvent(new Event('user-profile-updated'));
          setMsg({ type: 'success', text: '✅ Foto de perfil atualizada com sucesso!' });
        } else {
          setMsg({ type: 'success', text: 'Foto enviada! Clique em Salvar Alterações para guardar.' });
        }
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao carregar imagem.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Erro de ligação ao enviar imagem.' });
    } finally {
      setUploading(false);
    }
  };

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
          phone: user.phone,
          company: user.company,
          sector: user.sector,
          linkedin: user.linkedin,
          bio: user.bio,
          password: user.password || undefined
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMsg({ type: 'success', text: '✅ Perfil atualizado com sucesso!' });
        const updatedUser = { ...data.user, profileImage: user.profileImage || data.user.profileImage };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('user-profile-updated'));
        setTimeout(() => setMsg({ type: '', text: '' }), 4000);
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
        <p>Atualize suas informações pessoais, profissionais e credenciais de acesso.</p>
      </header>

      {msg.text && (
        <div className={`${styles.toast} ${msg.type === 'error' ? styles.errorToast : ''}`}>
          {msg.text}
        </div>
      )}

      <div className={styles.grid}>
        <section className={`glass ${styles.section}`} style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#0f172a' }}>Informações Pessoais</h3>
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.field}>
              <label style={{ fontWeight: 800, color: '#0f172a' }}>Foto de Perfil</label>
              <label 
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  alignItems: 'center', 
                  background: '#f8fafc', 
                  padding: '1.2rem', 
                  borderRadius: '16px', 
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
              >
                <div 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    backgroundImage: `url(${user.profileImage || '/perfil09.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '3px solid var(--primary, #ff6b00)',
                    flexShrink: 0,
                    position: 'relative',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem' }}>
                    📷
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <span style={{ fontSize: '0.92rem', color: 'var(--primary, #ff6b00)', fontWeight: 800 }}>
                    {uploading ? '⏳ A carregar imagem...' : '📷 Clique aqui para Escolher Nova Foto'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                    Selecione qualquer imagem do seu computador ou telemóvel (PNG, JPG ou WEBP).
                  </span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              </label>
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569', fontWeight: 700 }}>Nome Completo</label>
              <input 
                type="text" 
                value={user.name} 
                onChange={e => setUser({...user, name: e.target.value})}
                required
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
              />
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569', fontWeight: 700 }}>Email</label>
              <input 
                type="email" 
                value={user.email} 
                onChange={e => setUser({...user, email: e.target.value})}
                required
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
              />
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569', fontWeight: 700 }}>Telefone / WhatsApp</label>
              <input 
                type="text" 
                value={user.phone} 
                onChange={e => setUser({...user, phone: e.target.value})}
                placeholder="+258 84 000 0000"
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
              />
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569', fontWeight: 700 }}>Empresa / Organização</label>
              <input 
                type="text" 
                value={user.company} 
                onChange={e => setUser({...user, company: e.target.value})}
                placeholder="Nome da empresa ou projeto"
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
              />
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569', fontWeight: 700 }}>Perfil do LinkedIn (URL)</label>
              <input 
                type="url" 
                value={user.linkedin} 
                onChange={e => setUser({...user, linkedin: e.target.value})}
                placeholder="https://linkedin.com/in/seu-perfil"
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
              />
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569', fontWeight: 700 }}>Biografia / Resumo Profissional</label>
              <textarea 
                rows={4}
                value={user.bio} 
                onChange={e => setUser({...user, bio: e.target.value})}
                placeholder="Breve resumo da sua trajetória profissional..."
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.75rem', borderRadius: '10px' }}
              />
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />
            
            <h3 style={{ color: '#0f172a' }}>Alterar Senha de Acesso</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Deixe em branco para manter a sua senha atual.</p>

            <div className={styles.field}>
              <label style={{ color: '#475569', fontWeight: 700 }}>Nova Senha</label>
              <input 
                type="password" 
                value={user.password} 
                onChange={e => setUser({...user, password: e.target.value})}
                placeholder="Mínimo 6 caracteres"
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
              />
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569', fontWeight: 700 }}>Confirmar Nova Senha</label>
              <input 
                type="password" 
                value={user.confirmPassword} 
                onChange={e => setUser({...user, confirmPassword: e.target.value})}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '1rem', padding: '0.8rem 2rem', borderRadius: '10px' }}>
              {saving ? 'A guardar...' : '💾 Salvar Alterações'}
            </button>
          </form>
        </section>

        <section className={`glass ${styles.section}`} style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#0f172a' }}>Dicas de Segurança</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#475569', fontSize: '0.9rem' }}>
            <li>• Use uma senha forte com combinação de letras, números e símbolos.</li>
            <li>• Não compartilhe as suas credenciais de acesso com terceiros.</li>
            <li>• Mantenha o seu e-mail e telefone de contacto sempre atualizados.</li>
            <li>• Atualize a sua foto de perfil para facilitar a identificação pela equipa.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
