import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const contractUpdateSchema = z.object({
  status: z.enum(['not_sent', 'sent', 'signed']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const body = await request.json();
    const { status } = contractUpdateSchema.parse(body);

    // Find the client
    const client = await prisma.onboardingClient.findUnique({
      where: { clientId },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    // Prepare update data based on status
    const updateData: {
      contractStatus: string;
      contractSentAt?: Date;
      contractSignedAt?: Date;
    } = {
      contractStatus: status,
    };

    if (status === 'sent' && !client.contractSentAt) {
      updateData.contractSentAt = new Date();
    }

    if (status === 'signed') {
      updateData.contractSignedAt = new Date();
      if (!client.contractSentAt) {
        updateData.contractSentAt = new Date();
      }
    }

    // Update contract status
    const updatedClient = await prisma.onboardingClient.update({
      where: { clientId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Contract status updated to ${status}`,
      client: updatedClient,
    });
  } catch (error) {
    console.error('Error updating contract status:', error);

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
        message: 'Failed to update contract status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
