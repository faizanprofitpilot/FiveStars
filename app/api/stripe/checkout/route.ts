import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripeServer } from '@/lib/stripe/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  price_id: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = schema.parse(await req.json())

    const stripe = getStripeServer()
    const admin = createAdminClient()

    // Fetch or create Stripe customer for this user
    const { data: existingCustomer } = await admin
      .from('billing_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = existingCustomer?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await admin.from('billing_customers').upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
      })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: body.price_id, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard/billing?success=1`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=1`,
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id },
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

