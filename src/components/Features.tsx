import styles from './Features.module.css';

const features = [
  {
    title: 'Incubadora Digital',
    description: 'Programas de aceleração personalizados para transformar a sua ideia num negócio rentável.',
    icon: '🚀'
  },
  {
    title: 'Marketing & Portfólio',
    description: 'Criamos a sua presença online com sites profissionais e portfólios que atraem clientes.',
    icon: '🎨'
  },
  {
    title: 'Networking Global',
    description: 'Conecte-se com uma rede vasta de investidores, mentores e parceiros estratégicos.',
    icon: '🤝'
  },
  {
    title: 'Formação Contínua',
    description: 'Acesso exclusivo a cursos, workshops e recursos educativos de alta qualidade.',
    icon: '📚'
  }
];

export default function Features() {
  return (
    <section className={styles.features} id="incubadora">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.subtitle}>O que oferecemos</h2>
          <h3 className={styles.title}>Soluções Integradas para o seu <br /><span className="text-gradient-gold">Crescimento</span></h3>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={`${styles.card} glass`}>
              <div className={styles.icon}>{feature.icon}</div>
              <h4 className={styles.featureTitle}>{feature.title}</h4>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
