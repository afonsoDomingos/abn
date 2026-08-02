'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Hero() {
  const { t, language } = useLanguage();
  const [content, setContent] = useState<any>({
    title: '',
    description: '',
    banners: []
  });
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Search Bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const SEARCH_ITEMS = [
    { title: language === 'pt' ? 'ABN Startup 180 (Incubação & Aceleração)' : 'ABN Startup 180 (Incubation)', type: language === 'pt' ? 'Programa' : 'Program', link: '/incubacao', icon: '🚀' },
    { title: language === 'pt' ? 'Mentalidade Empreendedora' : 'Entrepreneurial Mindset', type: language === 'pt' ? 'Capacitação' : 'Training', link: '/incubacao', icon: '🧠' },
    { title: language === 'pt' ? 'Clube dos Empreendedores & Network' : 'Entrepreneurs Club & Network', type: language === 'pt' ? 'Comunidade' : 'Community', link: '/incubacao', icon: '🏛️' },
    { title: language === 'pt' ? 'Bolsas de Estudo e Financiamentos' : 'Grants & Funding Opportunities', type: language === 'pt' ? 'Oportunidade' : 'Opportunity', link: '/oportunidades', icon: '💰' },
    { title: language === 'pt' ? 'Rede de Mentores e Especialistas' : 'Mentor & Expert Network', type: language === 'pt' ? 'Mentoria' : 'Mentorship', link: '/#especialistas', icon: '👨‍🏫' },
    { title: language === 'pt' ? 'Cursos Certificados e Bootcamps' : 'Certified Courses & Bootcamps', type: language === 'pt' ? 'Academia' : 'Academy', link: '/dashboard/formacao', icon: '📚' },
    { title: language === 'pt' ? 'Próximos Eventos & Summits' : 'Upcoming Events & Summits', type: language === 'pt' ? 'Eventos' : 'Events', link: '/eventos', icon: '📅' },
    { title: language === 'pt' ? 'Marketplace de Serviços Empresariais' : 'Business Services Marketplace', type: language === 'pt' ? 'Serviços' : 'Services', link: '/marketplace', icon: '💼' },
  ];

  const filteredSearch = searchQuery.trim() === ''
    ? []
    : SEARCH_ITEMS.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.hero_content) {
          setContent(data.configs.hero_content);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const displayDesc = (language === 'pt' && content.description) ? content.description : t.hero.desc;

  useEffect(() => {
    if (content.banners && content.banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % content.banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [content.banners]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroWrapper}>
        {/* Right side banner image */}
        <div className={styles.bannerImage} style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
          {loading ? (
            <div className={styles.spinner}></div>
          ) : content.banners && content.banners.length > 0 ? (
            content.banners.map((imgUrl: string, idx: number) => (
              <div
                key={idx}
                style={{
                  backgroundImage: `url(${imgUrl})`,
                  opacity: idx === currentBanner ? 1 : 0,
                  transition: 'opacity 1.5s ease-in-out',
                  position: 'absolute',
                  inset: 0,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 20%',
                  zIndex: idx === currentBanner ? 2 : 1
                }}
              />
            ))
          ) : (
            <div
              style={{
                backgroundImage: `url('/hero_entrepreneurs.png')`,
                opacity: 1,
                position: 'absolute',
                inset: 0,
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%',
                zIndex: 2
              }}
            />
          )}
        </div>

        {/* Left side blue card */}
        <div className={styles.blueCard}>
          <div className={styles.blueCardContent}>
            <h1 className={styles.title}>
              {language === 'pt' ? 'Empreendedorismo para um mundo melhor' : 'Entrepreneurship for a better world'}
            </h1>
            <p className={styles.description}>
              {displayDesc}
            </p>
            <div className={styles.ctaWrapper}>
              <a href="/registro" className="btn-primary">
                {language === 'pt' ? 'Junte-se a nós' : 'Join us'}
              </a>
            </div>

            {/* Quick Search Bar */}
            <div style={{ position: 'relative', marginTop: '1.5rem', maxWidth: '460px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '4px 6px 4px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                <span style={{ fontSize: '1rem', marginRight: '8px', opacity: 0.85 }}>🔍</span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  placeholder={language === 'pt' ? 'O que procura? (ex: Incubação, Mentores...)' : 'Search (e.g. Incubation, Mentors...)'}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%', fontFamily: 'inherit' }}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => { setSearchQuery(''); setShowResults(false); }}
                    style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, padding: '0 8px', fontSize: '0.85rem' }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchQuery.trim().length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 12px 32px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 100, color: '#0f172a' }}>
                  {filteredSearch.length === 0 ? (
                    <div style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                      {language === 'pt' ? 'Nenhum resultado encontrado para ' : 'No results found for '} "<strong>{searchQuery}</strong>"
                    </div>
                  ) : (
                    <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '6px' }}>
                      {filteredSearch.map((item, i) => (
                        <Link
                          key={i}
                          href={item.link}
                          onClick={() => setShowResults(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', color: '#0f172a', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{item.title}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{item.type}</span>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>→</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Overlapping Orange Pin */}
          <div className={styles.overlappingPin}>
            <svg viewBox="0 0 24 30" width="80" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18c0-6.63-5.37-12-12-12z" fill="#ff6b00" />
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="#ffffff" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
