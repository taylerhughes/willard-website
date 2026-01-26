'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import OnboardingForm from './onboarding-form';
import ClientSummary from './client-summary';

interface OnboardingWrapperProps {
  clientId?: string;
}

export default function OnboardingWrapper({ clientId: propClientId }: OnboardingWrapperProps = {}) {
  const [view, setView] = useState<'form' | 'summary'>('form');
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlClientId = propClientId || searchParams.get('clientId');
    if (urlClientId) {
      fetchClientData(urlClientId);
    }
  }, [searchParams, propClientId]);

  const fetchClientData = async (clientId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/client/${clientId}`);
      const result = await response.json();

      if (result.success && result.rawClient) {
        setClientData(result.rawClient);

        // Show summary view if already approved
        if (result.rawClient.onboardingStatus === 'approved' ||
            result.rawClient.onboardingStatus === 'updated') {
          setView('summary');
        }
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show summary view if approved
  if (view === 'summary' && clientData) {
    return (
      <ClientSummary
        client={clientData}
        onUpdate={() => setView('form')}
      />
    );
  }

  // Show form view with approval button if unapproved
  return (
    <div>
      <OnboardingForm
        onboardingStatus={clientData?.onboardingStatus || 'unapproved'}
        onSubmitSuccess={() => {
          if (clientData?.clientId) {
            fetchClientData(clientData.clientId);
          }
        }}
      />

      {/* Approval functionality has been moved to admin CRM interface only */}
    </div>
  );
}
