import { z } from 'zod';

export const sprintTypes = [
  'One screen/flow to ship',
  'Decision de-risk pack',
  'UX teardown + quick wins',
] as const;

export const productTypes = ['B2B', 'B2C', 'Internal tool'] as const;

export const currentStates = ['Idea', 'MVP', 'V1', 'Scaling'] as const;

export const buildCadences = [
  'Shipping weekly',
  'Shipping monthly',
  'Chaotic',
] as const;

export const stageFocuses = [
  'Acquisition',
  'Activation',
  'Retention',
  'Monetisation',
] as const;

export const communicationPreferences = [
  'Slack',
  'Email',
  'WhatsApp',
  'Other',
] as const;

export const feedbackPreferences = [
  'Async (Loom/video)',
  'Live calls',
  'Written feedback',
] as const;

export const onboardingFormSchema = z.object({
  // 1) Client Identity
  clientIdentity: z.object({
    businessName: z.string().min(1, 'Business name is required'),
    clientFullName: z.string().min(1, 'Full name is required'),
    roleTitle: z.string().min(1, 'Role/title is required'),
    email: z.string().email('Valid email is required'),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    timezone: z.string().min(1, 'Timezone is required'),
    billingContact: z.string().optional(),
  }),

  // 2) Sprint Definition
  sprintDefinition: z.object({
    sprintType: z.enum(sprintTypes),
    oneSentenceOutcome: z
      .string()
      .min(10, 'Please describe the outcome (min 10 characters)'),
    successCriteria: z
      .string()
      .min(10, 'Please define what "done" means'),
    nonNegotiables: z.string().optional(),
    outOfScope: z.string().optional(),
  }),

  // 3) Why Now
  whyNow: z.object({
    triggerEvent: z
      .string()
      .min(5, 'Please describe the trigger event'),
    deadlineTiming: z.string().min(3, 'Deadline/timing is required'),
    consequencesOfGettingItWrong: z
      .string()
      .min(10, 'Please describe the consequences'),
  }),

  // 4) Product Context
  productContext: z.object({
    productType: z.enum(productTypes),
    targetUser: z.string().min(5, 'Please describe the target user'),
    currentState: z.enum(currentStates),
    buildCadence: z.enum(buildCadences),
    stageFocus: z.enum(stageFocuses),
  }),

  // 5) Decision + Risk
  decisionRisk: z.object({
    keyDecision: z.string().min(10, 'Please describe the key decision'),
    knowns: z.string().min(5, 'What are you confident about?'),
    unknowns: z.string().min(5, 'What are you uncertain about?'),
    topAssumptions: z.string().min(5, 'What are your key assumptions?'),
    currentSignals: z.string().optional(),
  }),

  // 6) Assets + Access
  assetsAccess: z.object({
    websiteUrl: z.string().url().optional().or(z.literal('')),
    productLink: z.string().url().optional().or(z.literal('')),
    figmaLink: z.string().url().optional().or(z.literal('')),
    brandGuidelines: z.string().url().optional().or(z.literal('')),
    designSystem: z.string().url().optional().or(z.literal('')),
    docsLinks: z.string().optional(),
    analyticsTools: z.string().optional(),
    accessNeeded: z.string().optional(),
  }),

  // 7) Stakeholders + Working Style
  stakeholders: z.object({
    whoApproves: z.string().min(3, 'Who will approve the work?'),
    whoWillBuild: z.string().min(3, 'Who will build it?'),
    preferredCommunication: z.enum(communicationPreferences),
    feedbackStyle: z.enum(feedbackPreferences),
    availability: z
      .string()
      .min(5, 'Please describe your availability/review windows'),
  }),

  // 8) Commercial + Conversion Signals
  commercial: z.object({
    budgetComfort: z.string().optional(),
    ongoingHelpLikelihood: z.string().optional(),
    decisionTimeline: z.string().optional(),
    objections: z.string().optional(),
    previousExperience: z.string().optional(),
  }),

  // 9) Next Steps
  nextSteps: z.object({
    kickoffTime: z.string().optional(),
    expectedDeliveryDate: z.string().optional(),
    clientWillSend: z.string().optional(),
    willardWillSend: z.string().optional(),
  }),
});

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;
