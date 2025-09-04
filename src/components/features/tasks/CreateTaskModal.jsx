'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modals';
import { useAuth } from '@/components/providers/auth';
import { createTask } from '@/lib/firestore/tasks';

export default function CreateTaskModal({ isOpen, onClose, project, onTaskCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '', // Por enquanto vazio, pode ser expandido para incluir outros membros
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !project) return;

    setIsLoading(true);
    setError(null);

    try {
      const taskData = {
        ...formData,
        projectId: project.id,
        projectName: project.name,
        createdBy: user.uid,
        createdByName: user.displayName || user.email,
        assignedTo: formData.assignedTo || user.uid, // Se não especificado, atribui ao criador
        assignedToName: formData.assignedTo ? 'Membro' : (user.displayName || user.email),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('📝 Criando tarefa com dados:', taskData);
      
      const taskId = await createTask(taskData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignedTo: '',
        tags: []
      });

      // Callback para atualizar a lista
      if (onTaskCreated) {
        onTaskCreated({ id: taskId, ...taskData });
      }

      onClose();
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);

      let errorMessage = 'Erro ao criar tarefa. Tente novamente.';
      if (err.code === 'permission-denied') {
        errorMessage = 'Permissão negada. Verifique as regras do Firestore.';
      } else if (err.code === 'unavailable') {
        errorMessage = 'Serviço indisponível. Tente novamente em alguns instantes.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
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
      title={`Nova Tarefa - ${project?.name || 'Projeto'}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-5">
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
              placeholder="Ex: Implementar autenticação, Criar mockups..."
              required
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Grid 2 colunas para campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="urgent">🚨 Urgente</option>
              </select>
            </div>

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
            disabled={isLoading || !formData.title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
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
