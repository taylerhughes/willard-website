import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import BoardPageWrapper from '@/components/pm/board-page-wrapper';

export default async function BoardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all issues for the board
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
      _count: {
        select: { comments: true },
      },
    },
    orderBy: [
      { status: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  // Serialize issues
  const issues = issuesRaw.map((issue) => ({
    ...issue,
    createdAt: issue.createdAt.toISOString(),
    updatedAt: issue.updatedAt.toISOString(),
    dueDate: issue.dueDate?.toISOString() || null,
    completedAt: issue.completedAt?.toISOString() || null,
  }));

  // Fetch users, projects, clients, and accounts for the drawer
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
    },
  });

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
    <BoardPageWrapper
      initialIssues={issues}
      users={users}
      projects={projects}
      clients={clients}
      accounts={accounts}
    />
  );
}
