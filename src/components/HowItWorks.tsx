'use client';

import { useEffect, useState } from 'react';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
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

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Como Funciona a ABN</h2>
          <p>Um ecossistema desenhado para o sucesso do empreendedor africano.</p>
        </div>
        
        <div className={styles.grid}>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.number}>{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
