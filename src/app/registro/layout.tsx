import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Conta',
  description: 'Registe-se na ABN – AfroBiz Network. Crie o perfil do seu negócio, junte-se ao ecossistema de startups e PMEs em África e aceda a mentoria e investidores.',
};

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
