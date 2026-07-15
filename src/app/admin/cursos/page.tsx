'use client';

import { useEffect, useState } from 'react';

interface Lesson {
  title: string;
  videoUrl: string;
  _id?: string;
}

interface Course {
  _id: string;
  title: string;
  instructor: string;
  duration: string;
  lessons: number;
  price: string;
  isPaid: boolean;
  desc: string;
  videoUrl?: string;
  videoVisible?: boolean;
  lessonsList?: Lesson[];
  certBgColor?: string;
  certTextColor?: string;
  certUsePartnerLogos?: boolean;
  certPartnerLogoUrl?: string;
}

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form/Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('');
  const [lessons, setLessons] = useState(1);
  const [price, setPrice] = useState('Gratuito');
  const [isPaid, setIsPaid] = useState(false);
  const [desc, setDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoVisible, setVideoVisible] = useState(true);
  const [certBgColor, setCertBgColor] = useState('#ff6b00');
  const [certTextColor, setCertTextColor] = useState('#1c1917');
  const [certUsePartnerLogos, setCertUsePartnerLogos] = useState(false);
  const [certPartnerLogoUrl, setCertPartnerLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [lessonsList, setLessonsList] = useState<Lesson[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonUrl, setNewLessonUrl] = useState('');

  // Participants list states
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedCourseForParticipants, setSelectedCourseForParticipants] = useState<Course | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const handleViewParticipants = async (course: Course) => {
    setSelectedCourseForParticipants(course);
    setShowParticipantsModal(true);
    setLoadingParticipants(true);
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.success) {
        const courseEnrollments = (data.payments || []).filter(
          (p: any) => p.itemName.toLowerCase() === course.title.toLowerCase()
        );
        setParticipants(courseEnrollments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Step validations
  const isStep1Valid = title.trim() !== '' && desc.trim() !== '';
  const isStep2Valid = instructor.trim() !== '' && duration.trim() !== '' && Number(lessons) >= 1 && price.trim() !== '';


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
    setVideoUrl(course.videoUrl || '');
    setVideoVisible(course.videoVisible !== false);
    setLessonsList(course.lessonsList || []);
    setCertBgColor(course.certBgColor || '#ff6b00');
    setCertTextColor(course.certTextColor || '#1c1917');
    setCertUsePartnerLogos(course.certUsePartnerLogos === true);
    setCertPartnerLogoUrl(course.certPartnerLogoUrl || '');
    setNewLessonTitle('');
    setNewLessonUrl('');
    setCurrentStep(1);
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
    setVideoUrl('');
    setVideoVisible(true);
    setLessonsList([]);
    setCertBgColor('#ff6b00');
    setCertTextColor('#1c1917');
    setCertUsePartnerLogos(false);
    setCertPartnerLogoUrl('');
    setNewLessonTitle('');
    setNewLessonUrl('');
    setCurrentStep(1);
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
      desc,
      videoUrl,
      videoVisible,
      lessonsList,
      certBgColor,
      certTextColor,
      certUsePartnerLogos,
      certPartnerLogoUrl
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

              {/* Actions: View participants, Edit, Delete */}
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
                <button
                  onClick={() => handleViewParticipants(course)}
                  style={{ flex: 1, padding: '8px 0', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  👥 Inscritos
                </button>
                <button
                  onClick={() => handleEditClick(course)}
                  style={{ flex: 1, padding: '8px 0', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  style={{ flex: 1, padding: '8px 0', border: 'none', background: '#e74c3c', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
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
          <div className="glass" style={{ 
            maxWidth: '550px', 
            width: '100%', 
            margin: 'auto', 
            padding: '2.5rem', 
            borderRadius: '24px', 
            position: 'relative',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            
            <div style={{ flexShrink: 0, marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', margin: 0 }}>
                {editingId ? 'Editar Curso' : 'Adicionar Novo Curso'}
              </h2>
              
              {/* Progress indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                <div style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  left: '0', 
                  width: `${((currentStep - 1) / 3) * 100}%`, 
                  height: '2px', 
                  background: 'var(--primary)', 
                  zIndex: 0, 
                  transition: 'width 0.3s ease-in-out' 
                }} />
                
                {[1, 2, 3, 4].map((step) => {
                  const stepNames = ["Geral", "Detalhes", "Mídia", "Certificado"];
                  const isActive = step <= currentStep;
                  return (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isActive ? 'var(--primary)' : '#1e1e1e',
                        border: `2px solid ${isActive ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease',
                        boxShadow: isActive ? '0 0 12px rgba(255, 107, 0, 0.4)' : 'none'
                      }}>
                        {step}
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.4)', 
                        marginTop: '6px', 
                        fontWeight: 600,
                        transition: 'color 0.3s ease'
                      }}>
                        {stepNames[step - 1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              
              {/* Form Content Area: Scrollable if too long, to ensure Save button is never cut off */}
              <div style={{ overflowY: 'auto', paddingRight: '4px', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
                {currentStep === 1 && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Título do Curso *</label>
                      <input 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        required 
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Descrição *</label>
                      <textarea 
                        value={desc} 
                        onChange={e => setDesc(e.target.value)} 
                        required 
                        rows={5}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
                      />
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
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
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    {/* Lesson builder section */}
                    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>📚 Aulas do Curso ({lessonsList.length})</label>
                      
                      {/* Current lessons list */}
                      {lessonsList.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', margin: 0 }}>Nenhuma aula adicionada a este curso de momento.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
                          {lessonsList.map((lesson, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 12px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', flex: 1, marginRight: '10px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idx + 1}. {lesson.title}</span>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.videoUrl}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setLessonsList(prev => prev.filter((_, i) => i !== idx))}
                                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '4px 8px', fontSize: '0.9rem' }}
                                title="Remover aula"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add new lesson fields */}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Título da Aula</label>
                          <input 
                            value={newLessonTitle}
                            onChange={e => setNewLessonTitle(e.target.value)}
                            placeholder="Ex: Aula 1: Introdução ao Curso"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 10px', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>URL do Vídeo (YouTube Embed)</label>
                          <input 
                            value={newLessonUrl}
                            onChange={e => setNewLessonUrl(e.target.value)}
                            placeholder="Ex: https://www.youtube.com/embed/VIDEO_ID"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 10px', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!newLessonTitle.trim() || !newLessonUrl.trim()) return;
                            setLessonsList(prev => [...prev, { title: newLessonTitle.trim(), videoUrl: newLessonUrl.trim() }]);
                            setNewLessonTitle('');
                            setNewLessonUrl('');
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'background 0.2s',
                            textAlign: 'center'
                          }}
                        >
                          ➕ Adicionar Aula à Lista
                        </button>
                      </div>
                    </div>

                    {/* Video Visibility Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px' }}>
                      <div>
                        <p style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>
                          👁️ Visibilidade das Aulas
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.45)', margin: '2px 0 0 0', fontSize: '0.75rem' }}>
                          {videoVisible ? 'Os vídeos estão visíveis para os alunos inscritos' : 'Os vídeos estão ocultos para todos os alunos'}
                        </p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', cursor: 'pointer', flexShrink: 0 }}>
                        <input
                          type="checkbox"
                          checked={videoVisible}
                          onChange={e => setVideoVisible(e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                        />
                        <span style={{
                          position: 'absolute', inset: 0, borderRadius: '28px', transition: '0.3s',
                          background: videoVisible ? 'var(--primary)' : 'rgba(255,255,255,0.15)'
                        }} />
                        <span style={{
                          position: 'absolute', top: '4px', left: videoVisible ? '28px' : '4px',
                          width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: '0.3s'
                        }} />
                      </label>
                    </div>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Personalização do Certificado</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Cor do Destaque (Borda/Títulos)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input 
                            type="color" 
                            value={certBgColor} 
                            onChange={e => setCertBgColor(e.target.value)}
                            style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                          />
                          <input 
                            type="text" 
                            value={certBgColor} 
                            onChange={e => setCertBgColor(e.target.value)}
                            placeholder="#ff6b00"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', flex: 1, fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Cor do Texto do Aluno</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input 
                            type="color" 
                            value={certTextColor} 
                            onChange={e => setCertTextColor(e.target.value)}
                            style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                          />
                          <input 
                            type="text" 
                            value={certTextColor} 
                            onChange={e => setCertTextColor(e.target.value)}
                            placeholder="#1c1917"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', flex: 1, fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', marginTop: '0.5rem' }}>
                      <div>
                        <p style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>
                          🤝 Logótipo de Parceiro
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.45)', margin: '2px 0 0 0', fontSize: '0.75rem' }}>
                          Ative para exibir o logótipo de um parceiro oficial no certificado
                        </p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', cursor: 'pointer', flexShrink: 0 }}>
                        <input
                          type="checkbox"
                          checked={certUsePartnerLogos}
                          onChange={e => setCertUsePartnerLogos(e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                        />
                        <span style={{
                          position: 'absolute', inset: 0, borderRadius: '28px', transition: '0.3s',
                          background: certUsePartnerLogos ? 'var(--primary)' : 'rgba(255,255,255,0.15)'
                        }} />
                        <span style={{
                          position: 'absolute', top: '4px', left: certUsePartnerLogos ? '28px' : '4px',
                          width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: '0.3s'
                        }} />
                      </label>
                    </div>

                    {certUsePartnerLogos && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.2rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Logótipo do Parceiro (Ficheiro de Imagem)</label>
                        
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={async (e) => {
                              const selectedFile = e.target.files?.[0];
                              if (!selectedFile) return;
                              setUploadingLogo(true);
                              
                              const formData = new FormData();
                              formData.append('file', selectedFile);
                              
                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData
                                });
                                const data = await res.json();
                                if (data.success && data.url) {
                                  setCertPartnerLogoUrl(data.url);
                                } else {
                                  alert(data.error || 'Erro no envio da imagem.');
                                }
                              } catch (err) {
                                alert('Erro de ligação ao servidor.');
                              } finally {
                                setUploadingLogo(false);
                              }
                            }}
                            style={{ display: 'block', fontSize: '0.85rem' }}
                          />

                          {uploadingLogo && <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>A carregar...</span>}
                          
                          {certPartnerLogoUrl && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <img src={certPartnerLogoUrl} alt="Preview Partner Logo" style={{ height: '40px', maxWidth: '120px', objectFit: 'contain' }} />
                              <button 
                                type="button" 
                                onClick={() => setCertPartnerLogoUrl('')}
                                style={{ background: 'none', border: 'none', color: '#ff4d4d', fontSize: '0.7rem', cursor: 'pointer', marginTop: '4px', fontWeight: 700 }}
                              >
                                Remover
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Navigation Footer: Sticky to bottom, never hidden */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', flexShrink: 0 }}>
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    style={{ 
                      padding: '12px 24px', 
                      background: 'rgba(0, 0, 0, 0.05)', 
                      border: '1px solid rgba(0, 0, 0, 0.1)', 
                      color: '#1c1917', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: 600,
                      transition: 'background 0.2s'
                    }}
                  >
                    Voltar
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    disabled={currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false}
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="btn-primary"
                    style={{ 
                      borderRadius: '8px',
                      opacity: (currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false) ? 0.5 : 1,
                      cursor: (currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Seguinte
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={saving} 
                    style={{ borderRadius: '8px' }}
                  >
                    {saving ? 'A guardar...' : 'Guardar Curso'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipantsModal && selectedCourseForParticipants && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass" style={{ maxWidth: '750px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '85vh', overflow: 'hidden' }}>
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', fontSize: '1.8rem', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => { setShowParticipantsModal(false); setSelectedCourseForParticipants(null); setParticipants([]); }}
            >
              &times;
            </button>
            
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', margin: '0 0 0.2rem 0' }}>Alunos Inscritos</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Curso: {selectedCourseForParticipants.title}</p>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {loadingParticipants ? (
                <p style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>A carregar alunos...</p>
              ) : participants.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>Nenhum aluno registado ou aprovado neste curso ainda.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                      <th style={{ padding: '10px 8px' }}>Aluno</th>
                      <th style={{ padding: '10px 8px' }}>Contacto / Telefone</th>
                      <th style={{ padding: '10px 8px' }}>Empresa / Startup</th>
                      <th style={{ padding: '10px 8px' }}>Estado</th>
                      <th style={{ padding: '10px 8px' }}>Progresso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, idx) => {
                      let progressText = 'Iniciado';
                      let progressColor = '#3498db';
                      if (p.completed) {
                        progressText = 'Concluído 🎉';
                        progressColor = '#2ecc71';
                      }
                      if (p.certificateRequested) {
                        progressText = 'Certificado Solicitado 🎓';
                        progressColor = '#f1c40f';
                      }

                      return (
                        <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
                          <td style={{ padding: '12px 8px' }}>
                            <div style={{ fontWeight: 600 }}>{p.user?.name || 'Utilizador Desconhecido'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{p.user?.email}</div>
                          </td>
                          <td style={{ padding: '12px 8px', color: 'rgba(255,255,255,0.8)' }}>
                            {p.phone || <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>N/A</span>}
                          </td>
                          <td style={{ padding: '12px 8px', color: 'rgba(255,255,255,0.8)' }}>
                            {p.company || <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>N/A</span>}
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 700, 
                              textTransform: 'uppercase',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: p.status === 'aprovado' ? 'rgba(46,204,113,0.15)' : p.status === 'pendente' ? 'rgba(241,196,15,0.15)' : 'rgba(231,76,60,0.15)',
                              color: p.status === 'aprovado' ? '#2ecc71' : p.status === 'pendente' ? '#f1c40f' : '#e74c3c'
                            }}>
                              {p.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', color: progressColor, fontWeight: 600 }}>
                            {progressText}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn-primary" 
                style={{ borderRadius: '8px', padding: '10px 20px', fontSize: '0.85rem' }} 
                onClick={() => { setShowParticipantsModal(false); setSelectedCourseForParticipants(null); setParticipants([]); }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
