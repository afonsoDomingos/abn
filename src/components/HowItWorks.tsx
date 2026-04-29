'use client';

import { useEffect, useState } from 'react';
import styles from './HowItWorks.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function HowItWorks() {
  const { t, language } = useLanguage();
  const [steps, setSteps] = useState([
    {
      number: '01',
      title: 'Registo & Perfil',
      description: 'Crie a sua conta e defina o perfil do seu negócio em minutos.'
    },
    {
      number: '02',
      title: 'Diagnóstico',
      description: 'Avaliamos as necessidades da sua startup e sugerimos o melhor caminho.'
    },
    {
      number: '03',
      title: 'Crescimento',
      description: 'Aceda a mentorias, marketplace de serviços e rede de investidores.'
    },
    {
      number: '04',
      title: 'Escala Global',
      description: 'Expanda o seu negócio para novos mercados com suporte contínuo.'
    }
  ]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.how_it_works_content) {
          setSteps(data.configs.how_it_works_content);
        }
      });
  }, []);

  const getStepData = (index: number, defaultTitle: string, defaultDesc: string) => {
    if (language !== 'pt' && t.howItWorks.steps[index]) {
      return {
        title: t.howItWorks.steps[index].title,
        desc: t.howItWorks.steps[index].desc
      };
    }
    return { title: defaultTitle, desc: defaultDesc };
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{t.howItWorks.title}</h2>
          <p>{t.howItWorks.badge}</p>
        </div>
        
        <div className={styles.grid}>
          {steps.map((step, i) => {
            const data = getStepData(i, step.title, step.description);
            return (
              <div key={i} className={styles.stepCard}>
                <div className={styles.number}>{step.number}</div>
                <h3>{data.title}</h3>
                <p>{data.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
