'use client';

import { useEffect, useState } from 'react';
import styles from './Departamentos.module.css';

interface Department {
  _id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export default function AdminDepartamentosPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/departments')
      .then(res => res.json())
      .then(data => {
        if (data.departments) setDepartments(data.departments);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este departamento?')) return;
    const res = await fetch('/api/admin/departments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setDepartments(prev => prev.filter(d => d._id !== id));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    
    setSaving(true);
    const isEdit = !!editingDept._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = '/api/admin/departments';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingDept._id,
        name: editingDept.name,
        description: editingDept.description,
        color: editingDept.color
      }),
    });
    
    if (res.ok) {
      const data = await res.json();
      if (isEdit) {
        setDepartments(prev => prev.map(d => d._id === editingDept._id ? data.department : d));
      } else {
        setDepartments(prev => [...prev, data.department]);
      }
      setEditingDept(null);
    }
    setSaving(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Departamentos</h1>
          <p className={styles.subtitle}>{departments.length} departamentos registados</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setEditingDept({ _id: '', name: '', description: '', color: '#ff6b00', createdAt: '' })}
        >
          + Novo Departamento
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar departamentos...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className={styles.empty}>
          <span>🏢</span>
          <p>Nenhum departamento encontrado.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {departments.map(dept => (
            <div key={dept._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div 
                  className={styles.colorDot} 
                  style={{ backgroundColor: dept.color }}
                />
                <h3>{dept.name}</h3>
              </div>
              {dept.description && (
                <p className={styles.description}>{dept.description}</p>
              )}
              <div className={styles.cardActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => setEditingDept(dept)}
                >
                  ✏️ Editar
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(dept._id)}
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editingDept && (
        <div className={styles.modalOverlay}>
          <div className={`glass ${styles.modal}`}>
            <header className={styles.modalHeader}>
              <h2 className="text-gradient-gold">
                {editingDept._id ? 'Editar Departamento' : 'Novo Departamento'}
              </h2>
              <button className={styles.closeBtn} onClick={() => setEditingDept(null)}>×</button>
            </header>
            
            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.field}>
                <label>Nome do Departamento *</label>
                <input 
                  value={editingDept.name} 
                  onChange={e => setEditingDept({...editingDept, name: e.target.value})}
                  required
                  placeholder="Ex: Marketing, TI, Recursos Humanos"
                />
              </div>
              <div className={styles.field}>
                <label>Descrição</label>
                <textarea
                  value={editingDept.description}
                  onChange={e => setEditingDept({...editingDept, description: e.target.value})}
                  placeholder="Breve descrição do departamento..."
                  rows={3}
                />
              </div>
              <div className={styles.field}>
                <label>Cor</label>
                <input 
                  type="color"
                  value={editingDept.color} 
                  onChange={e => setEditingDept({...editingDept, color: e.target.value})}
                  className={styles.colorInput}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className="btn-outline" onClick={() => setEditingDept(null)}>Cancelar</button>
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
