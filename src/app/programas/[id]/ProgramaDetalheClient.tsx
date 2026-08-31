'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClubStepTitle } from '@/lib/clubUtils';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import Link from 'next/link';
import { Users, Sparkles, CheckCircle2, DollarSign, Layers, Target, Check } from 'lucide-react';
import styles from './ProgramaDetalhe.module.css';

export interface Program {
  _id: string;
  title: string;
  description: string;
  publicoAlvo?: string;
  beneficios?: string;
  requisitos?: string;
  investimento?: string;
  price?: string;
  paymentType?: 'free' | 'paid' | 'custom';
  customPriceLabel?: string;
  processoSelecao?: string;
  criteriosSelecao?: string;
  phase?: string;
  duration?: string;
  lema?: string;
  image?: string;
  isClub?: boolean;
  missao?: string;
  visao?: string;
  valores?: string;
  objectivos?: string;
  areasActuacao?: string;
  actividades?: string;
  beneficiosMembros?: string;
  compromissoMembros?: string;
  province?: string;
  status?: string;
  order?: number;
}

export const FALLBACK_PROGRAMS: Program[] = [
  {
    _id: 'f-180',
    title: 'ABN STARTUP 180',
    description: 'O ABN Startup 180 é o programa de aceleração intensiva de 6 meses da AfroBiz Network, desenhado para transformar ideias e protótipos em negócios estruturados, viáveis e escaláveis.\n\nDurante o ciclo de 180 dias, os empreendedores selecionados têm acesso a mentoria especializada de alto nível, capacitação prática em gestão e inovação, conexão direta com fundadores seniores, investidores anjo e fundos de venture capital.',
    publicoAlvo: '- Startups em estágio inicial (ideação ou MVP validado);\n- Empreendedores com soluções inovadoras nos setores de tecnologia, agronegócio, sustentabilidade e serviços;\n- Negócios fundados por africanos ou afrodescendentes com potencial de impacto e escalabilidade continental.',
    beneficios: '- Acompanhamento e mentoria com especialistas da rede ABN;\n- Acesso a investidores e parceiros corporativos;\n- Suporte jurídico, contábil e de marketing digital;\n- Exposição no Ecossistema Global ABN e dias de Pitch exclusivos;\n- Acesso a créditos de ferramentas digitais e infraestrutura tecnológica.',
    requisitos: '- Ter pelo menos um fundador dedicado ao projeto;\n- Protótipo funcional, MVP ou negócio em fase inicial de tração;\n- Modelo de negócio com potencial de expansão;\n- Disponibilidade para participar de sessões e workshops semanais.',
    investimento: 'Programa financiado com apoio de parceiros institucionais e bolsas de aceleração. Condições sob consulta.',
    processoSelecao: '1. Inscrição online e submissão do pitch deck;\n2. Triagem técnica pela comissão da ABN;\n3. Entrevista com a equipa de aceleração;\n4. Pitch Day de seleção dos finalistas;\n5. Início do ciclo de 180 dias.',
    criteriosSelecao: '- Inovação e diferenciação da solução;\n- Capacidade de execução da equipa fundadora;\n- Tamanho do mercado e viabilidade comercial;\n- Impacto social, económico e ambiental gerado.',
    phase: 'Incubação & Aceleração',
    duration: '6 Meses (180 Dias)',
    status: 'ativo',
    order: 0,
    image: '/guine_bissau_banner.png'
  },
  {
    _id: 'f-academia',
    title: 'ACADEMIA DE EMPREENDEDORISMO ABN',
    description: 'A Academia de Empreendedorismo ABN é a plataforma de capacitação executiva e formação profissional contínua da AfroBiz Network.\n\nOferece cursos modulares, workshops práticos, masterclasses e programas de certificação voltados para desenvolver as competências essenciais de fundadores, executivos e gestores do ecossistema empresarial africano.',
    publicoAlvo: '- Jovens e aspirantes a empreendedores que queiram validar suas ideias;\n- Profissionais em transição de carreira para o empreendedorismo;\n- Gestores e fundadores de micro e pequenas empresas;\n- Equipas operacionais de startups em busca de capacitação.',
    beneficios: '- Cursos práticos com especialistas e profissionais de mercado;\n- Certificado oficial de conclusão emitido pela ABN Academy;\n- Material didático exclusivo, templates e ferramentas de gestão;\n- Acesso à comunidade de alunos e sessões de mentoria em grupo;\n- Encaminhamento dos melhores alunos para programas de aceleração da ABN.',
    requisitos: '- Ter idade igual ou superior a 16 anos;\n- Interesse em empreendedorismo;\n- Compromisso com a aprendizagem contínua.',
    investimento: '• Startups Incubadas: Gratuito ou incluído na mensalidade.\n\n1. Participantes Individuais:\n- Formação Intensiva (7 dias): 8.000 MT – 18.000 MT\n- Formação Completa (15 dias): 15.000 MT – 35.000 MT\n- Coaching Individual (60–90 min): 2.000 MT – 5.000 MT\n- Pacote de Coaching (6 sessões): 10.000 MT – 25.000 MT\n- Certificação: 8.000 MT – 20.000 MT',
    processoSelecao: 'Inscrição direta conforme abertura de turmas.',
    criteriosSelecao: 'Ordem de inscrição e perfil empreendedor.',
    phase: 'Desenvolvimento',
    duration: 'Por Edição',
    status: 'ativo',
    order: 1,
    image: '/mission_team.png'
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
    order: 2,
    image: '/ADS01.jpg'
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
    order: 3,
    image: '/partners_hero.png'
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
    order: 4,
    image: '/abn-cover.jpg'
  }
];

export default function ProgramaDetalheClient({ id, initialProgram }: { id: string; initialProgram?: Program | null }) {
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(initialProgram || null);
  const [loading, setLoading] = useState(!initialProgram);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInscricao, setShowInscricao] = useState(false);

  useEffect(() => {
    if (initialProgram) return;
    if (!id) return;

    const fallback = FALLBACK_PROGRAMS.find(p => p._id === id);
    if (fallback) {
      setProgram(fallback);
      setLoading(false);
      return;
    }

    fetch(`/api/programs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.program) {
          setProgram(data.program);
        } else {
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
  }, [id, initialProgram]);

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
    const text = `Olá! Confira este programa da ABN – AfroBiz Network:\n\n*${program.title}*\n${program.description.slice(0, 200)}...\n\n${url}`;
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
    const text = `Confira o programa *${program.title}* da AfroBiz Network (ABN)!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareEmail = () => {
    if (!program) return;
    const url = window.location.href;
    const subject = `Programa ABN: ${program.title}`;
    const body = `Olá!\n\nRecomendo este programa da AfroBiz Network (ABN):\n\n${program.title}\n\n${program.description.slice(0, 300)}...\n\nSaiba mais no link:\n${url}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
  };

  // Smart formatter that renders structured lists or narrative paragraphs cleanly
  const renderDetailItems = (content?: string) => {
    if (!content) return null;

    const rawLines = content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    // If it has only 1 line without any bullet markers or semicolons
    if (rawLines.length === 1 && !content.includes('•') && !content.includes(';') && !content.startsWith('-')) {
      return <p className={styles.detailParagraph}>{content}</p>;
    }

    const items = rawLines.flatMap(line => {
      if (line.includes(';') && line.length > 80 && !line.startsWith('•') && !line.startsWith('-')) {
        return line.split(';').map(s => s.trim()).filter(Boolean);
      }
      return [line];
    });

    return (
      <ul className={styles.detailList}>
        {items.map((item, idx) => {
          const cleanText = item.replace(/^([•\-\*\d\.\)]\s*)+/, '').trim();
          if (!cleanText) return null;

          return (
            <li key={idx} className={styles.detailListItem}>
              <span className={styles.listBulletIcon}>
                <Check size={11} strokeWidth={3} />
              </span>
              <span className={styles.listText}>{cleanText}</span>
            </li>
          );
        })}
      </ul>
    );
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
          <h1>Programa não encontrado</h1>
          <p>O programa que procura não existe ou foi removido.</p>
          <Link href="/programas" className={styles.backBtn}>Ver todos os Programas</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>

        {/* ── HERO ── */}
        <header className={styles.hero} style={program.image ? { backgroundImage: `url('${program.image}')` } : {}}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <Link href="/programas" className={styles.breadcrumb}>
              Todos os Programas
            </Link>
            <div className={styles.heroBadges}>
              {program.phase && (
                <span className={styles.phaseBadge}>
                  {program.phase}
                </span>
              )}
              {program.duration && (
                <span className={styles.durationBadge}>{program.duration}</span>
              )}
              {program.isClub && (
                <span className={styles.clubBadge}>{getClubStepTitle(program.title)}</span>
              )}
            </div>
            <h1 className={styles.heroTitle}>{program.title}</h1>
            {program.lema && <p className={styles.heroLema}>{program.lema}</p>}
            <div className={styles.heroCtaRow}>
              <button
                className={styles.applyBtnHero}
                onClick={() => setShowInscricao(true)}
              >
                Candidatar-me a este Programa
              </button>
              <button className={styles.shareBtnHero} onClick={handleCopyLink}>
                {copied ? 'Link Copiado!' : 'Copiar Link'}
              </button>
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className={styles.container}>

          {/* OVERVIEW */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>SOBRE O PROGRAMA</span>
              <h2>Visão Geral</h2>
            </div>
            <div className={styles.descriptionBox}>
              <p style={{ whiteSpace: 'pre-line' }}>{program.description}</p>
            </div>
          </section>

          {/* DETAILS GRID */}
          <section className={styles.sectionAlt}>
            <div className={styles.detailsGrid}>
              {program.publicoAlvo && (
                <div className={styles.detailCard}>
                  <div className={styles.detailCardHeader}>
                    <div className={styles.detailCardIconWrap}>
                      <Users size={18} />
                    </div>
                    <h3>Público-Alvo</h3>
                  </div>
                  <div className={styles.detailCardContent}>
                    {renderDetailItems(program.publicoAlvo)}
                  </div>
                </div>
              )}

              {program.beneficios && (
                <div className={styles.detailCard}>
                  <div className={styles.detailCardHeader}>
                    <div className={styles.detailCardIconWrap}>
                      <Sparkles size={18} />
                    </div>
                    <h3>Benefícios &amp; Oportunidades</h3>
                  </div>
                  <div className={styles.detailCardContent}>
                    {renderDetailItems(program.beneficios)}
                  </div>
                </div>
              )}

              {program.requisitos && (
                <div className={styles.detailCard}>
                  <div className={styles.detailCardHeader}>
                    <div className={styles.detailCardIconWrap}>
                      <CheckCircle2 size={18} />
                    </div>
                    <h3>Requisitos de Elegibilidade</h3>
                  </div>
                  <div className={styles.detailCardContent}>
                    {renderDetailItems(program.requisitos)}
                  </div>
                </div>
              )}

              {program.investimento && (
                <div className={styles.detailCard}>
                  <div className={styles.detailCardHeader}>
                    <div className={styles.detailCardIconWrap}>
                      <DollarSign size={18} />
                    </div>
                    <h3>Investimento &amp; Custos</h3>
                  </div>
                  <div className={styles.detailCardContent}>
                    {renderDetailItems(program.investimento)}
                  </div>
                </div>
              )}

              {program.processoSelecao && (
                <div className={styles.detailCard}>
                  <div className={styles.detailCardHeader}>
                    <div className={styles.detailCardIconWrap}>
                      <Layers size={18} />
                    </div>
                    <h3>Processo de Admissão</h3>
                  </div>
                  <div className={styles.detailCardContent}>
                    {renderDetailItems(program.processoSelecao)}
                  </div>
                </div>
              )}

              {program.criteriosSelecao && (
                <div className={styles.detailCard}>
                  <div className={styles.detailCardHeader}>
                    <div className={styles.detailCardIconWrap}>
                      <Target size={18} />
                    </div>
                    <h3>Critérios de Seleção</h3>
                  </div>
                  <div className={styles.detailCardContent}>
                    {renderDetailItems(program.criteriosSelecao)}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* CTA BOTTOM */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaBox}>
              <h2>Pronto para fazer parte do {program.title}?</h2>
              <p>Junte-se a uma rede de empreendedores africanos determinados a transformar o futuro.</p>
              <div className={styles.ctaActions}>
                <button
                  className={styles.applyBtnLarge}
                  onClick={() => setShowInscricao(true)}
                >
                  Candidatar-me Agora
                </button>
                <div className={styles.shareRow}>
                  <span className={styles.shareLabel}>Partilhar programa:</span>
                  <button className={styles.copyBtnSm} onClick={handleCopyLink} title="Copiar Link">
                    {copied ? 'Copiado!' : 'Copiar Link'}
                  </button>
                  <button className={styles.waBtnSm} onClick={handleShareWhatsApp} title="Partilhar no WhatsApp">
                    WhatsApp
                  </button>
                  <button className={styles.linkedinBtnSm} onClick={handleShareLinkedIn} title="Partilhar no LinkedIn">
                    LinkedIn
                  </button>
                  <button className={styles.facebookBtnSm} onClick={handleShareFacebook} title="Partilhar no Facebook">
                    Facebook
                  </button>
                  <button className={styles.twitterBtnSm} onClick={handleShareTwitter} title="Partilhar no Twitter / X">
                    Twitter
                  </button>
                  <button className={styles.emailBtnSm} onClick={handleShareEmail} title="Enviar por E-mail">
                    E-mail
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* MODAL REDIRECT TO INSCRIÇÃO */}
        {showInscricao && (
          <div className={styles.modalOverlay} onClick={() => setShowInscricao(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Candidatura ao {program.title}</h2>
                <button className={styles.modalClose} onClick={() => setShowInscricao(false)}>&times;</button>
              </div>
              <div className={styles.modalBody}>
                <p>Será redirecionado para o formulário de candidatura oficial da ABN.</p>
                <button
                  className={styles.modalApplyBtn}
                  onClick={() => {
                    setShowInscricao(false);
                    router.push('/programas#candidatura');
                  }}
                >
                  Avançar para o Formulário  
                </button>
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