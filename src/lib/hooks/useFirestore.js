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
  }, [collectionName, JSON.stringify(filters), orderByField, realtime]);

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
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    members: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const [projectsSnap, tasksSnap, membersSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'tasks')),
          getDocs(collection(db, 'members'))
        ]);

        // Contar projetos ativos
        const projects = projectsSnap.docs.filter(doc => {
          const data = doc.data();
          return data?.status === 'active';
        }).length;

        // Contar tarefas pendentes
        const tasks = tasksSnap.docs.filter(doc => {
          const data = doc.data();
          return data?.status === 'pending';
        }).length;

        // Contar membros ativos
        const members = membersSnap.docs.filter(doc => {
          const data = doc.data();
          return data?.active === true;
        }).length;

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
  }, []);

  return { stats, loading, error };
}
