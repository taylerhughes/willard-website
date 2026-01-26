'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  OnboardingFormData,
  onboardingFormSchema,
  sprintTypes,
  productTypes,
  currentStates,
  buildCadences,
  stageFocuses,
  communicationPreferences,
  feedbackPreferences,
} from '@/types/onboarding';

interface OnboardingFormProps {
  onboardingStatus?: string;
  onSubmitSuccess?: () => void;
}

export default function OnboardingForm({ onboardingStatus = 'unapproved', onSubmitSuccess }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(onboardingStatus);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();

  const isApproved = currentStatus === 'approved';

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    mode: 'onChange', // Enable real-time validation
  });

  // Watch all form values to show completion status
  const formValues = watch();

  // Helper to check if a field has a value
  const isFieldComplete = (value: any): boolean => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  };

  // Helper to format time ago
  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  };

  // Check if a section is complete (all required fields filled and no errors)
  const isSectionComplete = (sectionKey: string) => {
    if (!formValues) return false;

    const sectionData = formValues[sectionKey as keyof typeof formValues];
    if (!sectionData || typeof sectionData !== 'object') return false;

    // Check if all fields in this section have values
    const allFieldsFilled = Object.values(sectionData).every(value => isFieldComplete(value));

    // Check if there are no errors in this section
    const sectionErrors = errors[sectionKey as keyof typeof errors];
    const hasNoErrors = !sectionErrors || Object.keys(sectionErrors).length === 0;

    return allFieldsFilled && hasNoErrors;
  };

  // Helper to render label with validation icon
  const renderLabel = (text: string, fieldPath: string) => {
    const pathParts = fieldPath.split('.');
    let value: any = formValues;
    for (const part of pathParts) {
      value = value?.[part];
    }

    // Check for validation errors in this field path
    let hasError = false;
    let errorObj: any = errors;
    for (const part of pathParts) {
      errorObj = errorObj?.[part];
    }
    hasError = !!errorObj;

    const isComplete = isFieldComplete(value) && !hasError;

    return (
      <label className="block text-sm font-medium mb-1">
        {isComplete ? (
          <svg className="text-green-500 inline-block mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '24px', height: '24px'}}>
            <path fillRule="evenodd" clipRule="evenodd" d="M15.993 10.222L11.375 14.84C11.228 14.987 11.037 15.06 10.845 15.06C10.652 15.06 10.461 14.987 10.314 14.84L8.005 12.531C7.712 12.238 7.712 11.763 8.005 11.47C8.298 11.177 8.772 11.177 9.065 11.47L10.845 13.249L14.932 9.161C15.225 8.868 15.7 8.868 15.993 9.161C16.286 9.454 16.286 9.929 15.993 10.222ZM12 2.5C6.762 2.5 2.5 6.762 2.5 12C2.5 17.239 6.762 21.5 12 21.5C17.238 21.5 21.5 17.239 21.5 12C21.5 6.762 17.238 2.5 12 2.5Z" fill="currentColor"></path>
          </svg>
        ) : (
          <svg className="text-gray-400 inline-block mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '24px', height: '24px'}}>
            <path fillRule="evenodd" clipRule="evenodd" d="M6.52293 3.0283C6.81582 3.3212 6.81582 3.79607 6.52293 4.08896C2.82602 7.78587 2.82602 13.7805 6.52293 17.4774C10.2198 21.1743 16.2137 21.1742 19.9106 17.4772C20.2035 17.1843 20.6784 17.1843 20.9713 17.4772C21.2642 17.7701 21.2642 18.245 20.9713 18.5379C16.6886 22.8206 9.74498 22.8208 5.46227 18.5381C1.17957 14.2554 1.17957 7.311 5.46227 3.0283C5.75516 2.73541 6.23003 2.73541 6.52293 3.0283Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M7.66383 3.75119C7.08107 3.73496 6.7287 3.88277 6.52252 4.08896C6.22962 4.38185 5.75475 4.38185 5.46186 4.08896C5.16896 3.79607 5.16896 3.32119 5.46186 3.0283C6.05363 2.43653 6.86576 2.22838 7.7056 2.25178C8.54327 2.27511 9.48002 2.52735 10.447 2.94173C12.3851 3.77226 14.5919 5.31769 16.6375 7.3633C18.6826 9.40843 20.2276 11.615 21.0579 13.5529C21.4721 14.5199 21.7243 15.4566 21.7475 16.2942C21.7708 17.134 21.5626 17.9461 20.9709 18.5379C20.678 18.8308 20.2031 18.8308 19.9102 18.5379C19.6173 18.245 19.6173 17.7701 19.9102 17.4772C20.1164 17.271 20.2643 16.9186 20.2481 16.3358C20.2318 15.7509 20.049 15.007 19.6791 14.1436C18.9411 12.4211 17.5215 10.3686 15.5768 8.42396C13.6316 6.47875 11.5789 5.05872 9.85616 4.32047C8.99274 3.95046 8.24877 3.76749 7.66383 3.75119Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M6.11631 7.88851C6.48423 7.69823 6.93675 7.84223 7.12703 8.21015C7.72567 9.36765 8.59382 10.6326 9.69027 11.8928C9.96216 12.2053 9.92925 12.679 9.61676 12.9509C9.30428 13.2228 8.83054 13.1899 8.55865 12.8774C7.39712 11.5424 6.45683 10.1795 5.79467 8.89923C5.60439 8.53131 5.74839 8.07879 6.11631 7.88851Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M11.1065 14.4352C11.3775 14.1219 11.8511 14.0875 12.1644 14.3585C13.3594 15.3918 14.5589 16.2194 15.6648 16.8064C16.0307 17.0005 16.1699 17.4546 15.9757 17.8204C15.7815 18.1863 15.3275 18.3255 14.9616 18.1313C13.7421 17.4841 12.4506 16.589 11.1833 15.4931C10.87 15.2222 10.8356 14.7485 11.1065 14.4352Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M20.9719 17.4775C21.2648 17.7704 21.2648 18.2452 20.9719 18.5381C20.3224 19.1876 19.4104 19.3741 18.4804 19.3011C18.0675 19.2687 17.759 18.9077 17.7914 18.4947C17.8238 18.0818 18.1848 17.7733 18.5978 17.8057C19.2821 17.8594 19.6861 17.7026 19.9112 17.4775C20.2041 17.1846 20.679 17.1846 20.9719 17.4775Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M6.52234 3.02729C6.81523 3.32018 6.81523 3.79505 6.52234 4.08795C6.29723 4.31306 6.1404 4.71702 6.19411 5.40137C6.22652 5.81432 5.91804 6.17535 5.50509 6.20775C5.09215 6.24016 4.73112 5.93168 4.69871 5.51873C4.62573 4.58877 4.8122 3.67677 5.46168 3.02729C5.75457 2.73439 6.22945 2.73439 6.52234 3.02729Z" fill="currentColor"></path>
          </svg>
        )}
        {text}
      </label>
    );
  };

  // Helper to render section header with collapse/expand button
  const renderSectionHeader = (title: string, sectionKey: string) => {
    const isExpanded = expandedSections[sectionKey] ?? true; // Default to expanded if not yet initialized
    return (
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between text-left mb-3 group"
      >
        <h2 className="text-2xl font-semibold">{title}</h2>
        <svg
          className={`text-gray-400 transition-transform ${isExpanded ? '' : 'rotate-180'}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{width: '24px', height: '24px'}}
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M11.4697 8.46967C11.7626 8.17678 12.2374 8.17678 12.5303 8.46967L17.0303 12.9697C17.3232 13.2626 17.3232 13.7374 17.0303 14.0303C16.7374 14.3232 16.2626 14.3232 15.9697 14.0303L12 10.0607L8.03033 14.0303C7.73744 14.3232 7.26256 14.3232 6.96967 14.0303C6.67678 13.7374 6.67678 13.2626 6.96967 12.9697L11.4697 8.46967Z" fill="currentColor"/>
        </svg>
      </button>
    );
  };

  // Auto-save form data to database
  useEffect(() => {
    if (!clientId) {
      console.log('Auto-save: No clientId, skipping');
      return;
    }

    // Check if form has any meaningful data (at least one field with value)
    const hasData = formValues && Object.keys(formValues).length > 0;
    if (!hasData) {
      console.log('Auto-save: No form data yet, skipping');
      return;
    }

    // Check if at least one field has a non-empty value
    const hasMeaningfulData = Object.values(formValues).some((section) => {
      if (section && typeof section === 'object') {
        return Object.values(section).some(value => isFieldComplete(value));
      }
      return false;
    });

    if (!hasMeaningfulData) {
      console.log('Auto-save: No meaningful data yet, skipping');
      return;
    }

    console.log('Auto-save: Form data changed, preparing to save...', formValues);

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);

    // Debounce the save to avoid excessive API calls
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('Auto-save: Saving to database...');

        const response = await fetch('/api/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formValues, clientId }),
        });

        if (response.ok) {
          setLastSaved(new Date());
          console.log('Auto-save: Successful!');
        } else if (response.status === 400) {
          // Validation error - this is expected when form is incomplete
          console.log('Auto-save: Skipped (validation error - form incomplete)');
        } else {
          console.error('Auto-save: Failed with status', response.status);
        }
      } catch (error) {
        console.error('Auto-save: Failed', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000); // Save 2 seconds after user stops typing

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [JSON.stringify(formValues), clientId]);

  // Initialize expanded sections based on completion status
  useEffect(() => {
    if (formValues && Object.keys(expandedSections).length === 0) {
      const initialExpanded: Record<string, boolean> = {
        clientIdentity: !isSectionComplete('clientIdentity'),
        sprintDefinition: !isSectionComplete('sprintDefinition'),
        whyNow: !isSectionComplete('whyNow'),
        productContext: !isSectionComplete('productContext'),
        decisionRisk: !isSectionComplete('decisionRisk'),
        assetsAccess: !isSectionComplete('assetsAccess'),
        stakeholders: !isSectionComplete('stakeholders'),
        commercial: !isSectionComplete('commercial'),
        nextSteps: !isSectionComplete('nextSteps'),
      };
      setExpandedSections(initialExpanded);
    }
  }, [formValues, expandedSections]);

  // Helper to get input class with completion indicator
  const getInputClassName = (fieldPath: string, hasError: boolean = false) => {
    const pathParts = fieldPath.split('.');
    let value: any = formValues;
    for (const part of pathParts) {
      value = value?.[part];
    }

    const isComplete = isFieldComplete(value);

    const baseClass = 'w-full px-3 py-2 border rounded-md transition-all duration-200';
    const completionClass = isComplete ? 'border-green-500 bg-green-50' : 'border-gray-300';
    const errorClass = hasError ? 'border-red-500 bg-red-50' : '';

    return `${baseClass} ${errorClass || completionClass}`;
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!formValues) return 0;

    const allFields = [
      formValues.clientIdentity?.businessName,
      formValues.clientIdentity?.clientFullName,
      formValues.clientIdentity?.roleTitle,
      formValues.clientIdentity?.email,
      formValues.clientIdentity?.timezone,
      formValues.sprintDefinition?.sprintType,
      formValues.sprintDefinition?.oneSentenceOutcome,
      formValues.sprintDefinition?.successCriteria,
      formValues.whyNow?.triggerEvent,
      formValues.whyNow?.deadlineTiming,
      formValues.whyNow?.consequencesOfGettingItWrong,
      formValues.productContext?.productType,
      formValues.productContext?.targetUser,
      formValues.productContext?.currentState,
      formValues.productContext?.buildCadence,
      formValues.productContext?.stageFocus,
      formValues.decisionRisk?.keyDecision,
      formValues.decisionRisk?.knowns,
      formValues.decisionRisk?.unknowns,
      formValues.decisionRisk?.topAssumptions,
      formValues.stakeholders?.whoApproves,
      formValues.stakeholders?.whoWillBuild,
      formValues.stakeholders?.preferredCommunication,
      formValues.stakeholders?.feedbackStyle,
      formValues.stakeholders?.availability,
    ];

    const completed = allFields.filter(isFieldComplete).length;
    return Math.round((completed / allFields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Fetch and pre-populate form data if clientId is present
  useEffect(() => {
    const urlClientId = searchParams.get('clientId');
    if (urlClientId) {
      setClientId(urlClientId);
      setIsLoading(true);

      // Fetch client data from server
      fetch(`/api/client/${urlClientId}`)
        .then((res) => res.json())
        .then((response) => {
          if (response.success && response.data) {
            const data = response.data;

            // Update onboarding status if available
            if (response.rawClient?.onboardingStatus) {
              setCurrentStatus(response.rawClient.onboardingStatus);
            }

            // Pre-populate all form fields
            Object.keys(data).forEach((section) => {
              const sectionData = data[section as keyof typeof data];
              if (sectionData && typeof sectionData === 'object') {
                Object.keys(sectionData).forEach((field) => {
                  const value = sectionData[field as keyof typeof sectionData];
                  if (value) {
                    setValue(`${section}.${field}` as any, value);
                  }
                });
              }
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching client data:', error);
          alert('Could not load pre-filled data. Please fill out the form manually.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [searchParams, setValue]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-form max-w-4xl mx-auto space-y-6">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img
          src="/logo.svg"
          alt="Willard Logo"
          className="h-12 w-auto"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Willard Mini Sprint Onboarding</h1>
          <p className="text-gray-600">
            Help us understand your needs so we can deliver the best possible
            sprint outcome.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-500">
            {completionPercentage}% completed!
          </div>
        </div>

        {/* Auto-save Status Indicator */}
        {clientId && (
          <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
            {isSaving ? (
              <>
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Auto-saved {formatTimeAgo(lastSaved)}</span>
              </>
            ) : (
              <span>Changes will be auto-saved</span>
            )}
          </div>
        )}
      </div>

      {/* 1) Client Identity */}
      <section className="">
        {renderSectionHeader('Client Identity', 'clientIdentity')}
        {(expandedSections.clientIdentity ?? true) && (
        <div className="">
        <div>
          {renderLabel('Business / Company Name *', 'clientIdentity.businessName')}
          <input
            {...register('clientIdentity.businessName')}
            className={getInputClassName('clientIdentity.businessName', !!errors.clientIdentity?.businessName)}
            placeholder="Acme Inc."
          />
          {errors.clientIdentity?.businessName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.clientIdentity.businessName.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('Your Full Name *', 'clientIdentity.clientFullName')}
          <input {...register('clientIdentity.clientFullName')} className={getInputClassName('clientIdentity.clientFullName')}
            placeholder="Jane Smith"
          />
          {errors.clientIdentity?.clientFullName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.clientIdentity.clientFullName.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('Role / Title *', 'clientIdentity.roleTitle')}
          <input {...register('clientIdentity.roleTitle')} className={getInputClassName('clientIdentity.roleTitle')}
            placeholder="Head of Product"
          />
          {errors.clientIdentity?.roleTitle && (
            <p className="text-red-600 text-sm mt-1">
              {errors.clientIdentity.roleTitle.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('Email Address *', 'clientIdentity.email')}
          <input {...register('clientIdentity.email')}
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="jane@acme.com"
          />
          {errors.clientIdentity?.email && (
            <p className="text-red-600 text-sm mt-1">
              {errors.clientIdentity.email.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('LinkedIn Profile URL (optional)', 'clientIdentity.linkedinUrl')}
          <input {...register('clientIdentity.linkedinUrl')} className={getInputClassName('clientIdentity.linkedinUrl')}
            placeholder="https://linkedin.com/in/..."
          />
          {errors.clientIdentity?.linkedinUrl && (
            <p className="text-red-600 text-sm mt-1">
              {errors.clientIdentity.linkedinUrl.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('Timezone *', 'clientIdentity.timezone')}
          <input {...register('clientIdentity.timezone')} className={getInputClassName('clientIdentity.timezone')}
            placeholder="EST / PST / GMT+1 etc."
          />
          {errors.clientIdentity?.timezone && (
            <p className="text-red-600 text-sm mt-1">
              {errors.clientIdentity.timezone.message}
            </p>
          )}
        </div>
        </div>
        )}
      </section>

      {/* 2) Sprint Definition */}
      <section className="">
        {renderSectionHeader('2. Sprint Definition', 'sprintDefinition')}
        {(expandedSections.sprintDefinition ?? true) && (
        <>
        <div className="">
        <div>
          {renderLabel('Sprint Type *', 'sprintDefinition.sprintType')}
          <select {...register('sprintDefinition.sprintType')} className={getInputClassName('sprintDefinition.sprintType')}
          >
            <option value="">Select a sprint type...</option>
            {sprintTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.sprintDefinition?.sprintType && (
            <p className="text-red-600 text-sm mt-1">
              {errors.sprintDefinition.sprintType.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('One Sentence Outcome *', 'sprintDefinition.oneSentenceOutcome')}
            <p className="text-sm text-gray-600">
              "By the end of this sprint we will have ___"
            </p>
          </div>
          <div className="flex-1">
            <input {...register('sprintDefinition.oneSentenceOutcome')} className={getInputClassName('sprintDefinition.oneSentenceOutcome')}
              placeholder="a validated checkout flow ready to ship"
            />
            {errors.sprintDefinition?.oneSentenceOutcome && (
              <p className="text-red-600 text-sm mt-1">
                {errors.sprintDefinition.oneSentenceOutcome.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Success Criteria *', 'sprintDefinition.successCriteria')}
            <p className="text-sm text-gray-600">
              What does "done" mean for this sprint?
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('sprintDefinition.successCriteria')} className={getInputClassName('sprintDefinition.successCriteria')}
              rows={3}
              placeholder="Design is approved, devs have all specs, prototype is clickable..."
            />
            {errors.sprintDefinition?.successCriteria && (
              <p className="text-red-600 text-sm mt-1">
                {errors.sprintDefinition.successCriteria.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Non-Negotiables', 'sprintDefinition.nonNegotiables')}
            <p className="text-sm text-gray-600">
              What must not change? What needs to match?
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('sprintDefinition.nonNegotiables')} className={getInputClassName('sprintDefinition.nonNegotiables')}
              rows={2}
              placeholder="Must use existing design system, can't change the nav..."
            />
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Out of Scope', 'sprintDefinition.outOfScope')}
            <p className="text-sm text-gray-600">
              What is explicitly NOT included in this sprint?
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('sprintDefinition.outOfScope')} className={getInputClassName('sprintDefinition.outOfScope')}
              rows={2}
              placeholder="Mobile app version, backend integration..."
            />
          </div>
        </div>
        </div>
        </>
        )}
      </section>

      {/* 3) Why Now */}
      <section className="">
        {renderSectionHeader('3. Why Now', 'whyNow')}
        {(expandedSections.whyNow ?? true) && (
        <>
        <div className="">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Trigger Event *', 'whyNow.triggerEvent')}
            <p className="text-sm text-gray-600">
              What's driving this now? (funding, hiring, launch, investor
              pressure, churn, etc.)
            </p>
          </div>
          <div className="flex-1">
            <input {...register('whyNow.triggerEvent')} className={getInputClassName('whyNow.triggerEvent')}
              placeholder="Just raised Series A, need to scale fast"
            />
            {errors.whyNow?.triggerEvent && (
              <p className="text-red-600 text-sm mt-1">
                {errors.whyNow.triggerEvent.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Deadline / Timing *', 'whyNow.deadlineTiming')}
            <p className="text-sm text-gray-600">
              When do you need this by?
            </p>
          </div>
          <div className="flex-1">
            <input {...register('whyNow.deadlineTiming')} className={getInputClassName('whyNow.deadlineTiming')}
              placeholder="Need this by Friday / before next sprint"
            />
            {errors.whyNow?.deadlineTiming && (
              <p className="text-red-600 text-sm mt-1">
                {errors.whyNow.deadlineTiming.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1">
              What Happens If You Get It Wrong *
            </label>
            <p className="text-sm text-gray-600">
              What's at risk? (wasted eng time, missed window, confused users,
              etc.)
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('whyNow.consequencesOfGettingItWrong')} className={getInputClassName('whyNow.consequencesOfGettingItWrong')}
              rows={3}
              placeholder="Engineering team will build the wrong thing, waste 2 weeks..."
            />
            {errors.whyNow?.consequencesOfGettingItWrong && (
              <p className="text-red-600 text-sm mt-1">
                {errors.whyNow.consequencesOfGettingItWrong.message}
              </p>
            )}
          </div>
        </div>
        </div>
        </>
        )}
      </section>

      {/* 4) Product Context */}
      <section className="">
        {renderSectionHeader('4. Product Context', 'productContext')}
        {(expandedSections.productContext ?? true) && (
        <>
        <div className="">
        <div>
          {renderLabel('Product Type *', 'productContext.productType')}
          <select {...register('productContext.productType')} className={getInputClassName('productContext.productType')}
          >
            <option value="">Select...</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.productContext?.productType && (
            <p className="text-red-600 text-sm mt-1">
              {errors.productContext.productType.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Target User *', 'productContext.targetUser')}
            <p className="text-sm text-gray-600">
              Who is this product for?
            </p>
          </div>
          <div className="flex-1">
            <input {...register('productContext.targetUser')} className={getInputClassName('productContext.targetUser')}
              placeholder="Sales managers at mid-size B2B SaaS companies"
            />
            {errors.productContext?.targetUser && (
              <p className="text-red-600 text-sm mt-1">
                {errors.productContext.targetUser.message}
              </p>
            )}
          </div>
        </div>

        <div>
          {renderLabel('Current State *', 'productContext.currentState')}
          <select {...register('productContext.currentState')} className={getInputClassName('productContext.currentState')}
          >
            <option value="">Select...</option>
            {currentStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.productContext?.currentState && (
            <p className="text-red-600 text-sm mt-1">
              {errors.productContext.currentState.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1">
              Build Cadence *
            </label>
            <p className="text-sm text-gray-600">
              Where are you in the build process?
            </p>
          </div>
          <div className="flex-1">
            <select {...register('productContext.buildCadence')} className={getInputClassName('productContext.buildCadence')}
            >
              <option value="">Select...</option>
              {buildCadences.map((cadence) => (
                <option key={cadence} value={cadence}>
                  {cadence}
                </option>
              ))}
            </select>
            {errors.productContext?.buildCadence && (
              <p className="text-red-600 text-sm mt-1">
                {errors.productContext.buildCadence.message}
              </p>
            )}
          </div>
        </div>

        <div>
          {renderLabel('Stage Focus *', 'productContext.stageFocus')}
          <select {...register('productContext.stageFocus')} className={getInputClassName('productContext.stageFocus')}
          >
            <option value="">Select...</option>
            {stageFocuses.map((focus) => (
              <option key={focus} value={focus}>
                {focus}
              </option>
            ))}
          </select>
          {errors.productContext?.stageFocus && (
            <p className="text-red-600 text-sm mt-1">
              {errors.productContext.stageFocus.message}
            </p>
          )}
        </div>
        </div>
        </>
        )}
      </section>

      {/* 5) Decision + Risk */}
      <section className="">
        {renderSectionHeader('5. Decision + Risk', 'decisionRisk')}
        {(expandedSections.decisionRisk ?? true) && (
        <>
        <div className="">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1">
              The Key Decision You're Making *
            </label>
            <p className="text-sm text-gray-600">
              "Should we build X or Y?"
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('decisionRisk.keyDecision')} className={getInputClassName('decisionRisk.keyDecision')}
              rows={2}
              placeholder="Should we build a wizard flow or single-page form?"
            />
            {errors.decisionRisk?.keyDecision && (
              <p className="text-red-600 text-sm mt-1">
                {errors.decisionRisk.keyDecision.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Knowns *', 'decisionRisk.knowns')}
            <p className="text-sm text-gray-600">
              What are you confident about?
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('decisionRisk.knowns')} className={getInputClassName('decisionRisk.knowns')}
              rows={2}
              placeholder="Users want this feature, we have the tech..."
            />
            {errors.decisionRisk?.knowns && (
              <p className="text-red-600 text-sm mt-1">
                {errors.decisionRisk.knowns.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Unknowns *', 'decisionRisk.unknowns')}
            <p className="text-sm text-gray-600">
              What are you uncertain or guessing about?
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('decisionRisk.unknowns')} className={getInputClassName('decisionRisk.unknowns')}
              rows={2}
              placeholder="Not sure if users will understand this flow..."
            />
            {errors.decisionRisk?.unknowns && (
              <p className="text-red-600 text-sm mt-1">
                {errors.decisionRisk.unknowns.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Top Assumptions *', 'decisionRisk.topAssumptions')}
            <p className="text-sm text-gray-600">
              "We assume users will..."
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('decisionRisk.topAssumptions')} className={getInputClassName('decisionRisk.topAssumptions')}
              rows={2}
              placeholder="We assume users will complete the form in one sitting..."
            />
            {errors.decisionRisk?.topAssumptions && (
              <p className="text-red-600 text-sm mt-1">
                {errors.decisionRisk.topAssumptions.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1">
              Current Signals You Already Have
            </label>
            <p className="text-sm text-gray-600">
              User conversations, data, support tickets, demos, etc.
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('decisionRisk.currentSignals')} className={getInputClassName('decisionRisk.currentSignals')}
              rows={2}
              placeholder="5 user interviews, support tickets showing confusion..."
            />
          </div>
        </div>
        </div>
        </>
        )}
      </section>

      {/* 6) Assets + Access */}
      <section className="">
        {renderSectionHeader('6. Assets + Access', 'assetsAccess')}
        {(expandedSections.assetsAccess ?? true) && (
        <>
        <div className="">
        <div>
          {renderLabel('Website URL', 'assetsAccess.websiteUrl')}
          <input {...register('assetsAccess.websiteUrl')} className={getInputClassName('assetsAccess.websiteUrl')}
            placeholder="https://acme.com"
          />
          {errors.assetsAccess?.websiteUrl && (
            <p className="text-red-600 text-sm mt-1">
              {errors.assetsAccess.websiteUrl.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('Product Link / Staging Link', 'assetsAccess.productLink')}
          <input {...register('assetsAccess.productLink')} className={getInputClassName('assetsAccess.productLink')}
            placeholder="https://app.acme.com or staging link"
          />
          {errors.assetsAccess?.productLink && (
            <p className="text-red-600 text-sm mt-1">
              {errors.assetsAccess.productLink.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('Figma Link', 'assetsAccess.figmaLink')}
          <input {...register('assetsAccess.figmaLink')} className={getInputClassName('assetsAccess.figmaLink')}
            placeholder="https://figma.com/file/..."
          />
          {errors.assetsAccess?.figmaLink && (
            <p className="text-red-600 text-sm mt-1">
              {errors.assetsAccess.figmaLink.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('Brand Guidelines', 'assetsAccess.brandGuidelines')}
          <input {...register('assetsAccess.brandGuidelines')} className={getInputClassName('assetsAccess.brandGuidelines')}
            placeholder="Link to brand guidelines"
          />
        </div>

        <div>
          {renderLabel('Design System / Component Library', 'assetsAccess.designSystem')}
          <input {...register('assetsAccess.designSystem')} className={getInputClassName('assetsAccess.designSystem')}
            placeholder="Link to design system or Storybook"
          />
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Documentation Links', 'assetsAccess.docsLinks')}
            <p className="text-sm text-gray-600">
              PRD, deck, Notion, Jira, Linear, etc.
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('assetsAccess.docsLinks')} className={getInputClassName('assetsAccess.docsLinks')}
              rows={2}
              placeholder="Notion: https://... Linear: https://..."
            />
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1">
              Analytics Tools
            </label>
            <p className="text-sm text-gray-600">
              GA, PostHog, Amplitude, Mixpanel (optional)
            </p>
          </div>
          <div className="flex-1">
            <input {...register('assetsAccess.analyticsTools')} className={getInputClassName('assetsAccess.analyticsTools')}
              placeholder="Google Analytics, PostHog"
            />
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Access Needed', 'assetsAccess.accessNeeded')}
            <p className="text-sm text-gray-600">
              Flag any credentials or access we'll need (don't include actual
              passwords here)
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('assetsAccess.accessNeeded')} className={getInputClassName('assetsAccess.accessNeeded')}
              rows={2}
              placeholder="Will need Figma editor access, staging environment login..."
            />
          </div>
        </div>
        </div>
        </>
        )}
      </section>

      {/* 7) Stakeholders + Working Style */}
      <section className="">
        {renderSectionHeader('7. Stakeholders + Working Style', 'stakeholders')}
        {(expandedSections.stakeholders ?? true) && (
        <>
        <div className="">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1">
              Who Approves *
            </label>
            <p className="text-sm text-gray-600">
              Founder vs head of product vs eng lead?
            </p>
          </div>
          <div className="flex-1">
            <input {...register('stakeholders.whoApproves')} className={getInputClassName('stakeholders.whoApproves')}
              placeholder="CEO and Head of Product"
            />
            {errors.stakeholders?.whoApproves && (
              <p className="text-red-600 text-sm mt-1">
                {errors.stakeholders.whoApproves.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1">
              Who Will Build It *
            </label>
            <p className="text-sm text-gray-600">
              Internal engineers / external devs?
            </p>
          </div>
          <div className="flex-1">
            <input {...register('stakeholders.whoWillBuild')} className={getInputClassName('stakeholders.whoWillBuild')}
            placeholder="Internal engineering team (3 devs)"
          />
          {errors.stakeholders?.whoWillBuild && (
            <p className="text-red-600 text-sm mt-1">
              {errors.stakeholders.whoWillBuild.message}
            </p>
          )}
          </div>
        </div>

        <div>
          {renderLabel('Preferred Communication *', 'stakeholders.preferredCommunication')}
          <select {...register('stakeholders.preferredCommunication')} className={getInputClassName('stakeholders.preferredCommunication')}
          >
            <option value="">Select...</option>
            {communicationPreferences.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
          {errors.stakeholders?.preferredCommunication && (
            <p className="text-red-600 text-sm mt-1">
              {errors.stakeholders.preferredCommunication.message}
            </p>
          )}
        </div>

        <div>
          {renderLabel('Feedback Style *', 'stakeholders.feedbackStyle')}
          <select {...register('stakeholders.feedbackStyle')} className={getInputClassName('stakeholders.feedbackStyle')}
          >
            <option value="">Select...</option>
            {feedbackPreferences.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
          {errors.stakeholders?.feedbackStyle && (
            <p className="text-red-600 text-sm mt-1">
              {errors.stakeholders.feedbackStyle.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('Availability *', 'stakeholders.availability')}
            <p className="text-sm text-gray-600">
              Review windows / time constraints
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('stakeholders.availability')} className={getInputClassName('stakeholders.availability')}
              rows={2}
              placeholder="Available for reviews 9am-5pm EST, need 24hr notice for calls..."
            />
            {errors.stakeholders?.availability && (
              <p className="text-red-600 text-sm mt-1">
                {errors.stakeholders.availability.message}
              </p>
            )}
          </div>
        </div>
        </div>
        </>
        )}
      </section>

      {/* 8) Commercial + Conversion Signals - HIDDEN FROM CLIENT FORM, VISIBLE IN ADMIN */}
      {/* This section is only editable by admins in the CRM interface */}

      {/* 8) Next Steps - Renumbered from 9 */}
      <section className="">
        {renderSectionHeader('8. Next Steps', 'nextSteps')}
        {(expandedSections.nextSteps ?? true) && (
        <>
        <div className="">
        <div>
          {renderLabel('Kickoff Time Agreed', 'nextSteps.kickoffTime')}
          <input {...register('nextSteps.kickoffTime')} className={getInputClassName('nextSteps.kickoffTime')}
            placeholder="Tomorrow 2pm EST"
          />
        </div>

        <div>
          {renderLabel('Expected Delivery Date', 'nextSteps.expectedDeliveryDate')}
          <input {...register('nextSteps.expectedDeliveryDate')} className={getInputClassName('nextSteps.expectedDeliveryDate')}
            placeholder="Friday, Jan 31st"
          />
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {renderLabel('What You\'re Sending Us', 'nextSteps.clientWillSend')}
            <p className="text-sm text-gray-600">
              Figma links, docs, context materials
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('nextSteps.clientWillSend')} className={getInputClassName('nextSteps.clientWillSend')}
              rows={2}
              placeholder="Will send Figma file and PRD by EOD..."
            />
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1">
              What We're Sending You
            </label>
            <p className="text-sm text-gray-600">
              Onboarding form, NDA, sprint agreement
            </p>
          </div>
          <div className="flex-1">
            <textarea {...register('nextSteps.willardWillSend')} className={getInputClassName('nextSteps.willardWillSend')}
              rows={2}
              placeholder="NDA, sprint brief template..."
            />
          </div>
        </div>
        </div>
        </>
        )}
      </section>

      {/* CTA Box - Let Tayler Know It's Complete */}
      {clientId && (
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to submit?
            </h3>
            <p className="text-gray-700 mb-4">
              Once you've completed all the information above, let Tayler know your onboarding form is ready for review.
            </p>
            <a
              href={`mailto:tayler@willardagency.com?subject=Onboarding Complete - ${clientId}&body=Hi Tayler,%0D%0A%0D%0AI've completed my onboarding form and it's ready for your review.%0D%0A%0D%0AView my form: ${typeof window !== 'undefined' ? window.location.origin : ''}/mini-sprint?clientId=${clientId}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Notify Tayler - Form Complete
            </a>
            <p className="text-xs text-gray-500 mt-3">
              This will send an email to Tayler letting him know your form is ready
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
