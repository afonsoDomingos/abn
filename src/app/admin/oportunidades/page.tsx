'use client';

import { useEffect, useState } from 'react';
import styles from './Oportunidades.module.css';

interface OpportunityItem {
  _id: string;
  title: string;
  amount: string;
  deadline: string;
  category: 'Edital' | 'Concurso' | 'Financiamento' | 'Bolsa' | 'Programa' | 'Vaga' | 'Parceiro' | 'Outro';
  description: string;
  applyLink: string;
  location?: string;
  provider?: string;
}

export default function AdminOportunidadesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Form Fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState<OpportunityItem['category']>('Edital');
  const [description, setDescription] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [location, setLocation] = useState('');
  const [provider, setProvider] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = () => {
    setLoading(true);
    fetch('/api/opportunities')
      .then(res => res.json())
      .then(data => {
        if (data.opportunities) setOpportunities(data.opportunities);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditClick = (opp: OpportunityItem) => {
    setEditingId(opp._id);
    setTitle(opp.title || '');
    setAmount(opp.amount || '');
    // Format deadline date to YYYY-MM-DD for date input
    try {
      const d = new Date(opp.deadline);
      setDeadline(d.toISOString().substring(0, 10));
    } catch {
      setDeadline('');
    }
    setCategory(opp.category || 'Edital');
    setDescription(opp.description || '');
    setApplyLink(opp.applyLink || '');
    setLocation(opp.location || '');
    setProvider(opp.provider || '');
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setDeadline('');
    setCategory('Edital');
    setDescription('');
    setApplyLink('');
    setLocation('');
    setProvider('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount.trim() || !deadline || !description.trim()) {
      alert('Título, Valor, Prazo e Descrição são obrigatórios.');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      amount,
      deadline,
      category,
      description,
      applyLink,
      location,
      provider
    };

    try {
      const url = '/api/opportunities';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? '✅ Oportunidade atualizada com sucesso!' : '✅ Oportunidade criada com sucesso!');
        fetchOpportunities();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao guardar oportunidade.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta oportunidade?')) return;
    try {
      const res = await fetch('/api/opportunities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setOpportunities(prev => prev.filter(opp => opp._id !== id));
        setMsg('🗑️ Oportunidade removida com sucesso!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao remover oportunidade.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (activeTab === 'all') return true;
    return opp.category === activeTab;
  });

  const formatDateLong = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const tabsConfig = [
    { key: 'all', label: 'Todas' },
    { key: 'Edital', label: 'Editais' },
    { key: 'Concurso', label: 'Concursos' },
    { key: 'Financiamento', label: 'Financiamentos' },
    { key: 'Bolsa', label: 'Bolsas' },
    { key: 'Programa', label: 'Programas' },
    { key: 'Vaga', label: 'Vagas' },
    { key: 'Parceiro', label: 'Parceiros' }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Oportunidades</h1>
          <p className={styles.subtitle}>{opportunities.length} oportunidades registradas</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? '✕ Cancelar' : '+ Nova Oportunidade'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{editingId ? `Editar Oportunidade: ${title}` : 'Nova Oportunidade'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Título da Oportunidade *</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Concurso Pitch ABN Startup 180"
              />
            </div>
            <div className={styles.field}>
              <label>Categoria de Oportunidade</label>
              <select value={category} onChange={e => setCategory(e.target.value as any)}>
                <option value="Edital">Edital</option>
                <option value="Concurso">Concurso</option>
                <option value="Financiamento">Financiamento</option>
                <option value="Bolsa">Bolsa</option>
                <option value="Programa">Programa</option>
                <option value="Vaga">Vaga / Emprego</option>
                <option value="Parceiro">Oportunidade de Parceiro</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Valor / Orçamento / Financiamento *</label>
              <input
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Ex: 5.000 USD, Não remunerado, A definir"
              />
            </div>
            <div className={styles.field}>
              <label>Prazo Limite / Deadline *</label>
              <input
                required
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Provedor / Entidade Promotora</label>
              <input
                value={provider}
                onChange={e => setProvider(e.target.value)}
                placeholder="Ex: ABN, Fundação XYZ"
              />
            </div>
            <div className={styles.field}>
              <label>Localização / Formato</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Maputo, Moçambique ou Online"
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Link para Candidatura / Formulário (Opcional)</label>
              <input
                value={applyLink}
                onChange={e => setApplyLink(e.target.value)}
                placeholder="Ex: https://forms.gle/... ou link externo"
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Descrição Detalhada da Oportunidade *</label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descreva detalhadamente os critérios, elegibilidade, benefícios e regras da oportunidade..."
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar Oportunidade'}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.tabs}>
        {tabsConfig.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar oportunidades...</p>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className={styles.empty}>
          <span>💼</span>
          <p>Nenhuma oportunidade cadastrada nesta categoria.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredOpportunities.map(opp => (
            <div key={opp._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>{opp.category}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                  💰 {opp.amount}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{opp.title}</h3>
              <p className={styles.cardDesc}>{opp.description}</p>
              <div className={styles.cardMeta}>
                <div className={styles.metaItem}>
                  <span>📅 Prazo:</span>
                  <strong>{formatDateLong(opp.deadline)}</strong>
                </div>
                {opp.provider && (
                  <div className={styles.metaItem}>
                    <span>🏢 Promotor:</span>
                    <span>{opp.provider}</span>
                  </div>
                )}
                {opp.location && (
                  <div className={styles.metaItem}>
                    <span>📍 Local:</span>
                    <span>{opp.location}</span>
                  </div>
                )}
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.editBtn} onClick={() => handleEditClick(opp)}>
                  ✏️ Editar
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(opp._id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
