'use client';

import { useEffect, useState } from 'react';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([
    {
      name: 'João Silva',
      role: 'CEO, TechAfrica',
      text: 'A ABN mudou completamente a forma como abordamos o mercado global. O suporte em marketing foi fundamental.',
      img: '/Perfil04.jpg'
    },
    {
      name: 'Maria Santos',
      role: 'Fundadora, AgroEco',
      text: 'O programa de incubação ABN Spark ajudou-me a validar a minha ideia e a conseguir o primeiro investimento.',
      img: '/Perfil02.jpg'
    },
    {
      name: 'Carlos Oliveira',
      role: 'Investidor Anjo',
      text: 'Encontrei startups de alta qualidade através da plataforma. A curadoria da ABN é excelente.',
      img: '/Perfil05.jpg'
    }
  ]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.testimonials_content) {
          setTestimonials(data.configs.testimonials_content);
        }
      });
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>O que dizem sobre nós</h2>
        </div>
        
        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div key={i} className={`${styles.card} glass`}>
              <p className={styles.text}>"{t.text}"</p>
              <div className={styles.user}>
                <div 
                  className={styles.avatar}
                  style={{ backgroundImage: `url(${t.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
                <div className={styles.info}>
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
