'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FormacaoPageInner() {
  const isCoursePaid = (course: any) => {
    if (!course) return false;
    const priceStr = String(course.price || '').toLowerCase().trim();
    if (priceStr === 'gratuito' || priceStr === 'grátis' || priceStr === '0' || priceStr === '0 mt' || priceStr === '0mt' || priceStr === 'free') {
      return false;
    }
    return !!course.isPaid;
  };

  // Converts any YouTube URL format to embed URL
  const toYoutubeEmbed = (url?: string): string => {
    if (!url || url.trim() === '') return '';
    const u = url.trim();
    // Already an embed URL
    if (u.includes('youtube.com/embed/')) return u;
    // youtu.be short link
    const shortMatch = u.match(/youtu\.be\/([\w-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    // youtube.com/watch?v=
    const watchMatch = u.match(/[?&]v=([\w-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    // youtube.com/shorts/
    const shortsMatch = u.match(/youtube\.com\/shorts\/([\w-]+)/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    // Return as-is if nothing matched (may be another platform)
    return u;
  };

  const searchParams = useSearchParams();
  const isAdminPreview = searchParams?.get('adminPreview') === '1';

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
  const [adminWaLink, setAdminWaLink] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
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
      const cRes = await fetch('/api/courses');
      const cData = await cRes.json();
      if (cData.success) {
        setCourses(cData.courses || []);
      }

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
    setMsg({ type: '', text: '' });
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
        setActiveTab('minhas');
        fetchEnrollments();
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao processar inscrição gratuita.' });
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
        if (data.adminWaUrl) {
          setAdminWaLink(data.adminWaUrl);
        }
        setMsg({ type: 'success', text: `Comprovativo para "${selectedCourse.title}" enviado! A aguardar verificação administrativa.` });
        setShowModal(false);
        setFile(null);
        setUploadedUrl('');
        setActiveTab('minhas');
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

  const handleUpdateProgress = async (paymentId: string, updates: { completed?: boolean; completedLessons?: number[]; certificateRequested?: boolean; certificateApproved?: boolean }) => {
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

  const handleToggleLessonComplete = async (payment: any, lessonIdx: number, totalLessonsCount: number) => {
    const currentList = payment.completedLessons || [];
    let updatedList: number[];
    if (currentList.includes(lessonIdx)) {
      updatedList = currentList.filter((idx: number) => idx !== lessonIdx);
    } else {
      updatedList = [...currentList, lessonIdx];
    }

    const isAllDone = updatedList.length >= totalLessonsCount;
    await handleUpdateProgress(payment._id, {
      completedLessons: updatedList,
      completed: isAllDone
    });
  };

  // Robust accent-insensitive, case-insensitive string matching
  const normalizeStr = (str: string) => {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  };

  const getEnrollment = (courseTitle: string) => {
    const normTitle = normalizeStr(courseTitle);
    return payments.find(p => {
      const normItemName = normalizeStr(p.itemName);
      return normItemName === normTitle || normItemName.includes(normTitle) || normTitle.includes(normItemName);
    });
  };

  if (loading) return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar academia...</div>;

  return (
    <div style={{ maxWidth: '940px' }}>

      {/* Admin Preview Mode Sticky Banner */}
      {isAdminPreview && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 9999,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '3px solid #ff6b00',
          padding: '0.7rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(255, 107, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: '#ff6b00',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffffff', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              Admin Preview
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.88rem', fontWeight: 600 }}>
              👁️ Está a visualizar a plataforma <strong style={{ color: '#e2e8f0' }}>como um Aluno/Empreendedor</strong>
            </span>
          </div>
          <a
            href="/admin/cursos"
            style={{
              background: '#ff6b00',
              color: '#ffffff',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            ← Voltar ao Painel Admin
          </a>
        </div>
      )}

      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Academia & Formação
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Aceda a bootcamps, workshops e cursos certificados para acelerar o seu crescimento profissional.
        </p>
      </header>

      {msg.text && (
        <div style={{
          color: msg.type === 'success' ? '#16a34a' : '#dc2626',
          background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
          padding: '1.2rem 1.4rem',
          borderRadius: '16px',
          border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          marginBottom: '2rem',
          fontWeight: 600,
          fontSize: '0.95rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <span>{msg.text}</span>
          {adminWaLink && (
            <a
              href={adminWaLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.8rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              💬 Avisar Admin no WhatsApp
            </a>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem', gap: '2.5rem' }}>
        <button
          onClick={() => setActiveTab('disponiveis')}
          style={{
            background: 'none',
            border: 'none',
            paddingBottom: '14px',
            color: activeTab === 'disponiveis' ? '#ff6b00' : '#64748b',
            fontSize: '1.02rem',
            fontFamily: 'Outfit',
            fontWeight: 800,
            cursor: 'pointer',
            position: 'relative',
            transition: 'color 0.2s'
          }}
        >
          Formações Disponíveis
          {activeTab === 'disponiveis' && (
            <div style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '3px', background: '#ff6b00', borderRadius: '3px 3px 0 0' }} />
          )}
        </button>
        <button
          onClick={() => setActiveTab('minhas')}
          style={{
            background: 'none',
            border: 'none',
            paddingBottom: '14px',
            color: activeTab === 'minhas' ? '#ff6b00' : '#64748b',
            fontSize: '1.02rem',
            fontFamily: 'Outfit',
            fontWeight: 800,
            cursor: 'pointer',
            position: 'relative',
            transition: 'color 0.2s'
          }}
        >
          Minhas Formações ({payments.length})
          {activeTab === 'minhas' && (
            <div style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '3px', background: '#ff6b00', borderRadius: '3px 3px 0 0' }} />
          )}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {(() => {
          let displayCourses: any[] = [];

          if (activeTab === 'disponiveis') {
            displayCourses = courses.filter((course) => !getEnrollment(course.title));
          } else {
            const catalogEnrolled = courses.filter((course) => !!getEnrollment(course.title));
            const matchedPaymentIds = new Set(catalogEnrolled.map(c => getEnrollment(c.title)?._id).filter(Boolean));
            const extraPayments = payments.filter(p => !matchedPaymentIds.has(p._id));

            const extraCourses = extraPayments.map(p => ({
              id: p._id,
              _id: p._id,
              title: p.itemName,
              price: p.price,
              instructor: 'Equipa ABN',
              duration: 'Em progresso',
              lessons: 1,
              lessonsList: [],
              videoUrl: '',
              isPaid: p.price !== 'Gratuito'
            }));

            displayCourses = [...catalogEnrolled, ...extraCourses];
          }

          if (displayCourses.length === 0) {
            return (
              <div style={{ padding: '3.5rem 2rem', borderRadius: '20px', textAlign: 'center', color: '#64748b', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)', fontWeight: 500 }}>
                {activeTab === 'disponiveis' 
                  ? 'De momento não existem novas formações disponíveis.' 
                  : 'Ainda não se inscreveu em nenhuma formação. Explore as formações disponíveis para começar!'}
              </div>
            );
          }

          return displayCourses.map((course) => {
            const enrollment = getEnrollment(course.title);
            const status = enrollment ? enrollment.status : 'none';
            const totalLessons = course.lessonsList && course.lessonsList.length > 0 ? course.lessonsList.length : (course.lessons || 1);
            const doneCount = enrollment?.completedLessons ? enrollment.completedLessons.length : (enrollment?.completed ? totalLessons : 0);
            const progressPercent = Math.min(100, Math.round((doneCount / totalLessons) * 100));

            return (
              <div key={course.id || course._id} style={{ padding: '2rem', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden' }}>
                {course.image && (
                  <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '14px', margin: '-0.5rem 0 0.5rem 0' }}>
                    <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#ff6b00', fontWeight: 800, letterSpacing: '0.08em' }}>Curso Certificado</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isCoursePaid(course) ? '#2a4fa6' : '#16a34a', background: isCoursePaid(course) ? '#eff6ff' : '#f0fdf4', padding: '3px 10px', borderRadius: '50px', border: `1px solid ${isCoursePaid(course) ? '#bfdbfe' : '#bbf7d0'}` }}>
                        {course.price}
                      </span>
                      {status === 'aprovado' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '50px', textTransform: 'uppercase', border: '1px solid #bbf7d0' }}>
                          ✓ Inscrito
                        </span>
                      )}
                      {status === 'pendente' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#fefce8', color: '#ca8a04', padding: '3px 10px', borderRadius: '50px', textTransform: 'uppercase', border: '1px solid #fef08a' }}>
                          ⏳ Pendente
                        </span>
                      )}
                      {status === 'rejeitado' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#fef2f2', color: '#dc2626', padding: '3px 10px', borderRadius: '50px', textTransform: 'uppercase', border: '1px solid #fecaca' }}>
                          ✕ Rejeitado
                        </span>
                      )}
                    </div>
                    <h3 style={{ color: '#0f172a', margin: '8px 0', fontSize: '1.3rem', fontFamily: 'Outfit', fontWeight: 800 }}>{course.title}</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
                      <span>👨‍🏫 {course.instructor}</span>
                      <span>⏱️ {course.duration}</span>
                      <span>📚 {totalLessons} Aulas</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div>
                    {status === 'aprovado' && (
                      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* 🎥 Assistir Aulas button (Always visible for enrolled students) */}
                        <button
                          style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(220,38,38,0.2)' }}
                          onClick={() => {
                            const lessons = course.lessonsList && course.lessonsList.length > 0
                              ? course.lessonsList
                              : [{ title: 'Aula 1: Introdução ao Curso', videoUrl: course.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ' }];
                            setVideoCourse(course);
                            setActiveVideoUrl(toYoutubeEmbed(lessons[0].videoUrl));
                            setActiveVideoTitle(lessons[0].title);
                            setShowVideoModal(true);
                          }}
                        >
                          🎥 Assistir Aulas
                        </button>

                        {!enrollment?.completed ? (
                          <button
                            style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, background: '#ff6b00', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,0,0.25)' }}
                            disabled={processingId === enrollment?._id}
                            onClick={() => enrollment && handleUpdateProgress(enrollment._id, { completed: true })}
                          >
                            {processingId === enrollment?._id ? 'A processar...' : '✔️ Concluir Curso'}
                          </button>
                        ) : (
                          <>
                            {!enrollment?.certificateRequested ? (
                              <button
                                style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                                disabled={processingId === enrollment?._id}
                                onClick={() => enrollment && handleUpdateProgress(enrollment._id, { certificateRequested: true })}
                              >
                                {processingId === enrollment?._id ? 'A processar...' : '🎓 Solicitar Certificado'}
                              </button>
                            ) : !enrollment?.certificateApproved ? (
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, background: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a', padding: '9px 18px', borderRadius: '10px' }}>
                                ⏳ Certificado em Validação pelo Admin
                              </span>
                            ) : (
                              <button
                                style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setShowCert(true);
                                }}
                              >
                                🎓 Ver Certificado PDF
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {status !== 'aprovado' && (((course.videoUrl && course.videoUrl.trim() !== '') || (course.lessonsList && course.lessonsList.length > 0)) && course.videoVisible !== false) && (
                        <button
                          style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 700, color: '#ff6b00', border: '1.5px solid #ff6b00', borderRadius: '10px', cursor: 'pointer', background: '#fff7ed' }}
                          onClick={() => {
                            const lessons = course.lessonsList && course.lessonsList.length > 0
                              ? course.lessonsList
                              : [{ title: 'Aula de Introdução', videoUrl: course.videoUrl }];
                            setVideoCourse(course);
                            setActiveVideoUrl(toYoutubeEmbed(lessons[0].videoUrl));
                            setActiveVideoTitle(lessons[0].title);
                            setShowVideoModal(true);
                          }}
                        >
                          🎥 Aula de Introdução
                        </button>
                      )}

                      {status === 'pendente' && (
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, background: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a', padding: '8px 18px', borderRadius: '40px' }}>
                          ⏳ Pagamento em Verificação
                        </span>
                      )}
                      {status === 'rejeitado' && (
                        <button
                          style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
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
                          style={{
                            padding: '12px 24px',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            transition: 'transform 0.2s ease'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                          onClick={() => {
                            const enrollment = getEnrollment(course.title);
                            if (enrollment && (enrollment.status === 'aprovado' || enrollment.status === 'pendente')) {
                              setMsg({ type: 'error', text: `Já se encontra inscrito ou a aguardar validação para o curso "${course.title}".` });
                              return;
                            }
                            
                            const hasInfo = enrollPhone && enrollCompany;
                            if (hasInfo) {
                              if (isCoursePaid(course)) {
                                setSelectedCourse(course);
                                setShowModal(true);
                              } else {
                                handleEnrollFree(course, enrollPhone, enrollCompany);
                              }
                            } else {
                              setCourseToEnroll(course);
                              setShowEnrollConfirmModal(true);
                            }
                          }}
                        >
                          {isCoursePaid(course) ? 'Comprar e Inscrever' : 'Inscrever Grátis'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. BARRA DE PROGRESSO AULA A AULA (% CONCLUÍDO) */}
                {status === 'aprovado' && (
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>
                        Progresso do Curso: <span style={{ color: '#ff6b00' }}>{doneCount} de {totalLessons} Aulas</span>
                      </span>
                      <span style={{ fontWeight: 800, color: progressPercent === 100 ? '#16a34a' : '#ff6b00' }}>
                        {progressPercent}% Concluído
                      </span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${progressPercent}%`,
                          background: progressPercent === 100 ? '#16a34a' : 'linear-gradient(90deg, #ff6b00 0%, #ff8c3a 100%)',
                          borderRadius: '10px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>

      {/* Video Player Modal with Intelligent Real-Time Progress Bar */}
      {showVideoModal && videoCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '1050px', width: '100%', position: 'relative', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <button
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontSize: '1.5rem', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => { setShowVideoModal(false); setVideoCourse(null); setActiveVideoUrl(''); setActiveVideoTitle(''); }}
            >
              &times;
            </button>
            
            <div style={{ flexShrink: 0 }}>
              <h3 style={{ color: '#0f172a', fontFamily: 'Outfit', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>🎥 {videoCourse.title}</h3>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.88rem' }}>Aula atual: {activeVideoTitle}</p>
            </div>
            
            {/* Split layout: sidebar and player */}
            {(() => {
              const courseEnrollment = getEnrollment(videoCourse.title);
              const isApproved = courseEnrollment && courseEnrollment.status === 'aprovado';
              const list = videoCourse.lessonsList && videoCourse.lessonsList.length > 0
                ? videoCourse.lessonsList
                : [{ title: 'Aula 1: Apresentação e Módulos', videoUrl: toYoutubeEmbed(videoCourse.videoUrl) || 'https://www.youtube.com/embed/dQw4w9WgXcQ' }];
              const completedLessonsArr = courseEnrollment?.completedLessons || [];
              const modalDoneCount = completedLessonsArr.length;
              const modalProgressPercent = Math.min(100, Math.round((modalDoneCount / list.length) * 100));

              const currentIdx = list.findIndex((l: any) => toYoutubeEmbed(l.videoUrl) === activeVideoUrl || l.title === activeVideoTitle);
              const validIdx = currentIdx >= 0 ? currentIdx : 0;
              const hasPrev = validIdx > 0;
              const hasNext = validIdx < list.length - 1;
              const isCurrentChecked = completedLessonsArr.includes(validIdx);

              const goToLesson = (idx: number) => {
                const target = list[idx];
                if (!target) return;
                setActiveVideoUrl(toYoutubeEmbed(target.videoUrl));
                setActiveVideoTitle(target.title);

                if (isApproved && courseEnrollment && !completedLessonsArr.includes(idx)) {
                  handleToggleLessonComplete(courseEnrollment, idx, list.length);
                }
              };

              return (
                <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0, flexWrap: 'wrap' }}>
                  {/* Left Column: Lesson List */}
                  <div style={{ 
                    flex: '1 1 300px', 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    padding: '1rem', 
                    maxHeight: '100%', 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                  }}>
                    {/* Intelligent Real-Time Progress Bar inside Player Modal */}
                    {isApproved && (
                      <div style={{ padding: '0.85rem', background: '#ffffff', borderRadius: '12px', border: '1.5px solid #ff6b00', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                          <span style={{ color: '#0f172a' }}>Progresso Inteligente:</span>
                          <span style={{ color: modalProgressPercent === 100 ? '#16a34a' : '#ff6b00' }}>
                            {modalDoneCount} de {list.length} ({modalProgressPercent}%)
                          </span>
                        </div>
                        <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${modalProgressPercent}%`, background: modalProgressPercent === 100 ? '#16a34a' : 'linear-gradient(90deg, #ff6b00 0%, #ff8c3a 100%)', borderRadius: '10px', transition: 'width 0.3s ease' }} />
                        </div>
                        {modalProgressPercent === 100 && (
                          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 800, marginTop: '2px', textAlign: 'center' }}>
                            🎉 Parabéns! Formação 100% Concluída!
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ padding: '0.85rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#475569' }}>
                      <div>👨‍🏫 <strong>Formador:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{videoCourse.instructor}</span></div>
                      <div>⏱️ <strong>Duração:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{videoCourse.duration}</span></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ff6b00', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lista de Aulas</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Marque `✓` ao concluir</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                      {list.map((lesson: any, idx: number) => {
                        const isSelected = lesson.videoUrl === activeVideoUrl || lesson.title === activeVideoTitle;
                        const isLocked = idx > 0 && !isApproved;
                        const isChecked = completedLessonsArr.includes(idx);

                        return (
                          <div
                            key={idx}
                            style={{
                              background: isSelected ? '#fff7ed' : '#ffffff',
                              border: `1.5px solid ${isSelected ? '#ff6b00' : '#e2e8f0'}`,
                              borderRadius: '10px',
                              padding: '10px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              cursor: isLocked ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <button
                              disabled={isLocked}
                              onClick={() => {
                                if (isLocked) return;
                                goToLesson(idx);
                              }}
                              style={{
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: isLocked ? '#94a3b8' : isSelected ? '#ff6b00' : '#334155',
                                fontSize: '0.85rem',
                                fontWeight: isSelected ? 700 : 500,
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <span style={{ color: isSelected ? '#ff6b00' : '#94a3b8', fontWeight: 700, marginRight: '6px' }}>{idx + 1}.</span>
                              {lesson.title}
                            </button>

                            {/* Checkbox Concluir Aula Individual & PDF Download */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {lesson.pdfUrl && (
                                <a
                                  href={lesson.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Baixar Ficheiro PDF de Apoio"
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    border: '1px solid #bfdbfe',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  onClick={e => e.stopPropagation()}
                                >
                                  📄 PDF
                                </a>
                              )}

                              {isApproved ? (
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  title={isChecked ? "Aula Concluída" : "Marcar como Concluída"}
                                  onChange={() => courseEnrollment && handleToggleLessonComplete(courseEnrollment, idx, list.length)}
                                  style={{ width: '18px', height: '18px', accentColor: '#16a34a', cursor: 'pointer', flexShrink: 0 }}
                                />
                              ) : isLocked && (
                                <span style={{ fontSize: '0.8rem' }}>🔒</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Player & Quick Navigation Bar */}
                  <div style={{ flex: '3 1 450px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ 
                      width: '100%', 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      aspectRatio: '16/9', 
                      background: '#0f172a',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {activeVideoUrl ? (
                        <iframe
                          src={activeVideoUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 'none', display: 'block' }}
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          title="Player de Vídeo da Aula"
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '3rem' }}>📄</span>
                          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#cbd5e1', margin: 0 }}>Esta aula é apenas em PDF</p>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Consulte o material de apoio na lista ao lado</p>
                        </div>
                      )}
                    </div>

                    {/* Lesson Navigation Controls Toolbar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                      <button
                        type="button"
                        disabled={!hasPrev}
                        onClick={() => goToLesson(validIdx - 1)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          background: hasPrev ? '#ffffff' : '#f1f5f9',
                          color: hasPrev ? '#0f172a' : '#94a3b8',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: hasPrev ? 'pointer' : 'not-allowed',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                      >
                        ⬅️ Aula Anterior
                      </button>

                      {isApproved && (
                        <button
                          type="button"
                          onClick={() => {
                            if (courseEnrollment && !isCurrentChecked) {
                              handleToggleLessonComplete(courseEnrollment, validIdx, list.length);
                            }
                            if (hasNext) {
                              goToLesson(validIdx + 1);
                            }
                          }}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                            color: '#ffffff',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                            transition: 'all 0.2s'
                          }}
                        >
                          ✓ {hasNext ? 'Concluir & Próxima ➡️' : 'Concluir Formação 🎉'}
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={!hasNext || (!isApproved && validIdx + 1 > 0)}
                        onClick={() => goToLesson(validIdx + 1)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          border: 'none',
                          background: hasNext ? 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)' : '#cbd5e1',
                          color: hasNext ? '#ffffff' : '#64748b',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: hasNext ? 'pointer' : 'not-allowed',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: hasNext ? '0 4px 12px rgba(255, 107, 0, 0.25)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        Próxima Aula ➡️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Confirm Registration Details Modal (Ficha de Inscrição) */}
      {showEnrollConfirmModal && courseToEnroll && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '520px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)' }}>
            <button 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontSize: '1.4rem', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              onClick={() => { setShowEnrollConfirmModal(false); setCourseToEnroll(null); }}
            >
              &times;
            </button>
            <h2 style={{ color: '#0f172a', fontSize: '1.6rem', fontFamily: 'Outfit', fontWeight: 800, marginBottom: '0.2rem' }}>Ficha de Inscrição</h2>
            <p style={{ color: '#ff6b00', fontWeight: 700, margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>Curso: {courseToEnroll.title}</p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowEnrollConfirmModal(false);
                if (isCoursePaid(courseToEnroll)) {
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
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nome do Aluno</label>
                <input 
                  value={userName} 
                  disabled
                  style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '10px', color: '#475569', cursor: 'not-allowed', fontWeight: 600, fontSize: '0.92rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telefone / WhatsApp *</label>
                <input 
                  value={enrollPhone}
                  onChange={e => setEnrollPhone(e.target.value)}
                  placeholder="Ex: +258 84 123 4567"
                  required
                  style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.92rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Empresa / Startup *</label>
                <input 
                  value={enrollCompany}
                  onChange={e => setEnrollCompany(e.target.value)}
                  placeholder="Nome da sua empresa ou projeto"
                  required
                  style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 500, fontSize: '0.92rem', outline: 'none' }}
                />
              </div>

              <button 
                type="submit" 
                style={{
                  borderRadius: '12px',
                  marginTop: '0.75rem',
                  padding: '14px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 107, 0, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {isCoursePaid(courseToEnroll) ? 'Avançar para Pagamento 💳' : 'Confirmar e Inscrever Grátis 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Proof Upload Modal */}
      {showModal && selectedCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '520px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)' }}>
            <button 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontSize: '1.4rem', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              onClick={() => { setShowModal(false); setFile(null); setUploadedUrl(''); }}
            >
              &times;
            </button>
            <h2 style={{ color: '#0f172a', fontSize: '1.6rem', fontFamily: 'Outfit', fontWeight: 800, marginBottom: '0.2rem' }}>Submeter Comprovativo</h2>
            <p style={{ color: '#ff6b00', fontWeight: 700, margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>Curso: {selectedCourse.title} ({selectedCourse.price})</p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.7rem 1rem', borderRadius: '10px', fontSize: '0.78rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem', lineHeight: '1.4' }}>
              <strong style={{ color: '#0f172a', fontSize: '0.8rem' }}>🏦 Dados de Pagamento &amp; Transferência — <span style={{ fontWeight: 400 }}>Titular: Lizi Cristina Mulambo</span></strong>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <div style={{ background: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0', flex: 1, minWidth: '140px' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>1️⃣ BIM</span> · Conta: <strong>5283397</strong><br/>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>NIB: 0001 000000005283397 57</span>
                </div>
                <div style={{ background: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0', flex: 1, minWidth: '140px' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>2️⃣ Moza</span> · Conta: <strong>0087656640001</strong><br/>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>NIB: 0034 000008765664101 25</span>
                </div>
              </div>
              <div style={{ background: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
                <span>📱 <strong>M-Pesa:</strong> 857670109</span>
                <span>📱 <strong>e-Mola:</strong> 876687082</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#ff6b00', fontWeight: 600 }}>* Realize o pagamento e submeta o comprovativo abaixo.</span>
            </div>

            <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ficheiro do Comprovativo *</label>
                <label 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '2rem 1rem', 
                    border: '2px dashed #cbd5e1', 
                    borderRadius: '16px', 
                    cursor: 'pointer', 
                    background: '#f8fafc',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#ff6b00';
                    (e.currentTarget as HTMLElement).style.background = '#fff7ed';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
                    (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                  }}
                >
                  <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    {file ? file.name : 'Selecionar Comprovativo'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Formatos suportados: PNG, JPG ou PDF (Máx. 5MB)
                  </span>
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    required 
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }} 
                  />
                </label>
                {uploading && <div style={{ fontSize: '0.82rem', color: '#ff6b00', textAlign: 'center', marginTop: '0.5rem', fontWeight: 600 }}>⏳ A enviar ficheiro para o servidor...</div>}
              </div>

              <button 
                type="submit" 
                disabled={submitting || uploading || !uploadedUrl} 
                style={{
                  borderRadius: '12px',
                  marginTop: '0.5rem',
                  padding: '14px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  background: submitting || uploading || !uploadedUrl ? '#cbd5e1' : 'linear-gradient(135deg, #ff6b00 0%, #ff8c3a 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: submitting || uploading || !uploadedUrl ? 'not-allowed' : 'pointer',
                  boxShadow: submitting || uploading || !uploadedUrl ? 'none' : '0 4px 16px rgba(255, 107, 0, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {submitting ? 'A submeter...' : 'Submeter Comprovativo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal with 4. Gerador de Certificado PDF Direto */}
      {showCert && selectedCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem', zIndex: 2010 }}>
            <button 
              onClick={() => window.print()}
              style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 700, background: '#ff6b00', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              📄 Descarregar / Imprimir PDF
            </button>
            <button 
              onClick={() => { setShowCert(false); setSelectedCourse(null); }}
              style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 700, background: 'transparent', color: '#fff', border: '1.5px solid #fff', borderRadius: '10px', cursor: 'pointer' }}
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
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '50px', marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888' }}>
                  AFROBIZ NETWORK ACCELERATION
                </span>
              </div>
              
              {selectedCourse.certUsePartnerLogos && (() => {
                const logos = selectedCourse.certPartnerLogos && selectedCourse.certPartnerLogos.length > 0
                  ? selectedCourse.certPartnerLogos
                  : (selectedCourse.certPartnerLogoUrl ? [selectedCourse.certPartnerLogoUrl] : []);
                
                if (logos.length === 0) return null;

                return (
                  <>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(0,0,0,0.1)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {logos.map((logoUrl: string, idx: number) => (
                          <img key={idx} src={logoUrl} alt={`Partner Logo ${idx + 1}`} style={{ height: '48px', maxWidth: '120px', objectFit: 'contain', marginBottom: '0.25rem' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888' }}>
                        {logos.length > 1 ? 'Parceiros Certificadores' : 'Parceiro Certificador'}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>

            <div>
              <h1 style={{ fontSize: '2.8rem', color: selectedCourse.certBgColor || '#ff6b00', margin: '0.5rem 0', fontFamily: 'Outfit', fontWeight: 800 }}>
                CERTIFICADO
              </h1>
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#444' }}>
                de conclusão e aproveitamento
              </span>
            </div>

            <div style={{ maxWidth: '650px' }}>
              <p style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#555' }}>Certificamos que, para os devidos efeitos de mérito,</p>
              <h2 style={{ fontSize: '2.2rem', color: selectedCourse.certTextColor || '#1c1917', textDecoration: 'underline', margin: '0.5rem 0', fontFamily: 'Outfit', fontWeight: 700 }}>
                {userName}
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#444', margin: '1rem 0' }}>
                concluiu com aproveitamento e sucesso o programa de formação em aceleração de negócios denominado <strong style={{ color: selectedCourse.certBgColor || '#ff6b00' }}>{selectedCourse.title}</strong>, com a duração total de <strong>{selectedCourse.duration}</strong> e aproveitamento prático estruturado.
              </p>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', fontSize: '0.8rem', color: '#666' }}>
              <div style={{ textAlign: 'left' }}>
                📍 Bissau, Guiné-Bissau
                <div style={{ marginTop: '0.2rem' }}>
                  📅 {new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '1.2rem', color: '#2a4fa6', marginBottom: '0.2rem' }}>
                  Afonso Domingos
                </div>
                <div style={{ borderTop: '1px solid #ccc', width: '150px', marginTop: '0.2rem', paddingTop: '0.2rem' }}>
                  Direção ABN
                </div>
              </div>

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

export default function FormacaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar academia...</div>}>
      <FormacaoPageInner />
    </Suspense>
  );
}
