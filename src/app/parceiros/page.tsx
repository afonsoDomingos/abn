'use client';

import Navbar from "@/components/Navbar";
import styles from "./Parceiros.module.css";
import { useLanguage } from "@/lib/LanguageContext";
import Link from 'next/link';
import { useState } from 'react';

export default function Parceiros() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', org: '', msg: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', org: '', msg: '' });
    }, 4000);
  };

  const partnersLogos = [
    { name: 'African Union', logo: '🌍' },
    { name: 'AfDB', logo: '🏦' },
    { name: 'UNDP', logo: '🇺🇳' },
    { name: 'TechHub Luanda', logo: '💻' },
    { name: 'Startup Moçambique', logo: '🚀' },
    { name: 'Global Invest', logo: '📈' },
  ];

  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Header */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/partners_hero.png')` }}
      >
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>ABN PARTNERS</div>
          <h1 className={styles.heroTitle}>
            {language === 'pt' ? 'Parceiros' : 'Partners'}
          </h1>
        </div>
      </section>

      {/* Intro Description */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2>{language === 'pt' ? 'Construindo o ecossistema juntos' : 'Building the ecosystem together'}</h2>
              <p>
                {language === 'pt' 
                  ? 'A ABN trabalha em colaboração estreita com embaixadas, governos, multinacionais e parceiros locais para criar pontes de desenvolvimento e aceleração digital em África. Acreditamos que a cooperação estratégica entre o setor público e privado é a chave para criar um ambiente próspero de inovação.' 
                  : 'ABN works in close collaboration with embassies, governments, multinationals, and local partners to build development and digital acceleration bridges in Africa. We believe strategic cooperation between the public and private sectors is the key to creating a thriving innovation environment.'}
              </p>
            </div>
            <div className={styles.introImages}>
              <img src="/mission_team.png" alt="Team Partnership" className={styles.introImg} />
              <img src="/hero_entrepreneurs.png" alt="Entrepreneurs Group" className={styles.introImg} />
            </div>
          </div>
        </div>
      </section>

      {/* Orange Banner: Benefits */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.benefitsTitle}>
            {language === 'pt' ? 'Benefícios para parceiros' : 'Benefits for partners'}
          </h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🎓</div>
              <h3>{language === 'pt' ? 'Acesso a Talento' : 'Talent Access'}</h3>
              <p>
                {language === 'pt' 
                  ? 'Conecte-se com jovens líderes inovadores e fundadores de startups de alto potencial técnico e de liderança.' 
                  : 'Connect with innovative young leaders and high-potential tech and startup founders.'}
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📢</div>
              <h3>{language === 'pt' ? 'Visibilidade de Marca' : 'Brand Visibility'}</h3>
              <p>
                {language === 'pt' 
                  ? 'Destaque a sua marca nos nossos canais e eventos de inovação nacionais e internacionais.' 
                  : 'Highlight your brand across our channels and local/international innovation events.'}
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🌱</div>
              <h3>{language === 'pt' ? 'Responsabilidade Social (CSR)' : 'Social Impact (CSR)'}</h3>
              <p>
                {language === 'pt' 
                  ? 'Crie projetos sustentáveis com métricas de impacto claras sobre emprego jovem e empreendedorismo feminino.' 
                  : 'Create sustainable projects with clear impact metrics on youth jobs and female entrepreneurship.'}
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🤝</div>
              <h3>{language === 'pt' ? 'Rede Estratégica' : 'Strategic Network'}</h3>
              <p>
                {language === 'pt' 
                  ? 'Aceda à rede de investidores privados, agências de fomento governamentais e líderes da indústria.' 
                  : 'Access the network of private investors, government development agencies, and industry leaders.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className={styles.whyJoinSection}>
        <div className={styles.container}>
          <h2 className={styles.whyTitle}>
            {language === 'pt' ? 'Porquê se tornar um parceiro?' : 'Why become a partner?'}
          </h2>
          <div className={styles.whyGrid}>
            {/* Public box */}
            <div className={`${styles.whyCard} ${styles.publicCard}`}>
              <h3>{language === 'pt' ? 'Parceiros Públicos' : 'Public Partners'}</h3>
              <p>
                {language === 'pt' 
                  ? 'Trabalhamos com embaixadas, ministérios e ONGs para alinhar os nossos programas com os Objetivos de Desenvolvimento Sustentável (ODS) da ONU. Apoiamos a formulação de políticas públicas voltadas à digitalização e formalização de PMEs.' 
                  : 'We work with embassies, ministries, and NGOs to align our programs with the UN Sustainable Development Goals (SDGs). We support public policy design aimed at SME digitization and formalization.'}
              </p>
            </div>
            {/* Private box */}
            <div className={`${styles.whyCard} ${styles.privateCard}`}>
              <h3>{language === 'pt' ? 'Parceiros Privados' : 'Private Partners'}</h3>
              <p>
                {language === 'pt' 
                  ? 'Multinacionais, corporações locais e investidores financiam, mentoreiam e contratam startups na nossa rede. Integramos PMEs locais nas cadeias de suprimento e criamos programas de inovação corporativa.' 
                  : 'Multinationals, local corporations, and investors fund, mentor, and hire startups in our network. We integrate local SMEs into supply chains and create corporate innovation programs.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form CTA Section */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formGrid}>
            <div className={styles.formInfo}>
              <h2>{language === 'pt' ? 'Torne-se um parceiro' : 'Become a partner'}</h2>
              <p>
                {language === 'pt' 
                  ? 'Entre em contacto hoje e descubra como a sua organização pode acelerar o ecossistema empresarial digital em África.' 
                  : 'Get in touch today and discover how your organization can accelerate the digital business ecosystem in Africa.'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formField}>
                <input 
                  type="text" 
                  placeholder={language === 'pt' ? 'Seu Nome' : 'Your Name'} 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formField}>
                <input 
                  type="email" 
                  placeholder={language === 'pt' ? 'Seu E-mail' : 'Your E-mail'} 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formField}>
                <input 
                  type="text" 
                  placeholder={language === 'pt' ? 'Sua Organização' : 'Your Organization'} 
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formField}>
                <textarea 
                  placeholder={language === 'pt' ? 'Sua Mensagem' : 'Your Message'} 
                  value={formData.msg}
                  onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                {sent 
                  ? (language === 'pt' ? 'Enviado com sucesso!' : 'Sent successfully!') 
                  : (language === 'pt' ? 'Enviar Mensagem' : 'Send Message')}
              </button>
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
                    ? 'Parceiro para o empoderamento econômico e aceleração empresarial digital' 
                    : 'Partner for digital business acceleration and economic empowerment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
