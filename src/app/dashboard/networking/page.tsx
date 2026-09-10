'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  UserPlus, 
  UserCheck, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Plus, 
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  MapPin,
  Briefcase
} from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  profileImage: string;
  description: string;
  company?: string;
  sector?: string;
  country?: string;
  city?: string;
  skills?: string[];
  isFollowing: boolean;
  startupName?: string | null;
  startupCategory?: string | null;
}

interface NetworkingGroup {
  id: string;
  name: string;
  category: string;
  description: string;
  creator: {
    _id: string;
    name: string;
    profileImage?: string;
    role?: string;
  };
  membersCount: number;
  isMember: boolean;
  createdAt: string;
}

export default function NetworkingPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [groups, setGroups] = useState<NetworkingGroup[]>([]);
  const [activeMainTab, setActiveMainTab] = useState<'membros' | 'grupos'>('membros');
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  
  // Filtros de Membros
  const [filter, setFilter] = useState<'todos' | 'empreendedor' | 'empresa' | 'investidor' | 'mentor'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal de Criar Grupo
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Geral');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchProfiles();
    fetchGroups();
  }, []);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/networking');
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
      }
    } catch (e) {
      console.error('Error fetching networking profiles:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      if (data.success) {
        setGroups(data.groups || []);
      }
    } catch (e) {
      console.error('Error fetching groups:', e);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleFollow = async (id: string) => {
    try {
      const res = await fetch('/api/networking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: id })
      });
      const data = await res.json();
      if (data.success) {
        setProfiles(prev =>
          prev.map(p => p.id === id ? { ...p, isFollowing: data.isFollowing } : p)
        );
        showNotification(data.isFollowing ? '✅ Conexão solicitada com sucesso!' : 'Deixou de seguir o perfil.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setCreatingGroup(true);

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: newGroupName,
          category: newGroupCategory,
          description: newGroupDesc
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateGroupModal(false);
        setNewGroupName('');
        setNewGroupDesc('');
        showNotification('🎉 Grupo criado com sucesso!');
        fetchGroups();
      }
    } catch {
      showNotification('Erro ao criar grupo.');
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleToggleJoinGroup = async (groupId: string) => {
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_join', groupId })
      });
      const data = await res.json();
      if (data.success) {
        setGroups(prev =>
          prev.map(g => g.id === groupId ? { ...g, isMember: data.isMember, membersCount: data.membersCount } : g)
        );
        showNotification(data.isMember ? '👥 Entrou no grupo com sucesso!' : 'Saiu do grupo.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const roleLabels: Record<string, { label: string; bg: string; color: string }> = {
    empreendedor: { label: 'Empreendedor', bg: '#eff6ff', color: '#1d4ed8' },
    startup: { label: 'Startup', bg: '#fff7ed', color: '#c2410c' },
    empresa: { label: 'Empresa / PME', bg: '#f0fdf4', color: '#15803d' },
    investidor: { label: 'Investidor', bg: '#fef3c7', color: '#b45309' },
    mentor: { label: 'Mentor Especialista', bg: '#faf5ff', color: '#7e22ce' },
    consultor: { label: 'Consultor', bg: '#f0fdfa', color: '#0f766e' },
    admin: { label: 'ABN Admin', bg: '#fee2e2', color: '#b91c1c' }
  };

  // Filtragem
  const filtered = profiles.filter(p => {
    const userRoles = p.roles || [p.role];
    let matchesRole = true;

    if (filter === 'empreendedor') {
      matchesRole = userRoles.includes('empreendedor');
    } else if (filter === 'empresa') {
      matchesRole = userRoles.includes('empresa') || userRoles.includes('startup');
    } else if (filter === 'investidor') {
      matchesRole = userRoles.includes('investidor');
    } else if (filter === 'mentor') {
      matchesRole = userRoles.includes('mentor') || userRoles.includes('consultor');
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(q) || 
      (p.startupName && p.startupName.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.sector && p.sector.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q));

    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
        A carregar a rede de networking e conexões ABN...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1150px', width: '100%', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Toast Feedback */}
      {feedback && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '12px 20px',
          borderRadius: '12px',
          background: '#0f172a',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.88rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          border: '1px solid #ff6b00'
        }}>
          {feedback}
        </div>
      )}

      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', background: 'rgba(255,107,0,0.1)', color: '#ff6b00', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          <Sparkles size={14} /> Ecossistema Aberto
        </div>
        <h1 style={{ fontSize: '2.1rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
          Networking, Conexões &amp; Comunidades
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.98rem', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
          Conecte-se com fundadores, empresas, investidores e mentores, envie mensagens e crie grupos temáticos.
        </p>
      </header>

      {/* Tabs Principais: Membros vs Grupos */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveMainTab('membros')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            background: activeMainTab === 'membros' ? '#0f172a' : '#f8fafc',
            color: activeMainTab === 'membros' ? '#ffffff' : '#64748b',
            transition: 'all 0.2s'
          }}
        >
          <Users size={16} /> Diretório de Membros ({profiles.length})
        </button>
        <button
          onClick={() => setActiveMainTab('grupos')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            background: activeMainTab === 'grupos' ? '#0f172a' : '#f8fafc',
            color: activeMainTab === 'grupos' ? '#ffffff' : '#64748b',
            transition: 'all 0.2s'
          }}
        >
          <Layers size={16} /> Grupos &amp; Comunidades ({groups.length})
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         ABA 1: MEMBROS & CONEXÕES
      ───────────────────────────────────────────────────────────── */}
      {activeMainTab === 'membros' && (
        <>
          {/* Barra de Pesquisa e Filtros */}
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '20px', 
            padding: '1.25rem 1.5rem', 
            boxShadow: '0 4px 16px rgba(15,23,42,0.03)', 
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {/* Input de Pesquisa */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Pesquisar por nome, empresa, setor ou cidade..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  padding: '12px 16px 12px 48px',
                  borderRadius: '12px',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            {/* Filtros de Categoria Requeridos */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginRight: '4px' }}>
                Filtrar Por:
              </span>
              {[
                { id: 'todos', label: 'Todos os Membros' },
                { id: 'empreendedor', label: 'Empreendedores' },
                { id: 'empresa', label: 'Empresas & Startups' },
                { id: 'investidor', label: '💰 Investidores' },
                { id: 'mentor', label: 'Mentores & Especialistas' }
              ].map(item => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id as any)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      background: active ? '#ff6b00' : '#f1f5f9',
                      color: active ? '#ffffff' : '#475569',
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grelha de Perfis */}
          {filtered.length === 0 ? (
            <div style={{ 
              background: '#ffffff', 
              border: '1.5px dashed #cbd5e1', 
              borderRadius: '20px', 
              padding: '4rem 2rem', 
              textAlign: 'center', 
              color: '#64748b' 
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🔍</div>
              <h3 style={{ margin: '0 0 0.4rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Nenhum membro encontrado</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Tente ajustar a sua pesquisa ou selecione outra categoria.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {filtered.map(profile => {
                const roleInfo = roleLabels[profile.role] || { label: profile.role, bg: '#f1f5f9', color: '#475569' };
                const avatarImg = profile.profileImage || '/abn-logo.png';

                return (
                  <div 
                    key={profile.id} 
                    style={{ 
                      background: '#ffffff', 
                      borderRadius: '20px', 
                      padding: '1.75rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 16px rgba(15,23,42,0.03)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <img
                          src={avatarImg}
                          alt={profile.name}
                          style={{
                            width: '68px',
                            height: '68px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #ff6b00',
                            flexShrink: 0
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/abn-logo.png';
                            (e.currentTarget as HTMLImageElement).style.padding = '6px';
                            (e.currentTarget as HTMLImageElement).style.background = '#fff7ed';
                          }}
                        />

                        <div style={{ overflow: 'hidden' }}>
                          <h3 style={{ color: '#0f172a', fontSize: '1.05rem', margin: '0 0 4px 0', fontFamily: 'Outfit', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {profile.name}
                          </h3>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 800, 
                            textTransform: 'uppercase', 
                            background: roleInfo.bg, 
                            color: roleInfo.color, 
                            padding: '2px 8px', 
                            borderRadius: '8px',
                            display: 'inline-block'
                          }}>
                            {roleInfo.label}
                          </span>
                          {(profile.city || profile.country) && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                              📍 {profile.city ? `${profile.city}, ` : ''}{profile.country}
                            </p>
                          )}
                        </div>
                      </div>

                      {profile.startupName && (
                        <div style={{ 
                          background: '#f8fafc', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '10px', 
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          color: '#334155',
                          fontWeight: 600,
                          marginBottom: '0.75rem'
                        }}>
                          <Building2 size={14} color="#ff6b00" />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {profile.startupName} {profile.startupCategory ? `• ${profile.startupCategory}` : ''}
                          </span>
                        </div>
                      )}

                      <p style={{ 
                        color: '#475569', 
                        fontSize: '0.82rem', 
                        lineHeight: 1.45, 
                        margin: '0 0 1rem 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {profile.description || 'Membro verificado no ecossistema de negócios da ABN.'}
                      </p>
                    </div>

                    {/* Botões de Ação: Conectar + Enviar Mensagem */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      <button
                        onClick={() => handleFollow(profile.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: profile.isFollowing ? '1px solid #cbd5e1' : 'none',
                          background: profile.isFollowing ? '#f8fafc' : '#0f172a',
                          color: profile.isFollowing ? '#475569' : '#ffffff',
                          transition: 'all 0.2s'
                        }}
                      >
                        {profile.isFollowing ? (
                          <>
                            <UserCheck size={15} color="#16a34a" /> Conectado
                          </>
                        ) : (
                          <>
                            <UserPlus size={15} /> Conectar
                          </>
                        )}
                      </button>

                      <Link
                        href={`/dashboard/mensagens?recipient=${profile.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          background: '#fff7ed',
                          color: '#ff6b00',
                          border: '1px solid rgba(255,107,0,0.2)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <MessageSquare size={15} /> Mensagem
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         ABA 2: GRUPOS & COMUNIDADES
      ───────────────────────────────────────────────────────────── */}
      {activeMainTab === 'grupos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit' }}>
                Grupos &amp; Hubs Temáticos
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                Participe em fóruns de discussão especializados ou funde a sua própria comunidade.
              </p>
            </div>
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.84rem' }}
            >
              <Plus size={16} /> Criar Novo Grupo
            </button>
          </div>

          {groups.length === 0 ? (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '20px', padding: '3rem 1rem', textAlign: 'center' }}>
              <Layers size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Nenhum grupo ativo de momento</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Seja o primeiro a fundar um grupo temático na plataforma.</p>
              <button onClick={() => setShowCreateGroupModal(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                + Fundar Grupo
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {groups.map(group => (
                <div key={group.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '12px', background: '#fff7ed', color: '#ea580c' }}>
                        {group.category}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                        👥 {group.membersCount} membros
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: '#0f172a', fontFamily: 'Outfit', fontWeight: 800 }}>
                      {group.name}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>
                      {group.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Criado por {group.creator?.name || 'Membro ABN'}
                    </div>
                    <button
                      onClick={() => handleToggleJoinGroup(group.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        background: group.isMember ? '#f1f5f9' : '#ff6b00',
                        color: group.isMember ? '#475569' : '#ffffff',
                        transition: 'all 0.2s'
                      }}
                    >
                      {group.isMember ? '✓ Membro' : '+ Aderir'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: CRIAR GRUPO
      ───────────────────────────────────────────────────────────── */}
      {showCreateGroupModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit', fontWeight: 800 }}>
              Criar Novo Grupo de Networking
            </h3>
            <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Nome do Grupo *</label>
                <input
                  type="text"
                  placeholder="Ex: Hub de Inovação em Fintech"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Categoria Temática</label>
                <select
                  value={newGroupCategory}
                  onChange={e => setNewGroupCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Agro-negócio">Agro-negócio</option>
                  <option value="Fintech">Fintech &amp; Pagamentos</option>
                  <option value="Investimento">Investimento &amp; Deals</option>
                  <option value="Tecnologia">Tecnologia &amp; Software</option>
                  <option value="Liderança">Liderança &amp; Empreendedorismo Feminino</option>
                  <option value="Comércio & Logística">Comércio &amp; Logística</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Objetivo &amp; Descrição</label>
                <textarea
                  rows={3}
                  placeholder="Explique o propósito da comunidade e quem deve participar..."
                  value={newGroupDesc}
                  onChange={e => setNewGroupDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="btn-outline"
                  style={{ padding: '10px 18px' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={creatingGroup}
                  style={{ padding: '10px 22px', fontWeight: 800 }}
                >
                  {creatingGroup ? 'A criar...' : 'Criar Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
