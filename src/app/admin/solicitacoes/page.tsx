'use client';

import { useEffect, useState } from 'react';
import styles from './Solicitacoes.module.css';

interface ServiceRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  servicePrice: string;
  company: string;
  timeline: string;
  description: string;
  status: 'pendente' | 'em análise' | 'aprovado' | 'rejeitado';
  notes: string;
  createdAt: string;
}

interface Counts {
  total: number;
  pendente: number;
  emAnalise: number;
  aprovado: number;
  rejeitado: number;
}

export default function AdminSolicitacoesPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, pendente: 0, emAnalise: 0, aprovado: 0, rejeitado: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/admin/requests?status=${filter}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
        setCounts(data.counts);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleOpenModal = (req: ServiceRequest) => {
    setSelectedReq(req);
    setEditStatus(req.status);
    setEditNotes(req.notes || '');
  };

  const handleCloseModal = () => {
    setSelectedReq(null);
  };

  const handleUpdate = async () => {
    if (!selectedReq) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedReq._id,
          status: editStatus,
          notes: editNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.map(r => r._id === selectedReq._id ? data.request : r));
        setMsg('✅ Solicitação atualizada com sucesso!');
        setTimeout(() => setMsg(''), 3000);
        handleCloseModal();
        // Refresh counts
        fetchRequests();
      }
    } catch (err) {
      alert('Erro ao atualizar solicitação.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Tem certeza de que deseja apagar esta solicitação?')) return;
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r._id !== id));
        fetchRequests();
      }
    } catch (err) {
      alert('Erro ao apagar.');
    }
  };

  const statusColors = {
    pendente: styles.statusPendente,
    'em análise': styles.statusAnalise,
    aprovado: styles.statusAprovado,
    rejeitado: styles.statusRejeitado
  };

  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Solicitações de Serviço</h1>
          <p className={styles.subtitle}>Gerencie os pedidos de orçamento e projetos submetidos pelos clientes.</p>
        </div>
      </div>

      {msg && <div className={styles.alertMsg}>{msg}</div>}

      {/* Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => setFilter('all')}>
          <span className={styles.statNum}>{counts.total}</span>
          <span className={styles.statLabel}>Total Recebidos</span>
        </div>
        <div className={`${styles.statCard} ${styles.borderPendente}`} onClick={() => setFilter('pendente')}>
          <span className={`${styles.statNum} ${styles.textPendente}`}>{counts.pendente}</span>
          <span className={styles.statLabel}>Pendentes</span>
        </div>
        <div className={`${styles.statCard} ${styles.borderAnalise}`} onClick={() => setFilter('em análise')}>
          <span className={`${styles.statNum} ${styles.textAnalise}`}>{counts.emAnalise}</span>
          <span className={styles.statLabel}>Em Análise</span>
        </div>
        <div className={`${styles.statCard} ${styles.borderAprovado}`} onClick={() => setFilter('aprovado')}>
          <span className={`${styles.statNum} ${styles.textAprovado}`}>{counts.aprovado}</span>
          <span className={styles.statLabel}>Aprovados</span>
        </div>
        <div className={`${styles.statCard} ${styles.borderRejeitado}`} onClick={() => setFilter('rejeitado')}>
          <span className={`${styles.statNum} ${styles.textRejeitado}`}>{counts.rejeitado}</span>
          <span className={styles.statLabel}>Rejeitados</span>
        </div>
      </div>

      {/* Control bar */}
      <div className={styles.controls}>
        <input 
          type="text" 
          placeholder="Pesquisar por cliente, email ou serviço..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />
        <div className={styles.tabs}>
          <button className={filter === 'all' ? styles.activeTab : ''} onClick={() => setFilter('all')}>Todas</button>
          <button className={filter === 'pendente' ? styles.activeTab : ''} onClick={() => setFilter('pendente')}>Pendentes</button>
          <button className={filter === 'em análise' ? styles.activeTab : ''} onClick={() => setFilter('em análise')}>Em Análise</button>
          <button className={filter === 'aprovado' ? styles.activeTab : ''} onClick={() => setFilter('aprovado')}>Aprovadas</button>
          <button className={filter === 'rejeitado' ? styles.activeTab : ''} onClick={() => setFilter('rejeitado')}>Rejeitadas</button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>A carregar solicitações...</div>
      ) : filteredRequests.length === 0 ? (
        <div className={styles.empty}>Nenhuma solicitação encontrada nesta categoria.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço Solicitado</th>
                <th>Data</th>
                <th>Início</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <tr key={req._id} onClick={() => handleOpenModal(req)} className={styles.row}>
                  <td>
                    <div className={styles.clientName}>{req.name}</div>
                    <div className={styles.clientEmail}>{req.email}</div>
                  </td>
                  <td>
                    <div className={styles.serviceName}>{req.service}</div>
                    <div className={styles.servicePrice}>{req.servicePrice || 'Sob Consulta'}</div>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString('pt-PT')}</td>
                  <td><span className={styles.timelineLabel}>{req.timeline}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${statusColors[req.status] || ''}`}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={styles.deleteBtn} onClick={(e) => handleDelete(req._id, e)}>Apagar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReq && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
            <h2 className={styles.modalTitle}>Detalhe da Solicitação</h2>
            
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3>Informações do Cliente</h3>
                <div className={styles.infoGrid}>
                  <div><strong>Nome:</strong> {selectedReq.name}</div>
                  <div><strong>Email:</strong> <a href={`mailto:${selectedReq.email}`}>{selectedReq.email}</a></div>
                  <div><strong>WhatsApp/Telefone:</strong> {selectedReq.phone || 'Não informado'}</div>
                  {selectedReq.company && <div><strong>Empresa/Startup:</strong> {selectedReq.company}</div>}
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3>Detalhes do Projeto</h3>
                <div className={styles.infoGrid}>
                  <div><strong>Serviço:</strong> {selectedReq.service} ({selectedReq.servicePrice || 'Sob Consulta'})</div>
                  <div><strong>Data de Envio:</strong> {new Date(selectedReq.createdAt).toLocaleString('pt-PT')}</div>
                  <div><strong>Expectativa de Início:</strong> {selectedReq.timeline}</div>
                </div>
                <div className={styles.descriptionBox}>
                  <strong>Descrição da Necessidade:</strong>
                  <p>{selectedReq.description}</p>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3>Ações de Gestão</h3>
                <div className={styles.formGroup}>
                  <label>Estado da Solicitação</label>
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className={styles.select}>
                    <option value="pendente">Pendente</option>
                    <option value="em análise">Em Análise</option>
                    <option value="aprovado">Aprovado (Iniciar Projeto)</option>
                    <option value="rejeitado">Rejeitado</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Notas Internas (Apenas visíveis para administradores)</label>
                  <textarea 
                    value={editNotes} 
                    onChange={e => setEditNotes(e.target.value)} 
                    placeholder="Adicione notas de contacto, progresso ou orçamento aqui..."
                    rows={4}
                    className={styles.textarea}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className="btn-secondary" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-primary" onClick={handleUpdate} disabled={saving}>
                {saving ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
