import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { generateIssueIdentifier, getOrCreateUser, createIssueActivity } from '@/lib/pm/helpers';

// GET /api/pm/issues - List issues with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assigneeId = searchParams.get('assigneeId');
    const projectId = searchParams.get('projectId');
    const cycleId = searchParams.get('cycleId');
    const clientId = searchParams.get('clientId');
    const accountId = searchParams.get('accountId');
    const search = searchParams.get('search');

    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;
    if (projectId) where.projectId = projectId;
    if (cycleId) where.cycleId = cycleId;
    if (clientId) where.clientId = clientId;
    if (accountId) where.accountId = accountId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { identifier: { contains: search, mode: 'insensitive' } },
      ];
    }

    const issues = await prisma.issue.findMany({
      where,
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        reporter: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        project: {
          select: { id: true, name: true, color: true, icon: true },
        },
        cycle: {
          select: { id: true, name: true },
        },
        client: {
          select: { id: true, clientId: true, businessName: true, clientFullName: true },
        },
        account: {
          select: { id: true, name: true },
        },
        labels: {
          include: {
            label: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Serialize dates
    const serializedIssues = issues.map((issue) => ({
      ...issue,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      dueDate: issue.dueDate?.toISOString() || null,
      completedAt: issue.completedAt?.toISOString() || null,
    }));

    return NextResponse.json(serializedIssues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

// POST /api/pm/issues - Create new issue
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in our database
    const dbUser = await getOrCreateUser(user.id, user.email || '');

    const body = await request.json();
    const {
      title,
      description,
      status = 'backlog',
      priority = 'none',
      assigneeId,
      projectId,
      cycleId,
      clientId,
      accountId,
      estimate,
      dueDate,
      labelIds = [],
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Generate unique identifier
    const identifier = await generateIssueIdentifier();

    // Create issue
    const issue = await prisma.issue.create({
      data: {
        identifier,
        title,
        description,
        status,
        priority,
        assigneeId,
        reporterId: dbUser.id,
        projectId,
        cycleId,
        clientId,
        accountId,
        estimate,
        dueDate: dueDate ? new Date(dueDate) : null,
        labels: {
          create: labelIds.map((labelId: string) => ({
            labelId,
          })),
        },
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        reporter: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        project: {
          select: { id: true, name: true, color: true },
        },
        labels: {
          include: { label: true },
        },
      },
    });

    // Create activity log
    await createIssueActivity(issue.id, dbUser.id, 'created', {
      title: issue.title,
    });

    // Create notification for assignee if assigned to someone else
    if (assigneeId && assigneeId !== dbUser.id) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          type: 'assigned',
          title: 'New issue assigned',
          message: `${dbUser.name || dbUser.email} assigned you to ${issue.identifier}: ${issue.title}`,
          issueId: issue.id,
        },
      });
    }

    // Serialize dates
    const serializedIssue = {
      ...issue,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      dueDate: issue.dueDate?.toISOString() || null,
      completedAt: issue.completedAt?.toISOString() || null,
    };

    return NextResponse.json(serializedIssue, { status: 201 });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    );
  }
}
