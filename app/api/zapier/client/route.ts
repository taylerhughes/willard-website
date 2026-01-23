import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for Zapier webhook payload
const zapierClientSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),

  // Client Identity - all optional since Zapier may send partial data
  businessName: z.string().optional(),
  clientFullName: z.string().optional(),
  roleTitle: z.string().optional(),
  email: z.string().email().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  timezone: z.string().optional(),
  billingContact: z.string().optional(),

  // Sprint Definition
  sprintType: z.string().optional(),
  oneSentenceOutcome: z.string().optional(),
  successCriteria: z.string().optional(),
  nonNegotiables: z.string().optional(),
  outOfScope: z.string().optional(),

  // Why Now
  triggerEvent: z.string().optional(),
  deadlineTiming: z.string().optional(),
  consequencesOfGettingItWrong: z.string().optional(),

  // Product Context
  productType: z.string().optional(),
  targetUser: z.string().optional(),
  currentState: z.string().optional(),
  buildCadence: z.string().optional(),
  stageFocus: z.string().optional(),

  // Decision + Risk
  keyDecision: z.string().optional(),
  knowns: z.string().optional(),
  unknowns: z.string().optional(),
  topAssumptions: z.string().optional(),
  currentSignals: z.string().optional(),

  // Assets + Access
  websiteUrl: z.string().url().optional().or(z.literal('')),
  productLink: z.string().url().optional().or(z.literal('')),
  figmaLink: z.string().url().optional().or(z.literal('')),
  brandGuidelines: z.string().url().optional().or(z.literal('')),
  designSystem: z.string().url().optional().or(z.literal('')),
  docsLinks: z.string().optional(),
  analyticsTools: z.string().optional(),
  accessNeeded: z.string().optional(),

  // Stakeholders + Working Style
  whoApproves: z.string().optional(),
  whoWillBuild: z.string().optional(),
  preferredCommunication: z.string().optional(),
  feedbackStyle: z.string().optional(),
  availability: z.string().optional(),

  // Commercial + Conversion Signals
  budgetComfort: z.string().optional(),
  ongoingHelpLikelihood: z.string().optional(),
  decisionTimeline: z.string().optional(),
  objections: z.string().optional(),
  previousExperience: z.string().optional(),

  // Next Steps
  kickoffTime: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  clientWillSend: z.string().optional(),
  willardWillSend: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data
    const validatedData = zapierClientSchema.parse(body);

    // Extract clientId and prepare data for database
    const { clientId, ...clientData } = validatedData;

    // Check if client already exists
    const existingClient = await prisma.onboardingClient.findUnique({
      where: { clientId },
    });

    if (existingClient) {
      return NextResponse.json(
        {
          success: false,
          message: 'Client with this ID already exists',
          clientId,
        },
        { status: 409 }
      );
    }

    // Create new client record with defaults for required fields
    const newClient = await prisma.onboardingClient.create({
      data: {
        clientId,
        source: 'zapier',

        // Required fields with defaults if not provided
        businessName: clientData.businessName || '',
        clientFullName: clientData.clientFullName || '',
        roleTitle: clientData.roleTitle || '',
        email: clientData.email || '',
        timezone: clientData.timezone || '',

        sprintType: clientData.sprintType || '',
        oneSentenceOutcome: clientData.oneSentenceOutcome || '',
        successCriteria: clientData.successCriteria || '',

        triggerEvent: clientData.triggerEvent || '',
        deadlineTiming: clientData.deadlineTiming || '',
        consequencesOfGettingItWrong: clientData.consequencesOfGettingItWrong || '',

        productType: clientData.productType || '',
        targetUser: clientData.targetUser || '',
        currentState: clientData.currentState || '',
        buildCadence: clientData.buildCadence || '',
        stageFocus: clientData.stageFocus || '',

        keyDecision: clientData.keyDecision || '',
        knowns: clientData.knowns || '',
        unknowns: clientData.unknowns || '',
        topAssumptions: clientData.topAssumptions || '',

        whoApproves: clientData.whoApproves || '',
        whoWillBuild: clientData.whoWillBuild || '',
        preferredCommunication: clientData.preferredCommunication || '',
        feedbackStyle: clientData.feedbackStyle || '',
        availability: clientData.availability || '',

        // Optional fields
        linkedinUrl: clientData.linkedinUrl || null,
        billingContact: clientData.billingContact || null,
        nonNegotiables: clientData.nonNegotiables || null,
        outOfScope: clientData.outOfScope || null,
        currentSignals: clientData.currentSignals || null,
        websiteUrl: clientData.websiteUrl || null,
        productLink: clientData.productLink || null,
        figmaLink: clientData.figmaLink || null,
        brandGuidelines: clientData.brandGuidelines || null,
        designSystem: clientData.designSystem || null,
        docsLinks: clientData.docsLinks || null,
        analyticsTools: clientData.analyticsTools || null,
        accessNeeded: clientData.accessNeeded || null,
        budgetComfort: clientData.budgetComfort || null,
        ongoingHelpLikelihood: clientData.ongoingHelpLikelihood || null,
        decisionTimeline: clientData.decisionTimeline || null,
        objections: clientData.objections || null,
        previousExperience: clientData.previousExperience || null,
        kickoffTime: clientData.kickoffTime || null,
        expectedDeliveryDate: clientData.expectedDeliveryDate || null,
        clientWillSend: clientData.clientWillSend || null,
        willardWillSend: clientData.willardWillSend || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Client created successfully',
        clientId: newClient.clientId,
        id: newClient.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating client from Zapier:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

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
