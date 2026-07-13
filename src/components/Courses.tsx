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
}

export default function Courses() {
  const { language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#1c1917' }}>Loading academy courses...</div>;

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
            <div key={course._id} className={styles.card}>
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
