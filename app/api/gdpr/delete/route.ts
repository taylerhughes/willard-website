import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const deleteRequestSchema = z.object({
  clientId: z.string(),
  email: z.string().email(),
});

/**
 * GDPR Data Deletion Request
 * Allows clients to request deletion of their personal data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = deleteRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { clientId, email } = validation.data;

    // Find the client
    const client = await prisma.onboardingClient.findUnique({
      where: { clientId },
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

    // Delete all related data (cascading deletes are handled by Prisma schema)
    // This will delete: notes, activityLogs, accessTokens, accessLogs, consentLogs
    await prisma.onboardingClient.delete({
      where: { clientId },
    });

    // Log the deletion (if needed for compliance)
    console.log(`GDPR deletion request processed for client: ${clientId}, email: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Your data has been successfully deleted from our systems.',
    });
  } catch (error) {
    console.error('Error processing deletion request:', error);
    return NextResponse.json(
      { error: 'Failed to process deletion request' },
      { status: 500 }
    );
  }
}
