'use client';

import { 
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import SidebarClock from './SidebarClock';
import SidebarItem from './SidebarItem';
import SidebarSection from './SidebarSection';
import { useAuth } from '@/components/providers/auth';

export default function Sidebar({ className = '' }) {
  const { signOut, user } = useAuth();

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: FolderKanban,
      label: 'Projects',
      href: '/projects'
    },
    {
      icon: CheckSquare,
      label: 'Tasks',
      href: '/tasks'
    },
    {
      icon: Users,
      label: 'Members',
      href: '/members'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings'
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirecionar para home após logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <aside className={`w-64 min-h-screen bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-700 flex flex-col ${className}`}>
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-slate-200 dark:border-zinc-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-lg">Z</span>
          </div>
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-heading">
            Zentra
          </h1>
        </div>
      </div>

      {/* Clock Section */}
      <SidebarClock />

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto">
        <SidebarSection>
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          ))}
        </SidebarSection>
      </div>

      {/* User Info & Logout Section */}
      <div className="p-6 border-t border-slate-200 dark:border-zinc-700 space-y-4">
        {/* User Info - Simple Text Only */}
        {user && (
          <div className="text-center">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user.displayName || user.email?.split('@')[0] || 'Usuário'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-left transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg group"
        >
          <LogOut 
            size={16} 
            className="text-red-500 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200"
          />
          <span className="font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200">
            Sair
          </span>
        </button>

        {/* Version */}
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Zentra Dashboard v1.0
        </div>
      </div>
    </aside>
  );
}
