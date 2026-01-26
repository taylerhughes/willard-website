import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { createNDADocument, sendDocument } from '@/lib/pandadoc';

type Params = Promise<{ accountId: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await params;
    const body = await request.json();
    const { contactId } = body;

    // Get account
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Check if NDA already sent
    if (account.ndaStatus && account.ndaStatus !== 'not_sent') {
      return NextResponse.json(
        { error: 'NDA has already been sent to this account' },
        { status: 400 }
      );
    }

    // Get the specified contact or fall back to primary contact
    let contact;
    if (contactId) {
      contact = await prisma.contact.findFirst({
        where: {
          id: contactId,
          accountId: accountId,
        },
      });

      if (!contact) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        );
      }
    } else {
      // Fall back to primary contact if no contactId specified
      contact = await prisma.contact.findFirst({
        where: {
          accountId: accountId,
          isPrimary: true,
        },
      });

      if (!contact) {
        return NextResponse.json(
          { error: 'Account must have a primary contact' },
          { status: 400 }
        );
      }
    }

    // Validate contact has email
    if (!contact.email) {
      return NextResponse.json(
        { error: 'Selected contact must have an email address' },
        { status: 400 }
      );
    }

    // Create NDA document in PandaDoc
    const document = await createNDADocument({
      accountName: account.name,
      contactFirstName: contact.firstName,
      contactLastName: contact.lastName,
      contactEmail: contact.email,
      accountWebsite: account.website || undefined,
      accountIndustry: account.industry || undefined,
    });

    // Send the document
    await sendDocument(
      document.id,
      `NDA for ${account.name}`,
      `Hi ${contact.firstName}, please review and sign the attached Non-Disclosure Agreement for ${account.name}.`
    );

    // Update account with NDA info
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        ndaStatus: 'sent',
        ndaSentAt: new Date(),
        ndaDocumentId: document.id,
        ndaDocumentUrl: `https://app.pandadoc.com/a/#/documents/${document.id}`,
      },
      include: {
        contacts: true,
        projects: true,
        _count: {
          select: {
            projects: true,
            contacts: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'NDA sent successfully',
      account: updatedAccount,
      documentId: document.id,
    });
  } catch (error: any) {
    console.error('Error sending NDA:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send NDA' },
      { status: 500 }
    );
  }
}
