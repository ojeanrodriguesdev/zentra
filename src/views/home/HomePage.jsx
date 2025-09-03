'use client';

import { Header } from '@/components/layout';
import { useAuth } from '@/components/providers/auth';
import { HeroSection } from '@/components/sections';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        // Usuário logado - redirecionar para dashboard
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Redirecionando para o dashboard...
            </h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
          <script dangerouslySetInnerHTML={{
            __html: `setTimeout(() => window.location.href = '/dashboard', 1000)`
          }} />
        </div>
      ) : (
        // Usuário não logado - mostrar Hero Section
        <div>
          <Header />
          <HeroSection />
        </div>
      )}
    </div>
  );
}
