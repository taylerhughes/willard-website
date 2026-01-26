import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

// GET /api/accounts - List all accounts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await prisma.account.findMany({
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Create new account
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, industry, website, description, status } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Account name is required' },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: {
        name: name.trim(),
        industry: industry?.trim() || null,
        website: website?.trim() || null,
        description: description?.trim() || null,
        status: status || 'active',
      },
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

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
