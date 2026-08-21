'use client';

import { useEffect, useState } from 'react';
import styles from './Inqueritos.module.css';

export interface QuestionnaireField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file';
  options: string[];
  required: boolean;
  placeholder?: string;
}

interface Questionnaire {
  _id: string;
  title: string;
  description: string;
  fields: QuestionnaireField[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInqueritosPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [fields, setFields] = useState<QuestionnaireField[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ativo');

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = () => {
    setLoading(true);
    fetch('/api/questionnaires')
      .then(res => res.json())
      .then(data => {
        if (data.success) setQuestionnaires(data.questionnaires);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditClick = (q: Questionnaire) => {
    setEditingId(q._id);
    setTitle(q.title || '');
    setDescription(q.description || '');
    setStatus(q.status || 'ativo');
    setFields(q.fields || []);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStatus('ativo');
    setFields([]);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Título é obrigatório.');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      description,
      fields,
      status
    };

    try {
      const url = '/api/questionnaires';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? '✅ Inquérito atualizado com sucesso!' : '✅ Inquérito criado com sucesso!');
        fetchQuestionnaires();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao guardar inquérito.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja remover este inquérito? Esta ação não pode ser desfeita.')) return;
    try {
      const res = await fetch('/api/questionnaires', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestionnaires(prev => prev.filter(q => q._id !== id));
        setMsg('🗑️ Inquérito removido com sucesso!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao remover inquérito.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    }
  };

  const addField = () => {
    setFields([
      ...fields,
      { id: Date.now().toString(), label: '', type: 'text', options: [], required: false, placeholder: '' }
    ]);
  };

  const updateField = (idx: number, updates: Partial<QuestionnaireField>) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], ...updates };
    setFields(updated);
  };

  const removeField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const statusColor: Record<string, string> = {
    ativo: '#2e8b57',
    inativo: '#e74c3c',
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Inquéritos</h1>
          <p className={styles.subtitle}>{questionnaires.length} inquéritos disponíveis</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? '✕ Cancelar' : '+ Novo Inquérito'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h3>{editingId ? `Editar: ${title}` : 'Adicionar Novo Inquérito'}</h3>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Título do Inquérito *</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Inquérito de Candidatura ABN Startup 180"
              />
            </div>
            <div className={styles.field}>
              <label>Estado</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Descrição</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descreva o objetivo deste inquérito..."
              />
            </div>
          </div>

          <div style={{ margin: '2rem 0', borderTop: '1px solid #e8eaf0', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem' }}>
                Campos do Inquérito
              </h4>
              <button
                type="button"
                className="btn-primary"
                onClick={addField}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                + Adicionar Campo
              </button>
            </div>

            {fields.length === 0 ? (
              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                <p style={{ margin: 0 }}>Nenhum campo configurado. Clique em "+ Adicionar Campo" para começar.</p>
              </div>
            ) : (
              fields.map((field, idx) => (
                <div key={field.id || idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                      CAMPO #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.4rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      🗑️ Remover
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className={styles.field}>
                      <label>Título da Pergunta *</label>
                      <input
                        type="text"
                        required
                        value={field.label}
                        onChange={e => updateField(idx, { label: e.target.value })}
                        placeholder="Ex: Possui registo comercial?"
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Tipo de Resposta</label>
                      <select
                        value={field.type}
                        onChange={e => updateField(idx, { type: e.target.value as any })}
                      >
                        <option value="text">Texto Curto</option>
                        <option value="textarea">Texto Longo</option>
                        <option value="select">Escolha Única</option>
                        <option value="checkbox">Múltipla Escolha</option>
                        <option value="file">Upload de Ficheiro</option>
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label>Placeholder (opcional)</label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={e => updateField(idx, { placeholder: e.target.value })}
                        placeholder="Ex: Exemplo de resposta..."
                      />
                    </div>
                  </div>

                  {(field.type === 'select' || field.type === 'checkbox') && (
                    <div className={styles.field} style={{ marginTop: '1rem' }}>
                      <label>Opções (separadas por vírgula)</label>
                      <input
                        type="text"
                        value={field.options.join(', ')}
                        onChange={e => updateField(idx, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        placeholder="Ex: Sim, Não, Em processo"
                      />
                    </div>
                  )}

                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => updateField(idx, { required: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: '#ff6b00' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Resposta Obrigatória</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar Inquérito'}
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
          <p>A carregar inquéritos...</p>
        </div>
      ) : questionnaires.length === 0 ? (
        <div className={styles.empty}>
          <span>📋</span>
          <p>Nenhum inquérito cadastrado no momento.</p>
          <button className="btn-primary" onClick={handleCreateClick}>Criar Primeiro Inquérito</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {questionnaires.map(q => (
            <div key={q._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span
                  className={styles.statusBadge}
                  style={{
                    background: statusColor[q.status] + '22',
                    color: statusColor[q.status],
                    border: `1px solid ${statusColor[q.status]}44`,
                  }}
                >
                  {q.status}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{q.title}</h3>
              <p className={styles.cardDesc}>{q.description || 'Sem descrição'}</p>
              
              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <span>Campos:</span>
                  <strong>{q.fields.length}</strong>
                </div>
                <div className={styles.detailItem}>
                  <span>Obrigatórios:</span>
                  <strong>{q.fields.filter(f => f.required).length}</strong>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button className={styles.editBtn} onClick={() => handleEditClick(q)}>
                  ✏️ Editar
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(q._id)}>
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
