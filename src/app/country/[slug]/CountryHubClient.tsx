'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import styles from './CountryHub.module.css';
import { useLanguage } from '@/lib/LanguageContext';

const fallbackHubs: Record<string, any> = {
  guinebissau: {
    name: 'Guiné-Bissau',
    slug: 'guinebissau',
    currency: 'XOF',
    currencySymbol: 'CFA',
    clubPrice: '50.000',
    image: '/guine_bissau_banner.png',
    description: 'A delegação da ABN em Guiné-Bissau fomenta o ecossistema de empreendedorismo local através de incubação acelerada de ideias, conexão com investidores internacionais e facilitação de redes de mercados sustentáveis.',
    steps: [
      { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio ou ideia de impacto.' },
      { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor à nossa comissão de mentores.' },
      { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica personalizada e recursos para expansão.' }
    ],
    faqs: [
      { question: 'Quem se pode candidatar?', answer: 'Jovens guineenses residentes em Bissau, estudantes ou profissionais com projetos inovadores de base tecnológica ou sustentável.' },
      { question: 'Existe algum custo associado?', answer: 'Não, todos os programas oferecidos pela ABN Guiné-Bissau são totalmente gratuitos.' }
    ],
    address: 'Bissau, Guiné-Bissau - Avenida Combatentes da Liberdade da Pátria',
    email: 'guinebissau@afrobiznetwork.com',
    phone: '+245 955 000 000',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    events: [
      {
        title: 'Fórum de Adaptação de Lideranças Juvenis',
        date: '14 de Outubro de 2026',
        description: 'Encontro de jovens empreendedores e líderes focado no desenvolvimento de competências verdes e negócios de impacto ecológico.',
        type: 'future',
        link: 'https://wa.me/258845773974'
      },
      {
        title: 'Workshop Mentoria Spark Guiné',
        date: '12 de Fevereiro de 2026',
        description: 'Sessão intensiva de ideação e validação de modelos de negócio para startups locais na fase inicial.',
        type: 'past',
        image: '/guine_bissau_banner.png'
      }
    ],
    representative: {
      name: 'Mamadu Baldé',
      role: 'Representante Nacional',
      email: 'mamadu.balde@afrobiznetwork.com',
      phone: '+245 955 123 456',
      image: ''
    },
    viceRepresentative: {
      name: 'A definir',
      role: 'Vice-Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    team: [
      { name: 'Fatoumata Djaló', role: 'Gestora de Programas e Incubação', image: '' },
      { name: 'Umaro Sissoco', role: 'Coordenador de Parcerias e Impacto', image: '' }
    ],
    partners: [
      { name: 'Startup Bissau', logo: '' },
      { name: 'Banco da Guiné', logo: '🏦' },
      { name: 'Mentores GB', logo: '' }
    ],
    localPrograms: [
      { name: 'ABN Startup 180', description: 'Incubação intensiva de 180 dias' },
      { name: 'Clube dos Empreendedores', description: 'Networking e mentoria' }
    ]
  },
  angola: {
    name: 'Angola',
    slug: 'angola',
    currency: 'AOA',
    currencySymbol: 'Kz',
    clubPrice: '150.000',
    image: '/angola_banner.png',
    description: 'A delegação da ABN em Angola promove o ecossistema de empreendedorismo através de incubação, formação e conexão com investidores locais e internacionais.',
    steps: [
      { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio ou ideia.' },
      { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor à nossa comissão.' },
      { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica personalizada e recursos.' }
    ],
    faqs: [
      { question: 'Quem se pode candidatar?', answer: 'Jovens angolanos residentes em Luanda ou outras províncias, com projetos inovadores.' },
      { question: 'Existe algum custo associado?', answer: 'Os programas da ABN Angola são gratuitos para participantes selecionados.' }
    ],
    address: 'Luanda, Angola',
    email: 'angola@afrobiznetwork.com',
    phone: '+244 923 000 000',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    events: [],
    representative: {
      name: 'A definir',
      role: 'Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    viceRepresentative: {
      name: 'A definir',
      role: 'Vice-Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    team: [],
    partners: [],
    localPrograms: [
      { name: 'ABN Startup 180', description: 'Incubação intensiva de 180 dias' },
      { name: 'Clube dos Empreendedores', description: 'Networking e mentoria' },
      { name: 'Clubes das Startups Angola', description: 'Hubs locais de apoio' }
    ]
  },
  saotome: {
    name: 'São Tomé e Príncipe',
    slug: 'saotome',
    currency: 'STN',
    currencySymbol: 'Db',
    clubPrice: '500.000',
    image: '/saotome_banner.png',
    description: 'A delegação da ABN em São Tomé e Príncipe apoia empreendedores locais através de incubação, formação e networking.',
    steps: [],
    faqs: [],
    address: 'São Tomé, São Tomé e Príncipe',
    email: 'saotome@afrobiznetwork.com',
    phone: '+239 222 000 000',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    events: [],
    representative: {
      name: 'A definir',
      role: 'Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    viceRepresentative: {
      name: 'A definir',
      role: 'Vice-Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    team: [],
    partners: [],
    localPrograms: [
      { name: 'ABN Startup 180', description: 'Incubação intensiva de 180 dias' },
      { name: 'Clube dos Empreendedores', description: 'Networking e mentoria' }
    ]
  },
  caboverde: {
    name: 'Cabo Verde',
    slug: 'caboverde',
    currency: 'CVE',
    currencySymbol: 'Esc',
    clubPrice: '15.000',
    image: '/caboverde_banner.png',
    description: 'A delegação da ABN em Cabo Verde conecta empreendedores com oportunidades regionais e internacionais.',
    steps: [],
    faqs: [],
    address: 'Praia, Cabo Verde',
    email: 'caboverde@afrobiznetwork.com',
    phone: '+238 261 000 000',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    events: [],
    representative: {
      name: 'A definir',
      role: 'Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    viceRepresentative: {
      name: 'A definir',
      role: 'Vice-Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    team: [],
    partners: [],
    localPrograms: [
      { name: 'ABN Startup 180', description: 'Incubação intensiva de 180 dias' },
      { name: 'Clube dos Empreendedores', description: 'Networking e mentoria' }
    ]
  },
  mocambique: {
    name: 'Moçambique',
    slug: 'mocambique',
    currency: 'MZN',
    currencySymbol: 'MT',
    clubPrice: '5.000',
    isHeadquarters: true,
    image: '/mocambique_banner.png',
    description: 'A sede da ABN em Maputo é o centro do ecossistema africano de empreendedorismo, com programas de incubação, formação e networking.',
    steps: [
      { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio ou ideia.' },
      { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor à nossa comissão.' },
      { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica personalizada e recursos.' }
    ],
    faqs: [
      { question: 'Quem se pode candidatar?', answer: 'Jovens moçambicanos residentes em Maputo ou outras províncias, com projetos inovadores.' },
      { question: 'Existe algum custo associado?', answer: 'Os programas da ABN Moçambique são gratuitos para participantes selecionados.' }
    ],
    address: 'Av. Maria de Lurdes Mutola, Q.60, casa n.º 01, Magoanine A, KaMubukwana, Maputo, Moçambique',
    email: 'info@abnafrobiznetwork.com',
    phone: '+258 84 577 3974',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    events: [],
    representative: {
      name: 'A definir',
      role: 'Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    viceRepresentative: {
      name: 'A definir',
      role: 'Vice-Representante Nacional',
      email: '',
      phone: '',
      image: ''
    },
    team: [],
    partners: [],
    localPrograms: [
      { name: 'ABN Startup 180', description: 'Incubação intensiva de 180 dias' },
      { name: 'Clube dos Empreendedores', description: 'Networking e mentoria' },
      { name: 'Clubes das Startups Moçambique', description: 'Hubs locais de apoio' }
    ]
  }
};

export default function CountryHubClient({ params }: { params: Promise<{ slug: string }> }) {
  const { language } = useLanguage();
  const { slug } = use(params);
  
  const [hub, setHub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Events tab selection
  const [activeTab, setActiveTab] = useState<'future' | 'past'>('future');
  
  // FAQs expanded state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sendingContact, setSendingContact] = useState(false);
  const [contactResult, setContactResult] = useState('');

  // Global Partners
  const [globalPartners, setGlobalPartners] = useState<any[]>([]);
  const [shopEnabled, setShopEnabled] = useState(false);

  useEffect(() => {
    // 1. Fetch Hub details
    fetch(`/api/hubs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.hub) {
          setHub(data.hub);
        } else if (fallbackHubs[slug]) {
          setHub(fallbackHubs[slug]);
        } else {
          setError(data.error || 'Delegação não encontrada.');
        }
        setLoading(false);
      })
      .catch(() => {
        if (fallbackHubs[slug]) {
          setHub(fallbackHubs[slug]);
        } else {
          setError('Erro na conexão com o servidor.');
        }
        setLoading(false);
      });

    // 2. Fetch global partners for the logo bar
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.partners_content) {
          setGlobalPartners(data.configs.partners_content);
        }
        if (data.configs?.shop_enabled !== undefined) {
          setShopEnabled(data.configs.shop_enabled);
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingContact(true);
    setContactResult('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: `[DELEGAÇÃO ${hub?.name || slug}] ${contactMsg}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setContactResult('Mensagem enviada com sucesso!');
        setContactName('');
        setContactEmail('');
        setContactMsg('');
      } else {
        setContactResult(data.error || 'Erro ao enviar a mensagem.');
      }
    } catch {
      setContactResult('Erro de conexão. Tente novamente.');
    } finally {
      setSendingContact(false);
    }
  };

  const filteredEvents = hub?.events?.filter((ev: any) => 
    activeTab === 'future' ? ev.type === 'future' : ev.type === 'past'
  ) || [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#0f172a', fontWeight: 600 }}>
        A carregar informações da delegação...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#dc2626', fontWeight: 600 }}>
        {error}
      </div>
    );
  }

  if (!hub) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#64748b', fontWeight: 600 }}>
        Delegação não encontrada. Por favor, tente novamente ou contacte a equipa ABN.
      </div>
    );
  }

  return (
    <div className={styles.countryHub}>
      <Navbar />
      
      {/* Hero Section */}
      <header className={styles.hero} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(10, 10, 10, 0.9) 100%), url('${hub.image || '/partners_hero.png'}')` }}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">ABN {hub.name}</h1>
          <p className={styles.heroDescription}>
            {hub.description}
          </p>
          <div className={styles.contactInfo}>
            <span>📍 {hub.address}</span>
            <span>📧 {hub.email}</span>
            {hub.phone && <span>📞 {hub.phone}</span>}
          </div>
        </div>
      </header>

      {/* Representative Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Representação Nacional</h2>
          <div className={styles.representativesGrid}>
            {hub.representative && (
              <div className={styles.representativeCard}>
                <div className={styles.representativeImage}>
                  {hub.representative.image ? (
                    <img src={hub.representative.image} alt={hub.representative.name} />
                  ) : (
                    <div className={styles.representativePlaceholder}>
                      {getInitials(hub.representative.name)}
                    </div>
                  )}
                </div>
                <div className={styles.representativeInfo}>
                  <h3>{hub.representative.name}</h3>
                  <p className={styles.representativeRole}>{hub.representative.role}</p>
                  <div className={styles.representativeContact}>
                    {hub.representative.email && <span>📧 {hub.representative.email}</span>}
                    {hub.representative.phone && <span>📞 {hub.representative.phone}</span>}
                  </div>
                </div>
              </div>
            )}
            {hub.viceRepresentative && (
              <div className={styles.representativeCard}>
                <div className={styles.representativeImage}>
                  {hub.viceRepresentative.image ? (
                    <img src={hub.viceRepresentative.image} alt={hub.viceRepresentative.name} />
                  ) : (
                    <div className={styles.representativePlaceholder}>
                      {getInitials(hub.viceRepresentative.name)}
                    </div>
                  )}
                </div>
                <div className={styles.representativeInfo}>
                  <h3>{hub.viceRepresentative.name}</h3>
                  <p className={styles.representativeRole}>{hub.viceRepresentative.role}</p>
                  <div className={styles.representativeContact}>
                    {hub.viceRepresentative.email && <span>📧 {hub.viceRepresentative.email}</span>}
                    {hub.viceRepresentative.phone && <span>📞 {hub.viceRepresentative.phone}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Local Programs Section */}
      {hub.localPrograms && hub.localPrograms.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Programas Activos</h2>
            <div className={styles.programsList}>
              {hub.localPrograms.map((program: any, i: number) => (
                <div key={i} className={styles.programItem}>
                  <h3>{program.name}</h3>
                  <p>{program.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Local Partners Section */}
      {hub.partners && hub.partners.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Parceiros Locais</h2>
            <div className={styles.partnersGrid}>
              {hub.partners.map((partner: any, i: number) => (
                <div key={i} className={styles.partnerLogo}>
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} />
                  ) : (
                    <span>{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Junte-se ao Clube dos Empreendedores</h2>
            <p>Faça parte da comunidade ABN e aceda a networking, mentoria e oportunidades de negócios.</p>
            <div className={styles.ctaPrice}>
              <span className={styles.priceValue}>{hub.currencySymbol} {hub.clubPrice}</span>
              <span className={styles.pricePeriod}/ano</span>
            </div>
            <a href="/registro" className="btn-primary">Aderir ao Clube</a>
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.legalNotice}>
            <p>A Representação Nacional da ABN em {hub.name} actua em nome do ecossistema ABN, gerido pela Afrobiz Network ABN, SU, Lda.</p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      {hub.steps && hub.steps.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Como Funciona</h2>
            <div className={styles.stepsGrid}>
              {hub.steps.map((step: any, i: number) => (
                <div key={i} className={styles.stepCard}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {hub.events && hub.events.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Eventos</h2>
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'future' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('future')}
              >
                Próximos Eventos
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'past' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Eventos Passados
              </button>
            </div>
            <div className={styles.eventsGrid}>
              {filteredEvents.map((event: any, i: number) => (
                <div key={i} className={styles.eventCard}>
                  {event.image && <img src={event.image} alt={event.title} className={styles.eventImage} />}
                  <div className={styles.eventContent}>
                    <h3>{event.title}</h3>
                    <p className={styles.eventDate}>{event.date}</p>
                    <p>{event.description}</p>
                    {event.link && (
                      <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.eventLink}>
                        Saiba mais →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {hub.faqs && hub.faqs.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
            <div className={styles.faqsList}>
              {hub.faqs.map((faq: any, i: number) => (
                <div key={i} className={styles.faqItem}>
                  <button 
                    className={styles.faqQuestion}
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    {faq.question}
                    <span className={styles.faqIcon}>{expandedFaq === i ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === i && (
                    <div className={styles.faqAnswer}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Contacte a Delegação</h2>
          <form onSubmit={handleContactSubmit} className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label>Nome *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mensagem *</label>
              <textarea
                required
                value={contactMsg}
                onChange={e => setContactMsg(e.target.value)}
                placeholder="Como podemos ajudar?"
                rows={4}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={sendingContact}>
              {sendingContact ? 'A enviar...' : 'Enviar Mensagem'}
            </button>
            {contactResult && (
              <div className={contactResult.includes('sucesso') ? styles.successMsg : styles.errorMsg}>
                {contactResult}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Partners Section */}
      {globalPartners.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Parceiros Globais</h2>
            <div className={styles.partnersGrid}>
              {globalPartners.map((partner: any, i: number) => (
                <div key={i} className={styles.partnerLogo}>
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} />
                  ) : (
                    <span>{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
}