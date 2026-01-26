'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import EditAccountModal from '@/components/accounts/edit-account-modal';
import EditContactModal from '@/components/contacts/edit-contact-modal';
import AddContactModal from '@/components/contacts/add-contact-modal';
import SelectContactModal from '@/components/contacts/select-contact-modal';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isPrimary: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  color: string | null;
  createdAt: string;
}

interface Account {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  description: string | null;
  status: string;
  ndaStatus: string | null;
  ndaSentAt: Date | null;
  ndaSignedAt: Date | null;
  ndaDocumentUrl: string | null;
  contacts: Contact[];
  projects: Project[];
  createdAt: string;
  convertedFromLead?: any;
}

interface AccountSummaryProps {
  account: Account;
}

export default function AccountSummary({ account }: AccountSummaryProps) {
  const router = useRouter();
  const [ndaStatus, setNdaStatus] = useState(account.ndaStatus || 'not_sent');
  const [ndaDocumentUrl, setNdaDocumentUrl] = useState(account.ndaDocumentUrl);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isSelectContactModalOpen, setIsSelectContactModalOpen] = useState(false);

  const handleSendNDAClick = () => {
    setIsSelectContactModalOpen(true);
  };

  const handleNDASent = (newNdaStatus: string, newNdaDocumentUrl: string) => {
    setNdaStatus(newNdaStatus);
    setNdaDocumentUrl(newNdaDocumentUrl);
  };

  const getNDAStatusBadge = () => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      not_sent: { label: 'Not Sent', color: 'bg-gray-100 text-gray-700' },
      sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700' },
      viewed: { label: 'Viewed', color: 'bg-purple-100 text-purple-700' },
      completed: { label: 'Signed', color: 'bg-green-100 text-green-700' },
      declined: { label: 'Declined', color: 'bg-red-100 text-red-700' },
    };

    const config = statusConfig[ndaStatus] || statusConfig.not_sent;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = () => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      active: { label: 'Active', color: 'bg-green-100 text-green-700' },
      inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700' },
      prospect: { label: 'Prospect', color: 'bg-yellow-100 text-yellow-700' },
    };

    const config = statusConfig[account.status] || statusConfig.active;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const primaryContact = account.contacts.find((c) => c.isPrimary);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/admin/accounts"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Accounts
          </Link>

          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
                    {getStatusBadge()}
                  </div>
                  {account.industry && (
                    <p className="text-sm text-gray-600">{account.industry}</p>
                  )}
                  {account.website && (
                    <a
                      href={account.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      {account.website}
                    </a>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    Edit Account
                  </button>
                  {ndaStatus === 'not_sent' && (
                    <button
                      onClick={handleSendNDAClick}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                      Send NDA
                    </button>
                  )}
                </div>
              </div>
            </div>

            {account.description && (
              <div className="px-6 py-4">
                <p className="text-sm text-gray-700">{account.description}</p>
              </div>
            )}
          </div>

          {/* NDA Status */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">NDA Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  {getNDAStatusBadge()}
                </div>
                {account.ndaSentAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sent:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(account.ndaSentAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {account.ndaSignedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Signed:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(account.ndaSignedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {ndaDocumentUrl && (
                  <div className="pt-2">
                    <a
                      href={ndaDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Document in PandaDoc
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Contacts</h2>
              <button
                onClick={() => setIsAddContactModalOpen(true)}
                className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
              >
                Add Contact
              </button>
            </div>
            <div className="px-6 py-4">
              {account.contacts.length === 0 ? (
                <p className="text-sm text-gray-500">No contacts yet</p>
              ) : (
                <div className="space-y-3">
                  {account.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </p>
                          {contact.isPrimary && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Primary
                            </span>
                          )}
                        </div>
                        {contact.role && (
                          <p className="text-xs text-gray-600">{contact.role}</p>
                        )}
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <p className="text-xs text-gray-600">{contact.phone}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingContact(contact)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mini-Sprint Form */}
          {account.convertedFromLead && (
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Mini-Sprint Form</h2>
              </div>
              <div className="px-6 py-4">
                <Link
                  href={`/admin/accounts/${account.id}/mini-sprint`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Mini-Sprint Form
                </Link>
                <p className="text-xs text-gray-500 mt-2">
                  View and manage the mini-sprint onboarding form for this account
                </p>
              </div>
            </div>
          )}

          {/* Projects */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            </div>
            <div className="px-6 py-4">
              {account.projects.length === 0 ? (
                <p className="text-sm text-gray-500">No projects yet</p>
              ) : (
                <div className="space-y-3">
                  {account.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/admin/projects/${project.id}`}
                      className="block py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded"
                    >
                      <div className="flex items-center gap-3">
                        {project.color && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{project.name}</p>
                          {project.description && (
                            <p className="text-xs text-gray-600 line-clamp-1">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">{project.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversion Info */}
          {account.convertedFromLead && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-900">Converted from Lead</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    This account was converted from lead{' '}
                    <Link
                      href={`/admin/client/${account.convertedFromLead.clientId}`}
                      className="font-medium underline"
                    >
                      {account.convertedFromLead.businessName || account.convertedFromLead.clientFullName}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Account Modal */}
      <EditAccountModal
        account={account}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Edit Contact Modal */}
      {editingContact && (
        <EditContactModal
          contact={editingContact}
          isOpen={true}
          onClose={() => setEditingContact(null)}
          onSuccess={() => {
            router.refresh();
          }}
          onDelete={() => {
            setEditingContact(null);
          }}
        />
      )}

      {/* Add Contact Modal */}
      <AddContactModal
        accountId={account.id}
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Select Contact Modal for NDA */}
      <SelectContactModal
        accountId={account.id}
        accountName={account.name}
        contacts={account.contacts}
        isOpen={isSelectContactModalOpen}
        onClose={() => setIsSelectContactModalOpen(false)}
        onSuccess={handleNDASent}
      />
    </div>
  );
}
