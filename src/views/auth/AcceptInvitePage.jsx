'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/auth';
import { Button } from '@/components/ui/buttons';
import { getInvitationByToken, acceptInvitation } from '@/lib/firestore/invitations';
import { sendInviteAcceptedNotification } from '@/lib/services/emailService';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserPlus, 
  Mail, 
  Shield, 
  User,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function AcceptInvitePage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token de convite não encontrado');
      setLoading(false);
      return;
    }

    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      setError(null);

      const invite = await getInvitationByToken(token);
      
      if (!invite) {
        setError('Convite não encontrado ou expirado');
        setLoading(false);
        return;
      }

      // Verificar se o convite expirou
      const now = new Date();
      const expiresAt = invite.expiresAt.toDate();
      
      if (now > expiresAt) {
        setError('Este convite expirou. Solicite um novo convite.');
        setLoading(false);
        return;
      }

      setInvitation(invite);
    } catch (err) {
      console.error('Erro ao carregar convite:', err);
      setError('Erro ao carregar convite. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!user || !invitation) return;

    try {
      setAccepting(true);
      setError(null);

      // Aceitar convite
      await acceptInvitation(
        invitation.id,
        user.uid,
        user.displayName || user.email?.split('@')[0] || 'Usuário',
        user.email
      );

      // Enviar notificação para quem convidou
      try {
        await sendInviteAcceptedNotification({
          inviterEmail: invitation.invitedByEmail,
          inviterName: invitation.invitedByName,
          projectName: invitation.projectName,
          newMemberName: user.displayName || user.email?.split('@')[0] || 'Usuário',
          role: invitation.role
        });
      } catch (notificationError) {
        console.warn('Erro ao enviar notificação:', notificationError);
        // Não falhar o processo principal
      }

      setSuccess(true);

      // Redirecionar para o projeto após 3 segundos
      setTimeout(() => {
        router.push('/projects');
      }, 3000);

    } catch (err) {
      console.error('Erro ao aceitar convite:', err);
      setError('Erro ao aceitar convite. Tente novamente.');
    } finally {
      setAccepting(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Erro ao fazer login. Tente novamente.');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'collaborator':
        return <User size={20} className="text-green-600 dark:text-green-400" />;
      default:
        return <User size={20} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'collaborator':
        return 'Colaborador';
      default:
        return 'Membro';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Carregando convite...
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Verificando informações do convite
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Convite Inválido
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {error}
            </p>
            <Button onClick={() => router.push('/')}>
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Convite Aceito!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Você foi adicionado ao projeto <strong>{invitation.projectName}</strong> como <strong>{getRoleText(invitation.role)}</strong>.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
              Redirecionando para seus projetos...
            </p>
            <Button onClick={() => router.push('/projects')}>
              Ir para Projetos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Convite para {invitation.projectName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Você precisa fazer login para aceitar este convite
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-zinc-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Convite para: <strong>{invitation.email}</strong>
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-zinc-700/50 rounded-lg">
                {getRoleIcon(invitation.role)}
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {getRoleText(invitation.role)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {getRoleDescription(invitation.role)}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSignIn}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Fazer Login com Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se o email do usuário logado corresponde ao convite
  if (user.email !== invitation.email) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Email Não Confere
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Este convite foi enviado para <strong>{invitation.email}</strong>, 
              mas você está logado como <strong>{user.email}</strong>.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
              Faça logout e entre com a conta correta, ou solicite um novo convite.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/projects')}
                className="w-full"
              >
                Ir para Projetos
              </Button>
              <Button 
                onClick={handleSignIn}
                variant="outline"
                className="w-full"
              >
                Trocar Conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Convite Válido!
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Você foi convidado para participar do projeto
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-slate-50 dark:bg-zinc-700/50 rounded-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {invitation.projectName}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Convidado por {invitation.invitedByName}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-zinc-700/50 rounded-lg">
              {getRoleIcon(invitation.role)}
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {getRoleText(invitation.role)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {getRoleDescription(invitation.role)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-zinc-700/50 rounded-lg">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Convite expira em {invitation.expiresAt.toDate().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <Button 
            onClick={handleAcceptInvite}
            disabled={accepting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {accepting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Aceitando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Aceitar Convite
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
