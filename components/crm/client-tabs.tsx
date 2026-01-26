'use client';

import { useState } from 'react';
import ClientOverview from './client-overview';
import InlineTextField from './inline-text-field';

interface User {
  id: string;
  name: string | null;
  email: string;
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

interface ClientTabsProps {
  client: any;
  activities: ActivityLog[];
  notes: Note[];
  users: User[];
  onClientUpdated: () => void;
}

export default function ClientTabs({ client, activities, notes, users, onClientUpdated }: ClientTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'onboarding'>('overview');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {client.businessName || client.clientFullName || 'Unnamed Client'}
              </h1>
              <span className="text-sm text-gray-500">#{client.clientId}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor:
                    client.pipelineStage === 'closed_won'
                      ? '#10b98115'
                      : client.pipelineStage === 'closed_lost'
                      ? '#ef444415'
                      : '#6366f115',
                  color:
                    client.pipelineStage === 'closed_won'
                      ? '#10b981'
                      : client.pipelineStage === 'closed_lost'
                      ? '#ef4444'
                      : '#6366f1',
                }}
              >
                {client.pipelineStage.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
              {client.source && (
                <span className="text-xs text-gray-500">
                  Source: {client.source.charAt(0).toUpperCase() + client.source.slice(1)}
                </span>
              )}
            </div>
          </div>
          <a
            href="/admin/crm"
            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to CRM
          </a>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 -mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'onboarding'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Onboarding Details
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' ? (
            <ClientOverview
              client={client}
              activities={activities}
              notes={notes}
              users={users}
              onClientUpdated={onClientUpdated}
            />
          ) : (
            <OnboardingDetails client={client} />
          )}
        </div>
      </div>
    </div>
  );
}

// Onboarding Details Component - displays all the detailed onboarding information with inline editing
function OnboardingDetails({ client }: { client: any }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateClient = async (field: string, value: any) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/client/${client.clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      // Refresh the page to get updated data
      window.location.reload();
    } catch (err) {
      console.error('Error updating client:', err);
      alert('Failed to update field. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const sections = [
    {
      title: 'Client Information',
      fields: [
        { label: 'Business Name', value: client.businessName, fieldName: 'businessName' },
        { label: 'Contact Name', value: client.clientFullName, fieldName: 'clientFullName' },
        { label: 'Role', value: client.roleTitle, fieldName: 'roleTitle' },
        { label: 'Email', value: client.email, fieldName: 'email', type: 'email' },
        { label: 'LinkedIn', value: client.linkedinUrl, fieldName: 'linkedinUrl', isLink: true },
        { label: 'Timezone', value: client.timezone, fieldName: 'timezone' },
        { label: 'Billing Contact', value: client.billingContact, fieldName: 'billingContact' },
      ],
    },
    {
      title: 'Sprint Overview',
      fields: [
        { label: 'Sprint Type', value: client.sprintType, fieldName: 'sprintType' },
        { label: 'One Sentence Outcome', value: client.oneSentenceOutcome, fieldName: 'oneSentenceOutcome', multiline: true },
        { label: 'Success Criteria', value: client.successCriteria, fieldName: 'successCriteria', multiline: true },
        { label: 'Non-Negotiables', value: client.nonNegotiables, fieldName: 'nonNegotiables', multiline: true },
        { label: 'Out of Scope', value: client.outOfScope, fieldName: 'outOfScope', multiline: true },
      ],
    },
    {
      title: 'Why Now',
      fields: [
        { label: 'Trigger Event', value: client.triggerEvent, fieldName: 'triggerEvent', multiline: true },
        { label: 'Deadline Timing', value: client.deadlineTiming, fieldName: 'deadlineTiming', multiline: true },
        { label: 'Consequences of Getting it Wrong', value: client.consequencesOfGettingItWrong, fieldName: 'consequencesOfGettingItWrong', multiline: true },
      ],
    },
    {
      title: 'Product Context',
      fields: [
        { label: 'Product Type', value: client.productType, fieldName: 'productType' },
        { label: 'Target User', value: client.targetUser, fieldName: 'targetUser', multiline: true },
        { label: 'Current State', value: client.currentState, fieldName: 'currentState', multiline: true },
        { label: 'Build Cadence', value: client.buildCadence, fieldName: 'buildCadence' },
        { label: 'Stage Focus', value: client.stageFocus, fieldName: 'stageFocus', multiline: true },
      ],
    },
    {
      title: 'Decision + Risk',
      fields: [
        { label: 'Key Decision', value: client.keyDecision, fieldName: 'keyDecision', multiline: true },
        { label: 'Knowns', value: client.knowns, fieldName: 'knowns', multiline: true },
        { label: 'Unknowns', value: client.unknowns, fieldName: 'unknowns', multiline: true },
        { label: 'Top Assumptions', value: client.topAssumptions, fieldName: 'topAssumptions', multiline: true },
        { label: 'Current Signals', value: client.currentSignals, fieldName: 'currentSignals', multiline: true },
      ],
    },
    {
      title: 'Assets + Access',
      fields: [
        { label: 'Website URL', value: client.websiteUrl, fieldName: 'websiteUrl', isLink: true },
        { label: 'Product Link', value: client.productLink, fieldName: 'productLink', isLink: true },
        { label: 'Figma Link', value: client.figmaLink, fieldName: 'figmaLink', isLink: true },
        { label: 'Brand Guidelines', value: client.brandGuidelines, fieldName: 'brandGuidelines', multiline: true },
        { label: 'Design System', value: client.designSystem, fieldName: 'designSystem', multiline: true },
        { label: 'Docs Links', value: client.docsLinks, fieldName: 'docsLinks', multiline: true },
        { label: 'Analytics Tools', value: client.analyticsTools, fieldName: 'analyticsTools', multiline: true },
        { label: 'Access Needed', value: client.accessNeeded, fieldName: 'accessNeeded', multiline: true },
      ],
    },
    {
      title: 'Stakeholders + Working Style',
      fields: [
        { label: 'Who Approves', value: client.whoApproves, fieldName: 'whoApproves', multiline: true },
        { label: 'Who Will Build', value: client.whoWillBuild, fieldName: 'whoWillBuild', multiline: true },
        { label: 'Preferred Communication', value: client.preferredCommunication, fieldName: 'preferredCommunication', multiline: true },
        { label: 'Feedback Style', value: client.feedbackStyle, fieldName: 'feedbackStyle', multiline: true },
        { label: 'Availability', value: client.availability, fieldName: 'availability', multiline: true },
      ],
    },
    {
      title: 'Business Context',
      fields: [
        { label: 'Budget Comfort', value: client.budgetComfort, fieldName: 'budgetComfort', multiline: true },
        { label: 'Ongoing Help Likelihood', value: client.ongoingHelpLikelihood, fieldName: 'ongoingHelpLikelihood', multiline: true },
        { label: 'Decision Timeline', value: client.decisionTimeline, fieldName: 'decisionTimeline', multiline: true },
        { label: 'Objections', value: client.objections, fieldName: 'objections', multiline: true },
        { label: 'Previous Experience', value: client.previousExperience, fieldName: 'previousExperience', multiline: true },
      ],
    },
    {
      title: 'Logistics',
      fields: [
        { label: 'Kickoff Time', value: client.kickoffTime, fieldName: 'kickoffTime' },
        { label: 'Expected Delivery Date', value: client.expectedDeliveryDate, fieldName: 'expectedDeliveryDate' },
        { label: 'Client Will Send', value: client.clientWillSend, fieldName: 'clientWillSend', multiline: true },
        { label: 'Willard Will Send', value: client.willardWillSend, fieldName: 'willardWillSend', multiline: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Access Onboarding Form Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Client Onboarding Form</h4>
            <p className="text-sm text-blue-700 mb-2">
              Share this link with the client to complete or update their onboarding information.
            </p>
            <a
              href={`/mini-sprint?clientId=${client.clientId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {typeof window !== 'undefined' ? window.location.origin : ''}/mini-sprint?clientId={client.clientId} →
            </a>
          </div>
        </div>
      </div>

      {/* Onboarding Sections with Inline Editing */}
      {sections.map((section) => {
        return (
          <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map((field: any) => {
                return (
                  <div key={field.label}>
                    <InlineTextField
                      value={field.value}
                      onSave={(value) => updateClient(field.fieldName, value)}
                      label={field.label}
                      placeholder={`Add ${field.label.toLowerCase()}...`}
                      multiline={field.multiline || false}
                      disabled={isUpdating}
                    />
                    {field.isLink && field.value && (
                      <a
                        href={field.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-900 mt-1 inline-flex items-center gap-1"
                      >
                        Open link
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
