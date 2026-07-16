'use client';

export default function DashboardLoading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      width: '100%',
      gap: '1rem',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <style>{`
        @keyframes spin-dash {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-dash {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
      <div style={{
        width: '45px',
        height: '45px',
        border: '3px solid rgba(212, 175, 55, 0.1)',
        borderTop: '3px solid #d4af37',
        borderRadius: '50%',
        animation: 'spin-dash 0.8s linear infinite'
      }} />
      <p style={{
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        color: 'rgba(255, 255, 255, 0.6)',
        animation: 'pulse-dash 1.5s ease-in-out infinite'
      }}>
        Carregando...
      </p>
    </div>
  );
}
