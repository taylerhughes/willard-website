'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

interface ClientCardProps {
  client: {
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
  };
}

export default function ClientCard({ client }: ClientCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: client.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Calculate days in current stage
  const daysInStage = Math.floor(
    (Date.now() - new Date(client.stageChangedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Format deal value
  const formatDealValue = (value: string | null) => {
    if (!value) return null;
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(numValue);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-move"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <Link
            href={`/admin/client/${client.clientId}`}
            className="font-medium text-gray-900 hover:text-indigo-600 truncate block"
            onClick={(e) => e.stopPropagation()}
          >
            {client.businessName || client.clientFullName || 'Unnamed Client'}
          </Link>
          {client.email && (
            <p className="text-sm text-gray-500 truncate">{client.email}</p>
          )}
        </div>
      </div>

      {client.sprintType && (
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {client.sprintType}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{daysInStage}d in stage</span>
        {client.dealValue && (
          <span className="font-semibold text-gray-900">
            {formatDealValue(client.dealValue)}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(client.onboardingStatus)}`}>
          {client.onboardingStatus}
        </span>
      </div>
    </div>
  );
}
