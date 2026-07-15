'use client';

import { useState, useEffect } from 'react';

interface Template {
  name: string;
  subject: string;
  html: string;
}

export default function AdminComunicacaoPage() {
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const templates: Template[] = [
    {
      name: '📢 Boletim de Novidades (Newsletter)',
      subject: 'Novidades e Atualizações da AfroBiz Network! 🌍',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
  <h2 style="color: #ff6b00; text-align: center;">AfroBiz Network — Conectando África ao Mundo</h2>
  <p>Olá,</p>
  <p>Temos o prazer de partilhar consigo as mais recentes atualizações e melhorias na nossa plataforma. Estamos constantemente a trabalhar para criar a melhor experiência e facilitar o seu caminho de aceleração empresarial.</p>
  <div style="background: #fdf2e9; border-left: 4px solid #ff6b00; padding: 15px; margin: 20px 0; border-radius: 6px;">
    <strong>O que há de novo?</strong>
    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
      <li>Novo módulo de formações certificadas com aulas interativas;</li>
      <li>Melhorias de desempenho na sua Dashboard e Perfil;</li>
      <li>Mais conexões estratégicas com parceiros de microfomento.</li>
    </ul>
  </div>
  <p>Aceda ao seu painel e explore os novos recursos hoje mesmo!</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="https://afrobiznetwork.com/login" style="background: #ff6b00; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; display: inline-block;">Aceder à Plataforma</a>
  </p>
  <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
  <p style="font-size: 0.8rem; color: #888; text-align: center;">AfroBiz Network Lda. — Moçambique. Todos os direitos reservados.</p>
</div>`
    },
    {
      name: '📚 Divulgação de Nova Formação',
      subject: 'Nova Formação Disponível: Potencie o seu Negócio! 📚',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
  <h2 style="color: #ff6b00; text-align: center;">Nova Formação Certificada Aberta!</h2>
  <p>Olá,</p>
  <p>É com entusiasmo que anunciamos o lançamento de uma nova formação na nossa plataforma, desenhada especificamente para capacitar empreendedores e gestores de projetos inovadores.</p>
  <div style="background: #fdf2e9; border-left: 4px solid #ff6b00; padding: 15px; margin: 20px 0; border-radius: 6px;">
    <strong>Programa de Capacitação ABN</strong><br/>
    Descubra conceitos essenciais, metodologias práticas e ferramentas de ponta para estruturar e acelerar o crescimento do seu negócio sustentável.
  </div>
  <p>As inscrições já estão abertas e a primeira aula (Introdução) é 100% gratuita para assistir imediatamente!</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="https://afrobiznetwork.com/dashboard/formacao" style="background: #ff6b00; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; display: inline-block;">Ver Formação e Inscrever-se</a>
  </p>
  <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
  <p style="font-size: 0.8rem; color: #888; text-align: center;">AfroBiz Network Lda. — Moçambique. Todos os direitos reservados.</p>
</div>`
    },
    {
      name: '💼 Oportunidades de Negócio & Networking',
      subject: 'Oportunidades de Matchmaking e Pitching ABN 💼',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
  <h2 style="color: #ff6b00; text-align: center;">Oportunidades de Investimento e Matchmaking</h2>
  <p>Olá,</p>
  <p>Temos parcerias ativas com investidores e mentores globais que procuram ativamente startups de impacto focadas no mercado africano.</p>
  <p>Se tem o seu perfil preenchido e atualizado na nossa plataforma, poderá ser selecionado para as sessões exclusivas de Matchmaking e sessões de Pitching.</p>
  <div style="background: #fdf2e9; border-left: 4px solid #ff6b00; padding: 15px; margin: 20px 0; border-radius: 6px;">
    <strong>Garanta o seguinte para participar:</strong>
    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
      <li>Perfil profissional 100% preenchido;</li>
      <li>Descrição clara do seu sector e modelo de negócio;</li>
      <li>Informações de contacto atualizadas.</li>
    </ul>
  </div>
  <p style="text-align: center; margin: 30px 0;">
    <a href="https://afrobiznetwork.com/dashboard" style="background: #ff6b00; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; display: inline-block;">Atualizar Meu Perfil</a>
  </p>
  <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
  <p style="font-size: 0.8rem; color: #888; text-align: center;">AfroBiz Network Lda. — Moçambique. Todos os direitos reservados.</p>
</div>`
    }
  ];

  useEffect(() => {
    // Fetch total registered users count for stats
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users) {
          setTotalUsers(data.users.length);
        }
      })
      .catch(() => {});
  }, []);

  const selectTemplate = (tpl: Template) => {
    setSubject(tpl.subject);
    setHtml(tpl.html);
    setStatusMsg({ type: '', text: '' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !html.trim()) {
      setStatusMsg({ type: 'error', text: 'Preencha o Assunto e o Corpo do E-mail.' });
      return;
    }

    if (!confirm('Deseja realmente enviar esta mensagem para TODOS os utilizadores registados na plataforma?')) {
      return;
    }

    setSending(true);
    setStatusMsg({ type: 'info', text: 'A enviar transmissão de e-mails em massa...' });

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html })
      });
      const data = await res.json();
      
      if (data.success) {
        setStatusMsg({ 
          type: 'success', 
          text: `Sucesso! Mensagem transmitida para ${data.sentCount} de ${data.totalUsers} utilizadores registados.` 
        });
        setSubject('');
        setHtml('');
      } else {
        setStatusMsg({ 
          type: 'error', 
          text: data.error || 'Ocorreu um erro ao enviar e-mails.' 
        });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Erro de rede ao ligar ao servidor.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontFamily: 'Outfit', background: 'linear-gradient(135deg, #ff8c00, #ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
          📢 Transmissão de E-mails (Broadcast)
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          Envie comunicações e alertas de e-mail automatizados para todos os utilizadores registados através do Resend.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left Form column */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Email Form */}
          <form onSubmit={handleSend} className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'Outfit', color: '#fff', fontSize: '1.2rem' }}>✉️ Nova Mensagem</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Assunto do E-mail</label>
              <input 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Introduza o assunto da mensagem"
                required
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Corpo do E-mail (Código HTML)</label>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {previewMode ? '✍️ Editar HTML' : '👁️ Ver Pré-visualização'}
                </button>
              </div>

              {previewMode ? (
                <div style={{ 
                  background: '#fff', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  minHeight: '250px', 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {html ? (
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>Nada para pré-visualizar. Insira código HTML ou selecione um modelo.</p>
                  )}
                </div>
              ) : (
                <textarea 
                  value={html}
                  onChange={e => setHtml(e.target.value)}
                  placeholder="Escreva ou cole o seu código HTML. Dica: use estilos inline para e-mails."
                  required
                  rows={10}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                />
              )}
            </div>

            {statusMsg.text && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '8px', 
                fontSize: '0.85rem', 
                background: statusMsg.type === 'success' ? 'rgba(46,204,113,0.15)' : statusMsg.type === 'error' ? 'rgba(231,76,60,0.15)' : 'rgba(52,152,219,0.15)',
                color: statusMsg.type === 'success' ? '#2ecc71' : statusMsg.type === 'error' ? '#e74c3c' : '#3498db',
                border: `1px solid ${statusMsg.type === 'success' ? '#2ecc71' : statusMsg.type === 'error' ? '#e74c3c' : '#3498db'}`
              }}>
                {statusMsg.text}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={sending}
              style={{ borderRadius: '8px', marginTop: '0.5rem', cursor: sending ? 'not-allowed' : 'pointer' }}
            >
              {sending ? 'A enviar transmissão...' : '🚀 Enviar Transmissão de E-mails'}
            </button>
          </form>
        </div>

        {/* Right side options column */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Stats card */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'Outfit', color: '#fff', fontSize: '1.1rem' }}>📊 Dados do Broadcast</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.8rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Utilizadores Alvo:</span>
              <strong style={{ color: '#fff' }}>{totalUsers !== null ? `${totalUsers} registados` : 'A carregar...'}</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
              * Os e-mails serão enviados para todos os utilizadores através do Resend em lotes protegidos de 50 destinatários em BCC para garantir privacidade de contactos e evitar spam.
            </div>
          </div>

          {/* Email Templates list */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'Outfit', color: '#fff', fontSize: '1.1rem' }}>📋 Modelos Disponíveis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => selectTemplate(tpl)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'left',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Resend setup helper */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '0.6rem', border: '1px solid rgba(255,107,0,0.15)' }}>
            <h3 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--primary)', fontSize: '0.95rem' }}>⚙️ Configuração do Resend</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
              Certifique-se de configurar as seguintes chaves no seu ficheiro <code>.env.local</code> para o envio funcionar corretamente:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                🔑 RESEND_API_KEY=re_xxx
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                📧 RESEND_FROM_EMAIL=sua-empresa@seu-dominio.com
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
