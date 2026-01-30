import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Token expiration: 7 days
const TOKEN_EXPIRATION = '7d';
const TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface AccessTokenPayload {
  clientId: string;
  type: 'onboarding_access';
}

/**
 * Generate a new access token for a client
 */
export async function generateAccessToken(clientId: string): Promise<string> {
  // Create JWT token
  const payload: AccessTokenPayload = {
    clientId,
    type: 'onboarding_access',
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });

  // Store token in database
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);

  await prisma.accessToken.create({
    data: {
      token,
      clientId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Verify and decode an access token
 */
export async function verifyAccessToken(token: string): Promise<{
  valid: boolean;
  clientId?: string;
  error?: string;
}> {
  try {
    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;

    // Check if token exists in database and is not revoked
    const dbToken = await prisma.accessToken.findUnique({
      where: { token },
    });

    if (!dbToken) {
      return { valid: false, error: 'Token not found' };
    }

    if (dbToken.isRevoked) {
      return { valid: false, error: 'Token has been revoked' };
    }

    if (new Date() > dbToken.expiresAt) {
      return { valid: false, error: 'Token has expired' };
    }

    // Update last used timestamp
    await prisma.accessToken.update({
      where: { token },
      data: { lastUsedAt: new Date() },
    });

    return {
      valid: true,
      clientId: decoded.clientId,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, error: 'Token has expired' };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { valid: false, error: 'Invalid token' };
    }
    return { valid: false, error: 'Token verification failed' };
  }
}

/**
 * Revoke an access token
 */
export async function revokeAccessToken(token: string): Promise<void> {
  await prisma.accessToken.update({
    where: { token },
    data: { isRevoked: true },
  });
}

/**
 * Revoke all tokens for a client
 */
export async function revokeAllClientTokens(clientId: string): Promise<void> {
  await prisma.accessToken.updateMany({
    where: { clientId },
    data: { isRevoked: true },
  });
}

/**
 * Clean up expired tokens (should be run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.accessToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}

/**
 * Generate a secure onboarding link with access token
 */
export async function generateOnboardingLink(clientId: string, baseUrl: string): Promise<string> {
  const token = await generateAccessToken(clientId);
  return `${baseUrl}/mini-sprint?clientId=${clientId}&token=${token}`;
}
