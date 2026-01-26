'use client';

import { useState } from 'react';

interface ActivityLog {
  id: string;
  action: string; // Changed from activityType
  details: string | null; // JSON string with metadata
  actor: string | null; // Changed from userId
  createdAt: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  author: string; // Changed from createdBy
}

interface ActivityTimelineProps {
  clientId: string;
  activities: ActivityLog[];
  notes: Note[];
  onNoteCreated?: () => void;
}

export default function ActivityTimeline({ clientId, activities, notes, onNoteCreated }: ActivityTimelineProps) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine activities and notes into a single timeline
  const timelineItems = [
    ...activities.map((activity) => ({
      ...activity,
      type: 'activity' as const,
      timestamp: activity.createdAt,
    })),
    ...notes.map((note) => ({
      ...note,
      type: 'note' as const,
      timestamp: note.createdAt,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/client/${clientId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote,
          author: 'Current User' // TODO: Get from auth context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      setNewNote('');
      if (onNoteCreated) {
        onNoteCreated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'stage_changed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        );
      case 'status_changed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'contract_sent':
      case 'contract_signed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'converted_to_account':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'note_created':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getUserDisplay = (item: any) => {
    if (item.type === 'note') {
      return item.author || 'Unknown';
    }
    return item.actor || 'System';
  };

  const getActivityDescription = (activity: ActivityLog) => {
    let description = activity.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    if (activity.details) {
      try {
        const metadata = JSON.parse(activity.details);
        if (metadata.from && metadata.to) {
          description += ` from ${metadata.from} to ${metadata.to}`;
        }
      } catch (e) {
        // If details isn't JSON, ignore
      }
    }

    return description;
  };

  return (
    <div className="space-y-4">
      {/* Note Creation Form */}
      <form onSubmit={handleSubmitNote} className="bg-white border border-gray-200 rounded-lg p-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this client..."
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-50"
          rows={3}
        />
        {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">Use this to log calls, emails, or important updates</span>
          <button
            type="submit"
            disabled={!newNote.trim() || isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </form>

      {/* Timeline */}
      <div className="space-y-3">
        {timelineItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          timelineItems.map((item) => (
            <div key={item.id} className="flex gap-3 bg-white border border-gray-200 rounded-lg p-4">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  item.type === 'note' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.type === 'note' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                ) : (
                  getActivityIcon(item.action)
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.type === 'note' ? 'Note added' : getActivityDescription(item)}
                    </p>
                    {item.type === 'note' && (
                      <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{item.content}</p>
                    )}
                  </div>
                  <time className="flex-shrink-0 text-xs text-gray-500">{formatTimestamp(item.timestamp)}</time>
                </div>
                <div className="mt-1 text-xs text-gray-500">by {getUserDisplay(item)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
