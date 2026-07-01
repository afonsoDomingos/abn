'use client';

import { useEffect, useState } from 'react';
import styles from './Mensagens.module.css';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'novo' | 'lido' | 'respondido';
  createdAt: string;
}

export default function AdminMensagensPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'todos' | 'novo' | 'lido' | 'respondido'>('todos');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) setMessages(data.contacts);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setMessages(prev =>
      prev.map(m => m._id === id ? { ...m, status: status as any } : m)
    );
    if (selected?._id === id) {
      setSelected(prev => prev ? { ...prev, status: status as any } : null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar esta mensagem?')) return;
    await fetch('/api/contact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages(prev => prev.filter(m => m._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const filtered = filter === 'todos' ? messages : messages.filter(m => m.status === filter);

  const counts = {
    todos: messages.length,
    novo: messages.filter(m => m.status === 'novo').length,
    lido: messages.filter(m => m.status === 'lido').length,
    respondido: messages.filter(m => m.status === 'respondido').length,
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="text-gradient-gold">Mensagens de Contacto</h1>
        <p>Gerencie as mensagens recebidas através do formulário de contacto.</p>
      </div>

      <div className={styles.filterBar}>
        {(['todos', 'novo', 'lido', 'respondido'] as const).map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={`${styles.badge} ${styles[f]}`}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Messages List */}
        <div className={styles.list}>
          {loading ? (
            <div className={styles.empty}>A carregar mensagens...</div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>Nenhuma mensagem encontrada.</div>
          ) : (
            filtered.map(msg => (
              <div
                key={msg._id}
                className={`${styles.messageCard} glass ${selected?._id === msg._id ? styles.selectedCard : ''}`}
                onClick={() => {
                  setSelected(msg);
                  if (msg.status === 'novo') updateStatus(msg._id, 'lido');
                }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.senderInfo}>
                    <div className={styles.avatar}>{msg.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <strong>{msg.name}</strong>
                      <span>{msg.email}</span>
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[msg.status]}`}>
                    {msg.status}
                  </span>
                </div>
                <p className={styles.preview}>{msg.message.slice(0, 80)}...</p>
                <span className={styles.date}>
                  {new Date(msg.createdAt).toLocaleDateString('pt-PT', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className={`${styles.detail} glass`}>
          {selected ? (
            <>
              <div className={styles.detailHeader}>
                <div className={styles.senderBig}>
                  <div className={styles.avatarBig}>{selected.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3>{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className={styles.emailLink}>{selected.email}</a>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${styles[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              <div className={styles.messageBody}>
                <p>{selected.message}</p>
              </div>

              <div className={styles.detailDate}>
                Recebida em {new Date(selected.createdAt).toLocaleString('pt-PT')}
              </div>

              <div className={styles.actions}>
                <a
                  href={`mailto:${selected.email}?subject=Re: Mensagem ABN`}
                  className="btn-primary"
                >
                  ✉️ Responder por Email
                </a>
                <button
                  className="btn-secondary"
                  onClick={() => updateStatus(selected._id, 'respondido')}
                  disabled={selected.status === 'respondido'}
                >
                  ✓ Marcar como Respondido
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteMessage(selected._id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noSelection}>
              <div className={styles.noSelectionIcon}>💬</div>
              <p>Selecione uma mensagem para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
