import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    console.log('Starting client migration...');

    // Get all clients
    const allClients = await prisma.onboardingClient.findMany({
      select: {
        id: true,
        clientId: true,
        pipelineStage: true,
        stageChangedAt: true,
        createdAt: true,
      },
    });

    console.log(`Found ${allClients.length} total clients`);

    let updatedCount = 0;

    // Update each client individually if needed
    for (const client of allClients) {
      const needsUpdate = !client.stageChangedAt;

      if (needsUpdate) {
        await prisma.onboardingClient.update({
          where: { id: client.id },
          data: {
            stageChangedAt: client.createdAt, // Use creation date as initial stage change
          },
        });
        updatedCount++;
        console.log(`Updated client ${client.clientId} - set stageChangedAt`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} clients`,
      totalClients: allClients.length,
      updatedClients: updatedCount,
    });
  } catch (error) {
    console.error('Error migrating clients:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
