import Stripe from 'stripe'

export function getStripeServer() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }

  return new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
  })
}

