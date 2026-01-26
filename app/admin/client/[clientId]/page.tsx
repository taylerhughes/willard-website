import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import ClientTabsWrapper from '@/components/crm/client-tabs-wrapper';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { clientId } = await params;

  // Fetch client data with all relations
  const client = await prisma.onboardingClient.findUnique({
    where: { clientId },
    include: {
      convertedToAccount: {
        select: {
          id: true,
          name: true,
        },
      },
      issues: {
        include: {
          assignee: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          project: {
            select: { id: true, name: true, color: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      activityLogs: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Client Not Found</h1>
          <p className="mt-2 text-gray-600">The requested client does not exist.</p>
        </div>
      </div>
    );
  }

  // Fetch all users for assignment dropdown
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Client Not Found</h1>
          <p className="mt-2 text-gray-600">The requested client does not exist.</p>
        </div>
      </div>
    );
  }

  // Serialize all data for client-side components
  const serializedClient = {
    ...client,
    id: client.id.toString(),
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
    approvedAt: client.approvedAt?.toISOString() || null,
    contractSentAt: client.contractSentAt?.toISOString() || null,
    contractSignedAt: client.contractSignedAt?.toISOString() || null,
    stageChangedAt: client.stageChangedAt?.toISOString() || null,
    expectedCloseDate: client.expectedCloseDate?.toISOString() || null,
    issues: client.issues.map((issue) => ({
      ...issue,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      dueDate: issue.dueDate?.toISOString() || null,
      completedAt: issue.completedAt?.toISOString() || null,
    })),
    activityLogs: client.activityLogs.map((activity) => ({
      ...activity,
      createdAt: activity.createdAt.toISOString(),
    })),
    notes: client.notes.map((note) => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    })),
  };

  return (
    <ClientTabsWrapper
      initialClient={serializedClient}
      users={users}
    />
  );
}
