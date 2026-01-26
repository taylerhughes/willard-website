import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateClientSchema = z.object({
  // CRM fields
  pipelineStage: z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).optional(),
  dealValue: z.number().nullable().optional(),
  expectedCloseDate: z.string().nullable().optional(),
  lostReason: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),

  // Contact fields
  businessName: z.string().nullable().optional(),
  clientFullName: z.string().nullable().optional(),
  roleTitle: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  billingContact: z.string().nullable().optional(),

  // Onboarding fields
  sprintType: z.string().nullable().optional(),
  oneSentenceOutcome: z.string().nullable().optional(),
  successCriteria: z.string().nullable().optional(),
  nonNegotiables: z.string().nullable().optional(),
  outOfScope: z.string().nullable().optional(),
  triggerEvent: z.string().nullable().optional(),
  deadlineTiming: z.string().nullable().optional(),
  consequencesOfGettingItWrong: z.string().nullable().optional(),
  productType: z.string().nullable().optional(),
  targetUser: z.string().nullable().optional(),
  currentState: z.string().nullable().optional(),
  buildCadence: z.string().nullable().optional(),
  stageFocus: z.string().nullable().optional(),
  keyDecision: z.string().nullable().optional(),
  knowns: z.string().nullable().optional(),
  unknowns: z.string().nullable().optional(),
  topAssumptions: z.string().nullable().optional(),
  currentSignals: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  productLink: z.string().nullable().optional(),
  figmaLink: z.string().nullable().optional(),
  brandGuidelines: z.string().nullable().optional(),
  designSystem: z.string().nullable().optional(),
  docsLinks: z.string().nullable().optional(),
  analyticsTools: z.string().nullable().optional(),
  accessNeeded: z.string().nullable().optional(),
  whoApproves: z.string().nullable().optional(),
  whoWillBuild: z.string().nullable().optional(),
  preferredCommunication: z.string().nullable().optional(),
  feedbackStyle: z.string().nullable().optional(),
  availability: z.string().nullable().optional(),
  budgetComfort: z.string().nullable().optional(),
  ongoingHelpLikelihood: z.string().nullable().optional(),
  decisionTimeline: z.string().nullable().optional(),
  objections: z.string().nullable().optional(),
  previousExperience: z.string().nullable().optional(),
  kickoffTime: z.string().nullable().optional(),
  expectedDeliveryDate: z.string().nullable().optional(),
  clientWillSend: z.string().nullable().optional(),
  willardWillSend: z.string().nullable().optional(),
});

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
        rawClient: client, // Include raw client data for status checks
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientId } = await params;
    const body = await request.json();

    // Validate request body
    const validationResult = updateClientSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Fetch current client to detect changes
    const currentClient = await prisma.onboardingClient.findUnique({
      where: { clientId },
    });

    if (!currentClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Build update object with only provided fields
    const prismaUpdate: any = {};
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        prismaUpdate[key] = value;
      }
    });

    // Handle pipeline stage change
    if (updateData.pipelineStage && updateData.pipelineStage !== currentClient.pipelineStage) {
      prismaUpdate.stageChangedAt = new Date();

      // Create activity log for stage change
      await prisma.activityLog.create({
        data: {
          clientId: currentClient.id,
          action: 'stage_changed',
          details: JSON.stringify({
            from: currentClient.pipelineStage,
            to: updateData.pipelineStage,
          }),
          actor: user.email || user.id,
        },
      });
    }

    // Update the client
    const updatedClient = await prisma.onboardingClient.update({
      where: { clientId },
      data: prismaUpdate,
      include: {
        convertedToAccount: {
          select: {
            id: true,
            name: true,
          },
        },
        issues: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true, avatar: true },
            },
            project: {
              select: { id: true, name: true, color: true },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Serialize dates for response
    const serializedClient = {
      ...updatedClient,
      id: updatedClient.id.toString(),
      createdAt: updatedClient.createdAt.toISOString(),
      updatedAt: updatedClient.updatedAt.toISOString(),
      approvedAt: updatedClient.approvedAt?.toISOString() || null,
      contractSentAt: updatedClient.contractSentAt?.toISOString() || null,
      contractSignedAt: updatedClient.contractSignedAt?.toISOString() || null,
      stageChangedAt: updatedClient.stageChangedAt?.toISOString() || null,
      expectedCloseDate: updatedClient.expectedCloseDate?.toISOString() || null,
      issues: updatedClient.issues.map((issue) => ({
        ...issue,
        createdAt: issue.createdAt.toISOString(),
        updatedAt: issue.updatedAt.toISOString(),
        dueDate: issue.dueDate?.toISOString() || null,
        completedAt: issue.completedAt?.toISOString() || null,
      })),
    };

    return NextResponse.json(serializedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
