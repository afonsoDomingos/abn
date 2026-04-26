import styles from './HowItWorks.module.css';

const steps = [
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
];

export default function HowItWorks() {
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
