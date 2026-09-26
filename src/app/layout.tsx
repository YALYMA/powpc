import type { Metadata } from 'next';
import './globals.css';
import { SITE } from '@/lib/constants';
import { CartProvider } from '@/components/cart-provider';
import { FavoritesProvider } from '@/components/favorites-provider';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - Batteries et chargeurs PC au Senegal`,
    template: `%s | ${SITE.name}`
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    siteName: SITE.name,
    title: `${SITE.name} - ${SITE.slogan}`,
    description: SITE.description
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
