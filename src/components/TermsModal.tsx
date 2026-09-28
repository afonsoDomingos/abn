'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolling(true);
      
      // Verificar se chegou ao fim
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setHasScrolledToEnd(true);
      }
    };

    const modalContent = document.getElementById('terms-modal-content');
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => modalContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="terms-modal-header">
          <h2>Termos e Condições da Loja Digital ABN</h2>
          <button className="terms-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div 
          id="terms-modal-content"
          className="terms-modal-content"
        >
          <div className="terms-intro">
            <p>
              Antes de utilizar a Loja Digital ABN, por favor leia e aceite os Termos e Condições.
            </p>
            <p>
              Estes Termos regem o uso da Loja Digital ABN e aplicam-se sem prejuízo da Lei n.º 3/2017, de 9 de Janeiro (Lei de Transacções Electrónicas), e da Lei n.º 22/2009, de 28 de Setembro (Lei de Defesa do Consumidor).
            </p>
          </div>

          <div className="terms-summary">
            <h3>Pontos Principais:</h3>
            <ul>
              <li>A Loja é gerida pela AFROBIZ NETWORK ABN, SU, LDA</li>
              <li>Abrir uma loja na ABN é gratuito</li>
              <li>Comissões são cobradas sobre cada pedido concluído</li>
              <li>Pagamentos processados através de M-Pesa, e-Mola e transferência bancária</li>
              <li>Direito de desistência de 7 dias para produtos e serviços</li>
              <li>Comprador pode desistir da compra sem indicar motivo</li>
              <li>Reembolsos processados em até 10 dias úteis</li>
              <li>Dados pessoais protegidos conforme a lei</li>
            </ul>
          </div>

          <div className="terms-full-link">
            <a href="/loja/termos" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              Ler os Termos e Condições completos
            </a>
          </div>

          <div className="terms-acceptance">
            <label className="terms-checkbox">
              <input 
                type="checkbox" 
                id="terms-accept"
                checked={hasScrolledToEnd}
                onChange={(e) => setHasScrolledToEnd(e.target.checked)}
              />
              <span>
                Li e aceito os Termos e Condições da Loja Digital ABN
              </span>
            </label>
          </div>
        </div>

        <div className="terms-modal-footer">
          <button className="btn-outline" onClick={onClose}>
            Voltar mais tarde
          </button>
          <button 
            className="btn-primary" 
            onClick={onAccept}
            disabled={!hasScrolledToEnd}
          >
            Aceitar e Continuar
          </button>
        </div>

        <style jsx>{`
          .terms-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }

          .terms-modal {
            background: #ffffff;
            border-radius: 16px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            margin: auto;
          }

          .terms-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #eaeaea;
          }

          .terms-modal-header h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: #1c1917;
            margin: 0;
          }

          .terms-modal-close {
            background: transparent;
            border: none;
            color: #64748b;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .terms-modal-close:hover {
            background: #f1f5f9;
            color: #1c1917;
          }

          .terms-modal-content {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
            max-height: 400px;
          }

          .terms-intro {
            margin-bottom: 1.5rem;
          }

          .terms-intro p {
            margin: 0 0 0.75rem;
            line-height: 1.6;
            color: #475569;
            font-size: 0.95rem;
          }

          .terms-summary {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
          }

          .terms-summary h3 {
            font-family: 'Outfit', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            color: #1c1917;
            margin: 0 0 0.75rem;
          }

          .terms-summary ul {
            margin: 0;
            padding-left: 1.25rem;
          }

          .terms-summary li {
            margin-bottom: 0.5rem;
            line-height: 1.5;
            color: #475569;
            font-size: 0.9rem;
          }

          .terms-full-link {
            margin-bottom: 1.5rem;
          }

          .terms-full-link a {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #de9b35;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: color 0.2s;
          }

          .terms-full-link a:hover {
            color: #b8860b;
            text-decoration: underline;
          }

          .terms-acceptance {
            padding-top: 1rem;
            border-top: 1px solid #eaeaea;
          }

          .terms-checkbox {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            cursor: pointer;
          }

          .terms-checkbox input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin-top: 0.15rem;
            cursor: pointer;
          }

          .terms-checkbox span {
            font-size: 0.9rem;
            color: #1c1917;
            line-height: 1.4;
          }

          .terms-modal-footer {
            display: flex;
            gap: 1rem;
            padding: 1.5rem;
            border-top: 1px solid #eaeaea;
          }

          .terms-modal-footer button {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .terms-modal-footer button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .btn-outline {
            background: transparent;
            border: 1px solid #e2e8f0;
            color: #64748b;
          }

          .btn-outline:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
          }

          .btn-primary {
            background: linear-gradient(135deg, #de9b35 0%, #f5c76e 100%);
            border: none;
            color: #ffffff;
          }

          .btn-primary:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(222, 155, 53, 0.3);
          }

          @media (max-width: 640px) {
            .terms-modal {
              max-height: 95vh;
            }

            .terms-modal-content {
              max-height: 300px;
            }

            .terms-modal-footer {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
