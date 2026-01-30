# Amazon SES Email Setup Guide

This guide explains how to configure Amazon SES for sending onboarding form links to clients.

## Prerequisites

1. AWS Account with Amazon SES access
2. Verified sender email address in SES
3. SMTP credentials generated in AWS

## Step 1: Set Up Amazon SES

### 1.1 Verify Your Email Address

1. Go to [Amazon SES Console](https://console.aws.amazon.com/ses/)
2. Navigate to **Verified identities**
3. Click **Create identity**
4. Choose **Email address**
5. Enter your email (e.g., `tayler@willardagency.com`)
6. Click **Create identity**
7. Check your email and click the verification link

### 1.2 Request Production Access (Optional but Recommended)

By default, SES is in **sandbox mode** which only allows sending to verified email addresses.

1. In the SES console, click **Request production access**
2. Fill out the form explaining your use case
3. Wait for approval (usually 24-48 hours)

**Note:** In sandbox mode, you can still test by verifying recipient email addresses.

### 1.3 Generate SMTP Credentials

1. In SES console, go to **SMTP settings**
2. Click **Create SMTP credentials**
3. Enter an IAM User Name (e.g., `ses-smtp-user-willard`)
4. Click **Create user**
5. **Important:** Download and save the credentials (you won't see them again!)
   - SMTP Username
   - SMTP Password

### 1.4 Note Your SMTP Endpoint

Based on your AWS region:
- **US East (N. Virginia)**: `email-smtp.us-east-1.amazonaws.com`
- **US West (Oregon)**: `email-smtp.us-west-2.amazonaws.com`
- **EU (Ireland)**: `email-smtp.eu-west-1.amazonaws.com`

[Full list of endpoints](https://docs.aws.amazon.com/ses/latest/dg/smtp-connect.html)

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Amazon SES Configuration
AWS_SES_SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
AWS_SES_SMTP_USERNAME="your-smtp-username-here"
AWS_SES_SMTP_PASSWORD="your-smtp-password-here"

# Email Settings
FROM_EMAIL="tayler@willardagency.com"
FROM_NAME="Tayler Hughes - Willard Agency"

# Base URL for onboarding links (production)
NEXT_PUBLIC_BASE_URL="https://willardagency.com"
```

### Environment Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_SES_SMTP_HOST` | SES SMTP endpoint for your region | `email-smtp.us-east-1.amazonaws.com` |
| `AWS_SES_SMTP_USERNAME` | SMTP username from Step 1.3 | `AKIA...` |
| `AWS_SES_SMTP_PASSWORD` | SMTP password from Step 1.3 | `BPK...` |
| `FROM_EMAIL` | Verified sender email address | `tayler@willardagency.com` |
| `FROM_NAME` | Display name for sender | `Tayler Hughes - Willard Agency` |
| `NEXT_PUBLIC_BASE_URL` | Your production domain | `https://willardagency.com` |

## Step 3: Test Email Sending

### Testing in Development

If you're in SES sandbox mode, verify the test recipient's email:

1. Go to SES console → **Verified identities**
2. Click **Create identity** → **Email address**
3. Enter test recipient email and verify it

### Send a Test Email

1. Create a test client in your CRM with an email address
2. Go to the client detail page in `/admin/client/[clientId]`
3. Click **Send Onboarding Link** button
4. Check the recipient's inbox (and spam folder)

### Troubleshooting

**Email not received?**
- Check SES sending quotas: SES Console → Account dashboard
- Verify sender email is verified in SES
- Check CloudWatch logs for errors
- In sandbox mode, verify recipient email

**"Configuration error" message?**
- Verify all environment variables are set correctly
- Check SMTP credentials are correct
- Ensure no extra spaces in `.env.local`

## How It Works

### Email Flow

1. Admin clicks **Send Onboarding Link** in CRM
2. System generates a secure JWT access token (7-day expiration)
3. Token is saved to database (`AccessToken` table)
4. Email is sent via Amazon SES with secure link
5. Activity is logged in CRM timeline
6. Client receives branded email with secure link

### Email Template Features

- **Branded design** with Willard logo
- **Secure link** with 7-day expiration token
- **Security badge** explaining data protection
- **Responsive** design for mobile and desktop
- **Plain text fallback** for email clients without HTML support

### Security Features

- Links expire after 7 days
- Each link is unique per client
- Tokens can be revoked by admins
- All email sends are logged in activity timeline
- Rate limiting protects against abuse

## Monitoring

### View Sent Emails

In the SES console:
1. Go to **Configuration sets** (if configured)
2. Check **Sending statistics**
3. Review bounces and complaints

### Activity Logs

All email sends are logged in the CRM:
1. Go to client detail page
2. Scroll to **Activity Timeline**
3. Look for "onboarding_link_sent" entries

## Cost

Amazon SES pricing (as of 2024):
- First 62,000 emails/month: **$0** (free tier)
- After that: **$0.10 per 1,000 emails**

**Example:** Sending 100 onboarding links/month = **FREE**

## Advanced Configuration

### Custom Email Domain

To send from `@yourcompany.com` instead of `@gmail.com`:

1. In SES console, verify your domain (not just email)
2. Add DNS records (SES will provide them)
3. Wait for verification (24-48 hours)
4. Update `FROM_EMAIL` in `.env.local`

### Customize Email Template

Edit the template in:
```
lib/email.ts
```

The template uses inline HTML for maximum compatibility with email clients.

## Production Checklist

- [ ] SES production access approved
- [ ] Sender email/domain verified
- [ ] SMTP credentials generated and saved
- [ ] Environment variables configured in production
- [ ] Test email sent successfully
- [ ] Email appears in inbox (not spam)
- [ ] Onboarding link works and expires correctly
- [ ] Activity logs show email sends
- [ ] Monitoring enabled in SES console

## Support

For issues:
- **AWS SES Issues:** Check [SES documentation](https://docs.aws.amazon.com/ses/)
- **Email not sending:** Verify credentials and check server logs
- **Emails in spam:** Set up SPF, DKIM, and DMARC records

For questions about this implementation, contact your development team.
