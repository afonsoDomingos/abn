'use client';

import { useEffect, useState } from 'react';

interface PaymentLog {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  itemName: string;
  price: string;
  proofUrl: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
  phone?: string;
  company?: string;
}

export default function AdminPagamentosPage() {
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('todos');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'aprovado' | 'rejeitado') => {
    try {
      const res = await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Pagamento atualizado para ${newStatus} com sucesso!`);
        setPayments(prev =>
          prev.map(p => p._id === id ? { ...p, status: newStatus } : p)
        );
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      setMsg('Erro de conexão ao atualizar estado.');
    }
  };

  const filtered = filter === 'todos' ? payments : payments.filter(p => p.status === filter);

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar histórico de pagamentos...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold" style={{ fontSize: '2.2rem', fontFamily: 'Outfit' }}>Validação de Pagamentos</h1>
        <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Verifique os comprovativos de transferências carregados pelos empreendedores para inscrição nos cursos.</p>
      </header>

      {msg && (
        <div style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
          {msg}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem' }}>
        {(['todos', 'pendente', 'aprovado', 'rejeitado'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              borderRadius: '8px',
              cursor: 'pointer',
              textTransform: 'capitalize',
              background: filter === f ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {f === 'todos' ? 'Ver Todos' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
          Nenhum comprovativo de pagamento registado nesta categoria.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.map(pay => (
            <div key={pay._id} className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)' }}>Curso/Item</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: pay.status === 'pendente' ? 'rgba(241,196,15,0.15)' : pay.status === 'aprovado' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                    color: pay.status === 'pendente' ? '#f1c40f' : pay.status === 'aprovado' ? '#2ecc71' : '#e74c3c'
                  }}>
                    {pay.status}
                  </span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', fontFamily: 'Outfit', margin: 0 }}>{pay.itemName}</h3>
                
                {/* User information */}
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>👤 <strong>{pay.user?.name}</strong></span>
                  <span>✉️ {pay.user?.email}</span>
                  {pay.phone && <span>📞 {pay.phone}</span>}
                  {pay.company && <span>🏢 {pay.company}</span>}
                  <span>💰 {pay.price}</span>
                </div>
              </div>

              {/* Actions & Proof Link */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {pay.proofUrl !== 'gratuito' ? (
                  <a
                    href={pay.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--primary)',
                      borderRadius: '8px',
                      fontWeight: 700
                    }}
                  >
                    📄 Ver Comprovativo
                  </a>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Grátis (Sem ficheiro)</span>
                )}

                {pay.status === 'pendente' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdateStatus(pay._id, 'aprovado')}
                      style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ✓ Aprovar
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(pay._id, 'rejeitado')}
                      style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      &times; Rejeitar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
