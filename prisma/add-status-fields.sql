-- Add onboarding and contract status fields to OnboardingClient table

ALTER TABLE "OnboardingClient"
  ADD COLUMN "onboardingStatus" TEXT NOT NULL DEFAULT 'unapproved',
  ADD COLUMN "approvedAt" TIMESTAMP(3),
  ADD COLUMN "approvedBy" TEXT,
  ADD COLUMN "contractStatus" TEXT NOT NULL DEFAULT 'not_sent',
  ADD COLUMN "contractSentAt" TIMESTAMP(3),
  ADD COLUMN "contractSignedAt" TIMESTAMP(3);

-- Add check constraints for valid status values
ALTER TABLE "OnboardingClient"
  ADD CONSTRAINT "OnboardingClient_onboardingStatus_check"
  CHECK ("onboardingStatus" IN ('unapproved', 'approved', 'updated'));

ALTER TABLE "OnboardingClient"
  ADD CONSTRAINT "OnboardingClient_contractStatus_check"
  CHECK ("contractStatus" IN ('not_sent', 'sent', 'signed'));
