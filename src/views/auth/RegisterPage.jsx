'use client';

import { useState } from 'react';
import { AuthGuard, GoogleLoginButton } from '@/components/features/auth';

import { registerWithEmail } from '@/lib/firebase';

export default function RegisterPage() {

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Validação de senha
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    }
    
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    if (!specialCharRegex.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial');
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validação em tempo real para senha
    if (name === 'password') {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        setErrors(prev => ({
          ...prev,
          password: passwordErrors[0]
        }));
      }
      
      // Verificar se a confirmação de senha ainda é válida
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'As senhas não coincidem'
        }));
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }

    // Validação para confirmação de senha
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'As senhas não coincidem'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Register form submitted'); // Debug temporário
    setIsLoading(true);
    setErrors({});

    // Validações
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.fullName) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória';
    if (!formData.gender) newErrors.gender = 'Gênero é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória';

    // Validação de senha
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Firebase vai validar se email já existe automaticamente

    // Confirmação de senha (verificação final)
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Criar conta no Firebase Authentication
      await registerWithEmail(formData.email, formData.password, {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
      });

      // Firebase vai automaticamente logar o usuário
      // O AuthContext vai detectar e redirecionar
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Erro no registro:', error);
      
      // Tratar erros específicos do Firebase
      let errorMessage;
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrors({ email: 'Este email já está cadastrado. Faça login.' });
          setIsLoading(false);
          return;
        case 'auth/weak-password':
          setErrors({ password: 'Senha muito fraca. Use pelo menos 6 caracteres.' });
          setIsLoading(false);
          return;
        case 'auth/invalid-email':
          setErrors({ email: 'Email inválido.' });
          setIsLoading(false);
          return;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/senha não habilitado no Firebase Console. Ative Authentication > Email/Password.';
          break;
        default:
          errorMessage = error.message || 'Erro ao criar conta. Tente novamente.';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    console.log('Google login bem-sucedido:', user);
    window.location.href = '/dashboard';
  };

  const handleGoogleError = (error) => {
    console.error('Erro no Google login:', error);
    setErrors({ submit: 'Erro ao fazer login com Google. Tente novamente.' });
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
        <div className="relative w-full max-w-4xl">
          {/* Card de registro */}
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
                Criar conta
              </h2>
              <p className="text-slate-600 text-sm">
                Preencha os dados abaixo para começar sua jornada
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
              
              {/* Grid de 2 colunas para campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna 1 */}
                <div className="space-y-4">
                  {/* Nome Completo */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-2">
                      Data de Nascimento
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                    )}
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="space-y-4">
                  {/* Gênero */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">
                      Gênero
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="" className="bg-white text-slate-800">Selecione</option>
                      <option value="masculino" className="bg-white text-slate-800">Masculino</option>
                      <option value="feminino" className="bg-white text-slate-800">Feminino</option>
                      <option value="outro" className="bg-white text-slate-800">Outro</option>
                      <option value="prefiro-nao-dizer" className="bg-white text-slate-800">Prefiro não dizer</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                    )}
                  </div>

                  {/* Senha */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                      Senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Mínimo 8 caracteres + 1 especial"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      Mínimo 8 caracteres com pelo menos 1 caractere especial
                    </p>
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                      Confirmar Senha
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Digite a senha novamente"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões em grid de 2 colunas para mobile, 3 para desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Botão Criar Conta */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="md:col-span-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    'Criar conta'
                  )}
                </button>

                {/* Divisor */}
                <div className="md:col-span-3 relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-slate-500">ou continue com</span>
                  </div>
                </div>

                {/* Login com Google */}
                <GoogleLoginButton 
                  className="md:col-span-3 bg-white hover:bg-purple-50 border border-purple-200 text-slate-700"
                  variant="outline"
                  size="lg"
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                >
                  Continuar com Google
                </GoogleLoginButton>
              </div>

              {/* Link para login */}
              <div className="text-center pt-4">
                <p className="text-sm text-slate-600">
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => window.location.href = '/login'}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Fazer login
                  </button>
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
