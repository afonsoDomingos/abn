import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const DEFAULT_FROM_EMAIL = (() => {
  const envEmail = process.env.RESEND_FROM_EMAIL;
  if (envEmail && !envEmail.includes('resend.dev')) {
    return envEmail;
  }
  return 'ABN - AfroBiz Network <noreply@abnafrobiznetwork.com>';
})();

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
 * Template base estilizado para todos os e-mails da ABN
 */
function emailLayout(content: string, subtitle?: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 40px 20px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        
        <!-- Header with Logo and Brand -->
        <div style="background-color: #0f172a; padding: 32px 24px; text-align: center; border-bottom: 4px solid #ff6b00;">
          <img src="https://abnafrobiznetwork.com/abn-symbol.png" alt="ABN Logo" width="56" style="display: block; margin: 0 auto 12px auto; height: auto;" />
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; letter-spacing: 1.5px; font-weight: 800;">
            ABN <span style="color: #ff6b00;">AFROBIZ NETWORK</span>
          </h1>
          <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
            ${subtitle || 'Plataforma de Aceleração e Negócios'}
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px; line-height: 1.65; font-size: 15px; color: #334155;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 6px 0; font-weight: 700; color: #475569; font-size: 12px;">ABN - AfroBiz Network</p>
          <p style="margin: 0 0 10px 0; color: #64748b;">A acelerar e conectar o ecossistema empresarial africano e lusófono.</p>
          <p style="margin: 0; color: #94a3b8; font-size: 11px;">
            Mensagem enviada para a sua conta registada na AfroBiz Network.<br/>
            © ${new Date().getFullYear()} AfroBiz Network Lda. Todos os direitos reservados.
          </p>
          
          <!-- Discreet Partner Credit -->
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #e2e8f0; text-align: center;">
            <a href="https://wehosthere.com" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block; opacity: 0.65;">
              <span style="font-size: 9px; color: #94a3b8; letter-spacing: 0.5px; vertical-align: middle; margin-right: 6px;">Powered by</span>
              <img src="https://abnafrobiznetwork.com/wehosthere.png" alt="WeHosThere" width="42" style="vertical-align: middle; display: inline-block; border: 0;" />
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 1. Recuperação de Palavra-passe
 */
export async function sendPasswordResetEmail(email: string, name: string, resetLink: string) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Recuperação de Palavra-passe</h2>
    <p>Olá, <strong>${name || 'Utilizador'}</strong>,</p>
    <p>Recebemos um pedido para redefinir a palavra-passe associada à sua conta na plataforma AfroBiz Network.</p>
    <p>Se efetuou este pedido, clique no botão abaixo para definir uma nova palavra-passe:</p>
    
    <div style="text-align: center; margin: 30px 0 16px 0;">
      <a href="${resetLink}" style="background-color: #ff6b00; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
        Redefinir Palavra-passe
      </a>
    </div>

    <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 14px 16px; border-radius: 6px; font-size: 13px; color: #475569; margin-top: 24px;">
      <strong>Nota de Segurança:</strong> Este link é válido por <strong>1 hora</strong>. Se não solicitou a alteração de palavra-passe, pode ignorar esta mensagem com segurança.
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Recuperação de Palavra-passe - AfroBiz Network',
    html: emailLayout(content, 'Segurança de Conta'),
  });
}

/**
 * 2. Boas-vindas após registo
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://abnafrobiznetwork.com'}/login`;
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Bem-vindo à AfroBiz Network</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>A sua conta na <strong>AfroBiz Network (ABN)</strong> foi criada com sucesso.</p>
    <p>Agora tem acesso a uma rede completa de empreendedorismo, aceleração empresarial, catálogo de oportunidades, clube de negócios e cursos práticos.</p>

    <div style="text-align: center; margin: 30px 0 16px 0;">
      <a href="${loginUrl}" style="background-color: #ff6b00; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
        Aceder à Minha Conta
      </a>
    </div>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <strong style="color: #0f172a; font-size: 14px;">Próximos passos recomendados:</strong>
      <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569; font-size: 14px;">
        <li style="margin-bottom: 6px;">Completar o seu perfil e adicionar foto;</li>
        <li style="margin-bottom: 6px;">Explorar cursos e programas disponíveis;</li>
        <li>Conectar-se à rede de empreendedores e parceiros.</li>
      </ul>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Bem-vindo à AfroBiz Network',
    html: emailLayout(content, 'Conta Criada com Sucesso'),
  });
}

/**
 * 3. Confirmação de Inscrição em Curso (Aprovada / Desbloqueada)
 */
export async function sendCourseApprovalEmail(email: string, name: string, courseName: string) {
  const courseUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://abnafrobiznetwork.com'}/dashboard/formacao`;
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Inscrição Confirmada</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>Informamos que a sua inscrição na formação <strong>${courseName}</strong> foi confirmada com sucesso.</p>
    <p>O acesso a todo o conteúdo programático e aulas em vídeo já se encontra totalmente disponível na sua área de membro.</p>

    <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 16px; margin: 22px 0; border-radius: 6px; font-size: 14px; color: #334155;">
      <strong style="color: #0f172a;">Instruções de Acesso:</strong><br/>
      1. Aceda à plataforma com o seu login;<br/>
      2. No menu principal, vá a <strong>Formação</strong> → <strong>Minhas Formações</strong>;<br/>
      3. Clique em <strong>Assistir Aulas</strong> para iniciar a sua capacitação.
    </div>

    <div style="text-align: center; margin: 30px 0 16px 0;">
      <a href="${courseUrl}" style="background-color: #ff6b00; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
        Iniciar Aulas Agora
      </a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Inscrição Confirmada: ${courseName}`,
    html: emailLayout(content, 'Formação e Capacitação'),
  });
}

/**
 * 4. Receção de Inscrição em Curso (Pendente de Validação de Comprovativo)
 */
export async function sendCourseEnrollmentPendingEmail(email: string, name: string, courseName: string, price: string) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://abnafrobiznetwork.com'}/dashboard/formacao`;
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Inscrição Recebida</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>Recebemos o seu pedido de inscrição na formação <strong>${courseName}</strong>.</p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px;">
      <table width="100%" border="0" cellpadding="4" cellspacing="0" style="color: #334155;">
        <tr>
          <td width="30%" style="font-weight: 700; color: #475569;">Curso:</td>
          <td>${courseName}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #475569;">Valor:</td>
          <td>${price}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #475569;">Estado:</td>
          <td><strong style="color: #d97706;">A aguardar validação administrativa</strong></td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px; color: #64748b;">
      A nossa equipa está a verificar o comprovativo enviado. Assim que o pagamento for validado, receberá um e-mail de confirmação e as aulas serão desbloqueadas na sua conta.
    </p>

    <div style="text-align: center; margin: 28px 0 16px 0;">
      <a href="${dashboardUrl}" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
        Ver Painel de Formações
      </a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Receção de Inscrição: ${courseName}`,
    html: emailLayout(content, 'Inscrição em Formação'),
  });
}

/**
 * 5. Candidatura a Programa de Incubação / Aceleração Recebida
 */
export async function sendProgramApplicationReceivedEmail(email: string, name: string, programTitle: string) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Candidatura Recebida</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>Confirmamos a receção da sua candidatura ao programa <strong>${programTitle}</strong> da AfroBiz Network.</p>

    <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 16px; margin: 22px 0; border-radius: 6px; font-size: 14px; color: #334155;">
      <strong style="color: #0f172a;">Processo de Avaliação:</strong><br/>
      A equipa técnica e de mentoria da ABN irá analisar as informações submetidas. Caso a sua proposta seja pré-selecionada, entraremos em contacto para os próximos passos do processo de seleção.
    </div>

    <p style="font-size: 14px; color: #64748b;">
      Agradecemos o seu interesse em acelerar o seu negócio connosco.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: `Candidatura Recebida: ${programTitle}`,
    html: emailLayout(content, 'Programas e Incubação'),
  });
}

/**
 * 6. Inscrição no Clube de Negócios / Clube de Empreendedores Recebida
 */
export async function sendClubMembershipReceivedEmail(email: string, name: string, membershipLevel: string) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Inscrição no Clube de Negócios</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>A sua manifestação de interesse para adesão ao <strong>Clube de Negócios AfroBiz Network</strong> (${membershipLevel}) foi registada com sucesso.</p>

    <div style="background-color: #f8fafc; border-left: 4px solid #0f172a; padding: 16px; margin: 22px 0; border-radius: 6px; font-size: 14px; color: #334155;">
      <strong style="color: #0f172a;">Próximos Passos:</strong><br/>
      A coordenação do Clube irá analisar o seu registo para validação e encaminhar as informações de admissão e cronograma de encontros de networking.
    </div>

    <p style="font-size: 14px; color: #64748b;">
      Estamos entusiasmados em contar consigo na nossa rede de cooperação empresarial.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: 'Inscrição no Clube de Negócios ABN',
    html: emailLayout(content, 'Clube de Negócios ABN'),
  });
}

/**
 * 7. Inscrição em Evento / Sessão Online Confirmada
 */
export async function sendEventRegistrationEmail(email: string, name: string, eventTitle: string) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Inscrição em Evento Confirmada</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>A sua inscrição no evento <strong>${eventTitle}</strong> foi registada com sucesso.</p>

    <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 16px; margin: 22px 0; border-radius: 6px; font-size: 14px; color: #334155;">
      <strong style="color: #0f172a;">Informação Importante:</strong><br/>
      Recomendamos que mantenha o seu e-mail e contacto atentos. Antes da realização do evento, enviaremos os detalhes de acesso e ligação de transmissão.
    </div>

    <p style="font-size: 14px; color: #64748b;">
      Contamos com a sua presença.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: `Inscrição Confirmada: ${eventTitle}`,
    html: emailLayout(content, 'Eventos e Sessões ABN'),
  });
}
