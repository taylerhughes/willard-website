import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProjectsPageWrapper from '@/components/pm/projects-page-wrapper';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const projects = await prisma.project.findMany({
    include: {
      lead: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      client: {
        select: { id: true, clientId: true, businessName: true, clientFullName: true },
      },
      _count: {
        select: { issues: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, avatar: true },
  });

  const accounts = await prisma.account.findMany({
    select: { id: true, name: true, industry: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ProjectsPageWrapper
      initialProjects={projects}
      users={users}
      accounts={accounts}
    />
  );
}
