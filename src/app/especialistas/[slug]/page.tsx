'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import styles from './EspecialistaDetalhe.module.css';

interface Specialist {
  _id: string;
  name: string;
  role: string;
  department?: string;
  country?: string;
  bio?: string;
  expertise: string[];
  image?: string;
  linkedin?: string;
  email?: string;
  website?: string;
  phone?: string;
  category?: string;
  views?: number;
}

export function slugify(text: string): string {
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

function derivedCategory(m: Specialist): string {
  const dept = (m.department || '').toLowerCase();
  const role = (m.role || '').toLowerCase();
  const exp = (m.expertise || []).join(' ').toLowerCase();
  if (dept.includes('tec') || dept.includes('inovação') || role.includes('ia') || role.includes('meal') || exp.includes('power bi'))
    return 'Tecnologia';
  if (dept.includes('invest') || dept.includes('finan') || exp.includes('capital'))
    return 'Finanças';
  if (exp.includes('género') || exp.includes('inclusão') || exp.includes('empoderamento'))
    return 'Inclusão & Impacto';
  return 'Desenvolvimento';
}

const FALLBACK_SPECIALISTS: Specialist[] = [
  {
    _id: 'fs1', name: 'Leonel Sapite',
    role: 'Especialista em Desenvolvimento Comunitário & Empreendedorismo',
    department: 'Incubação & Fortalecimento Institucional',
    expertise: ['Empreendedorismo', 'Direitos Humanos', 'Gestão de Projetos', 'Capacitação'],
    category: 'Desenvolvimento', image: '/Perfil04.jpg', country: 'Moçambique',
    bio: 'Leonel Sapite possui vasta experiência em desenvolvimento comunitário, gestão de programas de incubação e capacitação de empreendedores em Moçambique e na região. Tem liderado iniciativas de fortalecimento institucional e empoderamento de startups em fase inicial.'
  },
  {
    _id: 'fs2', name: 'Afonso Domingos',
    role: 'Especialista em Inteligência Artificial & Soluções Digitais',
    department: 'Tecnologia & Inovação',
    expertise: ['Inteligência Artificial', 'Automação (RPA)', 'Branding', 'Startups'],
    category: 'Tecnologia', image: '/perfil09.jpg', country: 'Moçambique',
    bio: 'Afonso Domingos é especialista em engenharia de sistemas, inteligência artificial aplicável a negócios e estratégias digitais. Apoia startups no desenvolvimento de arquitecturas tecnológicas escaláveis e automações inteligentes.'
  },
  {
    _id: 'fs3', name: 'Josina Aurora Nhantumbo',
    role: 'Especialista em Igualdade de Género & Inclusão Social',
    department: 'Empoderamento Económico',
    expertise: ['Antropologia', 'Inclusão Social', 'Empoderamento Feminino', 'Consultoria'],
    category: 'Inclusão & Impacto', image: '/Perfil02.jpg', country: 'Moçambique',
    bio: 'Josina Aurora Nhantumbo é consultora internacional em género, inclusão e desenvolvimento socioeconómico. Desenvolve programas voltados ao empoderamento de mulheres empreendedoras e inclusão em cadeias de valor.'
  },
  {
    _id: 'fs4', name: 'Gabriel Armindo',
    role: 'Especialista em MEAL & Análise de Dados',
    department: 'Monitoria, Avaliação e Aprendizagem',
    expertise: ['Power BI', 'Indicadores de Desempenho', 'Psicologia Comunitária', 'M&E'],
    category: 'Tecnologia', image: '', country: 'Moçambique',
    bio: 'Gabriel Armindo é especialista em concepção de sistemas MEAL, tratamento de dados de impacto e relatórios de monitoria executiva para projectos e empresas.'
  },
  {
    _id: 'fs5', name: 'Dr. Amadou Diallo',
    role: 'Especialista em Finanças & Captação de Capital',
    department: 'Investimentos & Finanças',
    expertise: ['Modelagem Financeira', 'Capital de Risco', 'Pitch Deck', 'Valuation'],
    category: 'Finanças', image: '', country: 'Senegal',
    bio: 'Dr. Amadou Diallo atua na estruturação financeira de empresas, preparação para investimento anjo, capital de risco e captação de recursos para expansão em África.'
  },
  {
    _id: 'fs6', name: 'Nádya Cristina Cosmo',
    role: 'Especialista em Mobilização de Investimentos & Parcerias',
    department: 'Parcerias Estratégicas',
    expertise: ['Mobilização de Capital', 'Parcerias Internacionais', 'Negociação'],
    category: 'Finanças', image: '', country: 'Moçambique',
    bio: 'Nádya Cristina Cosmo especializou-se no desenvolvimento de alianças estratégicas e mobilização de capital institucional para ecossistemas de negócios e PMEs.'
  }
];

export default function EspecialistaDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams?.slug || '';

  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [coverUrl, setCoverUrl] = useState('/abn-cover.jpg');

  useEffect(() => {
    if (!rawSlug) return;

    fetch('/api/team')
      .then(r => r.json())
      .then(data => {
        let found: Specialist | null = null;
        if (data.team && data.team.length > 0) {
          found = data.team.find((m: any) =>
            slugify(m.name) === rawSlug || m._id === rawSlug || slugify(m.name).includes(rawSlug)
          ) || null;
        }

        if (!found) {
          found = FALLBACK_SPECIALISTS.find(s =>
            slugify(s.name) === rawSlug || s._id === rawSlug || slugify(s.name).includes(rawSlug)
          ) || null;
        }

        if (found) {
          if (!found.category) found.category = derivedCategory(found);
          setSpecialist(found);

          // Track view visit
          fetch('/api/team/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: found._id, name: found.name, slug: rawSlug })
          })
            .then(r => r.json())
            .then(vData => {
              if (vData.views) {
                setSpecialist(prev => prev ? { ...prev, views: vData.views } : null);
              }
            })
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => {
        const found = FALLBACK_SPECIALISTS.find(s =>
          slugify(s.name) === rawSlug || s._id === rawSlug || slugify(s.name).includes(rawSlug)
        ) || null;
        if (found) {
          if (!found.category) found.category = derivedCategory(found);
          setSpecialist(found);
        }
        setLoading(false);
      });

    fetch('/api/config')
      .then(r => r.json())
      .then(data => {
        if (data.configs?.page_banners?.especialistas) {
          setCoverUrl(data.configs.page_banners.especialistas);
        }
      })
      .catch(() => {});
  }, [rawSlug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', color: '#0f172a', fontWeight: 600 }}>
            A carregar perfil do especialista…
          </div>
        </main>
      </>
    );
  }

  if (!specialist) {
    return (
      <>
        <Navbar />
        <main className={styles.main} style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '500px', margin: 'auto', background: '#ffffff', padding: '3rem 2rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: 'Outfit', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Especialista Não Encontrado</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Não foi possível localizar o perfil solicitado. O especialista pode ter atualizado as informações.
            </p>
            <Link href="/especialistas" className={styles.ctaBtnPrimary} style={{ textDecoration: 'none' }}>
              ← Voltar à Lista de Especialistas
            </Link>
          </div>
        </main>
      </>
    );
  }

  const viewsCount = (specialist.views || 0) + 1;

  return (
    <>
      <Navbar />
      <main className={styles.main}>

        {/* Hero Section */}
        <div className={styles.hero} style={{ backgroundImage: `url('${coverUrl}')` }}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContainer}>
            <div className={styles.avatarWrapper}>
              {specialist.image ? (
                <img
                  src={specialist.image}
                  alt={specialist.name}
                  className={styles.avatarImg}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes('abn-logo.png')) {
                      target.src = '/abn-logo.png';
                      target.style.objectFit = 'contain';
                      target.style.padding = '12px';
                      target.style.background = '#0d1322';
                    }
                  }}
                />
              ) : (
                <div className={styles.placeholderAvatar}>
                  {getInitials(specialist.name)}
                </div>
              )}
            </div>

            <div className={styles.heroDetails}>
              <div className={styles.badges}>
                {specialist.category && <span className={styles.catBadge}>{specialist.category}</span>}
                <span className={styles.countryBadge}>{specialist.country || 'Moçambique'}</span>
                <span className={styles.viewsBadge}>{viewsCount} {viewsCount === 1 ? 'Visualização' : 'Visualizações'}</span>
              </div>
              <h1 className={styles.name}>{specialist.name}</h1>
              <p className={styles.role}>{specialist.role}</p>
              {specialist.department && <p className={styles.department}>{specialist.department}</p>}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className={styles.contentContainer}>
          <div className={styles.leftColumn}>
            <Link href="/especialistas" className={styles.backLink}>
              ← Voltar a Todos os Especialistas
            </Link>

            {/* Bio Card */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Biografia & Perfil Profissional</h2>
              <p className={styles.bioText}>
                {specialist.bio || `${specialist.name} é especialista na área de ${specialist.department || specialist.role}, prestando mentoria e consultoria aos membros do ecossistema ABN.`}
              </p>
            </div>

            {/* Expertise Tags */}
            {specialist.expertise && specialist.expertise.length > 0 && (
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Áreas de Actuação & Competências</h2>
                <div className={styles.tags}>
                  {specialist.expertise.map((item, idx) => (
                    <span key={idx} className={styles.tag}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.rightColumn}>
            {/* Action Card */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Mentoria & Contacto</h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.2rem', lineHeight: '1.5' }}>
                Solicite uma sessão de mentoria ou consultoria diretamente com {specialist.name.split(' ')[0]}.
              </p>

              <Link
                href={`/contacto?assunto=Solicitar+Mentoria+com+${encodeURIComponent(specialist.name)}`}
                className={styles.ctaBtnPrimary}
              >
                Agendar Mentoria
              </Link>

              <button className={styles.shareBtn} onClick={handleCopyLink}>
                Copiar Link deste Perfil
              </button>

              {copied && (
                <div className={styles.copiedToast}>
                  ✓ Link copiado para a área de transferência!
                </div>
              )}
            </div>

            {/* Social / Contact Links Card */}
            {(specialist.linkedin || specialist.website || specialist.email || specialist.phone) && (
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Ligações Diretas</h2>
                <div className={styles.socialList}>
                  {specialist.linkedin && (
                    <a href={specialist.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                      LinkedIn
                    </a>
                  )}
                  {specialist.website && (
                    <a href={specialist.website} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                      Portfólio / Website
                    </a>
                  )}
                  {specialist.email && (
                    <a href={`mailto:${specialist.email}`} className={styles.socialBtn}>
                      E-mail Direto
                    </a>
                  )}
                  {specialist.phone && (
                    <a href={`https://wa.me/${specialist.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                      WhatsApp Directo
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
