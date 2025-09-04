'use client';

import { Modal } from '@/components/ui/modals';
import { useProjectPermissions } from '@/lib/hooks';
import TaskComments from './TaskComments';

export default function TaskDetailsModal({ isOpen, onClose, task, onEdit }) {
  if (!task) return null;

  // Verificar permissões do usuário no projeto
  const { canEditTasks } = useProjectPermissions(task.projectId);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return { label: 'Pendente', icon: '⏳', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
      case 'in_progress': return { label: 'Em Progresso', icon: '🔄', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' };
      case 'completed': return { label: 'Concluída', icon: '✅', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      case 'cancelled': return { label: 'Cancelada', icon: '❌', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
      default: return { label: status, icon: '⏳', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low': return { label: 'Baixa', icon: '🟢', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      case 'medium': return { label: 'Média', icon: '🟡', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
      case 'high': return { label: 'Alta', icon: '🔴', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
      case 'urgent': return { label: 'Urgente', icon: '🚨', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' };
      default: return { label: priority, icon: '🟡', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Não definido';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDueDate = (date) => {
    if (!date) return 'Não definido';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const status = getStatusLabel(task.status);
  const priority = getPriorityLabel(task.priority);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Tarefa"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header com título e badges */}
        <div className="border-b border-slate-200 dark:border-zinc-700 pb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
            {task.title}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
              <span>{status.icon}</span>
              <span>{status.label}</span>
            </span>
            
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${priority.color}`}>
              <span>{priority.icon}</span>
              <span>{priority.label}</span>
            </span>
          </div>
        </div>

        {/* Informações do projeto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Projeto
            </label>
            <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
              📁 {task.projectName || 'Projeto não especificado'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Atribuída a
            </label>
            <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
              👤 {task.assignedToName || 'Não atribuído'}
            </p>
          </div>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Data de Vencimento
            </label>
            <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
              📅 {formatDueDate(task.dueDate)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Criada em
            </label>
            <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
              🕒 {formatDate(task.createdAt)}
            </p>
          </div>
        </div>

        {/* Descrição */}
        {task.description && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Descrição
            </label>
            <div className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-3 min-h-[60px]">
              <p className="whitespace-pre-wrap">{task.description}</p>
            </div>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Criada por
            </label>
            <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
              👨‍💻 {task.createdByName || 'Usuário'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Última atualização
            </label>
            <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
              🔄 {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>

        {/* Seção de Comentários */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-700">
          <TaskComments taskId={task.id} projectId={task.projectId} />
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            Fechar
          </button>
          
          {canEditTasks && (
            <button
              type="button"
              onClick={() => {
                onEdit(task);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg transition-colors"
            >
              Editar Tarefa
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
