'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Courses.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Courses() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('user'));
  }, []);

  const courses = [
    {
      id: 'c1',
      title: language === 'pt' ? 'Inovação e Modelos de Negócio Verdes' : 'Green Business Model & Innovation',
      instructor: 'Prof. Amadou Diallo',
      duration: '12h',
      lessons: 8,
      price: language === 'pt' ? 'Gratuito' : 'Free',
      isPaid: false,
      desc: language === 'pt' 
        ? 'Aprenda a estruturar modelos de negócio circulares e sustentáveis adaptados ao mercado africano.'
        : 'Learn how to structure circular and sustainable business models tailored to the African market.'
    },
    {
      id: 'c2',
      title: language === 'pt' ? 'Fundamentos de Pitching para Startups' : 'Startup Pitching Fundamentals',
      instructor: 'Rita Santos (Mentora ABN)',
      duration: '6h',
      lessons: 4,
      price: '5.000 FCFA',
      isPaid: true,
      desc: language === 'pt'
        ? 'Domine a arte de apresentar a sua ideia de negócio a investidores e parceiros globais em poucos minutos.'
        : 'Master the art of presenting your business idea to global investors and partners in a few minutes.'
    },
    {
      id: 'c3',
      title: language === 'pt' ? 'Certificação em Gestão de Microfomento' : 'Micro-funding Management Certification',
      instructor: 'Banco de Microfomento',
      duration: '15h',
      lessons: 10,
      price: '15.000 FCFA',
      isPaid: true,
      desc: language === 'pt'
        ? 'Adquira competências financeiras e de compliance cruciais para gerir microcréditos e fundos de apoio.'
        : 'Acquire crucial financial and compliance skills to manage micro-credits and support funds.'
    }
  ];

  return (
    <section className={styles.section} id="cursos">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{language === 'pt' ? 'Academia & Cursos Certificados' : 'Academy & Certified Courses'}</h2>
          <p>
            {language === 'pt' 
              ? 'Acelere o desenvolvimento da sua startup com bootcamps e formações ministradas por especialistas.'
              : 'Accelerate your startup development with bootcamps and training led by industry experts.'}
          </p>
        </div>

        <div className={styles.grid}>
          {courses.map((course) => (
            <div key={course.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>{language === 'pt' ? 'Certificação' : 'Certification'}</span>
                <span className={`${styles.price} ${course.isPaid ? styles.paid : styles.free}`}>
                  {course.price}
                </span>
              </div>

              <div className={styles.cardContent}>
                <h3>{course.title}</h3>
                <p className={styles.desc}>{course.desc}</p>
                
                <div className={styles.meta}>
                  <span>👨‍🏫 {course.instructor}</span>
                  <span>⏱️ {course.duration}</span>
                  <span>📚 {course.lessons} {language === 'pt' ? 'Aulas' : 'Lessons'}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Link href={isLoggedIn ? "/dashboard/formacao" : "/login"} className={styles.enrollBtn}>
                  {language === 'pt' ? 'Quero Inscrever-me' : 'Enroll Now'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
