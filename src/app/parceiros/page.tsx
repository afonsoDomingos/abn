'use client';

import Navbar from "@/components/Navbar";
import styles from "./Parceiros.module.css";
import { useLanguage } from "@/lib/LanguageContext";
import Link from 'next/link';
import { useState } from 'react';

export default function Parceiros() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'institutional' | 'individual'>('institutional');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'institucional', // 'institucional' | 'individual'
    category: 'estratego',
    org: '',
    msg: ''
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const partnersLogos = [
    { name: 'African Union', logo: '🌍' },
    { name: 'AfDB', logo: '🏦' },
    { name: 'UNDP', logo: '🇺🇳' },
    { name: 'TechHub Luanda', logo: '💻' },
    { name: 'Startup Moçambique', logo: '🚀' },
    { name: 'Global Invest', logo: '📈' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.msg || !formData.org) {
      setErrorMsg(language === 'pt' ? 'Por favor, preencha todos os campos obrigatórios.' : 'Please fill in all required fields.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    // Format the message body to contain the partnership details
    const formattedMessage = `[CANDIDATURA A PARCEIRO ABN]
Tipo de Parceria: ${formData.type === 'institucional' ? 'Institucional' : 'Individual'}
Categoria pretendida: ${formData.category}
Organização / Cargo ou Profissão: ${formData.org}

Mensagem de Motivação:
${formData.msg}`;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formattedMessage
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        setFormData({
          name: '',
          email: '',
          type: 'institucional',
          category: 'estratego',
          org: '',
          msg: ''
        });
        setTimeout(() => {
          setSent(false);
        }, 5000);
      } else {
        setErrorMsg(data.error || (language === 'pt' ? 'Erro ao submeter a candidatura.' : 'Error submitting application.'));
      }
    } catch (err) {
      setErrorMsg(language === 'pt' ? 'Erro de conexão. Tente novamente.' : 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Content dictionaries for PT and EN
  const content = {
    pt: {
      badge: "ABN PARTNERS",
      title: "Torne-se Parceiro",
      introSub: "O futuro dos negócios em África constrói-se em rede. Faça parte dessa transformação.",
      introP1: "Na ABN – AfroBiz Network, não procuramos apenas parceiros. Procuramos organizações e profissionais que desejam deixar um legado, impulsionar o crescimento de empresas, criar oportunidades e contribuir para uma África mais inovadora, competitiva e próspera.",
      introP2: "Ao tornar-se parceiro da ABN, passa a integrar uma comunidade internacional que liga empreendedores, investidores, universidades, empresas, governos, especialistas e organizações comprometidas com a criação de impacto económico e social.",
      introP3: "Mais do que uma parceria, oferecemos um ecossistema de oportunidades.",
      
      whyTitle: "Por que tornar-se parceiro da ABN?",
      whySubtitle: "Ao integrar a nossa rede, a sua organização ou o seu perfil profissional poderá:",
      benefits: [
        { icon: "🌐", title: "Expansão de Rede", desc: "Expandir a sua rede de contactos em vários países africanos e da diáspora." },
        { icon: "📢", title: "Visibilidade de Marca", desc: "Aumentar a visibilidade e autoridade da sua marca ou carreira no ecossistema." },
        { icon: "🚀", title: "Projetos de Impacto", desc: "Desenvolver e colaborar em projetos de elevado impacto socioeconómico." },
        { icon: "🔍", title: "Novas Oportunidades", desc: "Identificar novos clientes, fornecedores, parceiros e potenciais investidores." },
        { icon: "📅", title: "Programas Exclusivos", desc: "Participar em conferências, feiras, missões empresariais e programas fechados." },
        { icon: "🌱", title: "Fomento de Empreendedorismo", desc: "Contribuir activamente para o fortalecimento do empreendedorismo em África." },
        { icon: "🏆", title: "Posicionamento Setorial", desc: "Posicionar-se como uma autoridade e referência no seu setor de atuação." },
        { icon: "🤝", title: "Colaboração Global", desc: "Colaborar de perto com especialistas nacionais e internacionais de topo." },
        { icon: "💡", title: "Soluções Reais", desc: "Participar ativamente na construção de soluções para os desafios reais do continente." }
      ],

      whoTitle: "Quem Pode Tornar-se Parceiro?",
      tabInst: "Parceiros Institucionais",
      tabIndiv: "Parceiros Individuais",

      instSub: "Se representa uma organização que acredita na colaboração como motor do desenvolvimento, a ABN é o espaço ideal para criar impacto.",
      instChipsTitle: "Podem candidatar-se organizações como:",
      instChips: [
        "Empresas", "Startups", "Bancos & Inst. Financeiras", "Universidades", "Instituições de Ensino",
        "Incubadoras & Aceleradoras", "ONGs / Sociedade Civil", "Fundações", "Agências de Cooperação",
        "Organismos Públicos", "Câmaras de Comércio", "Associações Empresariais", "Organizações Internacionais"
      ],
      instCategoriesTitle: "Categorias de Parceria Institucional",
      instCategories: [
        { icon: "🏦", title: "Parceiro Bancário", desc: "Apoia o acesso ao financiamento, educação financeira, soluções bancárias e inclusão financeira." },
        { icon: "🎓", title: "Parceiro Académico", desc: "Promove investigação, formação, estágios, inovação e aproxima a academia do mercado real." },
        { icon: "🎯", title: "Parceiro Estratégico", desc: "Participa ativamente na conceção e implementação de programas estruturantes para o ecossistema." },
        { icon: "💰", title: "Parceiro Financeiro", desc: "Investe em programas, fundos, eventos e iniciativas que aceleram o ecossistema empreendedor." },
        { icon: "🛠️", title: "Parceiro Técnico", desc: "Disponibiliza conhecimento especializado, mentoria corporativa, consultoria e assistência técnica." },
        { icon: "💻", title: "Parceiro Tecnológico", desc: "Fornece infraestruturas, ferramentas digitais, inovação e soluções tecnológicas para PMEs." },
        { icon: "💼", title: "Parceiro Comercial", desc: "Cria oportunidades de mercado, benefícios comerciais cruzados e ligações empresariais diretas." },
        { icon: "📣", title: "Comunicação e Media", desc: "Amplifica o impacto e visibilidade das iniciativas da ABN através da comunicação e divulgação nos media." },
        { icon: "🌍", title: "Parceiro Internacional", desc: "Fortalece a cooperação bilateral, promove intercâmbios internacionais e acelera a internacionalização." }
      ],
      instReceiveTitle: "O que as organizações recebem",
      instExpectTitle: "O que esperamos das organizações",
      instReceive: [
        "Reconhecimento oficial como Parceiro ABN",
        "Perfil institucional destacado no nosso website",
        "Divulgação permanente nos canais oficiais da ABN",
        "Participação co-organizada em projetos estratégicos",
        "Prioridade em oportunidades de cooperação e inovação",
        "Acesso prioritário ao diretório e ecossistema ABN",
        "Convites VIP para conferências e eventos exclusivos",
        "Certificado oficial e selo digital de parceria",
        "Relatórios de impacto e visibilidade institucional anual"
      ],
      instExpect: [
        "Apoio financeiro ou patrocínio de programas",
        "Apoio técnico especializado ou partilha de dados",
        "Facilitação de formações e workshops práticos",
        "Mentoria empresarial ou acompanhamento de PMEs",
        "Cedência de tecnologia ou licenças de software",
        "Disponibilização de espaços para incubação e eventos",
        "Apoio com equipamentos ou ferramentas logísticas",
        "Divulgação partilhada das iniciativas em conjunto",
        "Desenvolvimento conjunto de novos programas e projetos",
        "Mobilização de peritos da sua rede corporativa"
      ],

      indivSub: "O crescimento do empreendedorismo também depende das pessoas. Se possui experiência, conhecimento ou uma rede de contactos relevante, a ABN oferece um espaço para gerar impacto.",
      indivChipsTitle: "Procuramos profissionais e especialistas como:",
      indivChips: [
        "Empreendedores", "Mentores", "Consultores", "Formadores", "Executivos", "Investidores",
        "Advogados", "Contabilistas", "Especialistas em Marketing", "Especialistas em Tecnologia",
        "Recursos Humanos", "Investigadores", "Coaches", "Profissionais Liberais", "Especialistas em Inovação"
      ],
      indivReceiveTitle: "O que ganha como Especialista",
      indivExpectTitle: "Como pode contribuir para o ecossistema",
      indivReceive: [
        "Integração na Rede Oficial de Especialistas da ABN",
        "Perfil profissional indexado no Diretório de Especialistas",
        "Oportunidades de consultoria remunerada e mentoria de topo",
        "Participação activa em projetos nacionais e internacionais",
        "Convites para networking fechado com líderes e investidores",
        "Certificado Oficial de Especialista Parceiro",
        "Maior visibilidade da sua carreira e marca pessoal",
        "Acesso à rede internacional de profissionais e empreendedores"
      ],
      indivExpect: [
        "Partilhando conhecimento prático com a comunidade",
        "Prestando consultoria ou assessoria a startups",
        "Realizando sessões de mentoria a jovens fundadores",
        "Ministrando formações ou masterclasses de especialidade",
        "Apoio no desenvolvimento de projetos de impacto local",
        "Apoio direto na capacitação de startups e PMEs",
        "Promovendo inovação aberta e partilha de boas práticas"
      ],

      howTitle: "Como Tornar-se Parceiro?",
      steps: [
        { title: "Candidatura", desc: "Submeta a sua candidatura através do nosso formulário online." },
        { title: "Avaliação Técnica", desc: "A nossa equipa realiza uma avaliação do seu perfil ou organização." },
        { title: "Alinhamento", desc: "Realizamos uma reunião para identificar as melhores oportunidades." },
        { title: "Aprovação", desc: "Aprovação formal do modelo de parceria definido." },
        { title: "Acordo / MoU", desc: "Assinatura do Acordo ou Memorando de Entendimento mútuo." },
        { title: "Integração Oficial", desc: "Início oficial das atividades e visibilidade na nossa rede." }
      ],

      closingTitle: "Uma Parceria Baseada em Valor",
      closingText: "Na ABN acreditamos que uma parceria só é bem-sucedida quando todas as partes crescem juntas. Por isso, cada colaboração é construída com objetivos claros, benefícios mútuos, responsabilidades definidas e foco em resultados mensuráveis. Não importa a dimensão da sua organização ou a etapa da sua carreira. Se partilha da nossa visão de fortalecer o empreendedorismo africano através da colaboração, inovação e criação de oportunidades, existe um lugar para si na ABN.",
      closingBtn: "Preencher Candidatura",

      formTitle: "Formulário de Candidatura",
      formSub: "Preencha os seus dados abaixo e selecione a categoria de parceria de interesse para iniciar o processo.",
      formName: "Nome Completo / Representante",
      formEmail: "Endereço de E-mail",
      formType: "Tipo de Parceiro",
      formTypeInst: "Organização / Instituição",
      formTypeIndiv: "Profissional Individual / Especialista",
      formCategory: "Categoria de Parceria",
      formOrgInst: "Nome da Organização / Empresa",
      formOrgIndiv: "Profissão / Área de Especialidade",
      formMsg: "Mensagem de Motivação",
      formMsgPlaceholder: "Explique brevemente por que gostaria de se associar à ABN e como pretende contribuir...",
      formBtnSubmit: "Submeter Candidatura",
      formBtnSending: "A enviar...",
      formBtnSuccess: "Candidatura enviada com sucesso!"
    },
    en: {
      badge: "ABN PARTNERS",
      title: "Become a Partner",
      introSub: "The future of business in Africa is built in networks. Be part of this transformation.",
      introP1: "At ABN – AfroBiz Network, we don't just look for partners. We look for organizations and professionals who wish to leave a legacy, boost business growth, create opportunities, and contribute to a more innovative, competitive, and prosperous Africa.",
      introP2: "By becoming an ABN partner, you join an international community that connects entrepreneurs, investors, universities, companies, governments, experts, and organizations committed to creating economic and social impact.",
      introP3: "More than a partnership, we offer an ecosystem of opportunities.",
      
      whyTitle: "Why become an ABN partner?",
      whySubtitle: "By joining our network, your organization or professional profile will be able to:",
      benefits: [
        { icon: "🌐", title: "Network Expansion", desc: "Expand your contact network across multiple African countries and the diaspora." },
        { icon: "📢", title: "Brand Visibility", desc: "Increase the visibility and authority of your brand or career in the ecosystem." },
        { icon: "🚀", title: "Impact Projects", desc: "Develop and collaborate on high socio-economic impact projects." },
        { icon: "🔍", title: "New Opportunities", desc: "Identify new clients, suppliers, partners, and potential investors." },
        { icon: "📅", title: "Exclusive Programs", desc: "Participate in conferences, trade fairs, business missions, and closed programs." },
        { icon: "🌱", title: "Foster Entrepreneurship", desc: "Actively contribute to strengthening entrepreneurship across Africa." },
        { icon: "🏆", title: "Sectored Positioning", desc: "Position yourself as an authority and reference in your field of work." },
        { icon: "🤝", title: "Global Collaboration", desc: "Collaborate closely with top national and international experts." },
        { icon: "💡", title: "Real Solutions", desc: "Actively participate in building solutions for the continent's real challenges." }
      ],

      whoTitle: "Who Can Become a Partner?",
      tabInst: "Institutional Partners",
      tabIndiv: "Individual Partners",

      instSub: "If you represent an organization that believes in collaboration as a engine of development, ABN is the ideal space to create impact.",
      instChipsTitle: "Organizations that can apply include:",
      instChips: [
        "Companies", "Startups", "Banks & Fin. Institutions", "Universities", "Education Institutions",
        "Incubators & Accelerators", "NGOs / Civil Society", "Foundations", "Cooperation Agencies",
        "Public Bodies", "Chambers of Commerce", "Business Associations", "International Organizations"
      ],
      instCategoriesTitle: "Institutional Partnership Categories",
      instCategories: [
        { icon: "🏦", title: "Banking Partner", desc: "Supports access to finance, financial education, banking solutions, and inclusion." },
        { icon: "🎓", title: "Academic Partner", desc: "Promotes research, training, internships, innovation, and connects academia to the real market." },
        { icon: "🎯", title: "Strategic Partner", desc: "Actively participates in designing and implementing ecosystem programs." },
        { icon: "💰", title: "Financial Partner", desc: "Invests in programs, funds, events, and initiatives that accelerate entrepreneurship." },
        { icon: "🛠️", title: "Technical Partner", desc: "Provides specialized knowledge, corporate mentoring, consulting, and technical assistance." },
        { icon: "💻", title: "Technological Partner", desc: "Supplies infrastructures, digital tools, innovation, and technological solutions for SMEs." },
        { icon: "💼", title: "Commercial Partner", desc: "Creates market opportunities, cross-business benefits, and direct business connections." },
        { icon: "📣", title: "Media Partner", desc: "Amplifies the impact and visibility of ABN initiatives through media coverage and PR." },
        { icon: "🌍", title: "International Partner", desc: "Strengthens bilateral cooperation, promotes international exchanges, and accelerates expansion." }
      ],
      instReceiveTitle: "What organizations receive",
      instExpectTitle: "What we expect from organizations",
      instReceive: [
        "Official recognition as an ABN Partner",
        "Highlighted institutional profile on our website",
        "Permanent promotion across ABN official channels",
        "Co-organized participation in strategic projects",
        "Priority in cooperation and innovation opportunities",
        "Priority access to the ABN directory and ecosystem",
        "VIP invitations to conferences and exclusive events",
        "Official certificate and partnership digital badge",
        "Annual institutional visibility and impact reports"
      ],
      instExpect: [
        "Financial support or sponsorship of key programs",
        "Specialized technical support or data sharing",
        "Facilitating training workshops and masterclasses",
        "Corporate mentoring or coaching of SMEs",
        "Provision of technology or software licenses",
        "Providing physical spaces for incubation and events",
        "Support with equipment or logistical tools",
        "Joint promotion of co-branded initiatives",
        "Co-development of new programs and structures",
        "Mobilizing corporate experts from your network"
      ],

      indivSub: "Entrepreneurship growth also depends on people. If you have experience, knowledge, or a relevant network, ABN offers a space to generate impact.",
      indivChipsTitle: "We look for professionals and experts such as:",
      indivChips: [
        "Entrepreneurs", "Mentors", "Consultants", "Trainers", "Executives", "Investors",
        "Lawyers", "Accountants", "Marketing Experts", "Tech Experts",
        "HR Experts", "Researchers", "Coaches", "Freelance Professionals", "Innovation Experts"
      ],
      indivReceiveTitle: "What you gain as an Expert",
      indivExpectTitle: "How you can contribute to the ecosystem",
      indivReceive: [
        "Integration into ABN's Official Experts Network",
        "Professional profile indexed in our Specialist Directory",
        "Paid consulting opportunities and top-level mentoring",
        "Active participation in national and international projects",
        "Invitations to private networking sessions with leaders & VCs",
        "Official Partner Specialist Certificate",
        "Increased visibility for your career and personal brand",
        "Access to an international network of professionals & founders"
      ],
      indivExpect: [
        "Sharing practical knowledge with the community",
        "Providing consulting or advisory to startups",
        "Conducting mentoring sessions for young founders",
        "Teaching training programs or specialized masterclasses",
        "Supporting the development of local impact projects",
        "Direct support in capacity-building for startups & SMEs",
        "Promoting open innovation and best practice sharing"
      ],

      howTitle: "How to Become a Partner?",
      steps: [
        { title: "Application", desc: "Submit your candidacy through our online form." },
        { title: "Technical Review", desc: "Our team evaluates your professional profile or organization." },
        { title: "Alignment Meeting", desc: "We hold a quick meeting to define collaboration areas." },
        { title: "Approval", desc: "Formal approval of the partnership model." },
        { title: "Agreement / MoU", desc: "Signing of the Agreement or mutual Memorandum of Understanding." },
        { title: "Official Onboarding", desc: "Official launch of activities and visibility in the network." }
      ],

      closingTitle: "A Partnership Based on Value",
      closingText: "At ABN we believe a partnership is only successful when both sides grow together. Therefore, every collaboration is built with clear objectives, mutual benefits, defined responsibilities, and a focus on measurable results. No matter the size of your organization or the stage of your career, if you share our vision of strengthening African entrepreneurship through collaboration, innovation, and opportunity, there is a place for you in ABN.",
      closingBtn: "Apply Now",

      formTitle: "Application Form",
      formSub: "Fill in your details below and select your partnership category of interest to start the process.",
      formName: "Full Name / Representative",
      formEmail: "Email Address",
      formType: "Partner Type",
      formTypeInst: "Organization / Institution",
      formTypeIndiv: "Individual Professional / Expert",
      formCategory: "Partnership Category",
      formOrgInst: "Organization / Company Name",
      formOrgIndiv: "Profession / Area of Expertise",
      formMsg: "Motivation Message",
      formMsgPlaceholder: "Explain briefly why you would like to join ABN and how you plan to contribute...",
      formBtnSubmit: "Submit Application",
      formBtnSending: "Sending...",
      formBtnSuccess: "Application submitted successfully!"
    }
  };

  const currentContent = language === 'pt' ? content.pt : content.en;

  const categoriesOptions = formData.type === 'institucional' 
    ? [
        { value: 'bancario', label: language === 'pt' ? 'Parceiro Bancário' : 'Banking Partner' },
        { value: 'academico', label: language === 'pt' ? 'Parceiro Académico' : 'Academic Partner' },
        { value: 'estrategico', label: language === 'pt' ? 'Parceiro Estratégico' : 'Strategic Partner' },
        { value: 'financeiro', label: language === 'pt' ? 'Parceiro Financeiro' : 'Financial Partner' },
        { value: 'tecnico', label: language === 'pt' ? 'Parceiro Técnico' : 'Technical Partner' },
        { value: 'tecnologico', label: language === 'pt' ? 'Parceiro Tecnológico' : 'Technological Partner' },
        { value: 'comercial', label: language === 'pt' ? 'Parceiro Comercial' : 'Commercial Partner' },
        { value: 'media', label: language === 'pt' ? 'Comunicação e Media' : 'Media Partner' },
        { value: 'internacional', label: language === 'pt' ? 'Parceiro Internacional' : 'International Partner' }
      ]
    : [
        { value: 'mentor', label: language === 'pt' ? 'Mentor' : 'Mentor' },
        { value: 'consultor', label: language === 'pt' ? 'Consultor' : 'Consultant' },
        { value: 'formador', label: language === 'pt' ? 'Formador / Instrutor' : 'Trainer' },
        { value: 'investidor', label: language === 'pt' ? 'Investidor' : 'Investor' },
        { value: 'tecnologia', label: language === 'pt' ? 'Especialista em Tecnologia' : 'Tech Expert' },
        { value: 'marketing', label: language === 'pt' ? 'Especialista em Marketing' : 'Marketing Expert' },
        { value: 'outros', label: language === 'pt' ? 'Outro Profissional' : 'Other Professional' }
      ];

  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Header */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('/partners_hero.png')` }}
      >
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>{currentContent.badge}</div>
          <h1 className={styles.heroTitle}>{currentContent.title}</h1>
        </div>
      </section>

      {/* Intro Description */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introCopy}>
            <h2 className={styles.introSubtitle}>{currentContent.introSub}</h2>
            <p className={styles.introParagraph}>{currentContent.introP1}</p>
            <p className={styles.introParagraph}>{currentContent.introP2}</p>
            <p className={styles.introParagraph} style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
              {currentContent.introP3}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits (Porquê) Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.benefitsTitle}>{currentContent.whyTitle}</h2>
          <div className={styles.benefitsGrid}>
            {currentContent.benefits.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tabs (Quem Pode Se Tornar) Section */}
      <section className={styles.tabsSection} id="candidatura-info">
        <div className={styles.container}>
          <h2 className={styles.tabTitle}>{currentContent.whoTitle}</h2>
          
          {/* Tab buttons */}
          <div className={styles.tabSelector}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'institutional' ? styles.activeTabBtn : ''}`}
              onClick={() => {
                setActiveTab('institutional');
                setFormData(prev => ({ ...prev, type: 'institucional', category: 'estrategico' }));
              }}
            >
              {currentContent.tabInst}
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'individual' ? styles.activeTabBtn : ''}`}
              onClick={() => {
                setActiveTab('individual');
                setFormData(prev => ({ ...prev, type: 'individual', category: 'mentor' }));
              }}
            >
              {currentContent.tabIndiv}
            </button>
          </div>

          {/* Institutional Content */}
          {activeTab === 'institutional' && (
            <div>
              <p className={styles.introParagraph} style={{ marginBottom: '2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
                {currentContent.instSub}
              </p>
              
              <h3 className={styles.chipsTitle}>{currentContent.instChipsTitle}</h3>
              <div className={styles.chipsContainer}>
                {currentContent.instChips.map((c, i) => (
                  <span key={i} className={styles.chip}>{c}</span>
                ))}
              </div>

              <h3 className={styles.chipsTitle} style={{ marginTop: '2.5rem' }}>{currentContent.instCategoriesTitle}</h3>
              <div className={styles.grid3}>
                {currentContent.instCategories.map((cat, i) => (
                  <div key={i} className={styles.categoryCard}>
                    <div className={styles.categoryCardContent}>
                      <h4>{cat.title}</h4>
                      <p>{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.splitGrid}>
                <div>
                  <h3 className={styles.colTitle}>{currentContent.instReceiveTitle}</h3>
                  <div className={styles.bulletList}>
                    {currentContent.instReceive.map((item, i) => (
                      <div key={i} className={styles.bulletItem}>
                        <span className={styles.bulletIcon}>•</span>
                        <span className={styles.bulletText}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={styles.colTitle}>{currentContent.instExpectTitle}</h3>
                  <div className={styles.bulletList}>
                    {currentContent.instExpect.map((item, i) => (
                      <div key={i} className={styles.bulletItem}>
                        <span className={styles.bulletIcon}>•</span>
                        <span className={styles.bulletText}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Individual Content */}
          {activeTab === 'individual' && (
            <div>
              <p className={styles.introParagraph} style={{ marginBottom: '2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
                {currentContent.indivSub}
              </p>

              <h3 className={styles.chipsTitle}>{currentContent.indivChipsTitle}</h3>
              <div className={styles.chipsContainer}>
                {currentContent.indivChips.map((c, i) => (
                  <span key={i} className={styles.chip}>{c}</span>
                ))}
              </div>

              <div className={styles.splitGrid} style={{ marginTop: '3rem' }}>
                <div>
                  <h3 className={styles.colTitle}>{currentContent.indivReceiveTitle}</h3>
                  <div className={styles.bulletList}>
                    {currentContent.indivReceive.map((item, i) => (
                      <div key={i} className={styles.bulletItem}>
                        <span className={styles.bulletIcon}>•</span>
                        <span className={styles.bulletText}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={styles.colTitle}>{currentContent.indivExpectTitle}</h3>
                  <div className={styles.bulletList}>
                    {currentContent.indivExpect.map((item, i) => (
                      <div key={i} className={styles.bulletItem}>
                        <span className={styles.bulletIcon}>•</span>
                        <span className={styles.bulletText}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Onboarding process (timeline) */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <h2 className={styles.timelineTitle}>{currentContent.howTitle}</h2>
          <div className={styles.timeline}>
            {currentContent.steps.map((s, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineNumber}>{i + 1}</div>
                <h3 className={styles.timelineStepTitle}>{s.title}</h3>
                <p className={styles.timelineStepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className={styles.closingSection}>
        <div className={styles.container}>
          <div className={styles.closingCard}>
            <h2 className={styles.closingTitle}>{currentContent.closingTitle}</h2>
            <p className={styles.closingText}>{currentContent.closingText}</p>
            <a href="#formulario-candidatura" className="btn-primary" style={{ background: '#ffffff', color: 'var(--secondary)' }}>
              {currentContent.closingBtn}
            </a>
          </div>
        </div>
      </section>

      {/* Form CTA Section */}
      <section className={styles.formSection} id="formulario-candidatura">
        <div className={styles.container}>
          <div className={styles.formGrid}>
            <div className={styles.formInfo}>
              <h2>{currentContent.formTitle}</h2>
              <p style={{ marginTop: '1rem' }}>{currentContent.formSub}</p>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <span style={{ fontSize: '3rem' }}>🎉</span>
                  <h3 style={{ color: 'var(--primary)', marginTop: '1rem', marginBottom: '0.5rem' }}>{currentContent.formBtnSuccess}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {language === 'pt' ? 'Agradecemos o seu contacto. A nossa equipa analisará os dados em breve.' : 'Thank you. Our team will review your application soon.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>{currentContent.formName} *</label>
                      <input 
                        type="text" 
                        placeholder={language === 'pt' ? 'Ex: João Silva ou Empresa XYZ' : 'Ex: John Doe or Company XYZ'} 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>{currentContent.formEmail} *</label>
                      <input 
                        type="email" 
                        placeholder="nome@email.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>{currentContent.formType}</label>
                      <select 
                        className={styles.selectField}
                        value={formData.type}
                        onChange={(e) => {
                          const typeVal = e.target.value;
                          setFormData({ 
                            ...formData, 
                            type: typeVal,
                            category: typeVal === 'institucional' ? 'estrategico' : 'mentor'
                          });
                          setActiveTab(typeVal === 'institucional' ? 'institutional' : 'individual');
                        }}
                        disabled={loading}
                      >
                        <option value="institucional">{currentContent.formTypeInst}</option>
                        <option value="individual">{currentContent.formTypeIndiv}</option>
                      </select>
                    </div>
                    
                    <div className={styles.formField}>
                      <label>{currentContent.formCategory}</label>
                      <select 
                        className={styles.selectField}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        disabled={loading}
                      >
                        {categoriesOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label>
                      {formData.type === 'institucional' ? currentContent.formOrgInst : currentContent.formOrgIndiv} *
                    </label>
                    <input 
                      type="text" 
                      placeholder={formData.type === 'institucional' ? (language === 'pt' ? 'Nome da Empresa/Organização' : 'Company Name') : (language === 'pt' ? 'Ex: Consultor de Finanças, Programador, etc.' : 'Ex: Financial Consultant, Developer, etc.')}
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>{currentContent.formMsg} *</label>
                    <textarea 
                      placeholder={currentContent.formMsgPlaceholder}
                      value={formData.msg}
                      onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                      required
                      disabled={loading}
                    ></textarea>
                  </div>

                  {errorMsg && <p style={{ color: '#ff4d4d', fontSize: '0.9rem' }}>{errorMsg}</p>}

                  <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? currentContent.formBtnSending : currentContent.formBtnSubmit}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Our Partners grid */}
      <section className={styles.partnersGridSection}>
        <div className={styles.container}>
          <h2 className={styles.partnersTitle}>
            {language === 'pt' ? 'Nossos parceiros' : 'Our partners'}
          </h2>
          <div className={styles.logosContainer}>
            {partnersLogos.map((p, i) => (
              <div key={i} className={styles.logoCard}>
                <span className={styles.logoIcon}>{p.logo}</span>
                <span className={styles.logoName}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer in style of Orange Corners */}
      <footer className={styles.footer}>
        {/* Level 1: Royal Blue Section */}
        <div className={styles.footerTop}>
          <div className={styles.footerContainer}>
            <div className={styles.footerGrid}>
              <div className={styles.footerBrand}>
                <Link href="/" className={styles.footerLogo}>
                  <img src="/icon.png" alt="ABN Logo" className={styles.footerLogoImg} />
                  <div className={styles.footerLogoText}>
                    <span className={styles.footerAbn}>ABN</span>
                    <span className={styles.footerNetwork}>AfroBiz Network</span>
                  </div>
                </Link>
              </div>
              
              <div className={styles.footerLinksGrid}>
                <div className={styles.footerLinkCol}>
                  <Link href="/equipa">{language === 'pt' ? 'EQUIPA' : 'TEAM'}</Link>
                </div>
                <div className={styles.footerLinkCol}>
                  <Link href="/#missao">{language === 'pt' ? 'NOSSA MISSÃO' : 'OUR MISSION'}</Link>
                </div>
                <div className={styles.footerLinkCol}>
                  <Link href="/incubacao">{language === 'pt' ? 'PROGRAMAS' : 'PROGRAMS'}</Link>
                </div>
                <div className={styles.footerLinkCol}>
                  <Link href="/#artigos">{language === 'pt' ? 'NOVIDADES' : 'NEWS'}</Link>
                </div>
                <div className={styles.footerLinkCol}>
                  <Link href="/marketplace">{language === 'pt' ? 'SERVIÇOS' : 'SERVICES'}</Link>
                </div>
                <div className={styles.footerLinkCol}>
                  <Link href="/parceiros">{language === 'pt' ? 'PARCEIROS' : 'PARTNERS'}</Link>
                </div>
                <div className={styles.footerLinkCol}>
                  <Link href="/contacto">{language === 'pt' ? 'CONTACTO' : 'CONTACT'}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Level 2: Dark Copyright & Social Bar */}
        <div className={styles.footerMiddle}>
          <div className={styles.footerContainer}>
            <div className={styles.footerBar}>
              <div className={styles.copyright}>
                Copyright © ABN {new Date().getFullYear()}
              </div>
              
              <div className={styles.socials}>
                <a href="https://instagram.com/afro44879" target="_blank" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://web.facebook.com/profile.php?id=61574066674222" target="_blank" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://www.linkedin.com/in/abn-afrobiz-network-43967a367/" target="_blank" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
              
              <div className={styles.legal}>
                <span>{language === 'pt' ? 'Acessibilidade' : 'Accessibility'}</span>
                <span>|</span>
                <span>{t.footer.terms}</span>
                <span>|</span>
                <span>{t.footer.privacy}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Level 3: White Partner Section */}
        <div className={styles.footerBottom}>
          <div className={styles.footerContainer}>
            <div className={styles.supportPartner}>
              <svg viewBox="0 0 40 40" width="30" height="30" className={styles.coatOfArms}>
                <path d="M20 2 L 35 12 L 35 28 L 20 38 L 5 28 L 5 12 Z" fill="#2a4fa6" />
                <path d="M20 8 L 28 14 L 28 26 L 20 32 L 12 26 L 12 14 Z" fill="#ffffff" />
                <circle cx="20" cy="20" r="4" fill="#ff6b00" />
              </svg>
              <div className={styles.partnerInfo}>
                <p className={styles.partnerHeading}>
                  {language === 'pt' ? 'Iniciativa ABN Ecosystem' : 'ABN Ecosystem Initiative'}
                </p>
                <p className={styles.partnerSubtext}>
                  {language === 'pt' 
                    ? 'Parceiro para o empoderamento económico e aceleração empresarial' 
                    : 'Partner for business acceleration and economic empowerment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
