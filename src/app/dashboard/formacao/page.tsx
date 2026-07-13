'use client';

import styles from '../Dashboard.module.css';

export default function FormacaoPage() {
  const courses = [
    { id: 1, title: 'Inovação e Modelos de Negócio Verdes', instructor: 'Prof. Amadou Diallo', duration: '12h', lessons: 8, status: 'Disponível' },
    { id: 2, title: 'Fundamentos de Pitching para Startups', instructor: 'Rita Santos (Mentora ABN)', duration: '6h', lessons: 4, status: 'Inscrito' },
    { id: 3, title: 'Gestão Financeira Inicial', instructor: 'Banco de Microfomento', duration: '15h', lessons: 10, status: 'Brevemente' }
  ];

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Academia & Formação</h1>
        <p style={{ opacity: 0.7 }}>Aceda a bootcamps, workshops e cursos certificados para acelerar o seu crescimento profissional.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {courses.map((course) => (
          <div key={course.id} className="glass" style={{ padding: '1.8rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>Curso de Aceleração</span>
              <h3 style={{ color: '#fff', margin: '4px 0 8px 0', fontSize: '1.2rem' }}>{course.title}</h3>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                <span>👨‍🏫 {course.instructor}</span>
                <span>⏱️ {course.duration}</span>
                <span>📚 {course.lessons} Aulas</span>
              </div>
            </div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: '40px',
              background: course.status === 'Disponível' ? 'var(--primary)' : course.status === 'Inscrito' ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.05)',
              color: course.status === 'Disponível' ? '#fff' : course.status === 'Inscrito' ? '#2ecc71' : 'rgba(255,255,255,0.4)',
              border: course.status === 'Inscrito' ? '1px solid #2ecc71' : 'none'
            }}>
              {course.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
