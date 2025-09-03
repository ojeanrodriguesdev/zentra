import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleData } from '@/lib/firestore/collections';

/**
 * Função para popular o Firestore com dados de exemplo
 * USAR APENAS EM DESENVOLVIMENTO
 */
export async function seedFirestore() {
  console.log('🌱 Iniciando seed do Firestore...');
  
  try {
    // Limpar e popular Projects
    console.log('📁 Criando projetos...');
    for (const project of sampleData.projects) {
      await addDoc(collection(db, 'projects'), {
        ...project,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Limpar e popular Tasks
    console.log('✅ Criando tarefas...');
    for (const task of sampleData.tasks) {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Limpar e popular Members
    console.log('👥 Criando membros...');
    for (const member of sampleData.members) {
      await addDoc(collection(db, 'members'), {
        ...member,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log('✅ Seed concluído com sucesso!');
    console.log(`Criados: ${sampleData.projects.length} projetos, ${sampleData.tasks.length} tarefas, ${sampleData.members.length} membros`);
    
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    throw error;
  }
}

/**
 * Função para verificar se o Firestore já tem dados
 */
export async function checkFirestoreData() {
  try {
    const [projectsSnapshot, tasksSnapshot, membersSnapshot] = await Promise.all([
      getDocs(collection(db, 'projects')),
      getDocs(collection(db, 'tasks')),
      getDocs(collection(db, 'members'))
    ]);
    
    return {
      projects: projectsSnapshot.size,
      tasks: tasksSnapshot.size,
      members: membersSnapshot.size,
      hasData: projectsSnapshot.size > 0 || tasksSnapshot.size > 0 || membersSnapshot.size > 0
    };
  } catch (error) {
    console.error('Erro ao verificar dados do Firestore:', error);
    return { projects: 0, tasks: 0, members: 0, hasData: false };
  }
}
