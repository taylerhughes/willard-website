'use client';

import { useState } from 'react';
import KanbanBoard from './kanban-board';
import IssueDetailDrawer from './issue-detail-drawer';

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

interface BoardPageWrapperProps {
  initialIssues: any[];
  users: User[];
  projects: Project[];
  clients: Client[];
  accounts: Account[];
}

export default function BoardPageWrapper({
  initialIssues,
  users,
  projects,
  clients,
  accounts,
}: BoardPageWrapperProps) {
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
    setIsDrawerOpen(true);
  };

  const handleIssueUpdated = (updatedIssue: any) => {
    setSelectedIssue(updatedIssue);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Board</h1>
        <p className="mt-1 text-sm text-gray-600">
          Drag issues across columns to update their status
        </p>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-auto p-6">
        <KanbanBoard
          initialIssues={initialIssues}
          onIssueClick={handleIssueClick}
        />
      </div>

      {/* Issue Detail Drawer */}
      <IssueDetailDrawer
        issue={selectedIssue}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedIssue(null);
        }}
        onIssueUpdated={handleIssueUpdated}
        users={users}
        projects={projects}
        clients={clients}
        accounts={accounts}
      />
    </div>
  );
}
