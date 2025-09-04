'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modals';
import { useAuth } from '@/components/providers/auth';
import { createTask } from '@/lib/firestore/tasks';
import { getUserProjects } from '@/lib/firestore/projects';

export default function CreateTaskFromDashboardModal({ isOpen, onClose, onTaskCreated }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    projectId: '',
    assignedTo: user?.uid || '',
    assignedToName: user?.displayName || user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar projetos quando modal abrir
  useEffect(() => {
    if (isOpen && user) {
      loadUserProjects();
    }
  }, [isOpen, user]);

  const loadUserProjects = async () => {
    try {
      const userProjects = await getUserProjects(user.uid);
      setProjects(userProjects);
      // Se houver projetos, selecionar o primeiro automaticamente
      if (userProjects.length > 0) {
        setFormData(prev => ({
          ...prev,
          projectId: userProjects[0].id
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
      setError('Erro ao carregar projetos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !formData.projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Encontrar o projeto selecionado para pegar o nome
      const selectedProject = projects.find(p => p.id === formData.projectId);
      
      const taskData = {
        ...formData,
        projectName: selectedProject?.name || 'Projeto',
        createdBy: user.uid,
        createdByName: user.displayName || user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const taskId = await createTask(taskData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        projectId: projects.length > 0 ? projects[0].id : '',
        assignedTo: user?.uid || '',
        assignedToName: user?.displayName || user?.email || ''
      });
      
      // Callback para atualizar a dashboard
      if (onTaskCreated) {
        onTaskCreated({ id: taskId, ...taskData });
      }
      
      onClose();
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
      setError('Erro ao criar tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nova Tarefa"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Título da Tarefa */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Título da Tarefa *
            </label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Implementar funcionalidade de login"
              required
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Projeto */}
          <div>
            <label htmlFor="task-project" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Projeto *
            </label>
            <select
              id="task-project"
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              required
              disabled={isLoading || projects.length === 0}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white transition-colors"
            >
              {projects.length === 0 ? (
                <option value="">Nenhum projeto encontrado</option>
              ) : (
                projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))
              )}
            </select>
            {projects.length === 0 && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Você precisa criar um projeto primeiro para adicionar tarefas.
              </p>
            )}
          </div>

          {/* Grid para Status e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white transition-colors"
              >
                <option value="pending">⏳ Pendente</option>
                <option value="in_progress">🔄 Em Progresso</option>
                <option value="completed">✅ Concluída</option>
                <option value="cancelled">❌ Cancelada</option>
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Prioridade
              </label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white transition-colors"
              >
                <option value="low">🟢 Baixa</option>
                <option value="medium">🟡 Média</option>
                <option value="high">🔴 Alta</option>
                <option value="urgent">🔥 Urgente</option>
              </select>
            </div>
          </div>

          {/* Data de Vencimento */}
          <div>
            <label htmlFor="task-due-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Data de Vencimento
            </label>
            <input
              id="task-due-date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white transition-colors"
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Descrição
            </label>
            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva os detalhes da tarefa..."
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.title.trim() || !formData.projectId || projects.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </span>
            ) : (
              'Criar Tarefa'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
