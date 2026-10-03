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
            <button onClick={() => router.push('/programas')} className={styles.btnSecondary}>
              Voltar para Programas
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = program.enabledSteps || {};
  const customFields = program.customFields || [];
  const adhesionLevels = program.adhesionLevels || [];

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

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Etapa 1: Identificação */}
          {steps.identificacao && (
            <div className={styles.section}>
              <h2>1. Identificação</h2>
              <div className={styles.field}>
                <label>Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nome || ''}
                  onChange={e => handleInputChange('nome', e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div className={styles.field}>
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <div className={styles.field}>
                <label>WhatsApp/Telefone *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefone || ''}
                  onChange={e => handleInputChange('telefone', e.target.value)}
                  placeholder="+258 84 000 0000"
                />
              </div>
            </div>
          )}

          {/* Etapa 2: Negócio/Ideia */}
          {steps.negocio && (
            <div className={styles.section}>
              <h2>2. Negócio / Ideia</h2>
              <div className={styles.field}>
                <label>Nome do Negócio / Startup *</label>
                <input
                  type="text"
                  required
                  value={formData.nomeNegocio || ''}
                  onChange={e => handleInputChange('nomeNegocio', e.target.value)}
                  placeholder="Nome da sua empresa ou projeto"
                />
              </div>
              <div className={styles.field}>
                <label>Setor de Atuação *</label>
                <input
                  type="text"
                  required
                  value={formData.setor || ''}
                  onChange={e => handleInputChange('setor', e.target.value)}
                  placeholder="Ex: Tecnologia, Agricultura, Educação..."
                />
              </div>
              <div className={styles.field}>
                <label>Estágio Atual *</label>
                <select
                  required
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
          {steps.adesao && adhesionLevels.length > 0 && (
            <div className={styles.section}>
              <h2>3. Nível de Adesão</h2>
              <div className={styles.field}>
                <label>Selecione o Plano *</label>
                <select
                  required
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
          {steps.interesses && customFields.length > 0 && (
            <div className={styles.section}>
              <h2>4. Informações Adicionais</h2>
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
          {steps.origem && (
            <div className={styles.section}>
              <h2>5. Como conheceu a ABN?</h2>
              <div className={styles.field}>
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
          {steps.declaracao && (
            <div className={styles.section}>
              <h2>6. Declaração</h2>
              <div className={styles.declarationBox}>
                <p>{program.declaracao || 'Declaro que as informações prestadas neste formulário são verdadeiras e completas.'}</p>
              </div>
              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    required
                    checked={formData.declaracaoAceita || false}
                    onChange={e => handleInputChange('declaracaoAceita', e.target.checked)}
                  />
                  Concordo com a declaração acima *
                </label>
              </div>
            </div>
          )}

          {/* Etapa 7: Checkout/Pagamento */}
          {steps.checkout && (
            <div className={styles.section}>
              <h2>7. Pagamento</h2>
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

          <div className={styles.actions}>
            <button type="submit" className={styles.btn} disabled={submitting}>
              {submitting ? 'Submetendo...' : 'Submeter Inscrição'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
