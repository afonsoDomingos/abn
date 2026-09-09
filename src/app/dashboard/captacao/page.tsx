'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  FileText,
  Users,
  Award,
  Upload,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Plus,
  Sparkles,
  Calendar,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export default function CaptacaoPage() {
  const [business, setBusiness] = useState<any>(null);
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'rodada' | 'dataroom' | 'metricas' | 'investidores' | 'aceleracao'>('rodada');
  const [feedback, setFeedback] = useState<{ type: string; message: string } | null>(null);

  // Form State: Rodada
  const [seekingAmount, setSeekingAmount] = useState('$150,000');
  const [valuation, setValuation] = useState('$1,500,000 Pre-Money');
  const [roundStage, setRoundStage] = useState('Seed');
  const [roundStatus, setRoundStatus] = useState('Aberta');
  const [elevatorPitch, setElevatorPitch] = useState('');
  const [pitchDeckUrl, setPitchDeckUrl] = useState('');
  const [uploadingDeck, setUploadingDeck] = useState(false);

  // Form State: Data Room
  const [dataRoomTitle, setDataRoomTitle] = useState('');
  const [dataRoomUrl, setDataRoomUrl] = useState('');
  const [dataRoomCategory, setDataRoomCategory] = useState('Cap Table & Societário');
  const [uploadingDataRoom, setUploadingDataRoom] = useState(false);
  const [showDataRoomModal, setShowDataRoomModal] = useState(false);

  // Form State: Métricas de Tração
  const [mrr, setMrr] = useState('$5,000');
  const [arr, setArr] = useState('$60,000');
  const [cac, setCac] = useState('$120');
  const [ltv, setLtv] = useState('$1,800');
  const [runwayMonths, setRunwayMonths] = useState(14);
  const [burnRate, setBurnRate] = useState('$3,500 / mês');
  const [activeClients, setActiveClients] = useState(45);
  const [churnRate, setChurnRate] = useState('2.1%');
  const [momGrowth, setMomGrowth] = useState('18%');

  useEffect(() => {
    fetchStartupData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchStartupData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/startup');
      const data = await res.json();
      if (data.success && data.business) {
        const b = data.business;
        setBusiness(b);
        setInvestors(data.investors || []);

        if (b.fundraising) {
          setSeekingAmount(b.fundraising.seekingAmount || '$150,000');
          setValuation(b.fundraising.valuation || '$1,500,000 Pre-Money');
          setRoundStage(b.fundraising.stage || 'Seed');
          setRoundStatus(b.fundraising.roundStatus || 'Aberta');
          setElevatorPitch(b.fundraising.elevatorPitch || '');
          setPitchDeckUrl(b.fundraising.pitchDeckUrl || '');
        }

        if (b.traction) {
          setMrr(b.traction.mrr || '$5,000');
          setArr(b.traction.arr || '$60,000');
          setCac(b.traction.cac || '$120');
          setLtv(b.traction.ltv || '$1,800');
          setRunwayMonths(b.traction.runwayMonths || 14);
          setBurnRate(b.traction.burnRate || '$3,500 / mês');
          setActiveClients(b.traction.activeClients || 45);
          setChurnRate(b.traction.churnRate || '2.1%');
          setMomGrowth(b.traction.momGrowth || '18%');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Upload do Pitch Deck
  const handleDeckUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingDeck(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setPitchDeckUrl(data.url);
        showNotification('success', 'Pitch Deck carregado! Clique em Salvar para consolidar.');
      }
    } catch {
      showNotification('error', 'Erro ao carregar Pitch Deck.');
    } finally {
      setUploadingDeck(false);
    }
  };

  // Upload Ficheiro do Data Room
  const handleDataRoomFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingDataRoom(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setDataRoomUrl(data.url);
        if (!dataRoomTitle) setDataRoomTitle(file.name);
      }
    } catch {
      showNotification('error', 'Erro no upload.');
    } finally {
      setUploadingDataRoom(false);
    }
  };

  // Salvar Rodada de Captação
  const handleSaveFundraising = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/startup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundraising: {
            seekingAmount,
            valuation,
            stage: roundStage,
            roundStatus,
            elevatorPitch,
            pitchDeckUrl,
            dataRoom: business?.fundraising?.dataRoom || [],
            requestedIntros: business?.fundraising?.requestedIntros || []
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        showNotification('success', 'Configurações de captação atualizadas!');
      } else {
        showNotification('error', data.error || 'Erro ao salvar.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Salvar Item no Data Room
  const handleAddDataRoomItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataRoomTitle.trim() || !dataRoomUrl.trim()) return;
    setSaving(true);

    const updatedDataRoom = [
      ...(business?.fundraising?.dataRoom || []),
      { title: dataRoomTitle.trim(), fileUrl: dataRoomUrl.trim(), category: dataRoomCategory, updatedAt: new Date() }
    ];

    try {
      const res = await fetch('/api/user/startup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundraising: {
            ...business.fundraising,
            dataRoom: updatedDataRoom
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setDataRoomTitle('');
        setDataRoomUrl('');
        setShowDataRoomModal(false);
        showNotification('success', 'Documento adicionado ao Data Room!');
      }
    } finally {
      setSaving(false);
    }
  };

  // Salvar Métricas de Tração
  const handleSaveTraction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/startup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traction: {
            mrr,
            arr,
            cac,
            ltv,
            runwayMonths: Number(runwayMonths),
            burnRate,
            activeClients: Number(activeClients),
            churnRate,
            momGrowth
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        showNotification('success', 'Métricas de tração e KPIs atualizados!');
      }
    } finally {
      setSaving(false);
    }
  };

  // Solicitar Introdução com Investidor
  const handleRequestIntro = async (investorId: string, investorName: string) => {
    try {
      const res = await fetch('/api/user/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_intro',
          investorId,
          investorName
        })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        showNotification('success', data.message || 'Introdução solicitada com sucesso!');
      } else {
        showNotification('error', data.error || 'Erro ao solicitar introdução.');
      }
    } catch {
      showNotification('error', 'Erro de conexão.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
        A carregar o módulo de Captação e Aceleração da Startup...
      </div>
    );
  }

  const requestedIntros = business?.fundraising?.requestedIntros || [];

  return (
    <div style={{ maxWidth: '1150px', width: '100%', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Toast Feedback */}
      {feedback && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '12px 20px',
          borderRadius: '12px',
          background: feedback.type === 'success' ? '#10b981' : '#ef4444',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.88rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          {feedback.message}
        </div>
      )}

      {/* Header com Resumo da Rodada */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        border: '1px solid rgba(255, 107, 0, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, background: 'rgba(255,107,0,0.2)', color: '#ff6b00', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
              Fundraising Hub
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, background: roundStatus === 'Aberta' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)', color: roundStatus === 'Aberta' ? '#34d399' : '#cbd5e1', padding: '3px 10px', borderRadius: '12px' }}>
              Rodada: {roundStatus}
            </span>
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '1.85rem', color: '#ffffff', fontFamily: 'Outfit', fontWeight: 800 }}>
            Captação de Investimento &amp; Aceleração
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            {business?.name || 'Startup'} • Estágio: {roundStage} • Alvo: {seekingAmount}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: 'rgba(255,255,255,0.06)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Procura</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ff6b00', fontFamily: 'Outfit' }}>{seekingAmount}</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Valuation</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>{valuation}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'rodada', label: 'Rodada de Captação', icon: DollarSign },
          { id: 'dataroom', label: `Data Room (${business?.fundraising?.dataRoom?.length || 0})`, icon: FileText },
          { id: 'metricas', label: 'Métricas de Tração & KPIs', icon: TrendingUp },
          { id: 'investidores', label: `Investidores & Introduções (${investors.length})`, icon: Users },
          { id: 'aceleracao', label: 'Programa de Aceleração', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? '#0f172a' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
         1. ABA: RODADA DE CAPTAÇÃO
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'rodada' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 1.5rem 0', fontFamily: 'Outfit', fontWeight: 800 }}>
            Configuração da Rodada de Financiamento
          </h2>

          <form onSubmit={handleSaveFundraising} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Quanto Procura (Target) *</label>
                <input
                  type="text"
                  value={seekingAmount}
                  onChange={e => setSeekingAmount(e.target.value)}
                  placeholder="Ex: $200,000 ou 100.000.000 Kz"
                  required
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Valuation Definido *</label>
                <input
                  type="text"
                  value={valuation}
                  onChange={e => setValuation(e.target.value)}
                  placeholder="Ex: $1,500,000 Pre-Money"
                  required
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Estágio da Rodada</label>
                <select
                  value={roundStage}
                  onChange={e => setRoundStage(e.target.value)}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                >
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Série A">Série A</option>
                  <option value="Bridge / Ponte">Bridge / Ponte</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Status da Rodada</label>
                <select
                  value={roundStatus}
                  onChange={e => setRoundStatus(e.target.value)}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                >
                  <option value="Aberta">🟢 Aberta para Propostas</option>
                  <option value="Em Negociação">🟡 Em Negociação / Term Sheet</option>
                  <option value="Fechada">⚪ Fechada</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Elevator Pitch (O que faz e porquê investir)</label>
              <textarea
                rows={3}
                value={elevatorPitch}
                onChange={e => setElevatorPitch(e.target.value)}
                placeholder="Apresente a dor que resolve, mercado potencial, tração e para que servirá o capital..."
                style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }}
              />
            </div>

            {/* Upload do Pitch Deck */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                Pitch Deck Oficial da Startup (PDF ou Apresentação)
              </label>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>
                O pitch deck é partilhado com investidores credenciados quando solicitarem acesso.
              </p>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={pitchDeckUrl}
                  onChange={e => setPitchDeckUrl(e.target.value)}
                  placeholder="URL do Pitch Deck ou faça upload"
                  style={{ flex: 1, minWidth: '240px', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                />
                <label style={{ padding: '10px 18px', background: '#0f172a', color: '#ffffff', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={14} /> {uploadingDeck ? 'A enviar...' : 'Subir Pitch Deck'}
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleDeckUpload(file);
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                {pitchDeckUrl && (
                  <a href={pitchDeckUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ff6b00', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                    Visualizar Deck <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ padding: '12px 28px', fontWeight: 800, fontSize: '0.9rem' }}
              >
                {saving ? 'A guardar...' : 'Guardar Configurações da Rodada'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         2. ABA: DATA ROOM DIGITAL
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'dataroom' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit', fontWeight: 800 }}>
                Data Room Digital &amp; Due Diligence
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                Repositório estruturado para acelerar o processo de análise de fundos e investidores.
              </p>
            </div>
            <button
              onClick={() => setShowDataRoomModal(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', fontSize: '0.84rem' }}
            >
              <Plus size={16} /> Adicionar Documento ao Data Room
            </button>
          </div>

          {(!business?.fundraising?.dataRoom || business.fundraising.dataRoom.length === 0) ? (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '20px', padding: '3.5rem 1rem', textAlign: 'center' }}>
              <FileText size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Data Room vazio</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
                Adicione a certidão comercial, cap table, modelo financeiro e demonstrações de resultados.
              </p>
              <button onClick={() => setShowDataRoomModal(true)} className="btn-outline" style={{ padding: '9px 18px', fontSize: '0.84rem' }}>
                + Subir Primeiro Documento
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {business.fundraising.dataRoom.map((doc: any, idx: number) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#0f172a', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      {doc.category}
                    </span>
                    <h4 style={{ margin: '8px 0 4px 0', fontSize: '1rem', color: '#0f172a' }}>{doc.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                      Atualizado em: {new Date(doc.updatedAt || Date.now()).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '12px', textAlign: 'right' }}>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#ff6b00', fontWeight: 700, textDecoration: 'none' }}
                    >
                      Aceder ao Ficheiro <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         3. ABA: MÉTRICAS DE TRAÇÃO & KPIS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'metricas' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Outfit', fontWeight: 800 }}>
            Métricas de Tração &amp; KPIs Financeiros
          </h2>
          <p style={{ margin: '0 0 1.75rem 0', color: '#64748b', fontSize: '0.88rem' }}>
            Apresente as métricas que provam o crescimento, retenção e saúde financeira da startup.
          </p>

          <form onSubmit={handleSaveTraction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>MRR (Receita Recorrente Mensal)</label>
                <input type="text" value={mrr} onChange={e => setMrr(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>ARR (Receita Recorrente Anual)</label>
                <input type="text" value={arr} onChange={e => setArr(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Crescimento MoM (%)</label>
                <input type="text" value={momGrowth} onChange={e => setMomGrowth(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Clientes / Usuários Ativos</label>
                <input type="number" value={activeClients} onChange={e => setActiveClients(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>CAC (Custo Aquisição Cliente)</label>
                <input type="text" value={cac} onChange={e => setCac(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>LTV (Valor do Tempo de Vida)</label>
                <input type="text" value={ltv} onChange={e => setLtv(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Runway (Meses Restantes)</label>
                <input type="number" value={runwayMonths} onChange={e => setRunwayMonths(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Burn Rate Mensal</label>
                <input type="text" value={burnRate} onChange={e => setBurnRate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '12px 28px', fontWeight: 800 }}>
                {saving ? 'A guardar...' : 'Atualizar Métricas de Tração'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         4. ABA: INVESTIDORES & INTRODUÇÕES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'investidores' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit', fontWeight: 800 }}>
              Procurar Investidores &amp; Solicitar Introdução
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
              A ABN faz a ponte institucional formal entre startups qualificadas e investidores parceiros.
            </p>
          </div>

          {/* Histórico de Introduções Solicitadas */}
          {requestedIntros.length > 0 && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.92rem', color: '#0f172a' }}>
                Introduções em Processamento ({requestedIntros.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {requestedIntros.map((intro: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                      Ponte com: {intro.investorName}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px', background: '#fef3c7', color: '#b45309' }}>
                      ⏳ Status: {intro.status?.toUpperCase() || 'EM ANÁLISE PELA ABN'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diretório de Investidores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {investors.map(inv => {
              const alreadyRequested = requestedIntros.some((i: any) => String(i.investorId) === String(inv._id));
              return (
                <div key={inv._id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <img
                        src={inv.profileImage || '/abn-logo.png'}
                        alt={inv.name}
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff6b00' }}
                      />
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                          {inv.name}
                        </h4>
                        <span style={{ fontSize: '0.74rem', color: '#ff6b00', fontWeight: 700 }}>
                          {inv.company || 'Investidor / Fundo'}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                      {inv.bio || 'Interesse em startups inovadoras com modelo escalável na lusofonia.'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRequestIntro(inv._id, inv.name)}
                    disabled={alreadyRequested}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: alreadyRequested ? 'default' : 'pointer',
                      background: alreadyRequested ? '#f1f5f9' : '#0f172a',
                      color: alreadyRequested ? '#94a3b8' : '#ffffff',
                      transition: 'all 0.2s'
                    }}
                  >
                    {alreadyRequested ? (
                      <>
                        <CheckCircle2 size={16} color="#16a34a" /> Introdução Solicitada
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Solicitar Introdução ABN
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         5. ABA: PROGRAMA DE ACELERAÇÃO
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'aceleracao' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Progress Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.74rem', background: '#fff7ed', color: '#ea580c', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  {business?.acceleration?.programName || 'ABN Scale Cohort'}
                </span>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '1.35rem', color: '#0f172a', fontFamily: 'Outfit', fontWeight: 800 }}>
                  Progresso na Aceleração: {business?.acceleration?.progress || 50}%
                </h3>
              </div>
              <div style={{ fontSize: '2rem' }}>🏆</div>
            </div>

            <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${business?.acceleration?.progress || 50}%`, height: '100%', background: '#ff6b00', borderRadius: '5px' }} />
            </div>
          </div>

          {/* Mentores e Sessões */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#ff6b00" /> Mentores Atribuídos
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'Dra. Cristina Varela', role: 'Estratégia & Expansão Internacional', company: 'Global Growth' },
                  { name: 'Eng. Manuel Tavares', role: 'Arquitetura de Produto & Tech Stack', company: 'TechVentures' }
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ff6b00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#ff6b00" /> Próximas Sessões &amp; Workshops
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '10px 12px', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#c2410c' }}>Sessão 1-on-1: Revisão de Pitch Deck</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Quinta-feira, 15:00 • Mentor Manuel Tavares</div>
                </div>
                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>Masterclass: Valuation &amp; Cap Table</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Sexta-feira, 17:00 • Formador Convidado ABN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: ADICIONAR DOCUMENTO AO DATA ROOM
      ───────────────────────────────────────────────────────────── */}
      {showDataRoomModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Adicionar ao Data Room</h3>
            <form onSubmit={handleAddDataRoomItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Título do Documento *</label>
                <input
                  type="text"
                  value={dataRoomTitle}
                  onChange={e => setDataRoomTitle(e.target.value)}
                  placeholder="Ex: Cap Table 2026 / Certidão de Constituição"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Categoria</label>
                <select
                  value={dataRoomCategory}
                  onChange={e => setDataRoomCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Cap Table & Societário">Cap Table &amp; Societário</option>
                  <option value="Financeiro & Balanços">Financeiro &amp; Balanços</option>
                  <option value="Contratos & Clientes">Contratos &amp; Clientes</option>
                  <option value="Propriedade Intelectual & Marcas">Propriedade Intelectual &amp; Marcas</option>
                  <option value="Outro">Outro Documento</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Ficheiro (Upload ou URL)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <input
                    type="text"
                    value={dataRoomUrl}
                    onChange={e => setDataRoomUrl(e.target.value)}
                    placeholder="URL do ficheiro ou suba abaixo"
                    required
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <label style={{ padding: '10px 14px', background: '#0f172a', color: '#ffffff', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                    {uploadingDataRoom ? 'A enviar...' : 'Subir'}
                    <input
                      type="file"
                      accept=".pdf,.xlsx,.xls,.doc,.docx"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDataRoomFileUpload(file);
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowDataRoomModal(false)} className="btn-outline" style={{ padding: '10px 18px' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>
                  {saving ? 'A guardar...' : 'Salvar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
