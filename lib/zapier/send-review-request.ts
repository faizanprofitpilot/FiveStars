import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Internal function to send review request (bypasses auth for Zapier)
 * This is called from the Zapier webhook handler
 */
export async function sendReviewRequestInternal({
  campaignId,
  firstName,
  phone,
  email,
}: {
  campaignId: string
  firstName: string
  phone?: string
  email?: string
}): Promise<{
  success: boolean
  review_request_id?: string
  primary_sent?: boolean
  error?: string
}> {
  try {
    const supabase = createAdminClient()

    // Fetch campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select(`
        *,
        businesses!inner (
          id,
          business_name,
          user_id
        )
      `)
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      return {
        success: false,
        error: 'Campaign not found',
      }
    }

    // Import here to avoid circular dependencies
    const { sendSMS, validatePhoneNumber } = await import('@/lib/twilio/send-sms')
    const { sendEmail, createEmailTemplate, validateEmail } = await import('@/lib/resend/send-email')
    const { replaceTemplateVariables } = await import('@/lib/template')

    // Validate contact info based on primary channel
    const primaryChannel = campaign.primary_channel
    if (
      primaryChannel === 'sms' &&
      (!phone || !validatePhoneNumber(phone))
    ) {
      return {
        success: false,
        error: 'Valid phone number required for SMS',
      }
    }

    if (
      primaryChannel === 'email' &&
      (!email || !validateEmail(email))
    ) {
      return {
        success: false,
        error: 'Valid email required for email',
      }
    }

    // Generate review link
    const reviewLink = `https://g.page/r/YOUR_REVIEW_LINK` // TODO: Make configurable

    // Prepare template variables
    const templateVariables = {
      first_name: firstName,
      business_name: campaign.businesses.business_name,
      review_link: reviewLink,
    }

    // Create review request record
    const { data: reviewRequest, error: requestError } = await supabase
      .from('review_requests')
      .insert({
        campaign_id: campaignId,
        customer_first_name: firstName,
        customer_phone: phone || null,
        customer_email: email || null,
        primary_channel: primaryChannel,
        secondary_channel: campaign.secondary_channel,
      })
      .select()
      .single()

    if (requestError) {
      return {
        success: false,
        error: 'Failed to create review request',
      }
    }

    let primarySent = false
    let errorMessage: string | null = null

    // Send primary channel
    if (primaryChannel === 'sms' && phone) {
      const message = replaceTemplateVariables(
        campaign.primary_template,
        templateVariables
      )
      const smsResult = await sendSMS({
        to: phone,
        body: message,
      })

      if (smsResult.success) {
        primarySent = true
        await supabase
          .from('review_requests')
          .update({
            primary_sent: true,
            sent_at: new Date().toISOString(),
          })
          .eq('id', reviewRequest.id)
      } else {
        errorMessage = smsResult.error || 'Failed to send SMS'
      }
    } else if (primaryChannel === 'email' && email) {
      const emailBody = replaceTemplateVariables(
        campaign.primary_template,
        templateVariables
      )
      const htmlBody = createEmailTemplate(
        emailBody,
        templateVariables,
        campaign.businesses.business_name
      )

      const emailResult = await sendEmail({
        to: email,
        subject: `Thanks for choosing ${campaign.businesses.business_name}!`,
        html: htmlBody,
      })

      if (emailResult.success) {
        primarySent = true
        await supabase
          .from('review_requests')
          .update({
            primary_sent: true,
            sent_at: new Date().toISOString(),
          })
          .eq('id', reviewRequest.id)
      } else {
        errorMessage = emailResult.error || 'Failed to send email'
      }
    }

    // Update error message if primary failed
    if (!primarySent && errorMessage) {
      await supabase
        .from('review_requests')
        .update({ error_message: errorMessage })
        .eq('id', reviewRequest.id)
    }

    return {
      success: primarySent,
      review_request_id: reviewRequest.id,
      primary_sent: primarySent,
      error: errorMessage,
    }
  } catch (error: any) {
    console.error('Send review request internal error:', error)
    return {
      success: false,
      error: error.message || 'Internal server error',
    }
  }
}

