import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Client ID is required',
        },
        { status: 400 }
      );
    }

    // Fetch client from database
    const client = await prisma.onboardingClient.findUnique({
      where: { clientId },
    });

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          message: 'Client not found',
        },
        { status: 404 }
      );
    }

    // Transform database record to match form structure
    const formData = {
      clientIdentity: {
        businessName: client.businessName,
        clientFullName: client.clientFullName,
        roleTitle: client.roleTitle,
        email: client.email,
        linkedinUrl: client.linkedinUrl || '',
        timezone: client.timezone,
        billingContact: client.billingContact || '',
      },
      sprintDefinition: {
        sprintType: client.sprintType,
        oneSentenceOutcome: client.oneSentenceOutcome,
        successCriteria: client.successCriteria,
        nonNegotiables: client.nonNegotiables || '',
        outOfScope: client.outOfScope || '',
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
        currentSignals: client.currentSignals || '',
      },
      assetsAccess: {
        websiteUrl: client.websiteUrl || '',
        productLink: client.productLink || '',
        figmaLink: client.figmaLink || '',
        brandGuidelines: client.brandGuidelines || '',
        designSystem: client.designSystem || '',
        docsLinks: client.docsLinks || '',
        analyticsTools: client.analyticsTools || '',
        accessNeeded: client.accessNeeded || '',
      },
      stakeholders: {
        whoApproves: client.whoApproves,
        whoWillBuild: client.whoWillBuild,
        preferredCommunication: client.preferredCommunication,
        feedbackStyle: client.feedbackStyle,
        availability: client.availability,
      },
      commercial: {
        budgetComfort: client.budgetComfort || '',
        ongoingHelpLikelihood: client.ongoingHelpLikelihood || '',
        decisionTimeline: client.decisionTimeline || '',
        objections: client.objections || '',
        previousExperience: client.previousExperience || '',
      },
      nextSteps: {
        kickoffTime: client.kickoffTime || '',
        expectedDeliveryDate: client.expectedDeliveryDate || '',
        clientWillSend: client.clientWillSend || '',
        willardWillSend: client.willardWillSend || '',
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: formData,
        clientId: client.clientId,
        source: client.source,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching client:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
