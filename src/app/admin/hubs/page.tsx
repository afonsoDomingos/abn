'use client';

import { useEffect, useState } from 'react';
import styles from './HubsAdmin.module.css';

interface HubEvent {
  title: string;
  date: string;
  description: string;
  type: 'past' | 'future';
  link?: string;
  image?: string;
}

interface Hub {
  slug: string;
  name: string;
  image: string;
  description: string;
  steps: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  address: string;
  email: string;
  phone: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  events: HubEvent[];
}

export default function AdminHubsPage() {
  const [hubs, setHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  
  // Form view toggling
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Image upload loading state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  // Representative states
  const [repName, setRepName] = useState('');
  const [repRole, setRepRole] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repPhone, setRepPhone] = useState('');
  const [repImage, setRepImage] = useState('');
  const [uploadingRepImage, setUploadingRepImage] = useState(false);

  // Local Team states
  const [team, setTeam] = useState<Array<{ name: string; role: string; image?: string }>>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberImage, setNewMemberImage] = useState('');
  const [uploadingMemberImage, setUploadingMemberImage] = useState(false);

  // Array structures
  const [steps, setSteps] = useState([
    { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio.' },
    { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor a investidores.' },
    { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica e ferramentas de escala global.' }
  ]);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [events, setEvents] = useState<HubEvent[]>([]);

  // Partners states
  const [partners, setPartners] = useState<Array<{ name: string; logo: string }>>([]);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerLogo, setNewPartnerLogo] = useState('');
  const [uploadingPartnerLogo, setUploadingPartnerLogo] = useState(false);

  // Add event helper state
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtDate, setNewEvtDate] = useState('');
  const [newEvtDesc, setNewEvtDesc] = useState('');
  const [newEvtType, setNewEvtType] = useState<'past' | 'future'>('future');
  const [newEvtLink, setNewEvtLink] = useState('');
  const [newEvtImage, setNewEvtImage] = useState('');
  const [uploadingEvtImage, setUploadingEvtImage] = useState(false);

  // Fetch all hubs
  const loadHubs = () => {
    setLoading(true);
    fetch('/api/hubs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHubs(data.hubs || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadHubs();
  }, []);

  const triggerToast = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  // Open Create Mode
  const startCreate = () => {
    setName('');
    setSlug('');
    setImage('');
    setDescription('');
    setAddress('');
    setEmail('');
    setPhone('');
    setFacebookUrl('');
    setInstagramUrl('');
    setLinkedinUrl('');
    setYoutubeUrl('');
    setRepName('');
    setRepRole('');
    setRepEmail('');
    setRepPhone('');
    setRepImage('');
    setTeam([]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberImage('');
    setPartners([]);
    setNewPartnerName('');
    setNewPartnerLogo('');
    setSteps([
      { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio.' },
      { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor a investidores.' },
      { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica e ferramentas de escala global.' }
    ]);
    setFaqs([]);
    setEvents([]);
    setIsCreating(true);
    setEditingSlug(null);
  };

  // Open Edit Mode
  const startEdit = (hubSlug: string) => {
    fetch(`/api/hubs/${hubSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.hub) {
          const h = data.hub;
          setName(h.name);
          setSlug(h.slug);
          setImage(h.image);
          setDescription(h.description);
          setAddress(h.address);
          setEmail(h.email);
          setPhone(h.phone);
          setFacebookUrl(h.facebookUrl || '');
          setInstagramUrl(h.instagramUrl || '');
          setLinkedinUrl(h.linkedinUrl || '');
          setYoutubeUrl(h.youtubeUrl || '');
          setSteps(h.steps || []);
          setFaqs(h.faqs || []);
          setEvents(h.events || []);

          const r = h.representative || { name: '', role: '', email: '', phone: '', image: '/default-avatar.png' };
          setRepName(r.name);
          setRepRole(r.role);
          setRepEmail(r.email);
          setRepPhone(r.phone);
          setRepImage(r.image || '');
          setTeam(h.team || []);
          setNewMemberName('');
          setNewMemberRole('');
          setNewMemberImage('');

          setPartners(h.partners || []);
          setNewPartnerName('');
          setNewPartnerLogo('');

          setEditingSlug(hubSlug);
          setIsCreating(false);
        }
      });
  };

  // Delete Hub
  const handleDelete = async (hubSlug: string) => {
    if (!confirm('Deseja realmente eliminar esta delegação?')) return;
    
    try {
      const res = await fetch(`/api/hubs/${hubSlug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerToast('Delegação eliminada com sucesso!');
        loadHubs();
      } else {
        alert(data.error || 'Erro ao eliminar.');
      }
    } catch {
      alert('Erro na conexão.');
    }
  };

  // Save changes (Create or Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !image || !description || !address || !email || !phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    const method = isCreating ? 'POST' : 'PUT';
    const endpoint = isCreating ? '/api/hubs' : `/api/hubs/${editingSlug}`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          image,
          description,
          address,
          email,
          phone,
          facebookUrl,
          instagramUrl,
          linkedinUrl,
          youtubeUrl,
          steps,
          faqs,
          events,
          representative: {
            name: repName,
            role: repRole,
            email: repEmail,
            phone: repPhone,
            image: repImage || '/default-avatar.png'
          },
          team,
          partners
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerToast(isCreating ? 'Delegação criada com sucesso!' : 'Delegação atualizada!');
        setIsCreating(false);
        setEditingSlug(null);
        loadHubs();
      } else {
        alert(data.error || 'Erro ao guardar.');
      }
    } catch {
      alert('Erro na conexão.');
    } finally {
      setSaving(false);
    }
  };

  // Add Event
  const addEvent = () => {
    if (!newEvtTitle || !newEvtDate || !newEvtDesc) {
      alert('Preencha o título, data e descrição do evento.');
      return;
    }
    const newEvt: HubEvent = {
      title: newEvtTitle,
      date: newEvtDate,
      description: newEvtDesc,
      type: newEvtType,
      link: newEvtLink || undefined,
      image: newEvtImage || undefined
    };
    setEvents([...events, newEvt]);
    setNewEvtTitle('');
    setNewEvtDate('');
    setNewEvtDesc('');
    setNewEvtLink('');
    setNewEvtImage('');
  };

  // Add Team Member
  const addTeamMember = () => {
    if (!newMemberName || !newMemberRole) {
      alert('Preencha o nome e o cargo do membro da equipa.');
      return;
    }
    setTeam([...team, { name: newMemberName, role: newMemberRole, image: newMemberImage || '/default-avatar.png' }]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberImage('');
  };

  // Add Partner
  const addPartner = () => {
    if (!newPartnerName) {
      alert('Preencha o nome do parceiro.');
      return;
    }
    setPartners([...partners, { name: newPartnerName, logo: newPartnerLogo || '🤝' }]);
    setNewPartnerName('');
    setNewPartnerLogo('');
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>A carregar delegações...</div>;
  }

  return (
    <div className={styles.page}>
      {msg && <div className={styles.toast}>{msg}</div>}

      {/* List View */}
      {!isCreating && !editingSlug && (
        <>
          <div className={styles.header}>
            <div>
              <h1 className="text-gradient-gold">Delegações Locais (Hubs)</h1>
              <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Crie e faça a gestão das delegações físicas da ABN por país.</p>
            </div>
            <button className="btn-primary" onClick={startCreate}>+ Nova Delegação</button>
          </div>

          {hubs.length === 0 ? (
            <div className="glass" style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center' }}>
              <p style={{ opacity: 0.6 }}>Nenhuma delegação criada no ecossistema.</p>
              <button className="btn-outline" onClick={startCreate} style={{ marginTop: '1rem' }}>Criar Delegação</button>
            </div>
          ) : (
            <div className={styles.hubGrid}>
              {hubs.map((hub: any) => (
                <div key={hub.slug} className={styles.hubCard}>
                  <img src={hub.image} alt={hub.name} className={styles.hubCardImg} />
                  <div className={styles.hubCardBody}>
                    <h3>{hub.name}</h3>
                    <span className={styles.slugBadge}>/country/{hub.slug}</span>
                    <p>{hub.description}</p>
                    
                    <div className={styles.hubCardActions}>
                      <button className={styles.editBtn} onClick={() => startEdit(hub.slug)}>Editar</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(hub.slug)}>Remover</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create / Edit Form View */}
      {(isCreating || editingSlug) && (
        <form onSubmit={handleSave} className={styles.formSection}>
          <div className={styles.header} style={{ marginBottom: '1rem' }}>
            <div>
              <h1 className="text-gradient-gold">
                {isCreating ? 'Criar Nova Delegação' : `Editar Delegação: ${name}`}
              </h1>
              <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Configure as informações, parceiros locais e os eventos do hub.</p>
            </div>
            <button type="button" className="btn-outline" onClick={() => { setIsCreating(false); setEditingSlug(null); }}>
              Cancelar
            </button>
          </div>

          <div className={styles.formGrid}>
            {/* Left Block: Core fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className={styles.sectionHeader}>Informações Base</div>
              
              <div className={styles.formGroup}>
                <label>Nome do País / Delegação *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Guiné-Bissau" required />
              </div>

              <div className={styles.formGroup}>
                <label>Slug de Endereço URL *</label>
                <input 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)} 
                  placeholder="Ex: quinebissau" 
                  disabled={!!editingSlug} 
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Imagem de Fundo (Upload ou URL) *</label>
                <div className={styles.uploadRow}>
                  <input value={image} onChange={e => setImage(e.target.value)} placeholder="Ex: /guine_bissau_banner.png" style={{ flex: 1 }} required />
                  <label className={styles.uploadLabel} title="Carregar Imagem" style={{ cursor: 'pointer' }}>
                    {uploadingImage ? <div className={styles.spinnerSmall}></div> : '📁'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        setUploadingImage(true);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const data = await res.json();
                          if (data.success && data.url) {
                            setImage(data.url);
                          } else {
                            alert('Erro: ' + (data.error || 'Falha no upload'));
                          }
                        } catch {
                          alert('Erro de conexão ao carregar.');
                        } finally {
                          setUploadingImage(false);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Descrição Detalhada *</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Descreva a atuação da ABN neste país, o impacto local e os programas que serão decorridos." 
                  rows={5} 
                  required 
                />
              </div>
            </div>

            {/* Right Block: Contacts & Socials */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className={styles.sectionHeader}>Contactos do Hub</div>

              <div className={styles.formGroup}>
                <label>Morada / Endereço Físico *</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Av. Combatentes, Bissau" required />
              </div>

              <div className={styles.formGroup}>
                <label>Email de Contacto *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ex: guinebissau@afrobiznetwork.com" required />
              </div>

              <div className={styles.formGroup}>
                <label>Telefone de Contacto *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: +245 955 000 000" required />
              </div>

              <div className={styles.sectionHeader} style={{ marginTop: '1.5rem' }}>Representante Local</div>

              <div className={styles.formGroup}>
                <label>Nome do Representante</label>
                <input value={repName} onChange={e => setRepName(e.target.value)} placeholder="Ex: Mamadu Baldé" />
              </div>

              <div className={styles.formGroup}>
                <label>Cargo / Função do Representante</label>
                <input value={repRole} onChange={e => setRepRole(e.target.value)} placeholder="Ex: Diretor de Delegação" />
              </div>

              <div className={styles.formGroup}>
                <label>Email do Representante</label>
                <input type="email" value={repEmail} onChange={e => setRepEmail(e.target.value)} placeholder="Ex: representante@email.com" />
              </div>

              <div className={styles.formGroup}>
                <label>Telefone do Representante</label>
                <input value={repPhone} onChange={e => setRepPhone(e.target.value)} placeholder="Ex: +245 955 123 456" />
              </div>

              <div className={styles.formGroup}>
                <label>Foto do Representante (Upload ou URL)</label>
                <div className={styles.uploadRow}>
                  <input value={repImage} onChange={e => setRepImage(e.target.value)} placeholder="Ex: /default-avatar.png" style={{ flex: 1 }} />
                  <label className={styles.uploadLabel} title="Carregar Foto" style={{ cursor: 'pointer' }}>
                    {uploadingRepImage ? <div className={styles.spinnerSmall}></div> : '📁'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        setUploadingRepImage(true);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const data = await res.json();
                          if (data.success && data.url) {
                            setRepImage(data.url);
                          } else {
                            alert('Erro: ' + (data.error || 'Falha no upload'));
                          }
                        } catch {
                          alert('Erro de conexão ao carregar.');
                        } finally {
                          setUploadingRepImage(false);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.sectionHeader} style={{ marginTop: '1.5rem' }}>Redes Sociais</div>

              <div className={styles.formGroup}>
                <label>Link do Facebook</label>
                <input value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/..." />
              </div>

              <div className={styles.formGroup}>
                <label>Link do Instagram</label>
                <input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." />
              </div>

              <div className={styles.formGroup}>
                <label>Link do LinkedIn</label>
                <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>

              <div className={styles.formGroup}>
                <label>Link do YouTube</label>
                <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>

          {/* Steps Section Config */}
          <div>
            <div className={styles.sectionHeader}>Passos do Processo de Candidatura (Máximo 3)</div>
            <div className={styles.formGrid}>
              {steps.map((step, idx) => (
                <div key={idx} className={styles.subItemBox}>
                  <div className={styles.subItemTitle}>PASSO {idx + 1}</div>
                  <div className={styles.formGroup}>
                    <label>Título do Passo</label>
                    <input 
                      value={step.title} 
                      onChange={e => {
                        const newSteps = [...steps];
                        newSteps[idx].title = e.target.value;
                        setSteps(newSteps);
                      }} 
                      placeholder="Ex: Candidatura Online" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Descrição do Passo</label>
                    <textarea 
                      value={step.description} 
                      onChange={e => {
                        const newSteps = [...steps];
                        newSteps[idx].description = e.target.value;
                        setSteps(newSteps);
                      }} 
                      placeholder="Explique o que o candidato precisa de fazer."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eventos Section Config */}
          <div>
            <div className={styles.sectionHeader}>Gestão de Eventos (Passados ou Futuros)</div>
            
            {/* Create Event Block inside form */}
            <div className={styles.subItemBox} style={{ background: 'rgba(212,175,55,0.02)', borderColor: 'rgba(212,175,55,0.15)' }}>
              <div className={styles.subItemTitle} style={{ color: 'var(--primary)' }}>+ Adicionar Novo Evento</div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Título do Evento</label>
                  <input value={newEvtTitle} onChange={e => setNewEvtTitle(e.target.value)} placeholder="Ex: Hackathon Bissau Spark" />
                </div>
                <div className={styles.formGroup}>
                  <label>Data / Período</label>
                  <input value={newEvtDate} onChange={e => setNewEvtDate(e.target.value)} placeholder="Ex: 24 de Junho de 2026" />
                </div>
                <div className={styles.formGroup}>
                  <label>Tipo de Evento</label>
                  <select 
                    value={newEvtType} 
                    onChange={e => setNewEvtType(e.target.value as 'past' | 'future')}
                  >
                    <option value="future" style={{ background: '#111' }}>Evento Futuro</option>
                    <option value="past" style={{ background: '#111' }}>Evento Passado</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Descrição Curta do Evento</label>
                <textarea value={newEvtDesc} onChange={e => setNewEvtDesc(e.target.value)} placeholder="Explique brevemente as atividades e o público-alvo." rows={2} />
              </div>
              <div className={styles.formGroup}>
                <label>Link Externo / Mais Informações (Opcional)</label>
                <input value={newEvtLink} onChange={e => setNewEvtLink(e.target.value)} placeholder="Ex: https://wa.me/... ou formulário de inscrição" />
              </div>
              <div className={styles.formGroup}>
                <label>Imagem / Foto do Evento (Opcional)</label>
                <div className={styles.uploadRow}>
                  <input value={newEvtImage} onChange={e => setNewEvtImage(e.target.value)} placeholder="Ex: /event-photo.png" style={{ flex: 1 }} />
                  <label className={styles.uploadLabel} title="Carregar Foto" style={{ cursor: 'pointer' }}>
                    {uploadingEvtImage ? <div className={styles.spinnerSmall}></div> : '📁'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        setUploadingEvtImage(true);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const data = await res.json();
                          if (data.success && data.url) {
                            setNewEvtImage(data.url);
                          } else {
                            alert('Erro: ' + (data.error || 'Falha no upload'));
                          }
                        } catch {
                          alert('Erro de conexão ao carregar.');
                        } finally {
                          setUploadingEvtImage(false);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              <button type="button" className="btn-outline" onClick={addEvent} style={{ alignSelf: 'flex-start' }}>
                Registar Evento na Delegação
              </button>
            </div>

            {/* List Created events */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.subItemTitle}>Lista de Eventos Registados ({events.length})</div>
              {events.length === 0 ? (
                <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem' }}>Nenhum evento associado a este Hub.</p>
              ) : (
                <div className={styles.formGrid}>
                  {events.map((evt, idx) => (
                    <div key={idx} className={styles.subItemBox} style={{ marginBottom: 0 }}>
                      <div className={styles.subItemRow}>
                        <span style={{ fontWeight: 700, color: evt.type === 'future' ? 'var(--primary)' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                          {evt.type === 'future' ? '🚀 Futuro' : '⏳ Passado'}
                        </span>
                        <button 
                          type="button" 
                          className={styles.removeBtn} 
                          onClick={() => setEvents(events.filter((_, i) => i !== idx))}
                          style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
                        >
                          &times;
                        </button>
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{evt.title}</div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>📅 {evt.date}</div>
                      <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0, lineHeight: 1.5 }}>{evt.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Equipa Local Section Config */}
          <div>
            <div className={styles.sectionHeader}>Gestão da Equipa Local</div>
            
            {/* Add Team Member Block */}
            <div className={styles.subItemBox} style={{ background: 'rgba(212,175,55,0.02)', borderColor: 'rgba(212,175,55,0.15)' }}>
              <div className={styles.subItemTitle} style={{ color: 'var(--primary)' }}>+ Adicionar Novo Membro da Equipa</div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Nome do Membro *</label>
                  <input value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Ex: Fatoumata Djaló" />
                </div>
                <div className={styles.formGroup}>
                  <label>Cargo / Função *</label>
                  <input value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} placeholder="Ex: Gestora de Programas" />
                </div>
                <div className={styles.formGroup}>
                  <label>Foto do Membro (Upload ou URL)</label>
                  <div className={styles.uploadRow}>
                    <input value={newMemberImage} onChange={e => setNewMemberImage(e.target.value)} placeholder="Ex: /default-avatar.png" style={{ flex: 1 }} />
                    <label className={styles.uploadLabel} title="Carregar Foto" style={{ cursor: 'pointer' }}>
                      {uploadingMemberImage ? <div className={styles.spinnerSmall}></div> : '📁'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          setUploadingMemberImage(true);
                          try {
                            const res = await fetch('/api/upload', { method: 'POST', body: formData });
                            const data = await res.json();
                            if (data.success && data.url) {
                              setNewMemberImage(data.url);
                            } else {
                              alert('Erro: ' + (data.error || 'Falha no upload'));
                            }
                          } catch {
                            alert('Erro de conexão ao carregar.');
                          } finally {
                            setUploadingMemberImage(false);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <button type="button" className="btn-outline" onClick={addTeamMember} style={{ alignSelf: 'flex-start' }}>
                Adicionar Membro à Equipa
              </button>
            </div>

            {/* List Created Team Members */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.subItemTitle}>Membros Registados ({team.length})</div>
              {team.length === 0 ? (
                <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem' }}>Nenhum membro na equipa deste Hub.</p>
              ) : (
                <div className={styles.formGrid}>
                  {team.map((member: any, idx: number) => (
                    <div key={idx} className={styles.subItemBox} style={{ marginBottom: 0, flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                      <img 
                        src={member.image || '/default-avatar.png'} 
                        alt={member.name} 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{member.name}</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{member.role}</div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setTeam(team.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.5rem', padding: '0 0.5rem' }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Parceiros Locais Section Config */}
          <div>
            <div className={styles.sectionHeader}>Gestão de Parceiros da Delegação</div>
            
            {/* Add Partner Block */}
            <div className={styles.subItemBox} style={{ background: 'rgba(212,175,55,0.02)', borderColor: 'rgba(212,175,55,0.15)' }}>
              <div className={styles.subItemTitle} style={{ color: 'var(--primary)' }}>+ Adicionar Novo Parceiro</div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Nome do Parceiro *</label>
                  <input value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} placeholder="Ex: Banco da Guiné" />
                </div>
                <div className={styles.formGroup}>
                  <label>Logótipo/Emoji do Parceiro (Emoji ou Link ou Upload)</label>
                  <div className={styles.uploadRow}>
                    <input value={newPartnerLogo} onChange={e => setNewPartnerLogo(e.target.value)} placeholder="Ex: 🤝 ou link da imagem" style={{ flex: 1 }} />
                    <label className={styles.uploadLabel} title="Carregar Logótipo" style={{ cursor: 'pointer' }}>
                      {uploadingPartnerLogo ? <div className={styles.spinnerSmall}></div> : '📁'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          setUploadingPartnerLogo(true);
                          try {
                            const res = await fetch('/api/upload', { method: 'POST', body: formData });
                            const data = await res.json();
                            if (data.success && data.url) {
                              setNewPartnerLogo(data.url);
                            } else {
                              alert('Erro: ' + (data.error || 'Falha no upload'));
                            }
                          } catch {
                            alert('Erro de conexão ao carregar.');
                          } finally {
                            setUploadingPartnerLogo(false);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <button type="button" className="btn-outline" onClick={addPartner} style={{ alignSelf: 'flex-start' }}>
                Adicionar Parceiro
              </button>
            </div>

            {/* List Created Partners */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div className={styles.subItemTitle}>Parceiros Registados ({partners.length})</div>
              {partners.length === 0 ? (
                <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem' }}>Nenhum parceiro associado a este Hub.</p>
              ) : (
                <div className={styles.formGrid}>
                  {partners.map((partner: any, idx: number) => (
                    <div key={idx} className={styles.subItemBox} style={{ marginBottom: 0, flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                        {partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/')) ? (
                          <img src={partner.logo} alt={partner.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: '1.5rem' }}>{partner.logo || '🤝'}</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{partner.name}</div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setPartners(partners.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.5rem', padding: '0 0.5rem' }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FAQs Section Config */}
          <div>
            <div className={styles.sectionHeader}>Gestão de FAQ</div>
            
            {/* Form to add FAQ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                type="button" 
                className="btn-outline" 
                onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                style={{ alignSelf: 'flex-start' }}
              >
                + Adicionar FAQ Item
              </button>
            </div>

            {faqs.map((faqItem, idx) => (
              <div key={idx} className={styles.subItemBox} style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))} 
                  style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  &times;
                </button>
                <div className={styles.formGroup}>
                  <label>Pergunta #{idx + 1}</label>
                  <input 
                    value={faqItem.question} 
                    onChange={e => {
                      const newFaqs = [...faqs];
                      newFaqs[idx].question = e.target.value;
                      setFaqs(newFaqs);
                    }} 
                    placeholder="Pergunta comum do candidato" 
                  />
                </div>
                <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                  <label>Resposta</label>
                  <textarea 
                    value={faqItem.answer} 
                    onChange={e => {
                      const newFaqs = [...faqs];
                      newFaqs[idx].answer = e.target.value;
                      setFaqs(newFaqs);
                    }} 
                    placeholder="Explicação detalhada."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'A guardar...' : isCreating ? 'Criar Delegação' : 'Atualizar Delegação'}
            </button>
            <button type="button" className="btn-outline" onClick={() => { setIsCreating(false); setEditingSlug(null); }}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
