'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/auth';
import { useTaskComments, useCommentPermissions } from '@/lib/hooks';
import { addComment, updateComment, deleteComment } from '@/lib/firestore/comments';
import { Button } from '@/components/ui/buttons';
import { Input } from '@/components/ui/inputs';
import { 
  MessageCircle, 
  Send, 
  Edit2, 
  Trash2, 
  MoreVertical,
  User,
  Clock
} from 'lucide-react';
import PropTypes from 'prop-types';

export default function TaskComments({ taskId, projectId }) {
  const { user } = useAuth();
  const { comments, loading, error } = useTaskComments(taskId);
  const { canComment } = useCommentPermissions(projectId);
  
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !canComment) return;

    try {
      setIsSubmitting(true);
      
      await addComment({
        projectId,
        taskId,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Usuário',
        userEmail: user.email,
        userAvatar: user.photoURL,
        text: newComment.trim()
      });

      setNewComment('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
    setIsEditing(true);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim() || !editingComment) return;

    try {
      setIsSubmitting(true);
      
      await updateComment(editingComment, {
        text: editText.trim()
      });

      setEditingComment(null);
      setEditText('');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
    setIsEditing(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `há ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `há ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 168) { // 7 dias
      return `há ${Math.floor(diffInHours / 24)}d`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} className="text-slate-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Comentários
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageCircle size={20} className="text-slate-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Formulário de novo comentário */}
      {canComment && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Usuário'} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {getInitials(user.displayName || user.email)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      )}

      {/* Lista de comentários */}
      {error ? (
        <div className="text-center py-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">
            Nenhum comentário ainda
          </p>
          {canComment && (
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Seja o primeiro a comentar!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                {comment.userAvatar ? (
                  <img 
                    src={comment.userAvatar} 
                    alt={comment.userName} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {getInitials(comment.userName)}
                  </span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {comment.userName}
                      </span>
                      {comment.edited && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          (editado)
                        </span>
                      )}
                    </div>
                    
                    {comment.userId === user?.uid && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Editar comentário"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Deletar comentário"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Editar comentário..."
                        disabled={isSubmitting}
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleUpdateComment}
                          disabled={!editText.trim() || isSubmitting}
                          size="sm"
                        >
                          Salvar
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 mt-1">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

TaskComments.propTypes = {
  taskId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired
};
