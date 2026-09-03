'use client';

import { useEffect, useState } from 'react';
import styles from '../noticias/ConteudoAdmin.module.css';

interface GalleryItem {
  _id: string;
  title: string;
  content: string;
  section: 'news' | 'gallery';
  type: 'photo' | 'video' | 'podcast' | 'publication';
  date: string;
  location?: string;
  imageUrl?: string;
  mediaUrl?: string;
}

export default function AdminGaleriaPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<GalleryItem['type']>('photo');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/posts?section=gallery')
      .then(res => res.json())
      .then(data => {
        if (data.posts) setItems(data.posts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditClick = (item: GalleryItem) => {
    setEditingId(item._id);
    setTitle(item.title || '');
    setContent(item.content || '');
    setType(item.type || 'photo');
    setDate(item.date || '');
    setLocation(item.location || '');
    setImageUrl(item.imageUrl || '');
    setMediaUrl(item.mediaUrl || '');
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setType('photo');
    setDate(new Date().toISOString().substring(0, 10));
    setLocation('');
    setImageUrl('');
    setMediaUrl('');
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMediaFile: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    if (isMediaFile) setUploadingFile(true);
    else setUploadingImage(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (isMediaFile) setMediaUrl(data.url);
        else setImageUrl(data.url);
      } else {
        alert('Erro ao carregar arquivo: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão para upload.');
    } finally {
      if (isMediaFile) setUploadingFile(false);
      else setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !date) {
      alert('Título, Descrição e Data são obrigatórios.');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      content,
      section: 'gallery',
      type,
      date,
      location,
      imageUrl,
      mediaUrl
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
        setMsg(editingId ? '✅ Mídia atualizada com sucesso!' : '✅ Mídia publicada com sucesso!');
        fetchItems();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao salvar mídia.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta mídia?')) return;
    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(i => i._id !== id));
        setMsg('🗑️ Mídia removida com sucesso!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao remover mídia.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    }
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const getLabelByType = (t: string) => {
    const labels: any = {
      photo: 'Fotografia',
      video: 'Vídeo',
      podcast: 'Podcast',
      publication: 'Publicação / Documento'
    };
    return labels[t] || t;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão da Galeria Multimédia</h1>
          <p className={styles.subtitle}>{items.length} itens registrados na Galeria</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? '✕ Cancelar' : '+ Adicionar Mídia'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{editingId ? `Editar Mídia: ${title}` : 'Nova Mídia na Galeria'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Título / Rótulo *</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Pitch Deck Vencedor ABN"
              />
            </div>
            <div className={styles.field}>
              <label>Tipo de Mídia</label>
              <select value={type} onChange={e => setType(e.target.value as any)}>
                <option value="photo">Fotografia</option>
                <option value="video">Vídeo</option>
                <option value="podcast">Podcast</option>
                <option value="publication">Publicação / PDF</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Data de Upload/Ocorrência *</label>
              <input
                required
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Localização (Opcional)</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Maputo, Moçambique ou Online"
              />
            </div>

            {/* Conditionally render fields based on media type */}
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Imagem de Capa / Foto Principal *</label>
              <div className={styles.uploadRow}>
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="URL da Imagem ou carregue um arquivo"
                  style={{ flex: 1 }}
                />
                <label className={styles.uploadLabel} title="Carregar Imagem">
                  {uploadingImage ? (
                    <div className={styles.spinnerSmall}></div>
                  ) : (
                    '📁'
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, false)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {type !== 'photo' && (
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>
                  {type === 'video' ? 'Link do Vídeo (YouTube, Vimeo) *' :
                   type === 'podcast' ? 'Link do Áudio (SoundCloud, Spotify ou MP3) *' :
                   'Arquivo PDF / Documento *'}
                </label>
                <div className={styles.uploadRow}>
                  <input
                    required
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder={
                      type === 'video' ? 'Ex: https://www.youtube.com/watch?v=...' :
                      type === 'podcast' ? 'Ex: https://soundcloud.com/...' :
                      'URL do PDF ou faça upload de um arquivo PDF'
                    }
                    style={{ flex: 1 }}
                  />
                  {type === 'publication' && (
                    <label className={styles.uploadLabel} title="Carregar PDF">
                      {uploadingFile ? (
                        <div className={styles.spinnerSmall}></div>
                      ) : (
                        '📁'
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={e => handleFileUpload(e, true)}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Descrição / Legenda da Mídia *</label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Descreva o conteúdo desta foto, vídeo, podcast ou publicação..."
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'A guardar...' : 'Salvar Mídia'}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('all')}>Todas</button>
        <button className={`${styles.tabBtn} ${activeTab === 'photo' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('photo')}>Fotografias</button>
        <button className={`${styles.tabBtn} ${activeTab === 'video' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('video')}>Vídeos</button>
        <button className={`${styles.tabBtn} ${activeTab === 'podcast' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('podcast')}>Podcasts</button>
        <button className={`${styles.tabBtn} ${activeTab === 'publication' ? styles.activeTabBtn : ''}`} onClick={() => setActiveTab('publication')}>Publicações / PDFs</button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar galeria multimédia...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={styles.empty}>
          <span>🖼️</span>
          <p>Nenhum item nesta categoria no momento.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map(item => (
            <div key={item._id} className={styles.card}>
              <div className={styles.cardImgWrapper}>
                <img
                  src={item.imageUrl || '/abn-logo.png'}
                  alt={item.title}
                  className={styles.cardImg}
                  style={!item.imageUrl ? { objectFit: 'contain', padding: '16px', background: '#0d1322' } : {}}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes('abn-logo.png')) {
                      target.src = '/abn-logo.png';
                      target.style.objectFit = 'contain';
                      target.style.padding = '16px';
                      target.style.background = '#0d1322';
                    }
                  }}
                />
                <span className={styles.categoryBadge}>{getLabelByType(item.type)}</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.content}</p>
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span>📅</span>
                    <strong>{item.date}</strong>
                  </div>
                  {item.location && (
                    <div className={styles.metaItem}>
                      <span>📍</span>
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.mediaUrl && (
                    <div className={styles.metaItem} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>
                      <span>🔗</span> <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{item.mediaUrl}</a>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.editBtn} onClick={() => handleEditClick(item)}>
                  ✏️ Editar
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(item._id)}>
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
