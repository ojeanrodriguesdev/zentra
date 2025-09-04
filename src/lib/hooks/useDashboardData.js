'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Hook otimizado para dados do dashboard
 * Evita índices compostos fazendo filtragem no cliente
 */
export function useDashboardData(userId) {
  const [recentProjects, setRecentProjects] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar todos os projetos do usuário (sem orderBy para evitar índice composto)
        const projectsQuery = query(
          collection(db, 'projects'),
          where('createdBy', '==', userId)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        const allProjects = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Ordenar no cliente por data de atualização
        const sortedProjects = allProjects.sort((a, b) => {
          const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0);
          const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0);
          return dateB - dateA;
        });

        setRecentProjects(sortedProjects.slice(0, 4));

        // Buscar todas as tarefas (sem filtros para evitar índices)
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        const allTasks = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filtrar e ordenar tarefas pendentes no cliente
        const userPendingTasks = allTasks
          .filter(task => task.status === 'pending')
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
          });

        setPendingTasks(userPendingTasks.slice(0, 4));

      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userId]);

  return {
    recentProjects,
    pendingTasks,
    loading,
    error
  };
}
