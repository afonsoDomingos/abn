'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import Link from 'next/link';
import styles from './Programas.module.css';

interface Program {
  _id: string;
  title: string;
  description: string;
  publicoAlvo?: string;
  beneficios?: string;
  requisitos?: string;
  investimento?: string;
  processoSelecao?: string;
  criteriosSelecao?: string;
  phase?: string;
  duration?: string;
  status: string;
  order: number;
  // Club specific fields
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
}

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
    investimento: 'Inscrição: Gratuita (algumas edições executivas com valor de comparticipação).',
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

export default function ProgramasPage() {
  const [programs, setPrograms] = useState<Program[]>(FALLBACK_PROGRAMS);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState('/hero_entrepreneurs.png');

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.programs && data.programs.length > 0) {
          const activeList = data.programs.filter((p: Program) => p.status === 'ativo');
          if (activeList.length > 0) {
            setPrograms(activeList);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.programas) {
          setBannerUrl(data.configs.page_banners.programas);
        }
      })
      .catch(() => {});
  }, []);

  const phaseColors: Record<string, { color: string; bg: string }> = {
    'Incubação & Aceleração': { color: '#d4af37', bg: 'rgba(212,175,55,0.1)' },
    'Desenvolvimento': { color: '#3498db', bg: 'rgba(52,152,219,0.1)' },
    'Formação': { color: '#2ecc71', bg: 'rgba(46,204,113,0.1)' },
    'Networking': { color: '#e67e22', bg: 'rgba(230,126,34,0.1)' },
  };

  const getPhaseStyle = (phase?: string) =>
    phaseColors[phase || ''] || { color: 'var(--primary)', bg: 'rgba(212,175,55,0.1)' };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Hero */}
        <header
          className={styles.hero}
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(10,10,10,0.95) 100%), url('${bannerUrl}')` }}
        >
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>🚀 Nossos Programas</span>
            <h1>Programas de Incubação &amp; Aceleração</h1>
            <p>
              Descubra os programas da ABN desenhados para transformar ideias em negócios de impacto em África.
            </p>
            <Link href="/incubacao" className={styles.heroBtn}>
              Ver Incubação &amp; Aceleração
            </Link>
          </div>
        </header>

        {/* Programs list */}
        <section className={styles.section}>
          <div className={styles.container}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>A carregar programas...</p>
              </div>
            ) : programs.length === 0 ? (
              <div className={styles.empty}>
                <span style={{ fontSize: '3rem' }}>📋</span>
                <p>Nenhum programa disponível de momento.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {programs.map(prog => {
                  const { color, bg } = getPhaseStyle(prog.phase);
                  const isOpen = expanded === prog._id;
                  return (
                    <div key={prog._id} className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}>
                      <div className={styles.cardTop}>
                        <div className={styles.cardMeta}>
                          {prog.isClub && (
                            <span className={styles.phaseBadge} style={{ color: '#d4af37', background: 'rgba(212,175,55,0.1)' }}>
                              🏛️ Clube de Empreendedores
                            </span>
                          )}
                          {prog.isClub && prog.province && (
                            <span className={styles.durationBadge}>📍 {prog.province}</span>
                          )}
                          {!prog.isClub && prog.phase && (
                            <span className={styles.phaseBadge} style={{ color, background: bg }}>
                              {prog.phase}
                            </span>
                          )}
                          {!prog.isClub && prog.duration && (
                            <span className={styles.durationBadge}>⏱️ {prog.duration}</span>
                          )}
                        </div>
                        <h2 className={styles.cardTitle}>{prog.title}</h2>
                        <p className={styles.cardDesc}>
                          {isOpen ? prog.description : prog.description.slice(0, 200) + (prog.description.length > 200 ? '...' : '')}
                        </p>
                      </div>

                      {isOpen && (
                        <div className={styles.cardDetails}>
                          {prog.lema && (
                            <div className={styles.detailBlock}>
                              <h4>💬 Lema</h4>
                              <p style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--primary)' }}>{prog.lema}</p>
                            </div>
                          )}
                          {prog.missao && (
                            <div className={styles.detailBlock}>
                              <h4>🎯 Missão</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.missao}</p>
                            </div>
                          )}
                          {prog.visao && (
                            <div className={styles.detailBlock}>
                              <h4>👁️ Visão</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.visao}</p>
                            </div>
                          )}
                          {prog.valores && (
                            <div className={styles.detailBlock}>
                              <h4>💎 Valores</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.valores}</p>
                            </div>
                          )}
                          {prog.objectivos && (
                            <div className={styles.detailBlock}>
                              <h4>📊 Objectivos</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.objectivos}</p>
                            </div>
                          )}
                          {prog.publicoAlvo && (
                            <div className={styles.detailBlock}>
                              <h4>👥 Público-Alvo</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.publicoAlvo}</p>
                            </div>
                          )}
                          {prog.areasActuacao && (
                            <div className={styles.detailBlock}>
                              <h4>🗺️ Áreas de Actuação</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.areasActuacao}</p>
                            </div>
                          )}
                          {prog.actividades && (
                            <div className={styles.detailBlock}>
                              <h4>📅 Actividades</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.actividades}</p>
                            </div>
                          )}
                          {(prog.beneficiosMembros || prog.beneficios) && (
                            <div className={styles.detailBlock}>
                              <h4>🎁 Benefícios para os Membros</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.beneficiosMembros || prog.beneficios}</p>
                            </div>
                          )}
                          {prog.compromissoMembros && (
                            <div className={styles.detailBlock}>
                              <h4>🤝 Compromisso dos Membros</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.compromissoMembros}</p>
                            </div>
                          )}
                          {prog.requisitos && (
                            <div className={styles.detailBlock}>
                              <h4>📋 Requisitos</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.requisitos}</p>
                            </div>
                          )}
                          {prog.investimento && (
                            <div className={styles.detailBlock}>
                              <h4>💰 Investimento & Quotas</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.investimento}</p>
                            </div>
                          )}
                          {prog.processoSelecao && (
                            <div className={styles.detailBlock}>
                              <h4>🔍 Processo de Adesão & Seleção</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.processoSelecao}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className={styles.cardFooter}>
                        <button
                          className={styles.toggleBtn}
                          onClick={() => setExpanded(isOpen ? null : prog._id)}
                        >
                          {isOpen ? 'Ver Menos ▲' : 'Saber Mais ▼'}
                        </button>
                        <Link href="/registro" className={styles.applyBtn}>
                          Candidatar-me
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
