'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import PipelineColumn from './pipeline-column';
import ClientCard from './client-card';

interface Client {
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
}

interface PipelineBoardProps {
  clients: Client[];
}

const PIPELINE_STAGES = [
  { id: 'lead', title: 'Lead', color: 'bg-gray-200' },
  { id: 'qualified', title: 'Qualified', color: 'bg-blue-200' },
  { id: 'proposal', title: 'Proposal', color: 'bg-purple-200' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-yellow-200' },
  { id: 'closed_won', title: 'Closed Won', color: 'bg-green-200' },
  { id: 'closed_lost', title: 'Closed Lost', color: 'bg-red-200' },
];

export default function PipelineBoard({ clients: initialClients }: PipelineBoardProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [originalStage, setOriginalStage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const client = clients.find((c) => c.id === active.id);
    if (client) {
      setActiveClient(client);
      setOriginalStage(client.pipelineStage);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active client
    const activeClient = clients.find((c) => c.id === activeId);
    if (!activeClient) return;

    // Check if we're dragging over a column (stage)
    const isOverColumn = PIPELINE_STAGES.some((stage) => stage.id === overId);

    if (isOverColumn && activeClient.pipelineStage !== overId) {
      // Update the client's stage immediately for visual feedback
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === activeId
            ? { ...c, pipelineStage: overId, stageChangedAt: new Date().toISOString() }
            : c
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveClient(null);

    if (!over) {
      setOriginalStage(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active client
    const activeClient = clients.find((c) => c.id === activeId);
    if (!activeClient) {
      setOriginalStage(null);
      return;
    }

    // Check if we're dropping onto a different stage
    const isOverColumn = PIPELINE_STAGES.some((stage) => stage.id === overId);

    // Use originalStage for comparison instead of current pipelineStage
    if (isOverColumn && originalStage !== overId) {
      // Call API to update the stage on the server
      try {
        const response = await fetch(`/api/client/${activeClient.clientId}/stage`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pipelineStage: overId }),
        });

        if (!response.ok) {
          // Revert the change if the API call fails
          setClients((prevClients) =>
            prevClients.map((c) =>
              c.id === activeId
                ? { ...c, pipelineStage: originalStage || c.pipelineStage, stageChangedAt: activeClient.stageChangedAt }
                : c
            )
          );
          console.error('Failed to update pipeline stage');
        }
      } catch (error) {
        // Revert on error
        setClients((prevClients) =>
          prevClients.map((c) =>
            c.id === activeId
              ? { ...c, pipelineStage: originalStage || c.pipelineStage, stageChangedAt: activeClient.stageChangedAt }
              : c
          )
        );
        console.error('Error updating pipeline stage:', error);
      }
    }

    setOriginalStage(null);
  };

  // Group clients by stage
  const clientsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = clients.filter((c) => c.pipelineStage === stage.id);
    return acc;
  }, {} as Record<string, Client[]>);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <PipelineColumn
            key={stage.id}
            stage={stage.id}
            title={stage.title}
            clients={clientsByStage[stage.id]}
            color={stage.color}
          />
        ))}
      </div>

      <DragOverlay>
        {activeClient ? <ClientCard client={activeClient} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
