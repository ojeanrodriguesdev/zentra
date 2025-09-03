'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modals';
import { Button } from '@/components/ui/buttons';
import { Input } from '@/components/ui/inputs';
import { useAuth } from '@/components/providers/auth';
import { createProject } from '@/lib/firestore/projects';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const projectData = {
        ...formData,
        createdBy: user.uid,
        createdByName: user.displayName || user.email,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const projectId = await createProject(projectData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        priority: 'medium'
      });
      
      // Callback para atualizar a lista
      if (onProjectCreated) {
        onProjectCreated({ id: projectId, ...projectData });
      }
      
      onClose();
    } catch (err) {
      console.error('Erro ao criar projeto:', err);
      setError('Erro ao criar projeto. Tente novamente.');
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
      title="Criar Novo Projeto"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Nome do Projeto */}
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Nome do Projeto
            </label>
            <input
              id="project-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite o nome do projeto"
              required
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Descrição (opcional)
            </label>
            <textarea
              id="project-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o projeto..."
              rows={2}
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-colors"
            />
          </div>

          {/* Prioridade */}
          <div>
            <label htmlFor="project-priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Prioridade
            </label>
            <select
              id="project-priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-700 dark:text-white transition-colors"
            >
              <option value="low">🟢 Baixa</option>
              <option value="medium">🟡 Média</option>
              <option value="high">🔴 Alta</option>
            </select>
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
            disabled={isLoading || !formData.name.trim()}
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
              'Criar Projeto'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
