'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Sidebar } from '@/components/layout';
import { AuthGuard } from '@/components/features/auth';
import { Button } from '@/components/ui/buttons';
import { StatsCard } from '@/components/ui/stats';
import { useAuth } from '@/components/providers/auth';
import { useProjectMembers } from '@/lib/hooks';
import { InviteMemberModal } from '@/components/features/projects';
import { useFirestore } from '@/lib/hooks';
import { 
  Users, 
  ArrowLeft,
  Crown,
  Shield,
  User,
  Mail,
  Calendar,
  Trash2,
  Edit,
  UserPlus
} from 'lucide-react';

export default function ProjectMembersPage({ projectId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Buscar dados dos membros do projeto
  const {
    members,
    loading,
    error,
    canManageMembers,
    totalMembers,
    owners,
    admins,
    collaborators
  } = useProjectMembers(projectId);

  // Buscar dados do projeto
  const { data: projects } = useFirestore(
    'projects',
    [['createdBy', '==', user?.uid]],
    'createdAt'
  );
  
  const currentProject = projects?.find(p => p.id === projectId);

  const handleBackToProject = () => {
    router.push(`/projects`);
  };

  const handleInviteMember = () => {
    setIsInviteModalOpen(true);
  };

  const handleMemberInvited = () => {
    setIsInviteModalOpen(false);
    // Os membros são atualizados automaticamente via Firestore realtime
  };


  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown size={16} className="text-yellow-600 dark:text-yellow-400" />;
      case 'admin':
        return <Shield size={16} className="text-blue-600 dark:text-blue-400" />;
      case 'collaborator':
        return <User size={16} className="text-green-600 dark:text-green-400" />;
      default:
        return <User size={16} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      owner: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/20', 
        text: 'text-yellow-800 dark:text-yellow-400', 
        label: 'Owner' 
      },
      admin: { 
        bg: 'bg-blue-100 dark:bg-blue-900/20', 
        text: 'text-blue-800 dark:text-blue-400', 
        label: 'Admin' 
      },
      collaborator: { 
        bg: 'bg-green-100 dark:bg-green-900/20', 
        text: 'text-green-800 dark:text-green-400', 
        label: 'Collaborator' 
      }
    };

    const config = roleConfig[role] || roleConfig.collaborator;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {getRoleIcon(role)}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Data não disponível';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  };

  const renderMembersContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Erro ao carregar membros
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {error}
          </p>
        </div>
      );
    }

    if (members.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Nenhum membro encontrado
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Este projeto ainda não possui membros.
          </p>
          {canManageMembers && (
            <Button onClick={handleInviteMember}>
              <UserPlus size={16} className="mr-2" />
              Convidar Primeiro Membro
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {members.map(member => (
          <div 
            key={member.id} 
            className="bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {member.userName ? member.userName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>

                {/* Informações do membro */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {member.userName || 'Usuário'}
                    </h3>
                    {member.userId === user?.uid && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        Você
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Mail size={14} />
                      <span>{member.userEmail || 'Email não disponível'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Entrou em {formatDate(member.joinedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role e ações */}
              <div className="flex items-center space-x-3">
                {getRoleBadge(member.role)}
                
                {canManageMembers && member.userId !== user?.uid && (
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      title="Editar permissões"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Remover membro"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
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
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBackToProject}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    title="Voltar para projetos"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                      Membros do Projeto
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      Gerencie a equipe e permissões do projeto
                    </p>
                  </div>
                </div>
                
                {canManageMembers && (
                  <div className="mt-4 sm:mt-0">
                    <Button 
                      variant="outline"
                      className="border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      onClick={handleInviteMember}
                    >
                      <UserPlus size={16} className="mr-2" />
                      Convidar Membro
                    </Button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  Estatísticas da Equipe
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Total de Membros"
                    value={totalMembers}
                    loading={loading}
                    error={error}
                    icon={Users}
                    color="blue"
                    subtitle="Membros ativos"
                  />
                  <StatsCard
                    title="Owners"
                    value={owners}
                    loading={loading}
                    error={error}
                    icon={Crown}
                    color="yellow"
                    subtitle="Proprietários"
                  />
                  <StatsCard
                    title="Admins"
                    value={admins}
                    loading={loading}
                    error={error}
                    icon={Shield}
                    color="purple"
                    subtitle="Administradores"
                  />
                  <StatsCard
                    title="Collaborators"
                    value={collaborators}
                    loading={loading}
                    error={error}
                    icon={User}
                    color="green"
                    subtitle="Colaboradores"
                  />
                </div>
              </div>

              {/* Members List */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                <div className="p-6 border-b border-slate-200 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Membros da Equipe
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {totalMembers} {totalMembers === 1 ? 'membro' : 'membros'} ativo{totalMembers !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="p-6">
                  {renderMembersContent()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onMemberInvited={handleMemberInvited}
        projectId={projectId}
        projectName={currentProject?.name || 'Projeto'}
      />
    </AuthGuard>
  );
}

ProjectMembersPage.propTypes = {
  projectId: PropTypes.string.isRequired
};
