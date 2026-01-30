import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { generateAccessToken } from '@/lib/access-token';
import { sendOnboardingLink } from '@/lib/email';

/**
 * Send onboarding form link to client via email
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { clientId } = await params;

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

    // Validate client has email
    if (!client.email) {
      return NextResponse.json(
        { error: 'Client email not found. Please add an email address first.' },
        { status: 400 }
      );
    }

    // Generate access token for the client (7-day expiration)
    const token = await generateAccessToken(clientId);

    // Get client name for email
    const clientName = client.clientFullName || client.businessName || 'there';

    // Send email
    const result = await sendOnboardingLink({
      to: client.email,
      clientName,
      clientId,
      token,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: `Failed to send email: ${result.error}` },
        { status: 500 }
      );
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        clientId: client.id,
        action: 'onboarding_link_sent',
        details: JSON.stringify({
          email: client.email,
          sentBy: user.email || user.id,
        }),
        actor: user.email || user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Onboarding link sent to ${client.email}`,
    });
  } catch (error) {
    console.error('Error sending onboarding link:', error);
    return NextResponse.json(
      { error: 'Failed to send onboarding link' },
      { status: 500 }
    );
  }
}
