'use client';

import { useEffect, useState } from 'react';
import styles from './Programas.module.css';

interface Program {
  _id: string;
  title: string;
  description: string;
  publicoAlvo?: string;
  beneficios?: string;
  requisitos?: string;
  investimento?: string;
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
}

export default function AdminProgramasPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'geral' | 'conteudo' | 'selecao' | 'clube'>('geral');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Título e Descrição/O que é? são obrigatórios.');
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
        setMsg(editingId ? '✅ Programa atualizado com sucesso!' : '✅ Programa criado com sucesso!');
        fetchPrograms();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao guardar programa.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja remover este programa? Esta ação não pode ser desfeita.')) return;
    try {
      const res = await fetch('/api/programs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setPrograms(prev => prev.filter(p => p._id !== id));
        setMsg('🗑️ Programa removido com sucesso!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao remover programa.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    }
  };

  const statusColor: Record<string, string> = {
    ativo: '#2e8b57',
    inativo: '#e74c3c',
  };

  // Helper helper count list lines
  const countItems = (text?: string) => {
    if (!text) return 0;
    return text.split('\n').filter(line => line.trim().length > 0).length;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão de Programas</h1>
          <p className={styles.subtitle}>{programs.length} programas no ecossistema</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? '✕ Cancelar' : '+ Novo Programa'}
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
              ℹ️ Informações Gerais
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'conteudo' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('conteudo')}
            >
              🎯 Conteúdo & Requisitos
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'selecao' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('selecao')}
            >
              🤝 Seleção & Critérios
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'clube' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('clube')}
            >
              🏛️ Clube de Empreendedores
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
                  placeholder="Ex: 8 Semanas, Contínuo"
                />
              </div>
              <div className={styles.field}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }} className={styles.field}>
                    <label>Ordem de Exibição</label>
                    <input
                      type="number"
                      value={order}
                      onChange={e => setOrder(Number(e.target.value))}
                    />
                  </div>
                  <div style={{ flex: 1 }} className={styles.field}>
                    <label>Estado</label>
                    <select value={status} onChange={e => setStatus(e.target.value)}>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <label>Tipo de Programa</label>
                <select value={isClub ? 'clube' : 'programa'} onChange={e => setIsClub(e.target.value === 'clube')}>
                  <option value="programa">Programa Regular</option>
                  <option value="clube">Clube de Empreendedores</option>
                </select>
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Foto de Capa do Programa (URL ou Upload)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="URL da foto de capa (ex: /hero_entrepreneurs.png)"
                    style={{ flex: 1 }}
                  />
                  <label style={{ cursor: 'pointer', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {uploadingImage ? '⏳...' : '📁 Subir Capa'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {image && (
                  <div style={{ marginTop: '8px', width: '120px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <img src={image} alt="Preview Capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Descrição / O que é? *</label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descreva o programa em detalhe..."
                />
              </div>
            </div>
          )}

          {activeTab === 'conteudo' && (
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Público-alvo</label>
                <span className={styles.fieldHint}>Um item por linha</span>
                <textarea
                  rows={4}
                  value={publicoAlvo}
                  onChange={e => setPublicoAlvo(e.target.value)}
                  placeholder="- Empreendedores com ideias de negócio&#10;- Startups em fase inicial"
                />
              </div>
              <div className={styles.field}>
                <label>Benefícios</label>
                <span className={styles.fieldHint}>Um item por linha</span>
                <textarea
                  rows={4}
                  value={beneficios}
                  onChange={e => setBeneficios(e.target.value)}
                  placeholder="- Formação prática&#10;- Mentoria especializada"
                />
              </div>
              <div className={styles.field}>
                <label>Requisitos</label>
                <span className={styles.fieldHint}>Um item por linha</span>
                <textarea
                  rows={4}
                  value={requisitos}
                  onChange={e => setRequisitos(e.target.value)}
                  placeholder="- Ter idade igual ou superior a 16 anos&#10;- Interesse em empreendedorismo"
                />
              </div>
              <div className={styles.field}>
                <label>Investimento / Custos</label>
                <span className={styles.fieldHint}>Informações sobre inscrição, propinas, etc.</span>
                <textarea
                  rows={4}
                  value={investimento}
                  onChange={e => setInvestimento(e.target.value)}
                  placeholder="Inscrição: Gratuita&#10;Formação: Conforme cada edição"
                />
              </div>
            </div>
          )}

          {activeTab === 'selecao' && (
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Processo de Seleção</label>
                <span className={styles.fieldHint}>Como ocorre a seleção (um por linha ou parágrafos)</span>
                <textarea
                  rows={6}
                  value={processoSelecao}
                  onChange={e => setProcessoSelecao(e.target.value)}
                  placeholder="A seleção pode ocorrer através de:&#10;- Formulário oficial&#10;- Rota de Empreendedores"
                />
              </div>
              <div className={styles.field}>
                <label>Critérios de Seleção</label>
                <span className={styles.fieldHint}>Quais são os critérios (um por linha ou parágrafos)</span>
                <textarea
                  rows={6}
                  value={criteriosSelecao}
                  onChange={e => setCriteriosSelecao(e.target.value)}
                  placeholder="- Potencial de impacto&#10;- Grau de inovação"
                />
              </div>
            </div>
          )}

          {activeTab === 'clube' && (
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Província</label>
                <input
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  placeholder="Ex: Sofala, Gaza, Maputo"
                />
              </div>
              <div className={styles.field}>
                <label>Lema</label>
                <input
                  value={lema}
                  onChange={e => setLema(e.target.value)}
                  placeholder="Ex: Unidos pelo Empreendedorismo"
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
          <span>🚀</span>
          <p>Nenhum programa cadastrado no momento.</p>
          <button className="btn-primary" onClick={handleCreateClick}>Criar Primeiro Programa</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {programs.map(prog => (
            <div key={prog._id} className={styles.card}>
              {prog.image && (
                <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderRadius: '16px 16px 0 0', margin: '-1.5rem -1.5rem 1rem -1.5rem', width: 'calc(100% + 3rem)' }}>
                  <img src={prog.image} alt={prog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className={styles.cardHeader}>
                <div className={styles.badgeGroup}>
                  {prog.isClub && <span className={styles.phase}>🏛️ Clube</span>}
                  {prog.isClub && prog.province && <span className={styles.duration}>📍 {prog.province}</span>}
                  {!prog.isClub && prog.phase && <span className={styles.phase}>{prog.phase}</span>}
                  {!prog.isClub && prog.duration && <span className={styles.duration}>⏱ {prog.duration}</span>}
                </div>
                <span
                  className={styles.statusBadge}
                  style={{
                    background: statusColor[prog.status] + '22',
                    color: statusColor[prog.status],
                    border: `1px solid ${statusColor[prog.status]}44`,
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
                  ✏️ Editar
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(prog._id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
