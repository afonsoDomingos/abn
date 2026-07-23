'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Users, Eye, EyeOff, Video, Award, CheckCircle, FileText, X, FileUp, Check } from 'lucide-react';

interface Lesson {
  title: string;
  videoUrl: string;
  pdfUrl?: string;
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
  paymentInstructions?: string;
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
  
  // Lesson management states (Add & Edit lessons)
  const [lessonsList, setLessonsList] = useState<Lesson[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [newLessonPdfUrl, setNewLessonPdfUrl] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [editingLessonIdx, setEditingLessonIdx] = useState<number | null>(null);

  const [paymentInstructions, setPaymentInstructions] = useState(
    '🏦 Dados Bancários ABN para Transferência:\nBanco: Millennium BIM\nConta (NIB): 0001-0000-0012-3456-1\nTitular: AfroBiz Network Lda.\n\n📱 M-Pesa: 84 123 4567\n\n* Por favor, realize a transferência e faça upload do comprovativo.'
  );

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
          (p: any) => p.itemName?.toLowerCase().trim() === course.title?.toLowerCase().trim()
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
    setPaymentInstructions(course.paymentInstructions || '🏦 Dados Bancários ABN para Transferência:\nBanco: Millennium BIM\nConta (NIB): 0001-0000-0012-3456-1\nTitular: AfroBiz Network Lda.\n\n📱 M-Pesa: 84 123 4567\n\n* Por favor, realize a transferência e faça upload do comprovativo.');
    setNewLessonTitle('');
    setNewLessonUrl('');
    setNewLessonPdfUrl('');
    setEditingLessonIdx(null);
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
    setNewLessonPdfUrl('');
    setEditingLessonIdx(null);
    setCurrentStep(1);
    setShowForm(true);
  };

  const handleSaveLesson = () => {
    if (!newLessonTitle.trim() || !newLessonUrl.trim()) {
      alert('Por favor preencha pelo menos o Título e a URL do Vídeo da aula.');
      return;
    }

    const lessonObj: Lesson = {
      title: newLessonTitle.trim(),
      videoUrl: newLessonUrl.trim(),
      pdfUrl: newLessonPdfUrl.trim() || undefined
    };

    if (editingLessonIdx !== null) {
      // Update existing lesson
      setLessonsList(prev => prev.map((l, i) => i === editingLessonIdx ? lessonObj : l));
      setEditingLessonIdx(null);
    } else {
      // Add new lesson
      setLessonsList(prev => [...prev, lessonObj]);
    }

    setNewLessonTitle('');
    setNewLessonUrl('');
    setNewLessonPdfUrl('');
  };

  const handleEditLessonStart = (idx: number) => {
    const target = lessonsList[idx];
    if (!target) return;
    setEditingLessonIdx(idx);
    setNewLessonTitle(target.title);
    setNewLessonUrl(target.videoUrl);
    setNewLessonPdfUrl(target.pdfUrl || '');
  };

  const handleCancelLessonEdit = () => {
    setEditingLessonIdx(null);
    setNewLessonTitle('');
    setNewLessonUrl('');
    setNewLessonPdfUrl('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      return;
    }
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
      certPartnerLogoUrl,
      paymentInstructions
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
        setMsg(editingId ? 'Curso e conteúdos atualizados com sucesso!' : 'Curso criado com sucesso!');
        setShowForm(false);
        fetchCourses();
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao guardar curso.');
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

  if (loading) return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar gestão de cursos...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1240px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            Gestão da Academia ABN
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Edite os links das aulas, atualize vídeos, anexe PDFs de apoio aos conteúdos e defina os certificados.
          </p>
        </div>
        <button 
          onClick={handleCreateClick}
          style={{
            padding: '12px 24px',
            fontSize: '0.9rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} /> Adicionar Novo Curso
        </button>
      </header>

      {msg && (
        <div style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '1rem 1.25rem', borderRadius: '14px', marginBottom: '2rem', fontWeight: 700, fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      {/* Grid of Courses */}
      {courses.length === 0 ? (
        <div style={{ padding: '3.5rem 2rem', borderRadius: '20px', textAlign: 'center', color: '#64748b', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)', fontWeight: 500 }}>
          Nenhum curso registado na academia. Crie um novo curso clicando no botão acima.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {courses.map(course => {
            const lessonCount = course.lessonsList && course.lessonsList.length > 0 ? course.lessonsList.length : (course.lessons || 1);
            const pdfCount = (course.lessonsList || []).filter(l => !!l.pdfUrl).length;

            return (
              <div 
                key={course._id} 
                style={{ 
                  padding: '1.8rem', 
                  borderRadius: '20px', 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.2rem' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#ff6b00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Curso Certificado</span>
                    <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: 800, margin: '4px 0 0 0' }}>{course.title}</h3>
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '50px',
                    background: course.isPaid ? '#eff6ff' : '#f0fdf4',
                    color: course.isPaid ? '#2563eb' : '#16a34a',
                    border: `1px solid ${course.isPaid ? '#bfdbfe' : '#bbf7d0'}`
                  }}>
                    {course.price}
                  </span>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.desc}
                </p>

                <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>👨‍🏫 <strong>Formador:</strong> {course.instructor}</span>
                    <span>⏱️ <strong>Duração:</strong> {course.duration}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#ff6b00' }}>📚 <strong>{lessonCount} Aulas</strong> {pdfCount > 0 && <span style={{ color: '#2563eb', marginLeft: '4px' }}>({pdfCount} PDFs 📄)</span>}</span>
                    <span style={{ fontSize: '0.75rem', color: course.videoVisible !== false ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                      {course.videoVisible !== false ? '👁️ Vídeos Visíveis' : '🔒 Vídeos Ocultos'}
                    </span>
                  </div>
                </div>

                {/* Actions: View participants, Edit, Delete */}
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleViewParticipants(course)}
                    style={{ flex: 1, padding: '10px 0', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                  >
                    <Users size={15} color="#ff6b00" /> Inscritos
                  </button>
                  <button
                    onClick={() => handleEditClick(course)}
                    style={{ flex: 1, padding: '10px 0', border: '1px solid #ff6b00', background: '#fff7ed', color: '#ff6b00', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                  >
                    <Edit size={15} /> Gerir Aulas & PDFs
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    style={{ padding: '10px 14px', border: 'none', background: '#fef2f2', color: '#dc2626', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
                    title="Excluir Curso"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ 
            maxWidth: '680px', 
            width: '100%', 
            margin: 'auto', 
            padding: '2.5rem', 
            borderRadius: '24px', 
            position: 'relative',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <button 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontSize: '1.4rem', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            
            <div style={{ flexShrink: 0, marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: 800, margin: 0 }}>
                {editingId ? 'Gerir Conteúdos do Curso' : 'Adicionar Novo Curso'}
              </h2>
              
              {/* Interactive Step Circles */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0 }} />
                <div style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  left: '0', 
                  width: `${((currentStep - 1) / 3) * 100}%`, 
                  height: '2px', 
                  background: '#ff6b00', 
                  zIndex: 0, 
                  transition: 'width 0.3s ease-in-out' 
                }} />
                
                {[1, 2, 3, 4].map((step) => {
                  const stepNames = ["Geral", "Preço & Dados", "Aulas & PDFs", "Certificado"];
                  const isActive = step <= currentStep;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setCurrentStep(step)}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        zIndex: 1, 
                        position: 'relative',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: isActive ? '#ff6b00' : '#ffffff',
                        border: `2px solid ${isActive ? '#ff6b00' : '#cbd5e1'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#ffffff' : '#64748b',
                        fontWeight: 'bold',
                        fontSize: '0.88rem',
                        transition: 'all 0.3s ease',
                        boxShadow: isActive ? '0 4px 12px rgba(255, 107, 0, 0.3)' : 'none'
                      }}>
                        {step}
                      </div>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        color: isActive ? '#0f172a' : '#94a3b8', 
                        marginTop: '6px', 
                        fontWeight: 700,
                        transition: 'color 0.3s ease'
                      }}>
                        {stepNames[step - 1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form 
              onSubmit={e => {
                e.preventDefault();
                handleSubmit(e);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
                  e.preventDefault();
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
            >
              
              {/* Form Content Area */}
              <div style={{ overflowY: 'auto', paddingRight: '4px', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
                {currentStep === 1 && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Título do Curso *</label>
                      <input 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        required 
                        placeholder="Ex: Gestão Financeira para Startups"
                        style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.92rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Descrição Completa *</label>
                      <textarea 
                        value={desc} 
                        onChange={e => setDesc(e.target.value)} 
                        required 
                        rows={5}
                        placeholder="Escreva a apresentação e os objetivos deste curso..."
                        style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.92rem', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Formador / Instrutor *</label>
                        <input 
                          value={instructor} 
                          onChange={e => setInstructor(e.target.value)} 
                          required 
                          placeholder="Ex: Dr. Afonso Domingos"
                          style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.92rem', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Duração (ex: 12h) *</label>
                        <input 
                          value={duration} 
                          onChange={e => setDuration(e.target.value)} 
                          required 
                          placeholder="Ex: 12h ou 4 Semanas"
                          style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.92rem', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Total Aulas *</label>
                        <input 
                          type="number"
                          value={lessons} 
                          onChange={e => setLessons(Number(e.target.value))} 
                          required 
                          min={1}
                          style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.92rem', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Preço (ex: 5.000 MT) *</label>
                        <input 
                          value={price} 
                          onChange={e => setPrice(e.target.value)} 
                          required 
                          placeholder="Gratuito ou 5.000 MT"
                          style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.92rem', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1.2rem' }}>
                        <input 
                          type="checkbox"
                          checked={isPaid} 
                          onChange={e => setIsPaid(e.target.checked)} 
                          id="isPaidCheck"
                          style={{ width: '18px', height: '18px', accentColor: '#ff6b00', cursor: 'pointer' }}
                        />
                        <label htmlFor="isPaidCheck" style={{ fontSize: '0.85rem', color: '#0f172a', cursor: 'pointer', fontWeight: 700 }}>Curso Pago</label>
                      </div>
                    </div>

                    {isPaid && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>💳 Instruções de Pagamento Bancário & M-Pesa</label>
                        <textarea
                          value={paymentInstructions}
                          onChange={e => setPaymentInstructions(e.target.value)}
                          rows={5}
                          placeholder={'🏦 Dados Bancários ABN:\nBanco: Millennium BIM\nConta: ...\n\n📱 M-Pesa: ...'}
                          style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.88rem', outline: 'none', lineHeight: '1.6' }}
                        />
                      </div>
                    )}
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    {/* Lesson builder section */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.4rem', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          📚 Aulas & Ficheiros PDF ({lessonsList.length})
                        </label>
                        <span style={{ fontSize: '0.78rem', color: '#ff6b00', fontWeight: 700 }}>Vídeos Embed & Apoio PDF</span>
                      </div>
                      
                      {/* Current lessons list */}
                      {lessonsList.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                          Nenhuma aula específica adicionada ainda. Adicione abaixo cada vídeo e PDF da formação.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '190px', overflowY: 'auto', paddingRight: '4px' }}>
                          {lessonsList.map((lesson, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: editingLessonIdx === idx ? '2px solid #ff6b00' : '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 14px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', flex: 1, marginRight: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idx + 1}. {lesson.title}</span>
                                  {lesson.pdfUrl && <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '1px 7px', borderRadius: '50px', fontWeight: 800, border: '1px solid #bfdbfe' }}>📄 PDF</span>}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.videoUrl}</span>
                              </div>
                              
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleEditLessonStart(idx)}
                                  style={{ background: '#fff7ed', border: '1px solid #ff6b00', color: '#ff6b00', cursor: 'pointer', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Edit size={13} /> Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLessonsList(prev => prev.filter((_, i) => i !== idx))}
                                  style={{ background: '#fef2f2', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}
                                  title="Remover aula"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add or Edit lesson fields */}
                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: editingLessonIdx !== null ? '#ff6b00' : '#475569' }}>
                            {editingLessonIdx !== null ? `✏️ Editar Aula #${editingLessonIdx + 1}` : '➕ Adicionar Nova Aula ao Curso'}
                          </span>
                          {editingLessonIdx !== null && (
                            <button
                              type="button"
                              onClick={handleCancelLessonEdit}
                              style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Cancelar Edição
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Título da Aula *</label>
                          <input 
                            value={newLessonTitle}
                            onChange={e => setNewLessonTitle(e.target.value)}
                            placeholder="Ex: Aula 1: Introdução à Estratégia de Vendas"
                            style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', padding: '10px 12px', borderRadius: '8px', color: '#0f172a', fontSize: '0.88rem', outline: 'none' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>URL do Vídeo (YouTube Embed Link) *</label>
                          <input 
                            value={newLessonUrl}
                            onChange={e => setNewLessonUrl(e.target.value)}
                            placeholder="Ex: https://www.youtube.com/embed/VIDEO_ID"
                            style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', padding: '10px 12px', borderRadius: '8px', color: '#0f172a', fontSize: '0.88rem', outline: 'none' }}
                          />
                        </div>

                        {/* PDF Attachment Field */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '10px 14px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📄 Anexar Ficheiro PDF de Apoio / Manual (Opcional)
                          </label>
                          
                          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input 
                              type="file" 
                              accept="application/pdf,image/*"
                              onChange={async (e) => {
                                const selectedFile = e.target.files?.[0];
                                if (!selectedFile) return;
                                setUploadingPdf(true);
                                
                                const formData = new FormData();
                                formData.append('file', selectedFile);
                                
                                try {
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  const data = await res.json();
                                  if (data.success && data.url) {
                                    setNewLessonPdfUrl(data.url);
                                  } else {
                                    alert(data.error || 'Erro no envio do PDF.');
                                  }
                                } catch (err) {
                                  alert('Erro de ligação ao servidor.');
                                } finally {
                                  setUploadingPdf(false);
                                }
                              }}
                              style={{ display: 'block', fontSize: '0.82rem', flex: 1 }}
                            />

                            {uploadingPdf && <span style={{ fontSize: '0.78rem', color: '#ff6b00', fontWeight: 700 }}>A carregar PDF...</span>}
                          </div>

                          {newLessonPdfUrl && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem', color: '#2563eb', fontWeight: 700 }}>
                              <span>📄 Ficheiro PDF Anexado!</span>
                              <button
                                type="button"
                                onClick={() => setNewLessonPdfUrl('')}
                                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 800 }}
                              >
                                Remover PDF
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleSaveLesson}
                          style={{
                            background: editingLessonIdx !== null ? '#16a34a' : '#fff7ed',
                            border: `1.5px solid ${editingLessonIdx !== null ? '#16a34a' : '#ff6b00'}`,
                            color: editingLessonIdx !== null ? '#ffffff' : '#ff6b00',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            textAlign: 'center',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          {editingLessonIdx !== null ? <Check size={16} /> : <Plus size={16} />}
                          {editingLessonIdx !== null ? 'Atualizar Dados da Aula' : 'Adicionar Aula à Formação'}
                        </button>
                      </div>
                    </div>

                    {/* Video Visibility Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px' }}>
                      <div>
                        <p style={{ color: '#0f172a', fontWeight: 800, margin: 0, fontSize: '0.92rem' }}>
                          👁️ Visibilidade dos Vídeos aos Alunos
                        </p>
                        <p style={{ color: '#64748b', margin: '2px 0 0 0', fontSize: '0.78rem' }}>
                          {videoVisible ? 'Os vídeos estão visíveis para os alunos inscritos' : 'Os vídeos estão ocultos para revisão do admin'}
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
                          background: videoVisible ? '#ff6b00' : '#cbd5e1'
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
                    <h3 style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', fontFamily: 'Outfit' }}>
                      Personalização do Certificado Emitido aos Alunos
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Cor do Destaque (Borda)</label>
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
                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '10px', borderRadius: '8px', color: '#0f172a', flex: 1, fontFamily: 'monospace', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Cor do Texto do Nome</label>
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
                            style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '10px', borderRadius: '8px', color: '#0f172a', flex: 1, fontFamily: 'monospace', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px', marginTop: '0.5rem' }}>
                      <div>
                        <p style={{ color: '#0f172a', fontWeight: 800, margin: 0, fontSize: '0.92rem' }}>
                          🤝 Logótipo de Parceiro no Certificado
                        </p>
                        <p style={{ color: '#64748b', margin: '2px 0 0 0', fontSize: '0.78rem' }}>
                          Exibir logótipo oficial da empresa parceira no documento final
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
                          background: certUsePartnerLogos ? '#ff6b00' : '#cbd5e1'
                        }} />
                        <span style={{
                          position: 'absolute', top: '4px', left: certUsePartnerLogos ? '28px' : '4px',
                          width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: '0.3s'
                        }} />
                      </label>
                    </div>

                    {certUsePartnerLogos && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: '#ffffff', border: '1.5px dashed #cbd5e1', borderRadius: '14px', padding: '1.2rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Logótipo do Parceiro (Upload de Ficheiro)</label>
                        
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

                          {uploadingLogo && <span style={{ fontSize: '0.8rem', color: '#ff6b00', fontWeight: 700 }}>A carregar...</span>}
                          
                          {certPartnerLogoUrl && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                              <img src={certPartnerLogoUrl} alt="Preview Partner Logo" style={{ height: '40px', maxWidth: '120px', objectFit: 'contain' }} />
                              <button 
                                type="button" 
                                onClick={() => setCertPartnerLogoUrl('')}
                                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.72rem', cursor: 'pointer', marginTop: '4px', fontWeight: 800 }}
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

              {/* Navigation Footer */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.2rem', flexShrink: 0 }}>
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    style={{ 
                      padding: '12px 24px', 
                      background: '#ffffff', 
                      border: '1.5px solid #cbd5e1', 
                      color: '#475569', 
                      borderRadius: '10px', 
                      cursor: 'pointer', 
                      fontWeight: 700,
                      fontSize: '0.88rem'
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
                    style={{ 
                      padding: '12px 24px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: (currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false) ? 'not-allowed' : 'pointer',
                      opacity: (currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false) ? 0.5 : 1,
                      boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)'
                    }}
                  >
                    Seguinte
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={saving} 
                    style={{ 
                      padding: '12px 24px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    {saving ? 'A guardar...' : 'Guardar Curso & Conteúdos'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipantsModal && selectedCourseForParticipants && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '750px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)', display: 'flex', flexDirection: 'column', maxHeight: '85vh', overflow: 'hidden' }}>
            <button 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontSize: '1.4rem', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => { setShowParticipantsModal(false); setSelectedCourseForParticipants(null); setParticipants([]); }}
            >
              &times;
            </button>
            
            <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 0.2rem 0' }}>Alunos Inscritos no Curso</h2>
            <p style={{ color: '#ff6b00', fontWeight: 800, margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>{selectedCourseForParticipants.title}</p>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {loadingParticipants ? (
                <p style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>A carregar alunos...</p>
              ) : participants.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  Nenhum aluno inscrito neste curso até ao momento.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {participants.map(p => {
                    const completedCount = p.completedLessons?.length || (p.completed ? 1 : 0);

                    return (
                      <div key={p._id} style={{ padding: '1rem 1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{p.user?.name || 'Aluno'}</div>
                          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{p.user?.email} | {p.phone || 'Sem telefone'}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '4px 12px',
                            borderRadius: '50px',
                            background: p.completed ? '#f0fdf4' : '#fff7ed',
                            color: p.completed ? '#16a34a' : '#ff6b00',
                            border: `1px solid ${p.completed ? '#bbf7d0' : '#ffedd5'}`
                          }}>
                            📊 {p.completed ? '100% Concluído' : `${completedCount} Aulas Vistas`}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            padding: '4px 12px',
                            borderRadius: '50px',
                            background: p.status === 'aprovado' ? '#f0fdf4' : '#fefce8',
                            color: p.status === 'aprovado' ? '#16a34a' : '#ca8a04',
                            border: `1px solid ${p.status === 'aprovado' ? '#bbf7d0' : '#fef08a'}`
                          }}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
