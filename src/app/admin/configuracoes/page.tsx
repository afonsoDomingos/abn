'use client';

import { useEffect, useState } from 'react';
import styles from './Config.module.css';

export default function AdminConfigPage() {
  const [hero, setHero] = useState({ title: '', description: '', banners: [] as string[] });
  const [stats, setStats] = useState([{ label: '', value: '' }]);
  const [logo, setLogo] = useState('/abn-logo.png');
  const [partners, setPartners] = useState([{ name: '', logo: '' }]);
  const [features, setFeatures] = useState([{ title: '', desc: '', icon: '' }]);
  const [howItWorks, setHowItWorks] = useState([{ number: '', title: '', description: '' }]);
  const [testimonials, setTestimonials] = useState([{ name: '', role: '', text: '', img: '' }]);
  const [faq, setFaq] = useState([{ question: '', answer: '' }]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs) {
          if (data.configs.hero_content) setHero(data.configs.hero_content);
          if (data.configs.stats_content) setStats(data.configs.stats_content);
          if (data.configs.platform_logo) setLogo(data.configs.platform_logo);
          if (data.configs.partners_content) setPartners(data.configs.partners_content);
          if (data.configs.features_content) setFeatures(data.configs.features_content);
          if (data.configs.how_it_works_content) setHowItWorks(data.configs.how_it_works_content);
          if (data.configs.testimonials_content) setTestimonials(data.configs.testimonials_content);
          if (data.configs.faq_content) setFaq(data.configs.faq_content);
        }
        setLoading(false);
      });
  }, []);

  const saveConfig = async (key: string, value: any) => {
    setSaving(true);
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) {
      setMsg(`✅ Configuração atualizada com sucesso!`);
      setTimeout(() => setMsg(''), 3000);
    }
    setSaving(false);
  };

  const updateArrayField = (setter: any, array: any[], index: number, field: string, val: string) => {
    const newArr = [...array];
    newArr[index] = { ...newArr[index], [field]: val };
    setter(newArr);
  };

  const addItem = (setter: any, array: any[], defaultObj: any) => {
    setter([...array, defaultObj]);
  };

  const removeItem = (setter: any, array: any[], index: number) => {
    setter(array.filter((_, i) => i !== index));
  };

  if (loading) return <div className={styles.loading}><div className={styles.spinner}></div></div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-gradient-gold">Configurações da Plataforma</h1>
        <p>Edite os textos principais, funcionalidades e testemunhos da Home.</p>
      </header>

      {msg && <div className={styles.toast}>{msg}</div>}

      <div className={styles.grid}>
        {/* Logo Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Logo da Plataforma</h3>
          <div className={styles.form}>
            <div className={styles.field}>
              <label>URL do Logo</label>
              <input 
                value={logo} 
                onChange={e => setLogo(e.target.value)}
                placeholder="/abn-logo.png"
              />
            </div>
            <div className={styles.logoPreview}>
              <img src={logo} alt="Preview" style={{ height: '50px' }} />
            </div>
            <button className="btn-primary" onClick={() => saveConfig('platform_logo', logo)} disabled={saving}>
              {saving ? 'A guardar...' : 'Atualizar Logo'}
            </button>
          </div>
        </section>

        {/* Hero Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Seção Hero (Início)</h3>
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Título Principal</label>
              <input 
                value={hero.title} 
                onChange={e => setHero({ ...hero, title: e.target.value })}
                placeholder="Ex: Impulsionando Startups..."
              />
            </div>
            <div className={styles.field}>
              <label>Descrição</label>
              <textarea 
                rows={4}
                value={hero.description} 
                onChange={e => setHero({ ...hero, description: e.target.value })}
                placeholder="Descreva a missão da ABN..."
              />
            </div>
            <div className={styles.field}>
              <label>Banners do Fundo (URLs)</label>
              <div className={styles.listGrid}>
                {(hero.banners || []).map((banner, idx) => (
                  <div key={idx} className={styles.itemEditFull}>
                    <div className={styles.row}>
                      <input 
                        value={banner} 
                        onChange={e => {
                          const newBanners = [...(hero.banners || [])];
                          newBanners[idx] = e.target.value;
                          setHero({ ...hero, banners: newBanners });
                        }} 
                        placeholder="URL da imagem (ex: /Perfil01.jpg)"
                        style={{ flex: 1 }}
                      />
                      <button className={styles.removeBtn} onClick={() => {
                        const newBanners = (hero.banners || []).filter((_, i) => i !== idx);
                        setHero({ ...hero, banners: newBanners });
                      }}>×</button>
                    </div>
                    {banner && (
                      <div className={styles.bannerPreview}>
                        <img src={banner} alt={`Banner ${idx + 1}`} style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginTop: '5px' }} />
                      </div>
                    )}
                  </div>
                ))}
                <button className="btn-outline" onClick={() => setHero({ ...hero, banners: [...(hero.banners || []), ''] })}>
                  + Adicionar Imagem ao Banner
                </button>
              </div>
            </div>
            <button className="btn-primary" onClick={() => saveConfig('hero_content', hero)} disabled={saving}>
              {saving ? 'A guardar...' : 'Atualizar Hero'}
            </button>
          </div>
        </section>

        {/* Stats Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Estatísticas de Impacto</h3>
          <div className={styles.listGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.itemEdit}>
                <input value={stat.label} onChange={e => updateArrayField(setStats, stats, index, 'label', e.target.value)} placeholder="Rótulo" />
                <input value={stat.value} onChange={e => updateArrayField(setStats, stats, index, 'value', e.target.value)} placeholder="Valor" />
                <button className={styles.removeBtn} onClick={() => removeItem(setStats, stats, index)}>×</button>
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setStats, stats, { label: '', value: '' })}>+ Adicionar Estatística</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('stats_content', stats)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Estatísticas'}
          </button>
        </section>

        {/* Partners Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Parceiros Estratégicos</h3>
          <div className={styles.listGrid}>
            {(partners || []).map((p, index) => (
              <div key={index} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <div className={styles.partnerLogoPreview}>
                    {(p.logo && (p.logo.startsWith('http') || p.logo.startsWith('/'))) ? (
                      <img src={p.logo} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>{p.logo || '🤝'}</span>
                    )}
                  </div>
                  <input 
                    value={p.logo} 
                    onChange={e => updateArrayField(setPartners, partners, index, 'logo', e.target.value)} 
                    placeholder="Logo (Emoji ou URL)" 
                    style={{ width: '120px' }} 
                  />
                  <input 
                    value={p.name} 
                    onChange={e => updateArrayField(setPartners, partners, index, 'name', e.target.value)} 
                    placeholder="Nome do Parceiro" 
                    style={{ flex: 1 }}
                  />
                  <button className={styles.removeBtn} onClick={() => removeItem(setPartners, partners, index)}>×</button>
                </div>
                <input 
                  value={(p as any).url || ''} 
                  onChange={e => updateArrayField(setPartners, partners, index, 'url', e.target.value)} 
                  placeholder="Link do Parceiro (opcional - ex: https://exemplo.com)" 
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setPartners, partners, { name: '', logo: '🤝', url: '' })}>+ Adicionar Parceiro</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('partners_content', partners)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Parceiros'}
          </button>
        </section>

        {/* Features Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Funcionalidades (Nossas Soluções)</h3>
          <div className={styles.listGrid}>
            {features.map((f, index) => (
              <div key={index} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <input value={f.icon} onChange={e => updateArrayField(setFeatures, features, index, 'icon', e.target.value)} placeholder="Ícone (Emoji)" style={{ width: '60px' }} />
                  <input value={f.title} onChange={e => updateArrayField(setFeatures, features, index, 'title', e.target.value)} placeholder="Título" style={{ flex: 1 }} />
                  <button className={styles.removeBtn} onClick={() => removeItem(setFeatures, features, index)}>×</button>
                </div>
                <textarea value={f.desc} onChange={e => updateArrayField(setFeatures, features, index, 'desc', e.target.value)} placeholder="Descrição curta" rows={2} />
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setFeatures, features, { title: '', desc: '', icon: '🚀' })}>+ Adicionar Funcionalidade</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('features_content', features)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Funcionalidades'}
          </button>
        </section>

        {/* How It Works Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Como Funciona (Passos)</h3>
          <div className={styles.listGrid}>
            {howItWorks.map((step, index) => (
              <div key={index} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <input value={step.number} onChange={e => updateArrayField(setHowItWorks, howItWorks, index, 'number', e.target.value)} placeholder="01" style={{ width: '60px' }} />
                  <input value={step.title} onChange={e => updateArrayField(setHowItWorks, howItWorks, index, 'title', e.target.value)} placeholder="Título do Passo" style={{ flex: 1 }} />
                  <button className={styles.removeBtn} onClick={() => removeItem(setHowItWorks, howItWorks, index)}>×</button>
                </div>
                <textarea value={step.description} onChange={e => updateArrayField(setHowItWorks, howItWorks, index, 'description', e.target.value)} placeholder="O que acontece neste passo?" rows={2} />
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setHowItWorks, howItWorks, { number: '', title: '', description: '' })}>+ Adicionar Passo</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('how_it_works_content', howItWorks)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Passos'}
          </button>
        </section>

        {/* Testimonials Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Testemunhos</h3>
          <div className={styles.listGrid}>
            {testimonials.map((t, index) => (
              <div key={index} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <input value={t.name} onChange={e => updateArrayField(setTestimonials, testimonials, index, 'name', e.target.value)} placeholder="Nome" />
                  <input value={t.role} onChange={e => updateArrayField(setTestimonials, testimonials, index, 'role', e.target.value)} placeholder="Cargo/Empresa" />
                  <button className={styles.removeBtn} onClick={() => removeItem(setTestimonials, testimonials, index)}>×</button>
                </div>
                <input value={t.img} onChange={e => updateArrayField(setTestimonials, testimonials, index, 'img', e.target.value)} placeholder="URL da Imagem de Perfil" />
                <textarea value={t.text} onChange={e => updateArrayField(setTestimonials, testimonials, index, 'text', e.target.value)} placeholder="Depoimento" rows={3} />
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setTestimonials, testimonials, { name: '', role: '', text: '', img: '' })}>+ Adicionar Testemunho</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('testimonials_content', testimonials)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Testemunhos'}
          </button>
        </section>

        {/* FAQ Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Perguntas Frequentes (FAQ)</h3>
          <div className={styles.listGrid}>
            {faq.map((item, index) => (
              <div key={index} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <input value={item.question} onChange={e => updateArrayField(setFaq, faq, index, 'question', e.target.value)} placeholder="Pergunta" style={{ flex: 1 }} />
                  <button className={styles.removeBtn} onClick={() => removeItem(setFaq, faq, index)}>×</button>
                </div>
                <textarea value={item.answer} onChange={e => updateArrayField(setFaq, faq, index, 'answer', e.target.value)} placeholder="Resposta" rows={3} />
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setFaq, faq, { question: '', answer: '' })}>+ Adicionar FAQ</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('faq_content', faq)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar FAQ'}
          </button>
        </section>
      </div>
    </div>
  );
}
