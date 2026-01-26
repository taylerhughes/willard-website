import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

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
    const { firstName, lastName, email, phone, role, isPrimary } = body;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Check if account exists
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // If setting this contact as primary, unset other primary contacts
    if (isPrimary === true) {
      await prisma.contact.updateMany({
        where: { accountId },
        data: { isPrimary: false },
      });
    }

    // Create the contact
    const contact = await prisma.contact.create({
      data: {
        accountId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        role: role?.trim() || null,
        isPrimary: isPrimary || false,
      },
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create contact' },
      { status: 500 }
    );
  }
}
