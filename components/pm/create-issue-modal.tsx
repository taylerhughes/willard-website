'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
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

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssueCreated: (issue: any) => void;
  users: User[];
  projects: Project[];
  clients: Client[];
  accounts: Account[];
}

export default function CreateIssueModal({
  isOpen,
  onClose,
  onIssueCreated,
  users,
  projects,
  clients,
  accounts,
}: CreateIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('none');
  const [assigneeId, setAssigneeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [clientSelection, setClientSelection] = useState<
    { type: 'none' } | { type: 'lead'; data: Client } | { type: 'account'; data: Account }
  >({ type: 'none' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus title input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setPriority('none');
      setAssigneeId('');
      setProjectId('');
      setClientSelection({ type: 'none' });
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/pm/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description || undefined,
          priority,
          assigneeId: assigneeId || undefined,
          projectId: projectId || undefined,
          clientId: clientSelection.type === 'lead' ? clientSelection.data.id : undefined,
          accountId: clientSelection.type === 'account' ? clientSelection.data.id : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create issue');
      }

      const issue = await response.json();

      toast.success(`Issue ${issue.identifier} created`);
      onIssueCreated(issue);
      onClose();
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error('Failed to create issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Create Issue</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  ref={titleInputRef}
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Add more details..."
                />
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    disabled={isSubmitting}
                  >
                    <option value="none">○ No Priority</option>
                    <option value="low">◔ Low</option>
                    <option value="medium">◑ Medium</option>
                    <option value="high">◕ High</option>
                    <option value="urgent">● Urgent</option>
                  </select>
                </div>

                {/* Assignee */}
                <div>
                  <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <select
                    id="assignee"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    disabled={isSubmitting}
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project */}
              <div>
                <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                  Project
                </label>
                <select
                  id="project"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  disabled={isSubmitting}
                >
                  <option value="">No project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Client
                </label>
                <ClientSearch
                  clients={clients}
                  accounts={accounts}
                  value={clientSelection}
                  onChange={setClientSelection}
                  placeholder="Search clients and accounts..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-lg">
              <div className="text-xs text-gray-500">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Esc</kbd> to cancel
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Issue'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
