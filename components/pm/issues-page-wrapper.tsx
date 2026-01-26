'use client';

import { useState, useEffect } from 'react';
import IssuesList from './issues-list';
import CreateIssueModal from './create-issue-modal';

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

interface IssuesPageWrapperProps {
  initialIssues: any[];
  users: User[];
  projects: Project[];
  clients: Client[];
  accounts: Account[];
}

export default function IssuesPageWrapper({
  initialIssues,
  users,
  projects,
  clients,
  accounts,
}: IssuesPageWrapperProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [issues, setIssues] = useState(initialIssues);

  // Listen for custom event from command palette and global keyboard shortcuts
  useEffect(() => {
    const handleOpenModal = () => {
      setIsCreateModalOpen(true);
    };

    const handleIssueCreated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        // Add the new issue to the top of the list
        setIssues((prev) => [customEvent.detail, ...prev]);
      }
    };

    window.addEventListener('openCreateIssueModal', handleOpenModal);
    window.addEventListener('issueCreated', handleIssueCreated);

    return () => {
      window.removeEventListener('openCreateIssueModal', handleOpenModal);
      window.removeEventListener('issueCreated', handleIssueCreated);
    };
  }, []);

  const handleIssueCreated = (newIssue: any) => {
    // Add the new issue to the top of the list
    setIssues((prev) => [newIssue, ...prev]);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Issues</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and track all your work items
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Issue
            <kbd className="ml-1 px-1.5 py-0.5 bg-indigo-700 rounded text-xs">C</kbd>
          </button>
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-auto">
        <IssuesList
          initialIssues={issues}
          users={users}
          projects={projects}
          clients={clients}
          accounts={accounts}
        />
      </div>

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onIssueCreated={handleIssueCreated}
        users={users}
        projects={projects}
        clients={clients}
        accounts={accounts}
      />
    </div>
  );
}
