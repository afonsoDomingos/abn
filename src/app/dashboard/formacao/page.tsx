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
  const [loading, setLoading] = useState(true);
  const [courses] = useState<Course[]>([
    { id: 'c1', title: 'Inovação e Modelos de Negócio Verdes', instructor: 'Prof. Amadou Diallo', duration: '12h', lessons: 8, price: 'Gratuito', isPaid: false },
    { id: 'c2', title: 'Fundamentos de Pitching para Startups', instructor: 'Rita Santos (Mentora ABN)', duration: '6h', lessons: 4, price: '5.000 FCFA', isPaid: true },
    { id: 'c3', title: 'Certificação em Gestão de Microfomento', instructor: 'Banco de Microfomento', duration: '15h', lessons: 10, price: '15.000 FCFA', isPaid: true }
  ]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
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

  // Helper to check current course enrollment status
  const getEnrollmentStatus = (courseTitle: string) => {
    const match = payments.find(p => p.itemName === courseTitle);
    if (!match) return 'none';
    return match.status; // 'pendente', 'aprovado', 'rejeitado'
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
          const status = getEnrollmentStatus(course.title);
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
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'rgba(46,204,113,0.15)', color: '#2ecc71', border: '1px solid #2ecc71', padding: '8px 20px', borderRadius: '40px' }}>
                    ✅ Aceder ao Curso
                  </span>
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
    </div>
  );
}
