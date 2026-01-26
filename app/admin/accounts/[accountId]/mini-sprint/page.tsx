import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import OnboardingWrapper from '@/components/onboarding-wrapper';

type Params = Promise<{ accountId: string }>;

export default async function AccountMiniSprintPage({ params }: { params: Params }) {
  const { accountId } = await params;

  // Fetch the account to verify it exists and get the associated lead/client
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      convertedFromLead: {
        select: {
          clientId: true,
        },
      },
    },
  });

  if (!account) {
    notFound();
  }

  // If there's no associated lead/client, we can't show the form
  if (!account.convertedFromLead?.clientId) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">No Mini-Sprint Form Available</h2>
            <p className="text-sm text-yellow-700">
              This account does not have an associated lead with a mini-sprint form.
              Mini-sprint forms are only available for accounts that were converted from leads.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const clientId = account.convertedFromLead.clientId;

  return (
    <div className="flex-1 overflow-auto bg-white">
      <Suspense fallback={
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <a
              href={`/admin/accounts/${accountId}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Account
            </a>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Mini-Sprint Form</h1>
              <p className="text-sm text-gray-600 mt-1">
                Viewing mini-sprint form for {account.name}
              </p>
            </div>
            <div className="p-6">
              <OnboardingWrapper clientId={clientId} />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
