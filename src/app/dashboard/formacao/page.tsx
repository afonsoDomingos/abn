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


  useEffect(() => {
    fetchEnrollments();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUserName(u.name || 'Empreendedor');
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

  const handleEnrollFree = async (course: Course) => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: course.title,
          price: 'Gratuito',
          proofUrl: 'gratuito'
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
          proofUrl: uploadedUrl
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
    return payments.find(p => p.itemName === courseTitle);
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {courses.map((course) => {
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
                    {course.videoUrl && course.videoVisible !== false && (
                      <button
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}
                        onClick={() => {
                          setVideoModalUrl(course.videoUrl);
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
                {status === 'pendente' && (
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'rgba(241,196,15,0.15)', color: '#f1c40f', border: '1px solid #f1c40f', padding: '8px 20px', borderRadius: '40px' }}>
                    ⏳ Pagamento em Verificação
                  </span>
                )}
                {status === 'rejeitado' && (
                  <button
                    className="btn-primary"
                    style={{ background: '#e74c3c' }}
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowModal(true);
                    }}
                  >
                    ❌ Rejeitado - Reenviar
                  </button>
                )}
                {status === 'none' && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (course.isPaid) {
                        setSelectedCourse(course);
                        setShowModal(true);
                      } else {
                        handleEnrollFree(course);
                      }
                    }}
                  >
                    {course.isPaid ? 'Comprar e Inscrever' : 'Inscrever Grátis'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {showVideoModal && videoModalUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '860px', width: '100%', position: 'relative' }}>
            <button
              style={{ position: 'absolute', top: '-2.5rem', right: 0, background: 'none', border: 'none', color: '#ff4d4d', fontSize: '2rem', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => { setShowVideoModal(false); setVideoModalUrl(''); }}
            >
              &times;
            </button>
            <h3 style={{ color: '#fff', fontFamily: 'Outfit', marginBottom: '1rem', fontSize: '1.1rem' }}>🎥 Aulas do Curso</h3>
            <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
              <iframe
                src={videoModalUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', display: 'block' }}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Aulas do Curso"
              />
            </div>
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
            borderImage: 'linear-gradient(135deg, #ff6b00 0%, #ffc107 100%) 20 stretch',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            color: '#1c1917',
            position: 'relative',
            fontFamily: "'Outfit', sans-serif"
          }}>
            {/* Header branding */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/abn-logo.png" alt="ABN Logo" style={{ height: '50px', marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888' }}>
                AFROBIZ NETWORK ACCELERATION
              </span>
            </div>

            {/* Main title */}
            <div>
              <h1 style={{ fontSize: '2.8rem', color: '#ff6b00', margin: '0.5rem 0', fontFamily: 'Outfit', fontWeight: 800 }}>
                CERTIFICADO
              </h1>
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#444' }}>
                de conclusão e aproveitamento
              </span>
            </div>

            {/* Recipient body */}
            <div style={{ maxWidth: '650px' }}>
              <p style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#555' }}>Certificamos que, para os devidos efeitos de mérito,</p>
              <h2 style={{ fontSize: '2.2rem', color: '#1c1917', textDecoration: 'underline', margin: '0.5rem 0', fontFamily: 'Outfit', fontWeight: 700 }}>
                {userName}
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#444', margin: '1rem 0' }}>
                concluiu com aproveitamento e sucesso o programa de formação em aceleração de negócios denominado <strong style={{ color: '#ff6b00' }}>{selectedCourse.title}</strong>, com a duração total de <strong>{selectedCourse.duration}</strong> e aproveitamento prático estruturado.
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
                border-image: linear-gradient(135deg, #ff6b00 0%, #ffc107 100%) 20 stretch !important;
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
