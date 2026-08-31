'use client';

import { useEffect, useState } from 'react';
import { getClubStepTitle } from '@/lib/clubUtils';
import styles from './Programas.module.css';

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file';
  options: string[];
  required: boolean;
  placeholder?: string;
}

export interface EnabledStepsConfig {
  identificacao?: boolean;
  negocio?: boolean;
  adesao?: boolean;
  interesses?: boolean;
  origem?: boolean;
  declaracao?: boolean;
  checkout?: boolean;
}

interface Program {
  _id: string;
  title: string;
  description: string;
  publicoAlvo?: string;
  beneficios?: string;
  requisitos?: string;
  investimento?: string;
  price?: string;
  paymentInstructions?: string;
  processoSelecao?: string;
  criteriosSelecao?: string;
  phase?: string;
  duration?: string;
  image?: string;
  status: string;
  order: number;
  createdAt: string;
  // Club specific fields
  missao?: string;
  visao?: string;
  valores?: string;
  objectivos?: string;
  areasActuacao?: string;
  actividades?: string;
  beneficiosMembros?: string;
  compromissoMembros?: string;
  lema?: string;
  isClub?: boolean;
  province?: string;
  declaracao?: string;
  enabledSteps?: EnabledStepsConfig;
  customFields?: CustomField[];
  adhesionLevels?: AdhesionLevel[];
}

export interface AdhesionLevel {
  id: string;
  label: string;
  subLabel: string;
  inscriptionFee: number;
  annualQuota: number;
  showPeriodicity: boolean;
  required: boolean;
}

export default function AdminProgramasPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'geral' | 'conteudo' | 'selecao' | 'clube' | 'inquerito' | 'adesao'>('geral');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [adhesionLevels, setAdhesionLevels] = useState<AdhesionLevel[]>([]);

  // Enabled steps configuration
  const [enabledSteps, setEnabledSteps] = useState<Required<EnabledStepsConfig>>({
    identificacao: true,
    negocio: true,
    adesao: true,
    interesses: true,
    origem: true,
    declaracao: true,
    checkout: true,
  });

  // Form states
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState('ativo');
  const [description, setDescription] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [beneficios, setBeneficios] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [investimento, setInvestimento] = useState('');
  const [price, setPrice] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [processoSelecao, setProcessoSelecao] = useState('');
  const [criteriosSelecao, setCriteriosSelecao] = useState('');
  // Club specific states
  const [isClub, setIsClub] = useState(false);
  const [province, setProvince] = useState('');
  const [missao, setMissao] = useState('');
  const [visao, setVisao] = useState('');
  const [valores, setValores] = useState('');
  const [objectivos, setObjectivos] = useState('');
  const [areasActuacao, setAreasActuacao] = useState('');
  const [actividades, setActividades] = useState('');
  const [beneficiosMembros, setBeneficiosMembros] = useState('');
  const [compromissoMembros, setCompromissoMembros] = useState('');
  const [lema, setLema] = useState('');
  const [declaracao, setDeclaracao] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = () => {
    setLoading(true);
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.programs) setPrograms(data.programs);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditClick = (prog: Program) => {
    setEditingId(prog._id);
    setTitle(prog.title || '');
    setPhase(prog.phase || '');
    setDuration(prog.duration || '');
    setImage(prog.image || '');
    setOrder(prog.order || 0);
    setStatus(prog.status || 'ativo');
    setDescription(prog.description || '');
    setPublicoAlvo(prog.publicoAlvo || '');
    setBeneficios(prog.beneficios || '');
    setRequisitos(prog.requisitos || '');
    setInvestimento(prog.investimento || '');
    setPrice(prog.price || '');
    setPaymentInstructions(prog.paymentInstructions || '');
    setProcessoSelecao(prog.processoSelecao || '');
    setCriteriosSelecao(prog.criteriosSelecao || '');
    setIsClub(prog.isClub || false);
    setProvince(prog.province || '');
    setMissao(prog.missao || '');
    setVisao(prog.visao || '');
    setValores(prog.valores || '');
    setObjectivos(prog.objectivos || '');
    setAreasActuacao(prog.areasActuacao || '');
    setActividades(prog.actividades || '');
    setBeneficiosMembros(prog.beneficiosMembros || '');
    setCompromissoMembros(prog.compromissoMembros || '');
    setLema(prog.lema || '');
    setDeclaracao(prog.declaracao || '');
    setCustomFields(prog.customFields || []);
    setAdhesionLevels(prog.adhesionLevels || []);
    setEnabledSteps({
      identificacao: prog.enabledSteps?.identificacao !== false,
      negocio: prog.enabledSteps?.negocio !== false,
      adesao: prog.enabledSteps?.adesao !== false,
      interesses: prog.enabledSteps?.interesses !== false,
      origem: prog.enabledSteps?.origem !== false,
      declaracao: prog.enabledSteps?.declaracao !== false,
      checkout: prog.enabledSteps?.checkout !== false,
    });
    setActiveTab('geral');
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setTitle('');
    setPhase('');
    setDuration('');
    setImage('');
    setOrder(programs.length);
    setStatus('ativo');
    setDescription('');
    setPublicoAlvo('');
    setBeneficios('');
    setRequisitos('');
    setInvestimento('');
    setPrice('');
    setPaymentInstructions('');
    setProcessoSelecao('');
    setCriteriosSelecao('');
    setIsClub(false);
    setProvince('');
    setMissao('');
    setVisao('');
    setValores('');
    setObjectivos('');
    setAreasActuacao('');
    setActividades('');
    setBeneficiosMembros('');
    setCompromissoMembros('');
    setLema('');
    setDeclaracao('');
    setCustomFields([]);
    setAdhesionLevels([]);
    setEnabledSteps({
      identificacao: true,
      negocio: true,
      adesao: true,
      interesses: true,
      origem: true,
      declaracao: true,
      checkout: true,
    });
    setActiveTab('geral');
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
      } else {
        alert(data.error || 'Erro no upload da imagem.');
      }
    } catch {
      alert('Erro de conexão ao carregar imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const formatDescriptionAuto = () => {
    if (description.length < 150) return;

    // Split text into paragraphs
    const paragraphs = description.split('\n').filter(p => p.trim().length > 0);

    // Decide number of columns based on text length
    const useThreeColumns = description.length >= 400;

    if (useThreeColumns) {
      // Format in 3 columns
      if (paragraphs.length < 3) {
        // If less than 3 paragraphs, split by sentences
        const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const columnSize = Math.ceil(sentences.length / 3);
        const column1 = sentences.slice(0, columnSize).join('. ').trim() + '.';
        const column2 = sentences.slice(columnSize, columnSize * 2).join('. ').trim() + '.';
        const column3 = sentences.slice(columnSize * 2).join('. ').trim() + '.';
        setDescription(`${column1}\n\n---\n\n${column2}\n\n---\n\n${column3}`);
      } else {
        // Distribute paragraphs into 3 columns
        const columnSize = Math.ceil(paragraphs.length / 3);
        const column1 = paragraphs.slice(0, columnSize).join('\n\n');
        const column2 = paragraphs.slice(columnSize, columnSize * 2).join('\n\n');
        const column3 = paragraphs.slice(columnSize * 2).join('\n\n');
        setDescription(`${column1}\n\n---\n\n${column2}\n\n---\n\n${column3}`);
      }
    } else {
      // Format in 2 columns
      if (paragraphs.length < 2) {
        // If less than 2 paragraphs, split by sentences
        const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length >= 2) {
          const columnSize = Math.ceil(sentences.length / 2);
          const column1 = sentences.slice(0, columnSize).join('. ').trim() + '.';
          const column2 = sentences.slice(columnSize).join('. ').trim() + '.';
          setDescription(`${column1}\n\n---\n\n${column2}`);
        }
      } else {
        // Distribute paragraphs into 2 columns
        const columnSize = Math.ceil(paragraphs.length / 2);
        const column1 = paragraphs.slice(0, columnSize).join('\n\n');
        const column2 = paragraphs.slice(columnSize).join('\n\n');
        setDescription(`${column1}\n\n---\n\n${column2}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Título e Descrição/O que É? são obrigatórios.');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      phase,
      duration,
      image,
      order,
      status,
      description,
      publicoAlvo,
      beneficios,
      requisitos,
      investimento,
      price,
      paymentInstructions,
      processoSelecao,
      criteriosSelecao,
      isClub,
      province,
      missao,
      visao,
      valores,
      objectivos,
      areasActuacao,
      actividades,
      beneficiosMembros,
      compromissoMembros,
      lema,
      declaracao,
      enabledSteps,
      customFields,
      adhesionLevels,
    };

    try {
      const url = '/api/programs';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? 'Programa atualizado com sucesso!' : 'Programa criado com sucesso!');
        fetchPrograms();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao guardar programa.');
      }
    } catch {
      alert('Erro de conexão ao guardar programa.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este programa?')) return;
    try {
      const res = await fetch(`/api/programs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMsg('Programa eliminado com sucesso.');
        fetchPrograms();
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao eliminar programa.');
      }
    } catch {
      alert('Erro de conexão ao eliminar.');
    }
  };

  const countItems = (text?: string) => {
    if (!text) return 0;
    return text.split('\n').filter(l => l.trim().length > 0).length;
  };

  const statusColor: Record<string, string> = {
    ativo: '#22c55e',
    inativo: '#ef4444',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Programas</h1>
          <p className={styles.subtitle}>{programs.length} programas no ecossistema</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? 'Cancelar' : '+ Novo Programa'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h3>{editingId ? `Editar: ${title}` : 'Adicionar Novo Programa'}</h3>
          </div>

          <div className={styles.formTabs}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'geral' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('geral')}
            >
              Informações Gerais
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'conteudo' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('conteudo')}
            >
              Conteúdo &amp; Pilares
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'selecao' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('selecao')}
            >
              Critérios &amp; Custos
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'clube' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('clube')}
            >
              {title ? getClubStepTitle(title) : 'Clube de Empreendedores'}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'inquerito' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('inquerito')}
            >
              Inquérito &amp; Etapas
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'adesao' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('adesao')}
            >
              Níveis de Adesão
            </button>
          </div>

          {activeTab === 'geral' && (
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Título do Programa *</label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: ABN STARTUP 180"
                />
              </div>
              <div className={styles.field}>
                <label>Fase / Categoria</label>
                <input
                  value={phase}
                  onChange={e => setPhase(e.target.value)}
                  placeholder="Ex: Incubação, Ideação, Crescimento"
                />
              </div>
              <div className={styles.field}>
                <label>Duração</label>
                <input
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="Ex: 6 Meses (180 Dias), Contínuo"
                />
              </div>
              <div className={styles.field}>
                <label>Estado</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Ordem de Exibição</label>
                <input
                  type="number"
                  value={order}
                  onChange={e => setOrder(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className={styles.field}>
                <label>Imagem de Capa (URL)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="/programas/startup180.jpg ou URL externa"
                    style={{ flex: 1 }}
                  />
                  <label className="btn-outline" style={{ cursor: 'pointer', padding: '8px 12px', fontSize: '0.85rem' }}>
                    {uploadingImage ? 'A carregar...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
              <div className={styles.field}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isClub}
                    onChange={e => setIsClub(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#ff6b00' }}
                  />
                  <span>É um Clube de Empreendedores?</span>
                </label>
              </div>
              {isClub && (
                <div className={styles.field}>
                  <label>Província / Âmbito</label>
                  <input
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    placeholder="Ex: Luanda, Maputo, Nacional &amp; Internacional"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'conteudo' && (
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ margin: 0 }}>Descrição / O que É? *</label>
                  <button
                    type="button"
                    onClick={formatDescriptionAuto}
                    style={{
                      background: 'rgba(255, 107, 0, 0.1)',
                      color: 'var(--primary, #ff6b00)',
                      border: '1px solid rgba(255, 107, 0, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Formatar em Colunas Automaticamente
                  </button>
                </div>
                <span className={styles.fieldHint}>Explicação geral sobre o programa. Use `---` numa linha separada para dividir o texto em colunas (2 ou 3 colunas).</span>
                <textarea
                  required
                  rows={8}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Primeira coluna de texto...&#10;&#10;---&#10;&#10;Segunda coluna de texto...&#10;&#10;---&#10;&#10;Terceira coluna de texto..."
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Público-alvo</label>
                <span className={styles.fieldHint}>Um item por linha (comece com `-` ou `•`)</span>
                <textarea
                  rows={5}
                  value={publicoAlvo}
                  onChange={e => setPublicoAlvo(e.target.value)}
                  placeholder="- Startups em fase de ideação&#10;- Empreendedores individuais&#10;- PMEs com potencial de escala"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Benefícios</label>
                <span className={styles.fieldHint}>Um benefício por linha</span>
                <textarea
                  rows={5}
                  value={beneficios}
                  onChange={e => setBeneficios(e.target.value)}
                  placeholder="- Mentoria especializada com fundadores seniores&#10;- Acesso a investidores e capital semente&#10;- Espaço de coworking gratuito"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Requisitos</label>
                <span className={styles.fieldHint}>Um requisito por linha</span>
                <textarea
                  rows={5}
                  value={requisitos}
                  onChange={e => setRequisitos(e.target.value)}
                  placeholder="- Ter uma ideia de negócio ou MVP&#10;- Dedicação de pelo menos 10h semanais&#10;- Equipa de 1 a 4 elementos"
                />
              </div>
            </div>
          )}

          {activeTab === 'selecao' && (
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Preço / Taxa de Participação</label>
                <input
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="Ex: Gratuito, 5.000 MT/mês, Sob Consulta"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Investimento &amp; Custos (Detalhes)</label>
                <span className={styles.fieldHint}>Detalhe os custos, bolsas disponíveis ou modalidades de pagamento</span>
                <textarea
                  rows={4}
                  value={investimento}
                  onChange={e => setInvestimento(e.target.value)}
                  placeholder="Ex: Programa gratuito para startups selecionadas. Financiamento com apoio de parceiros..."
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Instruções de Pagamento (opcional)</label>
                <textarea
                  rows={3}
                  value={paymentInstructions}
                  onChange={e => setPaymentInstructions(e.target.value)}
                  placeholder="Ex: Pagamento por M-Pesa para o número 84... com a referência do programa."
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Processo de Seleção / Admissão</label>
                <span className={styles.fieldHint}>Descreva as etapas do processo (ex: 1. Candidatura, 2. Entrevista...)</span>
                <textarea
                  rows={4}
                  value={processoSelecao}
                  onChange={e => setProcessoSelecao(e.target.value)}
                  placeholder="1. Submissão do formulário online&#10;2. Avaliação pelo comitê técnico&#10;3. Entrevista com os fundadores&#10;4. Comunicação dos selecionados"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Critérios de Seleção</label>
                <span className={styles.fieldHint}>Critérios de avaliação das candidaturas</span>
                <textarea
                  rows={4}
                  value={criteriosSelecao}
                  onChange={e => setCriteriosSelecao(e.target.value)}
                  placeholder="- Grau de inovação da solução&#10;- Potencial de mercado e escalabilidade&#10;- Perfil e comprometimento da equipa"
                />
              </div>
            </div>
          )}

          {activeTab === 'clube' && (
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Lema / Slogan do Clube</label>
                <input
                  value={lema}
                  onChange={e => setLema(e.target.value)}
                  placeholder="Ex: 'Conectando mentes, impulsionando negócios e transformando África.'"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Missão</label>
                <textarea
                  rows={3}
                  value={missao}
                  onChange={e => setMissao(e.target.value)}
                  placeholder="Descreva a missão do clube..."
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Visão</label>
                <textarea
                  rows={3}
                  value={visao}
                  onChange={e => setVisao(e.target.value)}
                  placeholder="Descreva a visão do clube..."
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Valores</label>
                <textarea
                  rows={3}
                  value={valores}
                  onChange={e => setValores(e.target.value)}
                  placeholder="Liste os valores do clube (separados por vírgula ou um por linha)..."
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Objectivos</label>
                <span className={styles.fieldHint}>Um objectivo por linha</span>
                <textarea
                  rows={5}
                  value={objectivos}
                  onChange={e => setObjectivos(e.target.value)}
                  placeholder="- Capacitar 500 empreendedores até 2027&#10;- Facilitar o acesso a financiamento"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Áreas de Actuação</label>
                <span className={styles.fieldHint}>Uma área por linha</span>
                <textarea
                  rows={4}
                  value={areasActuacao}
                  onChange={e => setAreasActuacao(e.target.value)}
                  placeholder="- Tecnologia e Inovação&#10;- Agricultura e Agroprocessamento"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Actividades</label>
                <span className={styles.fieldHint}>Uma actividade por linha</span>
                <textarea
                  rows={5}
                  value={actividades}
                  onChange={e => setActividades(e.target.value)}
                  placeholder="- Workshops mensais de capacitação&#10;- Pitch sessions com investidores"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Benefícios para os Membros</label>
                <span className={styles.fieldHint}>Um benefício por linha</span>
                <textarea
                  rows={5}
                  value={beneficiosMembros}
                  onChange={e => setBeneficiosMembros(e.target.value)}
                  placeholder="- Acesso a mentoria especializada&#10;- Participação em eventos exclusivos"
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Compromisso dos Membros</label>
                <span className={styles.fieldHint}>Um compromisso por linha</span>
                <textarea
                  rows={5}
                  value={compromissoMembros}
                  onChange={e => setCompromissoMembros(e.target.value)}
                  placeholder="- Participar activamente nas actividades do clube&#10;- Compartilhar conhecimento e experiências"
                />
              </div>
            </div>
          )}

          {activeTab === 'inquerito' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
              
              {/* ── ETAPAS ATIVAS DO FORMULÁRIO ── */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', fontWeight: 800 }}>
                      ⚙️ Visibilidade das Etapas do Inquérito
                    </h4>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                      Ative ou oculte as etapas do formulário de inscrição. Desative a etapa de <strong>Checkout</strong> e <strong>Adesão</strong> para programas gratuitos.
                    </p>
                  </div>

                  {/* Predefinições Rápidas */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setEnabledSteps({ identificacao: true, negocio: false, adesao: false, interesses: true, origem: false, declaracao: true, checkout: false })}
                      style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      🆓 Programa Gratuito
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnabledSteps({ identificacao: true, negocio: true, adesao: true, interesses: true, origem: true, declaracao: true, checkout: true })}
                      style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      🏢 Completo (7 Etapas)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnabledSteps({ identificacao: true, negocio: true, adesao: false, interesses: true, origem: false, declaracao: true, checkout: false })}
                      style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ⚡ Inscrição Direta
                    </button>
                  </div>
                </div>

                {/* Grid das Etapas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {[
                    { key: 'identificacao', num: '1', title: 'Identificação', desc: 'Dados Pessoais (Nome, Email, WhatsApp...)', required: true },
                    { key: 'negocio', num: '2', title: 'Negócio / Ideia', desc: 'Nome do Negócio, Setor e Estágio' },
                    { key: 'adesao', num: '3', title: 'Adesão / Planos', desc: 'Níveis de Adesão e Periodicidade' },
                    { key: 'interesses', num: '4', title: 'Interesses & Perguntas', desc: 'Áreas de Interesse e Campos Customizados' },
                    { key: 'origem', num: '5', title: 'Origem', desc: 'Como conheceu a ABN' },
                    { key: 'declaracao', num: '6', title: 'Declaração', desc: 'Termos, Assinatura e Consentimento' },
                    { key: 'checkout', num: '7', title: 'Checkout & Pagamento', desc: 'M-Pesa / eMola / Comprovativo (Desative se Grátis)' },
                  ].map(step => {
                    const isChecked = enabledSteps[step.key as keyof EnabledStepsConfig];
                    return (
                      <label
                        key={step.key}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          background: isChecked ? '#ffffff' : '#f1f5f9',
                          border: `1.5px solid ${isChecked ? '#ff6b00' : '#cbd5e1'}`,
                          borderRadius: '12px',
                          padding: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          opacity: isChecked ? 1 : 0.65,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            setEnabledSteps(prev => ({
                              ...prev,
                              [step.key]: e.target.checked,
                            }));
                          }}
                          style={{ width: '18px', height: '18px', accentColor: '#ff6b00', marginTop: '2px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ff6b00' }}>#{step.num}</span>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{step.title}</strong>
                          </div>
                          <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4' }}>
                            {step.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className={styles.field}>
                <label>Texto da Declaração</label>
                <span className={styles.fieldHint}>Texto que aparecerá na secção de declaração do formulário de inscrição. Se deixar vazio, será usada uma declaração padrão.</span>
                <textarea
                  rows={4}
                  value={declaracao}
                  onChange={e => setDeclaracao(e.target.value)}
                  placeholder="Ex: Declaro que as informações prestadas neste inquérito são verdadeiras e completas..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary, #ff6b00)', fontSize: '1.1rem' }}>
                    Formulário de Inquérito Personalizado
                  </h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Adicione perguntas específicas que os candidatos deverão responder ao inscreverem-se neste programa.
                  </p>
                </div>
                <button
                  type="button"
                  style={{ background: 'var(--primary, #ff6b00)', color: '#fff', border: 'none', padding: '0.65rem 1.3rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                  onClick={() => {
                    setCustomFields([
                      ...customFields,
                      { id: Date.now().toString(), label: '', type: 'text', options: [], required: false, placeholder: '' }
                    ]);
                  }}
                >
                  + Adicionar Pergunta / Campo
                </button>
              </div>

              {customFields.length === 0 ? (
                <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '3rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Nenhuma pergunta personalizada configurada para este programa.</p>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>Clique no botão "+ Adicionar Pergunta / Campo" acima para personalizar o inquérito.</p>
                </div>
              ) : (
                customFields.map((field, idx) => (
                  <div key={field.id || idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', letterSpacing: '0.05em' }}>
                        PERGUNTA #{idx + 1}
                      </span>
                      <button
                        type="button"
                        style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.4rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                        onClick={() => setCustomFields(customFields.filter((_, i) => i !== idx))}
                      >
                        🗑️ Remover Pergunta
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                      <div className={styles.field}>
                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Título da Pergunta *</label>
                        <input
                          type="text"
                          required
                          value={field.label}
                          onChange={e => {
                            const updated = [...customFields];
                            updated[idx].label = e.target.value;
                            setCustomFields(updated);
                          }}
                          placeholder="Ex: Possui registo comercial (NUIT)?"
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
                        />
                      </div>

                      <div className={styles.field}>
                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo de Resposta</label>
                        <select
                          value={field.type}
                          onChange={e => {
                            const updated = [...customFields];
                            updated[idx].type = e.target.value as any;
                            setCustomFields(updated);
                          }}
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
                        >
                          <option value="text">Texto Curto</option>
                          <option value="textarea">Texto Longo / Parágrafo</option>
                          <option value="select">Escolha Única (Dropdown)</option>
                          <option value="checkbox">Caixa de Seleção (Múltipla)</option>
                          <option value="file">Upload de Ficheiro (PDF/Imagem)</option>
                        </select>
                      </div>

                      <div className={styles.field} style={{ justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginTop: '1.6rem' }}>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={e => {
                              const updated = [...customFields];
                              updated[idx].required = e.target.checked;
                              setCustomFields(updated);
                            }}
                            style={{ width: '18px', height: '18px', accentColor: '#ff6b00' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>Resposta Obrigatória</span>
                        </label>
                      </div>
                    </div>

                    {(field.type === 'select' || field.type === 'checkbox') && (
                      <div className={styles.field}>
                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Opções de Escolha (uma opção por linha)
                        </label>
                        <textarea
                          rows={3}
                          value={field.options?.join('\n') || ''}
                          onChange={e => {
                            const updated = [...customFields];
                            updated[idx].options = e.target.value.split('\n').filter(o => o.trim().length > 0);
                            setCustomFields(updated);
                          }}
                          placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'adesao' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary, #ff6b00)', fontSize: '1.1rem' }}>
                    Níveis / Planos de Adesão Personalizados
                  </h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Se configurado, o candidato escolherá entre estes níveis no formulário de inscrição em vez dos planos padrão.
                  </p>
                </div>
                <button
                  type="button"
                  style={{ background: 'var(--primary, #ff6b00)', color: '#fff', border: 'none', padding: '0.65rem 1.3rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                  onClick={() => {
                    setAdhesionLevels([
                      ...adhesionLevels,
                      { id: Date.now().toString(), label: '', subLabel: '', inscriptionFee: 0, annualQuota: 0, showPeriodicity: true, required: false }
                    ]);
                  }}
                >
                  + Adicionar Nível de Adesão
                </button>
              </div>

              {adhesionLevels.length === 0 ? (
                <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '3rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Nenhum nível personalizado configurado.</p>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>Serão usados os níveis padrão do Clube ou taxas padrão do programa.</p>
                </div>
              ) : (
                adhesionLevels.map((level, idx) => (
                  <div key={level.id || idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary, #ff6b00)', letterSpacing: '0.05em' }}>
                        PLANO / NÍVEL #{idx + 1}
                      </span>
                      <button
                        type="button"
                        style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.4rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                        onClick={() => setAdhesionLevels(adhesionLevels.filter((_, i) => i !== idx))}
                      >
                        🗑️ Remover Plano
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                      <div className={styles.field}>
                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nome do Plano / Nível *</label>
                        <input
                          type="text"
                          required
                          value={level.label}
                          onChange={e => {
                            const updated = [...adhesionLevels];
                            updated[idx].label = e.target.value;
                            setAdhesionLevels(updated);
                          }}
                          placeholder="Ex: Membro Individual, Startup, Estudante"
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
                        />
                      </div>

                      <div className={styles.field}>
                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtítulo / Descrição Curta</label>
                        <input
                          type="text"
                          value={level.subLabel}
                          onChange={e => {
                            const updated = [...adhesionLevels];
                            updated[idx].subLabel = e.target.value;
                            setAdhesionLevels(updated);
                          }}
                          placeholder="Ex: Inscrição 300 MT | Quota anual 1.000 MT"
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
                        />
                      </div>

                      <div className={styles.field}>
                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Taxa de Inscrição (MT)</label>
                        <input
                          type="number"
                          value={level.inscriptionFee}
                          onChange={e => {
                            const updated = [...adhesionLevels];
                            updated[idx].inscriptionFee = Number(e.target.value);
                            setAdhesionLevels(updated);
                          }}
                          placeholder="0"
                          min="0"
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
                        />
                      </div>

                      <div className={styles.field}>
                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quota Anual (MT)</label>
                        <input
                          type="number"
                          value={level.annualQuota}
                          onChange={e => {
                            const updated = [...adhesionLevels];
                            updated[idx].annualQuota = Number(e.target.value);
                            setAdhesionLevels(updated);
                          }}
                          placeholder="0"
                          min="0"
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={level.showPeriodicity}
                          onChange={e => {
                            const updated = [...adhesionLevels];
                            updated[idx].showPeriodicity = e.target.checked;
                            setAdhesionLevels(updated);
                          }}
                          style={{ width: '18px', height: '18px', accentColor: '#ff6b00' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>Mostrar opções de periodicidade (mensal/trimestral/anual)</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={level.required}
                          onChange={e => {
                            const updated = [...adhesionLevels];
                            updated[idx].required = e.target.checked;
                            setAdhesionLevels(updated);
                          }}
                          style={{ width: '18px', height: '18px', accentColor: '#ff6b00' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>Obrigatório selecionar este nível</span>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar Programa'}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar programas do ecossistema...</p>
        </div>
      ) : programs.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum programa cadastrado no momento.</p>
          <button className="btn-primary" onClick={handleCreateClick}>Criar Primeiro Programa</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {programs.map(prog => (
            <div key={prog._id} className={styles.card}>
              {prog.image && (
                <div style={{ height: '140px', overflow: 'hidden', borderRadius: '16px 16px 0 0', margin: '-1.5rem -1.5rem 1rem -1.5rem', width: 'calc(100% + 3rem)' }}>
                  <img src={prog.image} alt={prog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className={styles.cardHeader}>
                <div className={styles.badgeGroup}>
                  {prog.isClub && <span className={styles.phase}>Clube</span>}
                  {prog.isClub && prog.province && <span className={styles.duration}>{prog.province}</span>}
                  {!prog.isClub && prog.phase && <span className={styles.phase}>{prog.phase}</span>}
                  {!prog.isClub && prog.duration && <span className={styles.duration}>{prog.duration}</span>}
                </div>
                <span
                  className={styles.statusBadge}
                  style={{
                    background: statusColor[prog.status] + '22',
                    color: statusColor[prog.status],
                    border: `1.5px solid ${statusColor[prog.status]}44`,
                  }}
                >
                  {prog.status}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{prog.title}</h3>
              <p className={styles.cardDesc}>{prog.description}</p>
              
              <div className={styles.cardDetails}>
                {prog.publicoAlvo && (
                  <div className={styles.detailItem}>
                    <span>Público-alvo:</span>
                    <strong>{countItems(prog.publicoAlvo)} itens</strong>
                  </div>
                )}
                {prog.beneficios && (
                  <div className={styles.detailItem}>
                    <span>Benefícios:</span>
                    <strong>{countItems(prog.beneficios)} itens</strong>
                  </div>
                )}
                {prog.requisitos && (
                  <div className={styles.detailItem}>
                    <span>Requisitos:</span>
                    <strong>{countItems(prog.requisitos)} itens</strong>
                  </div>
                )}
                {prog.investimento && (
                  <div className={styles.detailItem}>
                    <span>Investimento:</span>
                    <strong>Definido</strong>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button className={styles.editBtn} onClick={() => handleEditClick(prog)}>
                  Editar
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(prog._id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
