"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("abn_cookie_consent");
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (accepted: boolean) => {
    setLeaving(true);
    setTimeout(() => {
      localStorage.setItem("abn_cookie_consent", accepted ? "accepted" : "declined");
      setVisible(false);
      setLeaving(false);
    }, 400);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes slideUpCookie {
          from { transform: translateX(-50%) translateY(120%); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);   opacity: 1; }
        }
        @keyframes slideDownCookie {
          from { transform: translateX(-50%) translateY(0);   opacity: 1; }
          to   { transform: translateX(-50%) translateY(120%); opacity: 0; }
        }
        .cookie-banner {
          animation: slideUpCookie 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .cookie-banner.leaving {
          animation: slideDownCookie 0.4s ease-in forwards;
        }
      `}</style>

      <div
        className={leaving ? "cookie-banner leaving" : "cookie-banner"}
        role="dialog"
        aria-live="polite"
        aria-label="Aviso de cookies"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "min(700px, calc(100vw - 2rem))",
          background: "rgba(10, 10, 20, 0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "1.4rem 1.8rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{
          width: "48px", height: "48px", flexShrink: 0,
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          borderRadius: "14px", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "1.6rem"
        }}>
          🍪
        </div>

        <div style={{ flex: 1, minWidth: "220px" }}>
          <p style={{ color: "#fff", fontWeight: 700, margin: "0 0 4px 0", fontFamily: "Outfit, sans-serif", fontSize: "0.95rem" }}>
            A ABN utiliza cookies
          </p>
          <p style={{ color: "rgba(255,255,255,0.55)", margin: 0, fontSize: "0.8rem", lineHeight: 1.5 }}>
            Usamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para melhorar a sua experiência.{" "}
            <Link href="/privacidade" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "underline" }}>
              Política de Privacidade
            </Link>
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.7rem", flexShrink: 0, flexWrap: "wrap" }}>
          <button
            onClick={() => dismiss(false)}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              padding: "9px 18px",
              borderRadius: "40px",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            Só essenciais
          </button>
          <button
            onClick={() => dismiss(true)}
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              border: "none",
              color: "#fff",
              padding: "9px 22px",
              borderRadius: "40px",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              boxShadow: "0 4px 16px rgba(42,79,166,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            Aceitar todos ✓
          </button>
        </div>
      </div>
    </>
  );
}
