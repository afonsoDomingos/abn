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
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "min(520px, calc(100vw - 2rem))",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "0.85rem 1.1rem",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)",
          display: "flex",
          gap: "0.9rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{
          width: "36px", height: "36px", flexShrink: 0,
          background: "#fff5ed",
          border: "1px solid #ffedd5",
          borderRadius: "10px", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "1.2rem"
        }}>
          🍪
        </div>

        <div style={{ flex: 1, minWidth: "180px" }}>
          <p style={{ color: "#0f172a", fontWeight: 700, margin: "0 0 2px 0", fontFamily: "Outfit, sans-serif", fontSize: "0.88rem" }}>
            A ABN utiliza cookies
          </p>
          <p style={{ color: "#475569", margin: 0, fontSize: "0.76rem", lineHeight: 1.45 }}>
            Usamos cookies para melhorar a sua experiência.{" "}
            <Link href="/privacidade" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>
              Política de Privacidade
            </Link>
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, alignItems: "center" }}>
          <button
            onClick={() => dismiss(false)}
            style={{
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              color: "#475569",
              padding: "6px 12px",
              borderRadius: "30px",
              fontSize: "0.76rem",
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
              background: "var(--primary)",
              border: "none",
              color: "#ffffff",
              padding: "6px 14px",
              borderRadius: "30px",
              fontSize: "0.76rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              boxShadow: "0 2px 8px rgba(255, 107, 0, 0.25)",
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
