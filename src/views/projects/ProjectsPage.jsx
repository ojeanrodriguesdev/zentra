'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout';
import { AuthGuard } from '@/components/features/auth';
import { Button } from '@/components/ui/buttons';
import { CreateProjectModal } from '@/components/features/projects';
import { useAuth } from '@/components/providers/auth';
import { getUserProjects } from '@/lib/firestore/projects';
import { FolderKanban, Plus, Calendar, User, MoreVertical, Filter } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const userProjects = await getUserProjects(user.uid);
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
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                    Projetos
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Gerencie todos os seus projetos em um só lugar
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  {/* Filter */}
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

                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Novo Projeto
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

              {/* Projects List */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                <div className="p-6 border-b border-slate-200 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Seus Projetos
                  </h3>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-500 dark:text-red-400">{error}</p>
                      <Button onClick={loadProjects} variant="outline" className="mt-4">
                        Tentar Novamente
                      </Button>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <FolderKanban className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">
                        {filter === 'all' ? 'Nenhum projeto encontrado' : `Nenhum projeto ${filter === 'active' ? 'ativo' : 'concluído'} encontrado`}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 mb-6">
                        Crie seu primeiro projeto para começar
                      </p>
                      <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Criar Projeto
                      </Button>
                    </div>
                  ) : (
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
                                  {project.status === 'active' ? 'Ativo' : 
                                   project.status === 'completed' ? 'Concluído' : 
                                   project.status === 'paused' ? 'Pausado' : project.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                                  {project.priority === 'high' ? 'Alta' : 
                                   project.priority === 'medium' ? 'Média' : 
                                   project.priority === 'low' ? 'Baixa' : project.priority}
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
                            
                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
    </AuthGuard>
  );
}
