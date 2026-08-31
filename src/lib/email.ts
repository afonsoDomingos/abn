import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ABN - AfroBiz Network <noreply@abnafrobiznetwork.com>';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  bcc?: string[];
  replyTo?: string;
}

/**
 * Envia um e-mail através da API do Resend.
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = DEFAULT_FROM_EMAIL,
  bcc,
  replyTo,
}: SendEmailParams) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY não configurada. E-mail simulado:', { to, subject });
    return { success: false, error: 'Chave do Resend não configurada' };
  }

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      bcc,
      replyTo,
    });

    if (data.error) {
      console.error('[Resend Error]', data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('[Resend Exception]', error);
    return { success: false, error: error.message || 'Falha ao enviar e-mail' };
  }
}

/**
 * Template base estilizado para os e-mails da ABN
 */
function emailLayout(content: string, title?: string) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #ff6b00;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px; font-weight: 800;">
            AFROBIZ <span style="color: #ff6b00;">NETWORK</span>
          </h1>
          ${title ? `<p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">${title}</p>` : ''}
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px; line-height: 1.6; font-size: 15px;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #475569;">ABN - AfroBiz Network</p>
          <p style="margin: 0 0 12px 0;">A acelerar e conectar o ecossistema empresarial africano e lusófono.</p>
          <p style="margin: 0; color: #94a3b8;">© ${new Date().getFullYear()} AfroBiz Network Lda. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Envio de e-mail para recuperação de palavra-passe
 */
export async function sendPasswordResetEmail(email: string, name: string, resetLink: string) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Recuperação de Palavra-passe</h2>
    <p>Olá, <strong>${name || 'Utilizador'}</strong>,</p>
    <p>Recebemos um pedido para redefinir a palavra-passe associada à sua conta na plataforma AfroBiz Network (ABN).</p>
    <p>Se fez este pedido, clique no botão abaixo para criar uma nova senha:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetLink}" style="background-color: #ff6b00; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);">
        Redefinir Palavra-passe
      </a>
    </div>

    <div style="background: #fff7ed; border-left: 4px solid #ff6b00; padding: 14px 18px; border-radius: 6px; font-size: 13px; color: #9a3412; margin-top: 24px;">
      <strong>⚠️ Importante:</strong> Este link é válido por <strong>1 hora</strong>. Se você não solicitou a alteração de senha, pode ignorar esta mensagem com segurança.
    </div>

    <p style="margin-top: 24px; font-size: 13px; color: #64748b; word-break: break-all;">
      Se o botão não funcionar, copie e cole o seguinte link no seu navegador:<br/>
      <a href="${resetLink}" style="color: #ff6b00;">${resetLink}</a>
    </p>
  `;

  return sendEmail({
    to: email,
    subject: 'Recuperação de Palavra-passe - AfroBiz Network',
    html: emailLayout(content, 'Segurança de Conta'),
  });
}

/**
 * Envio de e-mail de boas-vindas após registo
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`;
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Bem-vindo à AfroBiz Network! 🚀</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>A sua conta na <strong>AfroBiz Network (ABN)</strong> foi criada com sucesso!</p>
    <p>Agora tem acesso a uma rede completa de empreendedorismo, oportunidades de investimento, marketplace, clube de negócios e cursos de capacitação.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${loginUrl}" style="background-color: #ff6b00; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);">
        Aceder à Minha Conta
      </a>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #0f172a; font-size: 15px;">O que pode fazer a seguir:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px;">
        <li style="margin-bottom: 6px;">Completar o seu perfil profissional;</li>
        <li style="margin-bottom: 6px;">Explorar formações e masterclasses disponíveis;</li>
        <li style="margin-bottom: 6px;">Conectar-se a empreendedores e investidores.</li>
      </ul>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Bem-vindo à AfroBiz Network! 🚀',
    html: emailLayout(content, 'Conta Criada com Sucesso'),
  });
}

/**
 * Confirmação de inscrição / aprovação em formação
 */
export async function sendCourseApprovalEmail(email: string, name: string, courseName: string) {
  const courseUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/formacao`;
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Inscrição Confirmada! 🎓</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>Temos o prazer de informar que a sua inscrição no curso <strong>${courseName}</strong> foi aprovada e confirmada com sucesso!</p>
    
    <div style="background: #fdf2e9; border-left: 4px solid #ff6b00; padding: 16px; margin: 24px 0; border-radius: 6px; font-size: 14px; color: #7c2d12;">
      <strong>📚 Como aceder às suas aulas:</strong><br/>
      1. Aceda à sua área de membro na plataforma;<br/>
      2. Vá para a secção <strong>Formação</strong> → <strong>Minhas Formações</strong>;<br/>
      3. Clique em <strong>Assistir Aulas</strong> para iniciar a sua aprendizagem.
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${courseUrl}" style="background-color: #ff6b00; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block;">
        Iniciar Aulas Agora
      </a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Inscrição Aprovada: ${courseName} 🎓`,
    html: emailLayout(content, 'Formação e Capacitação'),
  });
}
