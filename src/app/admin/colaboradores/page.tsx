'use client';

import { useEffect, useState } from 'react';
import styles from './Colaboradores.module.css';

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

export default function AdminColaboradoresPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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
          const collabs = data.users.filter((u: User) => u.role === 'collaborator');
          setCollaborators(collabs);
        }
      })
      .catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta atividade?')) return;
    const res = await fetch('/api/admin/activities', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setActivities(prev => prev.filter(a => a._id !== id));
  };

  const handleUpdate = async (e: React.FormEvent) => {
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
        assignedTo: editingActivity.assignedTo._id,
        department: editingActivity.department,
        deadline: editingActivity.deadline,
        priority: editingActivity.priority,
        createdBy: editingActivity.createdBy?._id,
        status: editingActivity.status
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

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: '#f59e0b' },
    in_progress: { label: 'Em Progresso', color: '#3b82f6' },
    completed: { label: 'Concluída', color: '#10b981' },
    overdue: { label: 'Atrasada', color: '#ef4444' },
  };

  const priorityLabels: Record<string, { label: string; color: string }> = {
    low: { label: 'Baixa', color: '#6b7280' },
    medium: { label: 'Média', color: '#f59e0b' },
    high: { label: 'Alta', color: '#f97316' },
    urgent: { label: 'Urgente', color: '#ef4444' },
  };

  const filtered = activities.filter(a => {
    const matchDept = filterDept === 'todos' || a.department === filterDept;
    const matchStatus = filterStatus === 'todos' || a.status === filterStatus;
    return matchDept && matchStatus;
  });

  const departments = Array.from(new Set(activities.map(a => a.department)));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Colaboradores</h1>
          <p className={styles.subtitle}>{collaborators.length} colaboradores • {activities.length} atividades</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setEditingActivity({
            _id: '',
            title: '',
            description: '',
            assignedTo: { _id: '', name: '', email: '', department: '' },
            department: '',
            deadline: '',
            status: 'pending',
            priority: 'medium',
            createdBy: { _id: '', name: '', email: '' },
            createdAt: ''
          })}
        >
          + Nova Atividade
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <select 
            value={filterDept} 
            onChange={e => setFilterDept(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="todos">Todos os Departamentos</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="todos">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Progresso</option>
            <option value="completed">Concluída</option>
            <option value="overdue">Atrasada</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar atividades...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span>📋</span>
          <p>Nenhuma atividade encontrada.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(activity => {
            const statusInfo = statusLabels[activity.status] || { label: activity.status, color: '#888' };
            const priorityInfo = priorityLabels[activity.priority] || { label: activity.priority, color: '#888' };
            const isOverdue = activity.deadline && new Date(activity.deadline) < new Date() && activity.status !== 'completed';
            
            return (
              <div key={activity._id} className={`${styles.card} ${isOverdue ? styles.overdue : ''}`}>
                <div className={styles.cardHeader}>
                  <h3>{activity.title}</h3>
                  <span 
                    className={styles.statusBadge} 
                    style={{ background: statusInfo.color + '22', color: statusInfo.color, border: `1px solid ${statusInfo.color}44` }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                {activity.description && (
                  <p className={styles.description}>{activity.description}</p>
                )}
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Atribuído a:</span>
                    <span className={styles.metaValue}>{activity.assignedTo.name}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Departamento:</span>
                    <span className={styles.metaValue}>{activity.department}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Prioridade:</span>
                    <span 
                      className={styles.priorityBadge}
                      style={{ color: priorityInfo.color }}
                    >
                      {priorityInfo.label}
                    </span>
                  </div>
                  {activity.deadline && (
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Deadline:</span>
                      <span className={`${styles.metaValue} ${isOverdue ? styles.overdueText : ''}`}>
                        {new Date(activity.deadline).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditingActivity(activity)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(activity._id)}
                  >
                    🗑️ Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editingActivity && (
        <div className={styles.modalOverlay}>
          <div className={`glass ${styles.modal}`}>
            <header className={styles.modalHeader}>
              <h2 className="text-gradient-gold">
                {editingActivity._id ? 'Editar Atividade' : 'Nova Atividade'}
              </h2>
              <button className={styles.closeBtn} onClick={() => setEditingActivity(null)}>×</button>
            </header>
            
            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.field}>
                <label>Título *</label>
                <input 
                  value={editingActivity.title} 
                  onChange={e => setEditingActivity({...editingActivity, title: e.target.value})}
                  required
                  placeholder="Título da atividade"
                />
              </div>
              <div className={styles.field}>
                <label>Descrição</label>
                <textarea
                  value={editingActivity.description}
                  onChange={e => setEditingActivity({...editingActivity, description: e.target.value})}
                  placeholder="Descrição detalhada..."
                  rows={3}
                />
              </div>
              <div className={styles.field}>
                <label>Atribuir a *</label>
                <select 
                  value={editingActivity.assignedTo._id} 
                  onChange={e => {
                    const user = collaborators.find(c => c._id === e.target.value);
                    setEditingActivity({
                      ...editingActivity, 
                      assignedTo: user || { _id: '', name: '', email: '', department: '' },
                      department: user?.department || ''
                    });
                  }}
                  required
                >
                  <option value="">Selecione um colaborador</option>
                  {collaborators.map(collab => (
                    <option key={collab._id} value={collab._id}>
                      {collab.name} ({collab.department})
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Prioridade</label>
                <select 
                  value={editingActivity.priority} 
                  onChange={e => setEditingActivity({...editingActivity, priority: e.target.value as any})}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Deadline</label>
                <input 
                  type="date"
                  value={editingActivity.deadline ? editingActivity.deadline.split('T')[0] : ''}
                  onChange={e => setEditingActivity({...editingActivity, deadline: e.target.value})}
                />
              </div>
              {editingActivity._id && (
                <div className={styles.field}>
                  <label>Status</label>
                  <select 
                    value={editingActivity.status} 
                    onChange={e => setEditingActivity({...editingActivity, status: e.target.value as any})}
                  >
                    <option value="pending">Pendente</option>
                    <option value="in_progress">Em Progresso</option>
                    <option value="completed">Concluída</option>
                    <option value="overdue">Atrasada</option>
                  </select>
                </div>
              )}
              
              <div className={styles.modalActions}>
                <button type="button" className="btn-outline" onClick={() => setEditingActivity(null)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'A guardar...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
