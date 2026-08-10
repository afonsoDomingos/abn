'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Config.module.css';

export default function AdminConfigPage() {
  const [hero, setHero] = useState({ title: '', description: '', banners: [] as string[] });
  const [paymentInfo, setPaymentInfo] = useState({
    titular: 'Lizi Cristina Mulambo',
    bim_conta: '5283397',
    bim_nib: '0001 000000005283397 57',
    moza_conta: '0087656640001',
    moza_nib: '0034 000008765664101 25',
    mpesa: '857670109',
    emola: '876687082'
  });
  const [stats, setStats] = useState([{ label: '', value: '' }]);
  const [logo, setLogo] = useState('/abn-logo.png');
  const [partners, setPartners] = useState([{ name: '', logo: '' }]);
  const [supportedCompanies, setSupportedCompanies] = useState([{ name: '', location: '', desc: '', icon: '', phase: '' }]);
  const [missionImages, setMissionImages] = useState<string[]>(['/mission_team.png']);
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
  const [team, setTeam] = useState([
    { name: '', role: '', country: '', linkedin: '', image: '', bio: '' }
  ]);
  const [pageBanners, setPageBanners] = useState({
    incubacao: '/hero_entrepreneurs.png',
    impacto: '/mission_team.png',
    eventos: '/articles/gala.png',
    noticias: '/articles/ambassador-day.png',
    galeria: '/partners_hero.png',
    oportunidades: '/articles/nilza.png',
    equipa: '/abn-cover.jpg',
    parceiros: '/partners_hero.png',
    marketplace: '/partners_hero.png',
    programas: '/hero_entrepreneurs.png',
    mensagem_presidente: '/abn-cover.jpg'
  });

  const [presidentMsg, setPresidentMsg] = useState({
    title: 'Seja muito bem-vindo(a) à AfroBiz Network (ABN)',
    authorName: 'Culpa Francisco Xavier Lissamo',
    authorRole: 'Presidente e Fundador',
    authorOrg: 'AfroBiz Network (ABN)',
    authorPhoto: '',
    cardBanner: '',
    quote: '"Conectando mentes, impulsionando negócios e transformando África e o Mundo."',
    paragraph1: 'Seja muito bem-vindo(a) à AfroBiz Network (ABN).',
    paragraph2: 'É com grande satisfação que o recebemos nesta plataforma, criada para ligar empreendedores, inovadores, investidores, profissionais e instituições que acreditam no potencial transformador de África.',
    paragraph3: 'Na ABN, acreditamos que o empreendedorismo é uma das maiores ferramentas para gerar oportunidades, criar riqueza, impulsionar a inovação e promover um desenvolvimento económico sustentável. A nossa missão é construir uma rede sólida de colaboração, onde ideias se transformam em negócios, talentos encontram oportunidades e parcerias geram impacto real.',
    paragraph4: 'Convidamo-lo a fazer parte desta comunidade dinâmica e visionária. Independentemente da fase em que o seu projecto ou negócio se encontre, encontrará na ABN um espaço de aprendizagem, networking, incubação, aceleração e crescimento.',
    paragraph5: 'Juntos, estamos a construir um ecossistema empresarial mais forte, inclusivo e competitivo, capaz de posicionar África como um continente de inovação, oportunidades e prosperidade.',
    paragraph6: 'Obrigado pela sua visita. Esperamos caminhar consigo nesta jornada de transformação.'
  });
  
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
          if (data.configs.supported_companies) setSupportedCompanies(data.configs.supported_companies);
          if (data.configs.mission_images) setMissionImages(data.configs.mission_images);
          if (data.configs.features_content) setFeatures(data.configs.features_content);
          if (data.configs.how_it_works_content) setHowItWorks(data.configs.how_it_works_content);
          if (data.configs.testimonials_content) setTestimonials(data.configs.testimonials_content);
          if (data.configs.faq_content) setFaq(data.configs.faq_content);
          if (data.configs.payment_info) setPaymentInfo(prev => ({ ...prev, ...data.configs.payment_info }));
          if (data.configs.articles_content) setArticles(data.configs.articles_content);
          if (data.configs.team_content) setTeam(data.configs.team_content);
          if (data.configs.president_message_content) {
            setPresidentMsg(prev => ({ ...prev, ...data.configs.president_message_content }));
          }
          if (data.configs.page_banners) {
            setPageBanners(prev => ({
              ...prev,
              ...data.configs.page_banners
            }));
          }
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
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="text-gradient-gold" style={{ margin: 0 }}>Configurações da Plataforma</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Edite os textos principais, funcionalidades e testemunhos da Home.</p>
        </div>
        <Link href="/" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', borderRadius: '12px', padding: '10px 20px', fontSize: '0.95rem' }}>
          🏠 Voltar ao Início
        </Link>
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

        {/* Mensagem do Presidente Config */}
        <section className={`glass ${styles.section}`}>
          <h3>📜 Mensagem do Presidente</h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1.5rem' }}>
            Edite o nome, cargo, foto, citação e texto completo da Mensagem do Presidente exibida no site.
          </p>
          <div className={styles.form}>
            <div className={styles.row} style={{ gap: '1rem' }}>
              <div className={styles.field} style={{ flex: 1 }}>
                <label>Nome do Autor / Presidente</label>
                <input 
                  value={presidentMsg.authorName} 
                  onChange={e => setPresidentMsg({ ...presidentMsg, authorName: e.target.value })}
                  placeholder="Ex: Culpa Francisco Xavier Lissamo"
                />
              </div>
              <div className={styles.field} style={{ flex: 1 }}>
                <label>Cargo / Título</label>
                <input 
                  value={presidentMsg.authorRole} 
                  onChange={e => setPresidentMsg({ ...presidentMsg, authorRole: e.target.value })}
                  placeholder="Ex: Presidente e Fundador"
                />
              </div>
            </div>

            <div className={styles.row} style={{ gap: '1rem', marginTop: '0.5rem' }}>
              <div className={styles.field} style={{ flex: 1 }}>
                <label>Organização</label>
                <input 
                  value={presidentMsg.authorOrg} 
                  onChange={e => setPresidentMsg({ ...presidentMsg, authorOrg: e.target.value })}
                  placeholder="Ex: AfroBiz Network (ABN)"
                />
              </div>
              <div className={styles.field} style={{ flex: 1 }}>
                <label>Foto Oficial (URL ou Upload)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    value={presidentMsg.authorPhoto} 
                    onChange={e => setPresidentMsg({ ...presidentMsg, authorPhoto: e.target.value })}
                    placeholder="URL ou selecione ficheiro"
                    style={{ flex: 1 }}
                  />
                  <label className={styles.uploadLabel} title="Carregar Foto" style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    📁
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        setMsg('⏳ A carregar foto do presidente...');
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const data = await res.json();
                          if (data.success && data.url) {
                            setPresidentMsg({ ...presidentMsg, authorPhoto: data.url });
                            setMsg('✅ Foto do presidente enviada!');
                          } else {
                            alert(data.error || 'Erro no upload.');
                          }
                        } catch (err) {
                          alert('Erro de conexão no upload.');
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Banner do Cartão (Capa de Fundo do Perfil - URL ou Upload)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  value={presidentMsg.cardBanner || ''} 
                  onChange={e => setPresidentMsg({ ...presidentMsg, cardBanner: e.target.value })}
                  placeholder="URL do banner do cartão ou selecione ficheiro"
                  style={{ flex: 1 }}
                />
                <label className={styles.uploadLabel} title="Carregar Banner do Cartão" style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  📁
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('file', file);
                      setMsg('⏳ A carregar banner do cartão...');
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        const data = await res.json();
                        if (data.success && data.url) {
                          setPresidentMsg({ ...presidentMsg, cardBanner: data.url });
                          setMsg('✅ Banner do cartão enviado!');
                        } else {
                          alert(data.error || 'Erro no upload.');
                        }
                      } catch (err) {
                        alert('Erro de conexão no upload.');
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Citação em Destaque (Frase Curta)</label>
              <input 
                value={presidentMsg.quote} 
                onChange={e => setPresidentMsg({ ...presidentMsg, quote: e.target.value })}
                placeholder='"Conectando mentes, impulsionando negócios..."'
              />
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Título da Mensagem</label>
              <input 
                value={presidentMsg.title} 
                onChange={e => setPresidentMsg({ ...presidentMsg, title: e.target.value })}
                placeholder="Ex: Seja muito bem-vindo(a) à AfroBiz Network..."
              />
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Parágrafo 1 (Boas-vindas)</label>
              <textarea 
                rows={2}
                value={presidentMsg.paragraph1} 
                onChange={e => setPresidentMsg({ ...presidentMsg, paragraph1: e.target.value })}
              />
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Parágrafo 2 (Introdução)</label>
              <textarea 
                rows={3}
                value={presidentMsg.paragraph2} 
                onChange={e => setPresidentMsg({ ...presidentMsg, paragraph2: e.target.value })}
              />
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Parágrafo 3 (Visão & Missão em Destaque)</label>
              <textarea 
                rows={4}
                value={presidentMsg.paragraph3} 
                onChange={e => setPresidentMsg({ ...presidentMsg, paragraph3: e.target.value })}
              />
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Parágrafo 4 (Convite à Comunidade)</label>
              <textarea 
                rows={3}
                value={presidentMsg.paragraph4} 
                onChange={e => setPresidentMsg({ ...presidentMsg, paragraph4: e.target.value })}
              />
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Parágrafo 5 (Impacto & África)</label>
              <textarea 
                rows={3}
                value={presidentMsg.paragraph5} 
                onChange={e => setPresidentMsg({ ...presidentMsg, paragraph5: e.target.value })}
              />
            </div>

            <div className={styles.field} style={{ marginTop: '0.5rem' }}>
              <label>Parágrafo 6 (Encerramento)</label>
              <textarea 
                rows={2}
                value={presidentMsg.paragraph6} 
                onChange={e => setPresidentMsg({ ...presidentMsg, paragraph6: e.target.value })}
              />
            </div>

            <button className="btn-primary" onClick={() => saveConfig('president_message_content', presidentMsg)} disabled={saving} style={{ marginTop: '1rem' }}>
              {saving ? 'A guardar...' : 'Atualizar Mensagem do Presidente'}
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
                      <div className={styles.logoInputWrapper} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
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
                        <label className={styles.uploadLabel} title="Carregar Imagem" style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {banner && banner.startsWith('⏳') ? (
                            <div className={styles.spinnerSmall}></div>
                          ) : (
                            '📁'
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              const newBanners = [...(hero.banners || [])];
                              newBanners[idx] = '⏳...';
                              setHero({ ...hero, banners: newBanners });
                              
                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData,
                                });
                                const data = await res.json();
                                if (data.success && data.url) {
                                  const updatedBanners = [...(hero.banners || [])];
                                  updatedBanners[idx] = data.url;
                                  setHero({ ...hero, banners: updatedBanners });
                                } else {
                                  const updatedBanners = [...(hero.banners || [])];
                                  updatedBanners[idx] = '';
                                  setHero({ ...hero, banners: updatedBanners });
                                  alert('Erro ao fazer upload: ' + (data.error || 'Erro desconhecido'));
                                }
                              } catch (err) {
                                const updatedBanners = [...(hero.banners || [])];
                                updatedBanners[idx] = '';
                                setHero({ ...hero, banners: updatedBanners });
                                alert('Erro na conexão para upload.');
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
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
                      {p.logo && p.logo.startsWith('⏳') ? (
                        <div className={styles.spinnerSmall}></div>
                      ) : (
                        '📁'
                      )}
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

        {/* Supported Companies Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Empresas que Apoiamos</h3>
          <div className={styles.listGrid}>
            {(supportedCompanies || []).map((company, index) => (
              <div key={index} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <div className={styles.partnerLogoPreview}>
                    {(company.icon && (company.icon.startsWith('http') || company.icon.startsWith('/'))) ? (
                      <img src={company.icon} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>{company.icon || '🏢'}</span>
                    )}
                  </div>
                  <div className={styles.logoInputWrapper}>
                    <input 
                      value={company.icon} 
                      onChange={e => updateArrayField(setSupportedCompanies, supportedCompanies, index, 'icon', e.target.value)} 
                      placeholder="Ícone (Emoji, URL ou Upload)" 
                      className={styles.inputSmall} 
                    />
                    <label className={styles.uploadLabel} title="Carregar Logotipo">
                      {company.icon && company.icon.startsWith('⏳') ? (
                        <div className={styles.spinnerSmall}></div>
                      ) : (
                        '📁'
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          updateArrayField(setSupportedCompanies, supportedCompanies, index, 'icon', '⏳...');
                          
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await res.json();
                            if (data.success && data.url) {
                              updateArrayField(setSupportedCompanies, supportedCompanies, index, 'icon', data.url);
                            } else {
                              updateArrayField(setSupportedCompanies, supportedCompanies, index, 'icon', '🏢');
                              alert('Erro ao fazer upload: ' + (data.error || 'Erro desconhecido'));
                            }
                          } catch (err) {
                            updateArrayField(setSupportedCompanies, supportedCompanies, index, 'icon', '🏢');
                            alert('Erro na conexão para upload.');
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <input 
                    value={company.name} 
                    onChange={e => updateArrayField(setSupportedCompanies, supportedCompanies, index, 'name', e.target.value)} 
                    placeholder="Nome da Empresa" 
                    style={{ flex: 1 }}
                  />
                  <button className={styles.removeBtn} onClick={() => removeItem(setSupportedCompanies, supportedCompanies, index)}>×</button>
                </div>
                <div className={styles.row} style={{ marginTop: '0.5rem', gap: '1rem' }}>
                  <input 
                    value={company.location} 
                    onChange={e => updateArrayField(setSupportedCompanies, supportedCompanies, index, 'location', e.target.value)} 
                    placeholder="📍 Localização (ex: Luanda, Angola)" 
                    style={{ flex: 1 }}
                  />
                  <input 
                    value={company.phase} 
                    onChange={e => updateArrayField(setSupportedCompanies, supportedCompanies, index, 'phase', e.target.value)} 
                    placeholder="Fase (Crescimento / Validação / Ideação)" 
                    style={{ flex: 1 }}
                  />
                </div>
                <textarea 
                  value={company.desc} 
                  onChange={e => updateArrayField(setSupportedCompanies, supportedCompanies, index, 'desc', e.target.value)} 
                  placeholder="Descrição da empresa" 
                  rows={2} 
                  style={{ marginTop: '0.5rem', width: '100%', padding: '10px' }}
                />
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setSupportedCompanies, supportedCompanies, { name: '', location: '', desc: '', icon: '🏢', phase: '' })}>+ Adicionar Empresa</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('supported_companies', supportedCompanies)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Empresas'}
          </button>
        </section>

        {/* Quem Somos Images Slider Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Imagens da Seção "Quem Somos" (Slider)</h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1.5rem' }}>
            Adicione uma ou mais imagens para o banner do "Quem Somos". Se houver mais de uma, elas mudarão automaticamente (slideshow).
          </p>
          <div className={styles.listGrid}>
            {(missionImages || []).map((imgUrl, idx) => (
              <div key={idx} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <div className={styles.logoInputWrapper} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <input 
                      value={imgUrl} 
                      onChange={e => {
                        const newImages = [...(missionImages || [])];
                        newImages[idx] = e.target.value;
                        setMissionImages(newImages);
                      }} 
                      placeholder="URL da imagem (ex: /mission_team.png)"
                      style={{ flex: 1 }}
                    />
                    <label className={styles.uploadLabel} title="Carregar Imagem" style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {imgUrl && imgUrl.startsWith('⏳') ? (
                        <div className={styles.spinnerSmall}></div>
                      ) : (
                        '📁'
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          const newImages = [...(missionImages || [])];
                          newImages[idx] = '⏳...';
                          setMissionImages(newImages);
                          
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await res.json();
                            if (data.success && data.url) {
                              const updatedImages = [...(missionImages || [])];
                              updatedImages[idx] = data.url;
                              setMissionImages(updatedImages);
                            } else {
                              const updatedImages = [...(missionImages || [])];
                              updatedImages[idx] = '/mission_team.png';
                              setMissionImages(updatedImages);
                              alert('Erro ao fazer upload: ' + (data.error || 'Erro desconhecido'));
                            }
                          } catch (err) {
                            const updatedImages = [...(missionImages || [])];
                            updatedImages[idx] = '/mission_team.png';
                            setMissionImages(updatedImages);
                            alert('Erro na conexão para upload.');
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <button className={styles.removeBtn} onClick={() => {
                    const newImages = (missionImages || []).filter((_, i) => i !== idx);
                    setMissionImages(newImages);
                  }}>×</button>
                </div>
                {imgUrl && !imgUrl.startsWith('⏳') && (
                  <div className={styles.bannerPreview} style={{ marginTop: '5px' }}>
                    <img src={imgUrl} alt={`Quem Somos Image ${idx + 1}`} style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  </div>
                )}
              </div>
            ))}
            <button className="btn-outline" onClick={() => setMissionImages([...(missionImages || []), ''])}>
              + Adicionar Imagem ao Slider
            </button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('mission_images', missionImages)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Imagens'}
          </button>
        </section>

        {/* Team Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Equipa (Team)</h3>
          <div className={styles.listGrid}>
            {(team || []).map((member, index) => (
              <div key={index} className={styles.itemEditFull}>
                <div className={styles.row}>
                  <div className={styles.partnerLogoPreview} style={{borderRadius: '50%', overflow: 'hidden'}}>
                    {(member.image && (member.image.startsWith('http') || member.image.startsWith('/'))) ? (
                      <img src={member.image} alt="Membro" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>👤</span>
                    )}
                  </div>
                  <div className={styles.logoInputWrapper}>
                    <input 
                      value={member.image} 
                      onChange={e => updateArrayField(setTeam, team, index, 'image', e.target.value)} 
                      placeholder="Foto (URL ou Upload)" 
                      className={styles.inputSmall} 
                    />
                    <label className={styles.uploadLabel} title="Carregar Foto">
                      {member.image && member.image.startsWith('⏳') ? (
                        <div className={styles.spinnerSmall}></div>
                      ) : (
                        '📁'
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          updateArrayField(setTeam, team, index, 'image', '⏳ Carregando...');
                          
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await res.json();
                            if (data.success && data.url) {
                              updateArrayField(setTeam, team, index, 'image', data.url);
                            } else {
                              updateArrayField(setTeam, team, index, 'image', '');
                              alert('Erro ao fazer upload: ' + (data.error || 'Erro desconhecido'));
                            }
                          } catch (err) {
                            updateArrayField(setTeam, team, index, 'image', '');
                            alert('Erro na conexão para upload.');
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <input 
                    value={member.name} 
                    onChange={e => updateArrayField(setTeam, team, index, 'name', e.target.value)} 
                    placeholder="Nome" 
                    style={{ flex: 1 }}
                  />
                  <button className={styles.removeBtn} onClick={() => removeItem(setTeam, team, index)}>×</button>
                </div>
                <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                  <input 
                    value={member.role} 
                    onChange={e => updateArrayField(setTeam, team, index, 'role', e.target.value)} 
                    placeholder="Cargo (ex: CEO, Directora, Developer, RH)" 
                    style={{ flex: 1 }}
                  />
                  <select
                    value={(member as any).country || ''}
                    onChange={e => updateArrayField(setTeam, team, index, 'country', e.target.value)}
                    style={{ width: '200px' }}
                  >
                    <option value="">🌍 País</option>
                    <option value="Angola">🇦🇴 Angola</option>
                    <option value="Cabo Verde">🇨🇻 Cabo Verde</option>
                    <option value="Guine-Bissau">🇬🇼 Guiné-Bissau</option>
                    <option value="Mocambique">🇲🇿 Moçambique</option>
                    <option value="Portugal">🇵🇹 Portugal</option>
                    <option value="Sao Tome e Principe">🇸🇹 São Tomé</option>
                    <option value="Brasil">🇧🇷 Brasil</option>
                    <option value="Franca">🇫🇷 França</option>
                    <option value="Espanha">🇪🇸 Espanha</option>
                    <option value="Nigeria">🇳🇬 Nigéria</option>
                    <option value="Senegal">🇸🇳 Senegal</option>
                    <option value="Africa do Sul">🇿🇦 África do Sul</option>
                    <option value="Gana">🇬🇭 Gana</option>
                    <option value="Quenia">🇰🇪 Quénia</option>
                    <option value="Ruanda">🇷🇼 Ruanda</option>
                  </select>
                </div>
                <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                  <input 
                    value={member.linkedin} 
                    onChange={e => updateArrayField(setTeam, team, index, 'linkedin', e.target.value)} 
                    placeholder="Link do LinkedIn (opcional)" 
                    style={{ flex: 1 }}
                  />
                </div>
                <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                  <textarea 
                    value={(member as any).bio || ''} 
                    onChange={e => updateArrayField(setTeam, team, index, 'bio', e.target.value)} 
                    placeholder="Biografia do membro da equipa (ex: fundador, consultor...)" 
                    rows={3}
                    style={{ flex: 1, resize: 'vertical', width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>
            ))}
            <button className="btn-outline" onClick={() => addItem(setTeam, team, { name: '', role: '', country: '', linkedin: '', image: '', bio: '' })}>+ Adicionar Membro</button>
          </div>
          <button className="btn-primary" onClick={() => saveConfig('team_content', team)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Equipa'}
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
          <div className={styles.articlesGrid}>
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
                          {art.img && art.img.startsWith('⏳') ? (
                            <div className={styles.spinnerSmall}></div>
                          ) : (
                            '📁'
                          )}
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
          </div>
          <button className="btn-outline" onClick={() => addItem(setArticles, articles, { type: 'news', location: '', title: '', date: '', desc: '', img: '' })} style={{ marginTop: '1.5rem', width: '100%' }}>+ Adicionar Artigo</button>
          
          <button className="btn-primary" onClick={() => saveConfig('articles_content', articles)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Artigos'}
          </button>
        </section>

        {/* Page Banners Section Config */}
        <section className={`glass ${styles.section} ${styles.fullWidth}`}>
          <h3>Banners das Páginas Públicas</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>
            Edite a imagem de cabeçalho das páginas principais do portal. Você pode colar uma URL ou fazer upload de uma nova imagem.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { id: 'incubacao', label: 'Página de Incubação & Aceleração' },
              { id: 'impacto', label: 'Página de Impacto ABN' },
              { id: 'eventos', label: 'Página de Eventos' },
              { id: 'noticias', label: 'Página de Notícias' },
              { id: 'galeria', label: 'Página de Galeria' },
              { id: 'oportunidades', label: 'Página de Oportunidades' },
              { id: 'equipa', label: 'Página de Equipa' },
              { id: 'parceiros', label: 'Página de Parceiros' },
              { id: 'marketplace', label: 'Página de Marketplace' },
              { id: 'programas', label: 'Página de Programas' },
              { id: 'mensagem_presidente', label: 'Página da Mensagem do Presidente' }
            ].map(page => (
              <div key={page.id} className={styles.field} style={{ marginBottom: '1.25rem' }}>
                <label>{page.label}</label>
                <div className={styles.logoInputWrapper} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    value={(pageBanners as any)[page.id] || ''}
                    onChange={e => setPageBanners({ ...pageBanners, [page.id]: e.target.value })}
                    placeholder="/placeholder-banner.png"
                    style={{ flex: 1 }}
                  />
                  <label className={styles.uploadLabel} title="Carregar imagem" style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {((pageBanners as any)[page.id] && (pageBanners as any)[page.id].startsWith('⏳')) ? (
                      <div className={styles.spinnerSmall}></div>
                    ) : (
                      '📁'
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append('file', file);

                        setPageBanners(prev => ({ ...prev, [page.id]: '⏳ Carregando...' }));

                        try {
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                          });
                          const uploadData = await res.json();
                          if (uploadData.success && uploadData.url) {
                            setPageBanners(prev => ({ ...prev, [page.id]: uploadData.url }));
                          } else {
                            setPageBanners(prev => ({ ...prev, [page.id]: '' }));
                            alert('Erro no upload: ' + (uploadData.error || 'Erro desconhecido'));
                          }
                        } catch (err) {
                          setPageBanners(prev => ({ ...prev, [page.id]: '' }));
                          alert('Erro na conexão para upload.');
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {/* Visual Preview */}
                {(pageBanners as any)[page.id] && !(pageBanners as any)[page.id].startsWith('⏳') && (
                  <div style={{ marginTop: '0.5rem', width: '100%', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <img src={(pageBanners as any)[page.id]} alt="Preview Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => saveConfig('page_banners', pageBanners)} disabled={saving} style={{ marginTop: '1.5rem' }}>
            {saving ? 'A guardar...' : 'Atualizar Banners das Páginas'}
          </button>
        </section>

        {/* Dados de Pagamento */}
        <section className={`glass ${styles.section}`}>
          <h3>💳 Dados de Pagamento</h3>
          <p style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '1.2rem' }}>Estes dados aparecem no modal de submissão de comprovativo nos cursos e formações.</p>
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Titular da Conta</label>
              <input value={paymentInfo.titular} onChange={e => setPaymentInfo(p => ({ ...p, titular: e.target.value }))} placeholder="Nome do titular" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div className={styles.field}>
                <label>🏦 BIM — Conta</label>
                <input value={paymentInfo.bim_conta} onChange={e => setPaymentInfo(p => ({ ...p, bim_conta: e.target.value }))} placeholder="Ex: 5283397" />
              </div>
              <div className={styles.field}>
                <label>🏦 BIM — NIB</label>
                <input value={paymentInfo.bim_nib} onChange={e => setPaymentInfo(p => ({ ...p, bim_nib: e.target.value }))} placeholder="Ex: 0001 000000005283397 57" />
              </div>
              <div className={styles.field}>
                <label>🏦 Moza Banco — Conta</label>
                <input value={paymentInfo.moza_conta} onChange={e => setPaymentInfo(p => ({ ...p, moza_conta: e.target.value }))} placeholder="Ex: 0087656640001" />
              </div>
              <div className={styles.field}>
                <label>🏦 Moza Banco — NIB</label>
                <input value={paymentInfo.moza_nib} onChange={e => setPaymentInfo(p => ({ ...p, moza_nib: e.target.value }))} placeholder="Ex: 0034 000008765664101 25" />
              </div>
              <div className={styles.field}>
                <label>📱 M-Pesa</label>
                <input value={paymentInfo.mpesa} onChange={e => setPaymentInfo(p => ({ ...p, mpesa: e.target.value }))} placeholder="Ex: 857670109" />
              </div>
              <div className={styles.field}>
                <label>📱 e-Mola</label>
                <input value={paymentInfo.emola} onChange={e => setPaymentInfo(p => ({ ...p, emola: e.target.value }))} placeholder="Ex: 876687082" />
              </div>
            </div>
            <button className="btn-primary" onClick={() => saveConfig('payment_info', paymentInfo)} disabled={saving}>
              {saving ? 'A guardar...' : '💾 Guardar Dados de Pagamento'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
