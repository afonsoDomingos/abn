'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
import Link from 'next/link';
import styles from './PresidentMessage.module.css';

interface PresidentMessageProps {
  showFullPageLayout?: boolean;
}

export default function PresidentMessage({ showFullPageLayout = false }: PresidentMessageProps) {
  const { language } = useLanguage();
  const [dynamicPm, setDynamicPm] = useState<any>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.president_message_content) {
          setDynamicPm(data.configs.president_message_content);
        }
      })
      .catch(() => {});
  }, []);

  const langKey = (language === 'pt' || language === 'en' || language === 'fr') ? language : 'pt';
  const staticPm = (translations[langKey] as any)?.presidentMessage || {
    badge: "MENSAGEM DO PRESIDENTE",
    title: "Seja muito bem-vindo(a) à AfroBiz Network (ABN)",
    paragraph1: "Seja muito bem-vindo(a) à AfroBiz Network (ABN).",
    paragraph2: "É com grande satisfação que o recebemos nesta plataforma, criada para ligar empreendedores, inovadores, investidores, profissionais e instituições que acreditam no potencial transformador de África.",
    paragraph3: "Na ABN, acreditamos que o empreendedorismo é uma das maiores ferramentas para gerar oportunidades, criar riqueza, impulsionar a inovação e promover um desenvolvimento económico sustentável. A nossa missão é construir uma rede sólida de colaboração, onde ideias se transformam em negócios, talentos encontram oportunidades e parcerias geram impacto real.",
    paragraph4: "Convidamo-lo a fazer parte desta comunidade dinâmica e visionária. Independentemente da fase em que o seu projecto ou negócio se encontre, encontrará na ABN um espaço de aprendizagem, networking, incubação, aceleração e crescimento.",
    paragraph5: "Juntos, estamos a construir um ecossistema empresarial mais forte, inclusivo e competitivo, capaz de posicionar África como um continente de inovação, oportunidades e prosperidade.",
    paragraph6: "Obrigado pela sua visita. Esperamos caminhar consigo nesta jornada de transformação.",
    authorName: "Culpa Francisco Xavier Lissamo",
    authorRole: "Presidente e Fundador",
    authorOrg: "AfroBiz Network (ABN)",
    authorPhoto: "",
    cardBanner: "",
    quote: '"Conectando mentes, impulsionando negócios e transformando África e o Mundo."',
    joinCta: "Junte-se à Rede",
    exploreTeam: "Conhecer a Equipa"
  };

  const pm = { ...staticPm, ...(dynamicPm || {}) };

  const getInitials = (name: string) => {
    if (!name) return 'CL';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className={`${styles.section} ${showFullPageLayout ? styles.sectionFullPage : ''}`} id="mensagem-presidente">
      <div className={styles.container}>
        
        {/* Header Section */}
        <div className={styles.header}>
          <span className={styles.badge}>
            <span className={styles.badgeDot}></span>
            {pm.badge || "MENSAGEM DO PRESIDENTE"}
          </span>
          <h2 className={styles.mainTitle}>{pm.title}</h2>
          <div className={styles.titleUnderline}></div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.grid}>
          
          {/* Executive Profile Card */}
          <div className={styles.profileCard}>
            <div 
              className={styles.profileHeaderBg}
              style={pm.cardBanner ? { backgroundImage: `url(${pm.cardBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              <div className={styles.patternOverlay}></div>
            </div>
            
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarCircle}>
                {pm.authorPhoto ? (
                  <img src={pm.authorPhoto} alt={pm.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  <span className={styles.avatarInitials}>{getInitials(pm.authorName)}</span>
                )}
              </div>
              <div className={styles.verifiedBadge} title="Presidente & Fundador">
                ✓
              </div>
            </div>

            <div className={styles.profileBody}>
              <h3 className={styles.authorName}>{pm.authorName}</h3>
              <p className={styles.authorRole}>{pm.authorRole}</p>
              <p className={styles.authorOrg}>{pm.authorOrg}</p>

              <div className={styles.quoteCard}>
                <div className={styles.quoteIcon}>“</div>
                <p className={styles.quoteText}>{pm.quote}</p>
              </div>

              <div className={styles.cardActions}>
                <Link href="/registro" className={styles.btnPrimary}>
                  {pm.joinCta || "Junte-se à Rede"} →
                </Link>
                <Link href="/equipa" className={styles.btnOutline}>
                  {pm.exploreTeam || "Conhecer a Equipa"}
                </Link>
              </div>
            </div>
          </div>

          {/* Letter Body Column */}
          <div className={styles.letterContainer}>
            <div className={styles.decorativeQuoteMark}>”</div>
            
            <div className={styles.letterContent}>
              {pm.paragraph1 && (
                <p className={styles.greeting}>
                  <strong>{pm.paragraph1}</strong>
                </p>
              )}

              {pm.paragraph2 && (
                <p className={styles.paragraph}>
                  {pm.paragraph2}
                </p>
              )}

              {pm.paragraph3 && (
                <div className={styles.highlightBox}>
                  <p>
                    {pm.paragraph3}
                  </p>
                </div>
              )}

              {pm.paragraph4 && (
                <p className={styles.paragraph}>
                  {pm.paragraph4}
                </p>
              )}

              {pm.paragraph5 && (
                <p className={styles.paragraph}>
                  {pm.paragraph5}
                </p>
              )}

              <div className={styles.closingBox}>
                {pm.paragraph6 && (
                  <p className={styles.closingText}>
                    {pm.paragraph6}
                  </p>
                )}
                <div className={styles.signatureBlock}>
                  <div className={styles.signatureName}>{pm.authorName}</div>
                  <div className={styles.signatureTitle}>{pm.authorRole}</div>
                  <div className={styles.signatureCompany}>{pm.authorOrg}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
