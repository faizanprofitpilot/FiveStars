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

    // Fetch campaign details with business review link
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select(`
        *,
        businesses!inner (
          id,
          business_name,
          user_id,
          review_link
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
    
    console.log('Campaign channel configuration:', {
      primary_channel: primaryChannel,
      phone_provided: !!phone,
      email_provided: !!email,
      phone_valid: phone ? validatePhoneNumber(phone) : false,
    })
    
    if (
      primaryChannel === 'sms' &&
      (!phone || !validatePhoneNumber(phone))
    ) {
      console.error('SMS validation failed:', {
        primary_channel: primaryChannel,
        phone_provided: !!phone,
        phone_value: phone,
        phone_valid: phone ? validatePhoneNumber(phone) : false,
      })
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

    // Get review link from business settings, fallback to default
    // Note: Each user has their own business profile with their own business_name and review_link
    // All users share the same Twilio toll-free number, but each message uses the specific user's business data
    const reviewLink = campaign.businesses.review_link || `https://g.page/r/YOUR_REVIEW_LINK`

    // Log campaign and business details for debugging
    console.log('Campaign and business details:', {
      campaign_id: campaign.id,
      campaign_name: campaign.name,
      business_id: campaign.businesses.id,
      business_name: campaign.businesses.business_name,
      business_user_id: campaign.businesses.user_id,
      review_link: reviewLink,
      primary_template: campaign.primary_template,
    })

    // Prepare template variables
    // These are user-specific: each user's business_name and review_link are used
    const templateVariables = {
      first_name: firstName,
      business_name: campaign.businesses.business_name, // User's business name
      review_link: reviewLink, // User's review link from settings
    }

    console.log('Template variables:', templateVariables)

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
    if (primaryChannel === 'sms') {
      if (!phone) {
        errorMessage = 'Phone number is required for SMS campaigns but was not provided'
        console.error('SMS campaign but no phone provided')
      } else {
      const message = replaceTemplateVariables(
        campaign.primary_template,
        templateVariables
      )
      
      console.log('Final SMS message after template replacement:', {
        original_template: campaign.primary_template,
        final_message: message,
        business_name_used: templateVariables.business_name,
      })
      
      console.log('Attempting to send SMS:', {
        to: phone,
        phone_raw: phone,
        message_length: message.length,
        campaign_id: campaignId,
        review_request_id: reviewRequest.id,
        twilio_configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
        twilio_phone: process.env.TWILIO_PHONE_NUMBER || 'NOT SET',
      })
      
      const smsResult = await sendSMS({
        to: phone,
        body: message,
      })

      console.log('SMS send result:', {
        success: smsResult.success,
        messageSid: smsResult.messageSid,
        status: smsResult.status,
        error: smsResult.error,
        full_result: smsResult,
      })

      if (smsResult.success && smsResult.messageSid) {
        // Twilio accepted the message, but status might be "queued" or "sent"
        // "sent" means accepted by carrier, not necessarily delivered
        // We'll mark as sent but note the actual status
        const twilioStatus = smsResult.status || 'unknown'
        
        console.log('Twilio message status:', twilioStatus)
        
        // Only mark as sent if status is "sent", "delivered", or "queued"
        // "queued" and "sent" mean it's in progress, "delivered" means it arrived
        if (['queued', 'sending', 'sent', 'delivered'].includes(twilioStatus)) {
          primarySent = true
          
          // Store message SID and status for later checking
          await supabase
            .from('review_requests')
            .update({
              primary_sent: true,
              sent_at: new Date().toISOString(),
              error_message: twilioStatus === 'delivered' 
                ? null 
                : `Twilio status: ${twilioStatus} (may not be delivered yet)`,
            })
            .eq('id', reviewRequest.id)
          
          console.log('SMS accepted by Twilio, status:', twilioStatus)
          
          // If status is not "delivered", warn that it may not have arrived yet
          if (twilioStatus !== 'delivered') {
            console.warn(`Message status is "${twilioStatus}", not "delivered". Message may not have arrived yet.`)
          }
        } else {
          // Status is "undelivered" or "failed"
          errorMessage = `Twilio status: ${twilioStatus}. Message may not have been delivered.`
          console.error('SMS not delivered, status:', twilioStatus)
        }
      } else {
        errorMessage = smsResult.error || 'Failed to send SMS'
        console.error('SMS send failed:', {
          error: errorMessage,
          full_result: smsResult,
          phone: phone,
          twilio_configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
        })
      }
      }
    } else if (primaryChannel === 'email') {
      if (!email) {
        errorMessage = 'Email is required for email campaigns but was not provided'
        console.error('Email campaign but no email provided')
      } else {
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
    } else if (primaryChannel === 'none') {
      errorMessage = 'Campaign primary channel is set to "none". No message will be sent.'
      console.warn('Campaign has no primary channel configured')
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
      error: errorMessage || undefined,
    }
  } catch (error: any) {
    console.error('Send review request internal error:', error)
    return {
      success: false,
      error: error.message || 'Internal server error',
    }
  }
}

