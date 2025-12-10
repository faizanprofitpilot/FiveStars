import { createClient } from '@/lib/supabase/server'
import { sendSMS, validatePhoneNumber } from '@/lib/twilio/send-sms'
import { sendEmail, createEmailTemplate, validateEmail } from '@/lib/resend/send-email'
import { replaceTemplateVariables } from '@/lib/template'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const sendRequestSchema = z.object({
  campaign_id: z.string().uuid(),
  first_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = sendRequestSchema.parse(body)

    // Fetch campaign
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
      .eq('id', validatedData.campaign_id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (campaign.businesses.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if we have required contact info for primary channel
    const primaryChannel = campaign.primary_channel
    if (
      primaryChannel === 'sms' &&
      (!validatedData.phone || !validatePhoneNumber(validatedData.phone))
    ) {
      return NextResponse.json(
        { error: 'Valid phone number required for SMS' },
        { status: 400 }
      )
    }

    if (
      primaryChannel === 'email' &&
      (!validatedData.email || !validateEmail(validatedData.email))
    ) {
      return NextResponse.json(
        { error: 'Valid email required for email' },
        { status: 400 }
      )
    }

    // Generate review link (placeholder - user would configure this)
    const reviewLink = `https://g.page/r/YOUR_REVIEW_LINK` // TODO: Make configurable

    // Prepare variables for template
    const templateVariables = {
      first_name: validatedData.first_name,
      business_name: campaign.businesses.business_name,
      review_link: reviewLink,
    }

    // Create review request record
    const { data: reviewRequest, error: requestError } = await supabase
      .from('review_requests')
      .insert({
        campaign_id: validatedData.campaign_id,
        customer_first_name: validatedData.first_name,
        customer_phone: validatedData.phone || null,
        customer_email: validatedData.email || null,
        primary_channel: primaryChannel,
        secondary_channel: campaign.secondary_channel,
      })
      .select()
      .single()

    if (requestError) {
      console.error('Review request creation error:', requestError)
      return NextResponse.json(
        { error: 'Failed to create review request' },
        { status: 500 }
      )
    }

    let primarySent = false
    let errorMessage: string | null = null

    // Send primary channel
    if (primaryChannel === 'sms' && validatedData.phone) {
      const message = replaceTemplateVariables(
        campaign.primary_template,
        templateVariables
      )
      const smsResult = await sendSMS({
        to: validatedData.phone,
        body: message,
      })

      if (smsResult.success && smsResult.messageSid) {
        // Twilio accepted the message, but status might be "queued" or "sent"
        // "sent" means accepted by carrier, not necessarily delivered
        const twilioStatus = smsResult.status || 'unknown'
        
        // Only mark as sent if status is "sent", "delivered", or "queued"
        if (['queued', 'sending', 'sent', 'delivered'].includes(twilioStatus)) {
          primarySent = true
          
          // Store status warning if not delivered
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
        } else {
          // Status is "undelivered" or "failed"
          errorMessage = `Twilio status: ${twilioStatus}. Message may not have been delivered.`
        }
      } else {
        errorMessage = smsResult.error || 'Failed to send SMS'
      }
    } else if (primaryChannel === 'email' && validatedData.email) {
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
        to: validatedData.email,
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

    return NextResponse.json({
      success: primarySent,
      review_request_id: reviewRequest.id,
      primary_sent: primarySent,
      error: errorMessage,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Send review request error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

