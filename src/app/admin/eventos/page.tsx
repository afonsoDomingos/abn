'use client';

import { useEffect, useState } from 'react';
import styles from './Eventos.module.css';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'upcoming' | 'past';
  category: 'Conferência' | 'Feira' | 'Missão Empresarial' | 'Summit ABN' | 'Outro';
  imageUrl?: string;
  link?: string;
}

export default function AdminEventosPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  
  // Inscriptions management states
  const [showInscriptionsModal, setShowInscriptionsModal] = useState(false);
  const [selectedEventForInscriptions, setSelectedEventForInscriptions] = useState<EventItem | null>(null);
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [loadingInscriptions, setLoadingInscriptions] = useState(false);
  const [inscriptionSearch, setInscriptionSearch] = useState('');
  const [inscriptionStatusFilter, setInscriptionStatusFilter] = useState('todos');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'upcoming' | 'past'>('upcoming');
  const [category, setCategory] = useState<'Conferência' | 'Feira' | 'Missão Empresarial' | 'Summit ABN' | 'Outro'>('Summit ABN');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events) setEvents(data.events);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditClick = (ev: EventItem) => {
    setEditingId(ev._id);
    setTitle(ev.title || '');
    setDescription(ev.description || '');
    setDate(ev.date || '');
    setLocation(ev.location || '');
    setType(ev.type || 'upcoming');
    setCategory(ev.category || 'Summit ABN');
    setImageUrl(ev.imageUrl || '');
    setLink(ev.link || '');
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setType('upcoming');
    setCategory('Summit ABN');
    setImageUrl('');
    setLink('');
    setShowForm(true);
  };

  const handleViewInscriptions = async (event: EventItem) => {
    setSelectedEventForInscriptions(event);
    setShowInscriptionsModal(true);
    setLoadingInscriptions(true);
    setInscriptionSearch('');
    setInscriptionStatusFilter('todos');
    try {
      const res = await fetch(`/api/events/inscricoes?eventId=${event._id}`);
      const data = await res.json();
      if (data.inscricoes) {
        setInscriptions(data.inscricoes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInscriptions(false);
    }
  };

  const handleUpdateInscriptionStatus = async (inscriptionId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/events/inscricoes/${inscriptionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setInscriptions(prev =>
          prev.map(i => i._id === inscriptionId ? { ...i, status: newStatus } : i)
        );
      } else {
        alert(data.error || 'Erro ao atualizar status.');
      }
    } catch (err) {
      alert('Erro de conexão ao atualizar status.');
    }
  };

  const handleDeleteInscription = async (inscriptionId: string) => {
    if (!confirm('Eliminar esta inscrição permanentemente?')) return;
    try {
      const res = await fetch(`/api/events/inscricoes/${inscriptionId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInscriptions(prev => prev.filter(i => i._id !== inscriptionId));
      } else {
        alert(data.error || 'Erro ao eliminar inscrição.');
      }
    } catch (err) {
      alert('Erro de conexão ao eliminar inscrição.');
    }
  };

  const getFilteredInscriptions = () => {
    return inscriptions.filter(i => {
      const searchLower = inscriptionSearch.toLowerCase();
      const matchesSearch = 
        inscriptionSearch === '' ||
        (i.nomeCompleto || '').toLowerCase().includes(searchLower) ||
        (i.email || '').toLowerCase().includes(searchLower) ||
        (i.empresa || '').toLowerCase().includes(searchLower);
      
      const matchesStatus = 
        inscriptionStatusFilter === 'todos' ||
        i.status === inscriptionStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        alert('Erro ao carregar imagem: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão para upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !location.trim()) {
      alert('Título, Descrição, Data e Localização são obrigatórios.');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      description,
      date,
      location,
      type,
      category,
      imageUrl,
      link
    };

    try {
      const url = '/api/events';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? '✅ Evento atualizado com sucesso!' : '✅ Evento criado com sucesso!');
        fetchEvents();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao guardar evento.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este evento?')) return;
    try {
      const res = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.filter(e => e._id !== id));
        setMsg('🗑️ Evento removido com sucesso!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao remover evento.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    }
  };

  const statusColor = {
    upcoming: '#ff6b00',
    past: '#888888'
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Eventos</h1>
          <p className={styles.subtitle}>{events.length} eventos no total</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? '✕ Cancelar' : '+ Novo Evento'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{editingId ? `Editar Evento: ${title}` : 'Adicionar Novo Evento'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Título do Evento *</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Summit ABN 2026"
              />
            </div>
            <div className={styles.field}>
              <label>Categoria de Evento</label>
              <select value={category} onChange={e => setCategory(e.target.value as any)}>
                <option value="Summit ABN">Summit ABN</option>
                <option value="Conferência">Conferência</option>
                <option value="Feira">Feira</option>
                <option value="Missão Empresarial">Missão Empresarial</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Data do Evento *</label>
              <input
                required
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Localização / Formato *</label>
              <input
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Maputo, Moçambique ou Online"
              />
            </div>
            <div className={styles.field}>
              <label>Tipo de Evento</label>
              <select value={type} onChange={e => setType(e.target.value as any)}>
                <option value="upcoming">Próximo Evento (Futuro)</option>
                <option value="past">Evento Realizado (Passado)</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Link de Inscrição / Detalhes (Opcional)</label>
              <input
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="Ex: https://sympla.com.br/abn-event"
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Imagem de Capa (Opcional)</label>
              <div className={styles.uploadRow}>
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="URL da imagem ou carregue um arquivo"
                  style={{ flex: 1 }}
                />
                <label className={styles.uploadLabel} title="Carregar Imagem">
                  {uploading ? (
                    <div className={styles.spinnerSmall}></div>
                  ) : (
                    '📁'
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Descrição Detalhada *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descreva o objetivo do evento, painéis, participantes e importância..."
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar Evento'}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar eventos do ecossistema...</p>
        </div>
      ) : events.length === 0 ? (
        <div className={styles.empty}>
          <span>📅</span>
          <p>Nenhum evento registrado ainda.</p>
          <button className="btn-primary" onClick={handleCreateClick}>Adicionar Primeiro Evento</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {events.map(ev => (
            <div key={ev._id} className={styles.card}>
              <div className={styles.cardImgWrapper}>
                <img 
                  src={ev.imageUrl || '/abn-logo.png'} 
                  alt="" 
                  className={styles.cardImg} 
                  style={!ev.imageUrl ? { objectFit: 'contain', padding: '20px', background: 'rgba(255, 255, 255, 0.03)' } : {}}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('abn-logo.png')) {
                      target.src = '/abn-logo.png';
                      target.style.objectFit = 'contain';
                      target.style.padding = '20px';
                      target.style.background = 'rgba(255, 255, 255, 0.03)';
                    }
                  }}
                />
                <span className={styles.categoryBadge}>{ev.category}</span>
                <span 
                  className={styles.statusBadge}
                  style={{
                    background: ev.type === 'upcoming' ? 'rgba(255, 107, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: ev.type === 'upcoming' ? '#ff6b00' : '#888',
                    border: ev.type === 'upcoming' ? '1px solid rgba(255, 107, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {ev.type === 'upcoming' ? 'Futuro' : 'Realizado'}
                </span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{ev.title}</h3>
                <p className={styles.cardDesc}>{ev.description}</p>
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span>📅</span>
                    <strong>{formatDate(ev.date)}</strong>
                  </div>
                  <div className={styles.metaItem}>
                    <span>📍</span>
                    <span>{ev.location}</span>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.editBtn} onClick={() => handleEditClick(ev)}>
                  ✏️ Editar
                </button>
                <button 
                  className={styles.inscriptionsBtn} 
                  onClick={() => handleViewInscriptions(ev)}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(14, 165, 233, 0.1)',
                    color: '#0ea5e9',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  👥 Inscrições
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(ev._id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inscriptions Modal */}
      {showInscriptionsModal && selectedEventForInscriptions && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '900px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)', display: 'flex', flexDirection: 'column', maxHeight: '85vh', overflow: 'hidden' }}>
            <button 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontSize: '1.4rem', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => { setShowInscriptionsModal(false); setSelectedEventForInscriptions(null); setInscriptions([]); }}
            >
              &times;
            </button>
            
            <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 0.2rem 0' }}>Inscrições do Evento</h2>
            <p style={{ color: '#0ea5e9', fontWeight: 800, margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>{selectedEventForInscriptions.title}</p>

            {/* Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <input
                type="text"
                placeholder="🔍 Pesquisar por nome, email ou empresa..."
                value={inscriptionSearch}
                onChange={e => setInscriptionSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#0f172a',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Status:</span>
                {['todos', 'pendente', 'confirmado', 'cancelado', 'compareceu', 'nao_compareceu'].map(status => (
                  <button
                    key={status}
                    onClick={() => setInscriptionStatusFilter(status)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      background: inscriptionStatusFilter === status ? '#0ea5e9' : '#ffffff',
                      color: inscriptionStatusFilter === status ? '#ffffff' : '#64748b',
                      borderColor: inscriptionStatusFilter === status ? '#0ea5e9' : '#e2e8f0',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                Mostrando <strong>{getFilteredInscriptions().length}</strong> de <strong>{inscriptions.length}</strong> inscrições
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {loadingInscriptions ? (
                <p style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>A carregar inscrições...</p>
              ) : inscriptions.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  Nenhuma inscrição para este evento ainda.
                </div>
              ) : getFilteredInscriptions().length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  Nenhuma inscrição encontrada com os filtros aplicados.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {getFilteredInscriptions().map(insc => (
                    <div key={insc._id} style={{ padding: '1.1rem 1.4rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                          {insc.nomeCompleto}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#64748b' }}>{insc.email} | 📞 {insc.telefone || 'Sem telefone'}</div>
                        {insc.empresa && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>🏢 {insc.empresa} | 💼 {insc.cargo || 'N/A'}</div>}
                      </div>

                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                          value={insc.status}
                          onChange={e => handleUpdateInscriptionStatus(insc._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#0f172a',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pendente">Pendente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="cancelado">Cancelado</option>
                          <option value="compareceu">Compareceu</option>
                          <option value="nao_compareceu">Não Compareceu</option>
                        </select>
                        <button
                          onClick={() => handleDeleteInscription(insc._id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
