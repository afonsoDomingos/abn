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
  negocio?: boolean;
  adesao?: boolean;
  interesses?: boolean;
  origem?: boolean;
  declaracao?: boolean;
  checkout?: boolean;
}

interface AdhesionLevel {
  id: string;
  label: string;
  subLabel: string;
  inscriptionFee: number;
  annualQuota: number;
  showPeriodicity: boolean;
  required: boolean;
}

interface Program {
  _id: string;
  title: string;
  description: string;
  duration: string;
  phase: string;
  status: string;
  image?: string;
  enabledSteps?: EnabledStepsConfig;
  customFields?: CustomField[];
  declaracao?: string;
  whatsappGroupUrl?: string;
  adhesionLevels?: AdhesionLevel[];
}

export default function ProgramInscricaoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);

  // Calculate active steps based on enabledSteps
  const getActiveSteps = (steps: EnabledStepsConfig, adhesionLevels: AdhesionLevel[], customFields: CustomField[]) => {
    const activeSteps: string[] = [];

    if (steps.identificacao) activeSteps.push('identificacao');
    if (steps.negocio) activeSteps.push('negocio');
    if (steps.adesao && adhesionLevels.length > 0) activeSteps.push('adesao');
    if (steps.interesses && customFields.length > 0) activeSteps.push('interesses');
    if (steps.origem) activeSteps.push('origem');
    if (steps.declaracao) activeSteps.push('declaracao');
    if (steps.checkout) activeSteps.push('checkout');

    return activeSteps;
  };

  const steps = program?.enabledSteps || {};
  const customFields = program?.customFields || [];
  const adhesionLevels = program?.adhesionLevels || [];
  const activeSteps = getActiveSteps(steps, adhesionLevels, customFields);
  const totalSteps = activeSteps.length;

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/programs`);
        if (!res.ok) {
          console.error('API response not OK:', res.status, res.statusText);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.programs) {
          const foundProgram = data.programs.find((p: Program) => {
            const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return titleSlug === slug || p._id === slug;
          });
          setProgram(foundProgram || null);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching program:', err);
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepName = activeSteps[currentStep];
    let isValid = true;

    if (currentStepName === 'identificacao') {
      if (!formData.nome || !formData.email || !formData.telefone) isValid = false;
    } else if (currentStepName === 'negocio') {
      if (!formData.nomeNegocio || !formData.setor || !formData.estagio) isValid = false;
    } else if (currentStepName === 'adesao') {
      if (!formData.nivelAdesao) isValid = false;
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
      negocio: 'Negócio / Ideia',
      adesao: 'Nível de Adesão',
      interesses: 'Informações Adicionais',
      origem: 'Como conheceu a ABN',
      declaracao: 'Declaração',
      checkout: 'Pagamento'
    };
    return titles[stepName] || stepName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;

    setSubmitting(true);
    setError('');

    try {
      const baseUrl = window.location.origin;

      // Prepare respostasPersonalizadas for custom fields
      const respostasPersonalizadas: Record<string, any> = {};
      customFields.forEach(field => {
        if (formData[field.id]) {
          respostasPersonalizadas[field.id] = formData[field.id];
        }
      });

      const res = await fetch(`${baseUrl}/api/programs/${program._id}/inscricao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          nomeNegocio: formData.nomeNegocio,
          setor: formData.setor,
          estagio: formData.estagio,
          nivelAdesao: formData.nivelAdesao,
          origem: formData.origem,
          metodoPagamento: formData.metodoPagamento,
          comprovativo: formData.comprovativo,
          declaracaoAceita: formData.declaracaoAceita,
          respostasPersonalizadas
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
            <p className={styles.loadingText}>Carregando programa...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>Programa não encontrado</h1>
            <p>O programa que procura não existe ou foi movido.</p>
            <button onClick={() => router.push('/programas')} className={styles.btn}>
              Voltar para Programas
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+258 84 577 3974';
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h1>Inscrição Submetida com Sucesso!</h1>
            <p>A sua candidatura ao programa "{program.title}" foi registada com sucesso.</p>
            <p>A equipa da ABN entrará em contacto brevemente.</p>

            {program.whatsappGroupUrl && (
              <a href={program.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className={styles.btn}>
                Entrar no Grupo WhatsApp
              </a>
            )}

            <div className={styles.whatsappNotice}>
              <p className={styles.whatsappNoticeTitle}>💬 Envie o comprovativo de pagamento:</p>
              <p className={styles.whatsappNoticeText}>
                Após efetuar o pagamento, envie o comprovativo para o admin via WhatsApp:
              </p>
              <a
                href={`https://wa.me/${adminWhatsApp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                {adminWhatsApp}
              </a>
            </div>

            <button onClick={() => router.push('/programas')} className={styles.btnSecondary}>
              Voltar para Programas
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
          <button onClick={() => router.push(`/programas/${slug}`)} className={styles.backBtn}>
            ← Voltar
          </button>
          <h1>Inscrição: {program.title}</h1>
          <p>Preencha o formulário abaixo para se inscrever neste programa.</p>
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
                    value={formData.nome || ''}
                    onChange={e => handleInputChange('nome', e.target.value)}
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

            {/* Etapa 2: Negócio/Ideia */}
            {activeSteps[currentStep] === 'negocio' && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label>Nome do Negócio / Startup *</label>
                  <input
                    type="text"
                    value={formData.nomeNegocio || ''}
                    onChange={e => handleInputChange('nomeNegocio', e.target.value)}
                    placeholder="Nome da sua empresa ou projeto"
                  />
                </div>
                <div className={styles.field}>
                  <label>Setor de Atuação *</label>
                  <input
                    type="text"
                    value={formData.setor || ''}
                    onChange={e => handleInputChange('setor', e.target.value)}
                    placeholder="Ex: Tecnologia, Agricultura, Educação..."
                  />
                </div>
                <div className={styles.field}>
                  <label>Estágio Atual *</label>
                  <select
                    value={formData.estagio || ''}
                    onChange={e => handleInputChange('estagio', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="ideia">Apenas Ideia</option>
                    <option value="validacao">Validação da Ideia</option>
                    <option value="produto">Produto/MVP Desenvolvido</option>
                    <option value="clientes">Primeiros Clientes</option>
                    <option value="operacao">Em Operação</option>
                    <option value="crescimento">Em Crescimento</option>
                  </select>
                </div>
              </div>
            )}

            {/* Etapa 3: Adesão/Planos */}
            {activeSteps[currentStep] === 'adesao' && adhesionLevels.length > 0 && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label>Selecione o Plano *</label>
                  <select
                    value={formData.nivelAdesao || ''}
                    onChange={e => handleInputChange('nivelAdesao', e.target.value)}
                  >
                    <option value="">Selecione um plano...</option>
                    {adhesionLevels.map(level => (
                      <option key={level.id} value={level.label}>
                        {level.label} - {level.subLabel} (Taxa: {level.inscriptionFee} MT)
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

            {/* Etapa 5: Origem */}
            {activeSteps[currentStep] === 'origem' && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label>Como conheceu a ABN?</label>
                  <select
                    value={formData.origem || ''}
                    onChange={e => handleInputChange('origem', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="redes_sociais">Redes Sociais</option>
                    <option value="site">Site da ABN</option>
                    <option value="indicacao">Indicação de alguém</option>
                    <option value="evento">Evento</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
            )}

            {/* Etapa 6: Declaração */}
            {activeSteps[currentStep] === 'declaracao' && (
              <div className={styles.section}>
                <div className={styles.declarationBox}>
                  <p>{program.declaracao || 'Declaro que as informações prestadas neste formulário são verdadeiras e completas.'}</p>
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
