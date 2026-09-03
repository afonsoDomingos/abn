'use client';

import { useEffect, useState } from 'react';
import styles from './Especialistas.module.css';

interface SpecialistMember {
  _id: string;
  name: string;
  role: string;
  type: string;
  department: string;
  country?: string;
  bio: string;
  expertise: string[];
  image: string;
  linkedin: string;
  email: string;
  website?: string;
  phone?: string;
  order: number;
  status: string;
}

const COUNTRIES = [
  'Moçambique',
  'Angola',
  'Cabo Verde',
  'Guiné-Bissau',
  'São Tomé e Príncipe',
  'África do Sul',
  'Nigéria',
  'Quénia',
  'Gana',
  'Ruanda',
  'Portugal',
  'Brasil',
  'Outro'
];

export default function AdminEspecialistasPage() {
  const [list, setList] = useState<SpecialistMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState('Especialista');
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('Moçambique');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [image, setImage] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState('ativo');

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
      } else {
        alert(data.error || 'Erro no upload da imagem.');
      }
    } catch {
      alert('Erro de conexão ao carregar imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.team) {
          const specOnly = data.team.filter((m: any) => {
            if (m.type === 'Equipa' || m.type === 'equipa') return false;
            const dept = (m.department || '').toLowerCase();
            const role = (m.role || '').toLowerCase();
            if (dept.includes('direc') || role.includes('director') || role.includes('directora') || role.includes('presidente') || role.includes('assistente')) {
              return false;
            }
            return true;
          });
          setList(specOnly);
        }
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
    setCountry('Moçambique');
    setBio('');
    setExpertise('');
    setImage('');
    setLinkedin('');
    setEmail('');
    setWebsite('');
    setPhone('');
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
    setCountry(member.country || 'Moçambique');
    setBio(member.bio || '');
    setExpertise(member.expertise?.join('\n') || '');
    setImage(member.image || '');
    setLinkedin(member.linkedin || '');
    setEmail(member.email || '');
    setWebsite(member.website || '');
    setPhone(member.phone || '');
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
      country,
      bio,
      expertise: expertise.split('\n').map(s => s.trim()).filter(Boolean),
      image,
      linkedin,
      email,
      website,
      phone,
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
                <label>País *</label>
                <input
                  type="text"
                  list="countries-list"
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Selecione ou escreva o país (ex: Moçambique, Angola, Alemanha...)"
                />
                <datalist id="countries-list">
                  {COUNTRIES.map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className={styles.formGroup}>
                <label>Foto de Perfil (URL ou Upload de Ficheiro)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="/Perfil01.jpg ou https://..."
                    style={{ flex: 1 }}
                  />
                  <label
                    style={{
                      cursor: 'pointer',
                      padding: '0.75rem 1rem',
                      background: 'var(--primary, #ff6b00)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {uploadingImage ? '⏳ A carregar...' : '📁 Escolher Foto'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {image && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={image}
                      alt="Pré-visualização"
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ff6b00' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>Pré-visualização da foto</span>
                  </div>
                )}
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
                <label>Website / Portfólio (URL)</label>
                <input
                  type="text"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://exemplo.com ou https://meuportfolio.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>WhatsApp / Telefone de Contacto</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Ex: +258 84 123 4567"
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

      {/* Desktop Table & Mobile Cards Container */}
      <div className={styles.contentWrapper}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>A carregar perfis...</div>
        ) : filteredList.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
            Nenhum registo encontrado para este filtro.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Profissional</th>
                    <th>Tipo</th>
                    <th>Área / Departamento</th>
                    <th>País</th>
                    <th>Contactos</th>
                    <th>Expertise</th>
                    <th>Status</th>
                    <th>Acções</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map(item => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={item.image && item.image.trim() ? item.image : '/abn-logo.png'}
                            alt=""
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              objectFit: item.image && item.image.trim() ? 'cover' : 'contain',
                              padding: item.image && item.image.trim() ? 0 : '4px',
                              background: item.image && item.image.trim() ? undefined : '#fff7ed',
                              border: '1.5px solid #ff6b00',
                              flexShrink: 0
                            }}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/abn-logo.png';
                              target.style.objectFit = 'contain';
                              target.style.padding = '4px';
                              target.style.background = '#fff7ed';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{item.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.typeBadge}>
                          {item.type || 'Especialista'}
                        </span>
                      </td>
                      <td>{item.department || '-'}</td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          📍 {item.country || 'Moçambique'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {item.linkedin && (
                            <a href={item.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: '#0a66c2', fontSize: '1rem', textDecoration: 'none' }}>
                              🔗
                            </a>
                          )}
                          {item.website && (
                            <a href={item.website} target="_blank" rel="noreferrer" title="Website / Portfólio" style={{ color: '#ff6b00', fontSize: '1rem', textDecoration: 'none' }}>
                              🌐
                            </a>
                          )}
                          {item.email && (
                            <a href={`mailto:${item.email}`} title="Email" style={{ color: '#10b981', fontSize: '1rem', textDecoration: 'none' }}>
                              ✉️
                            </a>
                          )}
                          {item.phone && (
                            <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" style={{ color: '#25d366', fontSize: '1rem', textDecoration: 'none' }}>
                              📱
                            </a>
                          )}
                          {!item.linkedin && !item.website && !item.email && !item.phone && (
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>—</span>
                          )}
                        </div>
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {item.expertise && item.expertise.length > 0 ? (
                            item.expertise.slice(0, 2).map((exp, i) => {
                              const cleanExp = exp.length > 32 ? exp.substring(0, 30) + '...' : exp;
                              return (
                                <span key={i} className={styles.chip} title={exp}>
                                  {cleanExp}
                                </span>
                              );
                            })
                          ) : (
                            <span style={{ color: '#666' }}>-</span>
                          )}
                        </div>
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
            </div>

            {/* Mobile Cards Grid View (< 768px) */}
            <div className={styles.mobileCardsGroup}>
              {filteredList.map(item => (
                <div key={item._id} className={styles.mobileCard}>
                  <div className={styles.mobileCardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.image && item.image.trim() ? item.image : '/abn-logo.png'}
                        alt=""
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          objectFit: item.image && item.image.trim() ? 'cover' : 'contain',
                          padding: item.image && item.image.trim() ? 0 : '4px',
                          background: item.image && item.image.trim() ? undefined : '#fff7ed',
                          border: '1.5px solid #ff6b00'
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/abn-logo.png';
                          target.style.objectFit = 'contain';
                          target.style.padding = '4px';
                          target.style.background = '#fff7ed';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#ff8c00', fontWeight: 600 }}>{item.role}</div>
                      </div>
                    </div>
                    <span className={styles.typeBadge}>{item.type || 'Especialista'}</span>
                  </div>

                  <div className={styles.mobileCardBody}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', margin: '0.4rem 0' }}>
                      <span>📍 {item.country || 'Moçambique'}</span>
                      <span className={`${styles.statusBadge} ${item.status === 'ativo' ? styles.active : styles.inactive}`}>
                        {item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    {item.department && (
                      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
                        <strong>Área:</strong> {item.department}
                      </div>
                    )}

                    {item.expertise && item.expertise.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '0.5rem 0' }}>
                        {item.expertise.slice(0, 3).map((exp, i) => (
                          <span key={i} className={styles.chip} title={exp}>
                            {exp.length > 35 ? exp.substring(0, 32) + '...' : exp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.mobileCardFooter}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {item.linkedin && <a href={item.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">🔗</a>}
                      {item.email && <a href={`mailto:${item.email}`} title="Email">✉️</a>}
                      {item.phone && <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp">📱</a>}
                    </div>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => handleEdit(item)}>Editar</button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item._id)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
