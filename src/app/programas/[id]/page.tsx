'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import Link from 'next/link';
import styles from './ProgramaDetalhe.module.css';

interface Program {
    _id: string;
    title: string;
    description: string;
    publicoAlvo?: string;
    beneficios?: string;
    requisitos?: string;
    investimento?: string;
    price?: string;
    paymentInstructions?: string;
    processoSelecao?: string;
    criteriosSelecao?: string;
    phase?: string;
    duration?: string;
    image?: string;
    status: string;
    order: number;
    missao?: string;
    visao?: string;
    valores?: string;
    objectivos?: string;
    areasActuacao?: string;
    actividades?: string;
    beneficiosMembros?: string;
    compromissoMembros?: string;
    lema?: string;
    isClub?: boolean;
    province?: string;
    customFields?: any[];
}

// Fallback programs (same as in the list page)
const FALLBACK_PROGRAMS: Program[] = [
    {
        _id: 'f-startups180',
        title: 'ABN STARTUP 180',
        description: 'O ABN Startup 180 é o programa de incubação, desenvolvimento e aceleração de Negócios da Afrobiz Network (ABN).\n\nO programa foi concebido para apoiar empreendedores desde a fase da ideia até ao crescimento sustentável do negócio, através de formação, mentoria, networking, acompanhamento técnico e acesso a oportunidades.\n\nO ABN Startup 180 integra diferentes iniciativas que trabalham de forma articulada para fortalecer o ecossistema empreendedor.',
        publicoAlvo: '- Empreendedores com ideias de negócio;\n- Startups em fase inicial;\n- Pequenas e médias empresas;\n- Estudantes empreendedores;\n- Jovens e mulheres empreendedoras;\n- Negócios informais em processo de formalização.',
        beneficios: '• Diagnóstico empresarial completo;\n• Mentoria estratégica mensal com peritos;\n• Acesso a rede global de investidores;\n• Preparação de pitch e plano de negócios.',
        requisitos: '• Ter uma ideia de negócio ou projeto ativo;\n• Dedicação e disponibilidade para sessões de incubação.',
        investimento: 'Gratuito para projetos selecionados no processo de curadoria.',
        processoSelecao: 'Inscrição online -> Triagem -> Entrevista de Diagnóstico -> Admissão.',
        criteriosSelecao: 'Potencial de impacto, grau de inovação, viabilidade e compromisso.',
        phase: 'Incubação & Aceleração',
        duration: 'Contínuo',
        status: 'ativo',
        order: 0
    },
    {
        _id: 'f-mentalidade',
        title: 'MENTALIDADE EMPREENDEDORA',
        description: 'A Mentalidade Empreendedora é uma iniciativa do ABN Startup 180 dedicada ao desenvolvimento das competências pessoais e profissionais necessárias para criar, gerir e expandir um negócio.\n\nO programa aborda temas como liderança, inovação, gestão, vendas, marketing, finanças, negociação, inteligência emocional, comunicação e desenvolvimento pessoal.',
        publicoAlvo: '- Empreendedores em início de carreira;\n- Gestores e líderes de equipa;\n- Estudantes e jovens profissionais.',
        beneficios: '- Formação prática com certificados;\n- Networking com líderes de mercado;\n- Acesso exclusivo a conteúdos e templates da ABN.',
        requisitos: '- Ter idade igual ou superior a 16 anos;\n- Interesse em empreendedorismo;\n- Compromisso com a aprendizagem contínua.',
        investimento: '• Startups Incubadas: Gratuito ou incluído na mensalidade.\n\n1. Participantes Individuais:\n- Formação Intensiva (7 dias): 8.000 MT – 18.000 MT\n- Formação Completa (15 dias): 15.000 MT – 35.000 MT\n- Coaching Individual (60–90 min): 2.000 MT – 5.000 MT\n- Pacote de Coaching (6 sessões): 10.000 MT – 25.000 MT\n- Certificação: 8.000 MT – 20.000 MT',
        processoSelecao: 'Inscrição direta conforme abertura de turmas.',
        criteriosSelecao: 'Ordem de inscrição e perfil empreendedor.',
        phase: 'Desenvolvimento',
        duration: 'Por Edição',
        status: 'ativo',
        order: 1
    },
    {
        _id: 'f-voz',
        title: 'A VOZ DO EMPREENDEDOR',
        description: 'A Voz do Empreendedor é a plataforma oficial da ABN para dar visibilidade aos empreendedores, às suas histórias, produtos, serviços e impacto na sociedade.\n\nA iniciativa promove entrevistas, reportagens, podcasts, vídeos, artigos e conteúdos digitais.',
        publicoAlvo: '- Empreendedores e fundadores de startups;\n- PMEs com soluções inovadoras;\n- Líderes comunitários e sociais.',
        beneficios: '- Divulgação da marca e produtos na plataforma ABN;\n- Fortalecimento da autoridade no mercado;\n- Maior visibilidade junto de investidores e parceiros.',
        requisitos: '- Possuir um negócio ou projeto ativo;\n- Disponibilidade para entrevista ou gravação.',
        investimento: 'Participação básica: Gratuita (Produções dedicadas sob orçamento).',
        processoSelecao: 'Submissão de candidatura e seleção editorial.',
        criteriosSelecao: 'Impacto da história e relevância do negócio.',
        phase: 'Visibilidade & Mídia',
        duration: 'Sob Demanda',
        status: 'ativo',
        order: 2
    },
    {
        _id: 'f-rota',
        title: 'ROTA DE EMPREENDEDORES',
        description: 'A Rota de Empreendedores é uma iniciativa de aproximação da ABN aos empreendedores no terreno.\n\nAtravés de visitas técnicas institucionais, a equipa conhece os negócios localmente, identifica desafios, oportunidades e talentos para integrar o programa ABN Startup 180.',
        publicoAlvo: '- Negócios locais e PMEs nas províncias e distritos;\n- Cooperativas e associações de jovens empreendedores.',
        beneficios: '- Diagnóstico presencial no local do negócio;\n- Encaminhamento direto para programas de aceleração;\n- Conexão com a rede corporativa da ABN.',
        requisitos: '- Possuir espaço de operação ou atividade ativa;\n- Aceitar a visita da equipa técnica da ABN.',
        investimento: 'Visita institucional: Gratuita.',
        processoSelecao: 'Agendamento por itinerário e solicitação prévia.',
        criteriosSelecao: 'Localização geográfica e potencial de expansão.',
        phase: 'Diagnóstico',
        duration: 'Visitas Agendadas',
        status: 'ativo',
        order: 3
    },
    {
        _id: 'f-clube',
        title: 'CLUBE DOS EMPREENDEDORES ABN',
        description: 'O Clube dos Empreendedores é a comunidade oficial e rede estratégica de colaboração, networking e capacitação da AfroBiz Network (ABN).\n\nReúne empreendedores, inovadores, líderes e fundadores para a partilha de experiências, criação de parcerias, acesso a oportunidades de mercado e aceleração contínua de negócios em África e na Diáspora.',
        missao: 'Fomentar o ecossistema empresarial conectando empreendedores, capacitando líderes e gerando oportunidades reais de negócios, parcerias e investimento sustentável em África.',
        visao: 'Ser o maior e mais dinâmico clube de empreendedores de África, reconhecido como a principal plataforma de aceleração, cooperação empresarial e impacto socioeconómico.',
        valores: '• Colaboração & Parceria Estratégica\n• Inovação & Excelência Empresarial\n• Integridade & Ética\n• Inclusão & Empoderamento Económico\n• Impacto Social e Sustentabilidade',
        objectivos: '• Facilitar o networking de alto impacto e parcerias comerciais entre membros;\n• Promover formações executivas, workshops e mentorias especializadas;\n• Conectar startups e PMEs a investidores e novos mercados globais;\n• Dar visibilidade aos negócios dos membros na rede internacional da ABN;\n• Estimular a cultura empreendedora e o desenvolvimento económico sustentável.',
        publicoAlvo: '• Empreendedores, fundadores e co-fundadores de Startups e PMEs;\n• Jovens e mulheres empreendedoras com negócios inovadores;\n• Profissionais liberais, consultores e executivos corporativos;\n• Estudantes universitários com projetos de negócio;\n• Investidores anjo e mentores de negócios.',
        areasActuacao: '• Incubação & Aceleração de Startups;\n• Capacitação & Educação Executiva;\n• Networking & Matchmaking Comercial B2B;\n• Promoção & Visibilidade de Marcas;\n• Acesso a Financiamento & Smart Money.',
        actividades: '• Encontros mensais de networking e Pitching Sessions;\n• Masterclasses e workshops de aceleração com mentores internacionais;\n• Visitas técnicas e a Rota dos Empreendedores;\n• Rodadas de negócios (B2B Matchmaking);\n• Participação em Fóruns e Feiras Internacionais da ABN.',
        beneficiosMembros: '• Acesso a rede exclusiva de contactos e investidores;\n• Descontos e prioridade em programas, formações e eventos da ABN;\n• Presença e divulgação da empresa no Marketplace e Diretório ABN;\n• Oferta de Website + Portfólio Digital profissional com suporte;\n• Mentoria estratégica mensal e certificado de membro oficial.',
        compromissoMembros: '• Participar ativamente nos encontros, formações e eventos do Clube;\n• Cumprir o código de ética e valores fundamentais da ABN;\n• Promover a colaboração mútua e ajuda recíproca entre os membros;\n• Manter o perfil e dados do negócio atualizados na plataforma.',
        lema: '"Conectando mentes, impulsionando negócios e transformando África e o Mundo."',
        isClub: true,
        province: 'Nacional & Internacional',
        beneficios: '• Acesso a rede exclusiva de contactos e investidores;\n• Descontos e prioridade em programas, formações e eventos da ABN;\n• Presença e divulgação da empresa no Marketplace e Diretório ABN;\n• Oferta de Website + Portfólio Digital profissional com suporte;\n• Mentoria estratégica mensal e certificado de membro oficial.',
        requisitos: '• Ser fundador, sócio ou gestor de um projeto ou empresa;\n• Compromisso com o desenvolvimento empresarial e ético;\n• Preencher o formulário de adesão oficial.',
        investimento: 'Plano Membro Individual:\n• Inscrição: 500 MT\n• Quota mensal: 300 MT\n\nPlano Membro Corporativo:\n• Sob consulta com a Direcção da ABN.',
        processoSelecao: '1. Submissão do formulário de candidatura;\n2. Análise do perfil do negócio pela equipa ABN;\n3. Boas-vindas e integração no ecossistema de membros.',
        criteriosSelecao: '• Potencial de crescimento e impacto do negócio;\n• Alinhamento com os valores de colaboração da ABN;\n• Vontade ativa de networking e aprendizagem.',
        phase: 'Networking & Aceleração',
        duration: 'Membro Contínuo',
        status: 'ativo',
        order: 4
    }
];

const phaseIcons: Record<string, string> = {
    'Incubação & Aceleração': '🚀',
    'Desenvolvimento': '🧠',
    'Visibilidade & Mídia': '🎙️',
    'Diagnóstico': '🗺️',
    'Networking & Aceleração': '🏛️',
    'Incubação': '⚡',
};

export default function ProgramaDetalhePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showInscricao, setShowInscricao] = useState(false);

    useEffect(() => {
        if (!id) return;

        // Try fallback first
        const fallback = FALLBACK_PROGRAMS.find(p => p._id === id);
        if (fallback) {
            setProgram(fallback);
            setLoading(false);
            return;
        }

        // Fetch from API
        fetch(`/api/programs/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.program) {
                    setProgram(data.program);
                } else {
                    // Try fuzzy match in fallbacks
                    const fuzzy = FALLBACK_PROGRAMS.find(p =>
                        p._id.includes(id) || p.title.toLowerCase().includes(id.replace(/-/g, ' ').toLowerCase())
                    );
                    if (fuzzy) {
                        setProgram(fuzzy);
                    } else {
                        setNotFound(true);
                    }
                }
                setLoading(false);
            })
            .catch(() => {
                const fallbackByFuzzy = FALLBACK_PROGRAMS.find(p =>
                    p._id === id || p.title.toLowerCase().includes(id.replace(/-/g, ' ').toLowerCase())
                );
                if (fallbackByFuzzy) {
                    setProgram(fallbackByFuzzy);
                } else {
                    setNotFound(true);
                }
                setLoading(false);
            });
    }, [id]);

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleShareWhatsApp = () => {
        if (!program) return;
        const url = window.location.href;
        const text = `Olá! Confira este programa da ABN – AfroBiz Network:\n\n*${program.title}*\n${program.description.slice(0, 200)}...\n\n🔗 ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleShareLinkedIn = () => {
        if (!program) return;
        const url = window.location.href;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    };

    const handleShareFacebook = () => {
        if (!program) return;
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    const handleShareTwitter = () => {
        if (!program) return;
        const url = window.location.href;
        const text = `Confira o programa *${program.title}* da AfroBiz Network (ABN)! 🚀`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const handleShareEmail = () => {
        if (!program) return;
        const url = window.location.href;
        const subject = `Programa ABN: ${program.title}`;
        const body = `Olá!\n\nRecomendo este programa da AfroBiz Network (ABN):\n\n${program.title}\n\n${program.description.slice(0, 300)}...\n\nSaiba mais no link:\n${url}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className={styles.loadingPage}>
                    <div className={styles.spinner} />
                    <p>A carregar programa...</p>
                </main>
            </>
        );
    }

    if (notFound || !program) {
        return (
            <>
                <Navbar />
                <main className={styles.notFoundPage}>
                    <span style={{ fontSize: '4rem' }}>🔍</span>
                    <h1>Programa não encontrado</h1>
                    <p>O programa que procura não existe ou foi removido.</p>
                    <Link href="/programas" className={styles.backBtn}>← Ver todos os Programas</Link>
                </main>
            </>
        );
    }

    const phaseIcon = phaseIcons[program.phase || ''] || '📋';

    return (
        <>
            <Navbar />
            <main className={styles.main}>

                {/* ── HERO ── */}
                <header className={styles.hero}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <Link href="/programas" className={styles.breadcrumb}>
                            ← Todos os Programas
                        </Link>
                        <div className={styles.heroBadges}>
                            {program.phase && (
                                <span className={styles.phaseBadge}>{phaseIcon} {program.phase}</span>
                            )}
                            {program.duration && (
                                <span className={styles.durationBadge}>⏱️ {program.duration}</span>
                            )}
                            {program.isClub && (
                                <span className={styles.clubBadge}>⭐ Programa em Destaque</span>
                            )}
                        </div>
                        <h1 className={styles.heroTitle}>{program.title}</h1>
                        {program.lema && (
                            <p className={styles.heroLema}>"{program.lema}"</p>
                        )}
                        {program.province && (
                            <p className={styles.heroProvince}>📍 {program.province}</p>
                        )}

                        {/* Share & CTA Buttons */}
                        <div className={styles.heroActions}>
                            <button
                                id="btn-candidatar-programa"
                                className={styles.applyBtn}
                                onClick={() => setShowInscricao(true)}
                            >
                                ✍️ Candidatar-me
                            </button>
                            <button
                                id="btn-copiar-link"
                                className={styles.copyBtn}
                                onClick={handleCopyLink}
                                title="Copiar link para partilhar"
                            >
                                {copied ? '✅ Link Copiado!' : '🔗 Copiar Link'}
                            </button>
                            <button
                                id="btn-partilhar-whatsapp"
                                className={styles.waBtn}
                                onClick={handleShareWhatsApp}
                                title="Partilhar no WhatsApp"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </header>

                {/* ── BODY ── */}
                <div className={styles.body}>

                    {/* Description */}
                    <section className={styles.descSection}>
                        <div className={styles.container}>
                            <h2 className={styles.sectionTitle}>📄 Sobre o Programa</h2>
                            <p className={styles.description}>{program.description}</p>
                        </div>
                    </section>

                    {/* Club specific: Missao / Visao / Valores */}
                    {program.isClub && (program.missao || program.visao || program.valores) && (
                        <section className={styles.pillarsSection}>
                            <div className={styles.container}>
                                <div className={styles.pillarsGrid}>
                                    {program.missao && (
                                        <div className={styles.pillar}>
                                            <span className={styles.pillarIcon}>🎯</span>
                                            <h3>Missão</h3>
                                            <p>{program.missao}</p>
                                        </div>
                                    )}
                                    {program.visao && (
                                        <div className={styles.pillar}>
                                            <span className={styles.pillarIcon}>👁️</span>
                                            <h3>Visão</h3>
                                            <p>{program.visao}</p>
                                        </div>
                                    )}
                                    {program.valores && (
                                        <div className={styles.pillar}>
                                            <span className={styles.pillarIcon}>💎</span>
                                            <h3>Valores</h3>
                                            <p style={{ whiteSpace: 'pre-line' }}>{program.valores}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Details Grid */}
                    <section className={styles.detailsSection}>
                        <div className={styles.container}>
                            <h2 className={styles.sectionTitle}>📋 Detalhes do Programa</h2>
                            <div className={styles.detailsGrid}>
                                {program.publicoAlvo && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>👥</div>
                                        <h3>Público-Alvo</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.publicoAlvo}</p>
                                    </div>
                                )}
                                {(program.beneficiosMembros || program.beneficios) && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>🎁</div>
                                        <h3>{program.isClub ? 'Benefícios para Membros' : 'Benefícios'}</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.beneficiosMembros || program.beneficios}</p>
                                    </div>
                                )}
                                {program.requisitos && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>📌</div>
                                        <h3>Requisitos</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.requisitos}</p>
                                    </div>
                                )}
                                {program.investimento && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>💰</div>
                                        <h3>Investimento</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.investimento}</p>
                                    </div>
                                )}
                                {program.processoSelecao && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>🔍</div>
                                        <h3>Processo de Seleção</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.processoSelecao}</p>
                                    </div>
                                )}
                                {program.criteriosSelecao && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>⚖️</div>
                                        <h3>Critérios de Seleção</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.criteriosSelecao}</p>
                                    </div>
                                )}
                                {program.objectivos && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>📊</div>
                                        <h3>Objectivos</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.objectivos}</p>
                                    </div>
                                )}
                                {program.areasActuacao && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>🗺️</div>
                                        <h3>Áreas de Actuação</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.areasActuacao}</p>
                                    </div>
                                )}
                                {program.actividades && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>📅</div>
                                        <h3>Actividades</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.actividades}</p>
                                    </div>
                                )}
                                {program.compromissoMembros && (
                                    <div className={styles.detailCard}>
                                        <div className={styles.detailCardIcon}>🤝</div>
                                        <h3>Compromisso dos Membros</h3>
                                        <p style={{ whiteSpace: 'pre-line' }}>{program.compromissoMembros}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* CTA BOTTOM */}
                    <section className={styles.ctaSection}>
                        <div className={styles.container}>
                            <div className={styles.ctaBox}>
                                <h2>Pronto para fazer parte do {program.title}?</h2>
                                <p>Junte-se a uma rede de empreendedores africanos determinados a transformar o futuro.</p>
                                <div className={styles.ctaActions}>
                                    <button
                                        className={styles.applyBtnLarge}
                                        onClick={() => setShowInscricao(true)}
                                    >
                                        ✍️ Candidatar-me Agora
                                    </button>
                                    <div className={styles.shareRow}>
                                        <span className={styles.shareLabel}>Partilhar programa:</span>
                                        <button className={styles.copyBtnSm} onClick={handleCopyLink} title="Copiar Link">
                                            {copied ? '✅ Copiado!' : '🔗 Copiar Link'}
                                        </button>
                                        <button className={styles.waBtnSm} onClick={handleShareWhatsApp} title="Partilhar no WhatsApp">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            WhatsApp
                                        </button>
                                        <button className={styles.linkedinBtnSm} onClick={handleShareLinkedIn} title="Partilhar no LinkedIn">
                                            🔗 LinkedIn
                                        </button>
                                        <button className={styles.facebookBtnSm} onClick={handleShareFacebook} title="Partilhar no Facebook">
                                            📘 Facebook
                                        </button>
                                        <button className={styles.twitterBtnSm} onClick={handleShareTwitter} title="Partilhar no Twitter / X">
                                            𝕏 Twitter
                                        </button>
                                        <button className={styles.emailBtnSm} onClick={handleShareEmail} title="Enviar por E-mail">
                                            ✉️ E-mail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ── MODAL DE INSCRIÇÃO (redirect to /programas with hash) ── */}
                {showInscricao && (
                    <div className={styles.modalOverlay} onClick={() => setShowInscricao(false)}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>📋 Inscrição – {program.title}</h2>
                                <button className={styles.modalClose} onClick={() => setShowInscricao(false)}>✕</button>
                            </div>
                            <div className={styles.modalBody}>
                                <p>Para completar a sua inscrição, será redirecionado para a página de programas onde pode preencher o formulário completo.</p>
                                <Link
                                    href="/programas"
                                    className={styles.modalApplyBtn}
                                >
                                    Ir para o Formulário de Inscrição →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

            </main>
            <FloatingWhatsApp />
            <ScrollToTop />
        </>
    );
}
