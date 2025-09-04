import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth';
import { getUserRoleInProject, hasPermission } from '@/lib/firestore/members';

/**
 * Hook para verificar permissões do usuário em um projeto específico
 */
export function useProjectPermissions(projectId) {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({
    canEditProject: false,
    canDeleteProject: false,
    canManageMembers: false,
    canCreateTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeTaskStatus: false,
    canMarkTaskCompleted: false,
    canComment: false,
    role: null,
    loading: true
  });

  useEffect(() => {
    if (!user || !projectId) {
      setPermissions({
        canEditProject: false,
        canDeleteProject: false,
        canManageMembers: false,
        canCreateTasks: false,
        canEditTasks: false,
        canDeleteTasks: false,
        canChangeTaskStatus: false,
        canMarkTaskCompleted: false,
        canComment: false,
        role: null,
        loading: false
      });
      return;
    }

    checkPermissions();
  }, [user, projectId]);

  const checkPermissions = async () => {
    try {
      setPermissions(prev => ({ ...prev, loading: true }));

      const role = await getUserRoleInProject(projectId, user.uid);
      
      if (!role) {
        // Usuário não é membro do projeto
        setPermissions({
          canEditProject: false,
          canDeleteProject: false,
          canManageMembers: false,
          canCreateTasks: false,
          canEditTasks: false,
          canDeleteTasks: false,
          canChangeTaskStatus: false,
          canMarkTaskCompleted: false,
          canComment: false,
          role: null,
          loading: false
        });
        return;
      }

      // Verificar permissões baseadas no role
      const canEditProject = await hasPermission(projectId, user.uid, 'edit_project');
      const canDeleteProject = await hasPermission(projectId, user.uid, 'delete_project');
      const canManageMembers = await hasPermission(projectId, user.uid, 'manage_members');
      const canCreateTasks = await hasPermission(projectId, user.uid, 'create_tasks');
      const canEditTasks = await hasPermission(projectId, user.uid, 'edit_tasks');
      const canDeleteTasks = await hasPermission(projectId, user.uid, 'delete_tasks');
      const canChangeTaskStatus = await hasPermission(projectId, user.uid, 'change_task_status');
      const canMarkTaskCompleted = await hasPermission(projectId, user.uid, 'mark_task_completed');
      const canComment = await hasPermission(projectId, user.uid, 'comment');

      setPermissions({
        canEditProject,
        canDeleteProject,
        canManageMembers,
        canCreateTasks,
        canEditTasks,
        canDeleteTasks,
        canChangeTaskStatus,
        canMarkTaskCompleted,
        canComment,
        role,
        loading: false
      });

    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setPermissions({
        canEditProject: false,
        canDeleteProject: false,
        canManageMembers: false,
        canCreateTasks: false,
        canEditTasks: false,
        canDeleteTasks: false,
        canChangeTaskStatus: false,
        canMarkTaskCompleted: false,
        canComment: false,
        role: null,
        loading: false
      });
    }
  };

  return {
    ...permissions,
    refreshPermissions: checkPermissions
  };
}

/**
 * Hook para verificar permissões em múltiplos projetos
 */
export function useMultipleProjectPermissions(projectIds) {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !projectIds || projectIds.length === 0) {
      setPermissions({});
      setLoading(false);
      return;
    }

    checkAllPermissions();
  }, [user, projectIds?.join(',')]);

  const checkAllPermissions = async () => {
    try {
      setLoading(true);
      const permissionsMap = {};

      for (const projectId of projectIds) {
        try {
          const role = await getUserRoleInProject(projectId, user.uid);
          
          if (role) {
            permissionsMap[projectId] = {
              canEditProject: await hasPermission(projectId, user.uid, 'edit_project'),
              canDeleteProject: await hasPermission(projectId, user.uid, 'delete_project'),
              canManageMembers: await hasPermission(projectId, user.uid, 'manage_members'),
              canCreateTasks: await hasPermission(projectId, user.uid, 'create_tasks'),
              canEditTasks: await hasPermission(projectId, user.uid, 'edit_tasks'),
              canDeleteTasks: await hasPermission(projectId, user.uid, 'delete_tasks'),
              canChangeTaskStatus: await hasPermission(projectId, user.uid, 'change_task_status'),
              canMarkTaskCompleted: await hasPermission(projectId, user.uid, 'mark_task_completed'),
              canComment: await hasPermission(projectId, user.uid, 'comment'),
              role
            };
          } else {
            permissionsMap[projectId] = {
              canEditProject: false,
              canDeleteProject: false,
              canManageMembers: false,
              canCreateTasks: false,
              canEditTasks: false,
              canDeleteTasks: false,
              canChangeTaskStatus: false,
              canMarkTaskCompleted: false,
              canComment: false,
              role: null
            };
          }
        } catch (error) {
          console.error(`Erro ao verificar permissões do projeto ${projectId}:`, error);
          permissionsMap[projectId] = {
            canEditProject: false,
            canDeleteProject: false,
            canManageMembers: false,
            canCreateTasks: false,
            canEditTasks: false,
            canDeleteTasks: false,
            canChangeTaskStatus: false,
            canMarkTaskCompleted: false,
            canComment: false,
            role: null
          };
        }
      }

      setPermissions(permissionsMap);
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setPermissions({});
    } finally {
      setLoading(false);
    }
  };

  return {
    permissions,
    loading,
    refreshPermissions: checkAllPermissions
  };
}
