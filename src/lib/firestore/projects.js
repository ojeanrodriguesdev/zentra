import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Firestore sempre disponível em modo de desenvolvimento real

const COLLECTION_NAME = 'projects';

/**
 * Criar um novo projeto
 */
export async function createProject(projectData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    throw error;
  }
}

/**
 * Buscar todos os projetos de um usuário
 */
export async function getUserProjects(userId) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('createdBy', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    throw error;
  }
}

/**
 * Buscar projetos ativos
 */
export async function getActiveProjects(userId = null) {
  try {
    let q;
    if (userId) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('createdBy', '==', userId),
        where('status', '==', 'active'),
        orderBy('updatedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'active'),
        orderBy('updatedAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar projetos ativos:', error);
    throw error;
  }
}

/**
 * Atualizar um projeto
 */
export async function updateProject(projectId, updates) {
  try {
    const projectRef = doc(db, COLLECTION_NAME, projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
}

/**
 * Deletar um projeto
 */
export async function deleteProject(projectId) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, projectId));
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    throw error;
  }
}

/**
 * Contar projetos ativos de um usuário
 */
export async function countActiveProjects(userId) {
  try {
    const projects = await getActiveProjects(userId);
    return projects.length;
  } catch (error) {
    console.error('Erro ao contar projetos:', error);
    return 0;
  }
}
