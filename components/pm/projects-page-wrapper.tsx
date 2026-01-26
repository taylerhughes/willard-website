'use client';

import { useState } from 'react';
import Link from 'next/link';
import CreateProjectModal from './create-project-modal';

interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

interface OnboardingClient {
  id: string;
  clientId: string;
  businessName: string | null;
  clientFullName: string | null;
}

interface Account {
  id: string;
  name: string;
  industry: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  status: string;
  health: string;
  lead: User | null;
  client: OnboardingClient | null;
  _count: {
    issues: number;
  };
}

interface ProjectsPageWrapperProps {
  initialProjects: Project[];
  users: User[];
  accounts: Account[];
}

const PROJECT_STATUSES = {
  active: { label: 'Active', color: '#10b981' },
  paused: { label: 'Paused', color: '#f59e0b' },
  completed: { label: 'Completed', color: '#6b7280' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

const PROJECT_HEALTH = {
  on_track: { label: 'On Track', color: '#10b981' },
  at_risk: { label: 'At Risk', color: '#f59e0b' },
  off_track: { label: 'Off Track', color: '#ef4444' },
};

export default function ProjectsPageWrapper({
  initialProjects,
  users,
  accounts,
}: ProjectsPageWrapperProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-600">
              Track and manage all your projects
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
            New Project
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {projects.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">No projects yet. Create one to get started!</p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color || '#6366f1' }}
                    />
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  </div>
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${PROJECT_STATUSES[project.status as keyof typeof PROJECT_STATUSES]?.color}15`,
                      color: PROJECT_STATUSES[project.status as keyof typeof PROJECT_STATUSES]?.color,
                    }}
                  >
                    {PROJECT_STATUSES[project.status as keyof typeof PROJECT_STATUSES]?.label}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${PROJECT_HEALTH[project.health as keyof typeof PROJECT_HEALTH]?.color}15`,
                      color: PROJECT_HEALTH[project.health as keyof typeof PROJECT_HEALTH]?.color,
                    }}
                  >
                    {PROJECT_HEALTH[project.health as keyof typeof PROJECT_HEALTH]?.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{project._count.issues} issues</span>
                  </div>

                  {project.lead && (
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">
                          {(project.lead.name || project.lead.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        users={users}
        accounts={accounts}
      />
    </div>
  );
}
