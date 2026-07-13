'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import styles from './Equipa.module.css';

interface TeamMember {
  name: string;
  role: string;
  country: string;
  linkedin: string;
  image: string;
  bio: string;
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

const DEFAULT_TEAM: TeamMember[] = [
  {
    name: 'Culpa Francisco Xavier',
    role: 'Fundador e Vice-Director',
    country: 'Mocambique',
    linkedin: '',
    image: '/Perfil01.jpg',
    bio: 'Culpa Francisco Xavier é um jovem líder, consultor e especialista em Educação, Tecnologia, Ciência e Inovação, ex-Comissário da União da Juventude Africana. NO MOMENTO VICE DIRECTOR DA Comissão da Juventude da uniao Áfricana para África Austral. É fundador da CCA – Consulting and Coaching Agency, da ODEI – Organização para o Desenvolvimento e Educação Infantil e da Afrobiz Network (ABN), plataforma de conexão e fortalecimento de negócios africanos, atualmente presente in 13 países.\n\nCom mais de 18 anos de experiência em projetos ligados à primeira infância, juventude, liderança e transformação social, já foi reconhecido como Jovem da Mudança pela Save the Children e Estudante referencia pela Universidade Eduardo Mondlane além de ter a formação de Formador pela UNICEF.'
  },
  {
    name: 'Afonso Domingos',
    role: 'Co-Fundador e CTO / Developer',
    country: 'Mocambique',
    linkedin: '',
    image: '/Perfil05.jpg',
    bio: 'Afonso Domingos é um profissional moçambicano de TI e autodidata em inovação com mais de 6 anos de experiência. Formado em Multimédia, lidera a RPA Moçambique e é especialista em IA e soluções digitais escaláveis.\n\nAo longo de sua jornada, Afonso tem se destacado na criação de ecossistemas tecnológicos que resolvem problemas reais. Como fundador do Inscreva-se, ele trouxe uma visão de simplificação e eficiência para o mercado africano de eventos, integrando inteligência artificial e processos automatizados para maximizar resultados.\n\nSuas especialidades incluem desenvolvimento de software, automação de processos (RPA), estratégia de produto e liderança de equipes técnicas. Ele acredita que a tecnologia deve ser um facilitador do progresso humano e trabalha incansavelmente para democratizar o acesso a soluções de ponta.'
  }
];

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBio, setExpandedBio] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.team_content && data.configs.team_content.length > 0) {
          setTeam(data.configs.team_content);
        } else {
          setTeam(DEFAULT_TEAM);
        }
        setLoading(false);
      })
      .catch(() => {
        setTeam(DEFAULT_TEAM);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
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
                const flag = FLAGS[member.country] || '';
                const isExpanded = expandedBio === idx;
                return (
                  <div key={idx} className={styles.card}>
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
                        {flag && <span className={styles.flag}>{flag}</span>}
                        <h3 className={styles.name}>{member.name}</h3>
                      </div>

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
