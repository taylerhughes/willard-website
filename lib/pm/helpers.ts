import { prisma } from '@/lib/db';
import { ISSUE_PREFIX } from './constants';

/**
 * Generate next issue identifier (e.g., "WIL-123")
 */
export async function generateIssueIdentifier(): Promise<string> {
  // Get the last issue to determine the next number
  const lastIssue = await prisma.issue.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { identifier: true },
  });

  let nextNumber = 1;
  if (lastIssue && lastIssue.identifier) {
    const match = lastIssue.identifier.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0]) + 1;
    }
  }

  return `${ISSUE_PREFIX}-${nextNumber}`;
}

/**
 * Get or create user from Supabase auth
 */
export async function getOrCreateUser(supabaseId: string, email: string, name?: string) {
  let user = await prisma.user.findUnique({
    where: { supabaseId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        supabaseId,
        email,
        name: name || email.split('@')[0],
        role: 'member', // Default role
      },
    });
  }

  return user;
}

/**
 * Create issue activity log
 */
export async function createIssueActivity(
  issueId: string,
  userId: string | null,
  action: string,
  details?: Record<string, any>
) {
  await prisma.issueActivity.create({
    data: {
      issueId,
      userId,
      action,
      details: details ? JSON.stringify(details) : null,
    },
  });
}

/**
 * Create notification for user
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message?: string,
  issueId?: string
) {
  await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      issueId,
    },
  });
}

/**
 * Generate cycle name (e.g., "Cycle 12")
 */
export async function generateCycleName(): Promise<string> {
  const cycleCount = await prisma.cycle.count();
  return `Cycle ${cycleCount + 1}`;
}

/**
 * Calculate project progress (completed issues / total issues)
 */
export async function getProjectProgress(projectId: string): Promise<{
  total: number;
  completed: number;
  percentage: number;
}> {
  const [total, completed] = await Promise.all([
    prisma.issue.count({
      where: { projectId },
    }),
    prisma.issue.count({
      where: {
        projectId,
        status: 'done',
      },
    }),
  ]);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percentage };
}

/**
 * Calculate cycle progress
 */
export async function getCycleProgress(cycleId: string): Promise<{
  total: number;
  completed: number;
  totalPoints: number;
  completedPoints: number;
  percentage: number;
}> {
  const issues = await prisma.issue.findMany({
    where: { cycleId },
    select: { status: true, estimate: true },
  });

  const total = issues.length;
  const completed = issues.filter((i) => i.status === 'done').length;
  const totalPoints = issues.reduce((sum, i) => sum + (i.estimate || 0), 0);
  const completedPoints = issues
    .filter((i) => i.status === 'done')
    .reduce((sum, i) => sum + (i.estimate || 0), 0);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, totalPoints, completedPoints, percentage };
}

/**
 * Check if user can edit issue
 */
export function canEditIssue(userRole: string, issue: { reporterId?: string | null; assigneeId?: string | null }, userId: string): boolean {
  if (userRole === 'admin') return true;
  if (userRole === 'viewer') return false;

  // Members can edit issues they created or are assigned to
  return issue.reporterId === userId || issue.assigneeId === userId;
}

/**
 * Format relative time (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString();
}
