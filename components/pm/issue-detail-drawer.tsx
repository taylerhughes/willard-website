'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from '@/lib/pm/constants';
import RichTextEditor from './rich-text-editor';
import ClientSearch from './client-search';

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

interface Client {
  id: string;
  clientId: string;
  businessName: string | null;
  clientFullName: string | null;
}

interface Account {
  id: string;
  name: string;
}

interface Issue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee: User | null;
  reporter: User | null;
  project: Project | null;
  client: Client | null;
  account: Account | null;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

interface IssueDetailDrawerProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onIssueUpdated: (issue: Issue) => void;
  users: User[];
  projects: Project[];
  clients?: Client[];
  accounts?: Account[];
}

export default function IssueDetailDrawer({
  issue,
  isOpen,
  onClose,
  onIssueUpdated,
  users,
  projects,
  clients = [],
  accounts = [],
}: IssueDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [clientSelection, setClientSelection] = useState<
    { type: 'none' } | { type: 'lead'; data: Client } | { type: 'account'; data: Account }
  >({ type: 'none' });
  const [isSaving, setIsSaving] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Load issue data when issue changes
  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description || '');
      setStatus(issue.status);
      setPriority(issue.priority);
      setAssigneeId(issue.assignee?.id || '');
      setProjectId(issue.project?.id || '');

      // Set client selection
      if (issue.client) {
        setClientSelection({ type: 'lead', data: issue.client });
      } else if (issue.account) {
        setClientSelection({ type: 'account', data: issue.account });
      } else {
        setClientSelection({ type: 'none' });
      }

      setIsEditing(false);

      // Fetch comments (will implement API later)
      setComments([]);
    }
  }, [issue]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isEditing) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isEditing, onClose]);

  // Handle Cmd/Ctrl+Enter to submit comment
  useEffect(() => {
    const handleCommentSubmit = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isOpen && newComment.trim()) {
        e.preventDefault();
        handlePostComment();
      }
    };

    window.addEventListener('keydown', handleCommentSubmit);
    return () => window.removeEventListener('keydown', handleCommentSubmit);
  }, [isOpen, newComment]);

  const handleSave = async () => {
    if (!issue || !title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/pm/issues/${issue.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description || null,
          status,
          priority,
          assigneeId: assigneeId || null,
          projectId: projectId || null,
          clientId: clientSelection.type === 'lead' ? clientSelection.data.id : null,
          accountId: clientSelection.type === 'account' ? clientSelection.data.id : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update issue');
      }

      const updatedIssue = await response.json();

      toast.success('Issue updated');
      onIssueUpdated(updatedIssue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating issue:', error);
      toast.error('Failed to update issue');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePostComment = async () => {
    if (!issue || !newComment.trim()) return;

    setIsPostingComment(true);

    try {
      const response = await fetch(`/api/pm/issues/${issue.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const comment = await response.json();

      setComments((prev) => [...prev, comment]);
      setNewComment('');
      toast.success('Comment posted');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleQuickStatusChange = async (newStatus: string) => {
    if (!issue) return;

    try {
      const response = await fetch(`/api/pm/issues/${issue.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedIssue = await response.json();

      setStatus(newStatus);
      onIssueUpdated(updatedIssue);
      toast.success(`Status updated to ${ISSUE_STATUSES[newStatus as keyof typeof ISSUE_STATUSES]?.label}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-500">{issue.identifier}</span>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${ISSUE_STATUSES[status as keyof typeof ISSUE_STATUSES]?.color}15`,
                color: ISSUE_STATUSES[status as keyof typeof ISSUE_STATUSES]?.color,
              }}
            >
              {ISSUE_STATUSES[status as keyof typeof ISSUE_STATUSES]?.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              {isEditing ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-semibold text-gray-900 border-b-2 border-indigo-500 focus:outline-none pb-2"
                  placeholder="Issue title"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-2xl font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {title}
                </h1>
              )}
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => handleQuickStatusChange(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Object.entries(ISSUE_STATUSES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Priority</label>
                {isEditing ? (
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.entries(ISSUE_PRIORITIES).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.icon} {config.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {ISSUE_PRIORITIES[priority as keyof typeof ISSUE_PRIORITIES]?.icon}{' '}
                    {ISSUE_PRIORITIES[priority as keyof typeof ISSUE_PRIORITIES]?.label}
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Assignee</label>
                {isEditing ? (
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {issue.assignee ? (issue.assignee.name || issue.assignee.email) : 'Unassigned'}
                  </div>
                )}
              </div>

              {/* Project */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Project</label>
                {isEditing ? (
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">No project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {issue.project ? issue.project.name : 'No project'}
                  </div>
                )}
              </div>

              {/* Client Link */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Client</label>
                {isEditing ? (
                  <ClientSearch
                    clients={clients}
                    accounts={accounts}
                    value={clientSelection}
                    onChange={setClientSelection}
                    placeholder="Search clients and accounts..."
                  />
                ) : (
                  <div
                    className="px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {issue.client ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">Lead</span>
                        <span>{issue.client.businessName || issue.client.clientFullName || issue.client.clientId}</span>
                      </div>
                    ) : issue.account ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Account</span>
                        <span>{issue.account.name}</span>
                      </div>
                    ) : (
                      'No client'
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons (when editing) */}
            {isEditing && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !title.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original values
                    if (issue) {
                      setTitle(issue.title);
                      setDescription(issue.description || '');
                      setStatus(issue.status);
                      setPriority(issue.priority);
                      setAssigneeId(issue.assignee?.id || '');
                      setProjectId(issue.project?.id || '');

                      // Reset client selection
                      if (issue.client) {
                        setClientSelection({ type: 'lead', data: issue.client });
                      } else if (issue.account) {
                        setClientSelection({ type: 'account', data: issue.account });
                      } else {
                        setClientSelection({ type: 'none' });
                      }
                    }
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Description</label>
              {isEditing ? (
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Add a description..."
                />
              ) : (
                <div
                  className="min-h-[100px] px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors prose prose-sm max-w-none"
                  onClick={() => setIsEditing(true)}
                  dangerouslySetInnerHTML={
                    description
                      ? { __html: description }
                      : undefined
                  }
                >
                  {!description && <span className="text-gray-400">No description</span>}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Comments</h3>

              {/* Comment Input */}
              <div className="mb-4">
                <textarea
                  ref={commentTextareaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment... (Cmd/Ctrl+Enter to post)"
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  disabled={isPostingComment}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Cmd+Enter</kbd> to post
                  </div>
                  <button
                    onClick={handlePostComment}
                    disabled={isPostingComment || !newComment.trim()}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPostingComment ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-indigo-600">
                          {(comment.user.name || comment.user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.user.name || comment.user.email}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>
                  Created {new Date(issue.createdAt).toLocaleString()}
                  {issue.reporter && ` by ${issue.reporter.name || issue.reporter.email}`}
                </div>
                <div>Last updated {new Date(issue.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Esc</kbd> to close
          </div>
        </div>
      </div>
    </>
  );
}
