import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

// POST /api/accounts/convert-lead - Convert a lead to an account
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, accountName, industry, website, description } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Check if lead exists
    const lead = await prisma.onboardingClient.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check if lead is already converted
    const existingAccount = await prisma.account.findUnique({
      where: { convertedFromLeadId: leadId },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Lead has already been converted to an account' },
        { status: 400 }
      );
    }

    // Create account from lead
    const account = await prisma.account.create({
      data: {
        name: accountName || lead.businessName || lead.clientFullName || 'Unnamed Account',
        industry: industry?.trim() || null,
        website: website?.trim() || lead.websiteUrl || null,
        description: description?.trim() || null,
        status: 'active',
        convertedFromLeadId: leadId,
        convertedAt: new Date(),
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

    // Create primary contact from lead if we have contact info
    if (lead.clientFullName || lead.email) {
      const nameParts = (lead.clientFullName || lead.email || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await prisma.contact.create({
        data: {
          accountId: account.id,
          firstName,
          lastName,
          email: lead.email || null,
          role: lead.roleTitle || null,
          isPrimary: true,
        },
      });
    }

    // Log activity on the lead
    await prisma.activityLog.create({
      data: {
        clientId: leadId,
        action: 'converted_to_account',
        details: JSON.stringify({ accountId: account.id, accountName: account.name }),
        actor: user.email || 'System',
      },
    });

    // Update lead's pipeline stage to closed_won
    await prisma.onboardingClient.update({
      where: { id: leadId },
      data: { pipelineStage: 'closed_won', stageChangedAt: new Date() },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error converting lead to account:', error);
    return NextResponse.json(
      { error: 'Failed to convert lead to account' },
      { status: 500 }
    );
  }
}
