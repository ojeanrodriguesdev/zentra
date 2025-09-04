'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useActivities(userId = null, limitCount = 10) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar projetos do usuário primeiro
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const allProjects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'project'
      }));

      // Filtrar apenas projetos do usuário ou onde ele é membro
      const userProjects = allProjects.filter(project => 
        project.createdBy === userId
      );
      const userProjectIds = userProjects.map(p => p.id);

      // Buscar tarefas apenas dos projetos do usuário
      const tasksSnapshot = await getDocs(collection(db, 'tasks'));
      const allTasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'task'
      }));

      const userTasks = allTasks.filter(task => 
        userProjectIds.includes(task.projectId) || task.createdBy === userId
      );

      // Buscar membros apenas dos projetos do usuário
      const membersSnapshot = await getDocs(collection(db, 'project_members'));
      const allMembers = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'member'
      }));

      const userTeamMembers = allMembers.filter(member => 
        userProjectIds.includes(member.projectId)
      );

      // Combinar apenas atividades relacionadas ao usuário/equipe
      let allActivities = [...userProjects, ...userTasks, ...userTeamMembers];

      // Ordenar por data de criação (mais recente primeiro)
      allActivities.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });

      // Limitar quantidade
      const limitedActivities = allActivities.slice(0, limitCount);

      // Transformar em formato de atividade
      const formattedActivities = limitedActivities.map(item => {
        switch (item.type) {
          case 'project':
            return {
              id: `project-${item.id}`,
              type: 'project_created',
              icon: '📁',
              iconBg: 'bg-blue-100 dark:bg-blue-900/20',
              iconColor: 'text-blue-600 dark:text-blue-400',
              title: `Projeto "${item.name}" foi criado`,
              subtitle: `por ${item.createdByName || 'Usuário'}`,
              time: item.createdAt,
              data: item
            };
          case 'task':
            return {
              id: `task-${item.id}`,
              type: 'task_created',
              icon: '✅',
              iconBg: 'bg-green-100 dark:bg-green-900/20',
              iconColor: 'text-green-600 dark:text-green-400',
              title: `Tarefa "${item.title}" foi criada`,
              subtitle: `no projeto ${item.projectName || 'Projeto'} • ${item.assignedToName || 'Membro'}`,
              time: item.createdAt,
              data: item
            };
          case 'member':
            return {
              id: `member-${item.id}`,
              type: 'member_joined',
              icon: '👤',
              iconBg: 'bg-purple-100 dark:bg-purple-900/20',
              iconColor: 'text-purple-600 dark:text-purple-400',
              title: `${item.userName} entrou no projeto`,
              subtitle: `como ${item.role || 'membro'}`,
              time: item.joinedAt || item.createdAt,
              data: item
            };
          default:
            return null;
        }
      }).filter(Boolean);

      setActivities(formattedActivities);
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  }, [userId, limitCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Só carregar atividades se o userId estiver definido
    if (userId) {
      loadActivities();
    } else {
      setLoading(false);
      setActivities([]);
    }
  }, [userId, loadActivities]);



  const formatTimeAgo = (date) => {
    if (!date) return 'Agora';
    
    const now = new Date();
    const activityDate = date.toDate ? date.toDate() : new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return activityDate.toLocaleDateString('pt-BR');
  };

  return {
    activities,
    loading,
    error,
    formatTimeAgo,
    refresh: loadActivities
  };
}
