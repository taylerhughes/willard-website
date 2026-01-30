import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const exportRequestSchema = z.object({
  clientId: z.string(),
  email: z.string().email(),
});

/**
 * GDPR Data Export Request
 * Allows clients to request a copy of their personal data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = exportRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { clientId, email } = validation.data;

    // Find the client with all related data
    const client = await prisma.onboardingClient.findUnique({
      where: { clientId },
      include: {
        notes: true,
        activityLogs: true,
        accessLogs: true,
        consentLogs: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Verify email matches
    if (client.email !== email) {
      return NextResponse.json(
        { error: 'Email does not match client record' },
        { status: 403 }
      );
    }

    // Prepare exportable data (remove internal IDs and sensitive system info)
    const exportData = {
      exportedAt: new Date().toISOString(),
      personalInformation: {
        businessName: client.businessName,
        clientFullName: client.clientFullName,
        roleTitle: client.roleTitle,
        email: client.email,
        linkedinUrl: client.linkedinUrl,
        timezone: client.timezone,
        billingContact: client.billingContact,
      },
      sprintInformation: {
        sprintType: client.sprintType,
        oneSentenceOutcome: client.oneSentenceOutcome,
        successCriteria: client.successCriteria,
        nonNegotiables: client.nonNegotiables,
        outOfScope: client.outOfScope,
      },
      whyNow: {
        triggerEvent: client.triggerEvent,
        deadlineTiming: client.deadlineTiming,
        consequencesOfGettingItWrong: client.consequencesOfGettingItWrong,
      },
      productContext: {
        productType: client.productType,
        targetUser: client.targetUser,
        currentState: client.currentState,
        buildCadence: client.buildCadence,
        stageFocus: client.stageFocus,
      },
      decisionRisk: {
        keyDecision: client.keyDecision,
        knowns: client.knowns,
        unknowns: client.unknowns,
        topAssumptions: client.topAssumptions,
        currentSignals: client.currentSignals,
      },
      assetsAccess: {
        websiteUrl: client.websiteUrl,
        productLink: client.productLink,
        figmaLink: client.figmaLink,
        brandGuidelines: client.brandGuidelines,
        designSystem: client.designSystem,
        docsLinks: client.docsLinks,
        analyticsTools: client.analyticsTools,
        accessNeeded: client.accessNeeded,
      },
      stakeholders: {
        whoApproves: client.whoApproves,
        whoWillBuild: client.whoWillBuild,
        preferredCommunication: client.preferredCommunication,
        feedbackStyle: client.feedbackStyle,
        availability: client.availability,
      },
      businessContext: {
        budgetComfort: client.budgetComfort,
        ongoingHelpLikelihood: client.ongoingHelpLikelihood,
        decisionTimeline: client.decisionTimeline,
        objections: client.objections,
        previousExperience: client.previousExperience,
      },
      nextSteps: {
        kickoffTime: client.kickoffTime,
        expectedDeliveryDate: client.expectedDeliveryDate,
        clientWillSend: client.clientWillSend,
        willardWillSend: client.willardWillSend,
      },
      metadata: {
        clientId: client.clientId,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
        source: client.source,
        onboardingStatus: client.onboardingStatus,
      },
      activityLogs: client.activityLogs.map(log => ({
        action: log.action,
        details: log.details,
        actor: log.actor,
        createdAt: log.createdAt.toISOString(),
      })),
      accessLogs: client.accessLogs.map(log => ({
        action: log.action,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt.toISOString(),
      })),
      consentLogs: client.consentLogs.map(log => ({
        consentType: log.consentType,
        consented: log.consented,
        createdAt: log.createdAt.toISOString(),
      })),
    };

    // Log the export (for compliance)
    console.log(`GDPR export request processed for client: ${clientId}, email: ${email}`);

    // Return data as JSON
    return NextResponse.json(
      {
        success: true,
        data: exportData,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="willard-data-export-${clientId}.json"`,
        },
      }
    );
  } catch (error) {
    console.error('Error processing export request:', error);
    return NextResponse.json(
      { error: 'Failed to process export request' },
      { status: 500 }
    );
  }
}
