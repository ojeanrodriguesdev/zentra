import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  where,
  orderBy,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION_NAME = 'invitations';

/**
 * Criar convite para um projeto
 */
export async function createInvitation(invitationData) {
  try {
    // Gerar token único
    const token = uuidv4();
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...invitationData,
      token,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    });
    
    return { id: docRef.id, token };
  } catch (error) {
    console.error('Erro ao criar convite:', error);
    throw error;
  }
}

/**
 * Buscar convite por token
 */
export async function getInvitationByToken(token) {
  try {
    const invitationQuery = query(
      collection(db, COLLECTION_NAME),
      where('token', '==', token),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(invitationQuery);
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Erro ao buscar convite:', error);
    throw error;
  }
}

/**
 * Buscar convites de um projeto
 */
export async function getProjectInvitations(projectId) {
  try {
    const invitationsQuery = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(invitationsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar convites do projeto:', error);
    throw error;
  }
}

/**
 * Aceitar convite
 */
export async function acceptInvitation(invitationId, userId, userName, userEmail) {
  try {
    const invitationRef = doc(db, COLLECTION_NAME, invitationId);
    const invitationDoc = await getDoc(invitationRef);
    
    if (!invitationDoc.exists()) {
      throw new Error('Convite não encontrado');
    }
    
    const invitationData = invitationDoc.data();
    
    // Atualizar status do convite
    await updateDoc(invitationRef, {
      status: 'accepted',
      acceptedBy: userId,
      acceptedAt: new Date()
    });
    
    // Adicionar membro ao projeto
    const { addProjectMember } = await import('./members');
    await addProjectMember({
      projectId: invitationData.projectId,
      userId,
      userName,
      userEmail,
      role: invitationData.role,
      invitedBy: invitationData.invitedBy
    });
    
    return {
      success: true,
      projectId: invitationData.projectId,
      projectName: invitationData.projectName,
      role: invitationData.role
    };
  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    throw error;
  }
}

/**
 * Rejeitar convite
 */
export async function rejectInvitation(invitationId) {
  try {
    const invitationRef = doc(db, COLLECTION_NAME, invitationId);
    await updateDoc(invitationRef, {
      status: 'rejected',
      rejectedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao rejeitar convite:', error);
    throw error;
  }
}

/**
 * Cancelar convite
 */
export async function cancelInvitation(invitationId) {
  try {
    const invitationRef = doc(db, COLLECTION_NAME, invitationId);
    await updateDoc(invitationRef, {
      status: 'cancelled',
      cancelledAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao cancelar convite:', error);
    throw error;
  }
}

/**
 * Verificar se email já foi convidado para o projeto
 */
export async function isEmailAlreadyInvited(email, projectId) {
  try {
    const invitationQuery = query(
      collection(db, COLLECTION_NAME),
      where('email', '==', email),
      where('projectId', '==', projectId),
      where('status', 'in', ['pending', 'accepted'])
    );
    
    const snapshot = await getDocs(invitationQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar convite existente:', error);
    return false;
  }
}

/**
 * Limpar convites expirados
 */
export async function cleanupExpiredInvitations() {
  try {
    const expiredQuery = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'pending'),
      where('expiresAt', '<', new Date())
    );
    
    const snapshot = await getDocs(expiredQuery);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'expired',
        expiredAt: new Date()
      });
    });
    
    await batch.commit();
    return snapshot.size;
  } catch (error) {
    console.error('Erro ao limpar convites expirados:', error);
    throw error;
  }
}
