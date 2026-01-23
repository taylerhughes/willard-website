import { NextRequest, NextResponse } from 'next/server';
import { onboardingFormSchema } from '@/types/onboarding';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Extended schema to include optional clientId
const submissionSchema = onboardingFormSchema.extend({
  clientId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data
    const validatedData = submissionSchema.parse(body);
    const { clientId, ...formData } = validatedData;

    // Flatten the nested form data structure for database storage
    const flatData = {
      // Client Identity
      businessName: formData.clientIdentity.businessName,
      clientFullName: formData.clientIdentity.clientFullName,
      roleTitle: formData.clientIdentity.roleTitle,
      email: formData.clientIdentity.email,
      linkedinUrl: formData.clientIdentity.linkedinUrl || null,
      timezone: formData.clientIdentity.timezone,
      billingContact: formData.clientIdentity.billingContact || null,

      // Sprint Definition
      sprintType: formData.sprintDefinition.sprintType,
      oneSentenceOutcome: formData.sprintDefinition.oneSentenceOutcome,
      successCriteria: formData.sprintDefinition.successCriteria,
      nonNegotiables: formData.sprintDefinition.nonNegotiables || null,
      outOfScope: formData.sprintDefinition.outOfScope || null,

      // Why Now
      triggerEvent: formData.whyNow.triggerEvent,
      deadlineTiming: formData.whyNow.deadlineTiming,
      consequencesOfGettingItWrong: formData.whyNow.consequencesOfGettingItWrong,

      // Product Context
      productType: formData.productContext.productType,
      targetUser: formData.productContext.targetUser,
      currentState: formData.productContext.currentState,
      buildCadence: formData.productContext.buildCadence,
      stageFocus: formData.productContext.stageFocus,

      // Decision Risk
      keyDecision: formData.decisionRisk.keyDecision,
      knowns: formData.decisionRisk.knowns,
      unknowns: formData.decisionRisk.unknowns,
      topAssumptions: formData.decisionRisk.topAssumptions,
      currentSignals: formData.decisionRisk.currentSignals || null,

      // Assets Access
      websiteUrl: formData.assetsAccess.websiteUrl || null,
      productLink: formData.assetsAccess.productLink || null,
      figmaLink: formData.assetsAccess.figmaLink || null,
      brandGuidelines: formData.assetsAccess.brandGuidelines || null,
      designSystem: formData.assetsAccess.designSystem || null,
      docsLinks: formData.assetsAccess.docsLinks || null,
      analyticsTools: formData.assetsAccess.analyticsTools || null,
      accessNeeded: formData.assetsAccess.accessNeeded || null,

      // Stakeholders
      whoApproves: formData.stakeholders.whoApproves,
      whoWillBuild: formData.stakeholders.whoWillBuild,
      preferredCommunication: formData.stakeholders.preferredCommunication,
      feedbackStyle: formData.stakeholders.feedbackStyle,
      availability: formData.stakeholders.availability,

      // Commercial
      budgetComfort: formData.commercial.budgetComfort || null,
      ongoingHelpLikelihood: formData.commercial.ongoingHelpLikelihood || null,
      decisionTimeline: formData.commercial.decisionTimeline || null,
      objections: formData.commercial.objections || null,
      previousExperience: formData.commercial.previousExperience || null,

      // Next Steps
      kickoffTime: formData.nextSteps.kickoffTime || null,
      expectedDeliveryDate: formData.nextSteps.expectedDeliveryDate || null,
      clientWillSend: formData.nextSteps.clientWillSend || null,
      willardWillSend: formData.nextSteps.willardWillSend || null,
    };

    let savedClient;

    if (clientId) {
      // Update existing client record
      savedClient = await prisma.onboardingClient.update({
        where: { clientId },
        data: {
          ...flatData,
          source: 'form', // Update source to indicate form completion
        },
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
