import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendReviewRequestInternal } from '@/lib/zapier/send-review-request'
import { authenticateOAuthToken, extractOAuthToken } from '@/lib/oauth/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const zapierSchema = z.object({
  campaign_id: z.string(),
  first_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

// This endpoint accepts requests from Zapier
export async function POST(request: Request) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()
  
  try {
    console.log(`[${requestId}] ========== ZAPIER WEBHOOK CALLED ==========`)
    console.log(`[${requestId}] Timestamp: ${new Date().toISOString()}`)
    
    // Authenticate using OAuth token
    const oauthToken = extractOAuthToken(request)

    if (!oauthToken) {
      console.error(`[${requestId}] Missing OAuth token`)
      return NextResponse.json(
        { error: 'OAuth token required. Use Authorization: Bearer <token>' },
        { status: 401 }
      )
    }

    const userId = await authenticateOAuthToken(oauthToken)

    if (!userId) {
      console.error(`[${requestId}] Invalid OAuth token`)
      return NextResponse.json(
        { error: 'Invalid or expired OAuth token' },
        { status: 401 }
      )
    }

    console.log(`[${requestId}] Authenticated user ID: ${userId}`)

    const body = await request.json()
    const validatedData = zapierSchema.parse(body)

    console.log(`[${requestId}] Request data:`, {
      campaign_id: validatedData.campaign_id,
      first_name: validatedData.first_name,
      phone: validatedData.phone ? '***' + validatedData.phone.slice(-4) : 'none',
      email: validatedData.email ? validatedData.email.split('@')[0] + '@***' : 'none',
    })

    const supabase = createAdminClient()

    // CRITICAL: Get ONLY the authenticated user's business
    const { data: userBusiness, error: businessError } = await supabase
      .from('businesses')
      .select('id, business_name, user_id')
      .eq('user_id', userId)
      .single()

    if (businessError || !userBusiness) {
      console.error(`[${requestId}] User business not found:`, {
        user_id: userId,
        error: businessError?.message,
      })
      return NextResponse.json(
        { error: 'Business profile not found for authenticated user' },
        { status: 404 }
      )
    }

    console.log(`[${requestId}] User's business found:`, {
      business_id: userBusiness.id,
      business_name: userBusiness.business_name,
      user_id: userBusiness.user_id,
    })

    // Find campaign by campaign_id - MUST belong to this user's business ONLY
    console.log(`[${requestId}] Searching for campaign:`, {
      campaign_id: validatedData.campaign_id,
      user_business_id: userBusiness.id,
    })

    // First, check if there are ANY campaigns with this campaign_id (for debugging)
    const { data: allCampaignsWithId } = await supabase
      .from('campaigns')
      .select(`
        id,
        campaign_id,
        name,
        business_id,
        businesses!inner (
          id,
          business_name,
          user_id
        )
      `)
      .eq('campaign_id', validatedData.campaign_id)

    console.log(`[${requestId}] DEBUG: Found ${allCampaignsWithId?.length || 0} campaigns with campaign_id "${validatedData.campaign_id}" (before business filter):`)
    allCampaignsWithId?.forEach((c, i) => {
      const business = Array.isArray(c.businesses) ? c.businesses[0] : c.businesses
      console.log(`[${requestId}]   ${i + 1}. ${c.name} (Business: ${business?.business_name}, User: ${business?.user_id}, UUID: ${c.id})`)
    })

    // Now get ONLY the campaign for this user's business
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select(`
        id,
        campaign_id,
        name,
        business_id,
        businesses!inner (
          id,
          business_name,
          user_id
        )
      `)
      .eq('campaign_id', validatedData.campaign_id)
      .eq('business_id', userBusiness.id) // CRITICAL: Only this user's business
      .single() // Use single() to ensure only ONE campaign is found

    if (campaignError || !campaign) {
      console.error(`[${requestId}] Campaign not found:`, {
        campaign_id: validatedData.campaign_id,
        user_business_id: userBusiness.id,
        error: campaignError?.message,
      })
      return NextResponse.json(
        { error: `Campaign not found with ID: ${validatedData.campaign_id} for your business` },
        { status: 404 }
      )
    }

    const business = Array.isArray(campaign.businesses) ? campaign.businesses[0] : campaign.businesses
    console.log(`[${requestId}] Campaign found:`, {
      campaign_id: campaign.campaign_id,
      campaign_name: campaign.name,
      campaign_uuid: campaign.id,
      business_name: business?.business_name,
      business_id: business?.id,
      business_user_id: business?.user_id,
    })

    // Get business from campaign (should be single object due to inner join)
    if (!business || business.id !== userBusiness.id) {
      console.error(`[${requestId}] Business mismatch:`, {
        campaign_business_id: business?.id,
        user_business_id: userBusiness.id,
      })
      return NextResponse.json(
        { error: 'Campaign does not belong to your business' },
        { status: 403 }
      )
    }

    // Final verification: business must belong to authenticated user
    if (business.user_id !== userId || business.id !== userBusiness.id) {
      console.error(`[${requestId}] SECURITY ERROR: Business ownership mismatch:`, {
        business_user_id: business.user_id,
        authenticated_user_id: userId,
        business_id: business.id,
        user_business_id: userBusiness.id,
      })
      return NextResponse.json(
        { error: 'Unauthorized: Campaign does not belong to authenticated user' },
        { status: 403 }
      )
    }

    console.log(`[${requestId}] All security checks passed. Proceeding to store contact and send message.`)

    // CRITICAL: Store or verify contact ownership
    // This ensures each contact is associated with the business that fetched it
    let contactRecord = null
    
    if (validatedData.phone || validatedData.email) {
      // Check if this contact already exists in zapier_contacts
      let contactQuery = supabase
        .from('zapier_contacts')
        .select('id, user_id, business_id, first_name, phone, email, campaign_id')
      
      if (validatedData.phone) {
        contactQuery = contactQuery.eq('phone', validatedData.phone)
      } else if (validatedData.email) {
        contactQuery = contactQuery.eq('email', validatedData.email)
      }
      
      const { data: existingContacts, error: contactError } = await contactQuery

      if (contactError) {
        console.error(`[${requestId}] Error checking existing contacts:`, contactError)
      }

      if (existingContacts && existingContacts.length > 0) {
        // Contact already exists - verify it belongs to this user/business
        const existingContact = existingContacts[0]
        
        if (existingContact.business_id !== userBusiness.id || existingContact.user_id !== userId) {
          console.error(`[${requestId}] SECURITY: Contact belongs to different business:`, {
            contact_id: existingContact.id,
            contact_business_id: existingContact.business_id,
            contact_user_id: existingContact.user_id,
            current_business_id: userBusiness.id,
            current_user_id: userId,
            contact_business_name: existingContact.business_id === userBusiness.id ? userBusiness.business_name : 'DIFFERENT BUSINESS',
          })
          
          return NextResponse.json(
            { 
              success: false,
              error: 'This contact was already fetched by a different business. Only the business that originally fetched this contact can send messages.',
              request_id: requestId,
            },
            { status: 403 }
          )
        }
        
        // Contact belongs to this business - use it
        contactRecord = existingContact
        console.log(`[${requestId}] Using existing contact record:`, {
          contact_id: contactRecord.id,
          business_id: contactRecord.business_id,
        })
      } else {
        // New contact - store it with this user/business
        const { data: newContact, error: insertError } = await supabase
          .from('zapier_contacts')
          .insert({
            user_id: userId,
            business_id: userBusiness.id,
            first_name: validatedData.first_name,
            phone: validatedData.phone || null,
            email: validatedData.email || null,
            campaign_id: campaign.id,
          })
          .select()
          .single()

        if (insertError) {
          console.error(`[${requestId}] Error storing contact:`, insertError)
          // Don't fail - continue with sending, but log the error
        } else {
          contactRecord = newContact
          console.log(`[${requestId}] Stored new contact:`, {
            contact_id: contactRecord.id,
            business_id: contactRecord.business_id,
            phone: contactRecord.phone ? '***' + contactRecord.phone.slice(-4) : 'none',
          })
        }
      }
    }

    // Additional deduplication: Check recent review requests for this phone number
    if (validatedData.phone) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      
      const { data: recentRequests } = await supabase
        .from('review_requests')
        .select(`
          id,
          created_at,
          primary_sent,
          campaigns!inner (
            id,
            business_id,
            businesses!inner (
              id,
              business_name
            )
          )
        `)
        .eq('customer_phone', validatedData.phone)
        .gte('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentRequests && recentRequests.length > 0) {
        const recent = recentRequests[0]
        const recentCampaign = Array.isArray(recent.campaigns) ? recent.campaigns[0] : recent.campaigns
        const recentBusiness = Array.isArray(recentCampaign?.businesses) ? recentCampaign?.businesses[0] : recentCampaign?.businesses
        
        console.log(`[${requestId}] DUPLICATE DETECTED: Phone ${validatedData.phone ? '***' + validatedData.phone.slice(-4) : 'none'} already received message from ${recentBusiness?.business_name} at ${recent.created_at}`)
        console.log(`[${requestId}] Current request is for business: ${business.business_name}`)
        
        return NextResponse.json(
          { 
            success: false,
            error: `Duplicate request: A review request was already sent to this phone number in the last 5 minutes by ${recentBusiness?.business_name || 'another business'}`,
            review_request_id: recent.id,
            primary_sent: recent.primary_sent,
            request_id: requestId,
          },
          { status: 409 }
        )
      }
    }

    // Send review request using internal function
    // This will ONLY send for the authenticated user's business
    console.log(`[${requestId}] Calling sendReviewRequestInternal with:`, {
      campaignId: campaign.id,
      campaign_name: campaign.name,
      business_name: business.business_name,
      first_name: validatedData.first_name,
      phone: validatedData.phone ? '***' + validatedData.phone.slice(-4) : 'none',
    })

    const result = await sendReviewRequestInternal({
      campaignId: campaign.id, // Use UUID - this campaign belongs to userBusiness.id
      firstName: validatedData.first_name,
      phone: validatedData.phone,
      email: validatedData.email,
    })

    console.log(`[${requestId}] sendReviewRequestInternal result:`, {
      success: result.success,
      primary_sent: result.primary_sent,
      error: result.error,
      review_request_id: result.review_request_id,
    })

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || 'Failed to send review request',
          primary_sent: result.primary_sent || false,
          review_request_id: result.review_request_id,
        },
        { status: 500 }
      )
    }

    // Even if result.success is true, check if primary_sent is false
    if (!result.primary_sent) {
      console.warn('Review request created but primary channel not sent:', {
        review_request_id: result.review_request_id,
        error: result.error,
      })
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Review request created but message not sent',
          primary_sent: false,
          review_request_id: result.review_request_id,
        },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    console.log(`[${requestId}] ========== WEBHOOK COMPLETE (${duration}ms) ==========`)

    return NextResponse.json({
      success: true,
      review_request_id: result.review_request_id,
      primary_sent: result.primary_sent,
      request_id: requestId,
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[${requestId}] ========== WEBHOOK ERROR (${duration}ms) ==========`, error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error(`[${requestId}] Zapier webhook error:`, error)
    return NextResponse.json(
      { error: error.message || 'Internal server error', request_id: requestId },
      { status: 500 }
    )
  }
}
