import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Funções CRUD para Projects
 */
export const projectsAPI = {
  // Criar projeto
  async create(projectData) {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  },

  // Atualizar projeto
  async update(projectId, updates) {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  },

  // Deletar projeto
  async delete(projectId) {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      throw error;
    }
  }
};

/**
 * Funções CRUD para Tasks
 */
export const tasksAPI = {
  // Criar tarefa
  async create(taskData) {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  },

  // Atualizar tarefa
  async update(taskId, updates) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  },

  // Deletar tarefa
  async delete(taskId) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  }
};

/**
 * Funções CRUD para Members
 */
export const membersAPI = {
  // Adicionar membro
  async create(memberData) {
    try {
      const docRef = await addDoc(collection(db, 'members'), {
        ...memberData,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }
  },

  // Atualizar membro
  async update(memberId, updates) {
    try {
      const memberRef = doc(db, 'members', memberId);
      await updateDoc(memberRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      throw error;
    }
  },

  // Remover membro
  async delete(memberId) {
    try {
      await deleteDoc(doc(db, 'members', memberId));
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      throw error;
    }
  }
};

/**
 * Dados de exemplo para popular o Firestore
 */
export const sampleData = {
  projects: [
    {
      name: 'Website Zentra',
      description: 'Desenvolvimento do site principal da empresa',
      status: 'active',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      assignedTo: ['user1', 'user2'],
      tags: ['web', 'frontend', 'priority']
    },
    {
      name: 'App Mobile',
      description: 'Aplicativo móvel para gestão de tarefas',
      status: 'active', 
      priority: 'medium',
      dueDate: new Date('2025-02-15'),
      assignedTo: ['user3'],
      tags: ['mobile', 'react-native']
    },
    {
      name: 'Sistema CRM',
      description: 'CRM interno para gestão de clientes',
      status: 'completed',
      priority: 'low',
      dueDate: new Date('2024-11-30'),
      assignedTo: ['user1', 'user4'],
      tags: ['backend', 'database']
    }
  ],
  
  tasks: [
    {
      title: 'Implementar autenticação',
      description: 'Configurar Firebase Auth com Google',
      status: 'completed',
      priority: 'high',
      projectId: 'project1',
      assignedTo: 'user1',
      dueDate: new Date('2024-12-20'),
      tags: ['auth', 'firebase']
    },
    {
      title: 'Criar dashboard',
      description: 'Desenvolver interface principal da dashboard',
      status: 'pending',
      priority: 'high',
      projectId: 'project1',
      assignedTo: 'user1',
      dueDate: new Date('2024-12-25'),
      tags: ['frontend', 'ui']
    },
    {
      title: 'Integrar Firestore',
      description: 'Conectar aplicação com banco de dados',
      status: 'pending',
      priority: 'medium',
      projectId: 'project1', 
      assignedTo: 'user2',
      dueDate: new Date('2024-12-22'),
      tags: ['backend', 'database']
    },
    {
      title: 'Testes unitários',
      description: 'Implementar suite de testes',
      status: 'pending',
      priority: 'low',
      projectId: 'project1',
      assignedTo: 'user3',
      dueDate: new Date('2024-12-30'),
      tags: ['testing', 'quality']
    },
    {
      title: 'Deploy produção',
      description: 'Configurar deploy automatizado',
      status: 'pending',
      priority: 'medium',
      projectId: 'project1',
      assignedTo: 'user1',
      dueDate: new Date('2025-01-05'),
      tags: ['devops', 'deploy']
    }
  ],
  
  members: [
    {
      name: 'Jean Rodrigues',
      email: 'jean@zentra.com',
      role: 'admin',
      active: true,
      avatar: null,
      joinedAt: new Date('2024-01-01'),
      skills: ['React', 'Next.js', 'Firebase', 'Tailwind'],
      department: 'Desenvolvimento'
    },
    {
      name: 'Maria Silva',
      email: 'maria@zentra.com', 
      role: 'developer',
      active: true,
      avatar: null,
      joinedAt: new Date('2024-02-15'),
      skills: ['React', 'TypeScript', 'Node.js'],
      department: 'Desenvolvimento'
    },
    {
      name: 'João Santos',
      email: 'joao@zentra.com',
      role: 'designer',
      active: true,
      avatar: null,
      joinedAt: new Date('2024-03-01'),
      skills: ['Figma', 'Adobe XD', 'UI/UX'],
      department: 'Design'
    },
    {
      name: 'Ana Costa',
      email: 'ana@zentra.com',
      role: 'manager',
      active: false,
      avatar: null,
      joinedAt: new Date('2024-01-15'),
      skills: ['Gestão', 'Agile', 'Scrum'],
      department: 'Gestão'
    }
  ]
};
