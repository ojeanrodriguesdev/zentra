import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc
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

    // Adicionar automaticamente o criador como membro do projeto
    if (projectData.createdBy && projectData.createdByName) {
      await addDoc(collection(db, 'project_members'), {
        projectId: docRef.id,
        userId: projectData.createdBy,
        userName: projectData.createdByName,
        userEmail: projectData.createdByEmail || 'email@exemplo.com',
        role: 'owner',
        active: true,
        joinedAt: new Date(),
        createdAt: new Date()
      });
    }

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
    // Solução temporária: buscar todos os projetos e filtrar no cliente
    // Isso evita o erro de índice do Firestore
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    const allProjects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filtrar projetos do usuário no cliente
    const userProjects = allProjects.filter(project => project.createdBy === userId);
    
    // Ordenar por data de atualização (mais recente primeiro)
    userProjects.sort((a, b) => {
      const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt);
      const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt);
      return dateB - dateA;
    });
    
    console.log('✅ Projetos encontrados após filtro:', userProjects);
    return userProjects;
    
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
    // Solução temporária: buscar todos os projetos e filtrar no cliente
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    const allProjects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filtrar projetos ativos e do usuário (se especificado)
    let activeProjects = allProjects.filter(project => project.status === 'active');
    
    if (userId) {
      activeProjects = activeProjects.filter(project => project.createdBy === userId);
    }
    
    // Ordenar por data de atualização (mais recente primeiro)
    activeProjects.sort((a, b) => {
      const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt);
      const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt);
      return dateB - dateA;
    });
    
    return activeProjects;
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
 * Deletar um projeto e todas as suas tarefas e membros
 */
export async function deleteProject(projectId) {
  try {
    // Deletar todas as tarefas do projeto
    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const projectTasks = tasksSnapshot.docs.filter(doc => doc.data().projectId === projectId);
    
    for (const taskDoc of projectTasks) {
      await deleteDoc(doc(db, 'tasks', taskDoc.id));
    }

    // Deletar todos os membros do projeto
    const membersSnapshot = await getDocs(collection(db, 'project_members'));
    const projectMembers = membersSnapshot.docs.filter(doc => doc.data().projectId === projectId);
    
    for (const memberDoc of projectMembers) {
      await deleteDoc(doc(db, 'project_members', memberDoc.id));
    }

    // Deletar o projeto
    await deleteDoc(doc(db, COLLECTION_NAME, projectId));
    
    console.log('✅ Projeto deletado com sucesso:', projectId);
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

/**
 * Contar membros únicos em projetos do usuário
 */
export async function countProjectMembers(userId) {
  try {
    // Buscar todos os membros de projeto
    const membersSnapshot = await getDocs(collection(db, 'project_members'));
    const projectMembers = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Buscar projetos do usuário
    const userProjects = await getUserProjects(userId);
    const userProjectIds = userProjects.map(p => p.id);

    // Filtrar membros que pertencem aos projetos do usuário
    const relevantMembers = projectMembers.filter(member => 
      userProjectIds.includes(member.projectId) && member.active
    );

    // Contar membros únicos (baseado no userId)
    const uniqueUserIds = new Set(relevantMembers.map(member => member.userId));
    
    return uniqueUserIds.size;
  } catch (error) {
    console.error('Erro ao contar membros:', error);
    return 0;
  }
}
