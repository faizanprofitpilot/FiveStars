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

export function createEmailTemplate(
  template: string,
  variables: Record<string, string>,
  businessName?: string
): string {
  let html = template

  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    html = html.replace(regex, value)
  })

  // Wrap in email template
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${businessName ? `<div style="margin-bottom: 20px;"><strong>${businessName}</strong></div>` : ''}
        <div style="white-space: pre-wrap;">${html}</div>
      </body>
    </html>
  `.trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

