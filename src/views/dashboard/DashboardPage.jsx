'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout';
import { AuthGuard } from '@/components/features/auth';
import { StatsCard, Button } from '@/components/ui';
import { CreateProjectModal } from '@/components/features/projects';
import { CreateTaskFromDashboardModal } from '@/components/features/tasks';
import { useDashboardStats, useActivities } from '@/lib/hooks';
import { useAuth } from '@/components/providers/auth';
import { FolderKanban, CheckSquare, Users, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error } = useDashboardStats();
  const { activities, loading: activitiesLoading, formatTimeAgo } = useActivities(user?.uid, 5);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const handleProjectCreated = () => {
    // Recarregar as estatísticas após criar um projeto
    window.location.reload();
  };

  const handleTaskCreated = () => {
    // Recarregar as estatísticas após criar uma tarefa
    window.location.reload();
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                      Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      Bem-vindo de volta! Aqui está um resumo das suas atividades.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <Button
                      onClick={() => setIsCreateTaskModalOpen(true)}
                      variant="outline"
                      className="border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <Plus size={16} className="mr-2" />
                      Nova Tarefa
                    </Button>
                    <Button  className="border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20" onClick={() => setIsCreateProjectModalOpen(true)}>
                      <Plus size={16} className="mr-2" />
                      Novo Projeto
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsCard
                  title="Projetos Ativos"
                  value={stats.projects}
                  loading={loading}
                  error={error}
                  icon={FolderKanban}
                  color="purple"
                  subtitle="Em andamento"
                />
                <StatsCard
                  title="Total de Tarefas"
                  value={stats.tasks}
                  loading={loading}
                  error={error}
                  icon={CheckSquare}
                  color="orange"
                  subtitle="Todas as tarefas"
                />
                <StatsCard
                  title="Membros da Equipe"
                  value={stats.members}
                  loading={loading}
                  error={error}
                  icon={Users}
                  color="blue"
                  subtitle="Ativos"
                />
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                    Atividade da Equipe
                  </h3>
                  
                  {activitiesLoading ? (
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center space-x-3 animate-pulse">
                          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-slate-400 dark:text-slate-500 text-lg">📋</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Nenhuma atividade recente
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                        Crie projetos e tarefas para ver atividades aqui
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map(activity => (
                        <div key={activity.id} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                            <span className={`${activity.iconColor} text-sm`}>
                              {activity.icon}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 dark:text-white">
                              {activity.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {activity.subtitle} • {formatTimeAgo(activity.time)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                    Ações Rápidas
                  </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                <button 
                                  onClick={() => setIsCreateProjectModalOpen(true)}
                                  className="p-4 text-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
                                >
                                  <div className="text-2xl mb-2">📁</div>
                                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                    Novo Projeto
                                  </p>
                                </button>

                    <button className="p-4 text-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 transition-colors group">
                      <div className="text-2xl mb-2">👥</div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                        Convidar Membro
                      </p>
                    </button>
                    <button className="p-4 text-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                        Ver Relatórios
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <CreateTaskFromDashboardModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </AuthGuard>
  );
}
