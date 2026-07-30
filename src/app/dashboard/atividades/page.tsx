'use client';

import { useEffect, useState } from 'react';
import styles from './Atividades.module.css';

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

export default function DashboardAtividadesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    // Get current user from session
    const sessionCookie = document.cookie.split('; ').find(c => c.startsWith('abn_session='));
    if (sessionCookie) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie.split('=')[1]));
        setCurrentUserId(session.id);
        
        // Fetch activities for this user
        fetch(`/api/admin/activities?assignedTo=${session.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.activities) setActivities(data.activities);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (activityId: string, newStatus: string) => {
    const res = await fetch('/api/admin/activities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: activityId, status: newStatus }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setActivities(prev => prev.map(a => a._id === activityId ? data.activity : a));
    }
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
    const matchStatus = filterStatus === 'todos' || a.status === filterStatus;
    return matchStatus;
  });

  const stats = {
    total: activities.length,
    pending: activities.filter(a => a.status === 'pending').length,
    inProgress: activities.filter(a => a.status === 'in_progress').length,
    completed: activities.filter(a => a.status === 'completed').length,
    overdue: activities.filter(a => a.status === 'overdue' || (a.deadline && new Date(a.deadline) < new Date() && a.status !== 'completed')).length,
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Minhas Atividades</h1>
          <p className={styles.subtitle}>Gira as tuas tarefas e prazos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{stats.pending}</div>
          <div className={styles.statLabel}>Pendentes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#3b82f6' }}>{stats.inProgress}</div>
          <div className={styles.statLabel}>Em Progresso</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#10b981' }}>{stats.completed}</div>
          <div className={styles.statLabel}>Concluídas</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>{stats.overdue}</div>
          <div className={styles.statLabel}>Atrasadas</div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
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
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Atribuído por:</span>
                    <span className={styles.metaValue}>{activity.createdBy.name}</span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <select 
                    value={activity.status}
                    onChange={(e) => handleStatusUpdate(activity._id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Pendente</option>
                    <option value="in_progress">Em Progresso</option>
                    <option value="completed">Concluída</option>
                    <option value="overdue">Atrasada</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
