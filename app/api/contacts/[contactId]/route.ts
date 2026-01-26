import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

type Params = Promise<{ contactId: string }>;

// This file handles individual contact operations (PATCH/DELETE)
// For creating new contacts, see /app/api/accounts/[accountId]/contacts/route.ts

export async function PATCH(
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

    const { contactId } = await params;
    const body = await request.json();
    const { firstName, lastName, email, phone, role, isPrimary } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (email !== undefined) updateData.email = email?.trim() || null;
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (role !== undefined) updateData.role = role?.trim() || null;
    if (isPrimary !== undefined) updateData.isPrimary = isPrimary;

    // Validate required fields
    if (updateData.firstName === '') {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }
    if (updateData.lastName === '') {
      return NextResponse.json(
        { error: 'Last name is required' },
        { status: 400 }
      );
    }

    // Get the contact first to check it exists and get accountId
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: { accountId: true },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // If setting this contact as primary, unset other primary contacts in the same account
    if (updateData.isPrimary === true) {
      await prisma.contact.updateMany({
        where: {
          accountId: existingContact.accountId,
          id: { not: contactId },
        },
        data: { isPrimary: false },
      });
    }

    // Update the contact
    const contact = await prisma.contact.update({
      where: { id: contactId },
      data: updateData,
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { contactId } = await params;

    // Delete the contact
    await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
