import Navbar from '@/components/Navbar';
import styles from './Profile.module.css';

export default function BusinessProfile({ params }: { params: { id: string } }) {
  // Mock data
  const business = {
    name: 'TechAfrica Solutions',
    category: 'Desenvolvimento de Software',
    description: 'Especialistas em transformar processos analógicos em experiências digitais de alta performance para o mercado africano.',
    services: ['Criação de Web Apps', 'Consultoria Cloud', 'UI/UX Design'],
    stats: { projects: 12, rating: 4.9, clients: 8 },
    location: 'Luanda, Angola',
    website: 'www.techafrica.co.ao',
    logo: '/perfil09.jpg'
  };

  return (
    <main className={styles.profilePage}>
      <Navbar />
      
      <div className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <div 
              className={styles.logoBox}
              style={{ backgroundImage: `url(${business.logo})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' }}
            >
              TA
            </div>
            <div className={styles.headerInfo}>
              <h1>{business.name}</h1>
              <p className={styles.category}>{business.category}</p>
              <div className={styles.badges}>
                <span>📍 {business.location}</span>
                <span>⭐ {business.stats.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.mainInfo}>
            <section className={`${styles.section} glass`}>
              <h2>Sobre a Empresa</h2>
              <p>{business.description}</p>
            </section>

            <section className={`${styles.section} glass`}>
              <h2>Serviços</h2>
              <ul className={styles.servicesList}>
                {business.services.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </section>

            <section className={`${styles.section} glass`}>
              <h2>Portfólio</h2>
              <div className={styles.portfolioGrid}>
                <div className={styles.portfolioItem}></div>
                <div className={styles.portfolioItem}></div>
                <div className={styles.portfolioItem}></div>
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={`${styles.contactCard} glass`}>
              <h3>Interessado?</h3>
              <p>Solicite um orçamento ou agende uma reunião.</p>
              <button className="btn-primary" style={{ width: '100%' }}>Enviar Mensagem</button>
              <a href={`https://${business.website}`} className={styles.webLink}>{business.website}</a>
            </div>
            
            <div className={styles.statsCard}>
              <div className={styles.stat}>
                <strong>{business.stats.projects}</strong>
                <span>Projectos</span>
              </div>
              <div className={styles.stat}>
                <strong>{business.stats.clients}</strong>
                <span>Clientes</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
