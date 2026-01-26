import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { getOrCreateUser } from '@/lib/pm/helpers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      include: {
        lead: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        client: {
          select: { id: true, clientId: true, businessName: true, clientFullName: true },
        },
        _count: {
          select: { issues: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Serialize dates
    const serializedProjects = projects.map((project) => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      targetStartDate: project.targetStartDate?.toISOString() || null,
      targetEndDate: project.targetEndDate?.toISOString() || null,
    }));

    return NextResponse.json(serializedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrCreateUser(user.id, user.email || '');
    const body = await request.json();

    const {
      name,
      description,
      color,
      icon,
      leadId,
      accountId,
      clientId,
      targetStartDate,
      targetEndDate,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#6366f1',
        icon: icon || null,
        leadId: leadId || dbUser.id,
        accountId: accountId || null,
        clientId: clientId || null,
        targetStartDate: targetStartDate ? new Date(targetStartDate) : null,
        targetEndDate: targetEndDate ? new Date(targetEndDate) : null,
        status: 'active',
        health: 'on_track',
      },
      include: {
        lead: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        client: {
          select: { id: true, clientId: true, businessName: true, clientFullName: true },
        },
        _count: {
          select: { issues: true },
        },
      },
    });

    // Serialize dates
    const serializedProject = {
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      targetStartDate: project.targetStartDate?.toISOString() || null,
      targetEndDate: project.targetEndDate?.toISOString() || null,
    };

    return NextResponse.json(serializedProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
