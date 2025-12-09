import { createClient } from '@/lib/supabase/server'
import { scrapeGoogleProfile } from '@/lib/scraper/google-profile'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const onboardingSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  google_profile_url: z.string().url().optional().or(z.literal('')),
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
    const validatedData = onboardingSchema.parse(body)

    // Check if business already exists
    const { data: existingBusiness } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let contextDocument: string | null = null

    // Scrape Google profile if URL provided (non-blocking, optional feature)
    if (validatedData.google_profile_url && validatedData.google_profile_url.trim()) {
      try {
        // Wrap scraping in a promise race with timeout to prevent hanging
        const scrapePromise = scrapeGoogleProfile(validatedData.google_profile_url)
        const timeoutPromise = new Promise<{ success: false; error: string }>((resolve) =>
          setTimeout(() => resolve({ success: false, error: 'Scraping timeout' }), 10000)
        )
        
        const scrapeResult = await Promise.race([scrapePromise, timeoutPromise])
        
        if (scrapeResult && scrapeResult.success && scrapeResult.contextDocument) {
          contextDocument = scrapeResult.contextDocument
        }
        // Continue even if scraping fails - context document will remain null
      } catch (scrapeError: any) {
        // Silently fail - scraping is optional
        console.log('Google profile scraping skipped (optional feature):', scrapeError?.message || 'Scraping unavailable')
        // Continue without scraping result - context document will remain null
      }
    }

    const businessData = {
      business_name: validatedData.business_name,
      google_profile_url: validatedData.google_profile_url || null,
      context_document: contextDocument || null, // Only create context document if Google Maps link provided and scraping succeeded
    }

    let business
    let businessError

    if (existingBusiness) {
      // Update existing business
      const { data, error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', existingBusiness.id)
        .select()
        .single()

      business = data
      businessError = error
    } else {
      // Create new business
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          user_id: user.id,
          ...businessData,
        })
        .select()
        .single()

      business = data
      businessError = error
    }

    if (businessError) {
      console.error('Business operation error:', businessError)
      
      // Provide more specific error messages
      if (businessError.code === '23505') {
        return NextResponse.json(
          { error: 'A business profile already exists for this account' },
          { status: 409 }
        )
      }

      if (businessError.code === '42P01') {
        return NextResponse.json(
          { error: 'Database table not found. Please run the database schema migration.' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Failed to save business profile',
          details: businessError.message || 'Database error'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, business }, { status: existingBusiness ? 200 : 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Onboarding error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
