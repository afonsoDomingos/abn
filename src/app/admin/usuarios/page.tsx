'use client';

import { useEffect, useState } from 'react';
import styles from './Usuarios.module.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  admin: { label: 'Admin', color: '#d4af37' },
  empreendedor: { label: 'Empreendedor', color: '#2e8b57' },
  startup: { label: 'Startup', color: '#3b82f6' },
  investidor: { label: 'Investidor', color: '#a855f7' },
  mentor: { label: 'Mentor', color: '#f97316' },
};

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setUsers(prev => prev.filter(u => u._id !== id));
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filter === 'todos' || u.role === filter;
    return matchSearch && matchRole;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Usuários</h1>
          <p className={styles.subtitle}>{users.length} utilizadores registados</p>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="🔍  Pesquisar por nome ou email..."
          className={styles.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          {['todos', 'empreendedor', 'startup', 'investidor', 'mentor', 'admin'].map(r => (
            <button
              key={r}
              className={`${styles.filterBtn} ${filter === r ? styles.active : ''}`}
              onClick={() => setFilter(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar utilizadores...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span>👥</span>
          <p>Nenhum utilizador encontrado.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Utilizador</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Registado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const roleInfo = roleLabels[user.role] || { label: user.role, color: '#888' };
                return (
                  <tr key={user._id} className={styles.row}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className={styles.email}>{user.email}</td>
                    <td>
                      <span className={styles.badge} style={{ background: roleInfo.color + '22', color: roleInfo.color, border: `1px solid ${roleInfo.color}44` }}>
                        {roleInfo.label}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {new Date(user.createdAt).toLocaleDateString('pt-PT')}
                    </td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(user._id)}
                        title="Remover utilizador"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
