'use client';

import { useEffect, useState } from 'react';
import styles from './Articles.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Articles() {
  const { t, language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [articles, setArticles] = useState([
    {
      type: 'news',
      location: 'Moçambique',
      title: 'Orange Corners Moçambique: Dia do Embaixador',
      date: '02/06/2026',
      desc: 'Nossos embaixadores estudantis desempenham um papel fundamental na conexão do Orange Corners com estudantes universitários, inspirando curiosidade...',
      img: '/articles/ambassador-day.png'
    },
    {
      type: 'photos',
      location: 'Moçambique',
      title: 'Fotos do Orange Corners Moçambique: Gala do Empreendedorismo',
      date: '28/11/2025',
      desc: 'No início deste mês, o Orange Corners Entrepreneurship Gala, em Moçambique, reuniu ex-alunos de todo o país...',
      img: '/articles/gala.png'
    },
    {
      type: 'article',
      location: 'Moçambique',
      title: 'Nilza Mazive e Xiphefu: energia inteligente para impulsionar o futuro de Moçambique',
      date: '25/08/2025',
      desc: 'Num país onde apenas cerca de 40% da população tem acesso à eletricidade, poupar energia...',
      img: '/articles/nilza.png'
    }
  ]);

  const [viewsMap, setViewsMap] = useState<Record<string, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, Array<{ name: string; text: string; date: string }>>>({
    'Orange Corners Moçambique: Dia do Embaixador': [
      { name: 'Afonso Domingos', text: 'Excelente iniciativa! Os embaixadores fazem a diferença.', date: '02/06/2026' }
    ]
  });

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.articles_content) {
          const list = data.configs.articles_content;
          setArticles(list);
          
          // Seed initial random views and comments for realism
          const vMap: Record<string, number> = {};
          const cMap: Record<string, any[]> = { ...commentsMap };
          list.forEach((item: any) => {
            if (!vMap[item.title]) {
              vMap[item.title] = Math.floor(Math.random() * 200) + 45;
            }
            if (!cMap[item.title]) {
              cMap[item.title] = [
                { name: 'Lucas Maputo', text: 'Incrível ver este ecossistema a crescer!', date: item.date },
                { name: 'Amélia Santos', text: 'Grande orgulho de fazer parte deste impacto.', date: item.date }
              ];
            }
          });
          setViewsMap(vMap);
          setCommentsMap(cMap);
        }
      });
  }, []);

  const handleOpenArticle = (item: any, title: string, desc: string, location: string) => {
    // Increment view count when clicked
    setViewsMap(prev => ({
      ...prev,
      [title]: (prev[title] || 1) + 1
    }));
    setSelectedArticle({ ...item, translatedTitle: title, translatedDesc: desc, translatedLocation: location });
  };

  // Map article type to badge style class
  const badgeStyleMap: Record<string, string> = {
    news: styles.badgeNews,
    photos: styles.badgePhotos, 
    article: styles.badgeArticle
  };

  return (
    <section className={styles.section} id="artigos">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {language === 'pt' ? 'Mais recentes' : 'The latest'}
          </h2>
          <a href="/marketplace" className={`btn-outline ${styles.headerBtn}`}>
            {language === 'pt' ? 'Ver todas as novidades' : 'View all of the latest'}
          </a>
        </div>

        <div className={`${styles.grid} ${articles.length >= 6 ? styles.scrollableGrid : ''}`}>
          {articles.map((item: any, index: number) => {
            const translated = language !== 'pt' && t.articles?.items?.[index] ? t.articles.items[index] : null;
            const title = translated ? translated.title : item.title;
            const desc = translated ? translated.desc : item.desc;
            const location = translated ? translated.location : item.location;
            
            const imgPath = item.img || '/articles/ambassador-day.png';
            const badgeClass = badgeStyleMap[item.type] || styles.badgeNews;
            
            // Adjust label for research/photos to look professional
            let typeLabel = t.articles?.types?.[item.type] || item.type;
            if (item.type === 'photos') {
              typeLabel = language === 'pt' ? 'Pesquisa' : 'Research';
            }

            return (
              <article key={index} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <span className={`${styles.typeBadge} ${badgeClass}`}>
                    {typeLabel}
                  </span>
                  <img 
                    src={imgPath} 
                    alt={title} 
                    className={styles.image} 
                    loading="lazy"
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
                      <span title="Visualizações" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>👁️ {viewsMap[item.title] || 0}</span>
                      <span title="Comentários" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>💬 {commentsMap[item.title]?.length || 0}</span>
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
      </div>

      {selectedArticle && (
        <div className={styles.modalOverlay} onClick={() => setSelectedArticle(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedArticle(null)}>&times;</button>
            <img 
              src={selectedArticle.img || '/articles/ambassador-day.png'} 
              alt={selectedArticle.translatedTitle || selectedArticle.title} 
              className={styles.modalImg} 
            />
            <div className={styles.modalBody}>
              <span className={styles.location}>{selectedArticle.translatedLocation || selectedArticle.location}</span>
              <h3 className={styles.modalTitle}>{selectedArticle.translatedTitle || selectedArticle.title}</h3>
              <span className={styles.date}>{selectedArticle.date}</span>
              <div className={styles.modalText}>{selectedArticle.translatedDesc || selectedArticle.desc}</div>
              
              {/* Dynamic Comments Section inside Article modal */}
              <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#111' }}>
                  💬 Comentários ({commentsMap[selectedArticle.title]?.length || 0})
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
                    if (!newCommentName.trim() || !newCommentText.trim()) return;
                    
                    const newComment = {
                      name: newCommentName,
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
                  <input 
                    type="text" 
                    placeholder="Seu nome" 
                    value={newCommentName}
                    onChange={e => setNewCommentName(e.target.value)}
                    required
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', color: '#111', background: '#fff' }}
                  />
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
