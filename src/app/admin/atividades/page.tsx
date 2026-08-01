'use client';

import { useEffect, useState } from 'react';

interface Activity {
  _id: string;
  title: string;
  description: string;
  assignedTo: { _id: string; name: string; email: string; department: string };
  department: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  role: string;
}

export default function AdminAtividadesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [userRole, setUserRole] = useState('collaborator');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setCurrentUserId(u.id || u._id || '');
        setUserRole(u.role || 'collaborator');
      } catch (e) {}
    }

    fetch('/api/admin/activities')
      .then(res => res.json())
      .then(data => {
        if (data.activities) setActivities(data.activities);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) {
          const collabs = data.users.filter((u: any) => u.role === 'collaborator' || u.role === 'admin');
          setCollaborators(collabs);
        }
      })
      .catch(() => {});
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/activities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      const data = await res.json();
      setActivities(prev => prev.map(a => a._id === id ? data.activity : a));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    setSaving(true);
    const isEdit = !!editingActivity._id;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch('/api/admin/activities', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingActivity._id,
        title: editingActivity.title,
        description: editingActivity.description,
        assignedTo: editingActivity.assignedTo?._id || editingActivity.assignedTo,
        department: editingActivity.department || 'Geral',
        deadline: editingActivity.deadline,
        priority: editingActivity.priority || 'medium',
        status: editingActivity.status || 'pending'
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (isEdit) {
        setActivities(prev => prev.map(a => a._id === editingActivity._id ? data.activity : a));
      } else {
        setActivities(prev => [...prev, data.activity]);
      }
      setEditingActivity(null);
    }
    setSaving(false);
  };

  const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: 'Pendente', bg: '#fef3c7', color: '#b45309' },
    in_progress: { label: 'Em Progresso', bg: '#dbeafe', color: '#1e40af' },
    completed: { label: 'Concluída', bg: '#dcfce7', color: '#15803d' },
    overdue: { label: 'Atrasada', bg: '#fee2e2', color: '#b91c1c' },
  };

  const priorityLabels: Record<string, { label: string; bg: string; color: string }> = {
    low: { label: 'Baixa', bg: '#f1f5f9', color: '#475569' },
    medium: { label: 'Média', bg: '#fef3c7', color: '#b45309' },
    high: { label: 'Alta', bg: '#ffedd5', color: '#c2410c' },
    urgent: { label: 'Urgente', bg: '#fee2e2', color: '#b91c1c' },
  };

  const filtered = activities.filter(a => {
    if (filterStatus !== 'todos' && a.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar gestão de atividades...</div>;
  }

  return (
    <div style={{ maxWidth: '1100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient-gold" style={{ fontSize: '1.9rem', fontWeight: 800, margin: '0 0 0.3rem 0' }}>
            Gestão de Atividades &amp; Tarefas
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Acompanhe, atribua e atualize o estado das atividades operacionais da equipe ABN.
          </p>
        </div>

        <button
          className="btn-primary"
          style={{ padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}
          onClick={() => setEditingActivity({
            _id: '',
            title: '',
            description: '',
            assignedTo: { _id: currentUserId, name: '', email: '', department: '' },
            department: 'Geral',
            deadline: new Date().toISOString().split('T')[0],
            status: 'pending',
            priority: 'medium',
            createdBy: { _id: currentUserId, name: '', email: '' },
            createdAt: new Date().toISOString()
          })}
        >
          ➕ Criar Nova Atividade
        </button>
      </header>

      {/* Filtros de Estado */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { val: 'todos', label: 'Todas as Tarefas' },
          { val: 'pending', label: '⏳ Pendentes' },
          { val: 'in_progress', label: '🔵 Em Progresso' },
          { val: 'completed', label: '🟢 Concluídas' },
          { val: 'overdue', label: '🔴 Atrasadas' }
        ].map(f => (
          <button
            key={f.val}
            onClick={() => setFilterStatus(f.val)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: filterStatus === f.val ? 'var(--primary)' : '#ffffff',
              border: filterStatus === f.val ? '1px solid var(--primary)' : '1px solid #cbd5e1',
              color: filterStatus === f.val ? '#ffffff' : '#475569',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabela de Atividades */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontSize: '0.92rem' }}>
            Nenhuma atividade encontrada com o filtro selecionado.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 20px', fontWeight: 800 }}>Tarefa / Atividade</th>
                <th style={{ padding: '14px 20px', fontWeight: 800 }}>Atribuído a</th>
                <th style={{ padding: '14px 20px', fontWeight: 800 }}>Prioridade</th>
                <th style={{ padding: '14px 20px', fontWeight: 800 }}>Prazo</th>
                <th style={{ padding: '14px 20px', fontWeight: 800 }}>Estado</th>
                <th style={{ padding: '14px 20px', fontWeight: 800, textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(act => {
                const st = statusLabels[act.status] || { label: act.status, bg: '#f1f5f9', color: '#334155' };
                const pr = priorityLabels[act.priority] || { label: act.priority, bg: '#f1f5f9', color: '#334155' };

                return (
                  <tr key={act._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{act.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{act.description}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#334155' }}>
                      👤 {act.assignedTo?.name || 'Não atribuído'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, background: pr.bg, color: pr.color, padding: '3px 10px', borderRadius: '12px' }}>
                        {pr.label}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                      📅 {act.deadline ? new Date(act.deadline).toLocaleDateString('pt-PT') : 'Sem prazo'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        value={act.status}
                        onChange={e => handleStatusUpdate(act._id, e.target.value)}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          background: st.bg,
                          color: st.color,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">⏳ Pendente</option>
                        <option value="in_progress">🔵 Em Progresso</option>
                        <option value="completed">🟢 Concluída</option>
                        <option value="overdue">🔴 Atrasada</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => setEditingActivity(act)}
                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Modal Criar/Editar Atividade */}
      {editingActivity && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '550px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative' }}>
            <button
              onClick={() => setEditingActivity(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, color: '#475569' }}
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
              {editingActivity._id ? 'Editar Atividade' : 'Criar Nova Atividade'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Título da Atividade *</label>
                <input
                  type="text"
                  required
                  value={editingActivity.title}
                  onChange={e => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  placeholder="Ex: Rever candidaturas da Mentalidade Empreendedora"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Atribuir a</label>
                  <select
                    value={typeof editingActivity.assignedTo === 'object' ? editingActivity.assignedTo?._id || '' : editingActivity.assignedTo || ''}
                    onChange={e => setEditingActivity({ ...editingActivity, assignedTo: e.target.value as any })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="">Selecione o colaborador...</option>
                    {collaborators.map(c => (
                      <option key={c._id} value={c._id}>{c.name} ({c.role})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Prioridade</label>
                  <select
                    value={editingActivity.priority}
                    onChange={e => setEditingActivity({ ...editingActivity, priority: e.target.value as any })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Prazo de Conclusão</label>
                  <input
                    type="date"
                    value={editingActivity.deadline ? editingActivity.deadline.split('T')[0] : ''}
                    onChange={e => setEditingActivity({ ...editingActivity, deadline: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Estado</label>
                  <select
                    value={editingActivity.status}
                    onChange={e => setEditingActivity({ ...editingActivity, status: e.target.value as any })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="pending">⏳ Pendente</option>
                    <option value="in_progress">🔵 Em Progresso</option>
                    <option value="completed">🟢 Concluída</option>
                    <option value="overdue">🔴 Atrasada</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Descrição / Instruções</label>
                <textarea
                  rows={3}
                  value={editingActivity.description}
                  onChange={e => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  placeholder="Instruções detalhadas para a execução da tarefa..."
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  style={{ padding: '10px 16px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  {saving ? 'A guardar...' : 'Guardar Atividade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
