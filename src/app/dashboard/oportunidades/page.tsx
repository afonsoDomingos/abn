'use client';

import { useEffect, useState } from 'react';
import styles from '../Dashboard.module.css';

interface Opportunity {
  _id: string;
  title: string;
  amount: string;
  deadline: string;
  category: 'Fundo' | 'Concurso' | 'Bolsa' | 'Aceleração';
  description: string;
  applyLink?: string;
}

export default function OportunidadesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'Fundo' | 'Concurso' | 'Bolsa' | 'Aceleração'>('todos');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.opportunities || []);
      }
    } catch (e) {
      console.error('Error fetching opportunities:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'todos' ? opportunities : opportunities.filter(o => o.category === filter);

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar oportunidades...</div>;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Centro de Oportunidades</h1>
        <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Acompanhe concursos, bolsas, acelerações e financiamentos abertos em África.</p>
      </header>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(['todos', 'Fundo', 'Concurso', 'Bolsa', 'Aceleração'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="btn-outline"
            style={{
              padding: '8px 16px',
              fontSize: '0.8rem',
              background: filter === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              color: filter === cat ? '#fff' : '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            {cat === 'todos' ? 'Ver Todas' : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
          De momento não há nenhuma oportunidade disponível nesta categoria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(opp => (
            <div key={opp._id} className="glass" style={{ padding: '1.8rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  background: opp.category === 'Fundo' ? 'rgba(46,204,113,0.15)' : opp.category === 'Concurso' ? 'rgba(241,196,15,0.15)' : 'rgba(155,89,182,0.15)',
                  color: opp.category === 'Fundo' ? '#2ecc71' : opp.category === 'Concurso' ? '#f1c40f' : '#9b59b6'
                }}>
                  {opp.category}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--primary)' }}>💰 {opp.amount}</strong>
              </div>

              <div>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', margin: '0 0 0.5rem 0', fontFamily: 'Outfit' }}>{opp.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                  {opp.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#ff4d4d', fontWeight: 600 }}>
                  ⏳ Limite: {new Date(opp.deadline).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                {opp.applyLink && (
                  <a
                    href={opp.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Candidatar-me
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
