'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Delegacao.module.css';

interface HubEvent {
  title: string;
  date: string;
  description: string;
  type: 'past' | 'future';
  link?: string;
  image?: string;
}

interface HubTeamMember {
  name: string;
  role: string;
  image?: string;
}

interface HubPartner {
  name: string;
  logo: string;
}

export default function DelegacaoPortalPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'info' | 'events' | 'team' | 'partners' | 'members'>('info');

  // Representative Data
  const [hub, setHub] = useState<any>(null);
  const [permissions, setPermissions] = useState({
    canEditInfo: false,
    canManageEvents: false,
    canManageTeam: false,
    canManagePartners: false,
    canViewMembers: false
  });
  const [representative, setRepresentative] = useState<any>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTeam: 0,
    totalPartners: 0,
    totalLocalMembers: 0
  });
  const [localMembers, setLocalMembers] = useState<any[]>([]);
  const [memberSearch, setMemberSearch] = useState('');

  // Editable Form States
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [steps, setSteps] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // Events, Team, Partners State
  const [events, setEvents] = useState<HubEvent[]>([]);
  const [team, setTeam] = useState<HubTeamMember[]>([]);
  const [partners, setPartners] = useState<HubPartner[]>([]);

  // Sub-forms: New Event
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtDate, setNewEvtDate] = useState('');
  const [newEvtDesc, setNewEvtDesc] = useState('');
  const [newEvtType, setNewEvtType] = useState<'past' | 'future'>('future');
  const [newEvtLink, setNewEvtLink] = useState('');
  const [newEvtImage, setNewEvtImage] = useState('');
  const [uploadingEvtImg, setUploadingEvtImg] = useState(false);

  // Sub-forms: New Team Member
  const [newMemName, setNewMemName] = useState('');
  const [newMemRole, setNewMemRole] = useState('');
  const [newMemImage, setNewMemImage] = useState('');
  const [uploadingMemImg, setUploadingMemImg] = useState(false);

  // Sub-forms: New Partner
  const [newPartName, setNewPartName] = useState('');
  const [newPartLogo, setNewPartLogo] = useState('');

  const showToast = (text: string) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const loadData = () => {
    setLoading(true);
    fetch('/api/delegacao/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.hub) {
          setHub(data.hub);
          setPermissions(data.permissions || {});
          setRepresentative(data.representative || {});
          setStats(data.stats || { totalEvents: 0, totalTeam: 0, totalPartners: 0, totalLocalMembers: 0 });
          setLocalMembers(data.localMembers || []);

          // Populate editable states
          const h = data.hub;
          setDescription(h.description || '');
          setAddress(h.address || '');
          setEmail(h.email || '');
          setPhone(h.phone || '');
          setFacebookUrl(h.facebookUrl || '');
          setInstagramUrl(h.instagramUrl || '');
          setLinkedinUrl(h.linkedinUrl || '');
          setYoutubeUrl(h.youtubeUrl || '');
          setSteps(h.steps || []);
          setFaqs(h.faqs || []);
          setEvents(h.events || []);
          setTeam(h.team || []);
          setPartners(h.partners || []);
        } else {
          setError(data.error || 'Não foi possível carregar a delegação.');
        }
      })
      .catch(err => {
        setError('Erro na conexão com o servidor.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save General Info (Tab 1)
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canEditInfo) {
      alert('Não possui permissão para editar as informações da delegação.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/delegacao/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          address,
          email,
          phone,
          facebookUrl,
          instagramUrl,
          linkedinUrl,
          youtubeUrl,
          steps,
          faqs
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Informações da delegação atualizadas com sucesso!');
        loadData();
      } else {
        alert(data.error || 'Erro ao guardar alterações.');
      }
    } catch {
      alert('Erro de conexão ao guardar.');
    } finally {
      setSaving(false);
    }
  };

  // Add & Save Events (Tab 2)
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canManageEvents) {
      alert('Não possui permissão para gerir eventos.');
      return;
    }

    if (!newEvtTitle || !newEvtDate || !newEvtDesc) {
      alert('Preencha o título, data e descrição do evento.');
      return;
    }

    const updatedEvents: HubEvent[] = [
      ...events,
      {
        title: newEvtTitle,
        date: newEvtDate,
        description: newEvtDesc,
        type: newEvtType,
        link: newEvtLink || undefined,
        image: newEvtImage || undefined
      }
    ];

    setSaving(true);
    try {
      const res = await fetch('/api/delegacao/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: updatedEvents })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(updatedEvents);
        setNewEvtTitle('');
        setNewEvtDate('');
        setNewEvtDesc('');
        setNewEvtLink('');
        setNewEvtImage('');
        showToast('Evento registado na delegação!');
      } else {
        alert(data.error || 'Erro ao adicionar evento.');
      }
    } catch {
      alert('Erro de conexão.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (index: number) => {
    if (!permissions.canManageEvents) return;
    if (!confirm('Deseja remover este evento?')) return;

    const updatedEvents = events.filter((_, i) => i !== index);
    setSaving(true);
    try {
      const res = await fetch('/api/delegacao/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: updatedEvents })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(updatedEvents);
        showToast('Evento removido.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Add & Save Team Member (Tab 3)
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canManageTeam) {
      alert('Não possui permissão para gerir a equipa.');
      return;
    }

    if (!newMemName || !newMemRole) {
      alert('Preencha o nome e o cargo do membro da equipa.');
      return;
    }

    const updatedTeam = [
      ...team,
      {
        name: newMemName,
        role: newMemRole,
        image: newMemImage || '/default-avatar.png'
      }
    ];

    setSaving(true);
    try {
      const res = await fetch('/api/delegacao/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team: updatedTeam })
      });
      const data = await res.json();
      if (data.success) {
        setTeam(updatedTeam);
        setNewMemName('');
        setNewMemRole('');
        setNewMemImage('');
        showToast('Membro adicionado à equipa local!');
      } else {
        alert(data.error || 'Erro ao adicionar membro.');
      }
    } catch {
      alert('Erro de conexão.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeamMember = async (index: number) => {
    if (!permissions.canManageTeam) return;
    if (!confirm('Deseja remover este membro da equipa?')) return;

    const updatedTeam = team.filter((_, i) => i !== index);
    setSaving(true);
    try {
      const res = await fetch('/api/delegacao/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team: updatedTeam })
      });
      const data = await res.json();
      if (data.success) {
        setTeam(updatedTeam);
        showToast('Membro removido da equipa.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Add & Save Partner (Tab 4)
  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canManagePartners) {
      alert('Não possui permissão para gerir parceiros.');
      return;
    }

    if (!newPartName) {
      alert('Preencha o nome do parceiro.');
      return;
    }

    const updatedPartners = [
      ...partners,
      {
        name: newPartName,
        logo: newPartLogo || ''
      }
    ];

    setSaving(true);
    try {
      const res = await fetch('/api/delegacao/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partners: updatedPartners })
      });
      const data = await res.json();
      if (data.success) {
        setPartners(updatedPartners);
        setNewPartName('');
        setNewPartLogo('');
        showToast('Parceiro registado na delegação!');
      } else {
        alert(data.error || 'Erro ao adicionar parceiro.');
      }
    } catch {
      alert('Erro de conexão.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePartner = async (index: number) => {
    if (!permissions.canManagePartners) return;
    if (!confirm('Deseja remover este parceiro?')) return;

    const updatedPartners = partners.filter((_, i) => i !== index);
    setSaving(true);
    try {
      const res = await fetch('/api/delegacao/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partners: updatedPartners })
      });
      const data = await res.json();
      if (data.success) {
        setPartners(updatedPartners);
        showToast('Parceiro removido.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏛️</div>
          <div style={{ color: '#94a3b8' }}>A carregar a sua Delegação Oficial...</div>
        </div>
      </div>
    );
  }

  if (error || !hub) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.contentCard} style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Acesso Restrito</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {error || 'Não tem uma delegação associada ao seu perfil de utilizador.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn-outline">
              Ir para o Dashboard
            </Link>
            <Link href="/" className="btn-primary">
              Página Inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {toastMsg && <div className={styles.toast}>✓ {toastMsg}</div>}

      {/* Top Navbar */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brand}>
            <Link href="/">
              <img src="/abn-logo.png" alt="ABN Logo" className={styles.brandLogo} />
            </Link>
            <div className={styles.hubBadge}>
              <span>📍</span> Delegação de {hub.name}
            </div>
          </div>

          <div className={styles.topRight}>
            <Link 
              href={`/country/${hub.slug}`} 
              target="_blank" 
              className="btn-outline" 
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              👁️ Ver Portal Público
            </Link>

            <div className={styles.userBadge}>
              <img 
                src={representative?.profileImage || '/default-avatar.png'} 
                alt={representative?.name} 
                className={styles.userAvatar} 
              />
              <div>
                <div className={styles.userName}>{representative?.name}</div>
                <div className={styles.userRole}>{representative?.title || 'Representante'}</div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => {
                document.cookie = 'abn_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                window.location.href = '/login';
              }} 
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className={styles.container}>
        {/* Hero Section */}
        <section 
          className={styles.hero}
          style={{ backgroundImage: `url(${hub.image || '/guine_bissau_banner.png'})` }}
        >
          <div className={styles.heroOverlay}>
            <div>
              <h1 className={styles.heroTitle}>
                Delegação da ABN em {hub.name}
              </h1>
              <p className={styles.heroSubtitle}>
                Portal oficial de gestão local. Faça a gestão dos conteúdos, eventos, equipa e comunidade empreendedora deste país.
              </p>
            </div>
            <div className={styles.heroActions}>
              <span style={{ 
                background: 'rgba(222, 155, 53, 0.2)', 
                border: '1px solid #de9b35', 
                color: '#de9b35', 
                padding: '6px 14px', 
                borderRadius: '50px', 
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                👑 {representative?.title || 'Representante Oficial'}
              </span>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div>
              <div className={styles.statVal}>{events.length}</div>
              <div className={styles.statLabel}>Eventos Registados</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div>
              <div className={styles.statVal}>{team.length}</div>
              <div className={styles.statLabel}>Membros da Equipa Local</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🤝</div>
            <div>
              <div className={styles.statVal}>{partners.length}</div>
              <div className={styles.statLabel}>Parceiros Estratégicos</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🚀</div>
            <div>
              <div className={styles.statVal}>{localMembers.length}</div>
              <div className={styles.statLabel}>Empreendedores Registados</div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className={styles.tabsBar}>
          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === 'info' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <span>ℹ️</span> Informações Gerais {!permissions.canEditInfo && <span className={styles.tabLock}>🔒</span>}
          </button>

          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === 'events' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <span>📅</span> Eventos & Atividades ({events.length}) {!permissions.canManageEvents && <span className={styles.tabLock}>🔒</span>}
          </button>

          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === 'team' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <span>👥</span> Equipa Local ({team.length}) {!permissions.canManageTeam && <span className={styles.tabLock}>🔒</span>}
          </button>

          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === 'partners' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('partners')}
          >
            <span>🤝</span> Parceiros ({partners.length}) {!permissions.canManagePartners && <span className={styles.tabLock}>🔒</span>}
          </button>

          <button 
            type="button" 
            className={`${styles.tabBtn} ${activeTab === 'members' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <span>🚀</span> Empreendedores do País ({localMembers.length}) {!permissions.canViewMembers && <span className={styles.tabLock}>🔒</span>}
          </button>
        </div>

        {/* TAB 1: General Info */}
        {activeTab === 'info' && (
          <div className={styles.contentCard}>
            <h2 className={styles.sectionTitle}>Informações da Delegação</h2>
            <p className={styles.sectionSubtitle}>
              Dados principais visíveis publicamente na página oficial de {hub.name}.
            </p>

            {!permissions.canEditInfo && (
              <div className={styles.lockBanner}>
                <span>🔒</span> Modo de Apenas Leitura: O Administrador não atribuiu permissão para editar as informações base deste hub.
              </div>
            )}

            <form onSubmit={handleSaveInfo}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Descrição da Atuação Local</label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    rows={4}
                    disabled={!permissions.canEditInfo}
                    placeholder="Descreva as iniciativas da ABN neste país..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Morada / Endereço Físico</label>
                  <input 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    disabled={!permissions.canEditInfo}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email Oficial de Contacto</label>
                  <input 
                    type="email"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    disabled={!permissions.canEditInfo}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Telefone / Linha de Apoio</label>
                  <input 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    disabled={!permissions.canEditInfo}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>LinkedIn da Delegação</label>
                  <input 
                    value={linkedinUrl} 
                    onChange={e => setLinkedinUrl(e.target.value)} 
                    placeholder="https://linkedin.com/..."
                    disabled={!permissions.canEditInfo}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Facebook</label>
                  <input 
                    value={facebookUrl} 
                    onChange={e => setFacebookUrl(e.target.value)} 
                    placeholder="https://facebook.com/..."
                    disabled={!permissions.canEditInfo}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Instagram</label>
                  <input 
                    value={instagramUrl} 
                    onChange={e => setInstagramUrl(e.target.value)} 
                    placeholder="https://instagram.com/..."
                    disabled={!permissions.canEditInfo}
                  />
                </div>
              </div>

              {permissions.canEditInfo && (
                <div className={styles.actionRow}>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'A guardar...' : 'Guardar Informações'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 2: Events & Activities */}
        {activeTab === 'events' && (
          <div className={styles.contentCard}>
            <h2 className={styles.sectionTitle}>Eventos & Atividades da Delegação</h2>
            <p className={styles.sectionSubtitle}>
              Publique encontros, workshops, webinars e conferências locais.
            </p>

            {!permissions.canManageEvents ? (
              <div className={styles.lockBanner}>
                <span>🔒</span> Apenas Leitura: Não tem permissão para adicionar ou remover eventos desta delegação.
              </div>
            ) : (
              <div className={styles.boxItem} style={{ background: 'rgba(222, 155, 53, 0.05)', borderColor: 'rgba(222, 155, 53, 0.2)', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#de9b35', fontSize: '1.1rem' }}>+ Registar Novo Evento</h3>
                <form onSubmit={handleAddEvent}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Título do Evento *</label>
                      <input 
                        value={newEvtTitle} 
                        onChange={e => setNewEvtTitle(e.target.value)} 
                        placeholder="Ex: Workshop de Validação de Startups"
                        required 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Data / Horário *</label>
                      <input 
                        value={newEvtDate} 
                        onChange={e => setNewEvtDate(e.target.value)} 
                        placeholder="Ex: 15 de Outubro de 2026 às 14:00"
                        required 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Estado do Evento</label>
                      <select 
                        value={newEvtType} 
                        onChange={e => setNewEvtType(e.target.value as 'past' | 'future')}
                      >
                        <option value="future">Evento Futuro (Brevemente)</option>
                        <option value="past">Evento Passado (Concluído)</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Link de Inscrição / WhatsApp</label>
                      <input 
                        value={newEvtLink} 
                        onChange={e => setNewEvtLink(e.target.value)} 
                        placeholder="https://wa.me/... ou link do formulário"
                      />
                    </div>

                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                      <label>Descrição do Evento *</label>
                      <textarea 
                        value={newEvtDesc} 
                        onChange={e => setNewEvtDesc(e.target.value)} 
                        rows={2}
                        placeholder="Resumo do programa e temas abordados..."
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? 'A registar...' : 'Publicar Evento'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of registered events */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {events.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Nenhum evento registado nesta delegação.</p>
              ) : (
                events.map((evt, idx) => (
                  <div key={idx} className={styles.boxItem} style={{ position: 'relative' }}>
                    {permissions.canManageEvents && (
                      <button 
                        type="button" 
                        onClick={() => handleDeleteEvent(idx)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '1.2rem',
                          cursor: 'pointer'
                        }}
                        title="Eliminar evento"
                      >
                        &times;
                      </button>
                    )}
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      color: evt.type === 'future' ? '#22c55e' : '#94a3b8',
                      textTransform: 'uppercase'
                    }}>
                      {evt.type === 'future' ? '📅 Próximo Evento' : '⏳ Realizado'}
                    </span>
                    <h4 style={{ margin: '6px 0 4px 0', fontSize: '1rem', color: '#f8fafc' }}>{evt.title}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#de9b35', marginBottom: '8px' }}>{evt.date}</div>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{evt.description}</p>
                    {evt.link && (
                      <a 
                        href={evt.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ display: 'inline-block', marginTop: '10px', fontSize: '0.8rem', color: '#de9b35' }}
                      >
                        Link de Acesso &rarr;
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Local Team */}
        {activeTab === 'team' && (
          <div className={styles.contentCard}>
            <h2 className={styles.sectionTitle}>Equipa Local da Delegação</h2>
            <p className={styles.sectionSubtitle}>
              Membros responsáveis pela coordenação, mentoria e apoio aos empreendedores em {hub.name}.
            </p>

            {!permissions.canManageTeam ? (
              <div className={styles.lockBanner}>
                <span>🔒</span> Apenas Leitura: Não tem permissão para gerir a equipa desta delegação.
              </div>
            ) : (
              <div className={styles.boxItem} style={{ background: 'rgba(222, 155, 53, 0.05)', borderColor: 'rgba(222, 155, 53, 0.2)', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#de9b35', fontSize: '1.1rem' }}>+ Adicionar Membro da Equipa</h3>
                <form onSubmit={handleAddTeamMember}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Nome do Membro *</label>
                      <input 
                        value={newMemName} 
                        onChange={e => setNewMemName(e.target.value)} 
                        placeholder="Ex: Ana Paula Fernandes"
                        required 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Cargo / Função Local *</label>
                      <input 
                        value={newMemRole} 
                        onChange={e => setNewMemRole(e.target.value)} 
                        placeholder="Ex: Gestora de Aceleração & Projetos"
                        required 
                      />
                    </div>

                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                      <label>Foto do Membro (URL ou Carregar)</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          value={newMemImage} 
                          onChange={e => setNewMemImage(e.target.value)} 
                          placeholder="Ex: /default-avatar.png ou link da foto"
                          style={{ flex: 1 }}
                        />
                        <label style={{ 
                          padding: '0.75rem 1rem', 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          border: '1px solid rgba(255, 255, 255, 0.15)', 
                          borderRadius: '10px', 
                          cursor: 'pointer' 
                        }}>
                          {uploadingMemImg ? '...' : '📁'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append('file', file);
                              setUploadingMemImg(true);
                              try {
                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                const d = await res.json();
                                if (d.success && d.url) setNewMemImage(d.url);
                              } finally {
                                setUploadingMemImg(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? 'A adicionar...' : 'Adicionar Membro'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List Team */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {team.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Nenhum membro registado na equipa local.</p>
              ) : (
                team.map((member, idx) => (
                  <div key={idx} className={styles.boxItem} style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                    <img 
                      src={member.image || '/default-avatar.png'} 
                      alt={member.name} 
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(222, 155, 53, 0.4)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{member.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{member.role}</div>
                    </div>
                    {permissions.canManageTeam && (
                      <button 
                        type="button" 
                        onClick={() => handleDeleteTeamMember(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '1.2rem',
                          cursor: 'pointer'
                        }}
                        title="Remover membro"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Local Partners */}
        {activeTab === 'partners' && (
          <div className={styles.contentCard}>
            <h2 className={styles.sectionTitle}>Parceiros da Delegação</h2>
            <p className={styles.sectionSubtitle}>
              Empresas, instituições públicas, universidades e organizações parceiras em {hub.name}.
            </p>

            {!permissions.canManagePartners ? (
              <div className={styles.lockBanner}>
                <span>🔒</span> Apenas Leitura: Não tem permissão para gerir parceiros desta delegação.
              </div>
            ) : (
              <div className={styles.boxItem} style={{ background: 'rgba(222, 155, 53, 0.05)', borderColor: 'rgba(222, 155, 53, 0.2)', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#de9b35', fontSize: '1.1rem' }}>+ Registar Novo Parceiro</h3>
                <form onSubmit={handleAddPartner}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Nome do Parceiro *</label>
                      <input 
                        value={newPartName} 
                        onChange={e => setNewPartName(e.target.value)} 
                        placeholder="Ex: Associação Comercial e Industrial"
                        required 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Logótipo / Emoji / Imagem</label>
                      <input 
                        value={newPartLogo} 
                        onChange={e => setNewPartLogo(e.target.value)} 
                        placeholder="Ex: 🏦 ou URL da imagem do logo"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? 'A registar...' : 'Adicionar Parceiro'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List Partners */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {partners.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Nenhum parceiro registado nesta delegação.</p>
              ) : (
                partners.map((partner, idx) => (
                  <div key={idx} className={styles.boxItem} style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                    <div style={{ 
                      width: '45px', 
                      height: '45px', 
                      borderRadius: '10px', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '1.4rem'
                    }}>
                      {partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/')) ? (
                        <img src={partner.logo} alt={partner.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span>{partner.logo || '🤝'}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>
                      {partner.name}
                    </div>
                    {permissions.canManagePartners && (
                      <button 
                        type="button" 
                        onClick={() => handleDeletePartner(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '1.2rem',
                          cursor: 'pointer'
                        }}
                        title="Remover parceiro"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Local Members & Entrepreneurs */}
        {activeTab === 'members' && (
          <div className={styles.contentCard}>
            <h2 className={styles.sectionTitle}>Comunidade Empreendedora em {hub.name}</h2>
            <p className={styles.sectionSubtitle}>
              Lista de empreendedores, startups e empresas registadas neste país na rede ABN.
            </p>

            {!permissions.canViewMembers ? (
              <div className={styles.lockBanner}>
                <span>🔒</span> Acesso Restrito: A consulta da base de dados de membros locais requer autorização explícita do Administrador.
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="Filtrar por nome, empresa ou setor..." 
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    style={{
                      background: 'rgba(2, 6, 23, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      maxWidth: '400px',
                      width: '100%'
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Total: {localMembers.length} registados
                  </span>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Empreendedor / Membro</th>
                        <th>Empresa / Negócio</th>
                        <th>Sector</th>
                        <th>Cidade</th>
                        <th>Papel</th>
                        <th>Contacto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localMembers
                        .filter(m => {
                          if (!memberSearch) return true;
                          const q = memberSearch.toLowerCase();
                          return (
                            m.name?.toLowerCase().includes(q) ||
                            m.company?.toLowerCase().includes(q) ||
                            m.sector?.toLowerCase().includes(q) ||
                            m.city?.toLowerCase().includes(q)
                          );
                        })
                        .map(m => (
                          <tr key={m._id || m.email}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img 
                                  src={m.profileImage || '/default-avatar.png'} 
                                  alt={m.name} 
                                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                                />
                                <div>
                                  <div style={{ fontWeight: 700, color: '#f8fafc' }}>{m.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>{m.company || '—'}</td>
                            <td>{m.sector || 'Geral'}</td>
                            <td>{m.city || hub.name}</td>
                            <td>
                              <span style={{ 
                                background: 'rgba(255, 255, 255, 0.05)', 
                                padding: '3px 8px', 
                                borderRadius: '6px', 
                                fontSize: '0.75rem',
                                color: '#de9b35'
                              }}>
                                {m.role}
                              </span>
                            </td>
                            <td>{m.phone || '—'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
