import { prisma } from '@/lib/db';

export type AccessAction = 'view' | 'edit' | 'submit';

/**
 * Log client form access for security auditing
 */
export async function logAccess(
  clientId: string,
  action: AccessAction,
  request: Request
): Promise<void> {
  try {
    // Extract IP address from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    const ipAddress = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';

    // Extract user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get the OnboardingClient's internal ID from clientId
    const client = await prisma.onboardingClient.findUnique({
      where: { clientId },
      select: { id: true },
    });

    if (!client) {
      console.error(`Cannot log access: Client not found with clientId=${clientId}`);
      return;
    }

    // Create access log entry
    await prisma.accessLog.create({
      data: {
        clientId: client.id,
        action,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Don't fail requests if logging fails
    console.error('Failed to log access:', error);
  }
}

/**
 * Get access logs for a client
 */
export async function getAccessLogs(clientId: string, limit: number = 50) {
  // Get the OnboardingClient's internal ID from clientId
  const client = await prisma.onboardingClient.findUnique({
    where: { clientId },
    select: { id: true },
  });

  if (!client) {
    return [];
  }

  const logs = await prisma.accessLog.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return logs;
}
