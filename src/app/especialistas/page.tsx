'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import styles from './Especialistas.module.css';

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

const FALLBACK: Specialist[] = [
    {
        _id: 'fs1', name: 'Leonel Sapite',
        role: 'Especialista em Desenvolvimento Comunitário & Empreendedorismo',
        department: 'Incubação & Fortalecimento Institucional',
        expertise: ['Empreendedorismo', 'Direitos Humanos', 'Gestão de Projetos', 'Capacitação'],
        category: 'Desenvolvimento', image: '/Perfil04.jpg', country: 'Moçambique'
    },
    {
        _id: 'fs2', name: 'Afonso Domingos',
        role: 'Especialista em Inteligência Artificial & Soluções Digitais',
        department: 'Tecnologia & Inovação',
        expertise: ['Inteligência Artificial', 'Automação (RPA)', 'Branding', 'Startups'],
        category: 'Tecnologia', image: '/perfil09.jpg', country: 'Moçambique'
    },
    {
        _id: 'fs3', name: 'Josina Aurora Nhantumbo',
        role: 'Especialista em Igualdade de Género & Inclusão Social',
        department: 'Empoderamento Económico',
        expertise: ['Antropologia', 'Inclusão Social', 'Empoderamento Feminino', 'Consultoria'],
        category: 'Inclusão & Impacto', image: '/Perfil02.jpg', country: 'Moçambique'
    },
    {
        _id: 'fs4', name: 'Gabriel Armindo',
        role: 'Especialista em MEAL & Análise de Dados',
        department: 'Monitoria, Avaliação e Aprendizagem',
        expertise: ['Power BI', 'Indicadores de Desempenho', 'Psicologia Comunitária', 'M&E'],
        category: 'Tecnologia', image: '', country: 'Moçambique'
    },
    {
        _id: 'fs5', name: 'Dr. Amadou Diallo',
        role: 'Especialista em Finanças & Captação de Capital',
        department: 'Investimentos & Finanças',
        expertise: ['Modelagem Financeira', 'Capital de Risco', 'Pitch Deck', 'Valuation'],
        category: 'Finanças', image: '', country: 'Senegal'
    },
    {
        _id: 'fs6', name: 'Nádya Cristina Cosmo',
        role: 'Especialista em Mobilização de Investimentos & Parcerias',
        department: 'Parcerias Estratégicas',
        expertise: ['Mobilização de Capital', 'Parcerias Internacionais', 'Negociação'],
        category: 'Finanças', image: '', country: 'Moçambique'
    }
];

const ALL_CATEGORIES = ['Todos', 'Tecnologia', 'Finanças', 'Inclusão & Impacto', 'Desenvolvimento'];

export default function EspecialistasPage() {
    const [specialists, setSpecialists] = useState<Specialist[]>(FALLBACK);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [expandedBio, setExpandedBio] = useState<string | null>(null);
    const [bannerUrl, setBannerUrl] = useState('/abn-cover.jpg');

    useEffect(() => {
        const ABN_EQUIPA_NAMES = [
            'culpa', 'leonel', 'josina', 'lizi', 'palmira',
            'contardo', 'gabriel armindo', 'yolanda', 'nádya', 'nadya'
        ];

        fetch('/api/team')
            .then(r => r.json())
            .then(data => {
                if (data.team && data.team.length > 0) {
                    const list: Specialist[] = data.team
                        .filter((m: any) => {
                            if (m.status === 'inativo') return false;
                            const t = (m.type || '').toLowerCase();
                            if (t === 'equipa') return false;
                            const nameLower = (m.name || '').toLowerCase();
                            if (ABN_EQUIPA_NAMES.some(n => nameLower.includes(n))) return false;
                            return true;
                        })
                        .map((m: any) => {
                            const s: Specialist = {
                                _id: m._id, name: m.name, role: m.role,
                                department: m.department, country: m.country || 'Moçambique',
                                bio: m.bio, expertise: m.expertise || [],
                                image: m.image, linkedin: m.linkedin,
                                email: m.email, website: m.website, phone: m.phone,
                            };
                            s.category = derivedCategory(s);
                            return s;
                        });
                    if (list.length > 0) setSpecialists(list);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));

        fetch('/api/config')
            .then(r => r.json())
            .then(data => {
                if (data.configs?.page_banners?.especialistas)
                    setBannerUrl(data.configs.page_banners.especialistas);
                else if (data.configs?.page_banners?.equipa)
                    setBannerUrl(data.configs.page_banners.equipa);
            })
            .catch(() => { });
    }, []);

    const availableCategories = useMemo(() => {
        const cats = new Set(specialists.map(s => s.category).filter(Boolean));
        const ordered = ALL_CATEGORIES.filter(c => c === 'Todos' || cats.has(c));
        return ordered;
    }, [specialists]);

    const filtered = useMemo(() =>
        activeCategory === 'Todos'
            ? specialists
            : specialists.filter(s => s.category === activeCategory),
        [specialists, activeCategory]
    );

    return (
        <>
            <Navbar />
            <main className={styles.main}>

                {/* ── HERO ── */}
                <div className={styles.hero} style={{ backgroundImage: `url('${bannerUrl}')` }}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>Rede de Especialistas & Mentores</span>
                        <h1>Aconselhamento de <span className={styles.heroAccent}>Alto Nível</span></h1>
                        <p>Conecte-se com especialistas e mentores de topo em tecnologia, finanças, desenvolvimento e estratégia para acelerar o crescimento do seu negócio.</p>
                        <Link href="/contacto?assunto=Solicitar+Mentoria" className={styles.heroCta}>
                            Solicitar Mentoria →
                        </Link>
                    </div>
                </div>

                {/* ── WAVE ── */}
                <svg className={styles.wave} viewBox="0 0 1440 48" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,32 C360,60 1080,0 1440,32 L1440,48 L0,48 Z" fill="#ffffff" />
                </svg>

                {/* ── CONTENT ── */}
                <div className={styles.container}>

                    {/* Intro */}
                    <div className={styles.sectionIntro}>
                        <div className={styles.sectionLabel}>Especialistas ABN</div>
                        <h2>Mentores que transformam negócios</h2>
                        <p>Uma rede multidisciplinar de especialistas africanos e internacionais prontos para apoiar o crescimento das startups e PMEs do ecossistema ABN.</p>
                    </div>

                    {/* Stats */}
                    {!loading && (
                        <div className={styles.statsBar}>
                            <div className={styles.statItem}>
                                <div className={styles.statNum}>{specialists.length}</div>
                                <div className={styles.statLabel}>Especialistas</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNum}>{new Set(specialists.map(s => s.country)).size}</div>
                                <div className={styles.statLabel}>Países</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNum}>{specialists.reduce((n, s) => n + (s.expertise?.length ?? 0), 0)}</div>
                                <div className={styles.statLabel}>Competências</div>
                            </div>
                        </div>
                    )}

                    {/* Category filter */}
                    {!loading && availableCategories.length > 2 && (
                        <div className={styles.filterBar}>
                            {availableCategories.map(c => (
                                <button
                                    key={c}
                                    className={`${styles.filterBtn} ${activeCategory === c ? styles.filterBtnActive : ''}`}
                                    onClick={() => { setActiveCategory(c); setExpandedBio(null); }}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Cards */}
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>A carregar especialistas…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Nenhum especialista encontrado nesta categoria.</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {filtered.map((s, idx) => {
                                const isExpanded = expandedBio === s._id;
                                return (
                                    <div key={s._id} className={styles.card} style={{ animationDelay: `${idx * 55}ms` }}>
                                        {/* Avatar */}
                                        <Link href={`/especialistas/${slugify(s.name)}`} className={styles.imageWrapper} title={`Ver Perfil de ${s.name}`}>
                                            {s.image ? (
                                                <img
                                                    src={s.image}
                                                    alt={s.name}
                                                    className={styles.image}
                                                    onError={(e) => {
                                                        const target = e.currentTarget as HTMLImageElement;
                                                        if (!target.src.includes('abn-logo.png')) {
                                                            target.src = '/abn-logo.png';
                                                            target.style.objectFit = 'contain';
                                                            target.style.padding = '24px';
                                                            target.style.background = '#0d1322';
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className={styles.placeholderImage}>
                                                    <div className={styles.placeholderInitials}>{getInitials(s.name)}</div>
                                                </div>
                                            )}
                                            <div className={styles.imageGradient} />
                                        </Link>

                                        {/* Content */}
                                        <div className={styles.cardContent}>
                                            <div className={styles.badges}>
                                                {s.category && <span className={styles.catBadge}>{s.category}</span>}
                                                <span className={styles.countryBadge}>{s.country || 'Moçambique'}</span>
                                                <span className={styles.countryBadge} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1' }}>
                                                    {s.views || 0} views
                                                </span>
                                            </div>

                                            <h3 className={styles.name}>
                                                <Link href={`/especialistas/${slugify(s.name)}`} style={{ color: 'inherit', textDecoration: 'none' }} title={`Ver Perfil de ${s.name}`}>
                                                    {s.name}
                                                </Link>
                                            </h3>
                                            <p className={styles.role}>{s.role}</p>
                                            {s.department && <p className={styles.department}>{s.department}</p>}

                                            <div className={styles.divider} />

                                            {s.bio && (
                                                <div className={styles.bioSection}>
                                                    <p className={isExpanded ? styles.bioFull : styles.bioTruncated}>{s.bio}</p>
                                                    {s.bio.length > 110 && (
                                                        <button className={styles.bioToggle} onClick={() => setExpandedBio(isExpanded ? null : s._id)}>
                                                            {isExpanded ? '↑ Ver menos' : '↓ Ler mais'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {s.expertise && s.expertise.length > 0 && (
                                                <div className={styles.expertiseSection}>
                                                    <div className={styles.expertiseLabel}>Áreas de Actuação</div>
                                                    <div className={styles.tags}>
                                                        {s.expertise.slice(0, 4).map((e, i) => (
                                                             <span key={i} className={styles.tag}>{e}</span>
                                                        ))}
                                                        {s.expertise.length > 4 && (
                                                            <span className={styles.tagMore}>+{s.expertise.length - 4}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Social links */}
                                            {(s.linkedin || s.website || s.email || s.phone) && (
                                                <div className={styles.socialRow}>
                                                    {s.linkedin && (
                                                        <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} style={{ color: '#0a66c2' }} title="LinkedIn">LinkedIn</a>
                                                    )}
                                                    {s.website && (
                                                        <a href={s.website} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} style={{ color: '#ff6b00' }} title="Portfólio">Portfólio</a>
                                                    )}
                                                    {s.email && (
                                                        <a href={`mailto:${s.email}`} className={styles.socialBtn} style={{ color: '#10b981' }} title="E-mail">E-mail</a>
                                                    )}
                                                    {s.phone && (
                                                        <a href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} style={{ color: '#25d366' }} title="WhatsApp">WhatsApp</a>
                                                    )}
                                                </div>
                                            )}

                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                                                <Link
                                                    href={`/especialistas/${slugify(s.name)}`}
                                                    style={{ flex: 1, minWidth: '130px', textAlign: 'center', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '0.65rem 0.8rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.2s' }}
                                                >
                                                    Ver Perfil
                                                </Link>
                                                <Link
                                                    href={`/contacto?assunto=Solicitar+Mentoria+com+${encodeURIComponent(s.name)}`}
                                                    className={styles.mentorBtn}
                                                    style={{ flex: 1, minWidth: '130px', marginTop: 0 }}
                                                >
                                                    Mentoria →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── JOIN CTA ── */}
                <section className={styles.joinSection}>
                    <div className={styles.joinBox}>
                        <div className={styles.joinBadge}>PARCEIROS & CONSULTORES</div>
                        <h2>É um especialista numa área estratégica?</h2>
                        <p>Junte-se à Rede Oficial de Especialistas da ABN para oferecer mentoria, consultoria e soluções a startups e PMEs em África.</p>
                        <Link href="/parceiros" className={styles.joinBtn}>
                            Inscrever-me como Especialista →
                        </Link>
                    </div>
                </section>

            </main>
            <FloatingWhatsApp />
            <ScrollToTop />
        </>
    );
}
