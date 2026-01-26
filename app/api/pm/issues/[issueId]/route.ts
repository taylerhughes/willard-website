import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { getOrCreateUser, createIssueActivity, createNotification } from '@/lib/pm/helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { issueId } = await params;

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
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
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Serialize dates
    const serializedIssue = {
      ...issue,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      dueDate: issue.dueDate?.toISOString() || null,
      completedAt: issue.completedAt?.toISOString() || null,
    };

    return NextResponse.json(serializedIssue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrCreateUser(user.id, user.email || '');
    const { issueId } = await params;
    const body = await request.json();

    const {
      title,
      description,
      status,
      priority,
      assigneeId,
      projectId,
      cycleId,
      clientId,
      accountId,
      dueDate,
      estimate,
    } = body;

    // Fetch current issue to detect changes
    const currentIssue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        assignee: true,
      },
    });

    if (!currentIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Build update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (estimate !== undefined) updateData.estimate = estimate;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    // Handle assignee using nested relation syntax
    if (assigneeId !== undefined) {
      if (assigneeId) {
        updateData.assignee = { connect: { id: assigneeId } };
      } else {
        updateData.assignee = { disconnect: true };
      }
    }

    // Handle project using nested relation syntax
    if (projectId !== undefined) {
      if (projectId) {
        updateData.project = { connect: { id: projectId } };
      } else {
        updateData.project = { disconnect: true };
      }
    }

    // Handle cycle using nested relation syntax
    if (cycleId !== undefined) {
      if (cycleId) {
        updateData.cycle = { connect: { id: cycleId } };
      } else {
        updateData.cycle = { disconnect: true };
      }
    }

    // Handle client and account (mutually exclusive) using nested relation syntax
    if (clientId !== undefined) {
      if (clientId) {
        updateData.client = { connect: { id: clientId } };
        updateData.account = { disconnect: true };
      } else {
        updateData.client = { disconnect: true };
      }
    }

    if (accountId !== undefined) {
      if (accountId) {
        updateData.account = { connect: { id: accountId } };
        updateData.client = { disconnect: true };
      } else {
        updateData.account = { disconnect: true };
      }
    }

    // Handle completion
    if (status === 'done' && currentIssue.status !== 'done') {
      updateData.completedAt = new Date();
    } else if (status !== 'done' && currentIssue.status === 'done') {
      updateData.completedAt = null;
    }

    // Update issue
    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: updateData,
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
    });

    // Create activity logs for changes
    if (status !== undefined && status !== currentIssue.status) {
      await createIssueActivity(
        issue.id,
        dbUser.id,
        'status_changed',
        { from: currentIssue.status, to: status }
      );
    }

    if (assigneeId !== undefined && assigneeId !== currentIssue.assigneeId) {
      await createIssueActivity(
        issue.id,
        dbUser.id,
        'assigned',
        { from: currentIssue.assigneeId, to: assigneeId }
      );

      // Create notification for new assignee
      if (assigneeId && assigneeId !== dbUser.id) {
        await createNotification(
          assigneeId,
          'assigned',
          `You were assigned to ${issue.identifier}`,
          issue.title,
          issue.id
        );
      }
    }

    if (priority !== undefined && priority !== currentIssue.priority) {
      await createIssueActivity(
        issue.id,
        dbUser.id,
        'priority_changed',
        { from: currentIssue.priority, to: priority }
      );
    }

    // Serialize dates
    const serializedIssue = {
      ...issue,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      dueDate: issue.dueDate?.toISOString() || null,
      completedAt: issue.completedAt?.toISOString() || null,
    };

    return NextResponse.json(serializedIssue);
  } catch (error) {
    console.error('Error updating issue:', error);
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { issueId } = await params;

    await prisma.issue.delete({
      where: { id: issueId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
