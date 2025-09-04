'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout';
import { AuthGuard } from '@/components/features/auth';
import { Button } from '@/components/ui/buttons';
import { StatsCard } from '@/components/ui/stats';
import { useAuth } from '@/components/providers/auth';
import { useFirestore } from '@/lib/hooks';
import { 
  Users, 
  Filter,
  Crown,
  Shield,
  User,
  Mail,
  Calendar,
  Trash2,
  Edit,
  UserPlus,
  FolderKanban,
  AlertCircle
} from 'lucide-react';

export default function MembersPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Buscar todos os projetos do usuário
  const { data: projects, loading: projectsLoading, error: projectsError } = useFirestore(
    'projects', 
    user?.uid ? [['createdBy', '==', user.uid]] : [], 
    'createdAt'
  );

  // Buscar todos os membros dos projetos do usuário
  const { data: allMembers, loading: membersLoading, error: membersError } = useFirestore(
    'members',
    [['status', '==', 'active']]
  );

  // Filtrar membros dos projetos do usuário
  const userProjectIds = projects?.map(p => p.id) || [];
  const projectMembers = allMembers?.filter(member => 
    userProjectIds.includes(member.projectId)
  )?.sort((a, b) => {
    // Ordenar por data de entrada (mais recente primeiro)
    const dateA = a.joinedAt?.toDate ? a.joinedAt.toDate() : new Date(a.joinedAt);
    const dateB = b.joinedAt?.toDate ? b.joinedAt.toDate() : new Date(b.joinedAt);
    return dateB - dateA;
  }) || [];

  // Buscar dados dos projetos para cada membro
  const membersWithProjectInfo = projectMembers.map(member => {
    const project = projects?.find(p => p.id === member.projectId);
    return {
      ...member,
      projectName: project?.name || 'Projeto não encontrado',
      projectStatus: project?.status || 'unknown'
    };
  });

  // Filtrar membros baseado no filtro selecionado
  const filteredMembers = membersWithProjectInfo.filter(member => {
    if (filter === 'all') return true;
    if (filter === 'owners') return member.role === 'owner';
    if (filter === 'admins') return member.role === 'admin';
    if (filter === 'collaborators') return member.role === 'collaborator';
    return true;
  });

  // Estatísticas dos membros
  const stats = {
    total: projectMembers.length,
    owners: projectMembers.filter(m => m.role === 'owner').length,
    admins: projectMembers.filter(m => m.role === 'admin').length,
    collaborators: projectMembers.filter(m => m.role === 'collaborator').length,
    uniqueUsers: new Set(projectMembers.map(m => m.userId)).size
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

  const getProjectStatusBadge = (status) => {
    const statusConfig = {
      active: { 
        bg: 'bg-green-100 dark:bg-green-900/20', 
        text: 'text-green-800 dark:text-green-400', 
        label: 'Ativo' 
      },
      completed: { 
        bg: 'bg-purple-100 dark:bg-purple-900/20', 
        text: 'text-purple-800 dark:text-purple-400', 
        label: 'Concluído' 
      },
      paused: { 
        bg: 'bg-gray-100 dark:bg-gray-900/20', 
        text: 'text-gray-800 dark:text-gray-400', 
        label: 'Pausado' 
      }
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Data não disponível';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  };

  const renderMembersContent = () => {
    if (membersLoading || projectsLoading) {
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
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (membersError || projectsError) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Erro ao carregar membros
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {membersError || projectsError}
          </p>
        </div>
      );
    }

    if (filteredMembers.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            {(() => {
              if (filter === 'all') return 'Nenhum membro encontrado';
              if (filter === 'owners') return 'Nenhum owner encontrado';
              if (filter === 'admins') return 'Nenhum admin encontrado';
              return 'Nenhum collaborator encontrado';
            })()}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {filter === 'all' 
              ? 'Você ainda não possui membros em seus projetos.' 
              : 'Tente alterar o filtro ou convidar novos membros.'
            }
          </p>
          <Button>
            <UserPlus size={16} className="mr-2" />
            Convidar Membro
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredMembers.map(member => (
          <div 
            key={`${member.projectId}-${member.userId}`} 
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
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Mail size={14} />
                      <span>{member.userEmail || 'Email não disponível'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Entrou em {formatDate(member.joinedAt)}</span>
                    </div>
                  </div>

                  {/* Projeto */}
                  <div className="flex items-center space-x-2">
                    <FolderKanban size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Projeto: <strong>{member.projectName}</strong>
                    </span>
                    {getProjectStatusBadge(member.projectStatus)}
                  </div>
                </div>
              </div>

              {/* Role e ações */}
              <div className="flex items-center space-x-3">
                {getRoleBadge(member.role)}
                
                {member.userId !== user?.uid && (
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
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                    Membros
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Gerencie todos os membros dos seus projetos
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  <Button 
                    variant="outline"
                    className="border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Convidar Membro
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-8">
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
                      <option value="owners">Owners</option>
                      <option value="admins">Admins</option>
                      <option value="collaborators">Collaborators</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <StatsCard
                    title="Total de Membros"
                    value={stats.total}
                    loading={membersLoading || projectsLoading}
                    error={membersError || projectsError}
                    icon={Users}
                    color="blue"
                    subtitle="Em todos os projetos"
                  />
                  <StatsCard
                    title="Usuários Únicos"
                    value={stats.uniqueUsers}
                    loading={membersLoading || projectsLoading}
                    error={membersError || projectsError}
                    icon={User}
                    color="purple"
                    subtitle="Pessoas diferentes"
                  />
                  <StatsCard
                    title="Owners"
                    value={stats.owners}
                    loading={membersLoading || projectsLoading}
                    error={membersError || projectsError}
                    icon={Crown}
                    color="yellow"
                    subtitle="Proprietários"
                  />
                  <StatsCard
                    title="Admins"
                    value={stats.admins}
                    loading={membersLoading || projectsLoading}
                    error={membersError || projectsError}
                    icon={Shield}
                    color="blue"
                    subtitle="Administradores"
                  />
                  <StatsCard
                    title="Collaborators"
                    value={stats.collaborators}
                    loading={membersLoading || projectsLoading}
                    error={membersError || projectsError}
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
                    Membros dos Projetos
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {filteredMembers.length} {filteredMembers.length === 1 ? 'membro' : 'membros'} 
                    {filter !== 'all' && (() => {
                      const roleText = filter === 'owners' ? 'owner' : 
                                     filter === 'admins' ? 'admin' : 'collaborator';
                      const plural = filteredMembers.length !== 1 ? 's' : '';
                      return ` ${roleText}${plural}`;
                    })()}
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
    </AuthGuard>
  );
}
