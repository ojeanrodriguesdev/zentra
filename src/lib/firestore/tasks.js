import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'tasks';

/**
 * Criar uma nova tarefa vinculada a um projeto
 */
export async function createTask(taskData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
}

/**
 * Buscar todas as tarefas de um projeto específico
 */
export async function getProjectTasks(projectId) {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    const allTasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filtrar tarefas do projeto específico
    const projectTasks = allTasks.filter(task => task.projectId === projectId);
    
    // Ordenar por data de criação (mais recente primeiro)
    projectTasks.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return projectTasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas do projeto:', error);
    throw error;
  }
}

/**
 * Buscar todas as tarefas de um usuário (de todos os projetos)
 */
export async function getUserTasks(userId) {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    const allTasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filtrar tarefas do usuário (criadas por ele ou atribuídas a ele)
    const userTasks = allTasks.filter(task => 
      task.createdBy === userId || task.assignedTo === userId
    );
    
    // Ordenar por data de criação (mais recente primeiro)
    userTasks.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return userTasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas do usuário:', error);
    throw error;
  }
}

/**
 * Buscar tarefas pendentes de um usuário
 */
export async function getPendingTasks(userId) {
  try {
    const userTasks = await getUserTasks(userId);
    return userTasks.filter(task => task.status === 'pending');
  } catch (error) {
    console.error('Erro ao buscar tarefas pendentes:', error);
    throw error;
  }
}

/**
 * Atualizar uma tarefa
 */
export async function updateTask(taskId, updates) {
  try {
    const taskRef = doc(db, COLLECTION_NAME, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
}

/**
 * Deletar uma tarefa
 */
export async function deleteTask(taskId) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, taskId));
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
}

/**
 * Contar tarefas pendentes de um usuário
 */
export async function countPendingTasks(userId) {
  try {
    const pendingTasks = await getPendingTasks(userId);
    return pendingTasks.length;
  } catch (error) {
    console.error('Erro ao contar tarefas pendentes:', error);
    return 0;
  }
}

/**
 * Contar todas as tarefas de um usuário (todos os status)
 */
export async function countAllTasks(userId) {
  try {
    const allTasks = await getUserTasks(userId);
    return allTasks.length;
  } catch (error) {
    console.error('Erro ao contar todas as tarefas:', error);
    return 0;
  }
}

/**
 * Contar tarefas por status em um projeto
 */
export async function getProjectTaskStats(projectId) {
  try {
    const tasks = await getProjectTasks(projectId);
    
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas de tarefas:', error);
    return { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 };
  }
}
