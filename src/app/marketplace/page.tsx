import Navbar from '@/components/Navbar';
import styles from './Marketplace.module.css';

const services = [
  {
    id: 1,
    title: 'Criação de Website Profissional',
    price: 'A partir de 150.000 KZ',
    description: 'Site responsivo, otimizado para SEO e com 4 meses de manutenção grátis.',
    category: 'Digital'
  },
  {
    id: 2,
    title: 'Design de Logotipo & Identidade',
    price: '75.000 KZ',
    description: 'Criação de marca única que reflete os valores do seu negócio.',
    category: 'Design'
  },
  {
    id: 3,
    title: 'Gestão de Redes Sociais',
    price: '50.000 KZ/mês',
    description: 'Planeamento e publicação de conteúdos estratégicos.',
    category: 'Marketing'
  },
  {
    id: 4,
    title: 'Consultoria de Negócios',
    price: '25.000 KZ/h',
    description: 'Apoio estratégico para expansão e estruturação.',
    category: 'Consultoria'
  }
];

export default function Marketplace() {
  return (
    <main className={styles.marketplace}>
      <Navbar />
      
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">Marketplace de Serviços</h1>
          <p>Encontre os melhores serviços para impulsionar o seu negócio.</p>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.filters}>
            <button className={styles.active}>Todos</button>
            <button>Digital</button>
            <button>Design</button>
            <button>Marketing</button>
          </div>

          <div className={styles.grid}>
            {services.map(service => (
              <div key={service.id} className={`${styles.card} glass`}>
                <span className={styles.category}>{service.category}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className={styles.footer}>
                  <span className={styles.price}>{service.price}</span>
                  <button className="btn-primary">Contratar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
