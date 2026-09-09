
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2, Globe, Users, TrendingUp,
  Plus, CheckCircle2, Clock, Send, X, Target
} from "lucide-react";

const CONNECT_TYPES = [
  { key: "distribuidor", label: "Procuro Distribuidor", icon: "🏪", color: "#6366f1", desc: "Distribuidores em mercados-alvo" },
  { key: "fornecedor", label: "Procuro Fornecedor", icon: "📦", color: "#10b981", desc: "Fornecedores de matéria-prima ou serviços" },
  { key: "investidor", label: "Procuro Investidor", icon: "💰", color: "#f59e0b", desc: "Capital para expansão ou projetos" },
  { key: "parceiro_tecnologico", label: "Procuro Parceiro Tecnológico", icon: "💻", color: "#8b5cf6", desc: "Parceiros de transformação digital" },
  { key: "comprador_internacional", label: "Procuro Comprador Internacional", icon: "🌍", color: "#0ea5e9", desc: "Compradores em mercados internacionais" },
  { key: "outro", label: "Outro Pedido", icon: "🔗", color: "#64748b", desc: "Descreva o seu pedido à rede ABN" },
];

const DESENVOLVIMENTO_CATS = [
  { key: "consultoria", label: "Consultoria", icon: "🎯" },
  { key: "formacao", label: "Formação", icon: "🎓" },
  { key: "mentoria", label: "Mentoria", icon: "🧭" },
  { key: "aceleracao", label: "Aceleração", icon: "🚀" },
  { key: "internacionalizacao", label: "Internacionalização", icon: "🌐" },
  { key: "marketing", label: "Marketing", icon: "📢" },
  { key: "recursos_humanos", label: "Recursos Humanos", icon: "👥" },
  { key: "estrategia", label: "Estratégia", icon: "♟️" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  ativo:          { bg: "#dcfce7", color: "#15803d", label: "Ativo" },
  em_negociacao:  { bg: "#fef3c7", color: "#d97706", label: "Em Negociação" },
  concluido:      { bg: "#f1f5f9", color: "#64748b", label: "Concluído" },
  cancelado:      { bg: "#fee2e2", color: "#dc2626", label: "Cancelado" },
  pendente:       { bg: "#fef3c7", color: "#d97706", label: "Pendente" },
  em_curso:       { bg: "#e0f2fe", color: "#0369a1", label: "Em Curso" },
};

export default function EmpresaPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"empresa" | "connect" | "desenvolvimento" | "oportunidades" | "networking">("empresa");
  const [feedback, setFeedback] = useState<{ type: string; message: string } | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Connect form
  const [connectType, setConnectType] = useState("distribuidor");
  const [connectTitle, setConnectTitle] = useState("");
  const [connectDesc, setConnectDesc] = useState("");
  const [connectCountry, setConnectCountry] = useState("");
  const [connectSector, setConnectSector] = useState("");
  const [connectBudget, setConnectBudget] = useState("");

  // Empresa profile form
  const [empName, setEmpName] = useState("");
  const [empSector, setEmpSector] = useState("Comércio");
  const [empDimension, setEmpDimension] = useState("PME");
  const [empEmployees, setEmpEmployees] = useState("");
  const [empRevenue, setEmpRevenue] = useState("");
  const [empFounded, setEmpFounded] = useState("");
  const [empMarkets, setEmpMarkets] = useState("");
  const [empVision, setEmpVision] = useState("");
  const [empWebsite, setEmpWebsite] = useState("");
  const [empLocation, setEmpLocation] = useState("");
  const [empExport, setEmpExport] = useState(false);

  useEffect(() => { fetchEmpresaData(); }, []);

  const notify = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchEmpresaData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/empresa");
      const data = await res.json();
      if (data.success && data.business) {
        const b = data.business;
        setBusiness(b);
        setEmpName(b.name || "");
        setEmpWebsite(b.website || "");
        setEmpLocation(b.location || "");
        if (b.empresaProfile) {
          setEmpSector(b.empresaProfile.sector || "Comércio");
          setEmpDimension(b.empresaProfile.dimension || "PME");
          setEmpEmployees(b.empresaProfile.employeesCount || "");
          setEmpRevenue(b.empresaProfile.annualRevenue || "");
          setEmpFounded(b.empresaProfile.foundedYear || "");
          setEmpMarkets((b.empresaProfile.markets || []).join(", "));
          setEmpVision(b.empresaProfile.vision || "");
          setEmpExport(b.empresaProfile.exportReady || false);
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const saveEmpresaProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/empresa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: empName, website: empWebsite, location: empLocation,
          empresaProfile: {
            sector: empSector, dimension: empDimension,
            employeesCount: empEmployees, annualRevenue: empRevenue,
            foundedYear: empFounded,
            markets: empMarkets.split(",").map((m: string) => m.trim()).filter(Boolean),
            vision: empVision, exportReady: empExport,
          }
        })
      });
      const data = await res.json();
      if (data.success) { setBusiness(data.business); notify("success", "Perfil atualizado!"); }
      else notify("error", data.error || "Erro ao guardar.");
    } catch (e) { notify("error", "Erro de rede."); }
    finally { setSaving(false); }
  };

  const publishConnect = async () => {
    if (!connectTitle.trim()) { notify("error", "Título é obrigatório."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/user/empresa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish_connect",
          connectRequest: { type: connectType, title: connectTitle, description: connectDesc, targetCountry: connectCountry, targetSector: connectSector, budget: connectBudget }
        })
      });
      const data = await res.json();
      if (data.success) {
        notify("success", data.message);
        setShowConnectModal(false);
        setConnectTitle(""); setConnectDesc(""); setConnectCountry(""); setConnectSector(""); setConnectBudget("");
        fetchEmpresaData();
      } else notify("error", data.error || "Erro ao publicar.");
    } catch (e) { notify("error", "Erro de rede."); }
    finally { setSaving(false); }
  };

  const TABS = [
    { key: "empresa", label: "🏢 Empresa" },
    { key: "connect", label: "🔗 Business Connect" },
    { key: "desenvolvimento", label: "📈 Desenvolvimento" },
    { key: "oportunidades", label: "🎯 Oportunidades" },
    { key: "networking", label: "🤝 Networking B2B" },
  ];

  const connectRequests: any[] = business?.businessConnect || [];
  const desenvolvimentoItems: any[] = business?.desenvolvimento || [];
  const sampleConnect = [
    { _id: "s1", type: "distribuidor", title: "Procuro distribuidor em Angola", targetCountry: "Angola", status: "ativo", responses: 3, description: "Sector alimentar e FMCG." },
    { _id: "s2", type: "parceiro_tecnologico", title: "Procuro parceiro tecnológico para digitalização", targetSector: "TI & Software", status: "em_negociacao", responses: 7, description: "Migração ERP e e-commerce." },
  ];
  const displayConnect = connectRequests.length > 0 ? connectRequests : sampleConnect;

  return (
    <div style={{ padding: "0.5rem 0", fontFamily: "Outfit, Inter, sans-serif" }}>

      {feedback && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, background: feedback.type === "success" ? "#10b981" : "#ef4444", color: "#fff", padding: "0.85rem 1.4rem", borderRadius: "14px", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 8px 25px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: "8px" }}>
          {feedback.type === "success" ? "✅" : "❌"} {feedback.message}
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c4a6e 100%)", borderRadius: "24px", padding: "2rem", marginBottom: "2rem", border: "1px solid rgba(14,165,233,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(14,165,233,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 800, background: "rgba(14,165,233,0.25)", color: "#7dd3fc", padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.8px", border: "1px solid rgba(14,165,233,0.35)" }}>🏢 Empresa / PME</span>
              <span style={{ fontSize: "0.7rem", fontWeight: 800, background: "rgba(16,185,129,0.2)", color: "#6ee7b7", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.3)" }}>🟢 Verificada</span>
              {business?.empresaProfile?.exportReady && <span style={{ fontSize: "0.7rem", fontWeight: 800, background: "rgba(251,191,36,0.2)", color: "#fbbf24", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(251,191,36,0.3)" }}>🌍 Export Ready</span>}
            </div>
            <h1 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 900, color: "#ffffff", fontFamily: "Outfit, sans-serif", lineHeight: 1.2 }}>{business?.name || "Minha Empresa"}</h1>
            <p style={{ margin: "0.4rem 0 0 0", color: "#94a3b8", fontSize: "0.9rem" }}>
              {business?.empresaProfile?.sector || "Comércio"} · {business?.empresaProfile?.dimension || "PME"} · {business?.location || "Guiné-Bissau"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={() => { setShowConnectModal(true); }} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#0ea5e9", color: "#ffffff", padding: "10px 18px", borderRadius: "12px", fontWeight: 800, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>
              <Plus size={16} /> Business Connect
            </button>
            <Link href="/dashboard/negocios" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.08)", color: "#e2e8f0", padding: "10px 18px", borderRadius: "12px", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Building2 size={16} /> Gerir Negócio
            </Link>
          </div>
        </div>
      </div>

      {/* KPI TILES */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Clientes Ativos", value: business?.clients?.length || 12, icon: "👤", bg: "rgba(14,165,233,0.08)" },
          { label: "Projetos", value: business?.stats?.projects || 8, icon: "📂", bg: "rgba(99,102,241,0.08)" },
          { label: "Fornecedores", value: business?.suppliers?.length || 5, icon: "📦", bg: "rgba(16,185,129,0.08)" },
          { label: "Pedidos Connect", value: connectRequests.filter((c: any) => c.status === "ativo").length || 2, icon: "🔗", bg: "rgba(245,158,11,0.08)" },
          { label: "Mercados", value: String((business?.empresaProfile?.markets?.length || 3)) + " países", icon: "🌍", bg: "rgba(139,92,246,0.08)" },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{kpi.icon}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0f172a", fontFamily: "Outfit" }}>{kpi.value}</div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.4px" }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 20px rgba(15,23,42,0.04)" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", overflowX: "auto", padding: "0 1rem" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{ padding: "1rem 1.2rem", background: "none", border: "none", borderBottom: activeTab === tab.key ? "2px solid #0ea5e9" : "2px solid transparent", color: activeTab === tab.key ? "#0ea5e9" : "#64748b", fontWeight: activeTab === tab.key ? 800 : 600, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", fontFamily: "Outfit, sans-serif" }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "1.75rem 2rem" }}>

          {/* ═ TAB: EMPRESA ═ */}
          {activeTab === "empresa" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: "Outfit" }}>Perfil da Empresa</h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#64748b" }}>Informações institucionais e operacionais.</p>
                </div>
                <button onClick={saveEmpresaProfile} disabled={saving} style={{ background: "#0ea5e9", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "Outfit, sans-serif" }}>
                  {saving ? "A guardar..." : "💾 Guardar"}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                {([
                  { label: "Nome da Empresa", val: empName, set: setEmpName, ph: "Nome oficial" },
                  { label: "Website", val: empWebsite, set: setEmpWebsite, ph: "https://..." },
                  { label: "Sede / Localização", val: empLocation, set: setEmpLocation, ph: "Bissau, Guiné-Bissau" },
                  { label: "Ano de Fundação", val: empFounded, set: setEmpFounded, ph: "2018" },
                  { label: "Colaboradores", val: empEmployees, set: setEmpEmployees, ph: "1-10, 11-50..." },
                  { label: "Volume Negócios (Anual)", val: empRevenue, set: setEmpRevenue, ph: "$500,000" },
                  { label: "Mercados de Atuação", val: empMarkets, set: setEmpMarkets, ph: "Angola, Portugal, Brasil..." },
                ] as { label: string; val: string; set: (v: string) => void; ph: string }[]).map(f => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>{f.label}</label>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", color: "#0f172a", boxSizing: "border-box", fontFamily: "Outfit, sans-serif" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Dimensão</label>
                  <select value={empDimension} onChange={e => setEmpDimension(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", background: "#fff", fontFamily: "Outfit, sans-serif" }}>
                    {["Micro (1-9)", "PME (10-249)", "Grande Empresa (250+)"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Setor Principal</label>
                  <select value={empSector} onChange={e => setEmpSector(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", background: "#fff", fontFamily: "Outfit, sans-serif" }}>
                    {["Agricultura & Agro-indústria", "Comércio & Distribuição", "Construção & Imobiliário", "Educação", "Energia & Ambiente", "Fintech & Finanças", "Indústria & Manufactura", "Logística & Transportes", "Saúde", "Tecnologia & Software", "Turismo & Hotelaria", "Outro"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Visão / Proposta de Valor</label>
                <textarea value={empVision} onChange={e => setEmpVision(e.target.value)} rows={3} placeholder="Descreva a visão estratégica e proposta de valor..." style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", resize: "vertical", fontFamily: "Outfit, sans-serif", boxSizing: "border-box" }} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={empExport} onChange={e => setEmpExport(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#0ea5e9" }} />
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#334155" }}>🌍 Empresa Export Ready — Capacidade de exportação verificada</span>
              </label>
            </div>
          )}

          {/* ═ TAB: BUSINESS CONNECT ═ */}
          {activeTab === "connect" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: "Outfit", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Globe size={20} color="#0ea5e9" /> Business Connect
                  </h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#64748b" }}>Publique as suas necessidades comerciais. A ABN procura correspondências na sua rede.</p>
                </div>
                <button onClick={() => setShowConnectModal(true)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#0ea5e9", color: "#fff", padding: "10px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "0.85rem", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                  <Plus size={16} /> Publicar Pedido
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.85rem", marginBottom: "2rem" }}>
                {CONNECT_TYPES.map(ct => (
                  <button key={ct.key} onClick={() => { setConnectType(ct.key); setShowConnectModal(true); }} style={{ background: "#f8fafc", border: `1.5px solid ${ct.color}22`, borderRadius: "16px", padding: "1rem", textAlign: "left", cursor: "pointer", transition: "all 0.2s", fontFamily: "Outfit, sans-serif" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{ct.icon}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>{ct.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{ct.desc}</div>
                  </button>
                ))}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={18} color="#64748b" /> Pedidos Publicados ({displayConnect.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {displayConnect.map((c: any, i: number) => {
                  const ct = CONNECT_TYPES.find(t => t.key === c.type) || CONNECT_TYPES[5];
                  const s = STATUS_STYLES[c.status] || STATUS_STYLES.ativo;
                  return (
                    <div key={c._id || i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${ct.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{ct.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>{c.title}</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 800, background: s.bg, color: s.color, padding: "2px 8px", borderRadius: "12px" }}>{s.label}</span>
                        </div>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          {c.targetCountry && <span style={{ fontSize: "0.78rem", color: "#64748b" }}>🌍 {c.targetCountry}</span>}
                          {c.targetSector && <span style={{ fontSize: "0.78rem", color: "#64748b" }}>📂 {c.targetSector}</span>}
                          <span style={{ fontSize: "0.78rem", color: "#0ea5e9", fontWeight: 700 }}>💬 {c.responses || 0} respostas ABN</span>
                        </div>
                        {c.description && <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>{c.description}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═ TAB: DESENVOLVIMENTO ═ */}
          {activeTab === "desenvolvimento" && (
            <div>
              <h2 style={{ margin: "0 0 1.25rem 0", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: "Outfit", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={20} color="#6366f1" /> Desenvolvimento Empresarial
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {DESENVOLVIMENTO_CATS.map(cat => (
                  <div key={cat.key} style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "1.25rem", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{cat.icon}</div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>{cat.label}</div>
                    <Link href="/dashboard/servicos" style={{ fontSize: "0.78rem", color: "#6366f1", fontWeight: 700, textDecoration: "none" }}>Ver serviços →</Link>
                  </div>
                ))}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>Histórico de Serviços</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {(desenvolvimentoItems.length > 0 ? desenvolvimentoItems : [
                  { category: "consultoria", title: "Diagnóstico Empresarial ABN", provider: "Dr. Carlos Lima", status: "concluido" },
                  { category: "formacao", title: "Gestão Financeira para PMEs", provider: "ABN Academy", status: "em_curso" },
                  { category: "internacionalizacao", title: "Plano de Internacionalização Angola", provider: "ABN Global", status: "pendente" },
                ]).map((d: any, i: number) => {
                  const cat = DESENVOLVIMENTO_CATS.find(c => c.key === d.category) || DESENVOLVIMENTO_CATS[0];
                  const s = STATUS_STYLES[d.status] || STATUS_STYLES.pendente;
                  return (
                    <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "1.4rem" }}>{cat.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>{d.title}</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 800, background: s.bg, color: s.color, padding: "2px 8px", borderRadius: "12px" }}>{s.label}</span>
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{d.provider}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═ TAB: OPORTUNIDADES ═ */}
          {activeTab === "oportunidades" && (
            <div>
              <h2 style={{ margin: "0 0 1.25rem 0", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: "Outfit", display: "flex", alignItems: "center", gap: "8px" }}>
                <Target size={20} color="#f59e0b" /> Oportunidades Compatíveis
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  { icon: "📢", title: "Edital ADEI — PMEs Inovadoras 2026", deadline: "30 Set 2026", value: "$50,000", tag: "Fomento" },
                  { icon: "🤝", title: "Parceria B2B com Distribuidoras Luandenses", deadline: "15 Out 2026", value: "Variável", tag: "Parceria" },
                  { icon: "💰", title: "Linha de Crédito BCSTP — Exportação", deadline: "31 Out 2026", value: "até $200,000", tag: "Financiamento" },
                  { icon: "🌐", title: "Missão Empresarial Portugal 2026", deadline: "20 Out 2026", value: "Apoiado ABN", tag: "Evento" },
                ].map((op, i) => (
                  <div key={i} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "1.5rem" }}>{op.icon}</span>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "12px" }}>{op.tag}</span>
                    </div>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>{op.title}</h4>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "10px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>⏰ {op.deadline}</span>
                      <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>💵 {op.value}</span>
                    </div>
                    <Link href="/dashboard/oportunidades" style={{ fontSize: "0.8rem", fontWeight: 800, color: "#f59e0b", textDecoration: "none" }}>Ver detalhes →</Link>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/oportunidades" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f59e0b", color: "#ffffff", padding: "10px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "0.85rem", textDecoration: "none" }}>
                <Target size={16} /> Ver todas as oportunidades
              </Link>
            </div>
          )}

          {/* ═ TAB: NETWORKING ═ */}
          {activeTab === "networking" && (
            <div>
              <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: "Outfit", display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={20} color="#10b981" /> Networking B2B
              </h2>
              <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.85rem", color: "#64748b" }}>Empresas, fornecedores e parceiros estratégicos no ecossistema ABN.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  { name: "TechSol Guiné", sector: "Tecnologia", country: "Guiné-Bissau", type: "Empresa", verified: true },
                  { name: "Agro Export Lda.", sector: "Agricultura", country: "Angola", type: "Parceiro", verified: true },
                  { name: "Logis West Africa", sector: "Logística", country: "Senegal", type: "Fornecedor", verified: false },
                  { name: "Invest Lusófono", sector: "Finanças", country: "Portugal", type: "Investidor", verified: true },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 900, flexShrink: 0 }}>
                      {m.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>{m.name}</span>
                        {m.verified && <span>✅</span>}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{m.sector} · {m.country}</span>
                      <div style={{ marginTop: "4px" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "rgba(14,165,233,0.1)", color: "#0369a1", padding: "2px 8px", borderRadius: "12px" }}>{m.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/networking" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#10b981", color: "#ffffff", padding: "10px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "0.85rem", textDecoration: "none" }}>
                <Users size={16} /> Explorar Diretório ABN
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* MODAL BUSINESS CONNECT */}
      {showConnectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
          <div style={{ background: "#ffffff", borderRadius: "24px", maxWidth: "560px", width: "100%", padding: "2rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", fontFamily: "Outfit" }}>🔗 Publicar Pedido Business Connect</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#64748b" }}>A ABN procurará correspondências na sua rede.</p>
              </div>
              <button onClick={() => setShowConnectModal(false)} style={{ background: "#f1f5f9", border: "none", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontWeight: 900, color: "#475569", fontSize: "1rem" }}>✕</button>
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Tipo de Pedido</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {CONNECT_TYPES.map(ct => (
                  <button key={ct.key} onClick={() => setConnectType(ct.key)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.75rem", borderRadius: "12px", border: connectType === ct.key ? `2px solid ${ct.color}` : "1.5px solid #e2e8f0", background: connectType === ct.key ? `${ct.color}12` : "#f8fafc", cursor: "pointer", textAlign: "left", fontFamily: "Outfit, sans-serif" }}>
                    <span style={{ fontSize: "1.2rem" }}>{ct.icon}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: connectType === ct.key ? ct.color : "#334155" }}>{ct.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Título do Pedido *</label>
                <input value={connectTitle} onChange={e => setConnectTitle(e.target.value)} placeholder='Ex: Procuro distribuidor em Angola para o setor alimentar' style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", fontFamily: "Outfit, sans-serif", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Descrição</label>
                <textarea value={connectDesc} onChange={e => setConnectDesc(e.target.value)} rows={3} placeholder="Detalhe os seus requisitos, volume, condições..." style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", fontFamily: "Outfit, sans-serif", boxSizing: "border-box", resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>País / Mercado Alvo</label>
                  <input value={connectCountry} onChange={e => setConnectCountry(e.target.value)} placeholder="Angola, Portugal..." style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", fontFamily: "Outfit, sans-serif", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Setor / Categoria</label>
                  <input value={connectSector} onChange={e => setConnectSector(e.target.value)} placeholder="Alimentar, TI..." style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", fontFamily: "Outfit, sans-serif", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Orçamento / Valor</label>
                <input value={connectBudget} onChange={e => setConnectBudget(e.target.value)} placeholder="$10,000 - $50,000 / Negociável" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", fontFamily: "Outfit, sans-serif", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button onClick={() => setShowConnectModal(false)} style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "10px 20px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
              <button onClick={publishConnect} disabled={saving} style={{ background: "#0ea5e9", color: "#ffffff", border: "none", padding: "10px 24px", borderRadius: "12px", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: saving ? 0.7 : 1 }}>
                <Send size={16} /> {saving ? "A publicar..." : "Publicar Pedido"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
