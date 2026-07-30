'use client';

import { useEffect, useState } from 'react';

interface UnifiedInscription {
  _id: string;
  type: 'programas' | 'cursos' | 'eventos';
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  status: string;
  itemTitle: string;
  createdAt: string;
  // Programas specific
  nivelAdesao?: string;
  origem?: string;
  // Cursos specific
  progresso?: string;
  // Eventos specific
  cargo?: string;
  sector?: string;
}

export default function AdminInscricoesPage() {
  const [inscricoes, setInscricoes] = useState<UnifiedInscription[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    fetchAllInscricoes();
  }, []);

  const fetchAllInscricoes = async () => {
    setLoading(true);
    try {
      // Fetch from all three sources
      const [clubeRes, cursosRes, eventosRes] = await Promise.all([
        fetch('/api/clube/inscricoes'),
        fetch('/api/payments'),
        fetch('/api/events/inscricoes')
      ]);

      const clubeData = await clubeRes.json();
      const cursosData = await cursosRes.json();
      const eventosData = await eventosRes.json();

      const unified: UnifiedInscription[] = [];

      // Process Clube/Programas
      if (clubeData.inscricoes) {
        clubeData.inscricoes.forEach((i: any) => {
          unified.push({
            _id: i._id,
            type: 'programas',
            nome: i.nomeCompleto,
            email: i.email,
            telefone: i.telefone,
            empresa: i.nomeNegocio,
            status: i.status,
            itemTitle: `Clube - ${i.nivelAdesao}`,
            createdAt: i.createdAt,
            nivelAdesao: i.nivelAdesao,
            origem: i.origem
          });
        });
      }

      // Process Cursos
      if (cursosData.payments) {
        cursosData.payments.forEach((p: any) => {
          const completedCount = p.completedLessons?.length || (p.completed ? 1 : 0);
          const isCompleted = p.completed || completedCount > 0;
          unified.push({
            _id: p._id,
            type: 'cursos',
            nome: p.user?.name || 'Aluno',
            email: p.user?.email || '',
            telefone: p.phone,
            empresa: '',
            status: p.status,
            itemTitle: p.itemName || 'Curso',
            createdAt: p.createdAt,
            progresso: isCompleted ? 'Concluído' : `${completedCount} aulas`
          });
        });
      }

      // Process Eventos
      if (eventosData.inscricoes) {
        eventosData.inscricoes.forEach((e: any) => {
          unified.push({
            _id: e._id,
            type: 'eventos',
            nome: e.nomeCompleto,
            email: e.email,
            telefone: e.telefone,
            empresa: e.empresa,
            status: e.status,
            itemTitle: e.eventTitle || 'Evento',
            createdAt: e.createdAt,
            cargo: e.cargo,
            sector: e.sector
          });
        });
      }

      // Sort by date descending
      unified.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInscricoes(unified);
    } catch (err) {
      console.error('Erro ao carregar inscrições:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredInscricoes = () => {
    return inscricoes.filter(i => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        search === '' ||
        i.nome.toLowerCase().includes(searchLower) ||
        i.email.toLowerCase().includes(searchLower) ||
        (i.empresa || '').toLowerCase().includes(searchLower);
      
      const matchesType = typeFilter === 'todos' || i.type === typeFilter;
      
      const matchesStatus = statusFilter === 'todos' || i.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const getCounts = () => {
    return {
      total: inscricoes.length,
      programas: inscricoes.filter(i => i.type === 'programas').length,
      cursos: inscricoes.filter(i => i.type === 'cursos').length,
      eventos: inscricoes.filter(i => i.type === 'eventos').length,
      pendente: inscricoes.filter(i => i.status === 'pendente').length,
      aprovado: inscricoes.filter(i => i.status === 'aprovado' || i.status === 'confirmado').length,
      rejeitado: inscricoes.filter(i => i.status === 'rejeitado' || i.status === 'cancelado').length
    };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'programas': return '#ff6b00';
      case 'cursos': return '#0ea5e9';
      case 'eventos': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'programas': return 'Programas';
      case 'cursos': return 'Cursos';
      case 'eventos': return 'Eventos';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return '#f59e0b';
      case 'aprovado':
      case 'confirmado':
      case 'compareceu':
        return '#10b981';
      case 'rejeitado':
      case 'cancelado':
      case 'nao_compareceu':
        return '#ef4444';
      case 'contactado': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aprovado': return 'Aprovado';
      case 'confirmado': return 'Confirmado';
      case 'compareceu': return 'Compareceu';
      case 'rejeitado': return 'Rejeitado';
      case 'cancelado': return 'Cancelado';
      case 'nao_compareceu': return 'Não Compareceu';
      case 'contactado': return 'Contactado';
      default: return status;
    }
  };

  const counts = getCounts();
  const filtered = getFilteredInscricoes();

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Gestão Centralizada de Inscrições
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Visualize e gerencie todas as inscrições de Programas, Cursos e Eventos num só lugar.
        </p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total', val: counts.total, color: '#0f172a' },
          { label: 'Programas', val: counts.programas, color: '#ff6b00' },
          { label: 'Cursos', val: counts.cursos, color: '#0ea5e9' },
          { label: 'Eventos', val: counts.eventos, color: '#8b5cf6' },
          { label: 'Pendentes', val: counts.pendente, color: '#f59e0b' },
          { label: 'Aprovados', val: counts.aprovado, color: '#10b981' },
          { label: 'Rejeitados', val: counts.rejeitado, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.val}</span>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <input
          type="text"
          placeholder="🔍 Pesquisar por nome, email ou empresa..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            background: '#f8fafc',
            color: '#0f172a',
            fontWeight: 500,
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Tipo:</span>
            {['todos', 'programas', 'cursos', 'eventos'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  background: typeFilter === type ? '#0f172a' : '#ffffff',
                  color: typeFilter === type ? '#ffffff' : '#64748b',
                  borderColor: typeFilter === type ? '#0f172a' : '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {type === 'todos' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Status:</span>
            {['todos', 'pendente', 'aprovado', 'rejeitado'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  background: statusFilter === status ? '#10b981' : '#ffffff',
                  color: statusFilter === status ? '#ffffff' : '#64748b',
                  borderColor: statusFilter === status ? '#10b981' : '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          Mostrando <strong>{filtered.length}</strong> de <strong>{inscricoes.length}</strong> inscrições
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>A carregar inscrições...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          Nenhuma inscrição encontrada com os filtros aplicados.
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>Nome</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>Tipo</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>Item</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{i.nome}</td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>{i.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: `${getTypeColor(i.type)}15`,
                      color: getTypeColor(i.type),
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      border: `1px solid ${getTypeColor(i.type)}30`
                    }}>
                      {getTypeLabel(i.type)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>{i.itemTitle}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: `${getStatusColor(i.status)}15`,
                      color: getStatusColor(i.status),
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      border: `1px solid ${getStatusColor(i.status)}30`
                    }}>
                      {getStatusLabel(i.status)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                    {new Date(i.createdAt).toLocaleDateString('pt-PT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
