import { prisma } from '../lib/db';

async function migrateExistingClients() {
  try {
    console.log('Starting migration of existing clients...');

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

    console.log(`✅ Successfully updated ${updatedCount} clients`);
    console.log('Migration complete!');
  } catch (error) {
    console.error('Error migrating clients:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateExistingClients();
