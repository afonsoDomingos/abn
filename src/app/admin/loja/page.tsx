'use client';

import { useEffect, useState } from 'react';
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
}

export default function AdminLojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState('');

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
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products')
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
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(editingId ? '✅ Produto atualizado com sucesso!' : '✅ Produto criado com sucesso!');
        fetchProducts();
        setShowForm(false);
        setTimeout(() => setMsg(''), 3000);
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

  const statusColor: Record<string, string> = {
    ativo: '#2e8b57',
    inativo: '#e74c3c',
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-gradient-gold">Gestão da Loja ABN</h1>
          <p className={styles.subtitle}>{products.length} produtos na loja</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => showForm ? setShowForm(false) : handleCreateClick()}>
          {showForm ? '✕ Cancelar' : '+ Novo Produto'}
        </button>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h3>{editingId ? `Editar: ${name}` : 'Adicionar Novo Produto'}</h3>
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
                placeholder="Ex: Tecnologia, Marketing, Formação"
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
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Produto Digital</label>
              <select value={digital ? 'sim' : 'nao'} onChange={e => setDigital(e.target.value === 'sim')}>
                <option value="nao">Não (físico)</option>
                <option value="sim">Sim (download)</option>
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
                  <span className={styles.status} style={{ color: statusColor[product.status] }}>
                    {product.status}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{product.name}</h3>
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
  );
}