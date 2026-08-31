'use client';

import { useState, useEffect } from 'react';
import styles from './NoticiasPublic.module.css';

interface Comment {
  _id?: string;
  name: string;
  text: string;
  date: string | Date;
}

interface PostItem {
  _id: string;
  title: string;
  content: string;
  section: 'news' | 'gallery';
  type: 'news' | 'article' | 'blog' | 'voz' | 'sucesso' | 'comunicado';
  date: string;
  location?: string;
  imageUrl?: string;
  views: number;
  comments: Comment[];
}

interface NoticiasClientProps {
  initialPosts: PostItem[];
}

export default function NoticiasClient({ initialPosts }: NoticiasClientProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  // Comment Form fields
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Sync state if initialPosts changes
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleOpenPost = async (p: PostItem) => {
    setSelectedPost(p);
    // Increment view count in backend
    try {
      fetch(`/api/posts?id=${p._id}`);
      // Increment locally too
      setPosts(prev => prev.map(item => item._id === p._id ? { ...item, views: item.views + 1 } : item));
      setSelectedPost(prev => prev && prev._id === p._id ? { ...prev, views: prev.views + 1 } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentName.trim() || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch('/api/posts/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPost._id,
          name: commentName,
          text: commentText
        })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        // Update comments locally
        const updatedComment = {
          name: data.comment.name,
          text: data.comment.text,
          date: data.comment.date
        };

        setPosts(prev => prev.map(item => {
          if (item._id === selectedPost._id) {
            return {
              ...item,
              comments: [...item.comments, updatedComment]
            };
          }
          return item;
        }));

        setSelectedPost(prev => {
          if (prev) {
            return {
              ...prev,
              comments: [...prev.comments, updatedComment]
            };
          }
          return null;
        });

        setCommentName('');
        setCommentText('');
      } else {
        alert(data.error || 'Erro ao publicar comentário.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao comentar.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Filters
  const filteredPosts = posts.filter(p => {
    const matchesTab = activeTab === 'all' || p.type === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getLabelByType = (t: string) => {
    const labels: any = {
      news: 'Notícias',
      article: 'Artigo',
      blog: 'Blog',
      voz: 'A Voz do Empreendedor',
      sucesso: 'História de Sucesso',
      comunicado: 'Comunicado'
    };
    return labels[t] || t;
  };

  const formatDateLong = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const tabsConfig = [
    { key: 'all', label: 'Todos os Conteúdos' },
    { key: 'news', label: 'Notícias' },
    { key: 'article', label: 'Artigos' },
    { key: 'blog', label: 'Blog' },
    { key: 'voz', label: 'A Voz do Empreendedor' },
    { key: 'sucesso', label: 'Histórias de Sucesso' },
    { key: 'comunicado', label: 'Comunicados' }
  ];

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Procurar notícias, histórias ou comunicados..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tabs}>
          {tabsConfig.map(t => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${activeTab === t.key ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.newsGrid}>
        {filteredPosts.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhuma publicação encontrada para os filtros selecionados.</p>
          </div>
        ) : (
          filteredPosts.map(p => (
            <article key={p._id} className={styles.card}>
              <div className={styles.imgWrapper}>
                <img src={p.imageUrl || '/articles/ambassador-day.png'} alt={p.title} className={styles.cardImg} />
                <span className={styles.typeBadge}>{getLabelByType(p.type)}</span>
                {p.location && <span className={styles.locationBadge}>{p.location}</span>}
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span>{formatDateLong(p.date)}</span>
                  <div className={styles.metaStats}>
                    <span>{p.views} views</span>
                    <span>{p.comments?.length || 0} comentários</span>
                  </div>
                </div>

                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardDesc}>{p.content}</p>

                <button className={styles.readBtn} onClick={() => handleOpenPost(p)}>
                  Ler mais ➔
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPost(null)}>
          <div className={`${styles.modalContent} glass`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setSelectedPost(null)}>✕</button>

            <div className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                <span className={styles.typeBadge} style={{ position: 'static' }}>
                  {getLabelByType(selectedPost.type)}
                </span>
                <span>{formatDateLong(selectedPost.date)}</span>
                {selectedPost.location && <span>{selectedPost.location}</span>}
                <span>{selectedPost.views} visualizações</span>
              </div>
              <h2>{selectedPost.title}</h2>
            </div>

            {selectedPost.imageUrl && (
              <img src={selectedPost.imageUrl} alt={selectedPost.title} className={styles.modalImg} />
            )}

            <div className={styles.modalBodyText}>{selectedPost.content}</div>

            {/* Comments List & Add Form */}
            <div className={styles.commentsSection}>
              <h3>💬 Comentários ({(selectedPost.comments || []).length})</h3>

              <div className={styles.commentsList}>
                {(selectedPost.comments || []).length === 0 ? (
                  <p style={{ fontStyle: 'italic', opacity: 0.5, fontSize: '0.9rem' }}>
                    Nenhum comentário nesta publicação. Seja o primeiro a comentar!
                  </p>
                ) : (
                  (selectedPost.comments || []).map((c, i) => (
                    <div key={i} className={styles.commentCard}>
                      <div className={styles.commentHeader}>
                        <strong>{c.name}</strong>
                        <span>{new Date(c.date).toLocaleDateString('pt-PT')}</span>
                      </div>
                      <p>{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className={styles.commentForm}>
                <h4>Escreva um comentário</h4>
                <input
                  type="text"
                  placeholder="Seu Nome *"
                  required
                  value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                />
                <textarea
                  placeholder="Seu Comentário *"
                  required
                  rows={3}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <button type="submit" className="btn-primary" disabled={submittingComment}>
                  {submittingComment ? 'Publicando...' : 'Comentar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
