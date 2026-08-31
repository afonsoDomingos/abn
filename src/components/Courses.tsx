'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Courses.module.css';
import { useLanguage } from '@/lib/LanguageContext';

interface Course {
  _id: string;
  title: string;
  instructor: string;
  duration: string;
  lessons: number;
  price: string;
  isPaid: boolean;
  desc: string;
  image?: string;
}

const DEFAULT_COVERS = [
  '/hero_entrepreneurs.png',
  '/mission_team.png',
  '/partners_hero.png',
  '/ADS01.jpg'
];

export default function Courses() {
  const { language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('user'));
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (courseTitle: string, id: string) => {
    const url = `${window.location.origin}/dashboard/formacao`;
    navigator.clipboard.writeText(`${courseTitle} - ABN Academia: ${url}`).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleShareWhatsApp = (course: Course) => {
    const url = `${window.location.origin}/dashboard/formacao`;
    const text = language === 'pt'
      ? `🎓 *${course.title}* - Curso na ABN Academia!\n\n${course.desc.slice(0, 140)}...\n\n💰 Valor: ${course.price}\n⏱️ Duração: ${course.duration}\n\n👉 Inscreva-se em: ${url}`
      : `🎓 *${course.title}* - ABN Academy Course!\n\n${course.desc.slice(0, 140)}...\n\n💰 Price: ${course.price}\n⏱️ Duration: ${course.duration}\n\n👉 Enroll at: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#0f172a', fontWeight: 600 }}>
        A carregar os cursos da Academia ABN...
      </div>
    );
  }

  return (
    <section className={styles.section} id="cursos">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badgeHeader}>
            {language === 'pt' ? 'Formação Executiva & Capacitação' : 'Executive Training & Capacity Building'}
          </span>
          <h2>{language === 'pt' ? 'Academia & Cursos Certificados' : 'Academy & Certified Courses'}</h2>
          <p>
            {language === 'pt' 
              ? 'Acelere o desenvolvimento da sua empresa ou startup com bootcamps e formações práticas ministradas por mentores especialistas.'
              : 'Accelerate your business or startup development with bootcamps and hands-on training led by expert mentors.'}
          </p>
        </div>

        <div className={styles.grid}>
          {courses.map((course, idx) => {
            const coverImage = course.image || DEFAULT_COVERS[idx % DEFAULT_COVERS.length];

            return (
              <div key={course._id} className={styles.card}>
                {/* Image Cover Container */}
                <div className={styles.imageContainer}>
                  <img src={coverImage} alt={course.title} className={styles.cardImage} />
                  <div className={styles.imageOverlay} />

                  <span className={styles.badgeTopLeft}>
                    {language === 'pt' ? 'Certificação ABN' : 'ABN Certificate'}
                  </span>

                  <span className={`${styles.priceTopRight} ${course.isPaid ? styles.paid : styles.free}`}>
                    {course.price}
                  </span>
                </div>

                {/* Content Body */}
                <div className={styles.cardContent}>
                  <h3 className={styles.title}>{course.title}</h3>
                  <p className={styles.desc}>
                    {course.desc.length > 110 ? `${course.desc.slice(0, 110)}...` : course.desc}
                  </p>

                  <div className={styles.meta}>
                    <span className={styles.metaItem}>{course.instructor}</span>
                    <span className={styles.metaItem}>{course.duration}</span>
                    <span className={styles.metaItem}>{course.lessons} {language === 'pt' ? 'Aulas' : 'Lessons'}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className={styles.cardFooter}>
                  <Link href={isLoggedIn ? "/dashboard/formacao" : "/login"} className={styles.enrollBtn}>
                    {language === 'pt' ? 'Quero Inscrever-me' : 'Enroll Now'}
                  </Link>

                  <div className={styles.shareGroup}>
                    <button
                      type="button"
                      className={styles.shareBtn}
                      onClick={() => handleCopyLink(course.title, course._id)}
                      title="Copiar link"
                    >
                      {copiedId === course._id ? 'Copiado!' : 'Copiar Link'}
                    </button>

                    <button
                      type="button"
                      className={styles.shareBtn}
                      style={{ background: '#25d366', color: '#ffffff', border: 'none' }}
                      onClick={() => handleShareWhatsApp(course)}
                      title="Partilhar no WhatsApp"
                    >
                      Partilhar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
