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
  const [articles, setArticles] = useState([
    {
      type: 'news',
      location: 'Moçambique',
      title: 'Orange Corners Moçambique: Dia do Embaixador',
      date: '02/06/2026',
      desc: 'Nossos embaixadores estudantis desempenham um papel fundamental na conexão do Orange Corners com estudantes universitários, inspirando curiosidade...',
      img: '/articles/ambassador-day.png'
    },
    {
      type: 'photos',
      location: 'Moçambique',
      title: 'Fotos do Orange Corners Moçambique: Gala do Empreendedorismo',
      date: '28/11/2025',
      desc: 'No início deste mês, o Orange Corners Entrepreneurship Gala, em Moçambique, reuniu ex-alunos de todo o país...',
      img: '/articles/gala.png'
    },
    {
      type: 'article',
      location: 'Moçambique',
      title: 'Nilza Mazive e Xiphefu: energia inteligente para impulsionar o futuro de Moçambique',
      date: '25/08/2025',
      desc: 'Num país onde apenas cerca de 40% da população tem acesso à eletricidade, poupar energia...',
      img: '/articles/nilza.png'
    }
  ]);
  
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
          if (data.configs.articles_content) setArticles(data.configs.articles_content);
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
                      <img src={p.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>{p.logo || '🤝'}</span>
                    )}
                  </div>
                  <div className={styles.logoInputWrapper}>
                    <input 
                      value={p.logo} 
                      onChange={e => updateArrayField(setPartners, partners, index, 'logo', e.target.value)} 
                      placeholder="Logo (Emoji, URL ou Upload)" 
                      className={styles.inputSmall} 
                    />
                    <label className={styles.uploadLabel} title="Carregar Logotipo">
                      📁
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          updateArrayField(setPartners, partners, index, 'logo', '⏳ Carregando...');
                          
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await res.json();
                            if (data.success && data.url) {
                              updateArrayField(setPartners, partners, index, 'logo', data.url);
                            } else {
                              updateArrayField(setPartners, partners, index, 'logo', '🤝');
                              alert('Erro ao fazer upload: ' + (data.error || 'Erro desconhecido'));
                            }
                          } catch (err) {
                            updateArrayField(setPartners, partners, index, 'logo', '🤝');
                            alert('Erro na conexão para upload.');
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
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
            {(testimonials || []).map((t, index) => (
              <div key={index} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <div className={styles.avatarPreview}>
                    {t.img ? (
                      <img src={t.img} alt="Avatar" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className={styles.row}>
                      <input 
                        value={t.name} 
                        onChange={e => updateArrayField(setTestimonials, testimonials, index, 'name', e.target.value)} 
                        placeholder="Nome Completo" 
                        className={styles.inputFlex}
                      />
                      <input 
                        value={t.role} 
                        onChange={e => updateArrayField(setTestimonials, testimonials, index, 'role', e.target.value)} 
                        placeholder="Cargo ou Empresa" 
                        className={styles.inputFlex}
                      />
                      <button className={styles.removeBtn} onClick={() => removeItem(setTestimonials, testimonials, index)}>×</button>
                    </div>
                    <input 
                      value={t.img} 
                      onChange={e => updateArrayField(setTestimonials, testimonials, index, 'img', e.target.value)} 
                      placeholder="URL da Imagem de Perfil (ex: /Perfil04.jpg)" 
                    />
                  </div>
                </div>
                <textarea 
                  value={t.text} 
                  onChange={e => updateArrayField(setTestimonials, testimonials, index, 'text', e.target.value)} 
                  placeholder="O que esta pessoa diz sobre a ABN?" 
                  rows={3} 
                />
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

        {/* Articles Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Notícias & Artigos (Inspiração Orange Corners)</h3>
          <div className={styles.listGrid}>
            {(articles || []).map((art, index) => (
              <div key={index} className={styles.itemEditFull}>
                {/* Clean Header with visible Delete Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>ARTIGO #{index + 1}</span>
                  <button 
                    onClick={() => removeItem(setArticles, articles, index)}
                    style={{ 
                      background: 'rgba(231,76,60,0.15)', 
                      color: '#ff4d4d', 
                      border: '1px solid rgba(231,76,60,0.3)', 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e74c3c';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(231,76,60,0.15)';
                      e.currentTarget.style.color = '#ff4d4d';
                    }}
                  >
                    🗑️ Remover Artigo
                  </button>
                </div>

                <div className={styles.row}>
                  <div className={styles.avatarPreview} style={{ width: '90px', height: '90px', borderRadius: '12px' }}>
                    {art.img ? (
                      <img src={art.img} alt="Artigo Preview" />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>📰</span>
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className={styles.row}>
                      <div className={styles.field} style={{ flex: 1, minWidth: '120px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>TIPO</label>
                        <select 
                          value={art.type} 
                          onChange={e => updateArrayField(setArticles, articles, index, 'type', e.target.value)} 
                          style={{ width: '100%' }}
                        >
                          <option value="news">Notícias</option>
                          <option value="photos">Fotos</option>
                          <option value="article">Artigo</option>
                        </select>
                      </div>
                      <div className={styles.field} style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>LOCAL / PAÍS</label>
                        <input 
                          value={art.location} 
                          onChange={e => updateArrayField(setArticles, articles, index, 'location', e.target.value)} 
                          placeholder="Ex: Moçambique" 
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className={styles.field} style={{ flex: 1, minWidth: '120px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>DATA</label>
                        <input 
                          value={art.date} 
                          onChange={e => updateArrayField(setArticles, articles, index, 'date', e.target.value)} 
                          placeholder="Ex: 02/06/2026" 
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>IMAGEM (URL OU UPLOAD)</label>
                      <div className={styles.logoInputWrapper}>
                        <input 
                          value={art.img} 
                          onChange={e => updateArrayField(setArticles, articles, index, 'img', e.target.value)} 
                          placeholder="URL da Imagem" 
                          style={{ flex: 1 }}
                        />
                        <label className={styles.uploadLabel} title="Carregar imagem">
                          📁
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              updateArrayField(setArticles, articles, index, 'img', '⏳ Carregando...');
                              
                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData,
                                });
                                const data = await res.json();
                                if (data.success && data.url) {
                                  updateArrayField(setArticles, articles, index, 'img', data.url);
                                } else {
                                  updateArrayField(setArticles, articles, index, 'img', '');
                                  alert('Erro ao fazer upload: ' + (data.error || 'Erro desconhecido'));
                                }
                              } catch (err) {
                                updateArrayField(setArticles, articles, index, 'img', '');
                                  alert('Erro na conexão para upload.');
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.field} style={{ marginTop: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>TÍTULO</label>
                  <input 
                    value={art.title} 
                    onChange={e => updateArrayField(setArticles, articles, index, 'title', e.target.value)} 
                    placeholder="Título do artigo" 
                  />
                </div>

                <div className={styles.field}>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>RESUMO / SNIPPET</label>
                  <textarea 
                    value={art.desc} 
                    onChange={e => updateArrayField(setArticles, articles, index, 'desc', e.target.value)} 
                    placeholder="Resumo do texto..." 
                    rows={3} 
                  />
                </div>
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setArticles, articles, { type: 'news', location: '', title: '', date: '', desc: '', img: '' })}>+ Adicionar Artigo</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('articles_content', articles)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Artigos'}
          </button>
        </section>
      </div>
    </div>
  );
}
