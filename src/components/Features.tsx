'use client';

import { motion } from 'framer-motion';
import styles from './Features.module.css';

const features = [
  {
    title: 'Incubação Digital',
    desc: 'Programas intensivos de 3 a 6 meses para validar e escalar o seu modelo de negócio.',
    icon: '🚀'
  },
  {
    title: 'Marketing & Tech',
    desc: 'Criamos a sua presença digital profissional, desde websites a apps de alta performance.',
    icon: '💻'
  },
  {
    title: 'Rede de Mentores',
    desc: 'Conecte-se com líderes de indústria e especialistas prontos para guiar a sua jornada.',
    icon: '🤝'
  },
  {
    title: 'Acesso a Capital',
    desc: 'Preparamos o seu pitch e conectamos a sua startup a investidores anjo e VC.',
    icon: '💰'
  }
];

export default function Features() {
  return (
    <section className={styles.section} id="incubadora">
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Nossas Soluções</h2>
          <p className={styles.subtitle}>Tudo o que precisa para crescer num mercado dinâmico.</p>
        </motion.div>
        
        <div className={styles.grid}>
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              className={`${styles.card} glass`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className={styles.icon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
