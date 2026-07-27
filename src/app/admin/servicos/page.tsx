'use client';

import { useEffect, useState } from 'react';
import styles from './Servicos.module.css';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  status: string;
  createdAt: string;
}

export default function AdminServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Marketing Digital', status: 'ativo', image: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    fetch('/api/admin/services')
      .then(res => res.json())
      .then(data => {
        if (data.services) setServices(data.services);
        setLoading(false);
      });
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      status: service.status,
      image: service.image || ''
    });
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) setForm(prev => ({ ...prev, image: data.url }));
      else alert(data.error || 'Erro no upload.');
    } catch {
      alert('Erro de conexão.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const isEdit = !!editingService;
    const url = '/api/admin/services';
    const method = isEdit ? 'PUT' : 'POST';
    const body = isEdit ? { ...form, id: editingService._id } : form;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      if (isEdit) {
        setServices(prev => prev.map(s => s._id === editingService._id ? data.service : s));
        setMsg('✅ Serviço atualizado com sucesso!');
      } else {
        setServices(prev => [data.service, ...prev]);
        setMsg('✅ Serviço adicionado com sucesso!');
      }
      setForm({ name: '', description: '', price: '', category: 'Marketing Digital', status: 'ativo', image: '' });
      setEditingService(null);
      setShowForm(false);
      setTimeout(() => setMsg(''), 3000);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este serviço?')) return;
    const res = await fetch('/api/admin/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setServices(prev => prev.filter(s => s._id !== id));
  };

  const statusColor: Record<string, string> = {
    ativo: '#2e8b57',
    inativo: '#e74c3c',
    pendente: '#f39c12',
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Serviços</h1>
          <p className={styles.subtitle}>{services.length} serviços no catálogo</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => {
          if (showForm) {
            setEditingService(null);
            setForm({ name: '', description: '', price: '', category: 'Marketing Digital', status: 'ativo', image: '' });
          }
          setShowForm(!showForm);
        }}>
          {showForm ? '✕ Cancelar' : '+ Novo Serviço'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{editingService ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Nome do Serviço *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Criação de Website" />
            </div>
            <div className={styles.field}>
              <label>Preço *</label>
              <input required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Ex: 15.000 MT/mês" />
            </div>
            <div className={styles.field}>
              <label>Categoria</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option>Marketing Digital</option>
                <option>Incubação</option>
                <option>Design</option>
                <option>Consultoria</option>
                <option>Tecnologia</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Estado</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Foto de Capa (URL ou Upload)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="URL da foto de capa" style={{ flex: 1 }} />
                <label style={{ cursor: 'pointer', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                  {uploadingImage ? '⏳...' : '📁 Subir'}
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Descrição *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descreva o serviço..." />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar Serviço'}
          </button>
        </form>
      )}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar serviços...</p>
        </div>
      ) : services.length === 0 ? (
        <div className={styles.empty}>
          <span>🛍️</span>
          <p>Nenhum serviço criado ainda.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Adicionar Primeiro Serviço</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {services.map(service => (
            <div key={service._id} className={styles.card}>
              {service.image && (
                <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderRadius: '16px 16px 0 0', margin: '-1.5rem -1.5rem 1rem -1.5rem', width: 'calc(100% + 3rem)' }}>
                  <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className={styles.cardHeader}>
                <span className={styles.category}>{service.category}</span>
                <span className={styles.statusBadge} style={{ background: statusColor[service.status] + '22', color: statusColor[service.status], border: `1px solid ${statusColor[service.status]}44` }}>
                  {service.status}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{service.name}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.price}>{service.price}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={styles.editBtn} onClick={() => handleEditClick(service)}>✏️ Editar</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(service._id)}>🗑️ Remover</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
