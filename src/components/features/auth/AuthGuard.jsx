'use client';

import { useAuth } from '@/components/providers/auth';
import { Loading } from '@/components/shared';

export default function AuthGuard({ 
  children, 
  fallback = null,
  requireAuth = true,
  redirectTo = '/login'
}) {
  const { user, loading, isAuthenticated } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Verificando autenticação..." />
      </div>
    );
  }

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return fallback;
    }
    
    // Em ambiente client-side, redirecionar
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
      return null;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página.</p>
          <a href={redirectTo} className="text-blue-600 hover:underline">
            Fazer login
          </a>
        </div>
      </div>
    );
  }

  // Se não requer autenticação mas usuário está logado (ex: página de login)
  if (!requireAuth && isAuthenticated) {
    if (fallback) {
      return fallback;
    }
    
    // Redirecionar para dashboard ou home
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
      return null;
    }
  }

  // Renderizar children se todas as condições forem atendidas
  return children;
}
