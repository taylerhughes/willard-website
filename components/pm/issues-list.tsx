'use client';

import { useState } from 'react';
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from '@/lib/pm/constants';
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

interface Issue {
  id: string;
  identifier: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assignee: User | null;
  reporter?: User | null;
  project: Project | null;
  _count: {
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface IssuesListProps {
  initialIssues: Issue[];
  users: User[];
  projects: Project[];
  clients: Client[];
  accounts: Account[];
}

export default function IssuesList({ initialIssues, users, projects, clients, accounts }: IssuesListProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [filter, setFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  const groupedByStatus = ISSUE_STATUSES;
  const statusCounts = Object.keys(groupedByStatus).reduce((acc, status) => {
    acc[status] = issues.filter((i) => i.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDrawerOpen(true);
  };

  const handleIssueUpdated = (updatedIssue: any) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
    );
    setSelectedIssue(updatedIssue);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Issues
            <span className="ml-2 text-xs opacity-75">
              {issues.length}
            </span>
          </button>
          {Object.entries(groupedByStatus).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                filter === status
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {config.label}
              {statusCounts[status] > 0 && (
                <span className="ml-2 text-xs opacity-75">
                  {statusCounts[status]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Table */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {filteredIssues.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No issues</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new issue.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Issue
                </button>
              </div>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => handleIssueClick(issue)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-500">
                        {issue.identifier}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {issue.title}
                      </span>
                      {issue._count.comments > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {issue._count.comments}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${ISSUE_STATUSES[issue.status as keyof typeof ISSUE_STATUSES]?.color}15`,
                        color: ISSUE_STATUSES[issue.status as keyof typeof ISSUE_STATUSES]?.color,
                      }}
                    >
                      {ISSUE_STATUSES[issue.status as keyof typeof ISSUE_STATUSES]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {ISSUE_PRIORITIES[issue.priority as keyof typeof ISSUE_PRIORITIES]?.icon}{' '}
                      {ISSUE_PRIORITIES[issue.priority as keyof typeof ISSUE_PRIORITIES]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {issue.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-indigo-600">
                            {(issue.assignee.name || issue.assignee.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {issue.assignee.name || issue.assignee.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {issue.project ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-sm text-gray-900"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: issue.project.color || '#6366f1' }}
                        />
                        {issue.project.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">No project</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Issue Detail Drawer */}
      <IssueDetailDrawer
        issue={selectedIssue as any}
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
