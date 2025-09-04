'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Hook para buscar membros da equipe disponíveis
 */
export function useTeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar membros ativos
        const membersSnapshot = await getDocs(collection(db, 'members'));
        const allMembers = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filtrar apenas membros ativos
        const activeMembers = allMembers.filter(member => member.active === true);

        // Ordenar por nome
        activeMembers.sort((a, b) => a.name.localeCompare(b.name));

        setMembers(activeMembers);
      } catch (err) {
        console.error('Erro ao carregar membros:', err);
        setError('Erro ao carregar membros da equipe');
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  return { members, loading, error };
}

/**
 * Hook para buscar membros de um projeto específico
 */
export function useProjectMembers(projectId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const loadProjectMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar membros do projeto
        const projectMembersSnapshot = await getDocs(collection(db, 'project_members'));
        const allProjectMembers = projectMembersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filtrar membros deste projeto específico
        const projectMembers = allProjectMembers.filter(
          member => member.projectId === projectId && member.active
        );

        // Buscar dados completos dos membros
        const membersSnapshot = await getDocs(collection(db, 'members'));
        const allMembers = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Combinar dados dos membros do projeto com dados completos
        const fullProjectMembers = projectMembers.map(projectMember => {
          const fullMember = allMembers.find(member => member.id === projectMember.userId);
          return {
            ...projectMember,
            memberData: fullMember || {
              name: projectMember.userName || 'Membro',
              email: projectMember.userEmail || '',
              role: projectMember.role || 'member'
            }
          };
        });

        setMembers(fullProjectMembers);
      } catch (err) {
        console.error('Erro ao carregar membros do projeto:', err);
        setError('Erro ao carregar membros do projeto');
      } finally {
        setLoading(false);
      }
    };

    loadProjectMembers();
  }, [projectId]);

  return { members, loading, error };
}
