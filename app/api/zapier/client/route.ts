import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for Zapier webhook payload
// Accept empty strings and convert to undefined for proper null handling
const zapierClientSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),

  // Client Identity - all optional, empty strings allowed
  businessName: z.string().optional().or(z.literal('')),
  clientFullName: z.string().optional().or(z.literal('')),
  roleTitle: z.string().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  timezone: z.string().optional().or(z.literal('')),
  billingContact: z.string().optional().or(z.literal('')),

  // Sprint Definition - allow empty strings
  sprintType: z.string().optional().or(z.literal('')),
  oneSentenceOutcome: z.string().optional().or(z.literal('')),
  successCriteria: z.string().optional().or(z.literal('')),
  nonNegotiables: z.string().optional().or(z.literal('')),
  outOfScope: z.string().optional().or(z.literal('')),

  // Why Now - allow empty strings
  triggerEvent: z.string().optional().or(z.literal('')),
  deadlineTiming: z.string().optional().or(z.literal('')),
  consequencesOfGettingItWrong: z.string().optional().or(z.literal('')),

  // Product Context - allow empty strings
  productType: z.string().optional().or(z.literal('')),
  targetUser: z.string().optional().or(z.literal('')),
  currentState: z.string().optional().or(z.literal('')),
  buildCadence: z.string().optional().or(z.literal('')),
  stageFocus: z.string().optional().or(z.literal('')),

  // Decision + Risk - allow empty strings
  keyDecision: z.string().optional().or(z.literal('')),
  knowns: z.string().optional().or(z.literal('')),
  unknowns: z.string().optional().or(z.literal('')),
  topAssumptions: z.string().optional().or(z.literal('')),
  currentSignals: z.string().optional().or(z.literal('')),

  // Assets + Access - allow empty strings
  websiteUrl: z.string().url().optional().or(z.literal('')),
  productLink: z.string().url().optional().or(z.literal('')),
  figmaLink: z.string().url().optional().or(z.literal('')),
  brandGuidelines: z.string().url().optional().or(z.literal('')),
  designSystem: z.string().url().optional().or(z.literal('')),
  docsLinks: z.string().optional().or(z.literal('')),
  analyticsTools: z.string().optional().or(z.literal('')),
  accessNeeded: z.string().optional().or(z.literal('')),

  // Stakeholders + Working Style - allow empty strings
  whoApproves: z.string().optional().or(z.literal('')),
  whoWillBuild: z.string().optional().or(z.literal('')),
  preferredCommunication: z.string().optional().or(z.literal('')),
  feedbackStyle: z.string().optional().or(z.literal('')),
  availability: z.string().optional().or(z.literal('')),

  // Commercial + Conversion Signals - allow empty strings
  budgetComfort: z.string().optional().or(z.literal('')),
  ongoingHelpLikelihood: z.string().optional().or(z.literal('')),
  decisionTimeline: z.string().optional().or(z.literal('')),
  objections: z.string().optional().or(z.literal('')),
  previousExperience: z.string().optional().or(z.literal('')),

  // Next Steps - allow empty strings
  kickoffTime: z.string().optional().or(z.literal('')),
  expectedDeliveryDate: z.string().optional().or(z.literal('')),
  clientWillSend: z.string().optional().or(z.literal('')),
  willardWillSend: z.string().optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data
    const validatedData = zapierClientSchema.parse(body);

    // Extract clientId and prepare data for database
    const { clientId, ...clientData } = validatedData;

    // Helper function to convert empty strings to null
    const toNullIfEmpty = (value: string | undefined) =>
      value && value.trim() !== '' ? value : null;

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

    // Create new client record - all fields can be null if not provided or empty
    const newClient = await prisma.onboardingClient.create({
      data: {
        clientId,
        source: 'zapier',

        // All fields optional - convert empty strings to null
        businessName: toNullIfEmpty(clientData.businessName),
        clientFullName: toNullIfEmpty(clientData.clientFullName),
        roleTitle: toNullIfEmpty(clientData.roleTitle),
        email: toNullIfEmpty(clientData.email),
        timezone: toNullIfEmpty(clientData.timezone),

        sprintType: toNullIfEmpty(clientData.sprintType),
        oneSentenceOutcome: toNullIfEmpty(clientData.oneSentenceOutcome),
        successCriteria: toNullIfEmpty(clientData.successCriteria),

        triggerEvent: toNullIfEmpty(clientData.triggerEvent),
        deadlineTiming: toNullIfEmpty(clientData.deadlineTiming),
        consequencesOfGettingItWrong: toNullIfEmpty(clientData.consequencesOfGettingItWrong),

        productType: toNullIfEmpty(clientData.productType),
        targetUser: toNullIfEmpty(clientData.targetUser),
        currentState: toNullIfEmpty(clientData.currentState),
        buildCadence: toNullIfEmpty(clientData.buildCadence),
        stageFocus: toNullIfEmpty(clientData.stageFocus),

        keyDecision: toNullIfEmpty(clientData.keyDecision),
        knowns: toNullIfEmpty(clientData.knowns),
        unknowns: toNullIfEmpty(clientData.unknowns),
        topAssumptions: toNullIfEmpty(clientData.topAssumptions),

        whoApproves: toNullIfEmpty(clientData.whoApproves),
        whoWillBuild: toNullIfEmpty(clientData.whoWillBuild),
        preferredCommunication: toNullIfEmpty(clientData.preferredCommunication),
        feedbackStyle: toNullIfEmpty(clientData.feedbackStyle),
        availability: toNullIfEmpty(clientData.availability),

        linkedinUrl: toNullIfEmpty(clientData.linkedinUrl),
        billingContact: toNullIfEmpty(clientData.billingContact),
        nonNegotiables: toNullIfEmpty(clientData.nonNegotiables),
        outOfScope: toNullIfEmpty(clientData.outOfScope),
        currentSignals: toNullIfEmpty(clientData.currentSignals),
        websiteUrl: toNullIfEmpty(clientData.websiteUrl),
        productLink: toNullIfEmpty(clientData.productLink),
        figmaLink: toNullIfEmpty(clientData.figmaLink),
        brandGuidelines: toNullIfEmpty(clientData.brandGuidelines),
        designSystem: toNullIfEmpty(clientData.designSystem),
        docsLinks: toNullIfEmpty(clientData.docsLinks),
        analyticsTools: toNullIfEmpty(clientData.analyticsTools),
        accessNeeded: toNullIfEmpty(clientData.accessNeeded),
        budgetComfort: toNullIfEmpty(clientData.budgetComfort),
        ongoingHelpLikelihood: toNullIfEmpty(clientData.ongoingHelpLikelihood),
        decisionTimeline: toNullIfEmpty(clientData.decisionTimeline),
        objections: toNullIfEmpty(clientData.objections),
        previousExperience: toNullIfEmpty(clientData.previousExperience),
        kickoffTime: toNullIfEmpty(clientData.kickoffTime),
        expectedDeliveryDate: toNullIfEmpty(clientData.expectedDeliveryDate),
        clientWillSend: toNullIfEmpty(clientData.clientWillSend),
        willardWillSend: toNullIfEmpty(clientData.willardWillSend),
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
          errors: error.issues,
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
