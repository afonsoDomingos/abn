'use client';

import { useState, useEffect } from 'react';

interface Template {
  id: string;
  category: string;
  name: string;
  description: string;
  subject: string;
  html: string;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export default function AdminComunicacaoPage() {
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [recipientTarget, setRecipientTarget] = useState('all');
  const [testEmail, setTestEmail] = useState('');
  const [specificEmail, setSpecificEmail] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [sending, setSending] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info' | ''; text: string }>({ type: '', text: '' });
  const [userStats, setUserStats] = useState<{ total: number; empreendedores: number; investidores: number; empresas: number }>({
    total: 0,
    empreendedores: 0,
    investidores: 0,
    empresas: 0,
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Base layout wrapper helper - Clean, professional corporate design without emojis
  const createBrandedHtml = (title: string, bodyContent: string, buttonText?: string, buttonUrl?: string) => {
    return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 28px; text-align: center; border-bottom: 4px solid #ff6b00;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 1px;">
                AFROBIZ <span style="color: #ff6b00;">NETWORK</span>
              </h1>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                Plataforma de Aceleração e Negócios
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px; line-height: 1.65; font-size: 15px; color: #334155;">
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 18px;">
                ${title}
              </h2>
              ${bodyContent}
              
              ${buttonText && buttonUrl ? `
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${buttonUrl}" style="background-color: #ff6b00; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
                  ${buttonText}
                </a>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 22px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #475569; font-size: 12px;">ABN - AfroBiz Network</p>
              <p style="margin: 0 0 10px 0; color: #64748b;">A acelerar e conectar o ecossistema empresarial africano e lusófono.</p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                Mensagem enviada para a conta registada na AfroBiz Network.<br/>
                © ${new Date().getFullYear()} AfroBiz Network Lda. Todos os direitos reservados.
              </p>
              
              <!-- Discreet Partner Credit -->
              <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #e2e8f0; text-align: center;">
                <a href="https://wehosthere.com" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block; opacity: 0.65;">
                  <span style="font-size: 9px; color: #94a3b8; letter-spacing: 0.5px; vertical-align: middle; margin-right: 6px;">Powered by</span>
                  <img src="https://abnafrobiznetwork.com/wehosthere.png" alt="WeHosThere" width="42" style="vertical-align: middle; display: inline-block; border: 0;" />
                </a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const templates: Template[] = [
    {
      id: 'newsletter',
      category: 'informativo',
      name: 'Boletim de Notícias e Atualizações',
      description: 'Destaques mensais, novos recursos e crescimento da comunidade.',
      subject: 'Novidades e Destaques da AfroBiz Network',
      html: createBrandedHtml(
        'Atualizações e Destaques da Plataforma',
        `<p>Prezado(a) Utilizador(a),</p>
        <p>Partilhamos consigo as principais novidades e melhorias implementadas na plataforma <strong>AfroBiz Network</strong> este mês.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 16px; margin: 22px 0; border-radius: 6px;">
          <strong style="color: #0f172a; font-size: 14px;">Principais Atualizações:</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569;">
            <li style="margin-bottom: 6px;">Novos módulos de formação com conteúdos práticos;</li>
            <li style="margin-bottom: 6px;">Oportunidades de fomento e parcerias empresariais;</li>
            <li>Melhorias de desempenho e navegação no painel de utilizador.</li>
          </ul>
        </div>

        <p>Aceda à sua conta para explorar todos os recursos disponíveis.</p>`,
        'Aceder à Minha Conta',
        'https://abnafrobiznetwork.com/login'
      )
    },
    {
      id: 'curso_novo',
      category: 'formacao',
      name: 'Divulgação de Nova Formação',
      description: 'Anúncio de cursos, masterclasses e certificações.',
      subject: 'Nova Formação Disponível na AfroBiz Network',
      html: createBrandedHtml(
        'Nova Formação Certificada Disponível',
        `<p>Prezado(a) Utilizador(a),</p>
        <p>Informamos que se encontram abertas as inscrições para uma nova formação direcionada a empreendedores, gestores e profissionais que procuram capacitação prática.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #0f172a; padding: 16px; margin: 22px 0; border-radius: 6px;">
          <strong style="color: #0f172a; font-size: 14px;">Detalhes do Programa:</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569;">
            <li style="margin-bottom: 6px;">Aulas em vídeo com material complementar para consulta;</li>
            <li style="margin-bottom: 6px;">Metodologias aplicadas ao mercado real;</li>
            <li>Emissão de certificado oficial após a conclusão.</li>
          </ul>
        </div>

        <p>Consulte a estrutura do curso e efetue a sua inscrição através da plataforma.</p>`,
        'Consultar Formação',
        'https://abnafrobiznetwork.com/dashboard/formacao'
      )
    },
    {
      id: 'incubacao',
      category: 'programas',
      name: 'Candidaturas para Incubação e Aceleração',
      description: 'Chamada aberta para startups e projetos de negócio.',
      subject: 'Candidaturas Abertas: Programa de Aceleração ABN',
      html: createBrandedHtml(
        'Abertura de Candidaturas ao Programa de Aceleração',
        `<p>Prezado(a) Empreendedor(a),</p>
        <p>Estão abertas as candidaturas para o novo ciclo do <strong>Programa de Incubação e Aceleração da AfroBiz Network</strong>.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 16px; margin: 22px 0; border-radius: 6px;">
          <strong style="color: #0f172a; font-size: 14px;">Benefícios Oferecidos:</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569;">
            <li style="margin-bottom: 6px;">Acompanhamento e mentorias com consultores experientes;</li>
            <li style="margin-bottom: 6px;">Estruturação de modelo de negócio e plano de sustentabilidade;</li>
            <li>Apresentação a investidores e parceiros institucionais.</li>
          </ul>
        </div>

        <p>As vagas são limitadas por ciclo. Recomendamos a submissão atempada da sua candidatura.</p>`,
        'Submeter Candidatura',
        'https://abnafrobiznetwork.com/incubacao'
      )
    },
    {
      id: 'investimento',
      category: 'investimento',
      name: 'Oportunidades de Investimento e Matchmaking',
      description: 'Conexão entre negócios qualificados e parceiros de capital.',
      subject: 'Oportunidades de Matchmaking Empresarial e Investimento',
      html: createBrandedHtml(
        'Sessões de Matchmaking e Apresentação a Investidores',
        `<p>Prezado(a) Membro,</p>
        <p>Anunciamos a abertura de um novo ciclo de matchmaking empresarial para conexão entre negócios e parceiros de investimento integrados na nossa rede.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #0f172a; padding: 16px; margin: 22px 0; border-radius: 6px;">
          <strong style="color: #0f172a; font-size: 14px;">Critérios de Elegibilidade:</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569;">
            <li style="margin-bottom: 6px;">Perfil empresarial completo e atualizado na plataforma;</li>
            <li style="margin-bottom: 6px;">Sumário executivo e proposta de valor definidos;</li>
            <li>Histórico de atividade ou validação do projeto.</li>
          </ul>
        </div>

        <p>Mantenha o seu perfil atualizado para que a sua empresa seja considerada no processo de seleção.</p>`,
        'Atualizar Perfil',
        'https://abnafrobiznetwork.com/dashboard'
      )
    },
    {
      id: 'evento',
      category: 'eventos',
      name: 'Convite para Evento ou Sessão Online',
      description: 'Convites formais para conferências, fóruns e sessões temáticas.',
      subject: 'Convite para Sessão Especial da AfroBiz Network',
      html: createBrandedHtml(
        'Convite para Sessão Temática e Networking',
        `<p>Prezado(a) Membro,</p>
        <p>Temos a honra de convidá-lo(a) para participar na nossa próxima sessão temática online, focada no desenvolvimento e expansão de negócios.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 16px; margin: 22px 0; border-radius: 6px;">
          <table width="100%" border="0" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #334155;">
            <tr>
              <td width="28%" style="font-weight: 700; color: #475569;">Data:</td>
              <td>Quinta-Feira</td>
            </tr>
            <tr>
              <td style="font-weight: 700; color: #475569;">Horário:</td>
              <td>18:00 (GMT+2)</td>
            </tr>
            <tr>
              <td style="font-weight: 700; color: #475569;">Formato:</td>
              <td>Transmissão Online</td>
            </tr>
          </table>
        </div>

        <p>A participação é reservada a utilizadores registados na plataforma.</p>`,
        'Confirmar Presença',
        'https://abnafrobiznetwork.com/eventos'
      )
    },
    {
      id: 'aviso',
      category: 'institucional',
      name: 'Comunicado Institucional',
      description: 'Notas oficiais, termos de serviço e avisos institucionais.',
      subject: 'Comunicado Oficial aos Utilizadores da AfroBiz Network',
      html: createBrandedHtml(
        'Comunicado da Direção',
        `<p>Prezados Utilizadores,</p>
        <p>Dirigimo-nos a todos os membros para partilhar informações relevantes sobre a evolução institucional e técnica da plataforma AfroBiz Network.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 16px; margin: 22px 0; border-radius: 6px;">
          <p style="margin: 0; color: #334155; font-size: 14px;">
            Continuamos empenhados em fortalecer os mecanismos de apoio ao empreendedorismo, garantindo segurança, integridade e estabilidade em todos os serviços disponibilizados.
          </p>
        </div>

        <p>Agradecemos o vosso envolvimento contínuo na nossa plataforma.</p>`,
        'Aceder ao Portal',
        'https://abnafrobiznetwork.com'
      )
    },
    {
      id: 'clube',
      category: 'clube',
      name: 'Boas-vindas ao Clube de Negócios',
      description: 'Mensagem de admissão para membros do Clube ABN.',
      subject: 'Boas-vindas ao Clube de Negócios AfroBiz Network',
      html: createBrandedHtml(
        'Confirmação de Acesso ao Clube de Negócios',
        `<p>Prezado(a) Membro,</p>
        <p>Confirmamos a sua integração no <strong>Clube de Negócios da AfroBiz Network</strong>, o nosso espaço dedicado a empresários e líderes do setor produtivo.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #0f172a; padding: 16px; margin: 22px 0; border-radius: 6px;">
          <strong style="color: #0f172a; font-size: 14px;">Serviços e Benefícios Associados:</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569;">
            <li style="margin-bottom: 6px;">Acesso preferencial a eventos e mesas-redondas de negócios;</li>
            <li style="margin-bottom: 6px;">Canal direto de diálogo e colaboração entre membros;</li>
            <li>Consultoria e assessoria especializada da nossa equipa.</li>
          </ul>
        </div>

        <p>Estamos ao dispor para apoiar os seus objetivos empresariais.</p>`,
        'Aceder ao Clube',
        'https://abnafrobiznetwork.com/clube'
      )
    },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users) {
          const all: UserItem[] = data.users;
          setUsersList(all);
          const empreendedores = all.filter((u: any) => u.role === 'empreendedor' || !u.role).length;
          const investidores = all.filter((u: any) => u.role === 'investidor').length;
          const empresas = all.filter((u: any) => u.role === 'empresa' || u.role === 'collaborator').length;
          setUserStats({
            total: all.length,
            empreendedores,
            investidores,
            empresas,
          });
        }
      })
      .catch(() => {});
  };

  const handleSelectTemplate = (tpl: Template) => {
    setSelectedTemplateId(tpl.id);
    setSubject(tpl.subject);
    setHtml(tpl.html);
    setStatusMsg({ type: '', text: '' });
  };

  const getTargetCount = () => {
    if (recipientTarget === 'single') return 1;
    if (recipientTarget === 'empreendedor') return userStats.empreendedores;
    if (recipientTarget === 'investidor') return userStats.investidores;
    if (recipientTarget === 'empresa') return userStats.empresas;
    return userStats.total;
  };

  const getTargetLabel = () => {
    if (recipientTarget === 'single') return `Utilizador Específico (${specificEmail || 'Não definido'})`;
    if (recipientTarget === 'empreendedor') return 'Empreendedores';
    if (recipientTarget === 'investidor') return 'Investidores e Mentores';
    if (recipientTarget === 'empresa') return 'Empresas e Parceiros';
    return 'Todos os Utilizadores Registados';
  };

  // Send test email
  const handleSendTest = async () => {
    if (!testEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      setStatusMsg({ type: 'error', text: 'Introduza um endereço de e-mail de teste válido.' });
      return;
    }

    if (!subject.trim() || !html.trim()) {
      setStatusMsg({ type: 'error', text: 'Preencha o assunto e o corpo do e-mail antes de testar.' });
      return;
    }

    setSendingTest(true);
    setStatusMsg({ type: 'info', text: `A enviar e-mail de teste para ${testEmail}...` });

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          html,
          recipientTarget: 'test',
          testEmail: testEmail.trim(),
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `E-mail de teste enviado com sucesso para ${testEmail}.` });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Erro ao enviar e-mail de teste.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Erro de ligação ao servidor.' });
    } finally {
      setSendingTest(false);
    }
  };

  // Open custom modal validation
  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !html.trim()) {
      setStatusMsg({ type: 'error', text: 'Preencha o assunto e o corpo do e-mail antes de enviar.' });
      return;
    }

    if (recipientTarget === 'single') {
      if (!specificEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(specificEmail)) {
        setStatusMsg({ type: 'error', text: 'Selecione ou introduza um e-mail válido para o utilizador específico.' });
        return;
      }
    }

    setShowConfirmModal(true);
  };

  // Execute broadcast or send to specific user after custom modal confirmation
  const handleExecuteSend = async () => {
    setShowConfirmModal(false);
    setSending(true);
    setStatusMsg({ type: 'info', text: 'A processar envio de mensagem...' });

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          html,
          recipientTarget,
          specificEmail: specificEmail.trim(),
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ 
          type: 'success', 
          text: recipientTarget === 'single'
            ? `E-mail enviado com sucesso para ${specificEmail}.`
            : `Transmissão concluída com sucesso (${data.sentCount} e-mails enviados).` 
        });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Erro ao processar envio.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Erro de comunicação com o servidor.' });
    } finally {
      setSending(false);
    }
  };

  const categories = [
    { id: 'todos', label: 'Todos os Modelos' },
    { id: 'informativo', label: 'Informativo' },
    { id: 'formacao', label: 'Formação' },
    { id: 'programas', label: 'Aceleração' },
    { id: 'investimento', label: 'Investimento' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'clube', label: 'Clube ABN' },
    { id: 'institucional', label: 'Institucional' },
  ];

  const filteredTemplates = selectedCategory === 'todos' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const filteredUsers = usersList.filter(u => {
    if (!userSearchTerm.trim()) return true;
    const term = userSearchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
            Central de Comunicação e E-mails
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Envio de comunicações institucionais, avisos e comunicados através do Resend com modelos pré-formatados.
          </p>
        </div>

        {/* Sender indicator */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Remetente</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>noreply@abnafrobiznetwork.com</div>
          </div>
        </div>
      </div>

      {/* Modelos Pré-Configurados Section */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Modelos de Mensagem
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
              Selecione um modelo pré-formatado para preencher automaticamente o assunto e o corpo do e-mail.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: selectedCategory === cat.id ? '1px solid #ff6b00' : '1px solid #e2e8f0',
                  background: selectedCategory === cat.id ? '#fff7ed' : '#f8fafc',
                  color: selectedCategory === cat.id ? '#c2410c' : '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {filteredTemplates.map(tpl => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                style={{
                  padding: '1.1rem',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #ff6b00' : '1px solid #e2e8f0',
                  background: isSelected ? '#fffaf5' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                  {tpl.name}
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                  {tpl.description}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#ff6b00' }}>
                  {isSelected ? 'Modelo Ativo' : 'Carregar Modelo'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace (Editor + Live Preview) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT: Composer Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Configuração e Conteúdo
            </h3>

            {/* Target Audience Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Destinatários
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { id: 'all', label: 'Todos os Utilizadores', count: userStats.total },
                  { id: 'empreendedor', label: 'Empreendedores', count: userStats.empreendedores },
                  { id: 'investidor', label: 'Investidores e Mentores', count: userStats.investidores },
                  { id: 'empresa', label: 'Empresas e Parceiros', count: userStats.empresas },
                  { id: 'single', label: 'Utilizador Específico', count: 1 },
                ].map(target => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => setRecipientTarget(target.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: recipientTarget === target.id ? '2px solid #ff6b00' : '1px solid #e2e8f0',
                      background: recipientTarget === target.id ? '#fffaf5' : '#f8fafc',
                      color: recipientTarget === target.id ? '#c2410c' : '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      gridColumn: target.id === 'single' ? 'span 2' : 'auto'
                    }}
                  >
                    <span>{target.label}</span>
                    <span style={{ background: recipientTarget === target.id ? '#ffedd5' : '#e2e8f0', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {target.id === 'single' ? (specificEmail ? specificEmail : 'Selecionar') : target.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* If Single User is selected, show dropdown and search */}
            {recipientTarget === 'single' && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                  Selecionar Utilizador Cadastrado ou Introduzir E-mail
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou e-mail..."
                    value={userSearchTerm}
                    onChange={e => setUserSearchTerm(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a'
                    }}
                  />
                  
                  <select
                    value={specificEmail}
                    onChange={e => setSpecificEmail(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      background: '#ffffff'
                    }}
                  >
                    <option value="">-- Escolha um utilizador da lista --</option>
                    {filteredUsers.map(u => (
                      <option key={u._id} value={u.email}>
                        {u.name} ({u.email}) - {u.role || 'membro'}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Ou digite diretamente o e-mail de destino:</span>
                  <input
                    type="email"
                    value={specificEmail}
                    onChange={e => setSpecificEmail(e.target.value)}
                    placeholder="destinatario@dominio.com"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Subject input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Assunto do E-mail
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Introduza o assunto do e-mail"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Code / Visual Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Corpo do E-mail (HTML)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (templates.length > 0) handleSelectTemplate(templates[0]);
                  }}
                  style={{ background: 'none', border: 'none', color: '#ff6b00', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Restaurar Modelo Base
                </button>
              </div>

              <textarea
                value={html}
                onChange={e => setHtml(e.target.value)}
                placeholder="Selecione um modelo acima ou introduza código HTML..."
                rows={12}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  color: '#0f172a',
                  lineHeight: 1.4,
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Test Email Bar */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                Enviar E-mail de Teste
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  placeholder="exemplo@dominio.com"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a'
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={sendingTest || !testEmail}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: (sendingTest || !testEmail) ? 'not-allowed' : 'pointer',
                    opacity: (sendingTest || !testEmail) ? 0.6 : 1,
                  }}
                >
                  {sendingTest ? 'A enviar...' : 'Enviar Teste'}
                </button>
              </div>
            </div>

            {/* Status Message */}
            {statusMsg.text && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: statusMsg.type === 'success' ? '#f0fdf4' : statusMsg.type === 'error' ? '#fef2f2' : '#eff6ff',
                color: statusMsg.type === 'success' ? '#166534' : statusMsg.type === 'error' ? '#991b1b' : '#1e40af',
                border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : statusMsg.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
              }}>
                {statusMsg.text}
              </div>
            )}

            {/* Final Broadcast Trigger Button */}
            <button
              type="button"
              onClick={handleOpenConfirm}
              disabled={sending}
              style={{
                background: '#ff6b00',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 24px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: sending ? 'not-allowed' : 'pointer',
                opacity: sending ? 0.7 : 1,
                marginTop: '0.5rem',
              }}
            >
              {sending 
                ? (recipientTarget === 'single' ? 'A enviar e-mail...' : `A enviar transmissão (${getTargetCount()} destinatários)...`)
                : (recipientTarget === 'single' ? `Enviar E-mail para ${specificEmail || 'Utilizador'}` : `Enviar E-mail para ${getTargetCount()} Destinatários`)}
            </button>

          </div>

        </div>

        {/* RIGHT: Live Visual Preview */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'sticky', top: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Pré-Visualização
            </h3>

            {/* Device switcher */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '6px', gap: '2px' }}>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                style={{
                  background: previewDevice === 'desktop' ? '#ffffff' : 'transparent',
                  color: previewDevice === 'desktop' ? '#0f172a' : '#64748b',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                style={{
                  background: previewDevice === 'mobile' ? '#ffffff' : 'transparent',
                  color: previewDevice === 'mobile' ? '#0f172a' : '#64748b',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Telemóvel
              </button>
            </div>
          </div>

          {/* Email Subject Header Simulation */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Assunto:</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
              {subject || '— Sem assunto —'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              De: ABN - AfroBiz Network &lt;noreply@abnafrobiznetwork.com&gt;
            </div>
            {recipientTarget === 'single' && specificEmail && (
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                Para: <strong>{specificEmail}</strong>
              </div>
            )}
          </div>

          {/* Device Frame Viewport */}
          <div style={{
            background: '#f1f5f9',
            padding: previewDevice === 'mobile' ? '16px 8px' : '8px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '480px',
            maxHeight: '650px',
            overflowY: 'auto'
          }}>
            <div style={{
              width: previewDevice === 'mobile' ? '360px' : '100%',
              background: '#ffffff',
              borderRadius: previewDevice === 'mobile' ? '16px' : '6px',
              border: '1px solid #cbd5e1',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {html ? (
                <iframe
                  srcDoc={html}
                  title="Email Preview"
                  style={{
                    width: '100%',
                    height: '540px',
                    border: 'none',
                    background: '#ffffff'
                  }}
                />
              ) : (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Selecione um modelo para visualizar a estrutura do e-mail.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Custom Confirmation Modal Dialog */}
      {showConfirmModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Confirmar Envio de Mensagem
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                Por favor, reveja os dados da transmissão antes de confirmar o disparo.
              </p>
            </div>

            {/* Summary Details Box */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Destinatário:</span>
                <strong style={{ color: '#0f172a', textAlign: 'right' }}>{getTargetLabel()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Total de Envios:</span>
                <strong style={{ color: '#ff6b00' }}>{getTargetCount()} destinatário{getTargetCount() > 1 ? 's' : ''}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Assunto:</span>
                <strong style={{ color: '#0f172a', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{subject}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Remetente:</span>
                <span style={{ color: '#475569', fontSize: '0.78rem' }}>noreply@abnafrobiznetwork.com</span>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              Esta ação enviará os e-mails instantaneamente através da infraestrutura segura do Resend.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteSend}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ff6b00',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 107, 0, 0.25)'
                }}
              >
                Confirmar e Enviar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
