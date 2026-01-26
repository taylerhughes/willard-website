import { NextRequest, NextResponse } from 'next/server';
import { onboardingFormSchema } from '@/types/onboarding';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Extended schema to include optional clientId
const submissionSchema = onboardingFormSchema.extend({
  clientId: z.string().optional(),
});

// Create a deep partial schema for auto-save (allows incomplete nested data)
const partialSubmissionSchema = z.object({
  clientId: z.string().optional(),
  clientIdentity: z.object({
    businessName: z.string().optional(),
    clientFullName: z.string().optional(),
    roleTitle: z.string().optional(),
    email: z.string().optional(),
    linkedinUrl: z.string().optional(),
    timezone: z.string().optional(),
    billingContact: z.string().optional(),
  }).partial().optional(),
  sprintDefinition: z.object({
    sprintType: z.string().optional(),
    oneSentenceOutcome: z.string().optional(),
    successCriteria: z.string().optional(),
    nonNegotiables: z.string().optional(),
    outOfScope: z.string().optional(),
  }).partial().optional(),
  whyNow: z.object({
    triggerEvent: z.string().optional(),
    deadlineTiming: z.string().optional(),
    consequencesOfGettingItWrong: z.string().optional(),
  }).partial().optional(),
  productContext: z.object({
    productType: z.string().optional(),
    targetUser: z.string().optional(),
    currentState: z.string().optional(),
    buildCadence: z.string().optional(),
    stageFocus: z.string().optional(),
  }).partial().optional(),
  decisionRisk: z.object({
    keyDecision: z.string().optional(),
    knowns: z.string().optional(),
    unknowns: z.string().optional(),
    topAssumptions: z.string().optional(),
    currentSignals: z.string().optional(),
  }).partial().optional(),
  assetsAccess: z.object({
    websiteUrl: z.string().optional(),
    productLink: z.string().optional(),
    figmaLink: z.string().optional(),
    brandGuidelines: z.string().optional(),
    designSystem: z.string().optional(),
    docsLinks: z.string().optional(),
    analyticsTools: z.string().optional(),
    accessNeeded: z.string().optional(),
  }).partial().optional(),
  stakeholders: z.object({
    whoApproves: z.string().optional(),
    whoWillBuild: z.string().optional(),
    preferredCommunication: z.string().optional(),
    feedbackStyle: z.string().optional(),
    availability: z.string().optional(),
  }).partial().optional(),
  commercial: z.object({
    budgetComfort: z.string().optional(),
    ongoingHelpLikelihood: z.string().optional(),
    decisionTimeline: z.string().optional(),
    objections: z.string().optional(),
    previousExperience: z.string().optional(),
  }).partial().optional(),
  nextSteps: z.object({
    kickoffTime: z.string().optional(),
    expectedDeliveryDate: z.string().optional(),
    clientWillSend: z.string().optional(),
    willardWillSend: z.string().optional(),
  }).partial().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try full validation first, fall back to partial validation for auto-save
    const validationResult = submissionSchema.safeParse(body);
    let validatedData;
    let isPartialSave = false;

    if (validationResult.success) {
      validatedData = validationResult.data;
    } else {
      // If full validation fails, try partial validation for auto-save
      const partialResult = partialSubmissionSchema.safeParse(body);
      if (!partialResult.success) {
        throw partialResult.error;
      }
      validatedData = partialResult.data;
      isPartialSave = true;
    }

    const { clientId, ...formData } = validatedData;

    // Flatten the nested form data structure for database storage
    const flatData: any = {};

    // Client Identity
    if (formData.clientIdentity) {
      if (formData.clientIdentity.businessName !== undefined) flatData.businessName = formData.clientIdentity.businessName;
      if (formData.clientIdentity.clientFullName !== undefined) flatData.clientFullName = formData.clientIdentity.clientFullName;
      if (formData.clientIdentity.roleTitle !== undefined) flatData.roleTitle = formData.clientIdentity.roleTitle;
      if (formData.clientIdentity.email !== undefined) flatData.email = formData.clientIdentity.email;
      if (formData.clientIdentity.linkedinUrl !== undefined) flatData.linkedinUrl = formData.clientIdentity.linkedinUrl || null;
      if (formData.clientIdentity.timezone !== undefined) flatData.timezone = formData.clientIdentity.timezone;
      if (formData.clientIdentity.billingContact !== undefined) flatData.billingContact = formData.clientIdentity.billingContact || null;
    }

    // Sprint Definition
    if (formData.sprintDefinition) {
      if (formData.sprintDefinition.sprintType !== undefined) flatData.sprintType = formData.sprintDefinition.sprintType;
      if (formData.sprintDefinition.oneSentenceOutcome !== undefined) flatData.oneSentenceOutcome = formData.sprintDefinition.oneSentenceOutcome;
      if (formData.sprintDefinition.successCriteria !== undefined) flatData.successCriteria = formData.sprintDefinition.successCriteria;
      if (formData.sprintDefinition.nonNegotiables !== undefined) flatData.nonNegotiables = formData.sprintDefinition.nonNegotiables || null;
      if (formData.sprintDefinition.outOfScope !== undefined) flatData.outOfScope = formData.sprintDefinition.outOfScope || null;
    }

    // Why Now
    if (formData.whyNow) {
      if (formData.whyNow.triggerEvent !== undefined) flatData.triggerEvent = formData.whyNow.triggerEvent;
      if (formData.whyNow.deadlineTiming !== undefined) flatData.deadlineTiming = formData.whyNow.deadlineTiming;
      if (formData.whyNow.consequencesOfGettingItWrong !== undefined) flatData.consequencesOfGettingItWrong = formData.whyNow.consequencesOfGettingItWrong;
    }

    // Product Context
    if (formData.productContext) {
      if (formData.productContext.productType !== undefined) flatData.productType = formData.productContext.productType;
      if (formData.productContext.targetUser !== undefined) flatData.targetUser = formData.productContext.targetUser;
      if (formData.productContext.currentState !== undefined) flatData.currentState = formData.productContext.currentState;
      if (formData.productContext.buildCadence !== undefined) flatData.buildCadence = formData.productContext.buildCadence;
      if (formData.productContext.stageFocus !== undefined) flatData.stageFocus = formData.productContext.stageFocus;
    }

    // Decision Risk
    if (formData.decisionRisk) {
      if (formData.decisionRisk.keyDecision !== undefined) flatData.keyDecision = formData.decisionRisk.keyDecision;
      if (formData.decisionRisk.knowns !== undefined) flatData.knowns = formData.decisionRisk.knowns;
      if (formData.decisionRisk.unknowns !== undefined) flatData.unknowns = formData.decisionRisk.unknowns;
      if (formData.decisionRisk.topAssumptions !== undefined) flatData.topAssumptions = formData.decisionRisk.topAssumptions;
      if (formData.decisionRisk.currentSignals !== undefined) flatData.currentSignals = formData.decisionRisk.currentSignals || null;
    }

    // Assets Access
    if (formData.assetsAccess) {
      if (formData.assetsAccess.websiteUrl !== undefined) flatData.websiteUrl = formData.assetsAccess.websiteUrl || null;
      if (formData.assetsAccess.productLink !== undefined) flatData.productLink = formData.assetsAccess.productLink || null;
      if (formData.assetsAccess.figmaLink !== undefined) flatData.figmaLink = formData.assetsAccess.figmaLink || null;
      if (formData.assetsAccess.brandGuidelines !== undefined) flatData.brandGuidelines = formData.assetsAccess.brandGuidelines || null;
      if (formData.assetsAccess.designSystem !== undefined) flatData.designSystem = formData.assetsAccess.designSystem || null;
      if (formData.assetsAccess.docsLinks !== undefined) flatData.docsLinks = formData.assetsAccess.docsLinks || null;
      if (formData.assetsAccess.analyticsTools !== undefined) flatData.analyticsTools = formData.assetsAccess.analyticsTools || null;
      if (formData.assetsAccess.accessNeeded !== undefined) flatData.accessNeeded = formData.assetsAccess.accessNeeded || null;
    }

    // Stakeholders
    if (formData.stakeholders) {
      if (formData.stakeholders.whoApproves !== undefined) flatData.whoApproves = formData.stakeholders.whoApproves;
      if (formData.stakeholders.whoWillBuild !== undefined) flatData.whoWillBuild = formData.stakeholders.whoWillBuild;
      if (formData.stakeholders.preferredCommunication !== undefined) flatData.preferredCommunication = formData.stakeholders.preferredCommunication;
      if (formData.stakeholders.feedbackStyle !== undefined) flatData.feedbackStyle = formData.stakeholders.feedbackStyle;
      if (formData.stakeholders.availability !== undefined) flatData.availability = formData.stakeholders.availability;
    }

    // Commercial
    if (formData.commercial) {
      if (formData.commercial.budgetComfort !== undefined) flatData.budgetComfort = formData.commercial.budgetComfort || null;
      if (formData.commercial.ongoingHelpLikelihood !== undefined) flatData.ongoingHelpLikelihood = formData.commercial.ongoingHelpLikelihood || null;
      if (formData.commercial.decisionTimeline !== undefined) flatData.decisionTimeline = formData.commercial.decisionTimeline || null;
      if (formData.commercial.objections !== undefined) flatData.objections = formData.commercial.objections || null;
      if (formData.commercial.previousExperience !== undefined) flatData.previousExperience = formData.commercial.previousExperience || null;
    }

    // Next Steps
    if (formData.nextSteps) {
      if (formData.nextSteps.kickoffTime !== undefined) flatData.kickoffTime = formData.nextSteps.kickoffTime || null;
      if (formData.nextSteps.expectedDeliveryDate !== undefined) flatData.expectedDeliveryDate = formData.nextSteps.expectedDeliveryDate || null;
      if (formData.nextSteps.clientWillSend !== undefined) flatData.clientWillSend = formData.nextSteps.clientWillSend || null;
      if (formData.nextSteps.willardWillSend !== undefined) flatData.willardWillSend = formData.nextSteps.willardWillSend || null;
    }

    let savedClient;

    if (clientId) {
      // Check if client exists and their current status
      const existingClient = await prisma.onboardingClient.findUnique({
        where: { clientId },
      });

      const updateData: any = {
        ...flatData,
        source: 'form', // Update source to indicate form completion
      };

      // If client was already approved, set status to 'updated'
      if (existingClient?.onboardingStatus === 'approved') {
        updateData.onboardingStatus = 'updated';
      }

      // Update existing client record
      savedClient = await prisma.onboardingClient.update({
        where: { clientId },
        data: updateData,
      });
    } else {
      // Create new client record (no pre-fill from Zapier)
      savedClient = await prisma.onboardingClient.create({
        data: {
          clientId: `form-${Date.now()}`, // Generate clientId for direct submissions
          ...flatData,
          source: 'form',
        },
      });
    }

    console.log('Onboarding form submitted:', savedClient.id);

    // Optional: Send notifications or webhooks
    // await sendToSlack(validatedData);
    // await sendEmailNotification(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Onboarding form submitted successfully',
        clientId: savedClient.clientId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing onboarding form:', error);

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
