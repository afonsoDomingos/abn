'use client';

import { useEffect, useState } from 'react';
import styles from '../Dashboard.module.css';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'novo' | 'lido' | 'respondido';
  createdAt: string;
}

export default function MensagensPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setMessages(data.contacts || []);
      }
    } catch (e) {
      console.error('Error fetching messages:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setMsg({ type: '', text: '' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name || 'Empreendedor',
          email: user.email || 'email@example.com',
          message: newMessage
        })
      });

      const data = await res.json();
      if (data.success) {
        setNewMessage('');
        fetchMessages();
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao enviar mensagem.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de conexão ao enviar.' });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar mensagens...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Mensagens com a Administração</h1>
        <p style={{ opacity: 0.8, color: '#e5e5e5' }}>Envie as suas dúvidas, atualizações de projetos e comunique diretamente com o suporte da ABN.</p>
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

      {/* Main Messaging Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Send message card */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'Outfit', marginBottom: '1rem' }}>Enviar Nova Mensagem</h3>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Escreva a sua mensagem detalhada para o suporte administrativo..."
              rows={4}
              required
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff', resize: 'vertical' }}
            />
            <button type="submit" className="btn-primary" disabled={sending} style={{ alignSelf: 'flex-start' }}>
              {sending ? 'A enviar...' : '✉️ Enviar Mensagem'}
            </button>
          </form>
        </div>

        {/* Message Log */}
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'Outfit', marginBottom: '1.5rem' }}>Histórico de Contactos</h3>
          {messages.length === 0 ? (
            <div className="glass" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
              Ainda não enviou nenhuma mensagem. Utilize o formulário acima para entrar em contacto.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.map((m) => (
                <div key={m._id} className="glass" style={{ padding: '2rem', borderRadius: '20px', borderLeft: `4px solid ${m.status === 'respondido' ? '#2ecc71' : 'var(--primary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                      📅 {new Date(m.createdAt).toLocaleString('pt-PT')}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: m.status === 'novo' ? 'rgba(255,107,0,0.15)' : m.status === 'lido' ? 'rgba(52,152,219,0.15)' : 'rgba(46,204,113,0.15)',
                      color: m.status === 'novo' ? 'var(--primary)' : m.status === 'lido' ? '#3498db' : '#2ecc71'
                    }}>
                      {m.status === 'novo' ? 'Enviada' : m.status === 'lido' ? 'Lida' : 'Respondida'}
                    </span>
                  </div>
                  <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{m.message}</p>
                  
                  {m.status === 'respondido' && (
                    <div style={{ marginTop: '1.2rem', padding: '1rem', background: 'rgba(46,204,113,0.06)', borderRadius: '12px', border: '1px dashed rgba(46,204,113,0.2)', fontSize: '0.85rem', color: '#2ecc71' }}>
                      ℹ️ <strong>Estado:</strong> Esta mensagem foi analisada e respondida pela administração da ABN (verifique a sua caixa de correio eletrónico).
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
