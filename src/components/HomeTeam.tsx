'use client';

import { useEffect, useRef, useState } from 'react';
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
  { _id: 'f3', name: 'Afonso Domingos', role: 'Director de Tecnologia e Inovação', department: 'Direcção de Tecnologia e Inovação', expertise: ['Inteligência Artificial', 'Transformação Digital', 'Branding'], image: '', status: 'ativo', order: 4 },
  { _id: 'f4', name: 'Lizi Cristina Mulambo', role: 'Directora de Administração, Finanças e RH', department: 'Direcção de Administração, Finanças e RH', expertise: ['Gestão Financeira', 'Recursos Humanos', 'Liderança'], image: '', status: 'ativo', order: 5 },
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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(data => {
        if (data.team && data.team.length > 0) {
          const active = data.team
            .filter((m: TeamMember) => m.status === 'ativo')
            .sort((a: TeamMember, b: TeamMember) => a.order - b.order)
            .slice(0, 4);
          if (active.length > 0) setTeam(active);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* Intersection Observer — animate cards in when visible */
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const idx = Number(el.dataset.idx ?? 0);
            setTimeout(() => el.classList.add(styles.visible), idx * 100);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    cardRefs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loading, team]);

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
          <Link href="/equipa" className={styles.viewAllBtn}>
            Ver equipa completa <span className={styles.viewAllArrow}>→</span>
          </Link>
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
          <div className={styles.grid}>
            {team.map((member, idx) => {
              const { color, bg } = getRoleMeta(member.role);
              return (
                <div
                  key={member._id}
                  className={styles.card}
                  data-idx={idx}
                  ref={el => { cardRefs.current[idx] = el; }}
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
