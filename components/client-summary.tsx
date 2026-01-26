'use client';

import { useState } from 'react';

interface ClientSummaryProps {
  client: any;
  onUpdate?: () => void;
}

export default function ClientSummary({ client, onUpdate }: ClientSummaryProps) {
  const [contractStatus, setContractStatus] = useState(client.contractStatus || 'not_sent');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUpdatingContract, setIsUpdatingContract] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState(client.onboardingStatus || 'unapproved');
  const [isApprovingOnboarding, setIsApprovingOnboarding] = useState(false);
  const [isConvertingToAccount, setIsConvertingToAccount] = useState(false);
  const [hasAccount, setHasAccount] = useState(!!client.convertedToAccount);

  const handleContractStatusChange = async (newStatus: string) => {
    setIsUpdatingContract(true);
    try {
      const response = await fetch(`/api/client/${client.clientId}/contract`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setContractStatus(newStatus);
        alert('Contract status updated successfully');
      } else {
        alert('Failed to update contract status');
      }
    } catch (error) {
      console.error('Error updating contract status:', error);
      alert('Error updating contract status');
    } finally {
      setIsUpdatingContract(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleApproveOnboarding = async () => {
    setIsApprovingOnboarding(true);
    try {
      const response = await fetch(`/api/client/${client.clientId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setOnboardingStatus('approved');
        alert('Onboarding approved successfully');
        window.location.reload(); // Reload to show updated data
      } else {
        alert('Failed to approve onboarding');
      }
    } catch (error) {
      console.error('Error approving onboarding:', error);
      alert('Error approving onboarding');
    } finally {
      setIsApprovingOnboarding(false);
    }
  };

  const handleConvertToAccount = async () => {
    const accountName = prompt(
      'Enter account name:',
      client.businessName || client.clientFullName || ''
    );

    if (!accountName) return;

    setIsConvertingToAccount(true);
    try {
      const response = await fetch('/api/accounts/convert-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: client.id,
          accountName,
        }),
      });

      if (response.ok) {
        const account = await response.json();
        alert(`Successfully converted to account: ${account.name}`);
        setHasAccount(true);
        window.location.href = `/admin/accounts/${account.id}`;
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to convert to account');
      }
    } catch (error) {
      console.error('Error converting to account:', error);
      alert('Error converting to account');
    } finally {
      setIsConvertingToAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {client.businessName || client.clientFullName || 'Client Summary'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Client ID: {client.clientId}</p>
        </div>
        {!hasAccount && onboardingStatus === 'approved' && (
          <button
            onClick={handleConvertToAccount}
            disabled={isConvertingToAccount}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isConvertingToAccount ? 'Converting...' : 'Convert to Account'}
          </button>
        )}
      </div>

      {/* Share Link with Client - Moved to top */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Onboarding Form</h3>
        <p className="text-sm text-gray-600 mb-3">View the form or share the link with your client</p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            readOnly
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/mini-sprint?clientId=${client.clientId}`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/mini-sprint?clientId=${client.clientId}`);
              alert('Link copied to clipboard!');
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            Copy Link
          </button>
        </div>
        <a
          href={`/admin/client/${client.clientId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View Onboarding Form
        </a>
      </section>

      {/* Onboarding Status Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Onboarding Status
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-medium">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              onboardingStatus === 'approved'
                ? 'bg-green-100 text-green-800'
                : onboardingStatus === 'updated'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {onboardingStatus.charAt(0).toUpperCase() + onboardingStatus.slice(1)}
            </span>
          </div>

          {client.approvedAt && (
            <div className="flex items-center gap-3">
              <span className="font-medium">Approved:</span>
              <span className="text-gray-700">
                {new Date(client.approvedAt).toLocaleDateString()} at{' '}
                {new Date(client.approvedAt).toLocaleTimeString()}
              </span>
            </div>
          )}

          {client.approvedBy && (
            <div className="flex items-center gap-3">
              <span className="font-medium">Approved by:</span>
              <span className="text-gray-700">{client.approvedBy}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          {onboardingStatus !== 'approved' && (
            <button
              onClick={handleApproveOnboarding}
              disabled={isApprovingOnboarding}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isApprovingOnboarding ? 'Approving...' : 'Approve Onboarding'}
            </button>
          )}
          {onUpdate && (
            <button
              onClick={onUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Onboarding Data
            </button>
          )}
        </div>
      </section>

      {/* Contract Status Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Contract Status</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-medium">Current Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              contractStatus === 'signed'
                ? 'bg-green-100 text-green-800'
                : contractStatus === 'sent'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {contractStatus === 'not_sent' ? 'Not Sent' : contractStatus.charAt(0).toUpperCase() + contractStatus.slice(1)}
            </span>
          </div>

          {client.contractSentAt && (
            <div className="flex items-center gap-3">
              <span className="font-medium">Sent:</span>
              <span className="text-gray-700">
                {new Date(client.contractSentAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {client.contractSignedAt && (
            <div className="flex items-center gap-3">
              <span className="font-medium">Signed:</span>
              <span className="text-gray-700">
                {new Date(client.contractSignedAt).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            {contractStatus === 'not_sent' && (
              <button
                onClick={() => handleContractStatusChange('sent')}
                disabled={isUpdatingContract}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Mark as Sent
              </button>
            )}

            {(contractStatus === 'sent' || contractStatus === 'not_sent') && (
              <button
                onClick={() => handleContractStatusChange('signed')}
                disabled={isUpdatingContract}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Mark as Signed
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Assets & File Sharing Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Assets & File Sharing</h2>

        <div className="space-y-4">
          {/* Existing Links from Onboarding */}
          {(client.websiteUrl || client.productLink || client.figmaLink || client.brandGuidelines || client.designSystem) && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Onboarding Links:</h3>
              <div className="space-y-1">
                {client.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Website:</span>
                    <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {client.websiteUrl}
                    </a>
                  </div>
                )}
                {client.productLink && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Product:</span>
                    <a href={client.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {client.productLink}
                    </a>
                  </div>
                )}
                {client.figmaLink && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Figma:</span>
                    <a href={client.figmaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {client.figmaLink}
                    </a>
                  </div>
                )}
                {client.brandGuidelines && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Brand Guidelines:</span>
                    <a href={client.brandGuidelines} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {client.brandGuidelines}
                    </a>
                  </div>
                )}
                {client.designSystem && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Design System:</span>
                    <a href={client.designSystem} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {client.designSystem}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">Upload files</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF, ZIP up to 10MB</p>
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Uploaded Files:</h3>
              <ul className="space-y-1">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                Note: File upload functionality will be connected to your storage solution (S3, Supabase Storage, etc.)
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Client Information */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {client.businessName && (
            <div>
              <span className="text-sm font-medium text-gray-600">Business Name:</span>
              <p className="text-gray-900">{client.businessName}</p>
            </div>
          )}
          {client.clientFullName && (
            <div>
              <span className="text-sm font-medium text-gray-600">Full Name:</span>
              <p className="text-gray-900">{client.clientFullName}</p>
            </div>
          )}
          {client.roleTitle && (
            <div>
              <span className="text-sm font-medium text-gray-600">Role/Title:</span>
              <p className="text-gray-900">{client.roleTitle}</p>
            </div>
          )}
          {client.email && (
            <div>
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{client.email}</p>
            </div>
          )}
          {client.linkedinUrl && (
            <div>
              <span className="text-sm font-medium text-gray-600">LinkedIn:</span>
              <a href={client.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {client.linkedinUrl}
              </a>
            </div>
          )}
          {client.timezone && (
            <div>
              <span className="text-sm font-medium text-gray-600">Timezone:</span>
              <p className="text-gray-900">{client.timezone}</p>
            </div>
          )}
          {client.billingContact && (
            <div className="md:col-span-2">
              <span className="text-sm font-medium text-gray-600">Billing Contact:</span>
              <p className="text-gray-900">{client.billingContact}</p>
            </div>
          )}
        </div>
      </section>

      {/* Sprint Overview */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Sprint Overview</h2>
        <div className="space-y-4">
          {client.sprintType && (
            <div>
              <span className="text-sm font-medium text-gray-600">Sprint Type:</span>
              <p className="text-gray-900">{client.sprintType}</p>
            </div>
          )}
          {client.oneSentenceOutcome && (
            <div>
              <span className="text-sm font-medium text-gray-600">One Sentence Outcome:</span>
              <p className="text-gray-900">{client.oneSentenceOutcome}</p>
            </div>
          )}
          {client.successCriteria && (
            <div>
              <span className="text-sm font-medium text-gray-600">Success Criteria:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.successCriteria}</p>
            </div>
          )}
          {client.nonNegotiables && (
            <div>
              <span className="text-sm font-medium text-gray-600">Non-Negotiables:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.nonNegotiables}</p>
            </div>
          )}
          {client.outOfScope && (
            <div>
              <span className="text-sm font-medium text-gray-600">Out of Scope:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.outOfScope}</p>
            </div>
          )}
          {client.kickoffTime && (
            <div>
              <span className="text-sm font-medium text-gray-600">Kickoff Time:</span>
              <p className="text-gray-900">{client.kickoffTime}</p>
            </div>
          )}
          {client.expectedDeliveryDate && (
            <div>
              <span className="text-sm font-medium text-gray-600">Expected Delivery Date:</span>
              <p className="text-gray-900">{client.expectedDeliveryDate}</p>
            </div>
          )}
        </div>
      </section>

      {/* Problem & Context */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Problem & Context</h2>
        <div className="space-y-4">
          {client.triggerEvent && (
            <div>
              <span className="text-sm font-medium text-gray-600">Trigger Event:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.triggerEvent}</p>
            </div>
          )}
          {client.deadlineTiming && (
            <div>
              <span className="text-sm font-medium text-gray-600">Deadline/Timing:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.deadlineTiming}</p>
            </div>
          )}
          {client.consequencesOfGettingItWrong && (
            <div>
              <span className="text-sm font-medium text-gray-600">Consequences of Getting It Wrong:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.consequencesOfGettingItWrong}</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Context */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Product Context</h2>
        <div className="space-y-4">
          {client.productType && (
            <div>
              <span className="text-sm font-medium text-gray-600">Product Type:</span>
              <p className="text-gray-900">{client.productType}</p>
            </div>
          )}
          {client.targetUser && (
            <div>
              <span className="text-sm font-medium text-gray-600">Target User:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.targetUser}</p>
            </div>
          )}
          {client.currentState && (
            <div>
              <span className="text-sm font-medium text-gray-600">Current State:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.currentState}</p>
            </div>
          )}
          {client.buildCadence && (
            <div>
              <span className="text-sm font-medium text-gray-600">Build Cadence:</span>
              <p className="text-gray-900">{client.buildCadence}</p>
            </div>
          )}
          {client.stageFocus && (
            <div>
              <span className="text-sm font-medium text-gray-600">Stage Focus:</span>
              <p className="text-gray-900">{client.stageFocus}</p>
            </div>
          )}
          {client.keyDecision && (
            <div>
              <span className="text-sm font-medium text-gray-600">Key Decision:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.keyDecision}</p>
            </div>
          )}
        </div>
      </section>

      {/* Research & Assumptions */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Research & Assumptions</h2>
        <div className="space-y-4">
          {client.knowns && (
            <div>
              <span className="text-sm font-medium text-gray-600">Knowns:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.knowns}</p>
            </div>
          )}
          {client.unknowns && (
            <div>
              <span className="text-sm font-medium text-gray-600">Unknowns:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.unknowns}</p>
            </div>
          )}
          {client.topAssumptions && (
            <div>
              <span className="text-sm font-medium text-gray-600">Top Assumptions:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.topAssumptions}</p>
            </div>
          )}
          {client.currentSignals && (
            <div>
              <span className="text-sm font-medium text-gray-600">Current Signals:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.currentSignals}</p>
            </div>
          )}
        </div>
      </section>

      {/* Working Style & Preferences */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Working Style & Preferences</h2>
        <div className="space-y-4">
          {client.accessNeeded && (
            <div>
              <span className="text-sm font-medium text-gray-600">Access Needed:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.accessNeeded}</p>
            </div>
          )}
          {client.whoApproves && (
            <div>
              <span className="text-sm font-medium text-gray-600">Who Approves:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.whoApproves}</p>
            </div>
          )}
          {client.whoWillBuild && (
            <div>
              <span className="text-sm font-medium text-gray-600">Who Will Build:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.whoWillBuild}</p>
            </div>
          )}
          {client.preferredCommunication && (
            <div>
              <span className="text-sm font-medium text-gray-600">Preferred Communication:</span>
              <p className="text-gray-900">{client.preferredCommunication}</p>
            </div>
          )}
          {client.feedbackStyle && (
            <div>
              <span className="text-sm font-medium text-gray-600">Feedback Style:</span>
              <p className="text-gray-900">{client.feedbackStyle}</p>
            </div>
          )}
          {client.availability && (
            <div>
              <span className="text-sm font-medium text-gray-600">Availability:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.availability}</p>
            </div>
          )}
        </div>
      </section>

      {/* Business Context */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Business Context</h2>
        <div className="space-y-4">
          {client.budgetComfort && (
            <div>
              <span className="text-sm font-medium text-gray-600">Budget Comfort:</span>
              <p className="text-gray-900">{client.budgetComfort}</p>
            </div>
          )}
          {client.ongoingHelpLikelihood && (
            <div>
              <span className="text-sm font-medium text-gray-600">Ongoing Help Likelihood:</span>
              <p className="text-gray-900">{client.ongoingHelpLikelihood}</p>
            </div>
          )}
          {client.decisionTimeline && (
            <div>
              <span className="text-sm font-medium text-gray-600">Decision Timeline:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.decisionTimeline}</p>
            </div>
          )}
          {client.objections && (
            <div>
              <span className="text-sm font-medium text-gray-600">Objections:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.objections}</p>
            </div>
          )}
          {client.previousExperience && (
            <div>
              <span className="text-sm font-medium text-gray-600">Previous Experience:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.previousExperience}</p>
            </div>
          )}
        </div>
      </section>

      {/* Logistics */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Logistics</h2>
        <div className="space-y-4">
          {client.clientWillSend && (
            <div>
              <span className="text-sm font-medium text-gray-600">Client Will Send:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.clientWillSend}</p>
            </div>
          )}
          {client.willardWillSend && (
            <div>
              <span className="text-sm font-medium text-gray-600">Willard Will Send:</span>
              <p className="text-gray-900 whitespace-pre-wrap">{client.willardWillSend}</p>
            </div>
          )}
          {client.source && (
            <div>
              <span className="text-sm font-medium text-gray-600">Source:</span>
              <p className="text-gray-900">{client.source}</p>
            </div>
          )}
        </div>
      </section>

      {/* Linked Issues */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Linked Issues</h2>
          <a
            href={`/admin/issues?clientId=${client.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View all
          </a>
        </div>
        {client.issues && client.issues.length > 0 ? (
          <div className="space-y-2">
            {client.issues.map((issue: any) => (
              <a
                key={issue.id}
                href={`/admin/issues`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{issue.identifier}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        issue.status === 'done'
                          ? 'bg-green-100 text-green-700'
                          : issue.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : issue.status === 'blocked'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      {issue.priority !== 'none' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          issue.priority === 'urgent'
                            ? 'bg-red-100 text-red-700'
                            : issue.priority === 'high'
                            ? 'bg-orange-100 text-orange-700'
                            : issue.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {issue.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {issue.title}
                    </p>
                    {issue.project && (
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: issue.project.color || '#6366f1' }}
                        />
                        <span className="text-xs text-gray-600">{issue.project.name}</span>
                      </div>
                    )}
                  </div>
                  {issue.assignee && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">
                          {(issue.assignee.name || issue.assignee.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No issues linked to this client yet</p>
        )}
      </section>
    </div>
  );
}
