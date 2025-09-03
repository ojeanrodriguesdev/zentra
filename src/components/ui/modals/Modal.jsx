'use client';

import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={clsx(
          'relative w-full bg-white dark:bg-zinc-800 rounded-xl shadow-2xl transform transition-all border border-slate-200 dark:border-zinc-700',
          sizeClasses[size],
          className
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-heading">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Render no portal para garantir que aparece acima de tudo
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
