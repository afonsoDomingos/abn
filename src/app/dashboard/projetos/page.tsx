'use client';

import { useEffect, useState } from 'react';
import styles from '../Dashboard.module.css';

export default function ProjetosPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [incubationPhase, setIncubationPhase] = useState('Validação');

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/business');
      const data = await res.json();
      if (data.success && data.business) {
        setBusiness(data.business);
        setName(data.business.name || '');
        setCategory(data.business.category || '');
        setDescription(data.business.description || '');
        setWebsite(data.business.website || '');
        setLocation(data.business.location || '');
        setIncubationPhase(data.business.incubationPhase || 'Validação');
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Erro ao carregar dados do projeto.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          description,
          website,
          location,
          incubationPhase
        })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setEditing(false);
        setMsg({ type: 'success', text: 'Projeto atualizado com sucesso!' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao salvar projeto.' });
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar o seu projeto...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Gestão de Projetos</h1>
        <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Acompanhe e edite as informações da sua startup no ecossistema ABN.</p>
      </header>

      {msg.text && (
        <div style={{
          color: msg.type === 'success' ? '#2ecc71' : '#ff4d4d',
          background: msg.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 77, 77, 0.1)',
          padding: '1rem',
          borderRadius: '12px',
          border: `1px solid ${msg.type === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 77, 77, 0.2)'}`,
          marginBottom: '2rem'
        }}>
          {msg.text}
        </div>
      )}

      {editing ? (
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Nome da Startup *</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Setor / Categoria *</label>
                <input 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  required 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Localização</label>
                <input 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Website (URL)</label>
                <input 
                  value={website} 
                  onChange={e => setWebsite(e.target.value)} 
                  placeholder="https://"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Fase de Incubação</label>
              <select 
                value={incubationPhase} 
                onChange={e => setIncubationPhase(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff' }}
              >
                <option value="Ideação">Ideação</option>
                <option value="Validação">Validação</option>
                <option value="Crescimento">Crescimento</option>
                <option value="Escala">Escala</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Descrição da Ideia</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={5}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'A guardar...' : 'Guardar Projeto'}
              </button>
              <button type="button" className="btn-outline" onClick={() => setEditing(false)} style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#fff', fontSize: '1.6rem', fontFamily: 'Outfit' }}>{business?.name}</h2>
            <button className="btn-primary" onClick={() => setEditing(true)}>
              ✏️ Editar Projeto
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Setor / Categoria</h4>
              <p style={{ color: '#fff', fontSize: '1.05rem' }}>{business?.category}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Fase de Incubação</h4>
              <span style={{ display: 'inline-block', background: 'rgba(255,107,0,0.15)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '40px', fontSize: '0.85rem', fontWeight: 700 }}>
                🚀 {business?.incubationPhase}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Localização</h4>
              <p style={{ color: '#fff' }}>📍 {business?.location || 'Não informada'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Website</h4>
              <p style={{ color: '#fff' }}>
                {business?.website ? (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                    🔗 {business.website}
                  </a>
                ) : (
                  'Não informado'
                )}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
            <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>Descrição da Startup</h4>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{business?.description || 'Adicione uma breve descrição para apresentar a sua startup a potenciais parceiros e mentores.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
