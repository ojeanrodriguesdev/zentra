'use client';

import { useState } from 'react';
import clsx from 'clsx';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';

export default function MobileMenu({ 
  className = '',
  isAuthenticated = false,
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuButtonClasses = clsx(
    'md:hidden inline-flex items-center justify-center p-2 rounded-md',
    'text-slate-600 dark:text-slate-300',
    'hover:text-slate-900 dark:hover:text-white',
    'hover:bg-slate-100 dark:hover:bg-slate-800',
    'focus:outline-none focus:ring-2 focus:ring-purple-500',
    'transition-all duration-200'
  );

  const menuPanelClasses = clsx(
    'md:hidden absolute top-full left-0 right-0 z-50',
    'bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700',
    'shadow-lg backdrop-blur-sm',
    'transition-all duration-300 ease-in-out',
    {
      'opacity-100 translate-y-0': isOpen,
      'opacity-0 -translate-y-2 pointer-events-none': !isOpen,
    }
  );

  return (
    <div className={className} {...props}>
      {/* Menu Toggle Button */}
      <button
        type="button"
        className={menuButtonClasses}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Menu principal"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Panel */}
      <div className={menuPanelClasses}>
        <div className="px-6 py-4 space-y-4">
          <NavLinks 
            variant="mobile" 
            isAuthenticated={isAuthenticated}
          />
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <AuthButtons 
              variant="mobile"
            />
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
}
