'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file';
  options: string[];
  required: boolean;
  placeholder?: string;
}

interface EnabledStepsConfig {
  identificacao?: boolean;
  profissional?: boolean;
  bilhete?: boolean;
  interesses?: boolean;
  necessidades?: boolean;
  declaracao?: boolean;
  checkout?: boolean;
}

function isFreeEvent(event: Event): boolean {
  const price = event.price?.toLowerCase() || '';
  return price === '' || price === '0' || price === '0 mt' || price === 'gratuito' || price === 'grátis';
}

interface Ticket {
  type: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  benefits: string[];
  available: number;
  includes: string[];
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imageUrl?: string;
  enabledSteps?: EnabledStepsConfig;
  customFields?: CustomField[];
  declaracao?: string;
  whatsappGroupUrl?: string;
  tickets?: Ticket[];
  price?: string;
}

export default function EventInscricaoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);

  // Calculate active steps based on enabledSteps
  const getActiveSteps = (steps: EnabledStepsConfig, tickets: Ticket[], customFields: CustomField[], isFree: boolean) => {
    const activeSteps: string[] = [];

    if (steps.identificacao) activeSteps.push('identificacao');
    if (steps.profissional) activeSteps.push('profissional');
    if (steps.bilhete && tickets.length > 0) activeSteps.push('bilhete');
    if (steps.interesses && customFields.length > 0) activeSteps.push('interesses');
    if (steps.necessidades) activeSteps.push('necessidades');
    if (steps.declaracao) activeSteps.push('declaracao');
    // Se for gratuito e checkout estiver ativado, substituir por parceria
    if (steps.checkout) {
      if (isFree) {
        activeSteps.push('parceria');
      } else {
        activeSteps.push('checkout');
      }
    }

    return activeSteps;
  };

  const steps = event?.enabledSteps || {};
  const customFields = event?.customFields || [];
  const tickets = event?.tickets || [];
  const isFree = event ? isFreeEvent(event) : false;
  const activeSteps = getActiveSteps(steps, tickets, customFields, isFree);
  const totalSteps = activeSteps.length;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/events`);
        if (!res.ok) {
          console.error('API response not OK:', res.status, res.statusText);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.events) {
          const foundEvent = data.events.find((e: Event) => e._id === id);
          setEvent(foundEvent || null);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepName = activeSteps[currentStep];
    let isValid = true;

    if (currentStepName === 'identificacao') {
      if (!formData.nomeCompleto || !formData.email || !formData.telefone) isValid = false;
    } else if (currentStepName === 'profissional') {
      if (!formData.empresa || !formData.cargo || !formData.sector) isValid = false;
    } else if (currentStepName === 'bilhete') {
      if (!formData.bilheteSelecionado) isValid = false;
    } else if (currentStepName === 'interesses') {
      if (!formData.motivoParticipacao) isValid = false;
    } else if (currentStepName === 'declaracao') {
      if (!formData.declaracaoAceita) isValid = false;
    }

    if (!isValid) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setError('');
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = (stepName: string) => {
    const titles: Record<string, string> = {
      identificacao: 'Identificação',
      profissional: 'Informações Profissionais',
      bilhete: 'Seleção de Bilhete',
      interesses: 'Informações Adicionais',
      necessidades: 'Necessidades Especiais',
      declaracao: 'Declaração',
      checkout: 'Pagamento',
      parceria: 'Parceria / Patrocínio'
    };
    return titles[stepName] || stepName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setSubmitting(true);
    setError('');

    // Validate all required fields
    if (!formData.nomeCompleto || !formData.email || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSubmitting(false);
      return;
    }

    // Validate declaration if enabled
    if (steps.declaracao && !formData.declaracaoAceita) {
      setError('Por favor, aceite a declaração para continuar.');
      setSubmitting(false);
      return;
    }

    try {
      const baseUrl = window.location.origin;

      // Prepare respostasPersonalizadas for custom fields
      const respostasPersonalizadas: Record<string, any> = {};
      customFields.forEach(field => {
        if (formData[field.id]) {
          respostasPersonalizadas[field.id] = formData[field.id];
        }
      });

      const res = await fetch(`${baseUrl}/api/events/inscricoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          eventTitle: event.title,
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          telefone: formData.telefone,
          empresa: formData.empresa,
          cargo: formData.cargo,
          sector: formData.sector,
          motivoParticipacao: formData.motivoParticipacao,
          necessidadesEspeciais: formData.necessidadesEspeciais,
          bilheteSelecionado: formData.bilheteSelecionado,
          respostasPersonalizadas,
          declaracaoAceita: formData.declaracaoAceita,
          metodoPagamento: formData.metodoPagamento,
          comprovativo: formData.comprovativo,
          tipoParceria: formData.tipoParceria,
          descricaoParceria: formData.descricaoParceria,
          valorContribuicao: formData.valorContribuicao,
          isFree,
          origem: 'eventos'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Erro ao submeter inscrição. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão. Por favor, verifique a sua rede.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Carregando evento...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>Evento não encontrado</h1>
            <p>O evento que procura não existe ou foi movido.</p>
            <button onClick={() => router.push('/eventos')} className={styles.btn}>
              Voltar para Eventos
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+258 84 577 3974';
    const isFree = event ? isFreeEvent(event) : false;
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h1>Inscrição Enviada!</h1>
            <p>{event.title}</p>
            <p>Entraremos em contacto em breve</p>

            {event.whatsappGroupUrl && (
              <a href={event.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className={styles.btn}>
                Entrar no Grupo WhatsApp
              </a>
            )}

            {!isFree && (
              <div className={styles.whatsappNotice}>
                <p className={styles.whatsappNoticeTitle}>💬 Envie o comprovativo</p>
                <a
                  href={`https://wa.me/${adminWhatsApp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  {adminWhatsApp}
                </a>
              </div>
            )}

            <button onClick={() => router.push('/eventos')} className={styles.btnSecondary}>
              Voltar para Eventos
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => router.push('/eventos')} className={styles.backBtn}>
            ← Voltar
          </button>
          <h1>Inscrição: {event.title}</h1>
          <p>Preencha o formulário abaixo para se inscrever neste evento.</p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          {activeSteps.map((_, index) => (
            <div
              key={index}
              className={`${styles.progressStep} ${index <= currentStep ? styles.activeStep : ''}`}
              style={{ width: `${100 / totalSteps}%` }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step Indicator */}
          <div className={styles.stepIndicator}>
            <span className={styles.stepNumber}>Etapa {currentStep + 1} de {totalSteps}</span>
            <span className={styles.stepTitle}>{getStepTitle(activeSteps[currentStep])}</span>
          </div>

          {/* Step Content */}
          <div className={styles.stepContent}>
            {/* Etapa 1: Identificação */}
            {activeSteps[currentStep] === 'identificacao' && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    value={formData.nomeCompleto || ''}
                    onChange={e => handleInputChange('nomeCompleto', e.target.value)}
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div className={styles.field}>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className={styles.field}>
                  <label>WhatsApp/Telefone *</label>
                  <input
                    type="tel"
                    value={formData.telefone || ''}
                    onChange={e => handleInputChange('telefone', e.target.value)}
                    placeholder="+258 84 000 0000"
                  />
                </div>
              </div>
            )}

            {/* Etapa 2: Profissional */}
            {activeSteps[currentStep] === 'profissional' && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label>Empresa *</label>
                  <input
                    type="text"
                    value={formData.empresa || ''}
                    onChange={e => handleInputChange('empresa', e.target.value)}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div className={styles.field}>
                  <label>Cargo *</label>
                  <input
                    type="text"
                    value={formData.cargo || ''}
                    onChange={e => handleInputChange('cargo', e.target.value)}
                    placeholder="Seu cargo atual"
                  />
                </div>
                <div className={styles.field}>
                  <label>Setor *</label>
                  <input
                    type="text"
                    value={formData.sector || ''}
                    onChange={e => handleInputChange('sector', e.target.value)}
                    placeholder="Ex: Tecnologia, Agricultura, Educação..."
                  />
                </div>
              </div>
            )}

            {/* Etapa 3: Bilhete */}
            {activeSteps[currentStep] === 'bilhete' && tickets.length > 0 && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label>Selecione o Bilhete *</label>
                  <select
                    value={formData.bilheteSelecionado || ''}
                    onChange={e => handleInputChange('bilheteSelecionado', e.target.value)}
                  >
                    <option value="">Selecione um bilhete...</option>
                    {tickets.map(ticket => (
                      <option key={ticket.name} value={ticket.name}>
                        {ticket.name} - {ticket.price} {ticket.currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Etapa 4: Interesses & Campos Customizados */}
            {activeSteps[currentStep] === 'interesses' && customFields.length > 0 && (
              <div className={styles.section}>
                {customFields.map(field => (
                  <div key={field.id} className={styles.field}>
                    <label>
                      {field.label}
                      {field.required && ' *'}
                    </label>
                    {field.type === 'text' && (
                      <input
                        type="text"
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder || ''}
                      />
                    )}
                    {field.type === 'textarea' && (
                      <textarea
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder || ''}
                        rows={4}
                      />
                    )}
                    {field.type === 'select' && (
                      <select
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {field.type === 'checkbox' && (
                      <div className={styles.checkboxGroup}>
                        {field.options.map((opt, i) => (
                          <label key={i} className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={(formData[field.id] || []).includes(opt)}
                              onChange={e => {
                                const current = formData[field.id] || [];
                                if (e.target.checked) {
                                  handleInputChange(field.id, [...current, opt]);
                                } else {
                                  handleInputChange(field.id, current.filter((v: string) => v !== opt));
                                }
                              }}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}
                    {field.type === 'file' && (
                      <input
                        type="file"
                        required={field.required}
                        onChange={e => handleInputChange(field.id, e.target.files?.[0])}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Etapa 5: Necessidades Especiais */}
            {activeSteps[currentStep] === 'necessidades' && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label>Motivo de Participação</label>
                  <textarea
                    value={formData.motivoParticipacao || ''}
                    onChange={e => handleInputChange('motivoParticipacao', e.target.value)}
                    placeholder="Por que deseja participar deste evento?"
                    rows={4}
                  />
                </div>
                <div className={styles.field}>
                  <label>Necessidades Especiais</label>
                  <textarea
                    value={formData.necessidadesEspeciais || ''}
                    onChange={e => handleInputChange('necessidadesEspeciais', e.target.value)}
                    placeholder="Possui alguma necessidade especial ou requisito de acessibilidade?"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Etapa 6: Declaração */}
            {activeSteps[currentStep] === 'declaracao' && (
              <div className={styles.section}>
                <div className={styles.declarationBox}>
                  <p>{event.declaracao || 'Declaro que as informações prestadas neste formulário são verdadeiras e completas.'}</p>
                </div>
                <div className={styles.field}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.declaracaoAceita || false}
                      onChange={e => handleInputChange('declaracaoAceita', e.target.checked)}
                    />
                    Concordo com a declaração acima *
                  </label>
                </div>
              </div>
            )}

            {/* Etapa 7: Checkout/Pagamento */}
            {activeSteps[currentStep] === 'checkout' && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label>Método de Pagamento</label>
                  <select
                    value={formData.metodoPagamento || ''}
                    onChange={e => handleInputChange('metodoPagamento', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="m-pesa">M-Pesa</option>
                    <option value="emola">eMola</option>
                    <option value="transferencia">Transferência Bancária</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Comprovativo de Pagamento</label>
                  <input
                    type="file"
                    onChange={e => handleInputChange('comprovativo', e.target.files?.[0])}
                  />
                </div>
              </div>
            )}

            {/* Etapa 7: Parceria/Patrocínio (para eventos gratuitos) */}
            {activeSteps[currentStep] === 'parceria' && (
              <div className={styles.section}>
                <div className={styles.parceriaInfo}>
                  <p className={styles.parceriaText}>
                    Este evento é gratuito! Você pode se inscrever diretamente ou contribuir como parceiro/patrocinador para apoiar a realização de mais eventos.
                  </p>
                </div>
                <div className={styles.field}>
                  <label>Tipo de Parceria</label>
                  <select
                    value={formData.tipoParceria || ''}
                    onChange={e => handleInputChange('tipoParceria', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="inscricao">Apenas Inscrição (sem parceria)</option>
                    <option value="parceiro">Parceiro Institucional</option>
                    <option value="patrocinador">Patrocinador</option>
                    <option value="apoiador">Apoiador</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                {formData.tipoParceria && formData.tipoParceria !== 'inscricao' && (
                  <>
                    <div className={styles.field}>
                      <label>Descrição da Parceria</label>
                      <textarea
                        value={formData.descricaoParceria || ''}
                        onChange={e => handleInputChange('descricaoParceria', e.target.value)}
                        placeholder="Descreva como gostaria de contribuir..."
                        rows={4}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Valor de Contribuição (opcional)</label>
                      <input
                        type="text"
                        value={formData.valorContribuicao || ''}
                        onChange={e => handleInputChange('valorContribuicao', e.target.value)}
                        placeholder="Ex: 50.000 MT"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className={styles.actions}>
            {currentStep > 0 && (
              <button type="button" onClick={handlePrevious} className={styles.btnSecondary}>
                ← Anterior
              </button>
            )}
            {currentStep < totalSteps - 1 ? (
              <button type="button" onClick={handleNext} className={styles.btn}>
                Próximo →
              </button>
            ) : (
              <button type="submit" className={styles.btn} disabled={submitting}>
                {submitting ? 'Submetendo...' : 'Submeter Inscrição'}
              </button>
            )}
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
