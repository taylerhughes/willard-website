# Willard Mini Sprint Onboarding Setup

This document explains how to set up the database for the Willard Mini Sprint onboarding system.

## Database Setup

### Option 1: Vercel Postgres (Recommended for Production)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the **Storage** tab
4. Click **Create Database** → **Postgres**
5. Follow the setup wizard
6. Once created, click on your database
7. Go to the **`.env.local`** tab
8. Copy the `DATABASE_URL` value
9. Paste it into your local `.env.local` file

### Option 2: Local PostgreSQL (For Development)

1. Install PostgreSQL on your machine
2. Create a new database:
   ```bash
   createdb willard
   ```
3. Update `.env.local` with your local connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/willard?schema=public"
   ```

## Running Migrations

Once you have your `DATABASE_URL` set up in `.env.local`, run:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database tables based on your Prisma schema
- Generate the Prisma Client

## Zapier Integration

### Webhook Endpoint

Zapier should send POST requests to:
```
https://your-domain.com/api/zapier/client
```

### Required Payload

At minimum, Zapier must send:
```json
{
  "clientId": "unique-client-identifier"
}
```

### Optional Fields

Any of the following fields can be included to pre-populate the form:

**Client Identity:**
- `businessName`
- `clientFullName`
- `roleTitle`
- `email`
- `linkedinUrl`
- `timezone`
- `billingContact`

**Sprint Definition:**
- `sprintType`
- `oneSentenceOutcome`
- `successCriteria`
- `nonNegotiables`
- `outOfScope`

**Why Now:**
- `triggerEvent`
- `deadlineTiming`
- `consequencesOfGettingItWrong`

**Product Context:**
- `productType`
- `targetUser`
- `currentState`
- `buildCadence`
- `stageFocus`

**Decision + Risk:**
- `keyDecision`
- `knowns`
- `unknowns`
- `topAssumptions`
- `currentSignals`

**Assets + Access:**
- `websiteUrl`
- `productLink`
- `figmaLink`
- `brandGuidelines`
- `designSystem`
- `docsLinks`
- `analyticsTools`
- `accessNeeded`

**Stakeholders:**
- `whoApproves`
- `whoWillBuild`
- `preferredCommunication`
- `feedbackStyle`
- `availability`

**Commercial:**
- `budgetComfort`
- `ongoingHelpLikelihood`
- `decisionTimeline`
- `objections`
- `previousExperience`

**Next Steps:**
- `kickoffTime`
- `expectedDeliveryDate`
- `clientWillSend`
- `willardWillSend`

### Example Zapier Payload

```json
{
  "clientId": "client-123",
  "businessName": "Acme Inc",
  "clientFullName": "Jane Smith",
  "roleTitle": "Head of Product",
  "email": "jane@acme.com",
  "timezone": "EST",
  "sprintType": "One screen/flow to ship",
  "oneSentenceOutcome": "a validated checkout flow ready to ship",
  "triggerEvent": "Just raised Series A",
  "productType": "B2B"
}
```

## Using the Form

### Pre-populated Form

Once Zapier creates a client record, send the user to:
```
https://your-domain.com/mini-sprint?clientId=client-123
```

The form will automatically:
1. Fetch the client data
2. Pre-populate all fields
3. Show a loading state while fetching
4. When submitted, UPDATE the existing record

### Direct Form Submission

Users can also go directly to:
```
https://your-domain.com/mini-sprint
```

This will:
1. Show an empty form
2. When submitted, CREATE a new record
3. Generate a new `clientId` automatically

## API Endpoints

### POST `/api/zapier/client`
- **Purpose:** Zapier webhook to create pre-filled client records
- **Auth:** None (can be added later)
- **Body:** JSON with clientId + optional form fields
- **Response:**
  - `201` - Client created successfully
  - `409` - Client ID already exists
  - `400` - Validation error

### GET `/api/client/[clientId]`
- **Purpose:** Fetch client data for pre-populating form
- **Response:**
  - `200` - Returns form data structure
  - `404` - Client not found

### POST `/api/onboarding`
- **Purpose:** Handle form submission
- **Behavior:**
  - If `clientId` provided: UPDATE existing record
  - If no `clientId`: CREATE new record
- **Response:**
  - `200` - Form submitted successfully

## Environment Variables

Required in `.env.local`:

```bash
DATABASE_URL="postgresql://..."
```

For Vercel deployment, add the same variables in your Vercel project settings.

## Troubleshooting

### "Client not found" error
- Verify the clientId in the URL matches a record in the database
- Check that Zapier successfully created the record

### Database connection errors
- Verify your `DATABASE_URL` is correct
- Make sure the database exists
- Check that migrations have been run

### Form not pre-populating
- Open browser console to check for errors
- Verify the API endpoint is accessible
- Check that the clientId URL parameter is correct
