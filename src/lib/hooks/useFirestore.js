import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { countActiveProjects, countProjectMembers } from '@/lib/firestore/projects';
import { countAllTasks } from '@/lib/firestore/tasks';
import { useAuth } from '@/components/providers/auth';

// Firestore sempre disponível em modo de desenvolvimento real

/**
 * Hook para buscar dados em tempo real do Firestore
 * @param {string} collectionName - Nome da collection
 * @param {Array} filters - Array de filtros [field, operator, value]
 * @param {string} orderByField - Campo para ordenação
 * @param {boolean} realtime - Se deve usar realtime updates
 */
export function useFirestore(collectionName, filters = [], orderByField = null, realtime = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;

    setLoading(true);
    setError(null);

    try {
      // Construir query
      let q = collection(db, collectionName);
      
      // Aplicar filtros
      if (filters.length > 0) {
        filters.forEach(filter => {
          if (filter.length === 3) {
            q = query(q, where(filter[0], filter[1], filter[2]));
          }
        });
      }

      // Aplicar ordenação
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }

      // Escolher entre realtime ou single fetch
      if (realtime) {
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setData(documents);
            setLoading(false);
          },
          (err) => {
            console.error(`Erro ao buscar ${collectionName}:`, err);
            setError(err.message);
            setLoading(false);
          }
        );

        return unsubscribe;
      } else {
        getDocs(q)
          .then(snapshot => {
            const documents = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setData(documents);
            setLoading(false);
          })
          .catch(err => {
            console.error(`Erro ao buscar ${collectionName}:`, err);
            setError(err.message);
            setLoading(false);
          });
      }
    } catch (err) {
      console.error(`Erro na configuração da query ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, orderByField, realtime]);

  return { data, loading, error, count: data.length };
}

/**
 * Hook específico para contar documentos com filtros
 * @param {string} collectionName - Nome da collection
 * @param {Array} filters - Array de filtros
 */
export function useFirestoreCount(collectionName, filters = []) {
  const { data, loading, error } = useFirestore(collectionName, filters, null, true);
  return { count: data.length, loading, error };
}

/**
 * Hook para estatísticas da dashboard
 */
export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    members: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Usar as novas funções otimizadas
        const [projects, tasks, members] = await Promise.all([
          countActiveProjects(user.uid), // Projetos ativos do usuário
          countAllTasks(user.uid),       // Total de tarefas do usuário (todos os status)
          countProjectMembers(user.uid)  // Membros únicos nos projetos do usuário
        ]);

        setStats({ projects, tasks, members });
        setError(null);
        
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError('Erro ao carregar estatísticas');
        setStats({ projects: 0, tasks: 0, members: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading, error };
}


