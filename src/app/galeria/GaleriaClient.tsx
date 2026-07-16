'use client';

import { useState } from 'react';
import styles from './GaleriaPublic.module.css';

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

interface GaleriaClientProps {
  initialItems: GalleryItem[];
}

export default function GaleriaClient({ initialItems }: GaleriaClientProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'podcast' | 'publication'>('photo');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  // Filter items based on active tab
  const filteredItems = initialItems.filter(item => item.type === activeTab);

  // Helper to extract YouTube video ID
  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return '';
    try {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
      } else if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1].split(/[?#]/)[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch {
      return '';
    }
  };

  return (
    <>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'photo' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('photo')}
        >
          Fotografias
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'video' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('video')}
        >
          Vídeos
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'podcast' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('podcast')}
        >
          Podcasts
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'publication' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('publication')}
        >
          Publicações
        </button>
      </div>

      <div className={styles.galleryGrid}>
        {filteredItems.length === 0 ? (
          <div className={styles.empty}>
            <span>🖼️</span>
            <p>Nenhum item nesta categoria no momento.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            // RENDERING FOTOGRAFIAS
            if (item.type === 'photo') {
              return (
                <div key={item._id} className={styles.photoCard} onClick={() => setActivePhoto(item)}>
                  <div className={styles.photoWrapper}>
                    <img src={item.imageUrl || '/articles/gala.png'} alt={item.title} />
                    <div className={styles.photoOverlay}>
                      <h4>{item.title}</h4>
                      <span>📍 {item.location || 'Ecossistema'} | {item.date}</span>
                    </div>
                  </div>
                </div>
              );
            }

            // RENDERING VIDEOS
            if (item.type === 'video') {
              const embedUrl = getYoutubeEmbedUrl(item.mediaUrl);
              return (
                <div key={item._id} className={styles.videoCard}>
                  <div className={styles.videoEmbedWrapper}>
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', fontSize: '0.8rem', color: '#ff6b00' }}>
                        Link de vídeo inválido
                      </div>
                    )}
                  </div>
                  <div className={styles.videoInfo}>
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                      📅 {item.date} {item.location && `| 📍 ${item.location}`}
                    </div>
                  </div>
                </div>
              );
            }

            // RENDERING PODCASTS
            if (item.type === 'podcast') {
              const isSoundcloud = item.mediaUrl?.includes('soundcloud.com');
              return (
                <div key={item._id} className={styles.podcastCard}>
                  <div className={styles.podcastCover}>
                    <img src={item.imageUrl || '/articles/nilza.png'} alt={item.title} />
                  </div>
                  <h4 className={styles.podcastTitle}>{item.title}</h4>
                  <p className={styles.podcastDesc}>{item.content}</p>

                  <div className={styles.audioPlaceholder}>
                    {isSoundcloud ? (
                      <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="btn-outline styles.podcastBtn">
                        🎧 Ouvir no SoundCloud
                      </a>
                    ) : item.mediaUrl?.startsWith('http') ? (
                      <audio controls className={styles.audioPlayer}>
                        <source src={item.mediaUrl} type="audio/mpeg" />
                        Seu navegador não suporta reprodução de áudio.
                      </audio>
                    ) : (
                      <a href={item.mediaUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary styles.podcastBtn">
                        🎧 Ouvir Episódio
                      </a>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
                    📅 {item.date} {item.location && `| 📍 ${item.location}`}
                  </div>
                </div>
              );
            }

            // RENDERING PUBLICACOES
            if (item.type === 'publication') {
              return (
                <div key={item._id} className={styles.pubCard}>
                  <div className={styles.pdfIcon}>📕</div>
                  <h4>{item.title}</h4>
                  <p>{item.content}</p>
                  {item.mediaUrl ? (
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.82rem', textDecoration: 'none' }}
                    >
                      Descarregar PDF
                    </a>
                  ) : (
                    <button className="btn-outline" disabled style={{ opacity: 0.5, padding: '8px 20px', fontSize: '0.82rem' }}>
                      Indisponível
                    </button>
                  )}
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                    📅 Publicado em: {item.date}
                  </div>
                </div>
              );
            }

            return null;
          })
        )}
      </div>

      {/* Photo Lightbox Modal */}
      {activePhoto && (
        <div className={styles.lightboxOverlay} onClick={() => setActivePhoto(null)}>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActivePhoto(null)}>✕</button>
            <img src={activePhoto.imageUrl} alt={activePhoto.title} className={styles.lightboxImg} />
            <div className={styles.lightboxCaption}>
              <h3>{activePhoto.title}</h3>
              <p>{activePhoto.content} {activePhoto.location && `| 📍 ${activePhoto.location}`} | {activePhoto.date}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
