-- Add privacy consent tracking to OnboardingClient

ALTER TABLE "OnboardingClient"
ADD COLUMN "privacyPolicyConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "privacyConsentedAt" TIMESTAMP(3);
