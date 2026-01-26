'use client';

import { useState } from 'react';
import InlineTextField from './inline-text-field';
import InlineSelect from './inline-select';
import InlineDatePicker from './inline-date-picker';
import InlineCurrency from './inline-currency';
import ActivityTimeline from './activity-timeline';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Issue {
  id: string;
  identifier: string;
  title: string;
  status: string;
  priority: string;
  project: {
    name: string;
    color: string | null;
  } | null;
  assignee: User | null;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string | null;
  actor: string | null;
  createdAt: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

interface ClientOverviewProps {
  client: any;
  activities: ActivityLog[];
  notes: Note[];
  users: User[];
  onClientUpdated: () => void;
}

const PIPELINE_STAGES = [
  { value: 'lead', label: 'Lead', color: '#6366f1' },
  { value: 'qualified', label: 'Qualified', color: '#8b5cf6' },
  { value: 'proposal', label: 'Proposal', color: '#ec4899' },
  { value: 'negotiation', label: 'Negotiation', color: '#f59e0b' },
  { value: 'closed_won', label: 'Closed Won', color: '#10b981' },
  { value: 'closed_lost', label: 'Closed Lost', color: '#ef4444' },
];

const ONBOARDING_STATUSES = [
  { value: 'unapproved', label: 'Unapproved', color: '#f59e0b' },
  { value: 'approved', label: 'Approved', color: '#10b981' },
  { value: 'updated', label: 'Updated', color: '#3b82f6' },
];

const CONTRACT_STATUSES = [
  { value: 'not_sent', label: 'Not Sent', color: '#6b7280' },
  { value: 'sent', label: 'Sent', color: '#f59e0b' },
  { value: 'signed', label: 'Signed', color: '#10b981' },
];

export default function ClientOverview({
  client,
  activities,
  notes,
  users,
  onClientUpdated,
}: ClientOverviewProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isSendingContract, setIsSendingContract] = useState(false);

  const updateClient = async (field: string, value: any) => {
    const response = await fetch(`/api/client/${client.clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });

    if (!response.ok) {
      throw new Error('Failed to update client');
    }

    onClientUpdated();
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`/api/client/${client.clientId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to approve client');
      }

      onClientUpdated();
    } catch (err) {
      console.error('Error approving client:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleContractStatusChange = async (status: string) => {
    setIsSendingContract(true);
    try {
      const response = await fetch(`/api/client/${client.clientId}/contract`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contract status');
      }

      onClientUpdated();
    } catch (err) {
      console.error('Error updating contract:', err);
    } finally {
      setIsSendingContract(false);
    }
  };

  const getDaysInStage = () => {
    const stageDate = client.stageChangedAt ? new Date(client.stageChangedAt) : new Date(client.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - stageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStageProgress = () => {
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
    const currentIndex = stages.indexOf(client.pipelineStage);
    if (client.pipelineStage === 'closed_won' || client.pipelineStage === 'closed_lost') {
      return 100;
    }
    return currentIndex >= 0 ? (currentIndex / 4) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Days in Stage</div>
          <div className="text-2xl font-semibold text-gray-900">{getDaysInStage()}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Deal Value</div>
          <div className="text-2xl font-semibold text-gray-900">
            {client.dealValue
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                }).format(client.dealValue)
              : '-'}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Linked Issues</div>
          <div className="text-2xl font-semibold text-gray-900">{client.issues?.length || 0}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Last Activity</div>
          <div className="text-sm font-medium text-gray-900">
            {activities.length > 0
              ? new Date(activities[0].createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Never'}
          </div>
        </div>
      </div>

      {/* Pipeline Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline</h3>

        {/* Stage Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Stage</span>
            <span className="text-xs text-gray-500">{getDaysInStage()} days</span>
          </div>
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${getStageProgress()}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {PIPELINE_STAGES.filter((s) => !['closed_won', 'closed_lost'].includes(s.value)).map((stage) => (
                <span
                  key={stage.value}
                  className={`text-xs ${
                    client.pipelineStage === stage.value ? 'font-medium text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {stage.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InlineSelect
            value={client.pipelineStage}
            options={PIPELINE_STAGES}
            onSave={(value) => updateClient('pipelineStage', value)}
            label="Pipeline Stage"
            showBadge
          />
          <InlineCurrency
            value={client.dealValue}
            onSave={(value) => updateClient('dealValue', value)}
            label="Deal Value"
          />
          <InlineDatePicker
            value={client.expectedCloseDate}
            onSave={(value) => updateClient('expectedCloseDate', value)}
            label="Expected Close Date"
          />
        </div>

        {client.pipelineStage === 'closed_lost' && (
          <div className="mt-4">
            <InlineTextField
              value={client.lostReason}
              onSave={(value) => updateClient('lostReason', value)}
              label="Lost Reason"
              placeholder="Why did we lose this deal?"
              multiline
            />
          </div>
        )}
      </div>

      {/* Key Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Business Name</div>
            <div className="text-gray-900">{client.businessName || '-'}</div>
          </div>
          <div className="text-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Contact Name</div>
            <div className="text-gray-900">{client.clientFullName || '-'}</div>
          </div>
          <div className="text-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Email</div>
            <div className="text-gray-900">
              {client.email ? <a href={`mailto:${client.email}`} className="text-indigo-600 hover:text-indigo-900">{client.email}</a> : '-'}
            </div>
          </div>
          <div className="text-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Role</div>
            <div className="text-gray-900">{client.roleTitle || '-'}</div>
          </div>
          <InlineSelect
            value={client.assignedTo || ''}
            options={[
              { value: '', label: 'Unassigned' },
              ...users.map((u) => ({ value: u.id, label: u.name || u.email })),
            ]}
            onSave={(value) => updateClient('assignedTo', value || null)}
            label="Assigned To"
          />
          <InlineTextField
            value={client.timezone}
            onSave={(value) => updateClient('timezone', value)}
            label="Timezone"
            placeholder="e.g., America/New_York"
          />
        </div>
      </div>

      {/* Status Tracking */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Onboarding Status */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Onboarding Status</div>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2"
              style={{
                backgroundColor: `${
                  ONBOARDING_STATUSES.find((s) => s.value === client.onboardingStatus)?.color || '#6b7280'
                }15`,
                color: ONBOARDING_STATUSES.find((s) => s.value === client.onboardingStatus)?.color || '#6b7280',
              }}
            >
              {ONBOARDING_STATUSES.find((s) => s.value === client.onboardingStatus)?.label || client.onboardingStatus}
            </span>
            {client.onboardingStatus === 'unapproved' && (
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="block w-full mt-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isApproving ? 'Approving...' : 'Approve Onboarding'}
              </button>
            )}
            {client.approvedAt && (
              <div className="text-xs text-gray-500 mt-2">
                Approved {new Date(client.approvedAt).toLocaleDateString()}
                {client.approvedBy && ` by ${client.approvedBy}`}
              </div>
            )}
          </div>

          {/* Contract Status */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Contract Status</div>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2"
              style={{
                backgroundColor: `${
                  CONTRACT_STATUSES.find((s) => s.value === client.contractStatus)?.color || '#6b7280'
                }15`,
                color: CONTRACT_STATUSES.find((s) => s.value === client.contractStatus)?.color || '#6b7280',
              }}
            >
              {CONTRACT_STATUSES.find((s) => s.value === client.contractStatus)?.label || client.contractStatus}
            </span>
            {client.contractStatus === 'not_sent' && (
              <button
                onClick={() => handleContractStatusChange('sent')}
                disabled={isSendingContract}
                className="block w-full mt-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isSendingContract ? 'Sending...' : 'Mark Contract Sent'}
              </button>
            )}
            {client.contractStatus === 'sent' && (
              <button
                onClick={() => handleContractStatusChange('signed')}
                disabled={isSendingContract}
                className="block w-full mt-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isSendingContract ? 'Updating...' : 'Mark Contract Signed'}
              </button>
            )}
            {client.contractSentAt && (
              <div className="text-xs text-gray-500 mt-2">
                Sent {new Date(client.contractSentAt).toLocaleDateString()}
              </div>
            )}
            {client.contractSignedAt && (
              <div className="text-xs text-gray-500 mt-2">
                Signed {new Date(client.contractSignedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Conversion Status */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Conversion Status</div>
            {client.convertedToAccount ? (
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mb-2">
                  Converted to Account
                </span>
                <a
                  href={`/admin/accounts/${client.convertedToAccount.id}`}
                  className="block text-sm text-indigo-600 hover:text-indigo-900"
                >
                  View Account →
                </a>
              </div>
            ) : (
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Lead
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Linked Issues */}
      {client.issues && client.issues.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Linked Issues</h3>
            <a
              href={`/admin/issues?clientId=${client.id}`}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              View all →
            </a>
          </div>
          <div className="space-y-2">
            {client.issues.slice(0, 5).map((issue: Issue) => (
              <a
                key={issue.id}
                href="/admin/issues"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{issue.identifier}</span>
                    <span className="text-sm font-medium text-gray-900">{issue.title}</span>
                  </div>
                  {issue.project && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: issue.project.color || '#6366f1' }}
                      />
                      {issue.project.name}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
        <ActivityTimeline
          clientId={client.clientId}
          activities={activities}
          notes={notes}
          onNoteCreated={onClientUpdated}
        />
      </div>
    </div>
  );
}
