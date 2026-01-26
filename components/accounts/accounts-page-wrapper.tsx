'use client';

import { useState } from 'react';
import Link from 'next/link';
import CreateAccountModal from './create-account-modal';

interface Account {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  description: string | null;
  status: string;
  convertedAt: Date | null;
  _count: {
    projects: number;
    contacts: number;
  };
  convertedFromLead: {
    id: string;
    clientId: string;
    businessName: string | null;
    clientFullName: string | null;
  } | null;
}

interface AccountsPageWrapperProps {
  initialAccounts: Account[];
}

const STATUS_CONFIG = {
  active: { label: 'Active', color: '#10b981' },
  inactive: { label: 'Inactive', color: '#6b7280' },
  prospect: { label: 'Prospect', color: '#f59e0b' },
};

export default function AccountsPageWrapper({
  initialAccounts,
}: AccountsPageWrapperProps) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleAccountCreated = (newAccount: Account) => {
    setAccounts((prev) => [newAccount, ...prev]);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your client accounts and relationships
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
            New Account
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {accounts.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">No accounts yet. Create one to get started!</p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <Link
                key={account.id}
                href={`/admin/accounts/${account.id}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    {account.industry && (
                      <p className="text-xs text-gray-500 mt-0.5">{account.industry}</p>
                    )}
                  </div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${STATUS_CONFIG[account.status as keyof typeof STATUS_CONFIG]?.color}15`,
                      color: STATUS_CONFIG[account.status as keyof typeof STATUS_CONFIG]?.color,
                    }}
                  >
                    {STATUS_CONFIG[account.status as keyof typeof STATUS_CONFIG]?.label}
                  </span>
                </div>

                {account.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {account.description}
                  </p>
                )}

                {account.website && (
                  <p className="text-xs text-indigo-600 mb-3 truncate">
                    {account.website}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{account._count.contacts} {account._count.contacts === 1 ? 'contact' : 'contacts'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>{account._count.projects} {account._count.projects === 1 ? 'project' : 'projects'}</span>
                  </div>
                </div>

                {account.convertedFromLead && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Converted from: {account.convertedFromLead.businessName || account.convertedFromLead.clientFullName}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAccountCreated={handleAccountCreated}
      />
    </div>
  );
}
