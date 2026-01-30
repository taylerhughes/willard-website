-- Add security models for form access control and audit logging

-- Access Token for secure time-limited form access
CREATE TABLE "AccessToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- Security audit log for form access
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- GDPR consent tracking
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "consented" BOOLEAN NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "AccessToken_token_key" ON "AccessToken"("token");

-- Create standard indexes
CREATE INDEX "AccessToken_clientId_idx" ON "AccessToken"("clientId");
CREATE INDEX "AccessToken_token_idx" ON "AccessToken"("token");
CREATE INDEX "AccessToken_expiresAt_idx" ON "AccessToken"("expiresAt");

CREATE INDEX "AccessLog_clientId_idx" ON "AccessLog"("clientId");
CREATE INDEX "AccessLog_createdAt_idx" ON "AccessLog"("createdAt");

CREATE INDEX "ConsentLog_clientId_idx" ON "ConsentLog"("clientId");
CREATE INDEX "ConsentLog_createdAt_idx" ON "ConsentLog"("createdAt");

-- Add foreign key constraints
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OnboardingClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OnboardingClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConsentLog" ADD CONSTRAINT "ConsentLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OnboardingClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
