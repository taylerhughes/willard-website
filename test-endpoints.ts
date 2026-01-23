/**
 * Test script for Willard Mini Sprint Onboarding API endpoints
 * Run with: npx tsx test-endpoints.ts
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test data
const testClientId = `test-client-${Date.now()}`;
const testData = {
  clientId: testClientId,

  // Client Identity
  businessName: 'Acme Corporation',
  clientFullName: 'Jane Smith',
  roleTitle: 'Head of Product',
  email: 'jane@acme.com',
  linkedinUrl: 'https://linkedin.com/in/janesmith',
  timezone: 'EST',
  billingContact: 'billing@acme.com',

  // Sprint Definition
  sprintType: 'One screen/flow to ship',
  oneSentenceOutcome: 'a validated checkout flow ready to ship',
  successCriteria: 'Design approved, devs have specs, prototype clickable',
  nonNegotiables: 'Must use existing design system',
  outOfScope: 'Mobile app version',

  // Why Now
  triggerEvent: 'Just raised Series A funding',
  deadlineTiming: 'Need this by end of month',
  consequencesOfGettingItWrong: 'Engineering team will build wrong thing, waste 2 weeks',

  // Product Context
  productType: 'B2B',
  targetUser: 'Sales managers at mid-size B2B SaaS companies',
  currentState: 'MVP',
  buildCadence: 'Shipping weekly',
  stageFocus: 'Activation',

  // Decision + Risk
  keyDecision: 'Should we build a wizard flow or single-page form?',
  knowns: 'Users want this feature, we have the tech',
  unknowns: 'Not sure if users will understand this flow',
  topAssumptions: 'We assume users will complete form in one sitting',
  currentSignals: '5 user interviews, support tickets showing confusion',

  // Assets + Access
  websiteUrl: 'https://acme.com',
  productLink: 'https://app.acme.com',
  figmaLink: 'https://figma.com/file/abc123',
  brandGuidelines: 'https://acme.com/brand',
  designSystem: 'https://storybook.acme.com',
  docsLinks: 'Notion: https://notion.so/acme/product',
  analyticsTools: 'Google Analytics, PostHog',
  accessNeeded: 'Will need Figma editor access',

  // Stakeholders
  whoApproves: 'CEO and Head of Product',
  whoWillBuild: 'Internal engineering team (3 devs)',
  preferredCommunication: 'Slack',
  feedbackStyle: 'Async (Loom/video)',
  availability: 'Available for reviews 9am-5pm EST',

  // Commercial
  budgetComfort: 'Open to paying if this goes well',
  ongoingHelpLikelihood: 'If this works, we\'ll likely need 2-3 more sprints',
  decisionTimeline: 'Need to decide by end of month',
  objections: 'Worried about turnaround time',
  previousExperience: 'Worked with 2 freelancers before, not strategic enough',

  // Next Steps
  kickoffTime: 'Tomorrow 2pm EST',
  expectedDeliveryDate: 'Friday, Jan 31st',
  clientWillSend: 'Will send Figma file and PRD by EOD',
  willardWillSend: 'NDA, sprint brief template',
};

async function testZapierEndpoint() {
  console.log('\n🔵 Testing Zapier Webhook Endpoint (POST /api/zapier/client)');
  console.log('================================================');

  try {
    const response = await fetch(`${BASE_URL}/api/zapier/client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
      return data.clientId;
    } else {
      console.log('❌ FAILED:', response.status);
      console.log('Error:', JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.log('❌ ERROR:', error);
    return null;
  }
}

async function testClientFetchEndpoint(clientId: string) {
  console.log('\n🔵 Testing Client Fetch Endpoint (GET /api/client/[clientId])');
  console.log('================================================');

  try {
    const response = await fetch(`${BASE_URL}/api/client/${clientId}`);
    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS:', response.status);
      console.log('Client ID:', data.clientId);
      console.log('Source:', data.source);
      console.log('Business Name:', data.data.clientIdentity.businessName);
      console.log('Email:', data.data.clientIdentity.email);
      return true;
    } else {
      console.log('❌ FAILED:', response.status);
      console.log('Error:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ ERROR:', error);
    return false;
  }
}

async function testFormSubmissionEndpoint(clientId: string) {
  console.log('\n🔵 Testing Form Submission Endpoint (POST /api/onboarding)');
  console.log('================================================');

  const formData = {
    clientId,
    clientIdentity: {
      businessName: testData.businessName,
      clientFullName: testData.clientFullName,
      roleTitle: testData.roleTitle,
      email: testData.email,
      linkedinUrl: testData.linkedinUrl,
      timezone: testData.timezone,
      billingContact: testData.billingContact,
    },
    sprintDefinition: {
      sprintType: testData.sprintType,
      oneSentenceOutcome: testData.oneSentenceOutcome,
      successCriteria: testData.successCriteria,
      nonNegotiables: testData.nonNegotiables,
      outOfScope: testData.outOfScope,
    },
    whyNow: {
      triggerEvent: testData.triggerEvent,
      deadlineTiming: testData.deadlineTiming,
      consequencesOfGettingItWrong: testData.consequencesOfGettingItWrong,
    },
    productContext: {
      productType: testData.productType,
      targetUser: testData.targetUser,
      currentState: testData.currentState,
      buildCadence: testData.buildCadence,
      stageFocus: testData.stageFocus,
    },
    decisionRisk: {
      keyDecision: testData.keyDecision,
      knowns: testData.knowns,
      unknowns: testData.unknowns,
      topAssumptions: testData.topAssumptions,
      currentSignals: testData.currentSignals,
    },
    assetsAccess: {
      websiteUrl: testData.websiteUrl,
      productLink: testData.productLink,
      figmaLink: testData.figmaLink,
      brandGuidelines: testData.brandGuidelines,
      designSystem: testData.designSystem,
      docsLinks: testData.docsLinks,
      analyticsTools: testData.analyticsTools,
      accessNeeded: testData.accessNeeded,
    },
    stakeholders: {
      whoApproves: testData.whoApproves,
      whoWillBuild: testData.whoWillBuild,
      preferredCommunication: testData.preferredCommunication,
      feedbackStyle: testData.feedbackStyle,
      availability: testData.availability,
    },
    commercial: {
      budgetComfort: testData.budgetComfort,
      ongoingHelpLikelihood: testData.ongoingHelpLikelihood,
      decisionTimeline: testData.decisionTimeline,
      objections: testData.objections,
      previousExperience: testData.previousExperience,
    },
    nextSteps: {
      kickoffTime: testData.kickoffTime,
      expectedDeliveryDate: testData.expectedDeliveryDate,
      clientWillSend: testData.clientWillSend,
      willardWillSend: testData.willardWillSend,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/api/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ FAILED:', response.status);
      console.log('Error:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ ERROR:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Endpoint Tests');
  console.log('Base URL:', BASE_URL);
  console.log('Test Client ID:', testClientId);

  // Test 1: Create client via Zapier webhook
  const clientId = await testZapierEndpoint();

  if (!clientId) {
    console.log('\n❌ Cannot continue tests - Zapier endpoint failed');
    return;
  }

  // Wait a moment for database write
  await new Promise(resolve => setTimeout(resolve, 500));

  // Test 2: Fetch client data
  const fetchSuccess = await testClientFetchEndpoint(clientId);

  if (!fetchSuccess) {
    console.log('\n⚠️  Warning: Client fetch failed, but continuing...');
  }

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 500));

  // Test 3: Submit form (updates existing record)
  await testFormSubmissionEndpoint(clientId);

  console.log('\n✅ All tests completed!');
  console.log('\n📝 Next steps:');
  console.log(`   1. View form: ${BASE_URL}/mini-sprint?clientId=${clientId}`);
  console.log('   2. Check Supabase Studio to see the record');
}

// Run the tests
runTests().catch(console.error);
