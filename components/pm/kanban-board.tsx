'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from '@/lib/pm/constants';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

interface Project {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

interface Issue {
  id: string;
  identifier: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assignee: User | null;
  project: Project | null;
  _count: {
    comments: number;
  };
  createdAt: string;
}

interface KanbanBoardProps {
  initialIssues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

function IssueCard({ issue, onIssueClick }: { issue: Issue; onIssueClick: (issue: Issue) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityConfig = ISSUE_PRIORITIES[issue.priority as keyof typeof ISSUE_PRIORITIES];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Only trigger click if not dragging
        if (!isDragging) {
          onIssueClick(issue);
        }
      }}
      className="bg-white rounded-lg border border-gray-200 p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-gray-500">{issue.identifier}</span>
        {issue.priority !== 'none' && (
          <span className="text-sm" title={priorityConfig?.label}>
            {priorityConfig?.icon}
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
        {issue.title}
      </h3>

      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {issue.project && (
            <div className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: issue.project.color || '#6366f1' }}
              />
              <span className="text-gray-600 truncate max-w-[100px]">
                {issue.project.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {issue._count.comments > 0 && (
            <span className="flex items-center gap-1 text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {issue._count.comments}
            </span>
          )}

          {issue.assignee && (
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-medium text-indigo-600">
                {(issue.assignee.name || issue.assignee.email).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({
  status,
  config,
  columnIssues,
  onIssueClick
}: {
  status: string;
  config: any;
  columnIssues: Issue[];
  onIssueClick: (issue: Issue) => void;
}) {
  const columnId = `column-${status}`;
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div
      className="flex-shrink-0 w-80 bg-gray-50 rounded-lg"
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <h3 className="font-semibold text-sm text-gray-900">
              {config.label}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
              {columnIssues.length}
            </span>
          </div>
        </div>
      </div>

      {/* Column Content */}
      <SortableContext
        id={columnId}
        items={columnIssues.map((issue) => issue.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="p-3 min-h-[200px] max-h-[calc(100vh-250px)] overflow-y-auto">
          {columnIssues.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              Drop issues here
            </div>
          ) : (
            columnIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onIssueClick={onIssueClick}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({ initialIssues, onIssueClick }: KanbanBoardProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeIssue = issues.find((issue) => issue.id === active.id);
    if (!activeIssue) {
      setActiveId(null);
      return;
    }

    // Check if dropped on a different column
    const overId = over.id as string;
    const newStatus = Object.keys(ISSUE_STATUSES).find((status) => overId.startsWith(`column-${status}`));

    if (newStatus && newStatus !== activeIssue.status) {
      // Optimistically update UI
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === activeIssue.id ? { ...issue, status: newStatus } : issue
        )
      );

      // Update on server
      try {
        const response = await fetch(`/api/pm/issues/${activeIssue.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update issue');
        }

        toast.success(`Moved to ${ISSUE_STATUSES[newStatus as keyof typeof ISSUE_STATUSES]?.label}`);
      } catch (error) {
        console.error('Error updating issue:', error);
        // Revert on error
        setIssues((prev) =>
          prev.map((issue) =>
            issue.id === activeIssue.id ? { ...issue, status: activeIssue.status } : issue
          )
        );
        toast.error('Failed to update issue');
      }
    }

    setActiveId(null);
  };

  const getIssuesByStatus = (status: string) => {
    return issues.filter((issue) => issue.status === status);
  };

  const activeIssue = activeId ? issues.find((issue) => issue.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {Object.entries(ISSUE_STATUSES).map(([status, config]) => {
          const columnIssues = getIssuesByStatus(status);

          return (
            <DroppableColumn
              key={status}
              status={status}
              config={config}
              columnIssues={columnIssues}
              onIssueClick={onIssueClick}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeIssue ? (
          <div className="bg-white rounded-lg border-2 border-indigo-500 p-3 w-80 shadow-2xl opacity-90">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-mono text-gray-500">{activeIssue.identifier}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {activeIssue.title}
            </h3>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
