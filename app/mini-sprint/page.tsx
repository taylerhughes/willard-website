import { Suspense } from 'react';
import OnboardingWrapper from '@/components/onboarding-wrapper';
import './styles.css';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] py-8 px-4 font-[var(--font-figtree)]">
      <Suspense fallback={
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <OnboardingWrapper />
      </Suspense>
    </div>
  );
}
