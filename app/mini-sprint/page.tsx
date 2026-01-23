import { Suspense } from 'react';
import OnboardingForm from '@/components/onboarding-form';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Suspense fallback={
        <div className="max-w-3xl mx-auto p-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading form...</p>
          </div>
        </div>
      }>
        <OnboardingForm />
      </Suspense>
    </div>
  );
}
