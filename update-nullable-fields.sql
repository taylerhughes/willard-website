-- Update OnboardingClient table to make all fields nullable
-- This allows Zapier to send partial data and store NULL instead of empty strings
-- Run this SQL in Supabase Studio: https://supabase.com/dashboard/project/YOUR_PROJECT/editor

-- Make all fields nullable (except id, clientId, createdAt, updatedAt, source)
ALTER TABLE "OnboardingClient"
  ALTER COLUMN "businessName" DROP NOT NULL,
  ALTER COLUMN "clientFullName" DROP NOT NULL,
  ALTER COLUMN "roleTitle" DROP NOT NULL,
  ALTER COLUMN "email" DROP NOT NULL,
  ALTER COLUMN "timezone" DROP NOT NULL,
  ALTER COLUMN "sprintType" DROP NOT NULL,
  ALTER COLUMN "oneSentenceOutcome" DROP NOT NULL,
  ALTER COLUMN "successCriteria" DROP NOT NULL,
  ALTER COLUMN "triggerEvent" DROP NOT NULL,
  ALTER COLUMN "deadlineTiming" DROP NOT NULL,
  ALTER COLUMN "consequencesOfGettingItWrong" DROP NOT NULL,
  ALTER COLUMN "productType" DROP NOT NULL,
  ALTER COLUMN "targetUser" DROP NOT NULL,
  ALTER COLUMN "currentState" DROP NOT NULL,
  ALTER COLUMN "buildCadence" DROP NOT NULL,
  ALTER COLUMN "stageFocus" DROP NOT NULL,
  ALTER COLUMN "keyDecision" DROP NOT NULL,
  ALTER COLUMN "knowns" DROP NOT NULL,
  ALTER COLUMN "unknowns" DROP NOT NULL,
  ALTER COLUMN "topAssumptions" DROP NOT NULL,
  ALTER COLUMN "whoApproves" DROP NOT NULL,
  ALTER COLUMN "whoWillBuild" DROP NOT NULL,
  ALTER COLUMN "preferredCommunication" DROP NOT NULL,
  ALTER COLUMN "feedbackStyle" DROP NOT NULL,
  ALTER COLUMN "availability" DROP NOT NULL;

-- Optional: Convert any existing empty strings to NULL
UPDATE "OnboardingClient"
SET
  "businessName" = NULLIF("businessName", ''),
  "clientFullName" = NULLIF("clientFullName", ''),
  "roleTitle" = NULLIF("roleTitle", ''),
  "email" = NULLIF("email", ''),
  "timezone" = NULLIF("timezone", ''),
  "sprintType" = NULLIF("sprintType", ''),
  "oneSentenceOutcome" = NULLIF("oneSentenceOutcome", ''),
  "successCriteria" = NULLIF("successCriteria", ''),
  "triggerEvent" = NULLIF("triggerEvent", ''),
  "deadlineTiming" = NULLIF("deadlineTiming", ''),
  "consequencesOfGettingItWrong" = NULLIF("consequencesOfGettingItWrong", ''),
  "productType" = NULLIF("productType", ''),
  "targetUser" = NULLIF("targetUser", ''),
  "currentState" = NULLIF("currentState", ''),
  "buildCadence" = NULLIF("buildCadence", ''),
  "stageFocus" = NULLIF("stageFocus", ''),
  "keyDecision" = NULLIF("keyDecision", ''),
  "knowns" = NULLIF("knowns", ''),
  "unknowns" = NULLIF("unknowns", ''),
  "topAssumptions" = NULLIF("topAssumptions", ''),
  "whoApproves" = NULLIF("whoApproves", ''),
  "whoWillBuild" = NULLIF("whoWillBuild", ''),
  "preferredCommunication" = NULLIF("preferredCommunication", ''),
  "feedbackStyle" = NULLIF("feedbackStyle", ''),
  "availability" = NULLIF("availability", '');

COMMENT ON TABLE "OnboardingClient" IS 'Updated: All fields now nullable to support partial data from Zapier';
