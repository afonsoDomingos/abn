'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';

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

  // Filter profiles
  const filtered = profiles.filter(p => {
    const matchesRole = filter === 'todos' || p.role === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.startupName && p.startupName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar diretório de membros...</div>;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Networking & Conexões</h1>
        <p style={{ opacity: 0.7 }}>Conecte-se com fundadores, encontre parceiros e interaja com investidores no ecossistema ABN.</p>
      </header>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Pesquisar por nome, startup ou especialidade..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 20px',
            borderRadius: '12px',
            color: '#fff',
            minWidth: '280px'
          }}
        />

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['todos', 'empreendedor', 'startup', 'investidor', 'mentor'] as const).map(role => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className="btn-outline"
              style={{
                padding: '8px 16px',
                fontSize: '0.8rem',
                background: filter === role ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                borderRadius: '8px',
                textTransform: 'capitalize'
              }}
            >
              {role === 'todos' ? 'Todos' : role}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
          Nenhum membro encontrado com os critérios indicados.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(profile => (
            <div key={profile.id} className="glass" style={{ padding: '1.8rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              {/* Profile Avatar */}
              <div 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  backgroundImage: `url(${profile.profileImage})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  border: '3px solid var(--primary)',
                  boxShadow: '0 0 15px rgba(255,107,0,0.1)'
                }}
              />

              <div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 4px 0', fontFamily: 'Outfit' }}>{profile.name}</h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', background: 'rgba(255,107,0,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                  {profile.role}
                </span>
                
                {profile.startupName && (
                  <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    🚀 <strong>{profile.startupName}</strong>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>({profile.startupCategory})</div>
                  </div>
                )}
              </div>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, height: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.description || 'Nenhuma descrição adicionada ao perfil de membro.'}
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.8rem', width: '100%', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>
                <button 
                  onClick={() => handleFollow(profile.id)} 
                  className={profile.isFollowing ? 'btn-outline' : 'btn-primary'}
                  style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem', color: '#fff', borderColor: profile.isFollowing ? 'rgba(255,255,255,0.2)' : 'none' }}
                >
                  {profile.isFollowing ? '🤝 Seguindo' : '➕ Seguir'}
                </button>
                <button 
                  onClick={() => router.push('/dashboard/mensagens')} 
                  className="btn-outline"
                  style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  💬 Conversar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
