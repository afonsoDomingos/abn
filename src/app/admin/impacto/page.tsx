'use client';

import { useEffect, useState } from 'react';
import styles from './Impacto.module.css';

interface StatItem {
  label: string;
  value: string;
}

interface ReportItem {
  title: string;
  year: string;
  fileUrl: string;
}

interface CaseItem {
  title: string;
  desc: string;
  img: string;
  category: string;
  statsSnippet: string;
}

interface CompanyItem {
  name: string;
  location: string;
  desc: string;
  icon: string;
  phase: string;
  type: 'incubada' | 'apoiada';
}

export default function AdminImpactoPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'estatisticas' | 'relatorios' | 'casos' | 'empresas'>('estatisticas');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs) {
          // stats_content
          if (data.configs.stats_content) {
            setStats(data.configs.stats_content);
          } else {
            setStats([
              { value: '968', label: 'Alumni' },
              { value: '14+', label: 'Parceiros Privados' },
              { value: '13%', label: 'Mulheres Empreendedoras' },
              { value: '5K+', label: 'Empregos Apoiados' }
            ]);
          }

          // reports_content
          if (data.configs.reports_content) {
            setReports(data.configs.reports_content);
          } else {
            setReports([
              { title: 'Relatório de Impacto ABN 2025', year: '2025', fileUrl: '' },
              { title: 'Relatório de Atividades Orange Corners 2024', year: '2024', fileUrl: '' }
            ]);
          }

          // cases_content
          if (data.configs.cases_content) {
            setCases(data.configs.cases_content);
          } else {
            setCases([
              {
                title: 'Nilza Mazive e Xiphefu: energia inteligente para Moçambique',
                desc: 'Como a empreendedora Nilza Mazive desenvolveu soluções de iluminação inteligente e sustentável que impactaram a vida de comunidades rurais.',
                img: '/articles/nilza.png',
                category: 'Energia Renovável',
                statsSnippet: 'Energia limpa para centenas de famílias'
              },
              {
                title: 'Gala de Empreendedorismo Orange Corners',
                desc: 'Evento anual promovido pelo Orange Corners Moçambique que reuniu centenas de ex-alunos e investidores para celebrar o desenvolvimento socioeconómico.',
                img: '/articles/gala.png',
                category: 'Ecossistema',
                statsSnippet: 'Mais de 20 investidores presentes'
              }
            ]);
          }

          // supported_companies
          if (data.configs.supported_companies) {
            // Add fallback type to 'incubada' for old records
            const parsedCompanies = data.configs.supported_companies.map((c: any) => ({
              ...c,
              type: c.type || 'incubada'
            }));
            setCompanies(parsedCompanies);
          } else {
            setCompanies([
              { name: 'Xiphefu', location: 'Maputo, Moçambique', desc: 'Soluções inteligentes de iluminação.', icon: '🏢', phase: 'Crescimento', type: 'incubada' }
            ]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const saveConfig = async (key: string, value: any) => {
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setMsg(`✅ Configuração de ${key} atualizada com sucesso!`);
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert('Erro ao salvar as configurações.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const updateArrayField = (setter: any, array: any[], index: number, field: string, val: any) => {
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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    setter: any,
    array: any[],
    field: string,
    fallbackVal: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    updateArrayField(setter, array, index, field, '⏳ Carregando...');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        updateArrayField(setter, array, index, field, data.url);
      } else {
        updateArrayField(setter, array, index, field, fallbackVal);
        alert('Erro ao fazer upload: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      updateArrayField(setter, array, index, field, fallbackVal);
      alert('Erro de conexão no upload.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className="text-gradient-gold">Gestão de Impacto ABN</h1>
        <p className={styles.subtitle}>Gerencie os números, relatórios, casos de sucesso e startups apoiadas</p>
      </div>

      {msg && <div className={styles.successMsg}>{msg}</div>}

      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'estatisticas' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('estatisticas')}
        >
          📈 Indicadores & Estatísticas
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'relatorios' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('relatorios')}
        >
          📁 Relatórios Anuais
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'casos' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('casos')}
        >
          🏆 Casos de Sucesso
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'empresas' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('empresas')}
        >
          🏢 Startups & Empresas
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>A carregar dados de impacto...</p>
        </div>
      ) : (
        <>
          {/* TAB ESTATISTICAS */}
          {activeTab === 'estatisticas' && (
            <section className={styles.section}>
              <h3>Indicadores de Impacto</h3>
              <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>
                Estes são os números exibidos na seção de impacto. Adicione valores expressivos (ex: 5K+, 15%).
              </p>
              <div className={styles.listGrid}>
                {stats.map((stat, idx) => (
                  <div key={idx} className={styles.itemEdit}>
                    <div className={styles.field} style={{ flex: 2 }}>
                      <label>Valor / Número</label>
                      <input
                        value={stat.value}
                        onChange={e => updateArrayField(setStats, stats, idx, 'value', e.target.value)}
                        placeholder="Ex: 968"
                      />
                    </div>
                    <div className={styles.field} style={{ flex: 3 }}>
                      <label>Rótulo / Descritor</label>
                      <input
                        value={stat.label}
                        onChange={e => updateArrayField(setStats, stats, idx, 'label', e.target.value)}
                        placeholder="Ex: Empregos Apoiados"
                      />
                    </div>
                    <button type="button" className={styles.removeBtn} onClick={() => removeItem(setStats, stats, idx)}>
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => addItem(setStats, stats, { label: '', value: '' })}
                >
                  + Adicionar Estatística
                </button>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveConfig('stats_content', stats)}
                disabled={saving}
              >
                {saving ? 'A guardar...' : 'Atualizar Estatísticas'}
              </button>
            </section>
          )}

          {/* TAB RELATORIOS */}
          {activeTab === 'relatorios' && (
            <section className={styles.section}>
              <h3>Relatórios Anuais de Impacto</h3>
              <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>
                Faça upload de relatórios anuais (em PDF) para os parceiros e público descarregarem.
              </p>
              <div className={styles.listGrid}>
                {reports.map((report, idx) => (
                  <div key={idx} className={styles.itemEditFull}>
                    <div className={styles.row}>
                      <div className={styles.field} style={{ flex: 3 }}>
                        <label>Título do Relatório</label>
                        <input
                          value={report.title}
                          onChange={e => updateArrayField(setReports, reports, idx, 'title', e.target.value)}
                          placeholder="Ex: Relatório de Impacto ABN 2025"
                        />
                      </div>
                      <div className={styles.field} style={{ flex: 1 }}>
                        <label>Ano de Referência</label>
                        <input
                          value={report.year}
                          onChange={e => updateArrayField(setReports, reports, idx, 'year', e.target.value)}
                          placeholder="Ex: 2025"
                        />
                      </div>
                      <button type="button" className={styles.removeBtn} onClick={() => removeItem(setReports, reports, idx)}>
                        ×
                      </button>
                    </div>

                    <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                      <div className={styles.field} style={{ flex: 1 }}>
                        <label>Link / Ficheiro PDF</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            value={report.fileUrl}
                            onChange={e => updateArrayField(setReports, reports, idx, 'fileUrl', e.target.value)}
                            placeholder="URL do arquivo PDF ou carregue um arquivo"
                            style={{ flex: 1 }}
                          />
                          <label className={styles.uploadLabel} title="Carregar PDF">
                            {report.fileUrl && report.fileUrl.startsWith('⏳') ? (
                              <div className={styles.spinnerSmall}></div>
                            ) : (
                              '📁'
                            )}
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={e => handleFileUpload(e, idx, setReports, reports, 'fileUrl', '')}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => addItem(setReports, reports, { title: '', year: new Date().getFullYear().toString(), fileUrl: '' })}
                >
                  + Adicionar Relatório PDF
                </button>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveConfig('reports_content', reports)}
                disabled={saving}
              >
                {saving ? 'A guardar...' : 'Atualizar Relatórios'}
              </button>
            </section>
          )}

          {/* TAB CASOS DE SUCESSO */}
          {activeTab === 'casos' && (
            <section className={styles.section}>
              <h3>Casos de Sucesso</h3>
              <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>
                Histórias reais de fundadores e startups que escalaram suas operações com ajuda da ABN.
              </p>
              <div className={styles.listGrid}>
                {cases.map((cs, idx) => (
                  <div key={idx} className={styles.itemEditFull}>
                    <div className={styles.row}>
                      <div className={styles.field} style={{ flex: 3 }}>
                        <label>Título do Caso de Sucesso</label>
                        <input
                          value={cs.title}
                          onChange={e => updateArrayField(setCases, cases, idx, 'title', e.target.value)}
                          placeholder="Ex: Como a Startup X captou 50.000 USD de financiamento"
                        />
                      </div>
                      <div className={styles.field} style={{ flex: 1.5 }}>
                        <label>Categoria / Setor</label>
                        <input
                          value={cs.category}
                          onChange={e => updateArrayField(setCases, cases, idx, 'category', e.target.value)}
                          placeholder="Ex: FinTech, Agricultura"
                        />
                      </div>
                      <button type="button" className={styles.removeBtn} onClick={() => removeItem(setCases, cases, idx)}>
                        ×
                      </button>
                    </div>

                    <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                      <div className={styles.field} style={{ flex: 2 }}>
                        <label>Resumo do Impacto (Métrica de Destaque)</label>
                        <input
                          value={cs.statsSnippet}
                          onChange={e => updateArrayField(setCases, cases, idx, 'statsSnippet', e.target.value)}
                          placeholder="Ex: Aumento de 200% nas vendas"
                        />
                      </div>
                      <div className={styles.field} style={{ flex: 3 }}>
                        <label>Imagem / Foto</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            value={cs.img}
                            onChange={e => updateArrayField(setCases, cases, idx, 'img', e.target.value)}
                            placeholder="URL da Imagem ou faça o upload"
                            style={{ flex: 1 }}
                          />
                          <label className={styles.uploadLabel} title="Carregar Imagem">
                            {cs.img && cs.img.startsWith('⏳') ? (
                              <div className={styles.spinnerSmall}></div>
                            ) : (
                              '📁'
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, idx, setCases, cases, 'img', '/articles/nilza.png')}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                      <div className={styles.field}>
                        <label>História / Descrição Completa</label>
                        <textarea
                          value={cs.desc}
                          onChange={e => updateArrayField(setCases, cases, idx, 'desc', e.target.value)}
                          placeholder="Conte a história de impacto em detalhes..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => addItem(setCases, cases, { title: '', desc: '', img: '/articles/nilza.png', category: '', statsSnippet: '' })}
                >
                  + Adicionar Caso de Sucesso
                </button>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveConfig('cases_content', cases)}
                disabled={saving}
              >
                {saving ? 'A guardar...' : 'Atualizar Casos de Sucesso'}
              </button>
            </section>
          )}

          {/* TAB EMPRESAS & STARTUPS */}
          {activeTab === 'empresas' && (
            <section className={styles.section}>
              <h3>Startups e Empresas Apoiadas</h3>
              <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>
                Gerencie as marcas no ecossistema e selecione se são Startups Incubadas ou Empresas Apoiadas.
              </p>
              <div className={styles.listGrid}>
                {companies.map((company, idx) => (
                  <div key={idx} className={styles.itemEditFull}>
                    <div className={styles.row}>
                      <div className={styles.partnerLogoPreview}>
                        {company.icon && (company.icon.startsWith('http') || company.icon.startsWith('/')) ? (
                          <img src={company.icon} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1.5rem' }}>{company.icon || '🏢'}</span>
                        )}
                      </div>
                      <div className={styles.logoInputWrapper}>
                        <input
                          value={company.icon}
                          onChange={e => updateArrayField(setCompanies, companies, idx, 'icon', e.target.value)}
                          placeholder="Emoji ou URL Logo"
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
                            onChange={e => handleFileUpload(e, idx, setCompanies, companies, 'icon', '🏢')}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      <div className={styles.field} style={{ flex: 3 }}>
                        <label>Nome da Empresa / Startup *</label>
                        <input
                          value={company.name}
                          onChange={e => updateArrayField(setCompanies, companies, idx, 'name', e.target.value)}
                          placeholder="Ex: Xiphefu"
                        />
                      </div>

                      <div className={styles.field} style={{ flex: 1.5 }}>
                        <label>Classificação</label>
                        <select
                          value={company.type}
                          onChange={e => updateArrayField(setCompanies, companies, idx, 'type', e.target.value)}
                        >
                          <option value="incubada">Startup Incubada</option>
                          <option value="apoiada">Empresa Apoiada</option>
                        </select>
                      </div>

                      <button type="button" className={styles.removeBtn} onClick={() => removeItem(setCompanies, companies, idx)}>
                        ×
                      </button>
                    </div>

                    <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                      <div className={styles.field} style={{ flex: 1 }}>
                        <label>📍 Localização</label>
                        <input
                          value={company.location}
                          onChange={e => updateArrayField(setCompanies, companies, idx, 'location', e.target.value)}
                          placeholder="Ex: Maputo, Moçambique"
                        />
                      </div>
                      <div className={styles.field} style={{ flex: 1 }}>
                        <label>Fase de Desenvolvimento</label>
                        <input
                          value={company.phase}
                          onChange={e => updateArrayField(setCompanies, companies, idx, 'phase', e.target.value)}
                          placeholder="Ex: Validação, Ideação, Crescimento"
                        />
                      </div>
                    </div>

                    <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                      <div className={styles.field}>
                        <label>Breve Descrição do Negócio</label>
                        <textarea
                          value={company.desc}
                          onChange={e => updateArrayField(setCompanies, companies, idx, 'desc', e.target.value)}
                          placeholder="Descreva o produto, serviço ou modelo de impacto da startup..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => addItem(setCompanies, companies, { name: '', location: '', desc: '', icon: '🏢', phase: '', type: 'incubada' })}
                >
                  + Adicionar Nova Startup/Empresa
                </button>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveConfig('supported_companies', companies)}
                disabled={saving}
              >
                {saving ? 'A guardar...' : 'Atualizar Startups & Empresas'}
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
