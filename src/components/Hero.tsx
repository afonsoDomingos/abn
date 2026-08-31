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

  // Typewriter effect
  const PHRASES_PT = [
    'Empreendedorismo para um mundo melhor',
    'Conectamos startups a investidores',
    'Acelere o seu negócio em África',
    'Rede de oportunidades empresariais',
  ];
  const PHRASES_EN = [
    'Entrepreneurship for a better world',
    'Connecting startups to investors',
    'Accelerate your business in Africa',
    'A network of business opportunities',
  ];
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Search Bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const SEARCH_ITEMS = [
    { title: language === 'pt' ? 'ABN Startup 180 (Incubação & Aceleração)' : 'ABN Startup 180 (Incubation)', type: language === 'pt' ? 'Programa' : 'Program', link: '/incubacao' },
    { title: language === 'pt' ? 'Mentalidade Empreendedora' : 'Entrepreneurial Mindset', type: language === 'pt' ? 'Capacitação' : 'Training', link: '/incubacao' },
    { title: language === 'pt' ? 'Clube dos Empreendedores & Network' : 'Entrepreneurs Club & Network', type: language === 'pt' ? 'Comunidade' : 'Community', link: '/incubacao' },
    { title: language === 'pt' ? 'Bolsas de Estudo e Financiamentos' : 'Grants & Funding Opportunities', type: language === 'pt' ? 'Oportunidade' : 'Opportunity', link: '/oportunidades' },
    { title: language === 'pt' ? 'Rede de Mentores e Especialistas' : 'Mentor & Expert Network', type: language === 'pt' ? 'Mentoria' : 'Mentorship', link: '/especialistas' },
    { title: language === 'pt' ? 'Cursos Certificados e Bootcamps' : 'Certified Courses & Bootcamps', type: language === 'pt' ? 'Academia' : 'Academy', link: '/dashboard/formacao' },
    { title: language === 'pt' ? 'Próximos Eventos & Summits' : 'Upcoming Events & Summits', type: language === 'pt' ? 'Eventos' : 'Events', link: '/eventos' },
    { title: language === 'pt' ? 'Marketplace de Serviços Empresariais' : 'Business Services Marketplace', type: language === 'pt' ? 'Serviços' : 'Services', link: '/marketplace' },
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

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(blink);
  }, []);

  // Typewriter logic
  useEffect(() => {
    const phrases = language === 'pt' ? PHRASES_PT : PHRASES_EN;
    const currentPhrase = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < currentPhrase.length) {
      timeout = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 48);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
      }, 24);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex(i => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, language]);

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
              {typedText}
              <span style={{
                display: 'inline-block',
                width: '3px',
                height: '0.9em',
                backgroundColor: '#ff6b00',
                marginLeft: '4px',
                verticalAlign: 'middle',
                borderRadius: '1px',
                opacity: showCursor ? 1 : 0,
                transition: 'opacity 0.1s',
              }} />
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
            <div className={styles.searchContainer}>
            <div className={styles.searchShell}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  placeholder={language === 'pt' ? 'O que procura? (ex: Incubação, Mentores...)' : 'Search (e.g. Incubation, Mentors...)'}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setShowResults(false); }}
                    className={styles.clearBtn}
                    title={language === 'pt' ? 'Limpar' : 'Clear'}
                  >
                    ✕
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowResults(true)}
                  className={styles.searchBtn}
                >
                  {language === 'pt' ? 'Pesquisar' : 'Search'}
                </button>
              </div>

              {/* Quick Tags / Suggestions */}
              <div className={styles.quickChips}>
                <span className={styles.chipLabel}>{language === 'pt' ? 'Populares:' : 'Popular:'}</span>
                <button
                  type="button"
                  className={styles.chip}
                  onClick={() => { setSearchQuery('Incubação'); setShowResults(true); }}
                >
                  {language === 'pt' ? 'Incubação' : 'Incubation'}
                </button>
                <button
                  type="button"
                  className={styles.chip}
                  onClick={() => { setSearchQuery('Mentores'); setShowResults(true); }}
                >
                  {language === 'pt' ? 'Mentoria' : 'Mentorship'}
                </button>
                <button
                  type="button"
                  className={styles.chip}
                  onClick={() => { setSearchQuery('Bolsas'); setShowResults(true); }}
                >
                  {language === 'pt' ? 'Oportunidades' : 'Grants'}
                </button>
                <button
                  type="button"
                  className={styles.chip}
                  onClick={() => { setSearchQuery('Eventos'); setShowResults(true); }}
                >
                  {language === 'pt' ? 'Eventos' : 'Events'}
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchQuery.trim().length > 0 && (
                <div className={styles.dropdownCard}>
                  {filteredSearch.length === 0 ? (
                    <div style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                      {language === 'pt' ? 'Nenhum resultado encontrado para ' : 'No results found for '} "<strong>{searchQuery}</strong>"
                    </div>
                  ) : (
                    <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
                      {filteredSearch.map((item, i) => (
                        <Link
                          key={i}
                          href={item.link}
                          onClick={() => setShowResults(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: '#0f172a',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{item.title}</span>
                            <span style={{ fontSize: '0.7rem', color: '#ff6b00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.type}</span>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#ff6b00', fontWeight: 700 }}>→</span>
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
