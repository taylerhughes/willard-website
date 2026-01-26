import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import PipelineBoard from '@/components/crm/pipeline-board';

export default async function CRMPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all clients with serializable data
  const clientsRaw = await prisma.onboardingClient.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Convert to plain objects with serializable data
  const clients = clientsRaw.map((client) => ({
    id: client.id,
    clientId: client.clientId,
    businessName: client.businessName,
    clientFullName: client.clientFullName,
    email: client.email,
    sprintType: client.sprintType,
    dealValue: client.dealValue?.toString() || null,
    onboardingStatus: client.onboardingStatus,
    pipelineStage: client.pipelineStage,
    stageChangedAt: (client.stageChangedAt || client.createdAt).toISOString(),
    createdAt: client.createdAt.toISOString(),
  }));

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto mx-auto">
        <div className="max-w-[1600px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage client opportunities and track deals through your sales pipeline
                </p>
              </div>
            </div>
          </div>

          {/* Pipeline Board */}
          {clients.length === 0 ? (
            <div className="bg-white shadow-sm rounded-lg p-12 text-center">
              <p className="text-gray-500">No clients found. New clients will appear here as leads.</p>
            </div>
          ) : (
            <PipelineBoard clients={clients} />
          )}
        </div>
      </div>
    </div>
  );
}
