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
  price?: string;
  paymentInstructions?: string;
  processoSelecao?: string;
  criteriosSelecao?: string;
  phase?: string;
  duration?: string;
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

interface InqueritorForm {
  // Sec 1
  nomeCompleto: string;
  docIdentificacao: string;
  nuit: string;
  email: string;
  endereco: string;
  // Sec 2
  nomeNegocio: string;
  alvara: string;
  sector: string[];
  sectorOutro: string;
  // Sec 3
  nivelAdesao: string;
  formaPagamento: string;
  metodoPagamento: string;
  comprovativoUrl: string;
  // Sec 4
  areasInteresse: string[];
  // Sec 5
  comoConheceu: string;
  comoConheceuOutro: string;
  // Sec 6
  localData: string;
  assinatura: string;
}

const initialForm: InqueritorForm = {
  nomeCompleto: '', docIdentificacao: '', nuit: '', email: '', endereco: '',
  nomeNegocio: '', alvara: '', sector: [], sectorOutro: '',
  nivelAdesao: '', formaPagamento: '', metodoPagamento: 'mpesa', comprovativoUrl: '',
  areasInteresse: [],
  comoConheceu: '', comoConheceuOutro: '',
  localData: '', assinatura: '',
};

export default function ProgramasPage() {
  const [programs, setPrograms] = useState<Program[]>(FALLBACK_PROGRAMS);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState('/hero_entrepreneurs.png');
  const [showInquerito, setShowInquerito] = useState(false);
  const [form, setForm] = useState<InqueritorForm>(initialForm);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [clubeExpanded, setClubeExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.programs && data.programs.length > 0) {
          const activeList = data.programs.filter((p: Program) => p.status === 'ativo');
          if (activeList.length > 0) setPrograms(activeList);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.programas) setBannerUrl(data.configs.page_banners.programas);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (showInquerito) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showInquerito]);

  const clube = programs.find(p => p.isClub);
  const otherPrograms = programs.filter(p => !p.isClub).sort((a, b) => a.order - b.order);

  const phaseColors: Record<string, { color: string; bg: string }> = {
    'Incubação & Aceleração': { color: '#d4af37', bg: 'rgba(212,175,55,0.1)' },
    'Desenvolvimento': { color: '#3498db', bg: 'rgba(52,152,219,0.1)' },
    'Formação': { color: '#2ecc71', bg: 'rgba(46,204,113,0.1)' },
    'Networking': { color: '#e67e22', bg: 'rgba(230,126,34,0.1)' },
  };
  const getPhaseStyle = (phase?: string) =>
    phaseColors[phase || ''] || { color: 'var(--primary)', bg: 'rgba(212,175,55,0.1)' };

  const toggleSector = (val: string) => {
    setForm(f => ({
      ...f,
      sector: f.sector.includes(val) ? f.sector.filter(s => s !== val) : [...f.sector, val]
    }));
  };

  const toggleInteresse = (val: string) => {
    setForm(f => ({
      ...f,
      areasInteresse: f.areasInteresse.includes(val)
        ? f.areasInteresse.filter(s => s !== val)
        : [...f.areasInteresse, val]
    }));
  };

  const handleProofUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingProof(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setForm(f => ({ ...f, comprovativoUrl: data.url }));
      } else {
        alert(data.error || 'Erro ao carregar comprovativo.');
      }
    } catch {
      alert('Erro de conexão ao carregar comprovativo.');
    } finally {
      setUploadingProof(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return;
    }
    
    // Validate required fields before submission
    if (!form.nomeCompleto.trim() || !form.email.trim() || !form.nivelAdesao.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios: Nome, Email e Nível de Adesão.');
      return;
    }
    
    try {
      console.log('Enviando formulário:', { ...form, origem: 'programas' });
      const response = await fetch('/api/clube/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, origem: 'programas' }),
      });
      const data = await response.json();
      console.log('Resposta da API:', data);
      if (data.success) {
        setSubmitted(true);
      } else {
        alert('Erro ao submeter inquérito: ' + (data.error || 'Tente novamente'));
      }
    } catch (error) {
      console.error('Erro ao submeter inquérito:', error);
      alert('Erro ao submeter inquérito. Tente novamente.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return form.nomeCompleto.trim() !== '' && form.email.trim() !== '';
    }
    if (currentStep === 6) {
      return form.assinatura.trim() !== '';
    }
    return true;
  };

  const closeModal = () => {
    setShowInquerito(false);
    setSubmitted(false);
    setForm(initialForm);
  };

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
            <p>Descubra os programas da ABN desenhados para transformar ideias em negócios de impacto em África.</p>
            <Link href="/incubacao" className={styles.heroBtn}>Ver Incubação &amp; Aceleração</Link>
          </div>
        </header>

        {/* ── CLUBE DOS EMPREENDEDORES — DESTAQUE ── */}
        {!loading && clube && (
          <section className={styles.clubeSection}>
            <div className={styles.clubeContainer}>
              <div className={styles.clubeHeader}>
                <div className={styles.clubeHeaderLeft}>
                  <span className={styles.clubeFeaturedBadge}>⭐ Programa em Destaque</span>
                  <div className={styles.clubeIconRow}>
                    <span className={styles.clubeIcon}>🏛️</span>
                    <div>
                      <h2 className={styles.clubeTitle}>{clube.title}</h2>
                      {clube.province && (
                        <span className={styles.clubeProvince}>📍 {clube.province}</span>
                      )}
                    </div>
                  </div>
                  {clube.lema && (
                    <p className={styles.clubeLema}>{clube.lema}</p>
                  )}
                </div>
                <div className={styles.clubeHeaderRight}>
                  <button
                    id="btn-inscrever-clube"
                    className={styles.clubeInscBtn}
                    onClick={() => setShowInquerito(true)}
                  >
                    ✍️ Inscrever-me no Clube
                  </button>
                  <button
                    className={styles.clubeDetailBtn}
                    onClick={() => setClubeExpanded(v => !v)}
                  >
                    {clubeExpanded ? 'Ver Menos ▲' : 'Saber Mais ▼'}
                  </button>
                </div>
              </div>

              <p className={styles.clubeDesc}>{clube.description}</p>

              {/* Pillars row */}
              <div className={styles.clubePillars}>
                {clube.missao && (
                  <div className={styles.clubePillar}>
                    <span className={styles.clubePillarIcon}>🎯</span>
                    <h4>Missão</h4>
                    <p>{clube.missao}</p>
                  </div>
                )}
                {clube.visao && (
                  <div className={styles.clubePillar}>
                    <span className={styles.clubePillarIcon}>👁️</span>
                    <h4>Visão</h4>
                    <p>{clube.visao}</p>
                  </div>
                )}
                {clube.valores && (
                  <div className={styles.clubePillar}>
                    <span className={styles.clubePillarIcon}>💎</span>
                    <h4>Valores</h4>
                    <p style={{ whiteSpace: 'pre-line' }}>{clube.valores}</p>
                  </div>
                )}
              </div>

              {/* Expanded details */}
              {clubeExpanded && (
                <div className={styles.clubeExpanded}>
                  <div className={styles.clubeExpandedGrid}>
                    {clube.objectivos && (
                      <div className={styles.clubeDetailBlock}>
                        <h4>📊 Objectivos</h4>
                        <p style={{ whiteSpace: 'pre-line' }}>{clube.objectivos}</p>
                      </div>
                    )}
                    {clube.publicoAlvo && (
                      <div className={styles.clubeDetailBlock}>
                        <h4>👥 Público-Alvo</h4>
                        <p style={{ whiteSpace: 'pre-line' }}>{clube.publicoAlvo}</p>
                      </div>
                    )}
                    {clube.areasActuacao && (
                      <div className={styles.clubeDetailBlock}>
                        <h4>🗺️ Áreas de Actuação</h4>
                        <p style={{ whiteSpace: 'pre-line' }}>{clube.areasActuacao}</p>
                      </div>
                    )}
                    {clube.actividades && (
                      <div className={styles.clubeDetailBlock}>
                        <h4>📅 Actividades</h4>
                        <p style={{ whiteSpace: 'pre-line' }}>{clube.actividades}</p>
                      </div>
                    )}
                    {(clube.beneficiosMembros || clube.beneficios) && (
                      <div className={styles.clubeDetailBlock}>
                        <h4>🎁 Benefícios para Membros</h4>
                        <p style={{ whiteSpace: 'pre-line' }}>{clube.beneficiosMembros || clube.beneficios}</p>
                      </div>
                    )}
                    {clube.investimento && (
                      <div className={styles.clubeDetailBlock}>
                        <h4>💰 Investimento & Quotas</h4>
                        <p style={{ whiteSpace: 'pre-line' }}>{clube.investimento}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.clubeExpandedCTA}>
                    <button
                      className={styles.clubeInscBtn}
                      onClick={() => setShowInquerito(true)}
                    >
                      ✍️ Preencher Inquérito de Inscrição
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Other Programs */}
        <section className={styles.section}>
          <div className={styles.container}>
            {otherPrograms.length > 0 && (
              <div className={styles.sectionLabel}>
                <span>Outros Programas</span>
              </div>
            )}
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>A carregar programas...</p>
              </div>
            ) : otherPrograms.length === 0 ? (
              <div className={styles.empty}>
                <span style={{ fontSize: '3rem' }}>📋</span>
                <p>Nenhum programa disponível de momento.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {otherPrograms.map(prog => {
                  const { color, bg } = getPhaseStyle(prog.phase);
                  const isOpen = expanded === prog._id;
                  return (
                    <div key={prog._id} className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}>
                      <div className={styles.cardTop}>
                        <div className={styles.cardMeta}>
                          {prog.phase && (
                            <span className={styles.phaseBadge} style={{ color, background: bg }}>
                              {prog.phase}
                            </span>
                          )}
                          {prog.duration && (
                            <span className={styles.durationBadge}>⏱️ {prog.duration}</span>
                          )}
                          {prog.price && (
                            <span className={styles.durationBadge} style={{ color: '#ff6b00', borderColor: 'rgba(255,107,0,0.3)', fontWeight: 800 }}>💳 {prog.price}</span>
                          )}
                        </div>
                        <h2 className={styles.cardTitle}>{prog.title}</h2>
                        <p className={styles.cardDesc}>
                          {isOpen ? prog.description : prog.description.slice(0, 200) + (prog.description.length > 200 ? '...' : '')}
                        </p>
                      </div>

                      {isOpen && (
                        <div className={styles.cardDetails}>
                          {prog.publicoAlvo && (
                            <div className={styles.detailBlock}>
                              <h4>👥 Público-Alvo</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.publicoAlvo}</p>
                            </div>
                          )}
                          {prog.beneficios && (
                            <div className={styles.detailBlock}>
                              <h4>🎁 Benefícios</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.beneficios}</p>
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
                              <h4>💰 Investimento</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.investimento}</p>
                            </div>
                          )}
                          {prog.processoSelecao && (
                            <div className={styles.detailBlock}>
                              <h4>🔍 Processo de Seleção</h4>
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

      {/* ── INQUÉRITO DE INSCRIÇÃO MODAL ── */}
      {showInquerito && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Inquérito de Inscrição">

            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <span className={styles.modalHeaderIcon}>🏛️</span>
                <div>
                  <h2 className={styles.modalTitle}>Inquérito de Inscrição</h2>
                  <p className={styles.modalSubtitle}>Clube dos Empreendedores — ABN | AfroBiz Network</p>
                </div>
              </div>
              <button className={styles.modalClose} onClick={closeModal} aria-label="Fechar">✕</button>
            </div>

            {submitted ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✅</div>
                <h3>Inquérito enviado com sucesso!</h3>
                <p>
                  Obrigado, <strong>{form.nomeCompleto || 'candidato'}</strong>. O seu inquérito de inscrição foi recebido.
                  A equipa ABN irá analisar o seu perfil e entrar em contacto brevemente.
                </p>
                <p className={styles.successNote}>
                  Os dados fornecidos são tratados exclusivamente para fins de gestão da sua adesão ao Clube dos Empreendedores, nos termos da Cláusula de Protecção de Dados do Contrato de Adesão.
                </p>
                <div className={styles.successActions}>
                  <Link href="/programas" className={styles.successActionBtn} onClick={closeModal}>
                    Ver mais programas
                  </Link>
                  <Link href="/cursos" className={styles.successActionBtn} onClick={closeModal}>
                    Ver cursos
                  </Link>
                  <Link href="/eventos" className={styles.successActionBtn} onClick={closeModal}>
                    Ver eventos
                  </Link>
                </div>
              </div>
            ) : (
              <form className={styles.inqueritorForm} onSubmit={handleSubmit}>
                {/* Progress Indicator */}
                <div className={styles.wizardProgress}>
                  <div className={styles.progressSteps}>
                    {Array.from({ length: totalSteps }, (_, i) => (
                      <div
                        key={i + 1}
                        className={`${styles.progressStep} ${currentStep === i + 1 ? styles.activeStep : ''} ${currentStep > i + 1 ? styles.completedStep : ''}`}
                        onClick={() => currentStep > i + 1 && setCurrentStep(i + 1)}
                      >
                        <span className={styles.stepNumber}>{currentStep > i + 1 ? '✓' : i + 1}</span>
                        <span className={styles.stepLabel}>
                          {i + 1 === 1 && 'Identificação'}
                          {i + 1 === 2 && 'Negócio'}
                          {i + 1 === 3 && 'Adesão'}
                          {i + 1 === 4 && 'Interesses'}
                          {i + 1 === 5 && 'Origem'}
                          {i + 1 === 6 && 'Declaração'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
                  </div>
                </div>

                <p className={styles.formIntro}>
                  {currentStep === 1 && 'Preencha os campos abaixo. Os dados fornecidos serão utilizados exclusivamente para fins de gestão da sua adesão ao Clube dos Empreendedores.'}
                  {currentStep === 2 && 'Informações sobre o seu negócio ou actividade (opcional).'}
                  {currentStep === 3 && 'Seleccione o nível de adesão pretendido e forma de pagamento.'}
                  {currentStep === 4 && 'Seleccione as áreas de interesse (pode seleccionar múltiplas).'}
                  {currentStep === 5 && 'Como conheceu o Clube dos Empreendedores?'}
                  {currentStep === 6 && 'Revise a declaração e assine para submeter o inquérito.'}
                </p>

                {/* ── SECÇÃO 1 ── */}
                {currentStep === 1 && (
                  <div className={styles.formSection}>
                    <div className={styles.formSectionHeader}>
                      <span className={styles.formSectionNumber}>1</span>
                      <h3>Dados de Identificação</h3>
                    </div>
                    <div className={styles.formGrid2}>
                      <div className={styles.formField}>
                        <label htmlFor="nomeCompleto">Nome completo <span className={styles.required}>*</span></label>
                        <input
                          id="nomeCompleto"
                          type="text"
                          required
                          className={styles.formInput}
                          placeholder="Nome completo"
                          value={form.nomeCompleto}
                          onChange={e => setForm(f => ({ ...f, nomeCompleto: e.target.value }))}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="docIdentificacao">Documento de identificação (BI/Passaporte) nº</label>
                        <input
                          id="docIdentificacao"
                          type="text"
                          className={styles.formInput}
                          placeholder="Número do documento"
                          value={form.docIdentificacao}
                          onChange={e => setForm(f => ({ ...f, docIdentificacao: e.target.value }))}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="nuit">NUIT (quando aplicável)</label>
                        <input
                          id="nuit"
                          type="text"
                          className={styles.formInput}
                          placeholder="Número NUIT"
                          value={form.nuit}
                          onChange={e => setForm(f => ({ ...f, nuit: e.target.value }))}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="email">E-mail <span className={styles.required}>*</span></label>
                        <input
                          id="email"
                          type="email"
                          required
                          className={styles.formInput}
                          placeholder="seu@email.com"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                      </div>
                      <div className={`${styles.formField} ${styles.colSpan2}`}>
                        <label htmlFor="endereco">Endereço / Localidade</label>
                        <input
                          id="endereco"
                          type="text"
                          className={styles.formInput}
                          placeholder="Cidade, Província"
                          value={form.endereco}
                          onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SECÇÃO 2 ── */}
                {currentStep === 2 && (
                  <div className={styles.formSection}>
                    <div className={styles.formSectionHeader}>
                      <span className={styles.formSectionNumber}>2</span>
                      <h3>Dados do Negócio / Actividade <span className={styles.optional}>(quando aplicável)</span></h3>
                    </div>
                    <div className={styles.formGrid2}>
                      <div className={styles.formField}>
                        <label htmlFor="nomeNegocio">Nome do negócio / empresa / cooperativa</label>
                        <input
                          id="nomeNegocio"
                          type="text"
                          className={styles.formInput}
                          placeholder="Nome da empresa"
                          value={form.nomeNegocio}
                          onChange={e => setForm(f => ({ ...f, nomeNegocio: e.target.value }))}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="alvara">Alvará / Certidão de registo nº (quando aplicável)</label>
                        <input
                          id="alvara"
                          type="text"
                          className={styles.formInput}
                          placeholder="Número do alvará"
                          value={form.alvara}
                          onChange={e => setForm(f => ({ ...f, alvara: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className={styles.formField}>
                      <label>Sector de actividade</label>
                      <div className={styles.checkGroup}>
                        {['Agro-negócio', 'Comércio e serviços', 'Indústria criativa', 'Tecnologia e inovação', 'Turismo'].map(s => (
                          <label key={s} className={styles.checkLabel}>
                            <input
                              type="checkbox"
                              className={styles.checkInput}
                              checked={form.sector.includes(s)}
                              onChange={() => toggleSector(s)}
                            />
                            <span className={styles.checkBox}></span>
                            {s}
                          </label>
                        ))}
                        <label className={styles.checkLabel}>
                          <input
                            type="checkbox"
                            className={styles.checkInput}
                            checked={form.sector.includes('outro')}
                            onChange={() => toggleSector('outro')}
                          />
                          <span className={styles.checkBox}></span>
                          Outro:
                          <input
                            type="text"
                            className={styles.checkOtherInput}
                            placeholder="Especifique"
                            value={form.sectorOutro}
                            onChange={e => setForm(f => ({ ...f, sectorOutro: e.target.value }))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SECÇÃO 3 ── */}
                {currentStep === 3 && (
                  <div className={styles.formSection}>
                    <div className={styles.formSectionHeader}>
                      <span className={styles.formSectionNumber}>3</span>
                      <h3>Nível de Adesão Pretendido</h3>
                    </div>
                    <div className={styles.formField}>
                      <div className={styles.radioGroup}>
                        {[
                          { val: 'jovem', label: 'Jovem / Estudante', sub: 'Inscrição 300 MT | Quota anual 1.000 MT' },
                          { val: 'individual', label: 'Individual', sub: 'Inscrição 500 MT | Quota anual 2.400 MT' },
                          { val: 'empresa', label: 'Empresa / PME', sub: 'Inscrição 1.500 MT | Quota anual 6.000 MT' },
                          { val: 'corp-gold', label: 'Corporativo — Corporate Gold', sub: '20.000 MT/ano' },
                          { val: 'corp-platinum', label: 'Corporativo — Corporate Platinum', sub: '40.000 MT/ano' },
                          { val: 'corp-founding', label: 'Corporativo — Corporate Founding Partner', sub: 'Pacote personalizado' },
                          { val: 'honorario', label: 'Honorário', sub: 'Por convite da Direcção da ABN (isento)' },
                        ].map(opt => (
                          <label key={opt.val} className={`${styles.radioLabel} ${form.nivelAdesao === opt.val ? styles.radioLabelActive : ''}`}>
                            <input
                              type="radio"
                              name="nivelAdesao"
                              className={styles.radioInput}
                              value={opt.val}
                              checked={form.nivelAdesao === opt.val}
                              onChange={() => setForm(f => ({ ...f, nivelAdesao: opt.val }))}
                            />
                            <span className={styles.radioCircle}></span>
                            <span className={styles.radioContent}>
                              <span className={styles.radioLabelText}>{opt.label}</span>
                              <span className={styles.radioSub}>{opt.sub}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className={styles.formField} style={{ marginTop: '1rem' }}>
                      <label>Periodicidade da quota</label>
                      <div className={styles.radioGroupRow}>
                        {[
                          { val: 'anual', label: 'Anual (com desconto de 10%)' },
                          { val: 'trimestral', label: 'Trimestral' },
                          { val: 'mensal', label: 'Mensal' },
                        ].map(opt => (
                          <label key={opt.val} className={`${styles.radioLabelRow} ${form.formaPagamento === opt.val ? styles.radioLabelRowActive : ''}`}>
                            <input
                              type="radio"
                              name="formaPagamento"
                              className={styles.radioInput}
                              value={opt.val}
                              checked={form.formaPagamento === opt.val}
                              onChange={() => setForm(f => ({ ...f, formaPagamento: opt.val }))}
                            />
                            <span className={styles.radioCircle}></span>
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formField} style={{ marginTop: '1.25rem' }}>
                      <label style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ff6b00', display: 'block', marginBottom: '0.5rem' }}>
                        💳 Método de Pagamento do Programa / Adesão
                      </label>
                      <div className={styles.radioGroupRow} style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                        {[
                          { val: 'mpesa', label: '📲 M-Pesa' },
                          { val: 'emola', label: '📲 eMola' },
                          { val: 'cartao', label: '💳 Cartão / Checkout' },
                          { val: 'banco', label: '🏦 Transferência Bancária' },
                        ].map(opt => (
                          <label key={opt.val} className={`${styles.radioLabelRow} ${form.metodoPagamento === opt.val ? styles.radioLabelRowActive : ''}`} style={{ padding: '0.6rem 1rem', borderRadius: '8px' }}>
                            <input
                              type="radio"
                              name="metodoPagamento"
                              className={styles.radioInput}
                              value={opt.val}
                              checked={form.metodoPagamento === opt.val}
                              onChange={() => setForm(f => ({ ...f, metodoPagamento: opt.val }))}
                            />
                            <span className={styles.radioCircle}></span>
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Payment Instructions & Proof Upload Box */}
                    <div style={{ marginTop: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: 800 }}>
                        📌 Instruções de Pagamento ({form.metodoPagamento.toUpperCase()})
                      </h4>
                      
                      {form.metodoPagamento === 'mpesa' && (
                        <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                          <p style={{ margin: 0 }}>Pagamento por M-Pesa. As instruções e os dados de confirmação serão disponibilizados pela equipa ABN após a submissão da candidatura.</p>
                        </div>
                      )}
                      {form.metodoPagamento === 'emola' && (
                        <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                          <p style={{ margin: 0 }}>Pagamento por eMola. As instruções e os dados de confirmação serão disponibilizados pela equipa ABN após a submissão da candidatura.</p>
                        </div>
                      )}
                      {form.metodoPagamento === 'cartao' && (
                        <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                          <p style={{ margin: 0 }}>Pagamento por Cartão de Débito/Crédito. A nossa equipa disponibilizará o link de checkout seguro após o envio do formulário.</p>
                        </div>
                      )}
                      {form.metodoPagamento === 'banco' && (
                        <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                          <p style={{ margin: 0 }}>Transferência Bancária. Os dados da conta bancária oficial da ABN serão facultados diretamente pela equipa ABN.</p>
                        </div>
                      )}

                      <div style={{ marginTop: '1rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.8rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>
                          📎 Anexar Comprovativo de Pagamento (opcional ou após transferência)
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleProofUpload(file);
                            }}
                            style={{ fontSize: '0.85rem' }}
                          />
                          {uploadingProof && <span style={{ fontSize: '0.85rem', color: '#ff6b00', fontWeight: 600 }}>⏳ A carregar...</span>}
                        </div>
                        {form.comprovativoUrl && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                            ✅ Comprovativo anexado com sucesso!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SECÇÃO 4 ── */}
                {currentStep === 4 && (
                  <div className={styles.formSection}>
                    <div className={styles.formSectionHeader}>
                      <span className={styles.formSectionNumber}>4</span>
                      <h3>Áreas de Interesse <span className={styles.optional}>(seleccione todas as aplicáveis)</span></h3>
                    </div>
                    <div className={styles.checkGroup}>
                      {[
                        'Formação e capacitação empresarial',
                        'Mentoria e coaching',
                        'Incubação de negócio (ideia/arranque)',
                        'Aceleração de negócio (negócio já validado)',
                        'Networking empresarial e feiras',
                        'Educação financeira',
                        'Transformação digital para pequenos negócios',
                        'Oportunidades de investimento e financiamento',
                        'Parcerias institucionais',
                        'Marketplace ABN / venda entre membros',
                        'Programa Mentor Sénior (como mentor ou mentorado)',
                        'Clube de Investidores',
                      ].map(area => (
                        <label key={area} className={styles.checkLabel}>
                          <input
                            type="checkbox"
                            className={styles.checkInput}
                            checked={form.areasInteresse.includes(area)}
                            onChange={() => toggleInteresse(area)}
                          />
                          <span className={styles.checkBox}></span>
                          {area}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SECÇÃO 5 ── */}
                {currentStep === 5 && (
                  <div className={styles.formSection}>
                    <div className={styles.formSectionHeader}>
                      <span className={styles.formSectionNumber}>5</span>
                      <h3>Como conheceu o Clube dos Empreendedores?</h3>
                    </div>
                    <div className={styles.radioGroupCol}>
                      {[
                        { val: 'site', label: 'Site da ABN (abnafrobiznetwork.com)' },
                        { val: 'redes', label: 'Redes sociais' },
                        { val: 'indicacao', label: 'Indicação de um membro/amigo' },
                        { val: 'evento', label: 'Evento ou feira' },
                      ].map(opt => (
                        <label key={opt.val} className={`${styles.radioLabelRow} ${form.comoConheceu === opt.val ? styles.radioLabelRowActive : ''}`}>
                          <input
                            type="radio"
                            name="comoConheceu"
                            className={styles.radioInput}
                            value={opt.val}
                            checked={form.comoConheceu === opt.val}
                            onChange={() => setForm(f => ({ ...f, comoConheceu: opt.val }))}
                          />
                          <span className={styles.radioCircle}></span>
                          {opt.label}
                        </label>
                      ))}
                      <label className={`${styles.radioLabelRow} ${form.comoConheceu === 'outro' ? styles.radioLabelRowActive : ''}`}>
                        <input
                          type="radio"
                          name="comoConheceu"
                          className={styles.radioInput}
                          value="outro"
                          checked={form.comoConheceu === 'outro'}
                          onChange={() => setForm(f => ({ ...f, comoConheceu: 'outro' }))}
                        />
                        <span className={styles.radioCircle}></span>
                        Outro:
                        <input
                          type="text"
                          className={styles.checkOtherInput}
                          placeholder="Especifique"
                          value={form.comoConheceuOutro}
                          onChange={e => setForm(f => ({ ...f, comoConheceuOutro: e.target.value }))}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── SECÇÃO 6 ── */}
                {currentStep === 6 && (
                  <div className={styles.formSection}>
                    <div className={styles.formSectionHeader}>
                      <span className={styles.formSectionNumber}>6</span>
                      <h3>Declaração</h3>
                    </div>
                    <div className={styles.declaracaoBox}>
                      <p>
                        Declaro que as informações prestadas neste inquérito são verdadeiras e completas, e que tomei conhecimento
                        dos <strong>Termos de Referência (TdR) do Clube dos Empreendedores</strong>, comprometendo-me a formalizar a minha adesão
                        através da assinatura do Contrato de Adesão e do pagamento da taxa de inscrição e quota correspondentes ao
                        nível seleccionado.
                      </p>
                    </div>
                    <div className={styles.formGrid2}>
                      <div className={styles.formField}>
                        <label htmlFor="localData">Local e data</label>
                        <input
                          id="localData"
                          type="text"
                          className={styles.formInput}
                          placeholder="Ex: Maputo, 30 de Julho de 2026"
                          value={form.localData}
                          onChange={e => setForm(f => ({ ...f, localData: e.target.value }))}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label htmlFor="assinatura">Assinatura do candidato (nome completo) <span className={styles.required}>*</span></label>
                        <input
                          id="assinatura"
                          type="text"
                          required
                          className={`${styles.formInput} ${styles.signatureInput}`}
                          placeholder="Escreva o seu nome como assinatura"
                          value={form.assinatura}
                          onChange={e => setForm(f => ({ ...f, assinatura: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className={styles.reservadoAbn}>
                      <span>📌 Espaço reservado à ABN</span>
                      <span>Nº de membro atribuído: ___________________________</span>
                    </div>
                  </div>
                )}

                {/* Wizard Navigation */}
                <div className={styles.wizardNavigation}>
                  {currentStep > 1 && (
                    <button type="button" className={styles.wizardBtn} onClick={handlePrevious}>
                      ← Anterior
                    </button>
                  )}
                  <button
                    type="submit"
                    className={styles.wizardBtn}
                    disabled={!canProceed()}
                  >
                    {currentStep === totalSteps ? 'Submeter Inquérito ✓' : 'Próximo →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
