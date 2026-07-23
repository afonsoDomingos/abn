'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './HomeTeam.module.css';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  expertise: string[];
  image: string;
  status: string;
  order: number;
}

const FALLBACK: TeamMember[] = [
  { _id: 'f1', name: 'Leonel Sapite', role: 'Director de Programas', department: 'Direcção de Programas, Incubação e Sustentabilidade', expertise: ['Desenvolvimento Comunitário', 'Empreendedorismo', 'Direitos Humanos'], image: '', status: 'ativo', order: 1 },
  { _id: 'f2', name: 'Josina Aurora Nhantumbo', role: 'Directora Adjunta de Programas', department: 'Direcção de Programas, Incubação e Sustentabilidade', expertise: ['Igualdade de Género', 'Inclusão Social', 'Empoderamento Económico'], image: '', status: 'ativo', order: 2 },
  { _id: 'f3', name: 'Contardo Muarramuassa', role: 'Director Adjunto de Programas', department: 'Direcção de Programas, Incubação e Sustentabilidade', expertise: ['Desenvolvimento Comunitário', 'Planeamento Territorial', 'WASH'], image: '', status: 'ativo', order: 3 },
  { _id: 'f4', name: 'Afonso Domingos', role: 'Director de Tecnologia e Inovação', department: 'Direcção de Tecnologia e Inovação', expertise: ['Inteligência Artificial', 'Transformação Digital', 'Branding'], image: '', status: 'ativo', order: 4 },
  { _id: 'f5', name: 'Lizi Cristina Mulambo', role: 'Directora de Administração, Finanças e RH', department: 'Direcção de Administração, Finanças e RH', expertise: ['Gestão Financeira', 'Recursos Humanos', 'Liderança'], image: '', status: 'ativo', order: 5 },
  { _id: 'f6', name: 'Yolanda Emídio', role: 'Assistente Administrativa', department: 'Direcção de Administração, Finanças e RH', expertise: ['Apoio Administrativo', 'Gestão Documental', 'Suporte'], image: '', status: 'ativo', order: 6 },
  { _id: 'f7', name: 'Nádya Cristina Domingos Cosmo', role: 'Directora de Investimentos e Parcerias', department: 'Direcção de Investimentos e Parcerias', expertise: ['Mobilização de Investimentos', 'Parcerias Estratégicas'], image: '', status: 'ativo', order: 7 },
  { _id: 'f8', name: 'Gabriel Armindo', role: 'Director de MEAL', department: 'Direcção de Monitoria, Avaliação e Aprendizagem', expertise: ['MEAL', 'Monitoria e Avaliação', 'Power BI'], image: '', status: 'ativo', order: 8 },
];

function getRoleMeta(role: string): { color: string; bg: string } {
  const r = role.toLowerCase();
  if (r.includes('director') || r.includes('directora') || r.includes('presidente'))
    return { color: '#c2410c', bg: 'rgba(194,65,12,0.08)' };
  if (r.includes('tech') || r.includes('tecnologia') || r.includes('inovação') || r.includes('cto'))
    return { color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' };
  if (r.includes('adjunto') || r.includes('adjunta') || r.includes('rh') || r.includes('humanos'))
    return { color: '#15803d', bg: 'rgba(21,128,61,0.08)' };
  if (r.includes('financ') || r.includes('administra'))
    return { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' };
  if (r.includes('invest') || r.includes('parceria'))
    return { color: '#be185d', bg: 'rgba(190,24,93,0.08)' };
  if (r.includes('meal') || r.includes('monitoria'))
    return { color: '#0e7490', bg: 'rgba(14,116,144,0.08)' };
  return { color: '#ff6b00', bg: 'rgba(255,107,0,0.08)' };
}

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
}

export default function HomeTeam() {
  const [team, setTeam] = useState<TeamMember[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(data => {
        if (data.team && data.team.length > 0) {
          const active = data.team
            .filter((m: TeamMember) => m.status === 'ativo')
            .sort((a: TeamMember, b: TeamMember) => a.order - b.order);
          if (active.length > 0) setTeam(active);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Update cards per page based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) setCardsPerPage(1);
      else if (window.innerWidth < 768) setCardsPerPage(2);
      else if (window.innerWidth < 1100) setCardsPerPage(3);
      else setCardsPerPage(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(team.length / cardsPerPage);

  // Auto-rotate carousel every 4.5 seconds
  useEffect(() => {
    if (loading || totalPages <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalPages);
    }, 4500);

    return () => clearInterval(interval);
  }, [loading, totalPages, isPaused]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalPages);
  };

  // Get current visible subset of team members
  const visibleMembers = team.slice(
    currentIndex * cardsPerPage,
    currentIndex * cardsPerPage + cardsPerPage
  );

  // If page overflows near the end, fill up with wrapping members
  const displayMembers = [...visibleMembers];
  if (displayMembers.length < cardsPerPage && team.length >= cardsPerPage) {
    const needed = cardsPerPage - displayMembers.length;
    displayMembers.push(...team.slice(0, needed));
  }

  return (
    <section className={styles.section} id="equipa">
      <div className={styles.container}>
        {/* Header row */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.sectionLabel}>A Nossa Equipa</div>
            <h2>As pessoas por trás da ABN</h2>
            <p>Uma equipa multidisciplinar unida pelo propósito de transformar o ecossistema empresarial em África.</p>
          </div>

          <div className={styles.headerActions}>
            {/* Carousel navigation arrows */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={styles.navBtn} 
                  onClick={handlePrev}
                  aria-label="Anterior"
                  title="Anterior"
                >
                  ←
                </button>
                <button 
                  className={styles.navBtn} 
                  onClick={handleNext}
                  aria-label="Próximo"
                  title="Próximo"
                >
                  →
                </button>
              </div>
            )}

            <Link href="/equipa" className={styles.viewAllBtn}>
              Ver equipa completa <span className={styles.viewAllArrow}>→</span>
            </Link>
          </div>
        </div>

        {/* Skeleton loaders */}
        {loading ? (
          <div className={styles.grid}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonImg} />
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine} style={{ width: '50%' }} />
                  <div className={styles.skeletonLine} style={{ width: '80%' }} />
                  <div className={styles.skeletonLine} style={{ width: '65%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className={styles.carouselContainer}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={styles.grid}>
              {displayMembers.map((member, idx) => {
                const { color, bg } = getRoleMeta(member.role);
                return (
                  <div
                    key={`${member._id}-${idx}`}
                    className={styles.card}
                  >
                    {/* Photo */}
                    <div className={styles.imageWrapper}>
                      {member.image ? (
                        <img src={member.image} alt={member.name} className={styles.image} />
                      ) : (
                        <div className={styles.placeholder}>
                          <div className={styles.initials}>{getInitials(member.name)}</div>
                        </div>
                      )}
                      <div className={styles.imageGradient} />
                    </div>

                    {/* Info */}
                    <div className={styles.cardContent}>
                      <span className={styles.roleBadge} style={{ color, background: bg, borderColor: `${color}33` }}>
                        {member.role}
                      </span>
                      <h3 className={styles.name}>{member.name}</h3>
                      {member.department && <p className={styles.dept}>{member.department}</p>}

                      {member.expertise && member.expertise.length > 0 && (
                        <>
                          <div className={styles.divider} />
                          <div className={styles.tags}>
                            {member.expertise.slice(0, 3).map((e, i) => (
                              <span key={i} className={styles.tag}>{e}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination dots */}
            {totalPages > 1 && (
              <div className={styles.dotsContainer}>
                {Array.from({ length: totalPages }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    className={`${styles.dot} ${currentIndex === dotIdx ? styles.dotActive : ''}`}
                    onClick={() => setCurrentIndex(dotIdx)}
                    aria-label={`Página ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && (
          <div className={styles.ctaStrip}>
            <p>Quer conhecer <span>toda a equipa</span> e os seus perfis detalhados?</p>
            <Link href="/equipa" className={styles.ctaLink}>
              Ver equipa completa →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
