'use client';

import { useEffect, useState } from 'react';
import styles from '../Dashboard.module.css';

interface InvestmentProject {
  _id: string;
  business: {
    name: string;
    category: string;
    description: string;
    location: string;
    website?: string;
    owner?: {
      name: string;
      email: string;
    };
  };
  fundingGoal: string;
  equityOffered: number;
  status: 'Aberto' | 'Fechado';
  createdAt: string;
}

export default function InvestimentosPage() {
  const [projects, setProjects] = useState<InvestmentProject[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<InvestmentProject | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/investments');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error('Error fetching investment projects:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject._id,
          inquiryMessage: message
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Manifestação de interesse enviada com sucesso! O fundador e a ABN foram notificados.' });
        setMessage('');
        setShowModal(false);
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao registar interesse.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar projetos de investimento...</div>;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Portal do Investidor</h1>
        <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Explore as startups incubadas no ABN Hub prontas para captação de financiamento e crescimento.</p>
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

      {projects.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
          De momento não existem startups listadas para captação de investimento.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.8rem' }}>
          {projects.map(proj => (
            <div key={proj._id} className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{proj.business?.category}</span>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '4px 0 0 0', fontFamily: 'Outfit' }}>{proj.business?.name}</h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px', background: 'rgba(46,204,113,0.15)', color: '#2ecc71' }}>
                  {proj.status}
                </span>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, height: '70px', overflow: 'hidden' }}>
                {proj.business?.description}
              </p>

              {/* Financial stats summary card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Valor Procurado</span>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', marginTop: '2px' }}>{proj.fundingGoal}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Equity Disponível</span>
                  <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.05rem', marginTop: '2px' }}>{proj.equityOffered}%</div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div>📍 Localização: <span style={{ color: '#fff' }}>{proj.business?.location}</span></div>
                {proj.business?.website && (
                  <div>🌐 Website: <a href={proj.business.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{proj.business.website}</a></div>
                )}
                {proj.business?.owner && (
                  <div>👤 Fundador: <span style={{ color: '#fff' }}>{proj.business.owner.name}</span></div>
                )}
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', padding: '10px 0', fontSize: '0.85rem', marginTop: 'auto' }}
                onClick={() => {
                  setSelectedProject(proj);
                  setShowModal(true);
                }}
              >
                🤝 Quero Investir
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Modal */}
      {showModal && selectedProject && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass" style={{ maxWidth: '500px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', fontSize: '1.5rem', cursor: 'pointer' }}
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '0.2rem' }}>Registar Interesse de Investimento</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Startup: {selectedProject.business?.name}</p>

            <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Mensagem para o Fundador *</label>
                <textarea 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  required 
                  rows={5}
                  placeholder="Escreva a sua mensagem, intenção de investimento ou pedido de reunião..."
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: '0.5rem' }}>
                {submitting ? 'A registar...' : 'Enviar Manifestação de Interesse'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
