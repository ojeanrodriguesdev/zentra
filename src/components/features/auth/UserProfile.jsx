'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { useAuth } from '@/components/providers/auth';

export default function UserProfile({ 
  className = '',
  showLogoutButton = true,
  variant = 'card'
}) {
  const { user, signOut, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  if (variant === 'header') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-500 flex items-center justify-center">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Usuário'} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        {/* User info */}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {user.displayName || user.email?.split('@')[0] || 'Usuário'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
        </div>
        
        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </button>
          
          {/* Dropdown Panel */}
          {isDropdownOpen && (
            <>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-slate-200 dark:border-zinc-700 py-1 z-50">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    window.location.href = '/dashboard';
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <svg 
                    className="w-4 h-4 mr-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                  </svg>
                  Dashboard
                </button>
                
                {showLogoutButton && (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full mr-1 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <svg 
                      className="w-4 h-4 mr-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                      />
                    </svg>
                    Sair
                  </button>
                )}
              </div>
              
              {/* Backdrop */}
              <button
                type="button"
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsDropdownOpen(false)}
                onKeyDown={(e) => e.key === 'Escape' && setIsDropdownOpen(false)}
                aria-label="Fechar dropdown"
              />
            </>
          )}
        </div>
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
