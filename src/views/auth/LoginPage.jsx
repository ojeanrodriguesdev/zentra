'use client';

import { useState } from 'react';

import { GoogleLoginButton, AuthGuard } from '@/components/features/auth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular login
    setTimeout(() => {
      console.log('Login tradicional:', formData);
      setIsLoading(false);
      // TODO: Implementar login com email/senha se necessário
    }, 1500);
  };

  const handleGoogleSuccess = (user) => {
    console.log('Login Google bem-sucedido:', user);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleGoogleError = (error) => {
    console.error('Erro no login Google:', error);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      {/* Background com overlay escuro */}
      <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        {/* Padrão de fundo sutil */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        ></div>
        
        {/* Container principal */}
        <div className="relative w-full max-w-md">
          {/* Card de login */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">Z</span>
                </div>
                <h1 className="text-3xl font-bold text-white font-heading">Zentra</h1>
              </div>
              
              <h2 className="text-2xl font-semibold text-white mb-2 font-heading">
                Welcome back
              </h2>
              <p className="text-slate-300 text-sm">
                Acesse sua conta para continuar organizando sua rotina
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              {/* Opções */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-2" 
                  />
                  <span className="text-sm text-slate-300">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Botão Login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </button>

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-transparent text-slate-400">or continue with</span>
                </div>
              </div>

              {/* Login com Google */}
              <div className="space-y-4">
                <GoogleLoginButton 
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                  variant="outline"
                  size="lg"
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                >
                  Continue with Google
                </GoogleLoginButton>
              </div>

              {/* Link para cadastro */}
              <div className="text-center pt-4">
                <p className="text-sm text-slate-300">
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Criar conta
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/30 rounded-full blur-sm"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500/20 rounded-full blur-sm"></div>
          <div className="absolute top-1/2 -right-8 w-6 h-6 bg-pink-500/30 rounded-full blur-sm"></div>
        </div>
      </div>
    </AuthGuard>
  );
}
