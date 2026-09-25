'use client';

import { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Store, 
  User, 
  Phone, 
  Mail, 
  Plus, 
  Edit3, 
  Trash2,
  ExternalLink,
  Tag,
  AlertCircle
} from 'lucide-react';
import styles from './Loja.module.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: string;
  stock: number;
  digital: boolean;
  downloadUrl: string;
  order: number;
  sellerBusiness?: string;
}

interface Submission {
  businessId: string;
  businessName: string;
  businessCategory: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  itemId: string;
  name: string;
  description: string;
  price: string;
  type: string;
  image: string;
  active: boolean;
  storeApproval: 'pendente' | 'aprovado' | 'rejeitado';
  approvalNotes: string;
}

export default function AdminLojaPage() {
  const [activeTab, setActiveTab] = useState<'produtos' | 'moderacao'>('moderacao');
  const [products, setProducts] = useState<Product[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('ativo');
  const [stock, setStock] = useState(0);
  const [digital, setDigital] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchSubmissions();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products?status=todos')
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchSubmissions = () => {
    fetch('/api/admin/store-moderation')
      .then(res => res.json())
      .then(data => {
        if (data.submissions) setSubmissions(data.submissions);
      })
      .catch(err => console.error(err));
  };

  const handleModerate = async (businessId: string, itemId: string, action: 'aprovar' | 'rejeitar') => {
    let notes = '';
    if (action === 'rejeitar') {
      const inputNotes = prompt('Motivo da rejeição (opcional):');
      if (inputNotes === null) return; // cancelou
      notes = inputNotes;
    }

    setActionLoading(itemId);
    try {
      const res = await fetch('/api/admin/store-moderation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, itemId, action, notes })
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`✅ Produto ${action === 'aprovar' ? 'aprovado e publicado na loja' : 'rejeitado'}!`);
        setTimeout(() => setMsg(''), 4000);
        fetchSubmissions();
        fetchProducts();
      } else {
        alert(data.error || 'Erro ao processar moderação.');
      }
    } catch {
      alert('Erro de conexão ao moderar produto.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setImage(product.image);
    setStatus(product.status);
    setStock(product.stock);
    setDigital(product.digital);
    setDownloadUrl(product.downloadUrl);
    setOrder(product.order);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice(0);
    setCategory('');
    setImage('');
    setStatus('ativo');
    setStock(0);
    setDigital(false);
    setDownloadUrl('');
    setOrder(products.length);
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
    if (!name.trim() || !description.trim() || !category.trim()) {
      alert('Nome, descrição e categoria são obrigatórios.');
      return;
    }

    setSaving(true);
    const payload = {
      name,
      description,
      price,
      category,
      image,
      status,
      stock,
      digital,
      downloadUrl,
      order,
    };

    try {
      const url = '/api/products';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const data = await res.json();

      if (data.success) {
        setMsg(editingId ? '✅ Produto atualizado!' : '✅ Produto criado!');
        setTimeout(() => setMsg(''), 3000);
        setShowForm(false);
        fetchProducts();
      } else {
        alert(data.error || 'Erro ao guardar produto.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja remover este produto?')) return;
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setMsg('🗑️ Produto removido com sucesso!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(data.error || 'Erro ao remover produto.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro de rede.');
    }
  };

  const pendingSubmissions = submissions.filter(s => s.storeApproval === 'pendente');

  return (
    <div className={styles.page}>
      {/* Cabeçalho */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão da Loja ABN</h1>
          <p className={styles.subtitle}>
            {products.length} produtos registados · {pendingSubmissions.length} submissões aguardando moderação
          </p>
        </div>
        <button 
          className={`btn-primary ${styles.addBtn}`} 
          onClick={() => {
            setActiveTab('produtos');
            showForm ? setShowForm(false) : handleCreateClick();
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Novo Produto Direto'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {/* Abas Superiores de Gestão */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('moderacao')}
          style={{
            background: activeTab === 'moderacao' ? '#de9b35' : 'rgba(255,255,255,0.06)',
            color: activeTab === 'moderacao' ? '#111418' : '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <Clock size={16} />
          Moderação de Empreendedores
          {pendingSubmissions.length > 0 && (
            <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.72rem', padding: '2px 7px', borderRadius: '999px', fontWeight: 900 }}>
              {pendingSubmissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('produtos')}
          style={{
            background: activeTab === 'produtos' ? '#de9b35' : 'rgba(255,255,255,0.06)',
            color: activeTab === 'produtos' ? '#111418' : '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <ShoppingBag size={16} />
          Produtos na Loja ({products.length})
        </button>
      </div>

      {/* ABA 1: MODERAÇÃO DE PRODUTOS DE EMPREENDEDORES */}
      {activeTab === 'moderacao' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff', fontFamily: 'Outfit', margin: '0 0 6px' }}>
              Fila de Aprovação de Produtos e Serviços
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', margin: 0 }}>
              Avalie as ofertas cadastradas por empreendedores no Dashboard antes de irem para a Loja Oficial ABN.
            </p>
          </div>

          {submissions.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '20px', padding: '4rem 2rem', textAlign: 'center' }}>
              <CheckCircle2 size={44} style={{ color: '#22c55e', margin: '0 auto 1rem' }} />
              <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Tudo em dia!</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Nenhum produto submetido por empreendedores aguardando análise no momento.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {submissions.map((sub, idx) => {
                const isPending = sub.storeApproval === 'pendente';
                const isApproved = sub.storeApproval === 'aprovado';
                const isRejected = sub.storeApproval === 'rejeitado';

                return (
                  <div 
                    key={idx} 
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: isPending ? '1.5px solid #de9b35' : '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '18px', 
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Imagem do Item */}
                    <div style={{ width: '100%', height: '140px', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                      {sub.image ? (
                        <img src={sub.image} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                          <ShoppingBag size={48} />
                        </div>
                      )}
                      <span 
                        style={{ 
                          position: 'absolute', 
                          top: '10px', 
                          right: '10px', 
                          padding: '3px 10px', 
                          borderRadius: '8px', 
                          fontSize: '0.72rem', 
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          background: isApproved ? '#16a34a' : isRejected ? '#dc2626' : '#de9b35',
                          color: isPending ? '#111418' : '#ffffff'
                        }}
                      >
                        {sub.storeApproval}
                      </span>
                    </div>

                    {/* Conteúdo */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Dados do Vendedor */}
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#de9b35', marginBottom: '4px' }}>
                          <Store size={14} />
                          <span>{sub.businessName}</span> ({sub.businessCategory})
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={13} /> {sub.ownerName}
                        </div>
                        {sub.ownerPhone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <Phone size={13} /> {sub.ownerPhone}
                          </div>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '0 0 6px', fontFamily: 'Outfit' }}>{sub.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45, marginBottom: '1rem', flex: 1 }}>
                        {sub.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Preço Proposto:</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#de9b35' }}>{sub.price}</span>
                      </div>

                      {/* Botões de Ação de Moderação */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                          onClick={() => handleModerate(sub.businessId, sub.itemId, 'aprovar')}
                          disabled={actionLoading === sub.itemId || isApproved}
                          style={{
                            background: isApproved ? 'rgba(34, 197, 94, 0.2)' : '#22c55e',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '9px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: isApproved ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <CheckCircle2 size={15} />
                          {isApproved ? 'Aprovado' : 'Aprovar'}
                        </button>

                        <button
                          onClick={() => handleModerate(sub.businessId, sub.itemId, 'rejeitar')}
                          disabled={actionLoading === sub.itemId || isRejected}
                          style={{
                            background: isRejected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.85)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '9px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: isRejected ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <XCircle size={15} />
                          {isRejected ? 'Rejeitado' : 'Rejeitar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: PRODUTOS OFICIAIS E CADASTRO DIRETO */}
      {activeTab === 'produtos' && (
        <div>
          {showForm && (
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.formHeader}>
                <h3>{editingId ? `Editar: ${name}` : 'Adicionar Novo Produto Oficial'}</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Nome do Produto *</label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Curso de Marketing Digital"
                  />
                </div>
                <div className={styles.field}>
                  <label>Categoria *</label>
                  <input
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="Ex: Formações, Serviços, Produtos, Eventos"
                  />
                </div>
                <div className={styles.field}>
                  <label>Preço (MT) *</label>
                  <input
                    required
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    placeholder="Ex: 5000"
                  />
                </div>
                <div className={styles.field}>
                  <label>Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    placeholder="Quantidade em stock (0 para ilimitado)"
                  />
                </div>
                <div className={styles.field}>
                  <label>Ordem de Exibição</label>
                  <input
                    type="number"
                    value={order}
                    onChange={e => setOrder(Number(e.target.value))}
                  />
                </div>
                <div className={styles.field}>
                  <label>Estado</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="ativo">Ativo (Visível na Loja)</option>
                    <option value="inativo">Inativo (Oculto)</option>
                    <option value="pendente">Pendente de Revisão</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Produto Digital</label>
                  <select value={digital ? 'sim' : 'nao'} onChange={e => setDigital(e.target.value === 'sim')}>
                    <option value="nao">Não (Físico / Serviço)</option>
                    <option value="sim">Sim (Download)</option>
                  </select>
                </div>
                {digital && (
                  <div className={styles.field}>
                    <label>URL de Download</label>
                    <input
                      value={downloadUrl}
                      onChange={e => setDownloadUrl(e.target.value)}
                      placeholder="URL do arquivo para download"
                    />
                  </div>
                )}
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Descrição *</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Descreva o produto em detalhe..."
                  />
                </div>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Imagem do Produto (URL ou Upload)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      value={image}
                      onChange={e => setImage(e.target.value)}
                      placeholder="URL da imagem do produto"
                      style={{ flex: 1 }}
                    />
                    <label style={{ cursor: 'pointer', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                      {uploadingImage ? '⏳...' : '📁 Subir Imagem'}
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
                      <img src={image} alt="Preview Imagem" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'A guardar...' : 'Guardar Produto'}
                </button>
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>A carregar produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <span style={{ fontSize: '3rem' }}>📦</span>
              <p>Nenhum produto na loja.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map(product => (
                <div key={product._id} className={`${styles.card} glass`}>
                  <div className={styles.cardImage}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className={styles.placeholder}>📦</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={styles.category}>{product.category}</span>
                      <span 
                        className={styles.status} 
                        style={{ 
                          color: product.status === 'ativo' || product.status === 'aprovado' ? '#2e8b57' : '#e74c3c' 
                        }}
                      >
                        {product.status}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    {product.sellerBusiness && (
                      <div style={{ fontSize: '0.75rem', color: '#de9b35', marginBottom: '6px', fontWeight: 700 }}>
                        Vendido por: {product.sellerBusiness}
                      </div>
                    )}
                    <p className={styles.cardDesc}>{product.description.slice(0, 100)}...</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.price}>{product.price.toLocaleString()} MT</span>
                      <span className={styles.stock}>Stock: {product.stock === 0 ? 'Ilimitado' : product.stock}</span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.editBtn} onClick={() => handleEditClick(product)}>
                      ✏️ Editar
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(product._id)}>
                      🗑️ Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}