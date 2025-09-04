'use client';

import ProjectMembersPage from '@/views/projects/ProjectMembersPage';

export default function Members({ params }) {
  return <ProjectMembersPage projectId={params.id} />;
}
