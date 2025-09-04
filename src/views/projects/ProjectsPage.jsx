'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout';
import { AuthGuard } from '@/components/features/auth';
import { Button } from '@/components/ui/buttons';
import { DropdownMenu, DropdownItem, ConfirmationModal } from '@/components/ui';
import { CreateProjectModal } from '@/components/features/projects';
import { CreateTaskModal, TaskDetailsModal, EditTaskModal } from '@/components/features/tasks';
import { useAuth } from '@/components/providers/auth';
import { getUserProjects, deleteProject } from '@/lib/firestore/projects';
import { getProjectTasks, deleteTask } from '@/lib/firestore/tasks';
import { FolderKanban, Plus, Calendar, User, MoreVertical, Filter, CheckSquare } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectTasks, setProjectTasks] = useState({});
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log('🔍 Carregando projetos para usuário:', user.uid);
      const userProjects = await getUserProjects(user.uid);
      console.log('📊 Projetos encontrados:', userProjects);
      setProjects(userProjects);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
      setError('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleCreateTask = (project) => {
    setSelectedProject(project);
    setIsCreateTaskModalOpen(true);
  };

  const handleTaskCreated = async (newTask) => {
    // Atualizar tarefas do projeto específico
    setProjectTasks(prev => ({
      ...prev,
      [newTask.projectId]: [...(prev[newTask.projectId] || []), newTask]
    }));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    // Atualizar tarefa específica no estado
    setProjectTasks(prev => ({
      ...prev,
      [updatedTask.projectId]: (prev[updatedTask.projectId] || []).map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
    
    // Se estiver visualizando detalhes da tarefa, atualizar
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setIsDeleteProjectModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setIsDeleteTaskModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!selectedProject) return;

    setIsDeleting(true);
    try {
      await deleteProject(selectedProject.id);
      
      // Remover projeto da lista
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
      
      // Remover tarefas do projeto do estado
      setProjectTasks(prev => {
        const newTasks = { ...prev };
        delete newTasks[selectedProject.id];
        return newTasks;
      });

      setIsDeleteProjectModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      // Você pode adicionar um toast de erro aqui
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteTask = async () => {
    if (!selectedTask) return;

    setIsDeleting(true);
    try {
      await deleteTask(selectedTask.id);
      
      // Remover tarefa da lista
      setProjectTasks(prev => ({
        ...prev,
        [selectedTask.projectId]: (prev[selectedTask.projectId] || []).filter(t => t.id !== selectedTask.id)
      }));

      setIsDeleteTaskModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      // Você pode adicionar um toast de erro aqui
    } finally {
      setIsDeleting(false);
    }
  };

  const loadProjectTasks = async (projectId) => {
    try {
      const tasks = await getProjectTasks(projectId);
      setProjectTasks(prev => ({
        ...prev,
        [projectId]: tasks
      }));
    } catch (err) {
      console.error('Erro ao carregar tarefas do projeto:', err);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'active') return project.status === 'active';
    if (filter === 'completed') return project.status === 'completed';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'paused': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      default: return status;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'in_progress': return '🔄';
      case 'completed': return '✅';
      default: return '❌';
    }
  };

  const getEmptyStateMessage = () => {
    if (filter === 'all') return 'Nenhum projeto encontrado';
    return `Nenhum projeto ${filter === 'active' ? 'ativo' : 'concluído'} encontrado`;
  };

  const renderProjectsContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <Button onClick={loadProjects} variant="outline" className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      );
    }

    if (filteredProjects.length === 0) {
      return (
        <div className="text-center py-12">
          <FolderKanban className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">
            {getEmptyStateMessage()}
          </p>
          <p className="text-slate-400 dark:text-slate-500 mb-6">
            Crie seu primeiro projeto para começar
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Criar Projeto
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-6 border border-slate-200 dark:border-zinc-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {project.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {getPriorityLabel(project.priority)}
                  </span>
                </div>
                
                {project.description && (
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {project.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{project.createdByName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Criado em {formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleCreateTask(project)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <CheckSquare size={14} />
                  <span>Nova Tarefa</span>
                </button>
                
                <DropdownMenu
                  trigger={
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700">
                      <MoreVertical size={16} />
                    </button>
                  }
                  align="right"
                >
                  <DropdownItem
                    onClick={() => handleDeleteProject(project)}
                    icon="🗑️"
                    variant="danger"
                  >
                    Deletar Projeto
                  </DropdownItem>
                </DropdownMenu>
              </div>
            </div>

            {/* Tarefas do Projeto */}
            {projectTasks[project.id] && projectTasks[project.id].length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-700">
                <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Tarefas ({projectTasks[project.id].length})
                </h5>
                <div className="space-y-2">
                  {projectTasks[project.id].slice(0, 3).map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-2 bg-slate-50 dark:bg-zinc-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700/50 transition-colors group"
                    >
                      <button 
                        onClick={() => handleTaskClick(task)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTaskClick(task)}
                        role="button"
                        tabIndex={0}
                        className="flex items-center space-x-2 flex-1 cursor-pointer text-left"
                      >
                        <span className="text-xs">
                          {getStatusIcon(task.status)}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {task.title}
                        </span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        
                        <DropdownMenu
                          trigger={
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={12} />
                            </button>
                          }
                          align="right"
                        >
                          <DropdownItem
                            onClick={() => handleTaskClick(task)}
                            icon="👁️"
                          >
                            Ver Detalhes
                          </DropdownItem>
                          
                          <DropdownItem
                            onClick={() => handleEditTask(task)}
                            icon="✏️"
                          >
                            Editar Tarefa
                          </DropdownItem>
                          
                          <DropdownItem
                            onClick={() => handleDeleteTask(task)}
                            icon="🗑️"
                            variant="danger"
                          >
                            Deletar Tarefa
                          </DropdownItem>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {projectTasks[project.id].length > 3 && (
                    <div className="text-center">
                      <button 
                        onClick={() => loadProjectTasks(project.id)}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                      >
                        Ver mais {projectTasks[project.id].length - 3} tarefas...
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Carregar tarefas quando o projeto é exibido */}
            {!projectTasks[project.id] && (() => {
              loadProjectTasks(project.id);
              return null;
            })()}
          </div>
        ))}
      </div>
    );
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar />

        <main className="flex-1 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 dark:text-white font-heading">
                    Projetos
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Gerencie todos os seus projetos em um só lugar
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  <Button 
                    variant="outline"
                    className="border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Novo Projeto
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-8">
                {/* Filter section */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Estatísticas</h2>
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-slate-500" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-zinc-700 dark:text-white text-sm"
                    >
                      <option value="all">Todos</option>
                      <option value="active">Ativos</option>
                      <option value="completed">Concluídos</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{projects.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ativos</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {projects.filter(p => p.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Concluídos</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {projects.filter(p => p.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* Projects List */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                <div className="p-6 border-b border-slate-200 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Seus Projetos
                  </h3>
                </div>

                <div className="p-6">
                  {renderProjectsContent()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        project={selectedProject}
        onTaskCreated={handleTaskCreated}
      />

      <TaskDetailsModal
        isOpen={isTaskDetailsModalOpen}
        onClose={() => setIsTaskDetailsModalOpen(false)}
        task={selectedTask}
        onEdit={handleEditTask}
      />

      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
      />

      {/* Modal de confirmação para deletar projeto */}
      <ConfirmationModal
        isOpen={isDeleteProjectModalOpen}
        onClose={() => setIsDeleteProjectModalOpen(false)}
        onConfirm={confirmDeleteProject}
        title="Deletar Projeto"
        message={`Tem certeza que deseja deletar o projeto "${selectedProject?.name}"? Esta ação não pode ser desfeita e irá remover todas as tarefas e membros associados ao projeto.`}
        confirmText="Sim, Deletar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Modal de confirmação para deletar tarefa */}
      <ConfirmationModal
        isOpen={isDeleteTaskModalOpen}
        onClose={() => setIsDeleteTaskModalOpen(false)}
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
