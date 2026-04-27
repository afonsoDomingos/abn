'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
  const [content, setContent] = useState({
    title: 'Impulsionando Startups e PMEs em África',
    description: 'A ABN – AfroBiz Network é a sua ponte para o sucesso digital. Conectamos empreendedores a mentores, investidores e recursos estratégicos para transformar ideias em impacto global.'
  });

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.hero_content) {
          setContent(data.configs.hero_content);
        }
      });
  }, []);

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
            {content.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {content.description}
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
