'use client';

import { Button } from '@/components/ui';
import { useAuth } from '@/components/providers/auth';

export default function UserProfile({ 
  className = '',
  showLogoutButton = true,
  variant = 'card'
}) {
  const { user, signOut, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'Usuário'} 
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium">{user.displayName || user.email}</span>
        {showLogoutButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
          >
            Sair
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'Usuário'} 
            className="w-12 h-12 rounded-full"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {user.displayName || 'Usuário'}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.emailVerified && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
              ✓ Verificado
            </span>
          )}
        </div>
        {showLogoutButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
          >
            Sair
          </Button>
        )}
      </div>
    </div>
  );
}
