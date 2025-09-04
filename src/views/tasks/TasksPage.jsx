'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout';
import { AuthGuard } from '@/components/features/auth';
import { Button } from '@/components/ui/buttons';
import { StatsCard } from '@/components/ui/stats';
import { CreateTaskModal, EditTaskModal, TaskDetailsModal, TaskCommentCount } from '@/components/features/tasks';
import { ConfirmationModal } from '@/components/ui/modals';
import { useAuth } from '@/components/providers/auth';
import { useMultipleProjectPermissions } from '@/lib/hooks';
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  Calendar,
  User,
  Clock,
  AlertCircle,
  Target,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { useFirestore } from '@/lib/hooks';
import { deleteTask } from '@/lib/firestore/tasks';

export default function TasksPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Buscar todas as tarefas do usuário
  const { data: tasks, loading, error } = useFirestore(
    'tasks', 
    user?.uid ? [['createdBy', '==', user.uid]] : [], 
    'createdAt'
  );

  // Extrair IDs únicos dos projetos das tarefas
  const projectIds = useMemo(() => [...new Set(tasks.map(task => task.projectId))], [tasks]);
  
  // Verificar permissões para todos os projetos
  const { permissions: projectPermissions } = useMultipleProjectPermissions(projectIds);

  // Filtrar tarefas baseado no filtro selecionado
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // Estatísticas das tarefas
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleTaskCreated = () => {
    setIsCreateModalOpen(false);
    // As tarefas são atualizadas automaticamente via Firestore realtime
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!selectedTask) return;

    setIsDeleting(true);
    try {
      await deleteTask(selectedTask.id);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTaskUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/20', 
        text: 'text-yellow-800 dark:text-yellow-400', 
        label: 'Pendente' 
      },
      in_progress: { 
        bg: 'bg-blue-100 dark:bg-blue-900/20', 
        text: 'text-blue-800 dark:text-blue-400', 
        label: 'Em Progresso' 
      },
      completed: { 
        bg: 'bg-green-100 dark:bg-green-900/20', 
        text: 'text-green-800 dark:text-green-400', 
        label: 'Concluída' 
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { 
        bg: 'bg-red-100 dark:bg-red-900/20', 
        text: 'text-red-800 dark:text-red-400', 
        label: 'Alta' 
      },
      medium: { 
        bg: 'bg-orange-100 dark:bg-orange-900/20', 
        text: 'text-orange-800 dark:text-orange-400', 
        label: 'Média' 
      },
      low: { 
        bg: 'bg-gray-100 dark:bg-gray-900/20', 
        text: 'text-gray-800 dark:text-gray-400', 
        label: 'Baixa' 
      }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Sem data';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  };

  const renderTasksContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 p-6 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
                  </div>
                </div>
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Erro ao carregar tarefas
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {error}
          </p>
        </div>
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <div className="text-center py-12">
          <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            {(() => {
              if (filter === 'all') return 'Nenhuma tarefa encontrada';
              if (filter === 'pending') return 'Nenhuma tarefa pendente';
              if (filter === 'in_progress') return 'Nenhuma tarefa em progresso';
              return 'Nenhuma tarefa concluída';
            })()}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {filter === 'all' 
              ? 'Comece criando sua primeira tarefa.' 
              : 'Tente alterar o filtro ou criar uma nova tarefa.'
            }
          </p>
          {projectIds.some(projectId => projectPermissions[projectId]?.canCreateTasks) && (
            <Button onClick={handleCreateTask}>
              <Plus size={16} className="mr-2" />
              Nova Tarefa
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <div 
            key={task.id} 
            className="bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewTask(task)}
                      className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    {projectPermissions[task.projectId]?.canEditTasks && (
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {projectPermissions[task.projectId]?.canDeleteTasks && (
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {task.description && (
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>Criada em {formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {task.assignedToName && (
                      <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                        <User size={14} />
                        <span>{task.assignedToName}</span>
                      </div>
                    )}
                    <TaskCommentCount taskId={task.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar />

        <main className="ml-0 lg:ml-64 min-h-screen overflow-y-auto">
          <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                    Tarefas
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Gerencie todas as suas tarefas em um só lugar
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  {projectIds.some(projectId => projectPermissions[projectId]?.canCreateTasks) && (
                    <Button 
                      variant="outline"
                      className="border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      onClick={handleCreateTask}
                    >
                      <Plus size={16} className="mr-2" />
                      Nova Tarefa
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Estatísticas</h2>
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-slate-500" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-zinc-700 dark:text-white text-sm"
                    >
                      <option value="all">Todas</option>
                      <option value="pending">Pendentes</option>
                      <option value="in_progress">Em Progresso</option>
                      <option value="completed">Concluídas</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Total"
                    value={stats.total}
                    loading={loading}
                    error={error}
                    icon={CheckSquare}
                    color="blue"
                    subtitle="Todas as tarefas"
                  />
                  <StatsCard
                    title="Pendentes"
                    value={stats.pending}
                    loading={loading}
                    error={error}
                    icon={Clock}
                    color="orange"
                    subtitle="Aguardando início"
                  />
                  <StatsCard
                    title="Em Progresso"
                    value={stats.inProgress}
                    loading={loading}
                    error={error}
                    icon={Target}
                    color="purple"
                    subtitle="Em desenvolvimento"
                  />
                  <StatsCard
                    title="Concluídas"
                    value={stats.completed}
                    loading={loading}
                    error={error}
                    icon={CheckSquare}
                    color="green"
                    subtitle="Finalizadas"
                  />
                </div>
              </div>

              {/* Tasks List */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                <div className="p-6 border-b border-slate-200 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Suas Tarefas
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa' : 'tarefas'} 
                    {filter !== 'all' && (() => {
                      const statusText = filter === 'pending' ? 'pendente' : 
                                       filter === 'in_progress' ? 'em progresso' : 'concluída';
                      const plural = filteredTasks.length !== 1 ? 's' : '';
                      return ` ${statusText}${plural}`;
                    })()}
                  </p>
                </div>

                <div className="p-6">
                  {renderTasksContent()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
      />

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
        onEdit={handleEditTask}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTask}
        title="Deletar Tarefa"
        message={`Tem certeza que deseja deletar a tarefa "${selectedTask?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Deletar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </AuthGuard>
  );
}
