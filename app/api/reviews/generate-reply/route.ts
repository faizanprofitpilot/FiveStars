import { createClient } from '@/lib/supabase/server'
import { generateReviewReply } from '@/lib/openai/generate-reply'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const generateReplySchema = z.object({
  review_text: z.string().min(1, 'Review text is required'),
  tone: z.enum(['professional', 'friendly', 'apology', 'short']),
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
    const validatedData = generateReplySchema.parse(body)

    // Get user's business for context
    const { data: business } = await supabase
      .from('businesses')
      .select('id, context_document, business_name')
      .eq('user_id', user.id)
      .single()

    if (!business) {
      return NextResponse.json(
        { error: 'Business profile not found' },
        { status: 404 }
      )
    }

    const businessContext =
      business.context_document ||
      `This is ${business.business_name}, a local business focused on providing excellent customer service.`

    // Generate reply using OpenAI
    const result = await generateReviewReply({
      reviewText: validatedData.review_text,
      businessContext,
      tone: validatedData.tone,
    })

    if (!result.success || !result.reply) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate reply' },
        { status: 500 }
      )
    }

    // Store generated reply in database
    const { error: dbError } = await supabase.from('review_replies').insert({
      business_id: business.id,
      review_text: validatedData.review_text,
      generated_reply: result.reply,
      tone: validatedData.tone,
    })

    if (dbError) {
      console.error('Failed to save reply to database:', dbError)
      // Continue even if DB save fails - user still gets the reply
    }

    return NextResponse.json({
      success: true,
      reply: result.reply,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Generate reply error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

