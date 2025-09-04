import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'members';

/**
 * Adicionar membro ao projeto
 */
export async function addProjectMember(memberData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...memberData,
      joinedAt: new Date(),
      status: 'active'
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
    throw error;
  }
}

/**
 * Buscar membros de um projeto
 */
export async function getProjectMembers(projectId) {
  try {
    const membersQuery = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId)
    );
    
    const snapshot = await getDocs(membersQuery);
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Ordenar por data de entrada (mais antigo primeiro)
    members.sort((a, b) => {
      const dateA = a.joinedAt?.toDate ? a.joinedAt.toDate() : new Date(a.joinedAt);
      const dateB = b.joinedAt?.toDate ? b.joinedAt.toDate() : new Date(b.joinedAt);
      return dateA - dateB;
    });
    
    return members;
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    throw error;
  }
}

/**
 * Buscar projetos de um usuário
 */
export async function getUserProjects(userId) {
  try {
    const projectsQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(projectsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar projetos do usuário:', error);
    throw error;
  }
}

/**
 * Verificar se usuário é membro de um projeto
 */
export async function isUserMemberOfProject(userId, projectId) {
  try {
    const memberQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('projectId', '==', projectId),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(memberQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar membro:', error);
    return false;
  }
}

/**
 * Obter role do usuário em um projeto
 */
export async function getUserRoleInProject(userId, projectId) {
  try {
    const memberQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('projectId', '==', projectId),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(memberQuery);
    if (snapshot.empty) {
      return null;
    }
    
    const memberDoc = snapshot.docs[0];
    return memberDoc.data().role;
  } catch (error) {
    console.error('Erro ao obter role do usuário:', error);
    return null;
  }
}

/**
 * Verificar se usuário tem permissão específica
 */
export async function hasPermission(userId, projectId, permission) {
  try {
    const role = await getUserRoleInProject(userId, projectId);
    
    if (!role) return false;
    
    // Definir permissões por role
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
    
    return permissions[role]?.includes(permission) || false;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
}

/**
 * Atualizar role de um membro
 */
export async function updateMemberRole(memberId, newRole) {
  try {
    const memberRef = doc(db, COLLECTION_NAME, memberId);
    await updateDoc(memberRef, {
      role: newRole,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    throw error;
  }
}

/**
 * Remover membro do projeto
 */
export async function removeProjectMember(memberId) {
  try {
    const memberRef = doc(db, COLLECTION_NAME, memberId);
    await updateDoc(memberRef, {
      status: 'removed',
      removedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao remover membro:', error);
    throw error;
  }
}

/**
 * Contar membros ativos de um projeto
 */
export async function countActiveMembers(projectId) {
  try {
    const membersQuery = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(membersQuery);
    return snapshot.size;
  } catch (error) {
    console.error('Erro ao contar membros:', error);
    return 0;
  }
}
