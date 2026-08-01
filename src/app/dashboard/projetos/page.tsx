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

  if (loading) return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar o seu projeto...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Gestão de Projetos</h1>
        <p style={{ opacity: 0.9, color: '#475569', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5, marginTop: '0.4rem' }}>
          Acompanhe e edite as informações da sua startup no ecossistema ABN.
        </p>
      </header>

      {msg.text && (
        <div style={{
          color: msg.type === 'success' ? '#15803d' : '#b91c1c',
          background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
          padding: '1rem',
          borderRadius: '12px',
          border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          marginBottom: '2rem',
          fontWeight: 600
        }}>
          {msg.text}
        </div>
      )}

      {editing ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', padding: '2.5rem', borderRadius: '24px' }}>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Nome da Startup *</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Setor / Categoria *</label>
                <input 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  required 
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Localização</label>
                <input 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Website (URL)</label>
                <input 
                  value={website} 
                  onChange={e => setWebsite(e.target.value)} 
                  placeholder="https://"
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Fase de Incubação / Desenvolvimento</label>
              <select 
                value={incubationPhase} 
                onChange={e => setIncubationPhase(e.target.value)}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', color: '#0f172a' }}
              >
                <option value="Ideação">Ideação (Conceito)</option>
                <option value="Validação">Validação (Estudo de Mercado)</option>
                <option value="Mínimo Produto Viável (MVP)">Mínimo Produto Viável (MVP)</option>
                <option value="Tração & Escala">Tração & Escala (Vendas Ativas)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Descrição da Startup</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={5}
                placeholder="Descreva o propósito, produto e mercado da sua startup..."
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', color: '#0f172a', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn-outline" onClick={() => setEditing(false)} style={{ borderColor: '#cbd5e1', color: '#475569' }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#0f172a', fontSize: '1.6rem', fontFamily: 'Outfit', fontWeight: 800 }}>{business?.name}</h2>
            <button className="btn-primary" onClick={() => setEditing(true)} style={{ borderRadius: '10px' }}>
              ✏️ Editar Projeto
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 800 }}>Setor / Categoria</h4>
              <p style={{ color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>{business?.category}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 800 }}>Fase de Incubação</h4>
              <span style={{ display: 'inline-block', background: '#fff7ed', border: '1px solid #ffedd5', color: '#c2410c', padding: '4px 14px', borderRadius: '40px', fontSize: '0.85rem', fontWeight: 800 }}>
                🚀 {business?.incubationPhase}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 800 }}>Localização</h4>
              <p style={{ color: '#0f172a', fontWeight: 600 }}>📍 {business?.location || 'Não informada'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 800 }}>Website</h4>
              <p style={{ color: '#0f172a', fontWeight: 600 }}>
                {business?.website ? (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 700 }}>
                    🔗 {business.website}
                  </a>
                ) : (
                  'Não informado'
                )}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
            <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.8rem', fontWeight: 800 }}>Descrição da Startup</h4>
            <p style={{ color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>{business?.description || 'Adicione uma breve descrição para apresentar a sua startup a potenciais parceiros e mentores.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
