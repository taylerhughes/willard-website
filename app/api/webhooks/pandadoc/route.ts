import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapPandaDocStatus } from '@/lib/pandadoc';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('PandaDoc webhook received:', JSON.stringify(body, null, 2));

    // Extract event data
    const { event, data } = body;

    if (!event || !data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // We're interested in document state changes
    if (event === 'document_state_changed') {
      const documentId = data.id;
      const status = data.status;

      // Find account by document ID
      const account = await prisma.account.findFirst({
        where: { ndaDocumentId: documentId },
      });

      if (!account) {
        console.log(`No account found for document ID: ${documentId}`);
        return NextResponse.json({ message: 'Account not found' }, { status: 200 });
      }

      // Map PandaDoc status to our status
      const mappedStatus = mapPandaDocStatus(status);

      // Update account NDA status
      const updateData: any = {
        ndaStatus: mappedStatus,
      };

      // If document is completed/signed, set signed date
      if (mappedStatus === 'completed') {
        updateData.ndaSignedAt = new Date();
      }

      await prisma.account.update({
        where: { id: account.id },
        data: updateData,
      });

      console.log(
        `Updated account ${account.id} NDA status to ${mappedStatus}`
      );
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('Error processing PandaDoc webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
