import { redirect } from 'next/navigation';

export default function Marketplace() {
  // O Marketplace foi integrado na Loja Digital ABN
  // Redireccionar para a nova página unificada
  redirect('/loja');
}
