'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout';
import { AuthGuard } from '@/components/features/auth';
import { StatsCard, Button, Tooltip } from '@/components/ui';
import { CreateProjectModal } from '@/components/features/projects';
import { CreateTaskFromDashboardModal } from '@/components/features/tasks';
import { useDashboardStats, useActivities, useDashboardData } from '@/lib/hooks';
import { useAuth } from '@/components/providers/auth';
import { FolderKanban, CheckSquare, Users, Plus, ExternalLink, ChevronLeft, ChevronRight, Calendar, Target, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { stats, loading, error } = useDashboardStats();
  const { activities, loading: activitiesLoading, formatTimeAgo } = useActivities(user?.uid, 10);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  
  // Paginação das atividades
  const [activitiesPage, setActivitiesPage] = useState(0);
  const activitiesPerPage = 3;
  
  // Dados otimizados para dashboard (evita índices compostos)
  const { recentProjects, pendingTasks, loading: dashboardLoading } = useDashboardData(user?.uid);

  const handleProjectCreated = () => {
    // Recarregar as estatísticas após criar um projeto
    window.location.reload();
  };

  const handleTaskCreated = () => {
    // Recarregar as estatísticas após criar uma tarefa
    window.location.reload();
  };

  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case 'task_created':
      case 'task_updated':
      case 'task_completed':
        router.push('/tasks');
        break;
      case 'project_created':
      case 'project_updated':
        router.push('/projects');
        break;
      case 'member_joined':
      case 'member_added':
        router.push('/members');
        break;
      default:
        // Para atividades genéricas, redirecionar baseado no tipo da atividade
        if (activity.data?.type === 'task') {
          router.push('/tasks');
        } else if (activity.data?.type === 'project') {
          router.push('/projects');
        } else if (activity.data?.type === 'member') {
          router.push('/members');
        }
        break;
    }
  };

  const getActivityTooltip = (activity) => {
    switch (activity.type) {
      case 'task_created':
      case 'task_updated':
      case 'task_completed':
        return 'Clique para ver todas as tarefas';
      case 'project_created':
      case 'project_updated':
        return 'Clique para ver todos os projetos';
      case 'member_joined':
      case 'member_added':
        return 'Clique para ver todos os membros';
      default:
        return 'Clique para se redirecionar';
    }
  };

  // Paginação das atividades
  const paginatedActivities = activities.slice(
    activitiesPage * activitiesPerPage, 
    (activitiesPage + 1) * activitiesPerPage
  );
  const totalPages = Math.ceil(activities.length / activitiesPerPage);
  
  const nextPage = () => {
    if (activitiesPage < totalPages - 1) {
      setActivitiesPage(activitiesPage + 1);
    }
  };
  
  const prevPage = () => {
    if (activitiesPage > 0) {
      setActivitiesPage(activitiesPage - 1);
    }
  };

  // Formatação de dados
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'completed': return 'text-blue-600 dark:text-blue-400';
      case 'paused': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };


  const renderActivitiesContent = () => {
    if (activitiesLoading) {
      return (
        <div className="flex flex-col space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center space-x-3 animate-pulse w-full px-2 py-2">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activities.length === 0) {
      return (
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
      );
    }

    return (
      <div className="flex flex-col space-y-3">
        {paginatedActivities.map(activity => (
          <Tooltip 
            key={activity.id}
            content={getActivityTooltip(activity)}
            delay={1000}
            position="top"
            className="w-full"
          >
            <button 
              className="flex items-center space-x-3 w-full text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700/20 rounded-md px-2 py-2 transition-all duration-200 group border-none bg-transparent"
              onClick={() => handleActivityClick(activity)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleActivityClick(activity);
                }
              }}
              type="button"
              aria-label={`Ir para ${getActivityTooltip(activity).replace('Clique para ', '')}`}
            >
              <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className={`${activity.iconColor} text-sm`}>
                  {activity.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {activity.subtitle} • {formatTimeAgo(activity.time)}
                </p>
              </div>
              <ExternalLink 
                size={12} 
                className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" 
              />
            </button>
          </Tooltip>
        ))}
      </div>
    );
  };

  // Renderizar projetos recentes
  const renderRecentProjects = () => {
    const projects = recentProjects.slice(0, 4);
    
    if (dashboardLoading) {
      return (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="text-center py-6">
          <FolderKanban className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Nenhum projeto recente</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => router.push('/projects')}
            className="flex items-center justify-between w-full text-left hover:bg-slate-50 dark:hover:bg-zinc-700/20 rounded-md p-2 transition-colors group"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <FolderKanban size={16} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="text-sm text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {project.name}
              </span>
            </div>
            <span className={`text-xs ${getStatusColor(project.status)} flex-shrink-0`}>
              {(() => {
                if (project.status === 'active') return 'Ativo';
                if (project.status === 'completed') return 'Concluído';
                return 'Pausado';
              })()}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Renderizar tarefas pendentes
  const renderPendingTasks = () => {
    const tasks = pendingTasks.slice(0, 4);
    
    if (dashboardLoading) {
      return (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="text-center py-6">
          <CheckSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Nenhuma tarefa pendente</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tasks.map(task => (
          <button
            key={task.id}
            onClick={() => router.push('/tasks')}
            className="flex items-center justify-between w-full text-left hover:bg-slate-50 dark:hover:bg-zinc-700/20 rounded-md p-2 transition-colors group"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <CheckSquare size={16} className="text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <span className="text-sm text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {task.title}
              </span>
            </div>
            <span className={`text-xs ${getPriorityColor(task.priority)} flex-shrink-0`}>
              {(() => {
                if (task.priority === 'high') return 'Alta';
                if (task.priority === 'medium') return 'Média';
                return 'Baixa';
              })()}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Renderizar métricas rápidas
  const renderQuickMetrics = () => {
    // Calcular métricas de forma mais robusta
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    // Filtrar atividades de hoje (qualquer tipo de atividade)
    const activitiesToday = activities.filter(activity => {
      const activityDate = activity.time?.toDate ? activity.time.toDate() : new Date(activity.time);
      return activityDate >= today;
    });
    
    // Filtrar atividades desta semana
    const activitiesThisWeek = activities.filter(activity => {
      const activityDate = activity.time?.toDate ? activity.time.toDate() : new Date(activity.time);
      return activityDate >= weekAgo;
    });
    
    // Filtrar apenas tarefas concluídas hoje
    const tasksCompletedToday = activities.filter(activity => {
      const activityDate = activity.time?.toDate ? activity.time.toDate() : new Date(activity.time);
      return activityDate >= today && activity.type.includes('completed');
    });
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Atividades Hoje</span>
          </div>
          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {activitiesToday.length}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Esta Semana</span>
          </div>
          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
            {activitiesThisWeek.length}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Tarefas Pendentes</span>
          </div>
          <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {pendingTasks.length}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Concluídas Hoje</span>
          </div>
          <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {tasksCompletedToday.length}
          </span>
        </div>
      </div>
    );
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="ml-0 lg:ml-64 min-h-screen overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Projetos Ativos"
                  value={stats.projects}
                  loading={loading}
                  error={error}
                  icon={FolderKanban}
                  color="green"
                  subtitle="Em andamento"
                />
                <StatsCard
                  title="Projetos Concluídos"
                  value={stats.completedProjects}
                  loading={loading}
                  error={error}
                  icon={FolderKanban}
                  color="purple"
                  subtitle="Finalizados"
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

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Atividade da Equipe */}
                <div className="lg:col-span-1 xl:col-span-2">
                  <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6 shadow-sm h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Atividade da Equipe
                      </h3>
                      {totalPages > 1 && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={prevPage}
                            disabled={activitiesPage === 0}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft size={16} className="text-slate-600 dark:text-slate-400" />
                          </button>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {activitiesPage + 1} de {totalPages}
                          </span>
                          <button
                            onClick={nextPage}
                            disabled={activitiesPage === totalPages - 1}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight size={16} className="text-slate-600 dark:text-slate-400" />
                          </button>
                        </div>
                      )}
                    </div>
                    {renderActivitiesContent()}
                  </div>
                </div>

                {/* Projetos Recentes */}
                <div className="lg:col-span-1 xl:col-span-1">
                  <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6 shadow-sm h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Projetos Recentes
                      </h3>
                      <button
                        onClick={() => router.push('/projects')}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                      >
                        Ver todos
                      </button>
                    </div>
                    {renderRecentProjects()}
                  </div>
                </div>

                {/* Tarefas Pendentes */}
                <div className="lg:col-span-1 xl:col-span-1">
                  <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6 shadow-sm h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Tarefas Pendentes
                      </h3>
                      <button
                        onClick={() => router.push('/tasks')}
                        className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                      >
                        Ver todas
                      </button>
                    </div>
                    {renderPendingTasks()}
                  </div>
                </div>

                {/* Métricas Rápidas */}
                <div className="lg:col-span-2 xl:col-span-2">
                  <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6 shadow-sm h-full">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Métricas Rápidas
                    </h3>
                    {renderQuickMetrics()}
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="lg:col-span-2 xl:col-span-2">
                  <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6 shadow-sm h-full">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Ações Rápidas
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setIsCreateProjectModalOpen(true)}
                        className="flex items-center space-x-2 p-3 text-left rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
                      >
                        <FolderKanban size={20} className="text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          Novo Projeto
                        </span>
                      </button>

                      <button 
                        onClick={() => setIsCreateTaskModalOpen(true)}
                        className="flex items-center space-x-2 p-3 text-left rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
                      >
                        <CheckSquare size={20} className="text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                          Nova Tarefa
                        </span>
                      </button>

                      <button 
                        onClick={() => router.push('/projects')}
                        className="flex items-center space-x-2 p-3 text-left rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                      >
                        <Target size={20} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          Ver Relatórios
                        </span>
                      </button>

                      <button 
                        onClick={() => router.push('/members')}
                        className="flex items-center space-x-2 p-3 text-left rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 transition-colors group"
                      >
                        <Users size={20} className="text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                          Gerenciar Equipe
                        </span>
                      </button>
                    </div>
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
