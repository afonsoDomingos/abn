'use client';

import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, FileText, Search, User, Mail, Phone, Building2, Award } from 'lucide-react';

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
  completed?: boolean;
  certificateRequested?: boolean;
  certificateApproved?: boolean;
  createdAt: string;
  phone?: string;
  company?: string;
}

export default function AdminPagamentosPage() {
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado' | 'certificados'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
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
        setMsg(`Pagamento ${newStatus === 'aprovado' ? 'APROVADO' : 'REJEITADO'} com sucesso! O aluno foi notificado.`);
        setPayments(prev =>
          prev.map(p => p._id === id ? { ...p, status: newStatus } : p)
        );
        setTimeout(() => setMsg(''), 4000);
      } else {
        alert(data.error || 'Erro ao atualizar o estado.');
      }
    } catch (e) {
      setMsg('Erro de conexão ao atualizar estado.');
    }
  };

  const handleApproveCertificate = async (id: string) => {
    try {
      const res = await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: id, certificateApproved: true })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Certificado APROVADO com sucesso! O aluno já pode descarregá-lo em PDF.');
        setPayments(prev =>
          prev.map(p => p._id === id ? { ...p, certificateApproved: true } : p)
        );
        setTimeout(() => setMsg(''), 4000);
      } else {
        alert(data.error || 'Erro ao aprovar certificado.');
      }
    } catch (e) {
      setMsg('Erro de conexão.');
    }
  };

  const filtered = payments.filter(p => {
    let matchesFilter = true;
    if (filter === 'certificados') {
      matchesFilter = !!p.certificateRequested;
    } else if (filter !== 'todos') {
      matchesFilter = p.status === filter;
    }

    const s = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      p.itemName?.toLowerCase().includes(s) ||
      p.user?.name?.toLowerCase().includes(s) ||
      p.user?.email?.toLowerCase().includes(s) ||
      p.company?.toLowerCase().includes(s);

    return matchesFilter && matchesSearch;
  });

  const certCount = payments.filter(p => p.certificateRequested && !p.certificateApproved).length;

  if (loading) return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar validações de pagamentos e certificados...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1240px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Validação de Inscrições & Certificados
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Verifique pagamentos e aprove os pedidos de emissão de certificados assinados pelos formadores ABN.
        </p>
      </header>

      {msg && (
        <div style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '1rem 1.25rem', borderRadius: '14px', marginBottom: '2rem', fontWeight: 700, fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {(['todos', 'pendente', 'aprovado', 'rejeitado', 'certificados'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '9px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: '50px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                background: filter === f ? '#ff6b00' : '#ffffff',
                color: filter === f ? '#ffffff' : '#64748b',
                border: filter === f ? 'none' : '1px solid #cbd5e1',
                boxShadow: filter === f ? '0 4px 12px rgba(255, 107, 0, 0.25)' : 'none',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {f === 'certificados' ? `🎓 Certificados (${certCount})` : f === 'todos' ? `Ver Todos (${payments.length})` : `${f.toUpperCase()} (${payments.filter(p => p.status === f).length})`}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Pesquisar por aluno ou curso..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '0.88rem', outline: 'none' }}
          />
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '3.5rem 2rem', borderRadius: '20px', textAlign: 'center', color: '#64748b', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)', fontWeight: 500 }}>
          Nenhum registo ou pedido de certificado nesta categoria.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map(pay => (
            <div 
              key={pay._id} 
              style={{ 
                padding: '1.8rem 2rem', 
                borderRadius: '20px', 
                background: '#ffffff', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1.5rem' 
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#ff6b00', letterSpacing: '0.06em' }}>Inscrição</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '50px',
                    background: pay.status === 'pendente' ? '#fefce8' : pay.status === 'aprovado' ? '#f0fdf4' : '#fef2f2',
                    color: pay.status === 'pendente' ? '#ca8a04' : pay.status === 'aprovado' ? '#16a34a' : '#dc2626',
                    border: `1px solid ${pay.status === 'pendente' ? '#fef08a' : pay.status === 'aprovado' ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    {pay.status}
                  </span>

                  {pay.certificateRequested && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '50px',
                      background: pay.certificateApproved ? '#eff6ff' : '#fff7ed',
                      color: pay.certificateApproved ? '#2563eb' : '#d97706',
                      border: `1px solid ${pay.certificateApproved ? '#bfdbfe' : '#fde68a'}`
                    }}>
                      🎓 Certificado: {pay.certificateApproved ? 'Aprovado' : 'Aguardar Aprovação Admin'}
                    </span>
                  )}
                </div>
                
                <h3 style={{ color: '#0f172a', fontSize: '1.3rem', fontFamily: 'Outfit', fontWeight: 800, margin: 0 }}>
                  {pay.itemName}
                </h3>
                
                {/* User information */}
                <div style={{ fontSize: '0.88rem', color: '#475569', display: 'flex', gap: '1.4rem', flexWrap: 'wrap', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={15} color="#64748b" /> <strong>{pay.user?.name || 'Aluno'}</strong></span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={15} color="#64748b" /> {pay.user?.email}</span>
                  {pay.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={15} color="#64748b" /> {pay.phone}</span>}
                  {pay.company && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building2 size={15} color="#64748b" /> {pay.company}</span>}
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>💰 {pay.price}</span>
                </div>
              </div>

              {/* Actions & Certificate Approval Link */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {pay.proofUrl !== 'gratuito' ? (
                  <a
                    href={pay.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 18px',
                      fontSize: '0.85rem',
                      background: '#fff7ed',
                      border: '1.5px solid #ff6b00',
                      color: '#ff6b00',
                      borderRadius: '10px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={16} /> Ver Comprovativo
                  </a>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '50px', fontWeight: 700 }}>
                    Inscrição Gratuita
                  </span>
                )}

                {pay.status === 'pendente' && (
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      onClick={() => handleUpdateStatus(pay._id, 'aprovado')}
                      style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(22,163,74,0.2)' }}
                    >
                      <CheckCircle size={16} /> Aprovar Inscrição
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(pay._id, 'rejeitado')}
                      style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(220,38,38,0.2)' }}
                    >
                      <XCircle size={16} /> Rejeitar
                    </button>
                  </div>
                )}

                {/* Certificate Approval Button for Admin */}
                {pay.certificateRequested && !pay.certificateApproved && (
                  <button
                    onClick={() => handleApproveCertificate(pay._id)}
                    style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}
                  >
                    <Award size={16} /> Aprovar Certificado
                  </button>
                )}

                {pay.certificateApproved && (
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '50px' }}>
                    ✓ Certificado Emitido
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
