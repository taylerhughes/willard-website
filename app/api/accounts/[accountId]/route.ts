import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

type Params = Promise<{ accountId: string }>;

// GET /api/accounts/[accountId] - Get single account
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await params;

    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        contacts: {
          orderBy: { createdAt: 'desc' },
        },
        projects: {
          include: {
            lead: {
              select: { id: true, name: true, email: true },
            },
            _count: {
              select: { issues: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        convertedFromLead: {
          select: {
            id: true,
            clientId: true,
            businessName: true,
            clientFullName: true,
            email: true,
          },
        },
        _count: {
          select: { projects: true, contacts: true },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    );
  }
}

// PATCH /api/accounts/[accountId] - Update account
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await params;
    const body = await request.json();
    const { name, industry, website, description, status } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (industry !== undefined) updateData.industry = industry?.trim() || null;
    if (website !== undefined) updateData.website = website?.trim() || null;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;

    const account = await prisma.account.update({
      where: { id: accountId },
      data: updateData,
      include: {
        _count: {
          select: { projects: true, contacts: true },
        },
        convertedFromLead: {
          select: {
            id: true,
            clientId: true,
            businessName: true,
            clientFullName: true,
          },
        },
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

// DELETE /api/accounts/[accountId] - Delete account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await params;

    await prisma.account.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
