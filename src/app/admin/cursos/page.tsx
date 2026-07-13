'use client';

import { useEffect, useState } from 'react';

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

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form/Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('');
  const [lessons, setLessons] = useState(1);
  const [price, setPrice] = useState('Gratuito');
  const [isPaid, setIsPaid] = useState(false);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
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

  const handleEditClick = (course: Course) => {
    setEditingId(course._id);
    setTitle(course.title);
    setInstructor(course.instructor);
    setDuration(course.duration);
    setLessons(course.lessons);
    setPrice(course.price);
    setIsPaid(course.isPaid);
    setDesc(course.desc);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setTitle('');
    setInstructor('');
    setDuration('');
    setLessons(1);
    setPrice('Gratuito');
    setIsPaid(false);
    setDesc('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id: editingId || undefined,
      title,
      instructor,
      duration,
      lessons: Number(lessons),
      price,
      isPaid,
      desc
    };

    const url = '/api/courses';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? 'Curso atualizado com sucesso!' : 'Curso criado com sucesso!');
        setShowForm(false);
        fetchCourses();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert('Erro de conexão ao salvar curso.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja excluir este curso permanentemente?')) return;

    try {
      const res = await fetch('/api/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Curso removido com sucesso!');
        fetchCourses();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      alert('Erro de conexão ao remover.');
    }
  };

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar cursos...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient-gold" style={{ fontSize: '2.2rem', fontFamily: 'Outfit' }}>Gestão da Academia ABN</h1>
          <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Crie, edite e remova cursos certificados e preços (Meticais/USD) exibidos aos empreendedores.</p>
        </div>
        <button className="btn-primary" onClick={handleCreateClick}>
          ➕ Adicionar Novo Curso
        </button>
      </header>

      {msg && (
        <div style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
          {msg}
        </div>
      )}

      {/* Grid of Courses */}
      {courses.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
          Nenhum curso registado na academia. Crie um novo curso clicando no botão acima.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {courses.map(course => (
            <div key={course._id} className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Curso Certificado</span>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', fontFamily: 'Outfit', margin: '4px 0 0 0' }}>{course.title}</h3>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: course.isPaid ? 'rgba(255,107,0,0.15)' : 'rgba(46,204,113,0.15)',
                  color: course.isPaid ? 'var(--primary)' : '#2ecc71'
                }}>
                  {course.price}
                </span>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                {course.desc}
              </p>

              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: 'auto' }}>
                <div>👨‍🏫 Instrutor: <span style={{ color: '#fff' }}>{course.instructor}</span></div>
                <div>⏱️ Duração: <span style={{ color: '#fff' }}>{course.duration}</span></div>
                <div>📚 Aulas: <span style={{ color: '#fff' }}>{course.lessons}</span></div>
              </div>

              {/* Edit/Delete Actions */}
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button
                  onClick={() => handleEditClick(course)}
                  style={{ flex: 1, padding: '8px 0', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  style={{ flex: 1, padding: '8px 0', border: 'none', background: '#e74c3c', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  🗑️ Excluir
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass" style={{ maxWidth: '550px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', fontSize: '1.5rem', cursor: 'pointer' }}
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '1.5rem' }}>
              {editingId ? 'Editar Curso' : 'Adicionar Novo Curso'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Título do Curso *</label>
                <input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Instrutor *</label>
                  <input 
                    value={instructor} 
                    onChange={e => setInstructor(e.target.value)} 
                    required 
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Duração (ex: 12h) *</label>
                  <input 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)} 
                    required 
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Aulas *</label>
                  <input 
                    type="number"
                    value={lessons} 
                    onChange={e => setLessons(Number(e.target.value))} 
                    required 
                    min={1}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Preço (ex: 5.000 MT) *</label>
                  <input 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    required 
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1.2rem' }}>
                  <input 
                    type="checkbox"
                    checked={isPaid} 
                    onChange={e => setIsPaid(e.target.checked)} 
                    id="isPaidCheck"
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="isPaidCheck" style={{ fontSize: '0.75rem', color: '#fff', cursor: 'pointer' }}>Curso Pago</label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Descrição *</label>
                <textarea 
                  value={desc} 
                  onChange={e => setDesc(e.target.value)} 
                  required 
                  rows={4}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '0.5rem' }}>
                {saving ? 'A guardar...' : 'Guardar Curso'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
