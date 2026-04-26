import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>
      
      <div className={styles.content}>
        <span className={styles.badge}>O Futuro do Empreendedorismo Africano</span>
        <h1 className={styles.title}>
          Impulsionando Startups e <br />
          <span className="text-gradient-gold">PMEs em África</span>
        </h1>
        <p className={styles.description}>
          A ABN – AfroBiz Network é a sua ponte para o sucesso digital. Conectamos empreendedores a mentores, investidores e recursos estratégicos para transformar ideias em impacto global.
        </p>
        
        <div className={styles.ctas}>
          <button className="btn-primary">Começar Agora</button>
          <button className="btn-outline">Saber Mais</button>
        </div>

        <div className={styles.promo}>
          <div className={styles.promoIcon}>✨</div>
          <p>Oferta Especial: <strong>Site + Portfólio com 4 meses grátis</strong> para novos membros.</p>
        </div>
      </div>
    </section>
  );
}
