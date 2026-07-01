import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Inicie sessão na sua conta ABN – AfroBiz Network para acessar o seu painel de controle, gerir as suas startups ou contratar serviços.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
