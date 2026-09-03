'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HomeSpecialists.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';

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
  linkedin?: string;
  email?: string;
  website?: string;
  phone?: string;
  views?: number;
}

const FALLBACK_SPECIALISTS: Specialist[] = [
  {
    _id: 's1',
    name: 'Leonel Sapite',
    role: 'Especialista em Desenvolvimento Comunitário & Empreendedorismo',
    department: 'Incubação & Fortalecimento Institucional',
    expertise: ['Empreendedorismo', 'Direitos Humanos', 'Gestão de Projetos', 'Capacitação'],
    category: 'Desenvolvimento',
    image: '/Perfil04.jpg'
  },
  {
    _id: 's2',
    name: 'Afonso Domingos',
    role: 'Especialista em Inteligência Artificial & Soluções Digitais',
    department: 'Tecnologia & Inovação',
    expertise: ['Inteligência Artificial', 'Automação (RPA)', 'Branding', 'Startups'],
    category: 'Tecnologia',
    image: '/perfil09.jpg'
  },
  {
    _id: 's3',
    name: 'Josina Aurora Nhantumbo',
    role: 'Especialista em Igualdade de Género & Inclusão Social',
    department: 'Empoderamento Económico',
    expertise: ['Antropologia', 'Inclusão Social', 'Empoderamento Feminino', 'Consultoria'],
    category: 'Inclusão & Impacto',
    image: '/Perfil02.jpg'
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

const CATEGORIES = ['Todos', 'Tecnologia', 'Finanças', 'Inclusão & Impacto', 'Desenvolvimento'];

function slugify(text: string): string {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
            .filter((m: any) => {
              if (m.status === 'inativo') return false;
              if (m.type === 'Equipa' || m.type === 'equipa') return false;
              return true;
            })
            .map((m: any) => ({
              _id: m._id,
              name: m.name,
              role: m.role,
              department: m.department,
              country: m.country || 'Moçambique',
              expertise: m.expertise || [],
              image: m.image,
              bio: m.bio,
              linkedin: m.linkedin,
              email: m.email,
              website: m.website,
              phone: m.phone,
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
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
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
          {filtered.map(item => {
            const profileSlug = slugify(item.name);
            return (
              <div key={item._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <Link href={`/especialistas/${profileSlug}`} className={styles.avatarWrapper} title={`Ver Perfil de ${item.name}`}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.avatarImg}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (!target.src.includes('abn-logo.png')) {
                            target.src = '/abn-logo.png';
                            target.style.objectFit = 'contain';
                            target.style.padding = '8px';
                            target.style.background = '#fff7ed';
                          }
                        }}
                      />
                    ) : (
                      <div className={styles.avatarInitials}>
                        {getInitials(item.name)}
                      </div>
                    )}
                  </Link>
                  <div className={styles.headerInfo}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                      <span className={styles.categoryBadge}>{item.category}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {item.country || 'Moçambique'}
                      </span>
                    </div>
                    <h3 className={styles.name}>
                      <Link href={`/especialistas/${profileSlug}`} style={{ color: 'inherit', textDecoration: 'none' }} title={`Ver Perfil de ${item.name}`}>
                        {item.name}
                      </Link>
                    </h3>
                    <p className={styles.role}>{item.role}</p>
                  </div>
                </div>

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
                  {(item.linkedin || item.website || item.email || item.phone) && (
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                      {item.linkedin && (
                        <a
                          href={item.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          title="LinkedIn"
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '5px 9px', borderRadius: '8px', fontSize: '0.78rem', textDecoration: 'none', color: '#0a66c2', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        >
                          LinkedIn
                        </a>
                      )}
                      {item.website && (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noreferrer"
                          title="Website / Portfólio"
                          style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '5px 9px', borderRadius: '8px', fontSize: '0.78rem', textDecoration: 'none', color: '#c2410c', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        >
                          Portfólio
                        </a>
                      )}
                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                          title="Email"
                          style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '5px 9px', borderRadius: '8px', fontSize: '0.78rem', textDecoration: 'none', color: '#047857', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        >
                          E-mail
                        </a>
                      )}
                      {item.phone && (
                        <a
                          href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp"
                          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '5px 9px', borderRadius: '8px', fontSize: '0.78rem', textDecoration: 'none', color: '#15803d', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  )}

                  <div className={styles.actionRow}>
                    <Link href={`/especialistas/${profileSlug}`} className={styles.profileBtn}>
                      Ver Perfil
                    </Link>
                    <Link href={`/contacto?assunto=Mentoria+com+${encodeURIComponent(item.name)}`} className={styles.contactBtn}>
                      {language === 'pt' ? 'Mentoria →' : 'Mentorship →'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
      </motion.div>
    </section>
  );
}
