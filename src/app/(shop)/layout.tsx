import { Sidebar } from '@/components/shop/sidebar';
import { TopBar } from '@/components/shop/top-bar';
import { MobileTabBar } from '@/components/shop/mobile-tab-bar';
import { Footer } from '@/components/shop/footer';
import { getSession } from '@/lib/session';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const isAuthenticated = Boolean(session);

  return (
    <div className="flex min-h-screen">
      <Sidebar isAuthenticated={isAuthenticated} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar isAuthenticated={isAuthenticated} />
        <main id="contenu-principal" className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
        <Footer />
      </div>
      <MobileTabBar isAuthenticated={isAuthenticated} />
    </div>
  );
}
