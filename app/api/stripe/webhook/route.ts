import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

function unwrapStripeResponse<T>(obj: any): T {
  return (obj && typeof obj === 'object' && 'data' in obj ? (obj as any).data : obj) as T
}

function toTimestamp(dateOrNull: number | null): string | null {
  if (!dateOrNull) return null
  return new Date(dateOrNull * 1000).toISOString()
}

export async function POST(req: Request) {
  const stripe = getStripeServer()
  const admin = createAdminClient()

  const sig = (await headers()).get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing Stripe webhook configuration' }, { status: 400 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = (session.metadata?.supabase_user_id || session.client_reference_id) as string | undefined
        const customerId = session.customer as string | null
        const subscriptionId = session.subscription as string | null

        if (userId && customerId) {
          await admin.from('billing_customers').upsert({
            user_id: userId,
            stripe_customer_id: customerId,
          })
        }

        if (userId && customerId && subscriptionId) {
          const subscriptionResp = await stripe.subscriptions.retrieve(subscriptionId)
          const subscription = unwrapStripeResponse<Stripe.Subscription>(subscriptionResp)
          const priceId = subscription.items.data[0]?.price?.id || null

          await admin.from('billing_subscriptions').upsert(
            {
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              price_id: priceId,
              current_period_end: toTimestamp(((subscription as any).current_period_end ?? null) as number | null),
              cancel_at_period_end: Boolean((subscription as any).cancel_at_period_end),
            },
            { onConflict: 'stripe_subscription_id' }
          )
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        const userId = (sub.metadata?.supabase_user_id as string | undefined) || undefined
        const priceId = sub.items.data[0]?.price?.id || null

        // If we don't have user_id in metadata, try to look it up by customer id
        let resolvedUserId = userId
        if (!resolvedUserId) {
          const { data } = await admin
            .from('billing_customers')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single()
          resolvedUserId = data?.user_id
        }

        if (resolvedUserId) {
          await admin.from('billing_subscriptions').upsert(
            {
              user_id: resolvedUserId,
              stripe_customer_id: customerId,
              stripe_subscription_id: sub.id,
              status: sub.status,
              price_id: priceId,
              current_period_end: toTimestamp(((sub as any).current_period_end ?? null) as number | null),
              cancel_at_period_end: Boolean((sub as any).cancel_at_period_end),
            },
            { onConflict: 'stripe_subscription_id' }
          )
        }
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json({ error: err.message || 'Webhook handler failed' }, { status: 500 })
  }
}

