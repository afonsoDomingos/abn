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
        <div style="background-color: #f8fafc; padding: 14px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 3px 0; font-weight: 700; color: #475569; font-size: 12px;">ABN - AfroBiz Network</p>
          <p style="margin: 0 0 3px 0; color: #94a3b8; font-size: 11px;">© ${new Date().getFullYear()} AfroBiz Network Lda. Todos os direitos reservados.</p>
          
          <!-- Partner Credit -->
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e2e8f0; text-align: center;">
            <a href="https://www.wehosthere.com/" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px; opacity: 0.7;">
              <span style="font-size: 9px; color: #94a3b8; letter-spacing: 0.5px;">Hosted by</span>
              <img src="https://abnafrobiznetwork.com/wehosthere.png" alt="WeHosThere" width="38" style="display: inline-block; border: 0; vertical-align: middle;" />
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

/**
 * 8. Confirmação de Pedido na Loja ABN
 */
export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderId: string,
  productName: string,
  total: number,
  paymentMethod: string
) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Pedido Confirmado - Loja ABN</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>O seu pedido foi processado com sucesso na Loja ABN.</p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px;">
      <table width="100%" border="0" cellpadding="4" cellspacing="0" style="color: #334155;">
        <tr>
          <td width="30%" style="font-weight: 700; color: #475569;">Pedido #:</td>
          <td>${orderId.toString().slice(-8)}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #475569;">Produto:</td>
          <td>${productName}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #475569;">Total:</td>
          <td style="color: #ff6b00; font-weight: 700;">Mt ${total.toLocaleString()} MZN</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #475569;">Pagamento:</td>
          <td>${paymentMethod.toUpperCase()}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin: 22px 0; border-radius: 6px; font-size: 14px; color: #065f46;">
      <strong style="color: #064e3b;">Pagamento Confirmado!</strong><br/>
      O seu pagamento foi processado com sucesso. Se for um produto digital, receberá o link de download em breve.
    </div>

    <p style="font-size: 14px; color: #64748b;">
      Agradecemos pela sua preferência!
    </p>
  `;

  return sendEmail({
    to: email,
    subject: `Pedido Confirmado - Loja ABN`,
    html: emailLayout(content, 'Loja ABN'),
  });
}

/**
 * 9. Link de Download para Produto Digital
 */
export async function sendDigitalProductDownloadEmail(
  email: string,
  name: string,
  productName: string,
  downloadUrl: string,
  orderId: string
) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Download Disponível - Loja ABN</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>O seu pagamento foi confirmado e o download do produto <strong>${productName}</strong> já está disponível.</p>

    <div style="background-color: #f8fafc; border-left: 4px solid #ff6b00; padding: 16px; margin: 22px 0; border-radius: 6px; font-size: 14px; color: #334155;">
      <strong style="color: #0f172a;">Instruções:</strong><br/>
      1. Clique no botão abaixo para fazer o download;<br/>
      2. Guarde o ficheiro no seu dispositivo;<br/>
      3. O link é válido por tempo limitado.
    </div>

    <div style="text-align: center; margin: 30px 0 16px 0;">
      <a href="${downloadUrl}" style="background-color: #ff6b00; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
        📥 Download do Produto
      </a>
    </div>

    <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 13px; color: #92400e;">
      <strong>Nota:</strong> Se tiver alguma dificuldade com o download, entre em contacto connosco.
    </div>

    <p style="font-size: 14px; color: #64748b;">
      Pedido #${orderId.toString().slice(-8)}
    </p>
  `;

  return sendEmail({
    to: email,
    subject: `Download Disponível: ${productName}`,
    html: emailLayout(content, 'Loja ABN'),
  });
}

/**
 * 10. Notificação de Pagamento Falhado
 */
export async function sendPaymentFailedEmail(
  email: string,
  name: string,
  productName: string,
  orderId: string,
  total: number
) {
  const checkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://abnafrobiznetwork.com'}/loja/checkout?orderId=${orderId}`;
  const content = `
    <h2 style="color: #dc2626; margin-top: 0; font-size: 20px;">Pagamento Falhado - Loja ABN</h2>
    <p>Olá, <strong>${name}</strong>,</p>
    <p>Infelizmente, o pagamento do seu pedido foi recusado ou expirou.</p>

    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px;">
      <table width="100%" border="0" cellpadding="4" cellspacing="0" style="color: #991b1b;">
        <tr>
          <td width="30%" style="font-weight: 700; color: #7f1d1d;">Pedido #:</td>
          <td>${orderId.toString().slice(-8)}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #7f1d1d;">Produto:</td>
          <td>${productName}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #7f1d1d;">Valor:</td>
          <td>Mt ${total.toLocaleString()} MZN</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 22px 0; border-radius: 6px; font-size: 14px; color: #991b1b;">
      <strong style="color: #7f1d1d;">O que pode ter acontecido:</strong><br/>
      • Saldo insuficiente;<br/>
      • Tempo limite do pagamento expirado;<br/>
      • Pagamento cancelado pelo utilizador.
    </div>

    <p style="font-size: 14px; color: #64748b;">
      Se ainda deseja adquirir este produto, pode tentar novamente:
    </p>

    <div style="text-align: center; margin: 30px 0 16px 0;">
      <a href="${checkoutUrl}" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
        Tentar Pagamento Novamente
      </a>
    </div>

    <p style="font-size: 14px; color: #64748b;">
      Se precisar de ajuda, entre em contacto connosco.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: `Pagamento Falhado - Loja ABN`,
    html: emailLayout(content, 'Loja ABN'),
  });
}
