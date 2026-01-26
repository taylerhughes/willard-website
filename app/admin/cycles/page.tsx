import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function CyclesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const cycles = await prisma.cycle.findMany({
    include: {
      _count: {
        select: { issues: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const CYCLE_STATUSES = {
    planned: { label: 'Planned', color: '#6b7280' },
    active: { label: 'Active', color: '#10b981' },
    completed: { label: 'Completed', color: '#3b82f6' },
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Cycles</h1>
            <p className="mt-1 text-sm text-gray-600">
              Plan and track work across sprints
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {cycles.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <p className="text-gray-500">No cycles yet. Create one to start planning sprints!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cycles.map((cycle) => {
              const startDate = cycle.startDate ? new Date(cycle.startDate) : null;
              const endDate = cycle.endDate ? new Date(cycle.endDate) : null;
              const now = new Date();
              const isActive = startDate && endDate && now >= startDate && now <= endDate;

              return (
                <div
                  key={cycle.id}
                  className="bg-white rounded-lg border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{cycle.name}</h3>
                      {cycle.description && (
                        <p className="text-sm text-gray-600 mt-1">{cycle.description}</p>
                      )}
                    </div>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${CYCLE_STATUSES[cycle.status as keyof typeof CYCLE_STATUSES]?.color}15`,
                        color: CYCLE_STATUSES[cycle.status as keyof typeof CYCLE_STATUSES]?.color,
                      }}
                    >
                      {CYCLE_STATUSES[cycle.status as keyof typeof CYCLE_STATUSES]?.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    {startDate && endDate && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{cycle._count.issues} issues</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
