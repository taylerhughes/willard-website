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

    const comments = await prisma.issueComment.findMany({
      where: { issueId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Serialize dates
    const serializedComments = comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
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

    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    // Verify issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Create comment
    const comment = await prisma.issueComment.create({
      data: {
        issueId,
        userId: dbUser.id,
        content: content.trim(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Create activity log
    await createIssueActivity(
      issueId,
      dbUser.id,
      'commented',
      { commentId: comment.id }
    );

    // Create notifications for relevant users (assignee and reporter, excluding commenter)
    const notifyUserIds = new Set<string>();
    if (issue.assigneeId && issue.assigneeId !== dbUser.id) {
      notifyUserIds.add(issue.assigneeId);
    }
    if (issue.reporterId && issue.reporterId !== dbUser.id) {
      notifyUserIds.add(issue.reporterId);
    }

    for (const userId of notifyUserIds) {
      await createNotification(
        userId,
        'comment',
        `${dbUser.name || dbUser.email} commented on ${issue.identifier}`,
        `Comment: ${comment.content.substring(0, 100)}`,
        issue.id
      );
    }

    // Serialize dates
    const serializedComment = {
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
