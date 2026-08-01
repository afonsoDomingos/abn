'use client';

import { useEffect, useState } from 'react';
import styles from './Especialistas.module.css';

interface SpecialistMember {
  _id: string;
  name: string;
  role: string;
  type: string;
  department: string;
  bio: string;
  expertise: string[];
  image: string;
  linkedin: string;
  email: string;
  order: number;
  status: string;
}

export default function AdminEspecialistasPage() {
  const [list, setList] = useState<SpecialistMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState('Especialista');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [image, setImage] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState('ativo');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.team) setList(data.team);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setType('Especialista');
    setDepartment('');
    setBio('');
    setExpertise('');
    setImage('');
    setLinkedin('');
    setEmail('');
    setOrder(0);
    setStatus('ativo');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (member: SpecialistMember) => {
    setEditingId(member._id);
    setName(member.name);
    setRole(member.role);
    setType(member.type || 'Especialista');
    setDepartment(member.department || '');
    setBio(member.bio || '');
    setExpertise(member.expertise?.join('\n') || '');
    setImage(member.image || '');
    setLinkedin(member.linkedin || '');
    setEmail(member.email || '');
    setOrder(member.order || 0);
    setStatus(member.status || 'ativo');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const payload = {
      name,
      role,
      type,
      department,
      bio,
      expertise: expertise.split('\n').map(s => s.trim()).filter(Boolean),
      image,
      linkedin,
      email,
      order: Number(order),
      status
    };

    try {
      const url = '/api/team';
      const method = editingId ? 'PUT' : 'POST';
      const bodyData = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? 'Perfil atualizado com sucesso!' : 'Perfil adicionado com sucesso!');
        resetForm();
        fetchData();
      } else {
        alert(data.error || 'Erro ao guardar dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza de que deseja eliminar este especialista/mentor?')) return;
    try {
      const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMsg('Registo eliminado com sucesso!');
        fetchData();
      } else {
        alert(data.error || 'Erro ao eliminar.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    }
  };

  const filteredList = activeFilter === 'Todos'
    ? list
    : list.filter(item => (item.type || 'Especialista') === activeFilter);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Gestão de Especialistas, Mentores & Formadores</h1>
          <p className={styles.subtitle}>Cadastre e faça a gestão dos profissionais da rede da ABN</p>
        </div>
        <button
          className={styles.actionBtn}
          style={{ background: 'var(--primary, #ff6b00)', padding: '0.75rem 1.5rem', fontWeight: 700 }}
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
        >
          {showForm ? 'Fechar Formulário' : '+ Adicionar Novo'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {/* Form */}
      {showForm && (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h3>{editingId ? 'Editar Perfil de Especialista/Mentor' : 'Novo Especialista, Mentor ou Formador'}</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Dra. Maria Santos"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tipo de Perfil *</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                  <option value="Especialista">Especialista</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Formador">Formador</option>
                  <option value="Consultor">Consultor</option>
                  <option value="Equipa">Equipa Executiva</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Cargo / Título Profissional *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="Ex: Especialista em IA & Automação / Mentor Financeiro"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Área / Departamento *</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="Ex: Tecnologia & Inovação, Finanças, Comunicação"
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL da Foto (imagem de perfil)</label>
                <input
                  type="text"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="/Perfil01.jpg ou https://..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>LinkedIn (URL)</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/perfil"
                />
              </div>

              <div className={styles.formGroup}>
                <label>E-mail de Contacto</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contacto@exemplo.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="ativo">Ativo (Publicado)</option>
                  <option value="inativo">Inativo (Rascunho)</option>
                </select>
              </div>

              <div className={styles.formGroupFull}>
                <label>Áreas de Expertise (uma por linha)</label>
                <textarea
                  rows={3}
                  value={expertise}
                  onChange={e => setExpertise(e.target.value)}
                  placeholder={"Inteligência Artificial\nModelagem Financeira\nBranding Estratégico"}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label>Biografia / Percurso Profissional</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Resumo do histórico profissional, experiência e conquistas..."
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.actionBtn} onClick={resetForm}>
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.actionBtn}
                style={{ background: 'var(--primary, #ff6b00)', fontWeight: 700 }}
                disabled={saving}
              >
                {saving ? 'A guardar...' : editingId ? 'Atualizar Perfil' : 'Cadastrar Perfil'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {['Todos', 'Especialista', 'Mentor', 'Formador', 'Consultor', 'Equipa'].map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeFilter === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>A carregar perfis...</div>
        ) : filteredList.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
            Nenhum registo encontrado para este filtro.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Profissional</th>
                <th>Tipo</th>
                <th>Área / Departamento</th>
                <th>Expertise</th>
                <th>Status</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map(item => (
                <tr key={item._id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{item.role}</div>
                  </td>
                  <td>
                    <span className={styles.typeBadge}>
                      {item.type || 'Especialista'}
                    </span>
                  </td>
                  <td>{item.department || '-'}</td>
                  <td>
                    {item.expertise && item.expertise.length > 0 ? (
                      item.expertise.slice(0, 3).map((exp, i) => (
                        <span key={i} className={styles.chip}>{exp}</span>
                      ))
                    ) : (
                      <span style={{ color: '#666' }}>-</span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${item.status === 'ativo' ? styles.active : styles.inactive}`}>
                      {item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => handleEdit(item)}>
                        Editar
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(item._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
