'use client';

import { Button } from '@/components/ui';
import { useAuth } from '@/components/providers/auth';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  // Se usuário está logado, não mostra hero
  if (isAuthenticated) {
    return null;
  }

  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  const handleViewFeatures = () => {
    // Scroll para seção de funcionalidades (implementar depois)
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="relative py-16 md:py-24 lg:py-32">
          {/* Grid Layout - Mobile: 1 col, Desktop: 2 cols */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Conteúdo Textual - Left Side */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge/Tag */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                Produtividade sem complicação
              </div>

              {/* Título Principal */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="block">Organize seu tempo,</span>
                <span className="block text-purple-600 dark:text-purple-400">
                  clientes e tarefas
                </span>
                <span className="block">em um só lugar.</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                O Zentra é a central da sua rotina — CRM leve, agenda integrada e tarefas compartilhadas, tudo com simplicidade.
              </p>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Começar gratuitamente
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleViewFeatures}
                  className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
                >
                  Ver funcionalidades
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </div>

              {/* Social Proof / Stats */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Grátis para sempre
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sem cartão de crédito
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Setup em 2 minutos
                </div>
              </div>
            </div>

            {/* Ilustração/Imagem - Right Side */}
            <div className="relative">
              {/* Placeholder para ilustração - será uma ilustração minimalista */}
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                {/* Mock Dashboard */}
                <div className="space-y-6">
                  {/* Header do Dashboard */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Z</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">Zentra</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Cards do Dashboard */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="w-6 h-6 bg-blue-500 rounded mb-2"></div>
                      <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-2/3"></div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="w-6 h-6 bg-green-500 rounded mb-2"></div>
                      <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="w-6 h-6 bg-orange-500 rounded mb-2"></div>
                      <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                    </div>
                  </div>

                  {/* Lista de Tarefas */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-slate-400 rounded-full"></div>
                      <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-slate-400 rounded-full"></div>
                      <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded flex-1 w-3/4"></div>
                    </div>
                  </div>
                </div>

                {/* Elementos decorativos flutuantes */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full opacity-80 animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 rounded-full opacity-60 animate-pulse"></div>
              </div>

              {/* Background decorativo */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl transform rotate-3 scale-105 opacity-10 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
    </section>
  );
}
