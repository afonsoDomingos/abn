'use client';

import { useEffect, useState } from 'react';
import styles from './ConteudoAdmin.module.css';

interface PostItem {
  _id: string;
  title: string;
  content: string;
  section: 'news' | 'gallery';
  type: 'news' | 'article' | 'blog' | 'voz' | 'sucesso' | 'comunicado';
  date: string;
  location?: string;
  imageUrl?: string;
  views?: number;
  comments?: any[];
}

export default function AdminNoticiasPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<PostItem['type']>('news');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    fetch('/api/posts?section=news')
      .then(res => res.json())
      .then(data => {
        if (data.posts) setPosts(data.posts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditClick = (p: PostItem) => {
    setEditingId(p._id);
    setTitle(p.title || '');
    setContent(p.content || '');
    setType(p.type || 'news');
    setDate(p.date || '');
    setLocation(p.location || '');
    setImageUrl(p.imageUrl || '');
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setType('news');
    setDate(new Date().toISOString().substring(0, 10));
    setLocation('');
    setImageUrl('');
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        alert('Erro ao carregar capa: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão para upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !date) {
      alert('Título, Conteúdo e Data são obrigatórios.');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      content,
      section: 'news',
      type,
      date,
      location,
      imageUrl
    };

    try {
      const url = '/api/posts';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? '✅ Post atualizado com sucesso!' : '✅ Post publicado com sucesso!');
        fetchPosts();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao salvar publicação.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este conteúdo?')) return;
    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p._id !== id));
        setMsg('🗑️ Publicação removida com sucesso!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao remover publicação.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeTab === 'all') return true;
    return p.type === activeTab;
  });

  const getLabelByType = (t: string) => {
    const labels: any = {
      news: 'Notícia',
      article: 'Artigo',
      blog: 'Blog',
      voz: 'A Voz do Empreendedor',
      sucesso: 'História de Sucesso',
      comunicado: 'Comunicado'
    };
    return labels[t] || t;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Notícias e Artigos</h1>
          <p className={styles.subtitle}>{posts.length} publicações registradas</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? '✕ Cancelar' : '+ Nova Publicação'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{editingId ? `Editar Conteúdo: ${title}` : 'Nova Publicação'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Título da Publicação *</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Orange Corners Moçambique: Empreendedorismo Verde"
              />
            </div>
            <div className={styles.field}>
              <label>Canal / Tipo de Conteúdo</label>
              <select value={type} onChange={e => setType(e.target.value as any)}>
                <option value="news">Notícias</option>
                <option value="article">Artigos</option>
                <option value="blog">Blog</option>
                <option value="voz">A Voz do Empreendedor</option>
                <option value="sucesso">Histórias de Sucesso</option>
                <option value="comunicado">Comunicados</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Data de Publicação *</label>
              <input
                required
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Localização / País (Opcional)</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Moçambique, Angola ou Geral"
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Imagem de Capa (Opcional)</label>
              <div className={styles.uploadRow}>
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="URL da imagem ou carregue um arquivo de imagem"
                  style={{ flex: 1 }}
                />
                <label className={styles.uploadLabel} title="Carregar Imagem">
                  {uploading ? (
                    <div className={styles.spinnerSmall}></div>
                  ) : (
                    '📁'
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Texto Completo / Conteúdo *</label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Escreva a notícia ou artigo completo aqui..."
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'A guardar...' : 'Publicar Conteúdo'}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('all')}>Todas</button>
        <button className={`${styles.tabBtn} ${activeTab === 'news' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('news')}>Notícias</button>
        <button className={`${styles.tabBtn} ${activeTab === 'article' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('article')}>Artigos</button>
        <button className={`${styles.tabBtn} ${activeTab === 'blog' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('blog')}>Blog</button>
        <button className={`${styles.tabBtn} ${activeTab === 'voz' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('voz')}>A Voz do Empreendedor</button>
        <button className={`${styles.tabBtn} ${activeTab === 'sucesso' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('sucesso')}>Histórias de Sucesso</button>
        <button className={`${styles.tabBtn} ${activeTab === 'comunicado' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('comunicado')}>Comunicados</button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar publicações...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className={styles.empty}>
          <span>📰</span>
          <p>Nenhuma publicação nesta categoria no momento.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredPosts.map(p => (
            <div key={p._id} className={styles.card}>
              <div className={styles.cardImgWrapper}>
                <img 
                  src={p.imageUrl || '/noticiadefautl.png'} 
                  alt={p.title} 
                  className={styles.cardImg} 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('noticiadefautl.png')) {
                      target.src = '/noticiadefautl.png';
                    }
                  }}
                />
                <span className={styles.categoryBadge}>{getLabelByType(p.type)}</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardDesc}>{p.content}</p>
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span>📅</span>
                    <strong>{p.date}</strong>
                  </div>
                  {p.location && (
                    <div className={styles.metaItem}>
                      <span>📍</span>
                      <span>{p.location}</span>
                    </div>
                  )}
                  <div className={styles.metaItem} style={{ gap: '0.8rem', marginTop: '0.4rem', color: 'rgba(255,255,255,0.3)' }}>
                    <span>👁️ {p.views || 0} visualizações</span>
                    <span>💬 {p.comments?.length || 0} comentários</span>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.editBtn} onClick={() => handleEditClick(p)}>
                  ✏️ Editar
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(p._id)}>
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
