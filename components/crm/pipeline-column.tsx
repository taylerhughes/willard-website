'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ClientCard from './client-card';

interface PipelineColumnProps {
  stage: string;
  title: string;
  clients: Array<{
    id: string;
    clientId: string;
    businessName: string | null;
    clientFullName: string | null;
    email: string | null;
    sprintType: string | null;
    dealValue: string | null;
    onboardingStatus: string;
    pipelineStage: string;
    stageChangedAt: string;
    createdAt: string;
  }>;
  color: string;
}

export default function PipelineColumn({ stage, title, clients, color }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const clientIds = clients.map((c) => c.id);

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`rounded-lg ${color} p-3 mb-3`}>
        <h3 className="font-semibold text-gray-900 flex items-center justify-between">
          <span>{title}</span>
          <span className="bg-white px-2 py-0.5 rounded text-sm">
            {clients.length}
          </span>
        </h3>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[500px] rounded-lg p-2 transition-colors ${
          isOver ? 'bg-gray-100' : 'bg-gray-50'
        }`}
      >
        <SortableContext
          items={clientIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
