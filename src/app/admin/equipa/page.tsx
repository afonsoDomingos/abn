'use client';

import { useEffect, useState } from 'react';
import styles from './Equipa.module.css';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  expertise: string[];
  responsibilities: string[];
  image: string;
  linkedin: string;
  email: string;
  order: number;
  status: string;
}

export default function AdminEquipaPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [image, setImage] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState('ativo');
  const [uploadingImage, setUploadingImage] = useState(false);

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
    fetchTeam();
  }, []);

  const fetchTeam = () => {
    setLoading(true);
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.team) {
          // Show all members that are explicitly typed as Equipa,
          // OR that have executive roles (to catch legacy records without type set)
          const teamOnly = data.team.filter((m: any) => {
            const typeLower = (m.type || '').toLowerCase();
            const roleLower = (m.role || '').toLowerCase();

            // Always include if explicitly marked as Equipa
            if (typeLower === 'equipa') return true;

            // Include if no type was set AND has an executive role
            if (!m.type || m.type === '') {
              return (
                roleLower.includes('director') ||
                roleLower.includes('directora') ||
                roleLower.includes('presidente') ||
                roleLower.includes('assistente') ||
                roleLower.includes('coordenador')
              );
            }

            return false;
          });
          setTeam(teamOnly);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingId(member._id);
    setName(member.name || '');
    setRole(member.role || '');
    setDepartment(member.department || '');
    setBio(member.bio || '');
    setExpertise(member.expertise?.join('\n') || '');
    setResponsibilities(member.responsibilities?.join('\n') || '');
    setImage(member.image || '');
    setLinkedin(member.linkedin || '');
    setEmail(member.email || '');
    setOrder(member.order || 0);
    setStatus(member.status || 'ativo');
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setDepartment('');
    setBio('');
    setExpertise('');
    setResponsibilities('');
    setImage('');
    setLinkedin('');
    setEmail('');
    setOrder(team.length);
    setStatus('ativo');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      alert('Nome e Cargo são obrigatórios.');
      return;
    }

    setSaving(true);
    const payload = {
      name,
      role,
      department,
      type: 'Equipa',
      bio,
      expertise: expertise.split('\n').map(s => s.trim()).filter(s => s),
      responsibilities: responsibilities.split('\n').map(s => s.trim()).filter(s => s),
      image,
      linkedin,
      email,
      order,
      status,
    };

    try {
      const url = '/api/team';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? '✅ Membro atualizado com sucesso!' : '✅ Membro criado com sucesso!');
        fetchTeam();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao guardar membro.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja remover este membro? Esta ação não pode ser desfeita.')) return;
    try {
      const res = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTeam(prev => prev.filter(m => m._id !== id));
        setMsg('🗑️ Membro removido com sucesso!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao remover membro.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    }
  };

  const statusColor: Record<string, string> = {
    ativo: '#2e8b57',
    inativo: '#e74c3c',
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Equipa</h1>
          <p className={styles.subtitle}>{team.length} membros na equipa</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? '✕ Cancelar' : '+ Novo Membro'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h3>{editingId ? `Editar: ${name}` : 'Adicionar Novo Membro'}</h3>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Nome *</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Leonel Sapite"
              />
            </div>
            <div className={styles.field}>
              <label>Cargo *</label>
              <input
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Ex: Director de Programas"
              />
            </div>
            <div className={styles.field}>
              <label>Departamento</label>
              <input
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="Ex: Direcção de Programas, Incubação e Sustentabilidade"
              />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>LinkedIn URL</label>
              <input
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
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
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Pré-visualização da foto</span>
                </div>
              )}
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Biografia</label>
              <textarea
                rows={4}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Descreva o perfil profissional..."
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Expertise (uma por linha)</label>
              <textarea
                rows={4}
                value={expertise}
                onChange={e => setExpertise(e.target.value)}
                placeholder="Desenvolvimento Comunitário&#10;Empreendedorismo&#10;Direitos Humanos"
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Responsabilidades (uma por linha)</label>
              <textarea
                rows={4}
                value={responsibilities}
                onChange={e => setResponsibilities(e.target.value)}
                placeholder="Liderança estratégica dos programas&#10;Incubação de empresas&#10;Aceleração de negócios"
              />
            </div>
            <div className={styles.field}>
              <label>Ordem de Exibição</label>
              <input
                type="number"
                value={order}
                onChange={e => setOrder(Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label>Estado</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar Membro'}
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
          <p>A carregar equipa...</p>
        </div>
      ) : team.length === 0 ? (
        <div className={styles.empty}>
          <span>👥</span>
          <p>Nenhum membro cadastrado no momento.</p>
          <button className="btn-primary" onClick={handleCreateClick}>Adicionar Primeiro Membro</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {team.map(member => (
            <div key={member._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.department}>{member.department}</span>
                <span
                  className={styles.statusBadge}
                  style={{
                    background: statusColor[member.status] + '22',
                    color: statusColor[member.status],
                    border: `1px solid ${statusColor[member.status]}44`,
                  }}
                >
                  {member.status}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{member.name}</h3>
              <p className={styles.cardRole}>{member.role}</p>

              <div className={styles.cardDetails}>
                {member.expertise && member.expertise.length > 0 && (
                  <div className={styles.detailItem}>
                    <span>Expertise:</span>
                    <strong>{member.expertise.length} itens</strong>
                  </div>
                )}
                {member.responsibilities && member.responsibilities.length > 0 && (
                  <div className={styles.detailItem}>
                    <span>Responsabilidades:</span>
                    <strong>{member.responsibilities.length} itens</strong>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button className={styles.editBtn} onClick={() => handleEditClick(member)}>
                  ✏️ Editar
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(member._id)}>
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
