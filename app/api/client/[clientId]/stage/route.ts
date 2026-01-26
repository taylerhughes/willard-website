import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const body = await request.json();
    const { pipelineStage } = body;

    // Validate pipeline stage
    const validStages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
    if (!validStages.includes(pipelineStage)) {
      return NextResponse.json(
        { error: 'Invalid pipeline stage' },
        { status: 400 }
      );
    }

    // Find the client to get the old stage
    const existingClient = await prisma.onboardingClient.findUnique({
      where: { clientId },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const oldStage = existingClient.pipelineStage;

    // Update the client's pipeline stage
    const updatedClient = await prisma.onboardingClient.update({
      where: { clientId },
      data: {
        pipelineStage,
        stageChangedAt: new Date(),
      },
    });

    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        clientId: existingClient.id,
        action: 'stage_changed',
        details: JSON.stringify({
          from: oldStage,
          to: pipelineStage,
        }),
        actor: 'System', // TODO: Replace with actual user when auth is implemented
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Error updating pipeline stage:', error);
    return NextResponse.json(
      { error: 'Failed to update pipeline stage' },
      { status: 500 }
    );
  }
}
