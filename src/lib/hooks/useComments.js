import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '@/components/providers/auth';

/**
 * Hook para gerenciar comentários de uma tarefa
 */
export function useTaskComments(taskId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'comments'),
      where('taskId', '==', taskId)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const commentsData = [];
        querySnapshot.forEach((doc) => {
          commentsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Ordenar por data de criação (mais antigo primeiro)
        commentsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateA - dateB;
        });
        
        setComments(commentsData);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao buscar comentários:', err);
        setError('Erro ao carregar comentários');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [taskId]);

  return {
    comments,
    loading,
    error,
    count: comments.length
  };
}

/**
 * Hook para gerenciar comentários de um projeto
 */
export function useProjectComments(projectId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'comments'),
      where('projectId', '==', projectId)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const commentsData = [];
        querySnapshot.forEach((doc) => {
          commentsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Ordenar por data de criação (mais recente primeiro)
        commentsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA;
        });
        
        setComments(commentsData);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao buscar comentários do projeto:', err);
        setError('Erro ao carregar comentários');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  return {
    comments,
    loading,
    error,
    count: comments.length
  };
}

/**
 * Hook para verificar permissões de comentário
 */
export function useCommentPermissions(projectId) {
  const { user } = useAuth();
  const [canComment, setCanComment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !projectId) {
      setCanComment(false);
      setLoading(false);
      return;
    }

    checkPermissions();
  }, [user, projectId, checkPermissions]);

  const checkPermissions = useCallback(async () => {
    try {
      setLoading(true);
      
      const { isUserMemberOfProject } = await import('../firestore/members');
      const isMember = await isUserMemberOfProject(projectId, user.uid);
      
      setCanComment(isMember);
    } catch (error) {
      console.error('Erro ao verificar permissões de comentário:', error);
      setCanComment(false);
    } finally {
      setLoading(false);
    }
  }, [projectId, user?.uid]);

  return {
    canComment,
    loading
  };
}