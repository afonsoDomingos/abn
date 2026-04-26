'use client';

import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div 
        className={styles.background}
        style={{ backgroundImage: `linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.8)), url('/img01.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <motion.div 
          className={styles.circle1}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div 
          className={styles.circle2}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        ></motion.div>
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            Acelere o seu negócio africano 🌍
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            A Próxima Geração de <br />
            <span className="text-gradient-gold">Empreendedores Afro</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Impulsionamos startups e PMEs em África através de tecnologia, mentoria estratégica e acesso a capital.
          </motion.p>
          
          <motion.div 
            className={styles.cta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button className="btn-primary">Começar Agora</button>
            <button className="btn-outline">Ver Impacto</button>
          </motion.div>

          <motion.div 
            className={styles.promo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <span>🔥 OFERTA:</span> Website + Portfólio com 4 meses grátis
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
