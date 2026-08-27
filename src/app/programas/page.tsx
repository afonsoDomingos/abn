'use client';

import { useEffect, useState } from 'react';
import { getClubStepTitle } from '@/lib/clubUtils';
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
  declaracao?: string;
  customFields?: any[];
  adhesionLevels?: AdhesionLevel[];
}

interface AdhesionLevel {
  id: string;
  label: string;
  subLabel: string;
  inscriptionFee: number;
  annualQuota: number;
  showPeriodicity: boolean;
  required: boolean;
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
    investimento: `• Startups Incubadas do ABN Startup 180+: Gratuito ou incluído na mensalidade de incubação.

1. Participantes Individuais:
- Formação Intensiva (7 dias): 8.000 MT – 18.000 MT / participante
- Formação Completa (15 dias): 15.000 MT – 35.000 MT / participante
- Sessão de Coaching Individual (60–90 min): 2.000 MT – 5.000 MT
- Pacote de Coaching (6 sessões / trimestre): 10.000 MT – 25.000 MT
- Certificação em Soft Skills / Liderança: 8.000 MT – 20.000 MT

2. Empresas & Corporativo (Formação B2B - até 20 pessoas):
- Formação Intensiva de 7 dias (In-Company): 250.000 MT – 600.000 MT (pacote)
- Formação Completa de 15 dias (In-Company): 450.000 MT – 1.000.000 MT (pacote)
- Contratos Trimestrais ou Anuais de Acompanhamento: Valor negociado por contrato

3. Licenciamento da Metodologia:
- Licenciamento da Metodologia (por território/ano): 3.000 USD – 10.000 USD / ano`,
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
  telefonePagamento: string;
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
  nivelAdesao: '', formaPagamento: '', metodoPagamento: 'mpesa', telefonePagamento: '', comprovativoUrl: '',
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
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [respostasPersonalizadas, setRespostasPersonalizadas] = useState<Record<string, any>>({});
  const [form, setForm] = useState<InqueritorForm>(initialForm);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<{ tipoPagamento: string; comprovativoUrl?: string; telefonePagamento?: string; valorPago?: string } | null>(null);
  const [clubeExpanded, setClubeExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

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
      .catch(() => { });
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

  const calculateTotalValues = () => {
    // Caso seja um programa regular (ex: Mentalidade Empreendedora) e não o Clube
    if (selectedProgram && !selectedProgram.isClub) {
      let valorTotal = 0;
      let descricaoQuota = '';

      switch (form.nivelAdesao) {
        case 'formacao-7d':
          valorTotal = 8000;
          descricaoQuota = 'Formação Intensiva (7 dias)';
          break;
        case 'formacao-15d':
          valorTotal = 15000;
          descricaoQuota = 'Formação Completa (15 dias)';
          break;
        case 'coaching-individual':
          valorTotal = 2500;
          descricaoQuota = 'Sessão de Coaching Individual (60-90 min)';
          break;
        case 'coaching-pacote':
          valorTotal = 12000;
          descricaoQuota = 'Pacote Trimestral de Coaching (6 sessões)';
          break;
        case 'certificacao':
          valorTotal = 10000;
          descricaoQuota = 'Certificação em Soft Skills & Liderança';
          break;
        case 'corporativo-b2b':
          valorTotal = 0;
          descricaoQuota = 'Formação Corporativa B2B (Sob Consulta)';
          break;
        default:
          valorTotal = 8000;
          descricaoQuota = 'Formação Básica';
          break;
      }

      return {
        taxaInscricao: 0,
        valorQuotaBase: valorTotal,
        quotaCobrada: valorTotal,
        desconto: 0,
        valorTotal,
        descricaoQuota,
        periodoLabel: 'Inscrição na Formação / Pagamento Único',
      };
    }

    // Caso seja o Clube dos Empreendedores ABN ou programa com níveis customizados
    let taxaInscricao = 0;
    let valorQuotaBase = 0;
    let descricaoQuota = '';
    let showPeriodicity = true;

    // Verificar se existem níveis de adesão customizados
    if (selectedProgram?.adhesionLevels && selectedProgram.adhesionLevels.length > 0) {
      const customLevel = selectedProgram.adhesionLevels.find(level => level.id === form.nivelAdesao);
      if (customLevel) {
        taxaInscricao = customLevel.inscriptionFee;
        valorQuotaBase = customLevel.annualQuota;
        descricaoQuota = customLevel.label;
        showPeriodicity = customLevel.showPeriodicity;
      } else {
        // Fallback para padrão se não encontrar o nível
        taxaInscricao = 0;
        valorQuotaBase = 0;
        descricaoQuota = 'Nível não encontrado';
      }
    } else {
      // Sem níveis customizados configurados - sem opções disponíveis
      taxaInscricao = 0;
      valorQuotaBase = 0;
      descricaoQuota = 'Configure níveis de adesão no admin';
      showPeriodicity = false;
    }

    let quotaCobrada = 0;
    let desconto = 0;
    let periodoLabel = '';

    if (!showPeriodicity || valorQuotaBase === 0) {
      quotaCobrada = valorQuotaBase;
      periodoLabel = valorQuotaBase === 0 ? 'Isento / Sob Consulta' : 'Pagamento Único';
    } else if (form.formaPagamento === 'mensal') {
      quotaCobrada = Math.round(valorQuotaBase / 12);
      periodoLabel = 'Quota Mensal';
    } else if (form.formaPagamento === 'trimestral') {
      quotaCobrada = Math.round(valorQuotaBase / 4);
      periodoLabel = 'Quota Trimestral';
    } else {
      desconto = Math.round(valorQuotaBase * 0.10);
      quotaCobrada = valorQuotaBase - desconto;
      periodoLabel = 'Quota Anual (com 10% desc.)';
    }

    const valorTotal = taxaInscricao + quotaCobrada;

    return {
      taxaInscricao,
      valorQuotaBase,
      quotaCobrada,
      desconto,
      valorTotal,
      descricaoQuota,
      periodoLabel,
    };
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

    const calc = calculateTotalValues();
    const isManualProof = Boolean(form.comprovativoUrl && form.comprovativoUrl.trim() !== '');
    const tipoPagamento = isManualProof ? 'comprovativo_manual' : 'api_directo';
    const statusPagamento = isManualProof ? 'em_verificacao' : 'aguardando_pin';

    const payload = {
      ...form,
      programaId: selectedProgram?._id,
      programaTitulo: selectedProgram?.title || getClubStepTitle('Clube dos Empreendedores ABN'),
      respostasPersonalizadas,
      valorPago: `${calc.valorTotal} MT`,
      tipoPagamento,
      statusPagamento,
      origem: selectedProgram ? selectedProgram.title : 'programas',
    };

    try {
      console.log('Enviando formulário:', payload);
      const response = await fetch('/api/clube/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('Resposta da API:', data);
      if (data.success) {
        setLastSubmission({
          tipoPagamento,
          comprovativoUrl: form.comprovativoUrl,
          telefonePagamento: form.telefonePagamento,
          valorPago: `${calc.valorTotal} MT`,
        });
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
      const nomeValido = form.nomeCompleto.trim() !== '';
      const emailValido = form.email.trim() !== '' && form.email.includes('@');
      return nomeValido && emailValido;
    }
    if (currentStep === 3) {
      return form.nivelAdesao.trim() !== '';
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
    setSelectedProgram(null);
    setRespostasPersonalizadas({});
    setCurrentStep(1);
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
                    onClick={() => {
                      setSelectedProgram(clube);
                      // Use first custom level if available, otherwise empty
                      const firstLevel = clube.adhesionLevels && clube.adhesionLevels.length > 0 
                        ? clube.adhesionLevels[0].id 
                        : '';
                      setForm(f => ({ ...f, nivelAdesao: firstLevel }));
                      setShowInquerito(true);
                    }}
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
                        <Link
                          href={`/programas/${prog._id}`}
                          className={styles.shareLinkBtn}
                          title="Ver página do programa (link partilhável)"
                        >
                          🔗 Partilhar
                        </Link>
                        <button
                          className={styles.applyBtn}
                          onClick={() => {
                            setSelectedProgram(prog);
                            if (prog.isClub) {
                              // Use first custom level if available, otherwise empty
                              const firstLevel = prog.adhesionLevels && prog.adhesionLevels.length > 0 
                                ? prog.adhesionLevels[0].id 
                                : '';
                              setForm(f => ({ ...f, nivelAdesao: firstLevel }));
                            } else {
                              setForm(f => ({ ...f, nivelAdesao: 'formacao-7d' }));
                            }
                            setShowInquerito(true);
                          }}
                        >
                          Candidatar-me
                        </button>
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
                <span className={styles.modalHeaderIcon}>
                  {submitted && lastSubmission?.tipoPagamento === 'api_directo' ? '📱' : '🏛️'}
                </span>
                <div>
                  <h2 className={styles.modalTitle}>
                    {submitted && lastSubmission?.tipoPagamento === 'api_directo'
                      ? 'Autorização de Pagamento Móvel'
                      : 'Inquérito de Inscrição'}
                  </h2>
                  <p className={styles.modalSubtitle}>
                    {submitted && lastSubmission?.tipoPagamento === 'api_directo'
                      ? 'Confirmação com PIN no telemóvel M-Pesa / eMola'
                      : `${getClubStepTitle(selectedProgram?.title || 'Clube dos Empreendedores ABN')} — ABN | AfroBiz Network`}
                  </p>
                </div>
              </div>
              <button className={styles.modalClose} onClick={closeModal} aria-label="Fechar">✕</button>
            </div>

            {submitted ? (
              <div className={styles.successState}>
                {lastSubmission?.tipoPagamento === 'comprovativo_manual' ? (
                  <>
                    <div className={styles.successIcon} style={{ background: '#fef3c7', color: '#d97706', border: '2px solid #f59e0b' }}>⏳</div>
                    <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 800, padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', display: 'inline-block', marginBottom: '0.75rem' }}>
                      Comprovativo Recebido — Aguardando Aprovação Manual
                    </span>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Candidatura em Verificação!</h3>
                    <p style={{ margin: '0 0 1rem 0', color: '#334155', lineHeight: '1.6' }}>
                      Obrigado, <strong>{form.nomeCompleto || 'candidato'}</strong>. O seu comprovativo de pagamento no valor de <strong>{lastSubmission.valorPago}</strong> foi recebido com sucesso.
                      A equipa ABN irá analisar o comprovativo e aprovar a sua adesão brevemente.
                    </p>

                    {/* Preview Visual do Comprovativo Anexado */}
                    {lastSubmission.comprovativoUrl && (
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem' }}>
                          📄 Comprovativo Anexado pelo Candidato:
                        </span>
                        {lastSubmission.comprovativoUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                          <img
                            src={lastSubmission.comprovativoUrl}
                            alt="Comprovativo anexado"
                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #cbd5e1', background: '#fff' }}
                          />
                        ) : (
                          <a
                            href={lastSubmission.comprovativoUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ff6b00', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}
                          >
                            📄 Visualizar Documento Anexado
                          </a>
                        )}
                      </div>
                    )}

                    <p className={styles.successNote}>
                      Os dados fornecidos são tratados exclusivamente para fins de gestão da sua {selectedProgram?.isClub ? `adesão ao ${getClubStepTitle(selectedProgram?.title || 'Clube dos Empreendedores ABN')}` : 'candidatura ao ' + selectedProgram?.title}, nos termos da Cláusula de Protecção de Dados.
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
                  </>
                ) : (
                  /* ── COMPACT MOBILE PIN POPUP DIALOG ── */
                  <div style={{ maxWidth: '440px', margin: '0 auto', padding: '0.5rem 0', textAlign: 'center' }}>
                    {/* Live Mobile Push Payment Icon with Pulse Indicator */}
                    <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', borderRadius: '50%', border: '2px solid #3b82f6', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)' }}>
                      <span style={{ fontSize: '2.2rem' }}>📱</span>
                      <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', background: '#10b981', borderRadius: '50%', border: '2px solid #ffffff' }} />
                    </div>

                    <span style={{ background: '#dbeafe', color: '#1e40af', fontWeight: 800, padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📲 Pedido de PIN Enviado ao Telemóvel
                    </span>

                    <h3 style={{ margin: '0.9rem 0 0.3rem 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                      Confirme no seu Telemóvel!
                    </h3>

                    <p style={{ margin: '0 0 1.25rem 0', color: '#475569', fontSize: '0.88rem', lineHeight: '1.5' }}>
                      Enviámos o pedido de débito referente à candidatura de <strong>{form.nomeCompleto || 'candidato'}</strong>.
                    </p>

                    {/* Compact Payment Box */}
                    <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem' }}>
                        Valor Solicitado
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ff6b00', letterSpacing: '-0.5px' }}>
                        {lastSubmission?.valorPago}
                      </div>
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.88rem', color: '#1e293b', fontWeight: 700 }}>
                        📱 Telemóvel: <span style={{ color: '#2563eb', fontWeight: 800 }}>{lastSubmission?.telefonePagamento || form.telefonePagamento || 'Registado'}</span>
                      </div>
                    </div>

                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1.5rem', color: '#1e40af', fontSize: '0.85rem', lineHeight: '1.5', textAlign: 'left' }}>
                      💡 <strong>Menu no Telemóvel:</strong> Surgirá um pop-up no seu ecrã para introduzir o seu <strong>PIN M-Pesa / eMola</strong> e autorizar.
                    </div>

                    {/* Action Buttons: Confirm or Cancel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={closeModal}
                        style={{ width: '100%', padding: '12px 18px', borderRadius: '10px', background: '#22c55e', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)', transition: 'all 0.2s' }}
                      >
                        ✓ Já Introduzi o PIN no Telemóvel
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setCurrentStep(7);
                        }}
                        style={{ width: '100%', padding: '10px 18px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        ✕ Cancelar Operação / Alterar Método
                      </button>
                    </div>
                  </div>
                )}
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
                          {i + 1 === 7 && 'Checkout 💳'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
                  </div>
                </div>

                <p className={styles.formIntro}>
                  {currentStep === 1 && `Preencha os campos abaixo. Os dados fornecidos serão utilizados exclusivamente para fins de gestão da sua ${selectedProgram?.isClub ? `adesão ao ${getClubStepTitle(selectedProgram?.title || 'Clube dos Empreendedores ABN')}` : 'candidatura ao ' + selectedProgram?.title}.`}
                  {currentStep === 2 && 'Informações sobre o seu negócio ou actividade (opcional).'}
                  {currentStep === 3 && selectedProgram?.isClub ? 'Seleccione o nível de adesão pretendido e a periodicidade da quota.' : 'Seleccione a modalidade de participação pretendida.'}
                  {currentStep === 4 && selectedProgram?.isClub ? 'Seleccione as áreas de interesse (pode seleccionar múltiplas).' : 'Responda às perguntas personalizadas do programa.'}
                  {currentStep === 5 && selectedProgram?.isClub ? `Como conheceu o ${getClubStepTitle(selectedProgram?.title || 'Clube dos Empreendedores ABN')}?` : ''}
                  {currentStep === 6 && 'Revise a declaração e assine para avançar para o checkout de pagamento.'}
                  {currentStep === 7 && 'Revise os seus dados, confira os valores calculados automaticamente e selecione a forma de pagamento para concluir.'}
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
                      <h3>
                        {selectedProgram && !selectedProgram.isClub
                          ? `Modalidade de Formação / Participação (${selectedProgram.title})`
                          : 'Nível de Adesão Pretendido'}
                      </h3>
                    </div>
                    <div className={styles.formField}>
                      <div className={styles.radioGroup}>
                        {(selectedProgram && !selectedProgram.isClub
                          ? [
                            { val: 'formacao-7d', label: 'Formação Intensiva (7 dias)', sub: 'Mindset & Soft Skills | 8.000 MT – 18.000 MT' },
                            { val: 'formacao-15d', label: 'Formação Completa (15 dias)', sub: 'Desenvolvimento Comportamental | 15.000 MT – 35.000 MT' },
                            { val: 'coaching-individual', label: 'Sessão de Coaching Individual (60–90 min)', sub: '2.500 MT / sessão' },
                            { val: 'coaching-pacote', label: 'Pacote Trimestral de Coaching (6 sessões)', sub: '12.000 MT / pacote' },
                            { val: 'certificacao', label: 'Certificação em Soft Skills & Liderança', sub: '10.000 MT' },
                            { val: 'corporativo-b2b', label: 'Formação Corporativa B2B (In-Company / Equipa)', sub: 'Pacote sob consulta com a Direcção ABN' },
                          ]
                          : selectedProgram?.adhesionLevels && selectedProgram.adhesionLevels.length > 0
                            ? selectedProgram.adhesionLevels.map(level => ({
                                val: level.id,
                                label: level.label,
                                sub: level.subLabel || `Inscrição ${level.inscriptionFee} MT | Quota anual ${level.annualQuota} MT`
                              }))
                            : []
                        ).map(opt => (
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

                    {(!selectedProgram || selectedProgram.isClub) && (() => {
                      // Verificar se o nível selecionado tem periodicidade configurada
                      let showPeriodicity = true;
                      if (selectedProgram?.adhesionLevels && selectedProgram.adhesionLevels.length > 0) {
                        const selectedLevel = selectedProgram.adhesionLevels.find(level => level.id === form.nivelAdesao);
                        if (selectedLevel) {
                          showPeriodicity = selectedLevel.showPeriodicity;
                        }
                      }
                      
                      return showPeriodicity ? (
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
                      ) : null;
                    })()}
                  </div>
                )}

                {/* ── SECÇÃO 4 ── */}
                {currentStep === 4 && (
                  <div className={styles.formSection}>
                    <div className={styles.formSectionHeader}>
                      <span className={styles.formSectionNumber}>4</span>
                      <h3>Áreas de Interesse &amp; Inquérito {selectedProgram ? `— ${selectedProgram.title}` : ''}</h3>
                    </div>

                    {/* Pergunta(s) Personalizada(s) do Programa se existirem */}
                    {selectedProgram?.customFields && selectedProgram.customFields.length > 0 && (
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ff6b00', textTransform: 'uppercase' }}>
                          📋 Pergunta(s) Personalizada(s) do Programa
                        </div>
                        {selectedProgram.customFields.map((field: any) => (
                          <div key={field.id} className={styles.formField}>
                            <label style={{ color: '#0f172a', fontWeight: 700 }}>
                              {field.label} {field.required && <span className={styles.required}>*</span>}
                            </label>

                            {field.type === 'text' && (
                              <input
                                type="text"
                                className={styles.formInput}
                                required={field.required}
                                placeholder={field.placeholder || ''}
                                value={respostasPersonalizadas[field.label] || ''}
                                onChange={e => setRespostasPersonalizadas({ ...respostasPersonalizadas, [field.label]: e.target.value })}
                              />
                            )}

                            {field.type === 'textarea' && (
                              <textarea
                                rows={3}
                                className={styles.formInput}
                                required={field.required}
                                placeholder={field.placeholder || ''}
                                value={respostasPersonalizadas[field.label] || ''}
                                onChange={e => setRespostasPersonalizadas({ ...respostasPersonalizadas, [field.label]: e.target.value })}
                              />
                            )}

                            {field.type === 'select' && (
                              <select
                                className={styles.formInput}
                                required={field.required}
                                value={respostasPersonalizadas[field.label] || ''}
                                onChange={e => setRespostasPersonalizadas({ ...respostasPersonalizadas, [field.label]: e.target.value })}
                              >
                                <option value="">Selecione uma opção...</option>
                                {field.options?.map((opt: string) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            )}

                            {field.type === 'checkbox' && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                                {field.options?.map((opt: string) => {
                                  const currentArr = Array.isArray(respostasPersonalizadas[field.label]) ? respostasPersonalizadas[field.label] : [];
                                  const isChecked = currentArr.includes(opt);
                                  return (
                                    <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer', background: '#fff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          const nextArr = isChecked ? currentArr.filter((item: string) => item !== opt) : [...currentArr, opt];
                                          setRespostasPersonalizadas({ ...respostasPersonalizadas, [field.label]: nextArr });
                                        }}
                                      />
                                      {opt}
                                    </label>
                                  );
                                })}
                              </div>
                            )}

                            {field.type === 'file' && (
                              <input
                                type="file"
                                className={styles.formInput}
                                required={field.required}
                                onChange={async e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    try {
                                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                      const data = await res.json();
                                      if (data.success && data.url) {
                                        setRespostasPersonalizadas({ ...respostasPersonalizadas, [field.label]: data.url });
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Áreas de Interesse - apenas para clubes */}
                    {selectedProgram?.isClub && (
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
                    )}
                  </div>
                )}

                {/* ── SECÇÃO 5 ── */}
                {currentStep === 5 && selectedProgram?.isClub && (
                  <div className={styles.formSection}>
                    <div className={styles.formSectionHeader}>
                      <span className={styles.formSectionNumber}>5</span>
                      <h3>Como conheceu o {getClubStepTitle(selectedProgram?.title || 'Clube dos Empreendedores ABN')}?</h3>
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
                        {selectedProgram?.declaracao || (
                          selectedProgram?.isClub ? (
                            <>
                              Declaro que as informações prestadas neste inquérito são verdadeiras e completas, e que tomei conhecimento
                              dos <strong>Termos de Referência (TdR) do {getClubStepTitle(selectedProgram?.title || 'Clube dos Empreendedores ABN')}</strong>, comprometendo-me a formalizar a minha adesão
                              através da assinatura do Contrato de Adesão e do pagamento da taxa de inscrição e quota correspondentes ao
                              nível seleccionado.
                            </>
                          ) : (
                            <>
                              Declaro que as informações prestadas neste inquérito são verdadeiras e completas, e que tomei conhecimento
                              dos <strong>Termos e Condições do Programa {selectedProgram?.title}</strong>, comprometendo-me a cumprir
                              com os requisitos e obrigações estabelecidos.
                            </>
                          )
                        )}
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
                    {selectedProgram?.isClub && (
                      <div className={styles.reservadoAbn}>
                        <span>📌 Espaço reservado à ABN</span>
                        <span>Nº de membro atribuído: ___________________________</span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── SECÇÃO 7: CHECKOUT FINAL & PAGAMENTO ── */}
                {currentStep === 7 && (() => {
                  const calc = calculateTotalValues();
                  return (
                    <div className={styles.formSection}>
                      <div className={styles.formSectionHeader}>
                        <span className={styles.formSectionNumber}>7</span>
                        <h3>Resumo da Candidatura &amp; Checkout de Pagamento 💳</h3>
                      </div>

                      {/* Quadro de Resumo dos Dados Captados com opção de Retificar */}
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>📋 Resumo das Informações Preenchidas</h4>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Clique em retificar se necessitar corrigir algum dado</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', fontSize: '0.88rem' }}>
                          <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <strong style={{ color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>1. Identificação</strong>
                              <button type="button" onClick={() => setCurrentStep(1)} style={{ border: 'none', background: 'none', color: '#ff6b00', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>✏️ Retificar</button>
                            </div>
                            <p style={{ margin: '0 0 0.2rem 0', fontWeight: 700, color: '#0f172a' }}>{form.nomeCompleto || 'N/A'}</p>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>{form.email}</p>
                          </div>

                          <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <strong style={{ color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>2. Negócio</strong>
                              <button type="button" onClick={() => setCurrentStep(2)} style={{ border: 'none', background: 'none', color: '#ff6b00', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>✏️ Retificar</button>
                            </div>
                            <p style={{ margin: '0 0 0.2rem 0', fontWeight: 700, color: '#0f172a' }}>{form.nomeNegocio || 'Não especificado'}</p>
                            {form.sector.length > 0 && <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>{form.sector.filter(s => s !== 'outro').join(', ')}</p>}
                          </div>

                          <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <strong style={{ color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>3. Adesão Escolhida</strong>
                              <button type="button" onClick={() => setCurrentStep(3)} style={{ border: 'none', background: 'none', color: '#ff6b00', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>✏️ Retificar</button>
                            </div>
                            <p style={{ margin: '0 0 0.2rem 0', fontWeight: 700, color: '#0f172a' }}>{calc.descricaoQuota}</p>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem', textTransform: 'capitalize' }}>Periodicidade: {form.formaPagamento || 'Anual'}</p>
                          </div>

                          <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <strong style={{ color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>6. Assinatura</strong>
                              <button type="button" onClick={() => setCurrentStep(6)} style={{ border: 'none', background: 'none', color: '#ff6b00', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>✏️ Retificar</button>
                            </div>
                            <p style={{ margin: '0 0 0.2rem 0', fontWeight: 700, color: '#d4af37', fontStyle: 'italic' }}>{form.assinatura}</p>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>{form.localData || 'Hoje'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quadro de Cálculo Automático de Valores */}
                      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, color: '#d4af37', fontSize: '1.1rem', fontWeight: 800 }}>💰 Cálculo Automático de Valores</h4>
                          <span style={{ fontSize: '0.8rem', background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>{calc.descricaoQuota}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                            <span>Taxa de Inscrição no Clube / Programa:</span>
                            <strong>{calc.taxaInscricao.toLocaleString('pt-PT')} MT</strong>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                            <span>{calc.periodoLabel}:</span>
                            <strong>{calc.quotaCobrada.toLocaleString('pt-PT')} MT</strong>
                          </div>

                          {calc.desconto > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700 }}>
                              <span>Desconto de Pagamento Anual (10%):</span>
                              <span>-{calc.desconto.toLocaleString('pt-PT')} MT</span>
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '2px solid rgba(255,107,0,0.5)', fontSize: '1.25rem', fontWeight: 900, color: '#ff6b00' }}>
                            <span>TOTAL A PAGAR:</span>
                            <span style={{ fontSize: '1.4rem', textShadow: '0 2px 10px rgba(255,107,0,0.3)' }}>{calc.valorTotal.toLocaleString('pt-PT')} MT</span>
                          </div>
                        </div>
                      </div>

                      {/* Checkout de Pagamento (Métodos & Upload) */}
                      <div className={styles.formField}>
                        <label style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ff6b00', display: 'block', marginBottom: '0.5rem' }}>
                          💳 Escolha a Forma de Pagamento
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

                      <div style={{ marginTop: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: 800 }}>
                          📌 Instruções de Pagamento ({form.metodoPagamento.toUpperCase()})
                        </h4>

                        {form.metodoPagamento === 'mpesa' && (
                          <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                            <p style={{ margin: '0 0 0.3rem 0', fontWeight: 700, color: '#0f172a' }}>📱 Pagamento via M-Pesa:</p>
                            <p style={{ margin: 0 }}><strong>Número M-Pesa:</strong> 857670109</p>
                            <p style={{ margin: 0 }}><strong>Titular:</strong> Lizi Cristina Mulambo</p>
                            <small style={{ color: '#64748b', display: 'block', marginTop: '0.2rem' }}>Pode efetuar a transferência direta para o número acima ou inserir o seu número abaixo para solicitação.</small>
                          </div>
                        )}
                        {form.metodoPagamento === 'emola' && (
                          <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                            <p style={{ margin: '0 0 0.3rem 0', fontWeight: 700, color: '#0f172a' }}>📱 Pagamento via e-Mola:</p>
                            <p style={{ margin: 0 }}><strong>Número e-Mola:</strong> 876687082</p>
                            <p style={{ margin: 0 }}><strong>Titular:</strong> Lizi Cristina Mulambo</p>
                            <small style={{ color: '#64748b', display: 'block', marginTop: '0.2rem' }}>Pode efetuar a transferência direta para o número acima ou inserir o seu número abaixo para solicitação.</small>
                          </div>
                        )}
                        {form.metodoPagamento === 'cartao' && (
                          <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                            <p style={{ margin: 0 }}>Pagamento por Cartão de Débito/Crédito. A nossa equipa disponibilizará o link de checkout seguro após o envio do formulário.</p>
                          </div>
                        )}
                        {form.metodoPagamento === 'banco' && (
                          <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>🏛️ Dados para Transferência Bancária (Titular: Lizi Cristina Mulambo):</p>
                            <div style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                              <div><strong>Millennium BIM:</strong> Conta 5283397 | NIB 0001 000000005283397 57</div>
                            </div>
                            <div style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                              <div><strong>Moza Banco:</strong> Conta 0087656640001 | NIB 0034 000008765664101 25</div>
                            </div>
                          </div>
                        )}

                        {(form.metodoPagamento === 'mpesa' || form.metodoPagamento === 'emola') && (
                          <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #e2e8f0' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>
                              📱 Número de Telemóvel ({form.metodoPagamento.toUpperCase()}) para Débito &amp; Confirmação de PIN:
                            </label>
                            <input
                              type="tel"
                              placeholder="Ex: 841234567 ou 861234567"
                              value={form.telefonePagamento}
                              onChange={e => setForm(f => ({ ...f, telefonePagamento: e.target.value }))}
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#ffffff', color: '#0f172a' }}
                            />
                            <small style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
                              💡 Insira o seu número registado no {form.metodoPagamento === 'mpesa' ? 'M-Pesa' : 'eMola'} para onde será enviado o pedido de pagamento para confirmação com PIN.
                            </small>
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
                  );
                })()}

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
                    {currentStep === totalSteps ? 'Finalizar Candidatura 💳' : 'Próximo →'}
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
