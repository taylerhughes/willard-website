import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import IssuesPageWrapper from '@/components/pm/issues-page-wrapper';

export default async function IssuesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch initial issues
  const issuesRaw = await prisma.issue.findMany({
    include: {
      assignee: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      reporter: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      project: {
        select: { id: true, name: true, color: true, icon: true },
      },
      cycle: {
        select: { id: true, name: true },
      },
      client: {
        select: { id: true, clientId: true, businessName: true, clientFullName: true },
      },
      labels: {
        include: {
          label: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: [
      { status: 'asc' },
      { createdAt: 'desc' },
    ],
    take: 50, // Initial load limit
  });

  // Serialize issues
  const issues = issuesRaw.map((issue) => ({
    ...issue,
    createdAt: issue.createdAt.toISOString(),
    updatedAt: issue.updatedAt.toISOString(),
    dueDate: issue.dueDate?.toISOString() || null,
    completedAt: issue.completedAt?.toISOString() || null,
  }));

  // Fetch users for assignee dropdown
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  // Fetch projects for filter
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
    },
  });

  // Fetch clients and accounts for the drawer
  const clients = await prisma.onboardingClient.findMany({
    select: {
      id: true,
      clientId: true,
      businessName: true,
      clientFullName: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <IssuesPageWrapper
      initialIssues={issues}
      users={users}
      projects={projects}
      clients={clients}
      accounts={accounts}
    />
  );
}
