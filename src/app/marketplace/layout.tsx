import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace de Serviços Profissionais',
  description: 'Contrate especialistas em Web Design, Programação, Marketing Digital e Consultoria Estratégica para impulsionar o seu negócio em África.',
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
