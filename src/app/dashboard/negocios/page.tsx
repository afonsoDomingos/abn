'use client';

import { useEffect, useState } from 'react';
import { 
  Building2, 
  Package, 
  Users, 
  Truck, 
  Target, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Upload, 
  Award,
  Globe,
  MapPin,
  Sparkles
} from 'lucide-react';
import styles from '../Dashboard.module.css';

interface ProductService {
  _id?: string;
  name: string;
  description: string;
  price: string;
  type: 'produto' | 'servico';
  active: boolean;
}

interface Client {
  _id?: string;
  name: string;
  company: string;
  contact: string;
  status: 'lead' | 'em_negociacao' | 'ativo' | 'concluido';
  value: string;
}

interface Supplier {
  _id?: string;
  name: string;
  category: string;
  contact: string;
  terms: string;
}

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  email: string;
  linkedin: string;
}

interface Goal {
  _id?: string;
  title: string;
  targetDate: string;
  progress: number;
  status: 'pendente' | 'em_progresso' | 'concluida';
  category: string;
}

interface BusinessDocument {
  _id?: string;
  title: string;
  fileUrl: string;
  category: 'pitch_deck' | 'financeiro' | 'legal' | 'licenca' | 'outro';
  updatedAt?: string;
}

export default function NegociosPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visao_geral' | 'produtos' | 'clientes' | 'fornecedores' | 'equipa' | 'metas' | 'documentos'>('visao_geral');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: string; message: string } | null>(null);

  // Modais de Criação / Edição
  const [modalType, setModalType] = useState<'business' | 'product' | 'client' | 'supplier' | 'team' | 'goal' | 'document' | null>(null);

  // Formulário de Edição do Negócio
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState('');
  const [bizDesc, setBizDesc] = useState('');
  const [bizWebsite, setBizWebsite] = useState('');
  const [bizLocation, setBizLocation] = useState('');
  const [bizPhase, setBizPhase] = useState('Validação');

  // Formulário Produto/Serviço
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodType, setProdType] = useState<'produto' | 'servico'>('produto');

  // Formulário Cliente
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientStatus, setClientStatus] = useState<'lead' | 'em_negociacao' | 'ativo' | 'concluido'>('lead');
  const [clientValue, setClientValue] = useState('');

  // Formulário Fornecedor
  const [suppName, setSuppName] = useState('');
  const [suppCategory, setSuppCategory] = useState('');
  const [suppContact, setSuppContact] = useState('');
  const [suppTerms, setSuppTerms] = useState('');

  // Formulário Equipa
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamLinkedin, setTeamLinkedin] = useState('');

  // Formulário Metas
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalProgress, setGoalProgress] = useState(0);
  const [goalCategory, setGoalCategory] = useState('Vendas & Crescimento');

  // Formulário Documentos
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docCategory, setDocCategory] = useState<'pitch_deck' | 'financeiro' | 'legal' | 'licenca' | 'outro'>('pitch_deck');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/business');
      const data = await res.json();
      if (data.success && data.business) {
        setBusiness(data.business);
        setBizName(data.business.name || '');
        setBizCategory(data.business.category || '');
        setBizDesc(data.business.description || '');
        setBizWebsite(data.business.website || '');
        setBizLocation(data.business.location || '');
        setBizPhase(data.business.incubationPhase || 'Validação');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Salvar Informações Gerais do Negócio
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bizName,
          category: bizCategory,
          description: bizDesc,
          website: bizWebsite,
          location: bizLocation,
          incubationPhase: bizPhase
        })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setModalType(null);
        showNotification('success', 'Negócio atualizado com sucesso!');
      } else {
        showNotification('error', data.error || 'Erro ao atualizar.');
      }
    } catch {
      showNotification('error', 'Erro de ligação ao servidor.');
    } finally {
      setSaving(false);
    }
  };

  // Salvar Produto / Serviço
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    setSaving(true);

    const updatedList = [
      ...(business.productsAndServices || []),
      { name: prodName.trim(), description: prodDesc, price: prodPrice, type: prodType, active: true }
    ];

    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: business.name,
          category: business.category,
          productsAndServices: updatedList
        })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setProdName('');
        setProdDesc('');
        setProdPrice('');
        setModalType(null);
        showNotification('success', 'Item adicionado ao catálogo!');
      }
    } catch {
      showNotification('error', 'Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  };

  // Remover Produto / Serviço
  const handleRemoveProduct = async (index: number) => {
    const updatedList = business.productsAndServices.filter((_: any, i: number) => i !== index);
    const res = await fetch('/api/user/business', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: business.name, category: business.category, productsAndServices: updatedList })
    });
    const data = await res.json();
    if (data.success) setBusiness(data.business);
  };

  // Salvar Cliente
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    setSaving(true);

    const updatedList = [
      ...(business.clients || []),
      { name: clientName.trim(), company: clientCompany, contact: clientContact, status: clientStatus, value: clientValue }
    ];

    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: business.name, category: business.category, clients: updatedList })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setClientName('');
        setClientCompany('');
        setClientContact('');
        setClientValue('');
        setModalType(null);
        showNotification('success', 'Cliente adicionado com sucesso!');
      }
    } finally {
      setSaving(false);
    }
  };

  // Remover Cliente
  const handleRemoveClient = async (index: number) => {
    const updatedList = business.clients.filter((_: any, i: number) => i !== index);
    const res = await fetch('/api/user/business', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: business.name, category: business.category, clients: updatedList })
    });
    const data = await res.json();
    if (data.success) setBusiness(data.business);
  };

  // Salvar Fornecedor
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppName.trim()) return;
    setSaving(true);

    const updatedList = [
      ...(business.suppliers || []),
      { name: suppName.trim(), category: suppCategory, contact: suppContact, terms: suppTerms }
    ];

    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: business.name, category: business.category, suppliers: updatedList })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setSuppName('');
        setSuppCategory('');
        setSuppContact('');
        setSuppTerms('');
        setModalType(null);
        showNotification('success', 'Fornecedor registado com sucesso!');
      }
    } finally {
      setSaving(false);
    }
  };

  // Remover Fornecedor
  const handleRemoveSupplier = async (index: number) => {
    const updatedList = business.suppliers.filter((_: any, i: number) => i !== index);
    const res = await fetch('/api/user/business', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: business.name, category: business.category, suppliers: updatedList })
    });
    const data = await res.json();
    if (data.success) setBusiness(data.business);
  };

  // Salvar Membro da Equipa
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setSaving(true);

    const updatedList = [
      ...(business.team || []),
      { name: teamName.trim(), role: teamRole, email: teamEmail, linkedin: teamLinkedin }
    ];

    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: business.name, category: business.category, team: updatedList })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setTeamName('');
        setTeamRole('');
        setTeamEmail('');
        setTeamLinkedin('');
        setModalType(null);
        showNotification('success', 'Membro adicionado à equipa!');
      }
    } finally {
      setSaving(false);
    }
  };

  // Remover Membro da Equipa
  const handleRemoveTeamMember = async (index: number) => {
    const updatedList = business.team.filter((_: any, i: number) => i !== index);
    const res = await fetch('/api/user/business', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: business.name, category: business.category, team: updatedList })
    });
    const data = await res.json();
    if (data.success) setBusiness(data.business);
  };

  // Salvar Meta
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    setSaving(true);

    const updatedList = [
      ...(business.goals || []),
      { 
        title: goalTitle.trim(), 
        targetDate: goalDate, 
        progress: Number(goalProgress), 
        status: goalProgress >= 100 ? 'concluida' : 'em_progresso', 
        category: goalCategory 
      }
    ];

    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: business.name, category: business.category, goals: updatedList })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setGoalTitle('');
        setGoalDate('');
        setGoalProgress(0);
        setModalType(null);
        showNotification('success', 'Meta registada com sucesso!');
      }
    } finally {
      setSaving(false);
    }
  };

  // Remover Meta
  const handleRemoveGoal = async (index: number) => {
    const updatedList = business.goals.filter((_: any, i: number) => i !== index);
    const res = await fetch('/api/user/business', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: business.name, category: business.category, goals: updatedList })
    });
    const data = await res.json();
    if (data.success) setBusiness(data.business);
  };

  // Upload e Salvar Documento
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingDoc(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setDocUrl(data.url);
        if (!docTitle) setDocTitle(file.name);
      }
    } catch {
      showNotification('error', 'Erro no upload do ficheiro.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docUrl.trim()) return;
    setSaving(true);

    const updatedList = [
      ...(business.documents || []),
      { title: docTitle.trim(), fileUrl: docUrl.trim(), category: docCategory, updatedAt: new Date() }
    ];

    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: business.name, category: business.category, documents: updatedList })
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.business);
        setDocTitle('');
        setDocUrl('');
        setModalType(null);
        showNotification('success', 'Documento adicionado ao repositório!');
      }
    } finally {
      setSaving(false);
    }
  };

  // Remover Documento
  const handleRemoveDocument = async (index: number) => {
    const updatedList = business.documents.filter((_: any, i: number) => i !== index);
    const res = await fetch('/api/user/business', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: business.name, category: business.category, documents: updatedList })
    });
    const data = await res.json();
    if (data.success) setBusiness(data.business);
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
        A carregar o painel de gestão do seu negócio...
      </div>
    );
  }

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

      {/* Header do Negócio */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 8px 16px rgba(255,107,0,0.2)'
          }}>
            
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#fff7ed', color: '#ea580c', padding: '2px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                {business?.category || 'Negócio ABN'}
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#f0fdf4', color: '#16a34a', padding: '2px 10px', borderRadius: '12px' }}>
                Fase: {business?.incubationPhase || 'Validação'}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#0f172a', fontFamily: 'Outfit', fontWeight: 800 }}>
              {business?.name || 'O Meu Negócio'}
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              {business?.location ? `${business.location} • ` : ''}{business?.website || 'Website não configurado'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalType('business')}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.86rem' }}
        >
          <Edit3 size={16} /> Editar Negócio
        </button>
      </div>

      {/* Tabs de Navegação */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'visao_geral', label: 'Visão Geral', icon: Building2 },
          { id: 'produtos', label: `Produtos & Serviços (${business?.productsAndServices?.length || 0})`, icon: Package },
          { id: 'clientes', label: `Clientes (${business?.clients?.length || 0})`, icon: Users },
          { id: 'fornecedores', label: `Fornecedores (${business?.suppliers?.length || 0})`, icon: Truck },
          { id: 'equipa', label: `Equipa (${business?.team?.length || 0})`, icon: Briefcase },
          { id: 'metas', label: `Metas & OKRs (${business?.goals?.length || 0})`, icon: Target },
          { id: 'documentos', label: `Documentos (${business?.documents?.length || 0})`, icon: FileText }
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
         1. ABA: VISÃO GERAL
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'visao_geral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Catálogo Ativo</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                {business?.productsAndServices?.length || 0}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Produtos e Serviços</span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Base de Clientes</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                {business?.clients?.length || 0}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#ff6b00', fontWeight: 600 }}>Em pipeline / Ativos</span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Membros da Equipa</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                {business?.team?.length || 1}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>Colaboradores</span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Metas Concluídas</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                {business?.goals?.filter((g: any) => g.status === 'concluida').length || 0} / {business?.goals?.length || 0}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Taxa de Execução</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Outfit' }}>
              Sobre o Modelo de Negócio
            </h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              {business?.description || 'Nenhuma descrição detalhada adicionada. Clique em "Editar Negócio" para detalhar a sua missão e proposta de valor.'}
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         2. ABA: PRODUTOS E SERVIÇOS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'produtos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit' }}>Catálogo de Ofertas</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Gira os produtos e serviços que o seu negócio comercializa.</p>
            </div>
            <button
              onClick={() => setModalType('product')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus size={16} /> Adicionar Produto / Serviço
            </button>
          </div>

          {(!business?.productsAndServices || business.productsAndServices.length === 0) ? (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '3rem 1rem', textAlign: 'center' }}>
              <Package size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Nenhum produto ou serviço registado</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Cadastre os itens para apresentar ao ecossistema ABN.</p>
              <button onClick={() => setModalType('product')} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                + Registar Primeira Oferta
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {business.productsAndServices.map((item: ProductService, idx: number) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '6px', background: item.type === 'produto' ? '#e0f2fe' : '#fef3c7', color: item.type === 'produto' ? '#0369a1' : '#b45309' }}>
                        {item.type}
                      </span>
                      <button onClick={() => handleRemoveProduct(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Remover">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#0f172a' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>{item.description}</p>
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Preço / Modelo:</span>
                    <span style={{ fontWeight: 800, color: '#ff6b00', fontSize: '0.95rem' }}>{item.price || 'Sob Consulta'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         3. ABA: CLIENTES & CRM
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'clientes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit' }}>Carteira de Clientes</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Acompanhe o funil de vendas, contratos e clientes chave.</p>
            </div>
            <button
              onClick={() => setModalType('client')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus size={16} /> Adicionar Cliente
            </button>
          </div>

          {(!business?.clients || business.clients.length === 0) ? (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '3rem 1rem', textAlign: 'center' }}>
              <Users size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Nenhum cliente cadastrado</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Cadastre os seus primeiros clientes ou oportunidades em negociação.</p>
              <button onClick={() => setModalType('client')} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                + Registar Cliente
              </button>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Nome</th>
                    <th style={{ padding: '12px 16px' }}>Empresa</th>
                    <th style={{ padding: '12px 16px' }}>Contacto</th>
                    <th style={{ padding: '12px 16px' }}>Valor</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {business.clients.map((c: Client, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{c.name}</td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{c.company || '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{c.contact || '—'}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#16a34a' }}>{c.value || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: c.status === 'ativo' ? '#dcfce7' : c.status === 'em_negociacao' ? '#fef3c7' : '#f1f5f9', color: c.status === 'ativo' ? '#15803d' : c.status === 'em_negociacao' ? '#b45309' : '#475569' }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button onClick={() => handleRemoveClient(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         4. ABA: FORNECEDORES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'fornecedores' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit' }}>Fornecedores &amp; Parceiros</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Gira contratos de suprimentos, matéria-prima e tecnologia.</p>
            </div>
            <button
              onClick={() => setModalType('supplier')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus size={16} /> Adicionar Fornecedor
            </button>
          </div>

          {(!business?.suppliers || business.suppliers.length === 0) ? (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '3rem 1rem', textAlign: 'center' }}>
              <Truck size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Nenhum fornecedor registado</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Cadastre fornecedores chave para manter os termos e contactos organizados.</p>
              <button onClick={() => setModalType('supplier')} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                + Registar Fornecedor
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {business.suppliers.map((s: Supplier, idx: number) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#0f172a', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                      {s.category || 'Geral'}
                    </span>
                    <button onClick={() => handleRemoveSupplier(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#0f172a' }}>{s.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 8px 0' }}>Contacto: {s.contact || 'Não informado'}</p>
                  <div style={{ fontSize: '0.78rem', color: '#475569', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px' }}>
                    Termos: {s.terms || 'Padrão'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         5. ABA: EQUIPA
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'equipa' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit' }}>Equipa do Negócio</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Sócios, executivos e talentos fundamentais da empresa.</p>
            </div>
            <button
              onClick={() => setModalType('team')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus size={16} /> Adicionar Membro
            </button>
          </div>

          {(!business?.team || business.team.length === 0) ? (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '3rem 1rem', textAlign: 'center' }}>
              <Briefcase size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Equipa ainda não cadastrada</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Apresente os co-fundadores e talentos da sua organização.</p>
              <button onClick={() => setModalType('team')} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                + Adicionar Primeiro Membro
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {business.team.map((m: TeamMember, idx: number) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>{m.name}</h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#ff6b00', fontWeight: 700 }}>{m.role || 'Membro'}</p>
                    {m.email && <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>{m.email}</p>}
                  </div>
                  <button onClick={() => handleRemoveTeamMember(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', position: 'absolute', top: '12px', right: '12px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         6. ABA: METAS & OKRS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'metas' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit' }}>Metas &amp; Objetivos Estratégicos</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Acompanhe metas de tração, captação, produto e equipa.</p>
            </div>
            <button
              onClick={() => setModalType('goal')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus size={16} /> Criar Nova Meta
            </button>
          </div>

          {(!business?.goals || business.goals.length === 0) ? (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '3rem 1rem', textAlign: 'center' }}>
              <Target size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Nenhuma meta definida</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Empresas com metas claras crescem 3x mais rápido no ecossistema.</p>
              <button onClick={() => setModalType('goal')} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                + Estabelecer Meta
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {business.goals.map((g: Goal, idx: number) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.74rem', background: '#f1f5f9', color: '#0f172a', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                        {g.category}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#0f172a' }}>{g.title}</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Prazo: {g.targetDate || 'A definir'}</span>
                      <button onClick={() => handleRemoveGoal(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${g.progress}%`, height: '100%', background: g.progress >= 100 ? '#10b981' : '#ff6b00', borderRadius: '4px' }} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', width: '45px', textAlign: 'right' }}>
                      {g.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         7. ABA: DOCUMENTOS DO NEGÓCIO
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'documentos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 2px 0', fontFamily: 'Outfit' }}>Documentação &amp; Data Room</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Centralize Pitch Decks, certidões comerciais e demonstrações financeiras.</p>
            </div>
            <button
              onClick={() => setModalType('document')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus size={16} /> Adicionar Documento
            </button>
          </div>

          {(!business?.documents || business.documents.length === 0) ? (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '3rem 1rem', textAlign: 'center' }}>
              <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Nenhum documento anexado</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Anexe o Pitch Deck da empresa para partilhar com investidores.</p>
              <button onClick={() => setModalType('document')} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                + Anexar Pitch Deck
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {business.documents.map((d: BusinessDocument, idx: number) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#0f172a', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                        {d.category}
                      </span>
                      <button onClick={() => handleRemoveDocument(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.98rem', color: '#0f172a' }}>{d.title}</h4>
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <a
                      href={d.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#ff6b00', fontWeight: 700, textDecoration: 'none' }}
                    >
                      Ver Ficheiro <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: EDITAR NEGÓCIO
      ───────────────────────────────────────────────────────────── */}
      {modalType === 'business' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '550px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Editar Dados do Negócio</h3>
            <form onSubmit={handleSaveBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Nome do Negócio *</label>
                <input type="text" value={bizName} onChange={e => setBizName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Categoria / Sector *</label>
                <input type="text" value={bizCategory} onChange={e => setBizCategory(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Website Oficial</label>
                  <input type="url" value={bizWebsite} onChange={e => setBizWebsite(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Fase de Incubação</label>
                  <select value={bizPhase} onChange={e => setBizPhase(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="Ideação">Ideação</option>
                    <option value="Validação">Validação</option>
                    <option value="Mínimo Produto Viável (MVP)">Mínimo Produto Viável (MVP)</option>
                    <option value="Tração & Escala">Tração & Escala</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Localização / Sede</label>
                <input type="text" value={bizLocation} onChange={e => setBizLocation(e.target.value)} placeholder="Ex: Luanda, Angola" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Descrição Executiva &amp; Missão</label>
                <textarea rows={3} value={bizDesc} onChange={e => setBizDesc(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-outline" style={{ padding: '10px 18px' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>
                  {saving ? 'A guardar...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: ADICIONAR PRODUTO/SERVIÇO
      ───────────────────────────────────────────────────────────── */}
      {modalType === 'product' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Adicionar Produto ou Serviço</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Nome do Item *</label>
                <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Tipo</label>
                  <select value={prodType} onChange={e => setProdType(e.target.value as any)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="produto">Produto Físico / Digital</option>
                    <option value="servico">Serviço / Consultoria</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Preço Estimado</label>
                  <input type="text" value={prodPrice} onChange={e => setProdPrice(e.target.value)} placeholder="Ex: 50.000 Kz" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Descrição da Proposta de Valor</label>
                <textarea rows={3} value={prodDesc} onChange={e => setProdDesc(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-outline" style={{ padding: '10px 18px' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>
                  {saving ? 'A adicionar...' : 'Salvar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: ADICIONAR CLIENTE
      ───────────────────────────────────────────────────────────── */}
      {modalType === 'client' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Registar Cliente / Lead</h3>
            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Nome do Cliente *</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Empresa</label>
                  <input type="text" value={clientCompany} onChange={e => setClientCompany(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Contacto (Email/Tel)</label>
                  <input type="text" value={clientContact} onChange={e => setClientContact(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Status</label>
                  <select value={clientStatus} onChange={e => setClientStatus(e.target.value as any)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="lead">Lead / Prospeção</option>
                    <option value="em_negociacao">Em Negociação</option>
                    <option value="ativo">Cliente Ativo</option>
                    <option value="concluido">Contrato Concluído</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Valor do Contrato</label>
                  <input type="text" value={clientValue} onChange={e => setClientValue(e.target.value)} placeholder="Ex: 250.000 Kz" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-outline" style={{ padding: '10px 18px' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>
                  {saving ? 'A guardar...' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: ADICIONAR FORNECEDOR
      ───────────────────────────────────────────────────────────── */}
      {modalType === 'supplier' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Registar Fornecedor</h3>
            <form onSubmit={handleAddSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Nome do Fornecedor *</label>
                <input type="text" value={suppName} onChange={e => setSuppName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Categoria</label>
                  <input type="text" value={suppCategory} onChange={e => setSuppCategory(e.target.value)} placeholder="Ex: Logística, TI, Matéria-prima" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Contacto</label>
                  <input type="text" value={suppContact} onChange={e => setSuppContact(e.target.value)} placeholder="Email ou Telefone" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Termos &amp; Prazos de Pagamento</label>
                <input type="text" value={suppTerms} onChange={e => setSuppTerms(e.target.value)} placeholder="Ex: 30 dias após entrega" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-outline" style={{ padding: '10px 18px' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>
                  {saving ? 'A guardar...' : 'Salvar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: ADICIONAR MEMBRO DA EQUIPA
      ───────────────────────────────────────────────────────────── */}
      {modalType === 'team' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Adicionar Membro à Equipa</h3>
            <form onSubmit={handleAddTeamMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Nome Completo *</label>
                <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Cargo / Função *</label>
                <input type="text" value={teamRole} onChange={e => setTeamRole(e.target.value)} placeholder="Ex: Co-Fundador & CTO" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>E-mail</label>
                  <input type="email" value={teamEmail} onChange={e => setTeamEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>LinkedIn</label>
                  <input type="url" value={teamLinkedin} onChange={e => setTeamLinkedin(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-outline" style={{ padding: '10px 18px' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>
                  {saving ? 'A adicionar...' : 'Salvar Membro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: ADICIONAR META
      ───────────────────────────────────────────────────────────── */}
      {modalType === 'goal' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Estabelecer Nova Meta</h3>
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Título da Meta *</label>
                <input type="text" value={goalTitle} onChange={e => setGoalTitle(e.target.value)} placeholder="Ex: Atingir 1.000 utilizadores ativos" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Categoria</label>
                  <select value={goalCategory} onChange={e => setGoalCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="Vendas & Crescimento">Vendas &amp; Crescimento</option>
                    <option value="Desenvolvimento de Produto">Desenvolvimento de Produto</option>
                    <option value="Captação de Investimento">Captação de Investimento</option>
                    <option value="Equipa & Operações">Equipa &amp; Operações</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Prazo Estimado</label>
                  <input type="date" value={goalDate} onChange={e => setGoalDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Progresso Atual ({goalProgress}%)</label>
                <input type="range" min={0} max={100} value={goalProgress} onChange={e => setGoalProgress(Number(e.target.value))} style={{ width: '100%', accentColor: '#ff6b00' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-outline" style={{ padding: '10px 18px' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>
                  {saving ? 'A guardar...' : 'Salvar Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         MODAL: ADICIONAR DOCUMENTO
      ───────────────────────────────────────────────────────────── */}
      {modalType === 'document' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontFamily: 'Outfit' }}>Anexar Documento ao Data Room</h3>
            <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Título do Documento *</label>
                <input type="text" value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Ex: Pitch Deck 2026 - Q3" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Categoria</label>
                <select value={docCategory} onChange={e => setDocCategory(e.target.value as any)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="pitch_deck">Pitch Deck Oficial</option>
                  <option value="financeiro">Demonstrações Financeiras</option>
                  <option value="legal">Certidão Comercial &amp; Estatutos</option>
                  <option value="licenca">Licença / Alvará</option>
                  <option value="outro">Outro Documento</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Ficheiro (Upload ou URL)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <input type="text" value={docUrl} onChange={e => setDocUrl(e.target.value)} placeholder="URL do ficheiro ou carregue abaixo" required style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  <label style={{ padding: '10px 14px', background: '#0f172a', color: '#ffffff', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                    {uploadingDoc ? 'A enviar...' : 'Subir'}
                    <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-outline" style={{ padding: '10px 18px' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>
                  {saving ? 'A guardar...' : 'Anexar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
