'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/auth';

/**
 * Hook para gerenciar membros de um projeto
 */
export function useProjectMembers(projectId) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    if (!projectId || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Buscar membros do projeto
    const membersQuery = query(
      collection(db, 'members'),
      where('projectId', '==', projectId),
      where('status', '==', 'active')
    );

    const unsubscribeMembers = onSnapshot(
      membersQuery,
      (snapshot) => {
        const membersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Ordenar por data de entrada (mais antigo primeiro)
        membersData.sort((a, b) => {
          const dateA = a.joinedAt?.toDate ? a.joinedAt.toDate() : new Date(a.joinedAt);
          const dateB = b.joinedAt?.toDate ? b.joinedAt.toDate() : new Date(b.joinedAt);
          return dateA - dateB;
        });
        
        setMembers(membersData);

        // Encontrar role do usuário atual
        const currentUserMember = membersData.find(member => member.userId === user.uid);
        if (currentUserMember) {
          setUserRole(currentUserMember.role);
          setUserPermissions(getPermissionsByRole(currentUserMember.role));
        } else {
          setUserRole(null);
          setUserPermissions([]);
        }

        setLoading(false);
      },
      (err) => {
        console.error('Erro ao buscar membros:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribeMembers();
  }, [projectId, user]);

  // Função para obter permissões baseadas no role
  const getPermissionsByRole = (role) => {
    const permissions = {
      owner: [
        'view_all_tasks',
        'create_tasks',
        'edit_tasks',
        'delete_tasks',
        'comment_tasks',
        'change_status',
        'mark_completed',
        'manage_members',
        'delete_project'
      ],
      admin: [
        'view_all_tasks',
        'create_tasks',
        'edit_tasks',
        'comment_tasks',
        'change_status',
        'mark_completed'
      ],
      collaborator: [
        'view_assigned_tasks',
        'comment_tasks',
        'change_status_pending',
        'change_status_in_progress'
      ]
    };
    
    return permissions[role] || [];
  };

  // Função para verificar se usuário tem permissão específica
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  // Função para verificar se usuário pode gerenciar membros
  const canManageMembers = () => {
    return hasPermission('manage_members');
  };

  // Função para verificar se usuário pode editar tarefas
  const canEditTasks = () => {
    return hasPermission('edit_tasks');
  };

  // Função para verificar se usuário pode deletar tarefas
  const canDeleteTasks = () => {
    return hasPermission('delete_tasks');
  };

  // Função para verificar se usuário pode marcar tarefa como concluída
  const canMarkCompleted = () => {
    return hasPermission('mark_completed');
  };

  // Função para verificar se usuário pode ver todas as tarefas
  const canViewAllTasks = () => {
    return hasPermission('view_all_tasks');
  };

  return {
    members,
    loading,
    error,
    userRole,
    userPermissions,
    hasPermission,
    canManageMembers,
    canEditTasks,
    canDeleteTasks,
    canMarkCompleted,
    canViewAllTasks,
    // Estatísticas
    totalMembers: members.length,
    owners: members.filter(m => m.role === 'owner').length,
    admins: members.filter(m => m.role === 'admin').length,
    collaborators: members.filter(m => m.role === 'collaborator').length
  };
}
