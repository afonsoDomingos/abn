'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import styles from './Equipa.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function TeamPage() {
  const { t } = useLanguage();
  const [team, setTeam] = useState<{ name: string, role: string, linkedin: string, image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.team_content) {
          setTeam(data.configs.team_content);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1>A Nossa Equipa</h1>
            <p>Conheça as pessoas que trabalham diariamente para impulsionar o seu negócio.</p>
          </div>
        </div>

        <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>A carregar equipa...</div>
          ) : team.length === 0 ? (
            <div className={styles.loading}>Nenhum membro da equipa registado.</div>
          ) : (
            <div className={styles.grid}>
              {team.map((member, idx) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} className={styles.image} />
                    ) : (
                      <div className={styles.placeholderImage}>👤</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.name}>{member.name}</h3>
                    <p className={styles.role}>{member.role}</p>
                    
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkedinBtn} title={`LinkedIn de ${member.name}`}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
