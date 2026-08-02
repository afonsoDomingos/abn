'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import styles from './Equipa.module.css';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  country?: string;
  bio: string;
  expertise: string[];
  responsibilities: string[];
  image: string;
  linkedin: string;
  email: string;
  website?: string;
  phone?: string;
  order: number;
  status: string;
}

function getRoleMeta(role: string): { color: string; bg: string } {
  const r = role.toLowerCase();
  if (r.includes('ceo') || r.includes('director') || r.includes('directora') || r.includes('presidente') || r.includes('fundador') || r.includes('co-fundador'))
    return { color: '#c2410c', bg: 'rgba(194,65,12,0.08)' };
  if (r.includes('tech') || r.includes('desenvolv') || r.includes('developer') || r.includes('cto') || r.includes('inovação') || r.includes('tecnologia'))
    return { color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' };
  if (r.includes('rh') || r.includes('recursos') || r.includes('humanos') || r.includes('people') || r.includes('adjunto') || r.includes('adjunta'))
    return { color: '#15803d', bg: 'rgba(21,128,61,0.08)' };
  if (r.includes('market') || r.includes('comunic') || r.includes('design') || r.includes('assistente'))
    return { color: '#b45309', bg: 'rgba(180,83,9,0.08)' };
  if (r.includes('financ') || r.includes('cfo') || r.includes('contab') || r.includes('administra'))
    return { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' };
  if (r.includes('meal') || r.includes('monitoria') || r.includes('avalia'))
    return { color: '#0e7490', bg: 'rgba(14,116,144,0.08)' };
  if (r.includes('invest') || r.includes('parceria'))
    return { color: '#be185d', bg: 'rgba(190,24,93,0.08)' };
  return { color: '#ff6b00', bg: 'rgba(255,107,0,0.08)' };
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    _id: 'default-1',
    name: 'Leonel Sapite',
    role: 'Director de Programas',
    department: 'Direcção de Programas, Incubação e Sustentabilidade',
    bio: 'Leonel Sapite é especialista em desenvolvimento comunitário, empreendedorismo, direitos humanos e fortalecimento institucional. Possui vasta experiência na gestão de programas e projectos de desenvolvimento, tendo contribuído para a capacitação de mais de 10.000 empreendedores em Moçambique.',
    expertise: ['Desenvolvimento Comunitário', 'Empreendedorismo', 'Direitos Humanos', 'Fortalecimento Institucional'],
    responsibilities: ['Liderança estratégica dos programas', 'Incubação de empresas', 'Aceleração de negócios'],
    image: '',
    linkedin: '',
    email: '',
    order: 1,
    status: 'ativo'
  },
  {
    _id: 'default-2',
    name: 'Josina Aurora Nhantumbo',
    role: 'Directora Adjunta de Programas',
    department: 'Direcção de Programas, Incubação e Sustentabilidade',
    bio: 'Josina Aurora Nhantumbo é Antropóloga e especialista em Igualdade de Género, Inclusão Social e Empoderamento Económico de Mulheres e Jovens. Possui mais de 20 anos de experiência em organismos governamentais, Nações Unidas e consultoria.',
    expertise: ['Igualdade de Género', 'Inclusão Social', 'Empoderamento Económico', 'Antropologia'],
    responsibilities: ['Desenvolvimento e implementação dos programas', 'Abordagens de género e inclusão'],
    image: '',
    linkedin: '',
    email: '',
    order: 2,
    status: 'ativo'
  },
  {
    _id: 'default-3',
    name: 'Contardo Muarramuassa',
    role: 'Director Adjunto de Programas',
    department: 'Direcção de Programas, Incubação e Sustentabilidade',
    bio: 'Especialista em Desenvolvimento Comunitário, Desenvolvimento Humano, Planeamento Territorial, Governança Local e Salvaguardas Sociais e Ambientais. É fundador da BCC Moçambique, SU, Lda. e Mestre em Planeamento Territorial.',
    expertise: ['Desenvolvimento Comunitário', 'Planeamento Territorial', 'Governança Local', 'WASH'],
    responsibilities: ['Desenho e implementação de programas', 'Sustentabilidade e governação'],
    image: '',
    linkedin: '',
    email: '',
    order: 3,
    status: 'ativo'
  },
  {
    _id: 'default-4',
    name: 'Afonso Domingos',
    role: 'Director de Tecnologia e Inovação',
    department: 'Direcção de Tecnologia e Inovação',
    bio: 'Afonso Domingos é especialista em Inteligência Artificial, Branding e Startups, com experiência na intersecção entre tecnologia, inovação e transformação digital. Lidera a RPA Moçambique e actua como Consultor de Tecnologia.',
    expertise: ['Inteligência Artificial', 'Transformação Digital', 'Branding', 'Startups', 'Web Dev'],
    responsibilities: ['Liderar estratégia tecnológica', 'Transformação digital', 'Soluções para startups'],
    image: '',
    linkedin: '',
    email: '',
    order: 4,
    status: 'ativo'
  },
  {
    _id: 'default-5',
    name: 'Lizi Cristina Mulambo',
    role: 'Directora de Administração, Finanças e RH',
    department: 'Direcção de Administração, Finanças e Recursos Humanos',
    bio: 'Profissional sénior moçambicana com mais de 20 anos de experiência em gestão administrativa, financeira, recursos humanos e desenvolvimento organizacional. Licenciada em Administração e Gestão de Empresas e Executive Coach.',
    expertise: ['Gestão Financeira', 'Recursos Humanos', 'Liderança', 'Compliance', 'Procurement'],
    responsibilities: ['Gestão administrativa e financeira', 'Gestão de RH', 'Compliance'],
    image: '',
    linkedin: '',
    email: '',
    order: 5,
    status: 'ativo'
  },
  {
    _id: 'default-6',
    name: 'Yolanda',
    role: 'Assistente Administrativa',
    department: 'Direcção de Administração, Finanças e Recursos Humanos',
    bio: 'Integra a Direcção de Administração, Finanças e Recursos Humanos como Assistente Administrativa, sendo responsável pelo apoio administrativo à Presidência e às Direcções Corporativas, gestão documental e suporte às operações.',
    expertise: ['Apoio Administrativo', 'Gestão Documental', 'Organização de Agendas'],
    responsibilities: ['Apoio à Presidência e Direcções', 'Gestão documental', 'Apoio logístico'],
    image: '',
    linkedin: '',
    email: '',
    order: 6,
    status: 'ativo'
  },
  {
    _id: 'default-7',
    name: 'Nádya Cristina Domingos Cosmo',
    role: 'Directora de Investimentos e Parcerias',
    department: 'Direcção de Investimentos e Parcerias',
    bio: 'Profissional moçambicana com 29 anos de experiência, dedicada à gestão de recursos humanos, desenvolvimento organizacional, consultoria administrativa e parcerias estratégicas nacionais e internacionais.',
    expertise: ['Mobilização de Investimentos', 'Parcerias Estratégicas', 'Captação de Recursos'],
    responsibilities: ['Mobilização de investimentos', 'Parcerias nacionais e internacionais'],
    image: '',
    linkedin: '',
    email: '',
    order: 7,
    status: 'ativo'
  },
  {
    _id: 'default-8',
    name: 'Gabriel Armindo',
    role: 'Director de MEAL',
    department: 'Direcção de Monitoria, Avaliação e Aprendizagem (MEAL)',
    bio: 'Especialista em Monitoria, Avaliação, Aprendizagem e Prestação de Contas (MEAL), Psicólogo Social e Comunitário. Possui experiência na implementação de sistemas de M&E, indicadores e avaliação de impacto.',
    expertise: ['MEAL', 'Monitoria e Avaliação', 'Power BI', 'SPSS', 'Análise de Dados'],
    responsibilities: ['Sistema institucional de MEAL', 'Avaliação de impacto', 'Aprendizagem organizacional'],
    image: '',
    linkedin: '',
    email: '',
    order: 8,
    status: 'ativo'
  }
];

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [loading, setLoading] = useState(true);
  const [expandedBio, setExpandedBio] = useState<number | null>(null);
  const [bannerUrl, setBannerUrl] = useState('/abn-cover.jpg');
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.team && data.team.length > 0) {
          const activeMembers = data.team.filter((m: any) => {
            if (m.status === 'inativo') return false;
            if (m.type === 'Especialista' || m.type === 'especialista' || m.type === 'Mentor') {
              return false;
            }
            return true;
          });
          if (activeMembers.length > 0) setTeam(activeMembers);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.equipa) setBannerUrl(data.configs.page_banners.equipa);
      })
      .catch(() => {});
  }, []);

  /* dept filter */
  const departments = useMemo(() => {
    const depts = Array.from(new Set(team.map(m => m.department).filter(Boolean)));
    return ['Todos', ...depts];
  }, [team]);

  const filtered = useMemo(() =>
    activeFilter === 'Todos' ? team : team.filter(m => m.department === activeFilter),
    [team, activeFilter]
  );

  /* short dept label for filter button */
  const shortDept = (d: string) => {
    if (d === 'Todos') return 'Todos';
    // extract first meaningful word after "Direcção de "
    return d.replace(/Direcção de /i, '').split(',')[0].split('(')[0].trim();
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* ── HERO ── */}
        <div className={styles.hero} style={{ backgroundImage: `url('${bannerUrl}')` }}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>A Nossa Equipa</span>
            <h1>As pessoas por trás da ABN</h1>
            <p>Conheça os profissionais que trabalham todos os dias para impulsionar o ecossistema empresarial africano.</p>
          </div>
        </div>

        {/* ── WAVE transition ── */}
        <svg className={styles.wave} viewBox="0 0 1440 48" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32 C360,60 1080,0 1440,32 L1440,48 L0,48 Z" fill="#ffffff"/>
        </svg>

        {/* ── CONTENT ── */}
        <div className={styles.container}>

          {/* Section intro */}
          <div className={styles.sectionIntro}>
            <div className={styles.sectionLabel}>Equipa ABN</div>
            <h2>Conheça quem nos move</h2>
            <p>Uma equipa multidisciplinar unida pelo propósito de transformar o ecossistema empresarial em África.</p>
          </div>

          {/* Stats */}
          {!loading && (
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <div className={styles.statNum}>{team.length}</div>
                <div className={styles.statLabel}>Membros</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNum}>{Array.from(new Set(team.map(m => m.department).filter(Boolean))).length}</div>
                <div className={styles.statLabel}>Departamentos</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNum}>{team.reduce((s, m) => s + (m.expertise?.length ?? 0), 0)}</div>
                <div className={styles.statLabel}>Competências</div>
              </div>
            </div>
          )}

          {/* Dept filter */}
          {!loading && departments.length > 2 && (
            <div className={styles.filterBar}>
              {departments.map(d => (
                <button
                  key={d}
                  className={`${styles.filterBtn} ${activeFilter === d ? styles.filterBtnActive : ''}`}
                  onClick={() => { setActiveFilter(d); setExpandedBio(null); }}
                >
                  {shortDept(d)}
                </button>
              ))}
            </div>
          )}

          {/* Cards */}
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>A carregar equipa…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <span style={{ fontSize: '3rem' }}>&#x1F465;</span>
              <p>Nenhum membro encontrado.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((member, idx) => {
                const { color, bg } = getRoleMeta(member.role);
                const isExpanded = expandedBio === idx;
                return (
                  <div key={member._id} className={styles.card} style={{ animationDelay: `${idx * 60}ms` }}>
                    {/* Image */}
                    <div className={styles.imageWrapper}>
                      {member.image ? (
                        <img src={member.image} alt={member.name} className={styles.image} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <div className={styles.placeholderInitials}>
                            {getInitials(member.name)}
                          </div>
                        </div>
                      )}
                      <div className={styles.imageGradient} />
                    </div>

                    {/* Content */}
                    <div className={styles.cardContent}>
                      <span
                        className={styles.roleBadge}
                        style={{ color, background: bg, borderColor: `${color}33` }}
                      >
                        {member.role}
                      </span>

                      <div className={styles.nameRow}>
                        <h3 className={styles.name}>{member.name}</h3>
                      </div>

                      {member.department && (
                        <p className={styles.department}>{member.department}</p>
                      )}
                      <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📍 {member.country || 'Moçambique'}
                      </p>

                      <div className={styles.divider} />

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
                              {isExpanded ? '↑ Ver menos' : '↓ Ler mais'}
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

                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkedinBtn}
                            title={`LinkedIn de ${member.name}`}
                          >
                            🔗 LinkedIn
                          </a>
                        )}
                        {member.website && (
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkedinBtn}
                            style={{ background: 'rgba(255,107,0,0.1)', color: '#ff6b00', border: '1px solid rgba(255,107,0,0.3)' }}
                            title={`Website / Portfólio de ${member.name}`}
                          >
                            🌐 Portfólio
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className={styles.linkedinBtn}
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                            title={`E-mail de ${member.name}`}
                          >
                            ✉️ E-mail
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkedinBtn}
                            style={{ background: 'rgba(37,211,102,0.1)', color: '#25d366', border: '1px solid rgba(37,211,102,0.3)' }}
                            title={`WhatsApp de ${member.name}`}
                          >
                            📱 WhatsApp
                          </a>
                        )}
                      </div>
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
