import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailOptions): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key not configured')
    }

    const fromEmail = from || process.env.RESEND_FROM_EMAIL || 'noreply@fivestars.com'

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      throw new Error('Invalid email format')
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    })

    if (error) {
      throw new Error(error.message || 'Failed to send email')
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error: any) {
    console.error('Resend email error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send email',
    }
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Turns plain text body into paragraphs; escapes HTML. */
function bodyToHtml(body: string): string {
  const escaped = escapeHtml(body)
  const paragraphs = escaped.split(/\r?\n+/).filter((p) => p.trim().length > 0)
  if (paragraphs.length === 0) return '<p style="margin:0 0 1em 0;">&nbsp;</p>'
  return paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 1em 0; font-size:16px; line-height:1.6; color:#374151;">${p.trim()}</p>`
    )
    .join('')
}

export function createEmailTemplate(
  template: string,
  variables: Record<string, string>,
  businessName?: string
): string {
  let body = template

  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    body = body.replace(regex, value)
  })

  const reviewLink = variables.review_link?.trim()
  const hasReviewLink =
    reviewLink &&
    (reviewLink.startsWith('http://') || reviewLink.startsWith('https://'))

  const bodyHtml = bodyToHtml(body)
  const safeBusinessName = businessName ? escapeHtml(businessName) : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>We'd love your review</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0; text-align:center;">
              <div style="display:inline-block; padding:10px 20px; background-color:#f59e0b; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius:12px; box-shadow:0 4px 14px rgba(245,158,11,0.35);">
                <span style="font-size:22px; font-weight:700; color:#ffffff; letter-spacing:0.5px;">★ Five Stars</span>
              </div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:32px 28px 24px 28px;">
                    ${safeBusinessName ? `<p style="margin:0 0 20px 0; font-size:13px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:0.05em;">${safeBusinessName}</p>` : ''}
                    <div style="margin:0 0 24px 0;">
                      ${bodyHtml}
                    </div>
                    ${hasReviewLink ? `
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="padding:8px 0 0 0;">
                          <a href="${escapeHtml(reviewLink)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:14px 32px; background-color:#f59e0b; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#ffffff; font-size:16px; font-weight:600; text-decoration:none; border-radius:10px; box-shadow:0 4px 14px rgba(245,158,11,0.4);">Leave a review</a>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 16px 0 16px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">Sent with Five Stars · We help businesses collect reviews</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

