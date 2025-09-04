'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modals';
import { Button } from '@/components/ui/buttons';
import { Input } from '@/components/ui/inputs';
import { useAuth } from '@/components/providers/auth';
import { createInvitation, isEmailAlreadyInvited } from '@/lib/firestore/invitations';
import { sendInviteEmail } from '@/lib/services/emailService';
import { Mail, UserPlus, Shield, Crown, User, AlertCircle, CheckCircle } from 'lucide-react';
import PropTypes from 'prop-types';

export default function InviteMemberModal({ 
  isOpen, 
  onClose, 
  onMemberInvited, 
  projectId, 
  projectName 
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    role: 'collaborator'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erros quando usuário digita
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    if (formData.email === user?.email) {
      setError('Você não pode convidar a si mesmo');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Verificar se email já foi convidado
      const alreadyInvited = await isEmailAlreadyInvited(formData.email, projectId);
      if (alreadyInvited) {
        setError('Este email já foi convidado para este projeto');
        setIsLoading(false);
        return;
      }

      // Criar convite
      const { token } = await createInvitation({
        email: formData.email.trim().toLowerCase(),
        projectId,
        projectName,
        role: formData.role,
        invitedBy: user.uid,
        invitedByName: user.displayName || user.email?.split('@')[0] || 'Usuário',
        invitedByEmail: user.email
      });

      // Enviar email com link de convite
      const inviteLink = `${window.location.origin}/accept-invite?token=${token}`;
      
      await sendInviteEmail({
        email: formData.email.trim().toLowerCase(),
        projectName,
        inviterName: user.displayName || user.email?.split('@')[0] || 'Usuário',
        role: formData.role,
        inviteLink
      });

      setSuccess(true);
      
      // Resetar formulário após 2 segundos
      setTimeout(() => {
        setFormData({ email: '', role: 'collaborator' });
        setSuccess(false);
        onMemberInvited();
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Erro ao criar convite:', err);
      setError('Erro ao enviar convite. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ email: '', role: 'collaborator' });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield size={16} className="text-blue-600 dark:text-blue-400" />;
      case 'collaborator':
        return <User size={16} className="text-green-600 dark:text-green-400" />;
      default:
        return <User size={16} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin':
        return 'Pode gerenciar tarefas e membros, mas não pode deletar o projeto';
      case 'collaborator':
        return 'Pode visualizar e trabalhar em tarefas atribuídas';
      default:
        return '';
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Convite Enviado!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            O convite foi enviado para <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A pessoa receberá um email com instruções para entrar no projeto.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Convidar Membro
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Adicionar novo membro ao projeto <strong>{projectName}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="invite-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email do convidado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="invite-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="usuario@exemplo.com"
                disabled={isLoading}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label htmlFor="invite-role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Papel no projeto
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="radio"
                  id="role-collaborator"
                  name="role"
                  value="collaborator"
                  checked={formData.role === 'collaborator'}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="sr-only"
                />
                <label
                  htmlFor="role-collaborator"
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.role === 'collaborator'
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getRoleIcon('collaborator')}
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Collaborator
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {getRoleDescription('collaborator')}
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              <div className="relative">
                <input
                  type="radio"
                  id="role-admin"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="sr-only"
                />
                <label
                  htmlFor="role-admin"
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.role === 'admin'
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getRoleIcon('admin')}
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Admin
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {getRoleDescription('admin')}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-2" />
                  Enviar Convite
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

InviteMemberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMemberInvited: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired
};
