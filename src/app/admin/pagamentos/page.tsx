'use client';

import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, FileText, Search, User, Mail, Phone, Building2, Award, Calendar, DollarSign, BarChart2, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

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
  completedLessons?: number[];
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
  
  // Pagination State (6 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchPayments();
  }, []);

  // Reset to page 1 whenever filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
             ' às ' + 
             d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper function for pre-filled personalized WhatsApp links
  const getWhatsAppUrl = (pay: PaymentLog) => {
    const phone = pay.phone || '';
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (!cleanPhone) return '';

    const userName = pay.user?.name || 'Estimado(a) Aluno(a)';
    const courseTitle = pay.itemName || 'Curso ABN';

    let message = '';

    if (pay.certificateApproved) {
      message = `Olá ${userName}! 🎓\n\nParabéns! O seu certificado do curso *${courseTitle}* foi validado e aprovado pela Direção da ABN.\n\nJá pode aceder ao seu painel em https://abnafrobiznetwork.com para descarregar o documento em PDF!\n\nQualquer dúvida, estamos ao dispor.`;
    } else if (pay.status === 'pendente') {
      message = `Olá ${userName}! 💳\n\nConfirmamos a receção da sua inscrição para o curso *${courseTitle}*.\n\nA nossa equipa está a analisar o seu comprovativo de pagamento e dará novidades em breve!\n\nObrigado pela preferência, AfroBiz Network (ABN).`;
    } else if (pay.status === 'aprovado') {
      message = `Olá ${userName}! 🚀\n\nEntramos em contacto da AfroBiz Network (ABN) relativamente à sua inscrição no curso *${courseTitle}*.\n\nPrecisa de algum apoio ou ajuda com o acesso às videoaulas e materiais de apoio?`;
    } else {
      message = `Olá ${userName}! 👋\n\nEntramos em contacto da AfroBiz Network (ABN) relativamente ao curso *${courseTitle}*.\n\nComo podemos ajudar?`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Calculate total approved revenue
  const totalApprovedRevenue = payments
    .filter(p => p.status === 'aprovado' && p.price && p.price !== 'Gratuito')
    .reduce((acc, p) => {
      const val = parseInt(p.price.replace(/[^\d]/g, ''), 10);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

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

  // Pagination Math
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);
  const paginatedPayments = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar validações de pagamentos e certificados...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1240px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Validação de Inscrições & Certificados
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Verifique pagamentos, consulte o progresso dos alunos em tempo real e envie mensagens personalizadas pelo WhatsApp.
        </p>
      </header>

      {/* Summary KPI Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.4rem 1.6rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faturação Aprovada</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', fontFamily: 'Outfit', marginTop: '4px' }}>
            {totalApprovedRevenue.toLocaleString('pt-PT')} MT
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.4rem 1.6rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Inscrições</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', marginTop: '4px' }}>
            {payments.length}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.4rem 1.6rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.75rem', color: '#ca8a04', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pagamentos Pendentes</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ca8a04', fontFamily: 'Outfit', marginTop: '4px' }}>
            {payments.filter(p => p.status === 'pendente').length}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.4rem 1.6rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certificados por Aprovar</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', fontFamily: 'Outfit', marginTop: '4px' }}>
            {certCount}
          </div>
        </div>
      </div>

      {msg && (
        <div style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '1rem 1.25rem', borderRadius: '14px', marginBottom: '2rem', fontWeight: 700, fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
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

      {/* Pagination Info Header */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
          <span>A mostrar <strong style={{ color: '#0f172a' }}>{startIndex + 1}–{endIndex}</strong> de <strong style={{ color: '#0f172a' }}>{filtered.length}</strong> inscrições</span>
          <span>Página {currentPage} de {totalPages}</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ padding: '3.5rem 2rem', borderRadius: '20px', textAlign: 'center', color: '#64748b', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)', fontWeight: 500 }}>
          Nenhum registo ou pedido de certificado nesta categoria.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {paginatedPayments.map(pay => {
            const completedCount = pay.completedLessons?.length || (pay.completed ? 1 : 0);
            const waUrl = getWhatsAppUrl(pay);

            return (
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

                    {/* 📅 Date Badge */}
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, background: '#f8fafc', padding: '3px 10px', borderRadius: '50px', border: '1px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#64748b" /> {formatDate(pay.createdAt)}
                    </span>

                    {/* 📊 Student Real-Time Progress Badge */}
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '50px',
                      background: pay.completed ? '#f0fdf4' : '#fff7ed',
                      color: pay.completed ? '#16a34a' : '#ff6b00',
                      border: `1px solid ${pay.completed ? '#bbf7d0' : '#ffedd5'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <BarChart2 size={13} /> {pay.completed ? '100% Concluído (Formação Finalizada)' : `Progresso: ${completedCount} Aulas Vistas`}
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
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  
                  {/* 💬 Dynamic WhatsApp Button with Pre-filled Personalized Template */}
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Enviar mensagem personalizada no WhatsApp para ${pay.phone || pay.user?.name}`}
                      style={{
                        padding: '10px 18px',
                        fontSize: '0.85rem',
                        background: '#25D366',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(37,211,102,0.25)',
                        transition: 'all 0.2s'
                      }}
                    >
                      💬 WhatsApp
                    </a>
                  )}

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
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', marginTop: '2.5rem' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
              color: currentPage === 1 ? '#94a3b8' : '#0f172a',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: currentPage === p ? 'none' : '1.5px solid #cbd5e1',
                  background: currentPage === p ? '#ff6b00' : '#ffffff',
                  color: currentPage === p ? '#ffffff' : '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: currentPage === p ? '0 4px 12px rgba(255, 107, 0, 0.25)' : 'none'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
              color: currentPage === totalPages ? '#94a3b8' : '#0f172a',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Seguinte <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
