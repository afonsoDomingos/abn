'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Rocket, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function DashboardProgramasPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [userInscricoes, setUserInscricoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch active programs
      const pRes = await fetch('/api/programs');
      const pData = await pRes.json();
      if (pData.programs) {
        setPrograms(pData.programs.filter((p: any) => p.status === 'ativo'));
      }

      // 2. Fetch user's registrations
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.email) {
          const iRes = await fetch('/api/clube/inscricoes');
          const iData = await iRes.json();
          if (iData.inscricoes) {
            setUserInscricoes(
              iData.inscricoes.filter((i: any) => i.email?.toLowerCase() === u.email.toLowerCase())
            );
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar programas ABN...</div>;
  }

  return (
    <div style={{ maxWidth: '1050px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold" style={{ fontSize: '2rem', fontWeight: 800 }}>Programas de Incubação &amp; Aceleração</h1>
        <p style={{ opacity: 0.9, color: '#475569', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5, marginTop: '0.4rem' }}>
          Explore e participe nos programas da AfroBiz Network desenhados para acelerar a sua startup em África.
        </p>
      </header>

      {/* Seção 1: As minhas inscrições ativas */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <ShieldCheck size={22} color="var(--primary, #ff6b00)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Outfit' }}>
            Minhas Inscrições em Programas
          </h2>
        </div>

        {userInscricoes.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.04)', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0 0 1rem 0' }}>
              Ainda não possui candidatura registada em nenhum programa ativo.
            </p>
            <Link href="/programas" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}>
              Explorar Programas &amp; Inscrever-me <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {userInscricoes.map((item, idx) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.04)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Programa Ativo</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: item.status === 'aprovado' ? '#dcfce7' : '#fef3c7', color: item.status === 'aprovado' ? '#15803d' : '#b45309', padding: '3px 10px', borderRadius: '12px' }}>
                    {item.status === 'aprovado' ? '🟢 Aprovado' : '⏳ Em Verificação'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {item.programaTitulo || `Clube ABN — ${item.nivelAdesao}`}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  📅 Inscrito em: {new Date(item.createdAt).toLocaleDateString('pt-PT')}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <strong>Modalidade/Plano:</strong> {item.nivelAdesao?.toUpperCase() || 'Padrão'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção 2: Programas Disponíveis no Ecossistema */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Rocket size={22} color="var(--primary, #ff6b00)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Outfit' }}>
            Programas Disponíveis na ABN
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {programs.map((prog) => (
            <div key={prog._id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', background: '#fff7ed', border: '1px solid #ffedd5', padding: '4px 10px', borderRadius: '20px' }}>
                  {prog.phase || 'Aceleração'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>⏱️ {prog.duration || 'Por Edição'}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Outfit' }}>
                {prog.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {prog.description}
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  {prog.isClub ? '🏛️ Membros ABN' : '🎓 Formação & Mentoria'}
                </div>
                <Link href="/programas" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                  Saber Mais &amp; Inscrever-me
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
