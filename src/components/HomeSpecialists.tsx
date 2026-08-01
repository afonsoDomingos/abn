'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HomeSpecialists.module.css';
import { useLanguage } from '@/lib/LanguageContext';

interface Specialist {
  _id: string;
  name: string;
  role: string;
  department?: string;
  country?: string;
  expertise: string[];
  image?: string;
  bio?: string;
  category?: string;
}

const FALLBACK_SPECIALISTS: Specialist[] = [
  {
    _id: 's1',
    name: 'Leonel Sapite',
    role: 'Especialista em Desenvolvimento Comunitário & Empreendedorismo',
    department: 'Incubação & Fortalecimento Institucional',
    expertise: ['Empreendedorismo', 'Direitos Humanos', 'Gestão de Projetos', 'Capacitação'],
    category: 'Desenvolvimento',
    image: ''
  },
  {
    _id: 's2',
    name: 'Afonso Domingos',
    role: 'Especialista em Inteligência Artificial & Soluções Digitais',
    department: 'Tecnologia & Inovação',
    expertise: ['Inteligência Artificial', 'Automação (RPA)', 'Branding', 'Startups'],
    category: 'Tecnologia',
    image: ''
  },
  {
    _id: 's3',
    name: 'Josina Aurora Nhantumbo',
    role: 'Especialista em Igualdade de Género & Inclusão Social',
    department: 'Empoderamento Económico',
    expertise: ['Antropologia', 'Inclusão Social', 'Empoderamento Feminino', 'Consultoria'],
    category: 'Inclusão & Impacto',
    image: ''
  },
  {
    _id: 's4',
    name: 'Gabriel Armindo',
    role: 'Especialista em MEAL & Análise de Dados',
    department: 'Monitoria, Avaliação e Aprendizagem',
    expertise: ['Power BI', 'Indicadores de Desempenho', 'Psicologia Comunitária', 'M&E'],
    category: 'Tecnologia',
    image: ''
  },
  {
    _id: 's5',
    name: 'Dr. Amadou Diallo',
    role: 'Especialista em Finanças & Captação de Capital',
    department: 'Investimentos & Finanças',
    expertise: ['Modelagem Financeira', 'Capital de Risco', 'Pitch Deck', 'Valuation'],
    category: 'Finanças',
    image: ''
  },
  {
    _id: 's6',
    name: 'Nádya Cristina Cosmo',
    role: 'Especialista em Mobilização de Investimentos & Parcerias',
    department: 'Parcerias Estratégicas',
    expertise: ['Mobilização de Capital', 'Parcerias Internacionais', 'Negociação'],
    category: 'Finanças',
    image: ''
  }
];

const CATEGORIES = ['Todos', 'Tecnologia', 'Desenvolvimento', 'Inclusão & Impacto', 'Finanças'];

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
}

export default function HomeSpecialists() {
  const { language } = useLanguage();
  const [specialists, setSpecialists] = useState<Specialist[]>(FALLBACK_SPECIALISTS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.team && data.team.length > 0) {
          const list: Specialist[] = data.team
            .filter((m: any) => m.status === 'ativo')
            .map((m: any) => ({
              _id: m._id,
              name: m.name,
              role: m.role,
              department: m.department,
              country: m.country || 'Moçambique',
              expertise: m.expertise || [],
              image: m.image,
              bio: m.bio,
              category: m.department?.toLowerCase().includes('tec') || m.role?.toLowerCase().includes('ia') || m.role?.toLowerCase().includes('meal')
                ? 'Tecnologia'
                : m.department?.toLowerCase().includes('invest') || m.department?.toLowerCase().includes('finan')
                ? 'Finanças'
                : m.expertise?.some((e: string) => e.toLowerCase().includes('género') || e.toLowerCase().includes('inclusão'))
                ? 'Inclusão & Impacto'
                : 'Desenvolvimento'
            }));
          if (list.length > 0) setSpecialists(list);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'Todos'
    ? specialists
    : specialists.filter(s => s.category === activeCategory);

  return (
    <section className={styles.section} id="especialistas">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.sectionLabel}>
              {language === 'pt' ? 'REDE DE ESPECIALISTAS & MENTORES' : 'EXPERT & MENTOR NETWORK'}
            </div>
            <h2>
              {language === 'pt' ? 'Aconselhamento e Mentoria de Alto Nível' : 'High-Level Advisory & Mentorship'}
            </h2>
            <p>
              {language === 'pt'
                ? 'Conecte-se com especialistas e mentores de topo em tecnologia, finanças, desenvolvimento e estratégia para acelerar o seu crescimento.'
                : 'Connect with top experts and mentors in tech, finance, development, and strategy to accelerate your growth.'}
            </p>
          </div>

          <Link href="/parceiros" className={styles.joinBtn}>
            {language === 'pt' ? 'Tornar-se Especialista Parceiro' : 'Become Partner Specialist'} →
          </Link>
        </div>

        {/* Filter Bar */}
        <div className={styles.filterBar}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.filterChip} ${activeCategory === cat ? styles.activeChip : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Specialists Grid */}
        <div className={styles.grid}>
          {filtered.map(item => (
            <div key={item._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.avatarWrapper}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className={styles.avatarImg} />
                  ) : (
                    <div className={styles.avatarInitials}>
                      {getInitials(item.name)}
                    </div>
                  )}
                </div>
                <div className={styles.headerInfo}>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <span className={styles.categoryBadge}>{item.category}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      📍 {item.country || 'Moçambique'}
                    </span>
                  </div>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.role}>{item.role}</p>
                </div>
              </div>

              {item.department && (
                <div className={styles.dept}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                  <span>{item.department}</span>
                </div>
              )}

              {item.expertise && item.expertise.length > 0 && (
                <div className={styles.expertiseWrapper}>
                  <div className={styles.expertiseLabel}>
                    {language === 'pt' ? 'Áreas de Atuação' : 'Core Expertise'}
                  </div>
                  <div className={styles.chips}>
                    {item.expertise.slice(0, 4).map((exp, i) => (
                      <span key={i} className={styles.chip}>{exp}</span>
                    ))}
                    {item.expertise.length > 4 && (
                      <span className={styles.moreChip}>+{item.expertise.length - 4}</span>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.cardActions}>
                <Link href={`/contacto?assunto=Mentoria+com+${encodeURIComponent(item.name)}`} className={styles.contactBtn}>
                  {language === 'pt' ? 'Solicitar Mentoria' : 'Request Mentorship'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerBadge}>
              {language === 'pt' ? 'PARCEIROS & CONSULTORES' : 'PARTNERS & CONSULTANTS'}
            </div>
            <h3>
              {language === 'pt'
                ? 'É um especialista numa área estratégica?'
                : 'Are you an expert in a strategic field?'}
            </h3>
            <p>
              {language === 'pt'
                ? 'Junte-se à Rede Oficial de Especialistas da ABN para oferecer mentoria, consultoria e soluções a startups e PMEs em África.'
                : 'Join the Official ABN Expert Network to offer mentorship, consulting, and solutions to startups and SMEs in Africa.'}
            </p>
          </div>
          <Link href="/parceiros" className={styles.bannerBtn}>
            {language === 'pt' ? 'Inscrever-me como Especialista' : 'Apply as Specialist'}
          </Link>
        </div>
      </div>
    </section>
  );
}
