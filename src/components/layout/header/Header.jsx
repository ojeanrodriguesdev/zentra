'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import Logo from '../logo/Logo';
import NavLinks from '../navigation/NavLinks';
import AuthButtons from '../navigation/AuthButtons';
import MobileMenu from '../navigation/MobileMenu';
import { useAuth } from '@/components/providers/auth';

export default forwardRef(function Header({
  className = '',
  variant = 'default',
  fixed = false,
  sticky = true,
  transparent = false,
  children,
  ...props
}, ref) {
  const { isAuthenticated } = useAuth();

  const headerClasses = clsx(
    'w-full transition-all duration-300',
    {
      // Base styles
      'border-b border-slate-200/60 dark:border-slate-700/60': !transparent,
      'bg-white/80 dark:bg-slate-900/80': !transparent,
      'backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60': !transparent,
      
      // Transparent variant
      'bg-transparent border-transparent': transparent,
      
      // Position variants
      'fixed top-0 z-50': fixed,
      'sticky top-0 z-40': sticky && !fixed,
      'relative': !sticky && !fixed,
    },
    className
  );

  const containerClasses = clsx(
    'mx-auto max-w-7xl px-6 md:px-8',
    {
      'h-16': variant === 'default',
      'h-20': variant === 'large',
    }
  );

  const contentClasses = clsx(
    'flex items-center h-full relative'
  );

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <header
      ref={ref}
      className={headerClasses}
      {...props}
    >
      <div className={containerClasses}>
        <div className={contentClasses}>
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo 
              variant={variant === 'large' ? 'large' : 'default'}
              onClick={handleLogoClick}
            />
          </div>

          {/* Desktop Navigation - Links próximos ao logo */}
          <div className="hidden md:flex items-center ml-8">
            <NavLinks 
              isAuthenticated={isAuthenticated}
            />
          </div>

          {/* Spacer para empurrar AuthButtons para a direita */}
          <div className="flex-1"></div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center">
            <AuthButtons 
              variant={variant === 'large' ? 'large' : 'default'}
            />
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            isAuthenticated={isAuthenticated}
          />

          {/* Custom children (if provided) */}
          {children && (
            <div className="flex items-center space-x-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
});