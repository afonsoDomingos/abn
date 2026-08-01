'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, UserCheck, MessageSquare, Building2, ShieldCheck, Sparkles } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  description: string;
  isFollowing: boolean;
  startupName?: string | null;
  startupCategory?: string | null;
}

export default function NetworkingPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'empreendedor' | 'startup' | 'investidor' | 'mentor'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const roleLabels: Record<string, { label: string; bg: string; color: string }> = {
    empreendedor: { label: 'Empreendedor', bg: '#eff6ff', color: '#1d4ed8' },
    startup: { label: 'Startup Incubada', bg: '#fff7ed', color: '#c2410c' },
    investidor: { label: 'Investidor Anjo', bg: '#f0fdf4', color: '#15803d' },
    mentor: { label: 'Mentor Especialista', bg: '#faf5ff', color: '#7e22ce' },
    admin: { label: 'ABN Admin', bg: '#fee2e2', color: '#b91c1c' },
  };

  const filtered = profiles.filter(p => {
    const matchesRole = filter === 'todos' || p.role === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.startupName && p.startupName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
        A carregar o diretório de membros do ecossistema ABN...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1150px', width: '100%', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.1rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
          Networking &amp; Conexões de Negócios
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.98rem', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
          Conecte-se com fundadores de startups, investidores, mentores e parceiros estratégicos no ecossistema ABN.
        </p>
      </header>

      {/* Barra de Pesquisa e Filtros */}
      <div style={{ 
        background: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '20px', 
        padding: '1.25rem 1.5rem', 
        boxShadow: '0 4px 16px rgba(15,23,42,0.03)', 
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Input de Pesquisa */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Pesquisar membros por nome, startup ou área de atuação..."
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

        {/* Filtros de Categoria */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginRight: '4px' }}>Filtrar:</span>
          {(['todos', 'empreendedor', 'startup', 'investidor', 'mentor'] as const).map(role => {
            const active = filter === role;
            const labels: Record<string, string> = {
              todos: 'Todos os Membros',
              empreendedor: 'Empreendedores',
              startup: 'Startups',
              investidor: 'Investidores',
              mentor: 'Mentores'
            };

            return (
              <button
                key={role}
                onClick={() => setFilter(role)}
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
                {labels[role]}
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
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Tente ajustar os critérios de pesquisa ou selecione outra categoria.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filtered.map(profile => {
            const roleInfo = roleLabels[profile.role] || { label: profile.role, bg: '#f1f5f9', color: '#475569' };
            const avatarImg = profile.profileImage || '/perfil09.jpg';

            return (
              <div 
                key={profile.id} 
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '20px', 
                  padding: '1.75rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.2rem', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(15,23,42,0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Profile Avatar */}
                <div 
                  style={{ 
                    width: '86px', 
                    height: '86px', 
                    borderRadius: '50%', 
                    backgroundImage: `url(${avatarImg})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    border: '3px solid #ff6b00',
                    boxShadow: '0 4px 12px rgba(255,107,0,0.18)',
                    flexShrink: 0
                  }}
                />

                <div style={{ width: '100%' }}>
                  <h3 style={{ color: '#0f172a', fontSize: '1.15rem', margin: '0 0 6px 0', fontFamily: 'Outfit', fontWeight: 800 }}>
                    {profile.name}
                  </h3>
                  
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.4px',
                    background: roleInfo.bg, 
                    color: roleInfo.color, 
                    padding: '3px 10px', 
                    borderRadius: '12px',
                    display: 'inline-block'
                  }}>
                    {roleInfo.label}
                  </span>
                  
                  {profile.startupName && (
                    <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      🚀 <strong style={{ color: '#0f172a' }}>{profile.startupName}</strong>
                      {profile.startupCategory && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                          ({profile.startupCategory})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <p style={{ 
                  color: '#64748b', 
                  fontSize: '0.84rem', 
                  lineHeight: 1.45, 
                  margin: 0, 
                  height: '54px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  fontWeight: 500
                }}>
                  {profile.description || 'Membro oficial registado no ecossistema de negócios ABN Hub.'}
                </p>

                {/* Botões de Ação Diretos */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  width: '100%', 
                  marginTop: 'auto', 
                  borderTop: '1px solid #f1f5f9', 
                  paddingTop: '1.25rem' 
                }}>
                  <button 
                    onClick={() => handleFollow(profile.id)} 
                    style={{ 
                      flex: 1, 
                      padding: '10px 0', 
                      fontSize: '0.82rem', 
                      fontWeight: 800,
                      borderRadius: '10px',
                      border: profile.isFollowing ? '1.5px solid #cbd5e1' : 'none',
                      background: profile.isFollowing ? '#ffffff' : '#ff6b00',
                      color: profile.isFollowing ? '#475569' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {profile.isFollowing ? (
                      <>
                        <UserCheck size={16} /> Seguindo
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} /> Seguir
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => router.push('/dashboard/mensagens')} 
                    style={{ 
                      flex: 1, 
                      padding: '10px 0', 
                      fontSize: '0.82rem', 
                      fontWeight: 800,
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <MessageSquare size={16} /> Conversar
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

