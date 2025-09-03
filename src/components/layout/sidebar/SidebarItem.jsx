'use client';

import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function SidebarItem({ 
  icon: Icon, 
  label, 
  href, 
  isActive = false 
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determinar se o item está ativo baseado na rota atual
  const active = isActive || pathname === href;

  const handleClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 group',
        {
          // Estado ativo
          'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-r-4 border-purple-600': active,
          // Estado normal
          'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white': !active,
        }
      )}
    >
      <Icon 
        size={20} 
        className={clsx(
          'transition-colors duration-200',
          {
            'text-purple-600 dark:text-purple-400': active,
            'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200': !active,
          }
        )}
      />
      <span className={clsx(
        'font-medium transition-colors duration-200',
        {
          'text-purple-700 dark:text-purple-300': active,
          'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white': !active,
        }
      )}>
        {label}
      </span>
    </button>
  );
}
