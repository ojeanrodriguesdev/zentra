import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'comments';

/**
 * Estrutura do documento de comentário:
 * {
 *   id: string (gerado automaticamente)
 *   projectId: string
 *   taskId: string
 *   userId: string
 *   userName: string
 *   userEmail: string
 *   userAvatar?: string
 *   text: string
 *   createdAt: Timestamp
 *   updatedAt: Timestamp
 *   edited: boolean
 * }
 */

/**
 * Adicionar comentário a uma tarefa
 */
export async function addComment({ projectId, taskId, userId, userName, userEmail, userAvatar, text }) {
  try {
    const commentData = {
      projectId,
      taskId,
      userId,
      userName,
      userEmail,
      userAvatar: userAvatar || null,
      text: text.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      edited: false
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), commentData);
    
    return {
      id: docRef.id,
      ...commentData
    };
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    throw error;
  }
}

/**
 * Atualizar comentário
 */
export async function updateComment(commentId, updates) {
  try {
    const commentRef = doc(db, COLLECTION_NAME, commentId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
      edited: true
    };

    await updateDoc(commentRef, updateData);
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    throw error;
  }
}

/**
 * Deletar comentário
 */
export async function deleteComment(commentId) {
  try {
    const commentRef = doc(db, COLLECTION_NAME, commentId);
    await deleteDoc(commentRef);
    
    return true;
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    throw error;
  }
}

/**
 * Buscar comentários de uma tarefa
 */
export async function getTaskComments(taskId) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('taskId', '==', taskId)
    );

    const querySnapshot = await getDocs(q);
    const comments = [];

    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Ordenar por data de criação (mais antigo primeiro)
    comments.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateA - dateB;
    });

    return comments;
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    throw error;
  }
}

/**
 * Buscar comentários de um projeto
 */
export async function getProjectComments(projectId) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId)
    );

    const querySnapshot = await getDocs(q);
    const comments = [];

    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Ordenar por data de criação (mais recente primeiro)
    comments.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });

    return comments;
  } catch (error) {
    console.error('Erro ao buscar comentários do projeto:', error);
    throw error;
  }
}

/**
 * Contar comentários de uma tarefa
 */
export async function countTaskComments(taskId) {
  try {
    const comments = await getTaskComments(taskId);
    return comments.length;
  } catch (error) {
    console.error('Erro ao contar comentários:', error);
    return 0;
  }
}

/**
 * Contar comentários de um projeto
 */
export async function countProjectComments(projectId) {
  try {
    const comments = await getProjectComments(projectId);
    return comments.length;
  } catch (error) {
    console.error('Erro ao contar comentários do projeto:', error);
    return 0;
  }
}

/**
 * Verificar se usuário pode comentar (é membro do projeto)
 */
export async function canUserComment(projectId, userId) {
  try {
    const { isUserMemberOfProject } = await import('./members');
    return await isUserMemberOfProject(projectId, userId);
  } catch (error) {
    console.error('Erro ao verificar permissão de comentário:', error);
    return false;
  }
}

/**
 * Verificar se usuário pode editar/deletar comentário
 */
export async function canUserManageComment(commentId, userId) {
  try {
    const commentRef = doc(db, COLLECTION_NAME, commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      return false;
    }
    
    const commentData = commentDoc.data();
    
    // Usuário pode editar/deletar se for o autor do comentário
    return commentData.userId === userId;
  } catch (error) {
    console.error('Erro ao verificar permissão de gerenciar comentário:', error);
    return false;
  }
}
