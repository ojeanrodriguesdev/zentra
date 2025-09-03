'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Aguardar um pouco para não interferir no carregamento inicial
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Verificar se o usuário já aceitou os cookies
      const cookiesAccepted = localStorage.getItem('zentra-cookies-accepted');
      if (!cookiesAccepted) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('zentra-cookies-accepted', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('zentra-cookies-accepted', 'false');
    setIsVisible(false);
  };

  if (!isLoaded || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-lg backdrop-blur-sm max-w-md mx-auto md:mx-0 md:max-w-lg">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Cookie className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Cookies & Privacidade
              </h3>
            </div>
            <button
              onClick={declineCookies}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
            Ao continuar navegando, você concorda com nossa{' '}
            <a 
              href="/privacy" 
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Política de Privacidade
            </a>.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={acceptCookies}
              className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Aceitar Todos
            </button>
            <button
              onClick={declineCookies}
              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-700 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Apenas Essenciais
            </button>
          </div>

          {/* Fine print */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
            Você pode alterar suas preferências a qualquer momento nas configurações.
          </p>
        </div>
      </div>
    </div>
  );
}
