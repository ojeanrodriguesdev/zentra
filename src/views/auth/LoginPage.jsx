'use client';

import { useState } from 'react';

import { GoogleLoginButton, AuthGuard } from '@/components/features/auth';
import { loginWithEmail } from '@/lib/firebase';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted'); // Debug temporário
    setIsLoading(true);
    setErrors({});

    // Validações básicas
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Login no Firebase Authentication
      const user = await loginWithEmail(formData.email, formData.password);

      // Firebase vai automaticamente atualizar o AuthContext
      // Redirecionar para dashboard
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Tratar erros específicos do Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          setErrors({ email: 'Email não cadastrado. Crie uma conta primeiro.' });
          break;
        case 'auth/wrong-password':
          setErrors({ password: 'Senha incorreta. Tente novamente.' });
          break;
        case 'auth/invalid-email':
          setErrors({ email: 'Email inválido.' });
          break;
        case 'auth/user-disabled':
          setErrors({ submit: 'Esta conta foi desabilitada.' });
          break;
        case 'auth/too-many-requests':
          setErrors({ submit: 'Muitas tentativas. Tente novamente mais tarde.' });
          break;
        default:
          setErrors({ submit: error.message || 'Erro no login. Tente novamente.' });
      }
      setIsLoading(false);
    }
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      {/* Background com overlay claro */}
      <div className="min-h-screen relative bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
        {/* Padrão de fundo sutil */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        ></div>
        
        {/* Container principal */}
        <div className="relative w-full max-w-md">
          {/* Card de login */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-purple-200/50 shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">Z</span>
                </div>
                <h1 className="text-3xl font-bold text-purple-700 font-heading">Zentra</h1>
              </div>
              
              <h2 className="text-2xl font-semibold text-slate-800 mb-2 font-heading">
                Welcome back
              </h2>
              <p className="text-slate-600 text-sm">
                Acesse sua conta para continuar organizando sua rotina
              </p>
            </div>

            {/* Erro geral */}
            {errors.submit && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{errors.submit}</p>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-purple-200 focus:ring-purple-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-purple-200 focus:ring-purple-500'
                  }`}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Opções */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-purple-200 bg-white text-purple-600 focus:ring-purple-500 focus:ring-2" 
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
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
                  <div className="w-full border-t border-purple-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-transparent text-slate-500">or continue with</span>
                </div>
              </div>

              {/* Login com Google */}
              <div className="space-y-4">
                <GoogleLoginButton 
                  className="w-full bg-white hover:bg-purple-50 border border-purple-200 text-slate-700"
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
                <p className="text-sm text-slate-600">
                  Não tem uma conta?{' '}
                  <a
                    href="/register"
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors cursor-pointer"
                  >
                    Criar conta
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-400/40 rounded-full blur-sm"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-300/30 rounded-full blur-sm"></div>
          <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-500/40 rounded-full blur-sm"></div>
        </div>
      </div>
    </AuthGuard>
  );
}
