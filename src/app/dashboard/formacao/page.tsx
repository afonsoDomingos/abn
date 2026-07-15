'use client';

import { useEffect, useState } from 'react';
import styles from '../Dashboard.module.css';

interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  lessons: number;
  price: string;
  isPaid: boolean;
}

export default function FormacaoPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Empreendedor');
  const [showCert, setShowCert] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'disponiveis' | 'minhas'>('disponiveis');
  const [videoCourse, setVideoCourse] = useState<any | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollCompany, setEnrollCompany] = useState('');
  const [showEnrollConfirmModal, setShowEnrollConfirmModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState<any | null>(null);

  useEffect(() => {
    fetchEnrollments();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUserName(u.name || 'Empreendedor');
        if (u.phone) setEnrollPhone(u.phone);
        if (u.company) setEnrollCompany(u.company);
      } catch (e) {}
    }
  }, []);

  const fetchEnrollments = async () => {
    try {
      // 1. Fetch courses
      const cRes = await fetch('/api/courses');
      const cData = await cRes.json();
      if (cData.success) {
        setCourses(cData.courses || []);
      }

      // 2. Fetch payments
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollFree = async (course: any, phoneVal: string, companyVal: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: course.title,
          price: 'Gratuito',
          proofUrl: 'gratuito',
          phone: phoneVal,
          company: companyVal
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: `Inscrição no curso "${course.title}" concluída com sucesso!` });
        // Instantly approve free course locally and update status
        await fetch('/api/payments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: data.payment._id, status: 'aprovado' })
        });
        fetchEnrollments();
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Erro ao processar inscrição gratuita.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setUploadedUrl(data.url);
        setMsg({ type: 'success', text: 'Comprovativo carregado com sucesso!' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro no envio do ficheiro.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de ligação ao servidor de ficheiros.' });
    } finally {
      setUploading(false);
    }
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !uploadedUrl) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: selectedCourse.title,
          price: selectedCourse.price,
          proofUrl: uploadedUrl,
          phone: enrollPhone,
          company: enrollCompany
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: `Comprovativo para "${selectedCourse.title}" enviado! A aguardar verificação administrativa.` });
        setShowModal(false);
        setFile(null);
        setUploadedUrl('');
        fetchEnrollments();
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao submeter comprovativo.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de ligação.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgress = async (paymentId: string, updates: { completed?: boolean; certificateRequested?: boolean }) => {
    setProcessingId(paymentId);
    try {
      const res = await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, ...updates })
      });
      const data = await res.json();
      if (data.success) {
        await fetchEnrollments();
      } else {
        alert(data.error || 'Erro ao atualizar o progresso.');
      }
    } catch (e) {
      alert('Erro ao ligar ao servidor para atualizar o progresso.');
    } finally {
      setProcessingId(null);
    }
  };

  const getEnrollment = (courseTitle: string) => {
    return payments.find(p => p.itemName.trim().toLowerCase() === courseTitle.trim().toLowerCase());
  };

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar academia...</div>;

  return (
    <div style={{ maxWidth: '850px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Academia & Formação</h1>
        <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Aceda a bootcamps, workshops e cursos certificados para acelerar o seu crescimento profissional.</p>
      </header>

      {msg.text && (
        <div style={{
          color: msg.type === 'success' ? '#2ecc71' : '#ff4d4d',
          background: msg.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 77, 77, 0.1)',
          padding: '1rem',
          borderRadius: '12px',
          border: `1px solid ${msg.type === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 77, 77, 0.2)'}`,
          marginBottom: '2rem'
        }}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem', gap: '2rem' }}>
        <button
          onClick={() => setActiveTab('disponiveis')}
          style={{
            background: 'none',
            border: 'none',
            paddingBottom: '12px',
            color: activeTab === 'disponiveis' ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            position: 'relative',
            transition: 'color 0.2s'
          }}
        >
          Formações Disponíveis
          {activeTab === 'disponiveis' && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)' }} />
          )}
        </button>
        <button
          onClick={() => setActiveTab('minhas')}
          style={{
            background: 'none',
            border: 'none',
            paddingBottom: '12px',
            color: activeTab === 'minhas' ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            position: 'relative',
            transition: 'color 0.2s'
          }}
        >
          Minhas Formações
          {activeTab === 'minhas' && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)' }} />
          )}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {(() => {
          const displayCourses = courses.filter((course) => {
            const enrollment = getEnrollment(course.title);
            if (activeTab === 'disponiveis') {
              return !enrollment;
            } else {
              return !!enrollment;
            }
          });

          if (displayCourses.length === 0) {
            return (
              <div className="glass" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                {activeTab === 'disponiveis' 
                  ? 'De momento não existem novas formações disponíveis.' 
                  : 'Ainda não se inscreveu em nenhuma formação. Explore as formações disponíveis para começar!'}
              </div>
            );
          }

          return displayCourses.map((course) => {
            const enrollment = getEnrollment(course.title);
            const status = enrollment ? enrollment.status : 'none';
            return (
              <div key={course.id} className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>Curso Certificado</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: course.isPaid ? 'var(--secondary)' : '#2ecc71', background: course.isPaid ? 'rgba(42,79,166,0.1)' : 'rgba(46,204,113,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                      {course.price}
                    </span>
                  </div>
                  <h3 style={{ color: '#fff', margin: '6px 0 8px 0', fontSize: '1.25rem', fontFamily: 'Outfit' }}>{course.title}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    <span>👨‍🏫 {course.instructor}</span>
                    <span>⏱️ {course.duration}</span>
                    <span>📚 {course.lessons} Aulas</span>
                  </div>
                </div>

                {/* Status Action buttons */}
                <div>
                  {status === 'aprovado' && (
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {(((course.videoUrl && course.videoUrl.trim() !== '') || (course.lessonsList && course.lessonsList.length > 0)) && course.videoVisible !== false) && (
                        <button
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}
                          onClick={() => {
                            const lessons = course.lessonsList && course.lessonsList.length > 0
                              ? course.lessonsList
                              : [{ title: 'Aula Geral / Apresentação', videoUrl: course.videoUrl }];
                            setVideoCourse(course);
                            setActiveVideoUrl(lessons[0].videoUrl);
                            setActiveVideoTitle(lessons[0].title);
                            setShowVideoModal(true);
                          }}
                        >
                          🎥 Assistir Aulas
                        </button>
                      )}

                      {!enrollment.completed ? (
                        <>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'rgba(46,204,113,0.15)', color: '#2ecc71', border: '1px solid #2ecc71', padding: '8px 20px', borderRadius: '40px', display: 'inline-flex', alignItems: 'center' }}>
                            ✅ Inscrito
                          </span>
                          <button
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--primary)' }}
                            disabled={processingId === enrollment._id}
                            onClick={() => handleUpdateProgress(enrollment._id, { completed: true })}
                          >
                            {processingId === enrollment._id ? 'A processar...' : '✔️ Concluir Curso'}
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'rgba(255,107,0,0.15)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '8px 20px', borderRadius: '40px', display: 'inline-flex', alignItems: 'center' }}>
                            🎉 Concluído
                          </span>

                          {!enrollment.certificateRequested ? (
                            <button
                              className="btn-primary"
                              style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#27ae60' }}
                              disabled={processingId === enrollment._id}
                              onClick={() => handleUpdateProgress(enrollment._id, { certificateRequested: true })}
                            >
                              {processingId === enrollment._id ? 'A processar...' : '🎓 Solicitar Certificado'}
                            </button>
                          ) : (
                            <button
                              className="btn-primary"
                              style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#2980b9' }}
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowCert(true);
                              }}
                            >
                              🎓 Ver Certificado
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {status !== 'aprovado' && (((course.videoUrl && course.videoUrl.trim() !== '') || (course.lessonsList && course.lessonsList.length > 0)) && course.videoVisible !== false) && (
                      <button
                        className="btn-outline"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'var(--primary)', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                        onClick={() => {
                          const lessons = course.lessonsList && course.lessonsList.length > 0
                            ? course.lessonsList
                            : [{ title: 'Aula Geral / Apresentação', videoUrl: course.videoUrl }];
                          setVideoCourse(course);
                          setActiveVideoUrl(lessons[0].videoUrl);
                          setActiveVideoTitle(lessons[0].title);
                          setShowVideoModal(true);
                        }}
                      >
                        🎥 Aula de Introdução
                      </button>
                    )}

                    {status === 'pendente' && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'rgba(241,196,15,0.15)', color: '#f1c40f', border: '1px solid #f1c40f', padding: '8px 20px', borderRadius: '40px' }}>
                        ⏳ Pagamento em Verificação
                      </span>
                    )}
                    {status === 'rejeitado' && (
                      <button
                        className="btn-primary"
                        style={{ background: '#e74c3c', borderRadius: '8px' }}
                        onClick={() => {
                          setCourseToEnroll(course);
                          setShowEnrollConfirmModal(true);
                        }}
                      >
                        ❌ Rejeitado - Reenviar
                      </button>
                    )}
                    {status === 'none' && (
                      <button
                        className="btn-primary"
                        style={{ borderRadius: '8px' }}
                        onClick={() => {
                          const enrollment = getEnrollment(course.title);
                          if (enrollment && (enrollment.status === 'aprovado' || enrollment.status === 'pendente')) {
                            setMsg({ type: 'error', text: `Já se encontra inscrito ou a aguardar validação para o curso "${course.title}".` });
                            return;
                          }
                          setCourseToEnroll(course);
                          setShowEnrollConfirmModal(true);
                        }}
                      >
                        {course.isPaid ? 'Comprar e Inscrever' : 'Inscrever Grátis'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Video Player Modal */}
      {showVideoModal && videoCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '1000px', width: '100%', position: 'relative', background: '#1c1917', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '90vh', overflow: 'hidden' }}>
            <button
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', fontSize: '2rem', cursor: 'pointer', fontWeight: 700, zIndex: 10 }}
              onClick={() => { setShowVideoModal(false); setVideoCourse(null); setActiveVideoUrl(''); setActiveVideoTitle(''); }}
            >
              &times;
            </button>
            
            <div style={{ flexShrink: 0 }}>
              <h3 style={{ color: '#fff', fontFamily: 'Outfit', margin: 0, fontSize: '1.4rem' }}>🎥 {videoCourse.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0', fontSize: '0.85rem' }}>Assistir a aulas: {activeVideoTitle}</p>
            </div>
            
            {/* Split layout: sidebar and player */}
            <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0, flexWrap: 'wrap' }}>
              {/* Sidebar with lessons list */}
              <div style={{ 
                flex: '1 1 250px', 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '16px', 
                padding: '1rem', 
                maxHeight: '100%', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                {(() => {
                  const courseEnrollment = getEnrollment(videoCourse.title);
                  const isApproved = courseEnrollment && courseEnrollment.status === 'aprovado';
                  const list = videoCourse.lessonsList && videoCourse.lessonsList.length > 0
                    ? videoCourse.lessonsList
                    : [{ title: 'Aula Geral / Apresentação', videoUrl: videoCourse.videoUrl }];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                      
                      {/* Course & Instructor details card */}
                      <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>👨‍🏫 <strong>Formador:</strong> <span style={{ color: '#fff' }}>{videoCourse.instructor}</span></div>
                        <div>⏱️ <strong>Duração:</strong> <span style={{ color: '#fff' }}>{videoCourse.duration}</span></div>
                        <div><strong>Descrição:</strong> <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', display: 'block', marginTop: '2px' }}>{videoCourse.desc}</span></div>
                        
                        <div style={{ paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                          <strong>Inscrição:</strong>
                          <div style={{ marginTop: '4px' }}>
                            {(() => {
                              const status = courseEnrollment?.status || 'none';
                              if (status === 'aprovado') {
                                return <span style={{ background: 'rgba(46,204,113,0.15)', color: '#2ecc71', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>✔️ Aprovada</span>;
                              }
                              if (status === 'pendente') {
                                return <span style={{ background: 'rgba(241,196,15,0.15)', color: '#f1c40f', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>⏳ Em Verificação</span>;
                              }
                              if (status === 'rejeitado') {
                                return <span style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>❌ Rejeitada</span>;
                              }
                              return <span style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Não Inscrito</span>;
                            })()}
                          </div>
                        </div>
                      </div>

                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px', display: 'block' }}>Lista de Aulas</span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
                      {list.map((lesson: any, idx: number) => {
                        const isSelected = lesson.videoUrl === activeVideoUrl;
                        const isLocked = idx > 0 && !isApproved;
                        return (
                          <button
                            key={idx}
                            disabled={isLocked}
                            onClick={() => {
                              if (isLocked) return;
                              setActiveVideoUrl(lesson.videoUrl);
                              setActiveVideoTitle(lesson.title);
                            }}
                            style={{
                              textAlign: 'left',
                              background: isSelected ? 'rgba(255,107,0,0.1)' : 'transparent',
                              border: `1px solid ${isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                              borderRadius: '10px',
                              padding: '10px 14px',
                              color: isLocked ? 'rgba(255,255,255,0.3)' : isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                              fontSize: '0.85rem',
                              fontWeight: isSelected ? 600 : 400,
                              cursor: isLocked ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s',
                              display: 'block',
                              width: '100%'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <div style={{ display: 'flex', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span style={{ color: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{idx + 1}.</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</span>
                              </div>
                              {isLocked && (
                                <span style={{ fontSize: '0.8rem', marginLeft: '6px' }}>🔒</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      </div>

                      {!isApproved && (
                        <div style={{ marginTop: '1rem', background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.75rem', color: '#ff8c3a', lineHeight: 1.4 }}>
                          🔒 Inscreva-se ou aguarde a aprovação do seu pagamento para desbloquear todas as aulas deste curso.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              
              {/* Player area */}
              <div style={{ 
                flex: '3 1 450px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                aspectRatio: '16/9', 
                background: '#000',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <iframe
                  src={activeVideoUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', display: 'block' }}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title="Player de Vídeo da Aula"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Registration Details Modal */}
      {showEnrollConfirmModal && courseToEnroll && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass" style={{ maxWidth: '500px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', fontSize: '1.5rem', cursor: 'pointer' }}
              onClick={() => { setShowEnrollConfirmModal(false); setCourseToEnroll(null); }}
            >
              &times;
            </button>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '0.2rem' }}>Ficha de Inscrição</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Curso: {courseToEnroll.title}</p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowEnrollConfirmModal(false);
                if (courseToEnroll.isPaid) {
                  setSelectedCourse(courseToEnroll);
                  setShowModal(true);
                } else {
                  handleEnrollFree(courseToEnroll, enrollPhone, enrollCompany);
                  setCourseToEnroll(null);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Nome do Aluno</label>
                <input 
                  value={userName} 
                  disabled
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Telefone / WhatsApp *</label>
                <input 
                  value={enrollPhone}
                  onChange={e => setEnrollPhone(e.target.value)}
                  placeholder="Ex: +258 84 123 4567"
                  required
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Empresa / Startup *</label>
                <input 
                  value={enrollCompany}
                  onChange={e => setEnrollCompany(e.target.value)}
                  placeholder="Nome da sua empresa ou projeto"
                  required
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ borderRadius: '8px', marginTop: '0.5rem' }}
              >
                {courseToEnroll.isPaid ? 'Avançar para Pagamento 💳' : 'Confirmar e Inscrever Grátis 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Proof Upload Modal */}
      {showModal && selectedCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass" style={{ maxWidth: '500px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', fontSize: '1.5rem', cursor: 'pointer' }}
              onClick={() => { setShowModal(false); setFile(null); setUploadedUrl(''); }}
            >
              &times;
            </button>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '0.2rem' }}>Submeter Comprovativo</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Curso: {selectedCourse.title} ({selectedCourse.price})</p>

            {/* ABN Bank Account details */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '12px', fontSize: '0.85rem', color: '#e5e5e5', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <strong>🏦 Dados Bancários ABN para Transferência:</strong>
              <div><strong>Banco:</strong> Banco da África Ocidental (BAO)</div>
              <div><strong>Conta (NIB):</strong> 0012-9876-0026-NIB-ABN</div>
              <div><strong>Titular:</strong> AfroBiz Network Lda.</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.3rem' }}>
                * Por favor, realize a transferência e faça upload do comprovativo abaixo.
              </div>
            </div>

            <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Ficheiro do Comprovativo *</label>
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  required 
                  accept="image/*,application/pdf"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                />
                {uploading && <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>A carregar ficheiro para o servidor...</div>}
              </div>

              <button type="submit" className="btn-primary" disabled={submitting || uploading || !uploadedUrl} style={{ marginTop: '0.5rem' }}>
                {submitting ? 'A submeter...' : 'Submeter Comprovativo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCert && selectedCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem', zIndex: 2010 }}>
            <button 
              className="btn-primary"
              onClick={() => window.print()}
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            >
              🖨️ Imprimir / Guardar PDF
            </button>
            <button 
              className="btn-outline" 
              onClick={() => { setShowCert(false); setSelectedCourse(null); }}
              style={{ padding: '8px 20px', fontSize: '0.9rem', color: '#fff', borderColor: '#fff' }}
            >
              Fechar
            </button>
          </div>

          {/* Certificate Template */}
          <div id="print-certificate" style={{ 
            width: '842px', 
            height: '595px', 
            background: '#fffcf9', 
            padding: '3rem', 
            borderRadius: '4px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '20px solid transparent',
            borderImage: `linear-gradient(135deg, ${selectedCourse.certBgColor || '#ff6b00'} 0%, ${selectedCourse.certBgColor || '#ffc107'} 100%) 20 stretch`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            color: selectedCourse.certTextColor || '#1c1917',
            position: 'relative',
            fontFamily: "'Outfit', sans-serif"
          }}>
            {/* Header branding */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '50px', marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888' }}>
                  AFROBIZ NETWORK ACCELERATION
                </span>
              </div>
              
              {selectedCourse.certUsePartnerLogos && selectedCourse.certPartnerLogoUrl && (
                <>
                  <div style={{ width: '1px', height: '40px', background: 'rgba(0,0,0,0.1)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={selectedCourse.certPartnerLogoUrl} alt="Partner Logo" style={{ height: '50px', maxWidth: '140px', objectFit: 'contain', marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888' }}>
                      Parceiro Certificador
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Main title */}
            <div>
              <h1 style={{ fontSize: '2.8rem', color: selectedCourse.certBgColor || '#ff6b00', margin: '0.5rem 0', fontFamily: 'Outfit', fontWeight: 800 }}>
                CERTIFICADO
              </h1>
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#444' }}>
                de conclusão e aproveitamento
              </span>
            </div>

            {/* Recipient body */}
            <div style={{ maxWidth: '650px' }}>
              <p style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#555' }}>Certificamos que, para os devidos efeitos de mérito,</p>
              <h2 style={{ fontSize: '2.2rem', color: selectedCourse.certTextColor || '#1c1917', textDecoration: 'underline', margin: '0.5rem 0', fontFamily: 'Outfit', fontWeight: 700 }}>
                {userName}
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#444', margin: '1rem 0' }}>
                concluiu com aproveitamento e sucesso o programa de formação em aceleração de negócios denominado <strong style={{ color: selectedCourse.certBgColor || '#ff6b00' }}>{selectedCourse.title}</strong>, com a duração total de <strong>{selectedCourse.duration}</strong> e aproveitamento prático estruturado.
              </p>
            </div>

            {/* Footer with date and signatures */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', fontSize: '0.8rem', color: '#666' }}>
              <div style={{ textAlign: 'left' }}>
                📍 Bissau, Guiné-Bissau
                <div style={{ marginTop: '0.2rem' }}>
                  📅 {new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* CEO Signature */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '1.2rem', color: '#2a4fa6', marginBottom: '0.2rem' }}>
                  Afonso Domingos
                </div>
                <div style={{ borderTop: '1px solid #ccc', width: '150px', marginTop: '0.2rem', paddingTop: '0.2rem' }}>
                  Direção ABN
                </div>
              </div>

              {/* Co-founder Signature */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '1.2rem', color: '#2a4fa6', marginBottom: '0.2rem' }}>
                  Moisés Nhantumbo
                </div>
                <div style={{ borderTop: '1px solid #ccc', width: '150px', marginTop: '0.2rem', paddingTop: '0.2rem' }}>
                  Aceleração ABN
                </div>
              </div>
            </div>
          </div>

          {/* Inline styles specifically for printing */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #print-certificate, #print-certificate * {
                visibility: visible !important;
              }
              #print-certificate {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                margin: 0 !important;
                border: 20px solid transparent !important;
                border-image: linear-gradient(135deg, ${selectedCourse.certBgColor || '#ff6b00'} 0%, ${selectedCourse.certBgColor || '#ffc107'} 100%) 20 stretch !important;
                box-shadow: none !important;
                width: 100% !important;
                height: 100% !important;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
