# Security Implementation Guide

This document outlines the security features implemented for the onboarding form and configuration steps required.

## Overview

The onboarding form has been secured with multiple layers of protection:

1. **Secure Client IDs** - UUID-based identifiers instead of predictable timestamps
2. **Access Token System** - 7-day expiring JWT tokens for time-limited form access
3. **Rate Limiting** - Protection against brute force and abuse
4. **Access Logging** - Security audit trail for all form interactions
5. **Encryption** - SSL/TLS for data in transit, secure storage
6. **GDPR Compliance** - Data export and deletion endpoints
7. **User Consent** - Privacy policy and consent tracking

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# JWT Secret for access tokens (generate a strong random string)
JWT_SECRET="your-secret-key-here-change-this-in-production"

# Upstash Redis for rate limiting (optional, but recommended)
# Sign up at https://upstash.com/ and create a Redis database
UPSTASH_REDIS_REST_URL="your-upstash-redis-rest-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-rest-token"
```

### Generating a Secure JWT Secret

```bash
# Generate a secure random string (use one of these methods):
openssl rand -base64 32
# OR
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Migration

Apply the security database migration manually:

```bash
# Run the SQL migration located at:
prisma/migrations/add_security_models.sql

# This adds the following tables:
# - AccessToken: Manages time-limited form access
# - AccessLog: Security audit trail
# - ConsentLog: GDPR consent tracking
```

Then regenerate the Prisma client:

```bash
npx prisma generate
```

## Security Features

### 1. Secure Client IDs

- **Old**: `form-${Date.now()}` (predictable)
- **New**: `randomUUID()` (cryptographically secure)

Location: `app/api/onboarding/route.ts:217-221`

### 2. Access Token System

**How it works:**
- Generate secure access links with JWT tokens
- Tokens expire after 7 days
- Tokens can be revoked
- Expired links redirect to `/expired` page

**Generate a secure link:**
```typescript
import { generateOnboardingLink } from '@/lib/access-token';

const link = await generateOnboardingLink(clientId, 'https://yourdomain.com');
// Returns: https://yourdomain.com/mini-sprint?clientId=xxx&token=xxx
```

**API endpoints require token:**
- `GET /api/client/[clientId]` - Requires valid token (unless authenticated admin)

Location: `lib/access-token.ts`

### 3. Rate Limiting

**Configuration:**
- 10 requests per 10 seconds per IP address
- Works with or without Redis (fails open if Redis unavailable)
- Applied to all onboarding endpoints

**Endpoints protected:**
- `POST /api/onboarding`
- `GET /api/client/[clientId]`

Location: `lib/rate-limit.ts`

### 4. Access Logging

All form interactions are logged for security auditing:
- View events
- Edit/save events
- Submit events
- Includes IP address and user agent

Location: `lib/access-log.ts`

### 5. Security Headers

Configured in `next.config.ts`:
- Strict-Transport-Security (HSTS)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 6. GDPR Compliance

**Data Export:**
```bash
POST /api/gdpr/export
{
  "clientId": "client-id-here",
  "email": "client@example.com"
}
```

**Data Deletion:**
```bash
POST /api/gdpr/delete
{
  "clientId": "client-id-here",
  "email": "client@example.com"
}
```

**Privacy Policy:** Available at `/privacy`

### 7. User Consent

Consent checkboxes added to form:
- Privacy Policy acceptance
- Data processing consent
- Tracked in `ConsentLog` table

## UX Trust Indicators

The onboarding form includes several trust indicators:

1. **Trust Badge** - At top of form showing security features
2. **SSL Indicators** - Lock icons and encryption messaging
3. **Secure Auto-save** - Messages indicate "Securely saved"
4. **Footer Security Info** - 256-bit SSL, secure storage, privacy policy link

## Admin Functions

### Generate Access Link for Client

When sending onboarding forms to clients, generate a secure link:

```typescript
import { generateOnboardingLink } from '@/lib/access-token';

// After creating client via Zapier or admin:
const link = await generateOnboardingLink(
  client.clientId,
  process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
);

// Send this link to the client
// It will be valid for 7 days
```

### View Access Logs

```typescript
import { getAccessLogs } from '@/lib/access-log';

const logs = await getAccessLogs(clientId, 50);
// Returns array of access events with IP, user agent, timestamps
```

### Revoke Access

```typescript
import { revokeAllClientTokens } from '@/lib/access-token';

// Revoke all access tokens for a client
await revokeAllClientTokens(clientId);
```

## Testing

### Test Rate Limiting

```bash
# Make multiple requests quickly to trigger rate limit
for i in {1..15}; do curl http://localhost:3000/api/onboarding; done

# Should return 429 Too Many Requests after 10 requests
```

### Test Token Expiration

1. Generate a token
2. Mark it as expired in database
3. Try to access form
4. Should redirect to `/expired`

### Test GDPR Export

```bash
curl -X POST http://localhost:3000/api/gdpr/export \
  -H "Content-Type: application/json" \
  -d '{"clientId":"xxx","email":"client@example.com"}'
```

## Monitoring

Recommended monitoring:

1. **Access Logs** - Monitor for unusual patterns
2. **Rate Limit Violations** - Track IPs hitting rate limits
3. **Token Revocations** - Alert on manual revocations
4. **GDPR Requests** - Log all export/delete requests

## Production Checklist

- [ ] Set strong `JWT_SECRET` in production environment
- [ ] Configure Upstash Redis for rate limiting
- [ ] Apply database migration for security tables
- [ ] Test token generation and expiration
- [ ] Verify rate limiting works
- [ ] Test GDPR export and deletion
- [ ] Review privacy policy and update contact emails
- [ ] Set up monitoring for access logs
- [ ] Test expired link redirect
- [ ] Verify SSL/TLS certificate is valid

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate JWT secret** - Periodically change the JWT_SECRET
3. **Monitor access logs** - Review regularly for suspicious activity
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Use HTTPS** - Always use HTTPS in production
6. **Backup data** - Regular database backups
7. **Clean up expired tokens** - Run cleanup periodically:
   ```typescript
   import { cleanupExpiredTokens } from '@/lib/access-token';
   const deleted = await cleanupExpiredTokens();
   ```

## Support

For questions or issues with security implementation:
- Email: tayler@willardagency.com
- Privacy concerns: privacy@willardagency.com
