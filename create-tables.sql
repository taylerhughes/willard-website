-- Create OnboardingClient table for Willard Mini Sprint onboarding
-- Run this SQL in Supabase Studio: https://supabase.com/dashboard/project/YOUR_PROJECT/editor

CREATE TABLE IF NOT EXISTS "OnboardingClient" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- Client Identity
    "businessName" TEXT NOT NULL,
    "clientFullName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "timezone" TEXT NOT NULL,
    "billingContact" TEXT,

    -- Sprint Definition
    "sprintType" TEXT NOT NULL,
    "oneSentenceOutcome" TEXT NOT NULL,
    "successCriteria" TEXT NOT NULL,
    "nonNegotiables" TEXT,
    "outOfScope" TEXT,

    -- Why Now
    "triggerEvent" TEXT NOT NULL,
    "deadlineTiming" TEXT NOT NULL,
    "consequencesOfGettingItWrong" TEXT NOT NULL,

    -- Product Context
    "productType" TEXT NOT NULL,
    "targetUser" TEXT NOT NULL,
    "currentState" TEXT NOT NULL,
    "buildCadence" TEXT NOT NULL,
    "stageFocus" TEXT NOT NULL,

    -- Decision + Risk
    "keyDecision" TEXT NOT NULL,
    "knowns" TEXT NOT NULL,
    "unknowns" TEXT NOT NULL,
    "topAssumptions" TEXT NOT NULL,
    "currentSignals" TEXT,

    -- Assets + Access
    "websiteUrl" TEXT,
    "productLink" TEXT,
    "figmaLink" TEXT,
    "brandGuidelines" TEXT,
    "designSystem" TEXT,
    "docsLinks" TEXT,
    "analyticsTools" TEXT,
    "accessNeeded" TEXT,

    -- Stakeholders + Working Style
    "whoApproves" TEXT NOT NULL,
    "whoWillBuild" TEXT NOT NULL,
    "preferredCommunication" TEXT NOT NULL,
    "feedbackStyle" TEXT NOT NULL,
    "availability" TEXT NOT NULL,

    -- Commercial + Conversion Signals
    "budgetComfort" TEXT,
    "ongoingHelpLikelihood" TEXT,
    "decisionTimeline" TEXT,
    "objections" TEXT,
    "previousExperience" TEXT,

    -- Next Steps
    "kickoffTime" TEXT,
    "expectedDeliveryDate" TEXT,
    "clientWillSend" TEXT,
    "willardWillSend" TEXT,

    -- Track data source
    "source" TEXT NOT NULL DEFAULT 'zapier',

    CONSTRAINT "OnboardingClient_pkey" PRIMARY KEY ("id")
);

-- Create unique index on clientId
CREATE UNIQUE INDEX IF NOT EXISTS "OnboardingClient_clientId_key" ON "OnboardingClient"("clientId");

-- Add comments for documentation
COMMENT ON TABLE "OnboardingClient" IS 'Stores client onboarding data for Willard Mini Sprints';
COMMENT ON COLUMN "OnboardingClient"."clientId" IS 'Unique identifier sent from Zapier or generated from form';
COMMENT ON COLUMN "OnboardingClient"."source" IS 'Data source: zapier (pre-filled) or form (direct submission)';
