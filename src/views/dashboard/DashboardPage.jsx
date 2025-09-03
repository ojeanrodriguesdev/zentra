'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout';
import { AuthGuard } from '@/components/features/auth';
import { StatsCard } from '@/components/ui';
import { CreateProjectModal } from '@/components/features/projects';
import { useDashboardStats } from '@/lib/hooks';
import { FolderKanban, CheckSquare, Users } from 'lucide-react';

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const handleProjectCreated = () => {
    // Recarregar as estatísticas após criar um projeto
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                  Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Bem-vindo de volta! Aqui está um resumo das suas atividades.
                </p>
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
                  title="Tarefas Pendentes"
                  value={stats.tasks}
                  loading={loading}
                  error={error}
                  icon={CheckSquare}
                  color="orange"
                  subtitle="A fazer"
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
                    Atividade Recente
                  </h3>
                  
                  {loading ? (
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
                  ) : error ? (
                    <p className="text-red-500 text-sm">Erro ao carregar atividades</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 dark:text-white">
                            Firestore integrado com sucesso na dashboard
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Agora mesmo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-sm">+</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 dark:text-white">
                            {stats.projects} projetos ativos encontrados
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Dados em tempo real
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 dark:text-purple-400 text-sm">📊</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 dark:text-white">
                            Dashboard conectada ao Firestore
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Sistema funcionando
                          </p>
                        </div>
                      </div>
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
                    <button className="p-4 text-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        Nova Tarefa
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
    </AuthGuard>
  );
}
