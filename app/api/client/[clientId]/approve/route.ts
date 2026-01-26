import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { createIssueActivity } from '@/lib/pm/helpers';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { clientId } = await context.params;

    // Update client status to approved
    const updatedClient = await prisma.onboardingClient.update({
      where: { clientId },
      data: {
        onboardingStatus: 'approved',
        approvedAt: new Date(),
        approvedBy: user.email || 'Admin',
      },
    });

    // Get the user record for activity logging
    const userRecord = await prisma.user.findFirst({
      where: { email: user.email || undefined },
    });

    // Auto-complete the onboarding review issues
    const onboardingLabel = await prisma.label.findFirst({
      where: { name: 'onboarding' },
    });

    if (onboardingLabel && userRecord) {
      // Find all open onboarding issues for this client
      const openIssues = await prisma.issue.findMany({
        where: {
          clientId: updatedClient.id,
          status: { in: ['todo', 'in_progress', 'backlog'] },
          labels: {
            some: {
              labelId: onboardingLabel.id,
            },
          },
        },
      });

      // Complete each issue
      for (const issue of openIssues) {
        await prisma.issue.update({
          where: { id: issue.id },
          data: {
            status: 'done',
            completedAt: new Date(),
          },
        });

        // Create activity for the completion
        await createIssueActivity(issue.id, userRecord.id, 'status_changed', {
          from: issue.status,
          to: 'done',
          trigger: 'client_approved',
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Client onboarding approved successfully',
        client: updatedClient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error approving client:', error);
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
