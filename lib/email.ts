import nodemailer from 'nodemailer';

// Create SES transporter
const transporter = nodemailer.createTransport({
  host: process.env.AWS_SES_SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.AWS_SES_SMTP_USERNAME,
    pass: process.env.AWS_SES_SMTP_PASSWORD,
  },
});

interface SendOnboardingLinkParams {
  to: string;
  clientName: string;
  clientId: string;
  token: string;
  fromEmail?: string;
  fromName?: string;
}

/**
 * Send onboarding form link to client via Amazon SES
 */
export async function sendOnboardingLink({
  to,
  clientName,
  clientId,
  token,
  fromEmail = process.env.FROM_EMAIL || 'tayler@willardagency.com',
  fromName = 'Tayler Hughes - Willard Agency',
}: SendOnboardingLinkParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate SES credentials
    if (!process.env.AWS_SES_SMTP_USERNAME || !process.env.AWS_SES_SMTP_PASSWORD) {
      throw new Error('AWS SES credentials not configured');
    }

    // Generate the secure onboarding link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://willardagency.com';
    const onboardingLink = `${baseUrl}/mini-sprint?clientId=${clientId}&token=${token}`;

    // Email HTML template
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Onboarding</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <img src="${baseUrl}/logo.svg" alt="Willard Agency" style="height: 48px; width: auto; margin-bottom: 16px;" />
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Complete Your Onboarding</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #374151;">
                Hi ${clientName},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #374151;">
                Thanks for choosing Willard Agency for your design sprint! To get started, please complete our onboarding form. This helps us understand your needs and deliver the best possible outcome.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="${onboardingLink}" style="display: inline-block; padding: 14px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Complete Onboarding Form
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Info -->
              <div style="margin: 24px 0; padding: 16px; background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
                <div style="display: flex; align-items: flex-start;">
                  <div style="flex-shrink: 0; margin-right: 12px;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016A11.955 11.955 0 0112 2.944zm3.707 5.349a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill="#16a34a"/>
                    </svg>
                  </div>
                  <div>
                    <p style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #166534;">Your Information is Secure</p>
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #15803d;">
                      • This link is unique to you and expires in 7 days<br>
                      • All data is encrypted with 256-bit SSL<br>
                      • Your information is never shared with third parties
                    </p>
                  </div>
                </div>
              </div>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                If the button doesn't work, you can copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; line-height: 20px; color: #4f46e5; word-break: break-all;">
                ${onboardingLink}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                Questions? Reply to this email or contact us at<br>
                <a href="mailto:tayler@willardagency.com" style="color: #4f46e5; text-decoration: none;">tayler@willardagency.com</a>
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} Willard Agency. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <!-- Link Expiration Notice -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
          <tr>
            <td style="padding: 0 40px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                This secure link expires in 7 days for your security. If expired, please contact us for a new link.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Plain text version
    const textContent = `
Hi ${clientName},

Thanks for choosing Willard Agency for your design sprint! To get started, please complete our onboarding form:

${onboardingLink}

This secure link is unique to you and expires in 7 days for your security.

Your Information is Secure:
• All data is encrypted with 256-bit SSL
• Your information is never shared with third parties
• The form auto-saves as you work

Questions? Reply to this email or contact us at tayler@willardagency.com

© ${new Date().getFullYear()} Willard Agency. All rights reserved.
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: 'Complete Your Willard Agency Onboarding',
      text: textContent,
      html: htmlContent,
    });

    console.log('Onboarding email sent:', info.messageId);

    return { success: true };
  } catch (error) {
    console.error('Failed to send onboarding email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify SES configuration
 */
export async function verifySESConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SES configuration error:', error);
    return false;
  }
}
