'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import styles from './Equipa.module.css';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  expertise: string[];
  responsibilities: string[];
  image: string;
  linkedin: string;
  email: string;
  order: number;
  status: string;
}

const FLAGS: Record<string, string> = {
  'Angola': '\uD83C\uDDE6\uD83C\uDDF4',
  'Cabo Verde': '\uD83C\uDDE8\uD83C\uDDFB',
  'Guine-Bissau': '\uD83C\uDDEC\uD83C\uDDFC',
  'Mocambique': '\uD83C\uDDF2\uD83C\uDDFF',
  'Portugal': '\uD83C\uDDF5\uD83C\uDDF9',
  'Sao Tome e Principe': '\uD83C\uDDF8\uD83C\uDDF9',
  'Brasil': '\uD83C\uDDE7\uD83C\uDDF7',
  'Franca': '\uD83C\uDDEB\uD83C\uDDF7',
  'Espanha': '\uD83C\uDDEA\uD83C\uDDF8',
  'Nigeria': '\uD83C\uDDF3\uD83C\uDDEC',
  'Senegal': '\uD83C\uDDF8\uD83C\uDDF3',
  'Africa do Sul': '\uD83C\uDDFF\uD83C\uDDE6',
  'Quenia': '\uD83C\uDDF0\uD83C\uDDEA',
  'Gana': '\uD83C\uDDEC\uD83C\uDDED',
  'Ruanda': '\uD83C\uDDF7\uD83C\uDDFC',
};

function getRoleMeta(role: string): { color: string; bg: string } {
  const r = role.toLowerCase();
  if (r.includes('ceo') || r.includes('director') || r.includes('directora') || r.includes('presidente') || r.includes('fundador') || r.includes('co-fundador'))
    return { color: '#f1c40f', bg: 'rgba(241,196,15,0.12)' };
  if (r.includes('tech') || r.includes('desenvolv') || r.includes('developer') || r.includes('cto'))
    return { color: '#3498db', bg: 'rgba(52,152,219,0.12)' };
  if (r.includes('rh') || r.includes('recursos') || r.includes('humanos') || r.includes('people'))
    return { color: '#2ecc71', bg: 'rgba(46,204,113,0.12)' };
  if (r.includes('market') || r.includes('comunic') || r.includes('design'))
    return { color: '#e67e22', bg: 'rgba(230,126,34,0.12)' };
  if (r.includes('financ') || r.includes('cfo') || r.includes('contab'))
    return { color: '#9b59b6', bg: 'rgba(155,89,182,0.12)' };
  return { color: 'var(--primary)', bg: 'rgba(212,175,55,0.1)' };
}

const DEFAULT_TEAM: TeamMember[] = [];

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBio, setExpandedBio] = useState<number | null>(null);
  const [bannerUrl, setBannerUrl] = useState('/abn-cover.jpg');

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.team && data.team.length > 0) {
          setTeam(data.team.filter((m: TeamMember) => m.status === 'ativo'));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.equipa) {
          setBannerUrl(data.configs.page_banners.equipa);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero} style={{ backgroundImage: `url('${bannerUrl}')` }}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>A Nossa Equipa</span>
            <h1>As pessoas por tras da ABN</h1>
            <p>Conheca os profissionais que trabalham todos os dias para impulsionar o ecossistema empresarial africano.</p>
          </div>
        </div>

        <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>A carregar equipa...</p>
            </div>
          ) : team.length === 0 ? (
            <div className={styles.empty}>
              <span style={{ fontSize: '3rem' }}>&#x1F465;</span>
              <p>Nenhum membro da equipa registado ainda.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {team.map((member, idx) => {
                const { color, bg } = getRoleMeta(member.role);
                const isExpanded = expandedBio === idx;
                return (
                  <div key={member._id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                      {member.image ? (
                        <img src={member.image} alt={member.name} className={styles.image} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                          </svg>
                        </div>
                      )}
                      <div className={styles.imageGradient} />
                    </div>

                    <div className={styles.cardContent}>
                      <span className={styles.roleBadge} style={{ color, background: bg }}>
                        {member.role}
                      </span>
                      <div className={styles.nameRow}>
                        <h3 className={styles.name}>{member.name}</h3>
                      </div>
                      {member.department && (
                        <p className={styles.department}>{member.department}</p>
                      )}

                      {member.bio && (
                        <div className={styles.bioSection}>
                          <p className={isExpanded ? styles.bioFull : styles.bioTruncated}>
                            {member.bio}
                          </p>
                          {member.bio.length > 120 && (
                            <button
                              className={styles.bioToggle}
                              onClick={() => setExpandedBio(isExpanded ? null : idx)}
                            >
                              {isExpanded ? 'Ver menos' : 'Ler mais'}
                            </button>
                          )}
                        </div>
                      )}

                      {member.expertise && member.expertise.length > 0 && (
                        <div className={styles.expertiseSection}>
                          <h4>Expertise</h4>
                          <div className={styles.tags}>
                            {member.expertise.slice(0, 4).map((exp, i) => (
                              <span key={i} className={styles.tag}>{exp}</span>
                            ))}
                            {member.expertise.length > 4 && (
                              <span className={styles.tag}>+{member.expertise.length - 4}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                          className={styles.linkedinBtn} title={`LinkedIn de ${member.name}`}>
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
