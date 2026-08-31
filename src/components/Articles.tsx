'use client';

import { useEffect, useState } from 'react';
import styles from './Articles.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Articles() {
  const { t, language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewsMap, setViewsMap] = useState<Record<string, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, Array<{ name: string; text: string; date: string }>>>({});

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // Fetch posts directly from the database API
    fetch('/api/posts?section=news')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.posts && data.posts.length > 0) {
          const formattedPosts = data.posts.map((p: any) => ({
            _id: p._id,
            type: p.type || 'news',
            location: p.location || 'Moçambique',
            title: p.title,
            date: p.date ? (typeof p.date === 'string' ? p.date.split('T')[0] : p.date) : 'Recente',
            desc: p.content || '',
            img: p.imageUrl || '/articles/ambassador-day.png',
            views: p.views || 0,
            comments: p.comments || []
          }));

          setArticles(formattedPosts);

          const vMap: Record<string, number> = {};
          const cMap: Record<string, any[]> = {};

          formattedPosts.forEach((item: any) => {
            vMap[item.title] = item.views || Math.floor(Math.random() * 50) + 10;
            cMap[item.title] = item.comments || [];
          });

          setViewsMap(vMap);
          setCommentsMap(cMap);
        } else {
          // Check config fallback if needed
          fetch('/api/config')
            .then(res => res.json())
            .then(configData => {
              if (configData.configs && configData.configs.articles_content) {
                setArticles(configData.configs.articles_content);
              }
            })
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleOpenArticle = (item: any, title: string, desc: string, location: string) => {
    // Increment view count
    setViewsMap(prev => ({
      ...prev,
      [title]: (prev[title] || 0) + 1
    }));
    setSelectedArticle({ ...item, translatedTitle: title, translatedDesc: desc, translatedLocation: location });
  };

  // Map article type to badge style class
  const badgeStyleMap: Record<string, string> = {
    news: styles.badgeNews,
    photos: styles.badgePhotos, 
    article: styles.badgeArticle,
    sucesso: styles.badgeArticle,
    comunicado: styles.badgeNews
  };

  return (
    <section className={styles.section} id="artigos">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {language === 'pt' ? 'Mais recentes' : 'The latest'}
          </h2>
          <a href="/noticias" className={`btn-outline ${styles.headerBtn}`}>
            {language === 'pt' ? 'Ver todas as novidades' : 'View all of the latest'}
          </a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>A carregar notícias do banco de dados...</p>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Nenhuma notícia publicada no momento.</p>
          </div>
        ) : (
          <div className={`${styles.grid} ${articles.length >= 6 ? styles.scrollableGrid : ''}`}>
            {articles.map((item: any, index: number) => {
              const title = item.title;
              const desc = item.desc;
              const location = item.location || 'África';
              
              const imgPath = item.img || '/articles/ambassador-day.png';
              const badgeClass = badgeStyleMap[item.type] || styles.badgeNews;
              
              let typeLabel = item.type;
              if (item.type === 'news') typeLabel = language === 'pt' ? 'Notícia' : 'News';
              else if (item.type === 'sucesso') typeLabel = language === 'pt' ? 'História de Sucesso' : 'Success Story';
              else if (item.type === 'comunicado') typeLabel = language === 'pt' ? 'Comunicado' : 'Announcement';
              else if (item.type === 'photos') typeLabel = language === 'pt' ? 'Galeria' : 'Photos';
              else if (item.type === 'article') typeLabel = language === 'pt' ? 'Artigo' : 'Article';

              return (
                <article key={item._id || index} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <span className={`${styles.typeBadge} ${badgeClass}`}>
                      {typeLabel}
                    </span>
                    <img 
                      src={imgPath} 
                      alt="" 
                      className={styles.image} 
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('ambassador-day.png')) {
                          target.src = '/articles/ambassador-day.png';
                        }
                      }}
                    />
                  </div>
                  <div className={styles.content}>
                    <div className={styles.locationWrapper}>
                      <span className={styles.location}>{location}</span>
                    </div>
                    <h3 className={styles.articleTitle}>{title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className={styles.date} style={{ margin: 0 }}>{item.date}</span>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <span title="Visualizações" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>{viewsMap[item.title] || 0} visualizações</span>
                        <span title="Comentários" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>{(commentsMap[item.title] || []).length} comentários</span>
                      </div>
                    </div>
                    <p className={styles.desc}>{desc}</p>
                    <button 
                      className={styles.readMoreBtn} 
                      onClick={() => handleOpenArticle(item, title, desc, location)}
                    >
                      {language === 'pt' ? 'Ler mais' : 'Read more'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {selectedArticle && (
        <div className={styles.modalOverlay} onClick={() => setSelectedArticle(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedArticle(null)}>&times;</button>
            <img 
              src={selectedArticle.img || '/articles/ambassador-day.png'} 
              alt="" 
              className={styles.modalImg} 
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('ambassador-day.png')) {
                  target.src = '/articles/ambassador-day.png';
                }
              }}
            />
            <div className={styles.modalBody}>
              <span className={styles.location}>{selectedArticle.translatedLocation || selectedArticle.location}</span>
              <h3 className={styles.modalTitle}>{selectedArticle.translatedTitle || selectedArticle.title}</h3>
              <span className={styles.date}>{selectedArticle.date}</span>
              <div className={styles.modalText}>{selectedArticle.translatedDesc || selectedArticle.desc}</div>
              
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--foreground)' }}>
                  Comentários ({(commentsMap[selectedArticle.title] || []).length})
                </h4>
                
                {/* List Comments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  {(commentsMap[selectedArticle.title] || []).length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: '#999', fontSize: '0.9rem' }}>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                  ) : (
                    (commentsMap[selectedArticle.title] || []).map((c, i) => (
                      <div key={i} style={{ background: '#f9f9f9', padding: '1.25rem', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                          <strong style={{ color: '#111' }}>{c.name}</strong>
                          <span style={{ color: '#999' }}>{c.date}</span>
                        </div>
                        <p style={{ margin: 0, color: '#555', fontSize: '0.92rem', lineHeight: '1.5' }}>{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const commenterName = currentUser ? currentUser.name : newCommentName;
                    if (!commenterName.trim() || !newCommentText.trim()) return;
                    
                    const newComment = {
                      name: commenterName,
                      text: newCommentText,
                      date: new Date().toLocaleDateString('pt-PT')
                    };
                    
                    setCommentsMap(prev => ({
                      ...prev,
                      [selectedArticle.title]: [...(prev[selectedArticle.title] || []), newComment]
                    }));
                    
                    setNewCommentName('');
                    setNewCommentText('');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f5f5f5', padding: '1.5rem', borderRadius: '10px' }}
                >
                  <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>Adicionar um comentário</h5>
                  {currentUser ? (
                    <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '4px' }}>
                      Comentando como: <strong style={{ color: 'var(--primary)' }}>{currentUser.name}</strong>
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="Seu nome" 
                      value={newCommentName}
                      onChange={e => setNewCommentName(e.target.value)}
                      required
                      style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', color: '#111', background: '#fff' }}
                    />
                  )}
                  <textarea 
                    placeholder="Digite seu comentário..." 
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    required
                    rows={3}
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', resize: 'vertical', color: '#111', background: '#fff' }}
                  />
                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.85rem' }}>
                    Comentar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}