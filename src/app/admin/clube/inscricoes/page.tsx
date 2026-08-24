'use client';

import { useEffect, useState } from 'react';
import { getClubStepTitle } from '@/lib/clubUtils';
import styles from './Inscricoes.module.css';

interface Inscricao {
  _id: string;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  endereco?: string;
  nomeNegocio?: string;
  sector?: string[];
  nivelAdesao: string;
  formaPagamento?: string;
  comprovativoUrl?: string;
  valorPago?: string;
  statusPagamento?: string;
  telefonePagamento?: string;
  tipoPagamento?: string;
  areasInteresse?: string[];
  comoConheceu?: string;
  localData?: string;
  assinatura?: string;
  origem?: string;
  status: string;
  notasAdmin?: string;
  createdAt: string;
  // full form fields
  docIdentificacao?: string;
  nuit?: string;
  alvara?: string;
  sectorOutro?: string;
  comoConheceuOutro?: string;
}

const NIVEL_LABELS: Record<string, string> = {
  jovem: 'Jovem / Estudante',
  individual: 'Individual',
  empresa: 'Empresa / PME',
  'corp-gold': 'Corporate Gold',
  'corp-platinum': 'Corporate Platinum',
  'corp-founding': 'Corporate Founding Partner',
  honorario: 'Honorário',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendente:   { label: 'Pendente',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  contactado: { label: 'Contactado',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  aprovado:   { label: 'Aprovado',    color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  rejeitado:  { label: 'Rejeitado',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

export default function AdminInscricoesClubePage() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Inscricao | null>(null);
  const [saving, setSaving] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editNotas, setEditNotas] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchInscricoes(); }, [filterStatus]);

  const fetchInscricoes = () => {
    setLoading(true);
    fetch(`/api/clube/inscricoes?status=${filterStatus}`)
      .then(r => r.json())
      .then(data => { if (data.inscricoes) setInscricoes(data.inscricoes); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const openDetail = (i: Inscricao) => {
    setSelected(i);
    setEditStatus(i.status);
    setEditNotas(i.notasAdmin || '');
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await fetch(`/api/clube/inscricoes/${selected._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: editStatus, notasAdmin: editNotas }),
    });
    if (res.ok) {
      setMsg('Atualizado com sucesso!');
      fetchInscricoes();
      setSelected(s => s ? { ...s, status: editStatus, notasAdmin: editNotas } : s);
      setTimeout(() => setMsg(''), 3000);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar esta inscrição permanentemente?')) return;
    await fetch(`/api/clube/inscricoes/${id}`, { method: 'DELETE' });
    setSelected(null);
    fetchInscricoes();
  };

  const filtered = inscricoes.filter(i =>
    i.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    (i.nomeNegocio || '').toLowerCase().includes(search.toLowerCase())
  );

  const counts = inscricoes.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>🏛️ Inscrições — {getClubStepTitle('Clube dos Empreendedores ABN')}</h1>
          <p className={styles.pageSubtitle}>Gestão de candidatos ao {getClubStepTitle('Clube dos Empreendedores ABN')}</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchInscricoes}>↻ Atualizar</button>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total', val: inscricoes.length, color: '#d4af37' },
          { label: 'Pendentes', val: counts['pendente'] || 0, color: '#f59e0b' },
          { label: 'Contactados', val: counts['contactado'] || 0, color: '#3b82f6' },
          { label: 'Aprovados', val: counts['aprovado'] || 0, color: '#10b981' },
          { label: 'Rejeitados', val: counts['rejeitado'] || 0, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statNum} style={{ color: s.color }}>{s.val}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Pesquisar por nome, e-mail ou empresa..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.statusFilters}>
          {['todos', 'pendente', 'contactado', 'aprovado', 'rejeitado'].map(s => (
            <button
              key={s}
              className={`${styles.filterBtn} ${filterStatus === s ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Table */}
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.loading}><div className={styles.spinner} /><p>A carregar...</p></div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <span>📋</span>
              <p>Nenhuma inscrição encontrada.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Nível</th>
                  <th>Origem</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => {
                  const sc = STATUS_CONFIG[i.status] || STATUS_CONFIG['pendente'];
                  return (
                    <tr key={i._id} className={`${styles.row} ${selected?._id === i._id ? styles.rowActive : ''}`} onClick={() => openDetail(i)}>
                      <td>
                        <div className={styles.nameCell}>
                          <span className={styles.nameAvatar}>{i.nomeCompleto.charAt(0).toUpperCase()}</span>
                          <div>
                            <p className={styles.namePrimary}>{i.nomeCompleto}</p>
                            <p className={styles.nameSecondary}>{i.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className={styles.nivelBadge}>{NIVEL_LABELS[i.nivelAdesao] || i.nivelAdesao}</span></td>
                      <td><span className={styles.origemBadge}>{i.origem === 'home' ? '🏠 Home' : '📄 Programas'}</span></td>
                      <td>
                        <span className={styles.statusBadge} style={{ color: sc.color, background: sc.bg }}>
                          {sc.label}
                        </span>
                      </td>
                      <td className={styles.dateCell}>{new Date(i.createdAt).toLocaleDateString('pt-PT')}</td>
                      <td>
                        <button className={styles.viewBtn} onClick={e => { e.stopPropagation(); openDetail(i); }}>Ver →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <div className={styles.detailAvatar}>{selected.nomeCompleto.charAt(0).toUpperCase()}</div>
              <div>
                <h3 className={styles.detailName}>{selected.nomeCompleto}</h3>
                <p className={styles.detailEmail}>{selected.email}</p>
              </div>
              <button className={styles.closeDetail} onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className={styles.detailBody}>
              {/* Identification */}
              <div className={styles.detailSection}>
                <h4 className={styles.detailSectionTitle}>📋 Identificação</h4>
                <div className={styles.detailGrid}>
                  {selected.docIdentificacao && <div className={styles.detailItem}><span>BI/Passaporte</span><p>{selected.docIdentificacao}</p></div>}
                  {selected.nuit && <div className={styles.detailItem}><span>NUIT</span><p>{selected.nuit}</p></div>}
                  {selected.telefone && <div className={styles.detailItem}><span>Telefone</span><p>{selected.telefone}</p></div>}
                  {selected.endereco && <div className={styles.detailItem}><span>Endereço</span><p>{selected.endereco}</p></div>}
                </div>
              </div>

              {/* Negócio */}
              {(selected.nomeNegocio || (selected.sector && selected.sector.length > 0)) && (
                <div className={styles.detailSection}>
                  <h4 className={styles.detailSectionTitle}>💼 Negócio</h4>
                  <div className={styles.detailGrid}>
                    {selected.nomeNegocio && <div className={styles.detailItem}><span>Empresa</span><p>{selected.nomeNegocio}</p></div>}
                    {selected.alvara && <div className={styles.detailItem}><span>Alvará</span><p>{selected.alvara}</p></div>}
                    {selected.sector && selected.sector.length > 0 && (
                      <div className={styles.detailItem}>
                        <span>Sector</span>
                        <p>{[...selected.sector, selected.sectorOutro].filter(Boolean).join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Adesão & Pagamento */}
              <div className={styles.detailSection}>
                <h4 className={styles.detailSectionTitle}>🏛️ Adesão &amp; Pagamento</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}><span>Nível</span><p>{NIVEL_LABELS[selected.nivelAdesao] || selected.nivelAdesao}</p></div>
                  {selected.formaPagamento && <div className={styles.detailItem}><span>Pagamento</span><p style={{ textTransform: 'capitalize' }}>{selected.formaPagamento}</p></div>}
                  {selected.tipoPagamento && (
                    <div className={styles.detailItem}>
                      <span>Modo de Pagamento</span>
                      <p style={{ fontWeight: 800, color: selected.tipoPagamento === 'comprovativo_manual' ? '#d97706' : '#2563eb' }}>
                        {selected.tipoPagamento === 'comprovativo_manual' ? '⏳ Comprovativo Manual (Em Análise)' : '⚡ API Direta / PIN Telemóvel'}
                      </p>
                    </div>
                  )}
                  {selected.telefonePagamento && <div className={styles.detailItem}><span>Telemóvel Pagamento</span><p style={{ fontWeight: 700, color: '#0f172a' }}>📱 {selected.telefonePagamento}</p></div>}
                  {selected.comprovativoUrl && (
                    <div className={styles.detailItem} style={{ gridColumn: 'span 2' }}>
                      <span>Comprovativo de Pagamento</span>
                      <p>
                        <a href={selected.comprovativoUrl} target="_blank" rel="noreferrer" style={{ color: '#ff6b00', fontWeight: 800, textDecoration: 'underline' }}>
                          📄 Visualizar / Descarregar Comprovativo
                        </a>
                      </p>
                    </div>
                  )}
                  {selected.comoConheceu && <div className={styles.detailItem}><span>Como conheceu</span><p>{selected.comoConheceu}{selected.comoConheceuOutro ? ` — ${selected.comoConheceuOutro}` : ''}</p></div>}
                  <div className={styles.detailItem}><span>Origem</span><p>{selected.origem === 'home' ? 'Página Inicial' : 'Página de Programas'}</p></div>
                </div>
              </div>

              {/* Áreas de Interesse */}
              {selected.areasInteresse && selected.areasInteresse.length > 0 && (
                <div className={styles.detailSection}>
                  <h4 className={styles.detailSectionTitle}>📌 Áreas de Interesse</h4>
                  <div className={styles.tagList}>
                    {selected.areasInteresse.map(a => <span key={a} className={styles.tag}>{a}</span>)}
                  </div>
                </div>
              )}

              {/* Declaração */}
              {(selected.assinatura || selected.localData) && (
                <div className={styles.detailSection}>
                  <h4 className={styles.detailSectionTitle}>✍️ Declaração</h4>
                  <div className={styles.detailGrid}>
                    {selected.localData && <div className={styles.detailItem}><span>Local e Data</span><p>{selected.localData}</p></div>}
                    {selected.assinatura && <div className={styles.detailItem}><span>Assinatura</span><p style={{ fontStyle: 'italic', color: '#d4af37' }}>{selected.assinatura}</p></div>}
                  </div>
                </div>
              )}

              {/* Admin actions */}
              <div className={styles.detailSection}>
                <h4 className={styles.detailSectionTitle}>⚙️ Gestão</h4>
                <div className={styles.adminActions}>
                  <div className={styles.formField}>
                    <label>Estado</label>
                    <select className={styles.select} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                      <option value="pendente">Pendente</option>
                      <option value="contactado">Contactado</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="rejeitado">Rejeitado</option>
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label>Notas internas</label>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      placeholder="Adicione notas sobre este candidato..."
                      value={editNotas}
                      onChange={e => setEditNotas(e.target.value)}
                    />
                  </div>
                  {msg && <p className={styles.successMsg}>✅ {msg}</p>}
                  <div className={styles.actionBtns}>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                      {saving ? 'A guardar...' : '💾 Guardar'}
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(selected._id)}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
