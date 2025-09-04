'use client';

import clsx from 'clsx';
import { useAuth } from '@/components/providers/auth';
import { UserProfile } from '@/components/features/auth';

export default function AuthButtons({ 
  className = '',
  variant = 'default',
  ...props 
}) {
  const { isAuthenticated } = useAuth();

  const containerClasses = clsx(
    'flex items-center',
    {
      'space-x-2': variant === 'default',
      'space-x-3': variant === 'large',
      'flex-col space-y-3 space-x-0 w-full': variant === 'mobile',
    },
    className
  );

  const loginButtonClasses = clsx(
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    {
      // Default variant
      'px-4 py-2 text-sm': variant === 'default',
      'hover:bg-slate-100 dark:hover:bg-slate-800': variant === 'default',
      'text-slate-700 dark:text-slate-300': variant === 'default',
      
      // Large variant
      'px-6 py-3 text-base': variant === 'large',
      'hover:bg-slate-100 dark:hover:bg-slate-800': variant === 'large',
      'text-slate-700 dark:text-slate-300': variant === 'large',
      
      // Mobile variant
      'w-full px-6 py-3 text-base': variant === 'mobile',
      'hover:bg-slate-100 dark:hover:bg-slate-800': variant === 'mobile',
      'text-slate-700 dark:text-slate-300': variant === 'mobile',
    }
  );

  const primaryButtonClasses = clsx(
    'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600',
    'text-white shadow-md hover:shadow-lg',
    'transform hover:scale-105 active:scale-95',
    {
      // Default variant
      'px-4 py-2 text-sm': variant === 'default',
      
      // Large variant  
      'px-6 py-3 text-base': variant === 'large',
      
      // Mobile variant
      'w-full px-6 py-3 text-base': variant === 'mobile',
    }
  );

  const handleLogin = () => {
    window.location.href = '/login';
  };

  if (isAuthenticated) {
    return (
      <div className={containerClasses} {...props}>
        <UserProfile variant="header" />
      </div>
    );
  }

  return (
    <div className={containerClasses} {...props}>
      <button
        type="button"
        className={loginButtonClasses}
        onClick={handleLogin}
      >
        Entrar
      </button>
      <button
        type="button"
        className={primaryButtonClasses}
        onClick={handleLogin}
      >
        Começar grátis
      </button>
    </div>
  );
}
