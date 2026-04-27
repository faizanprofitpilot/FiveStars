'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

async function postJson(url: string, body?: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed')
  }
  return data
}

export function BillingActions({
  hasActiveSubscription,
  proPriceId,
}: {
  hasActiveSubscription: boolean
  proPriceId: string | null
}) {
  const [loading, setLoading] = useState<'checkout' | 'portal' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCheckout = async () => {
    if (!proPriceId) {
      setError('Missing Pro price ID (STRIPE_PRICE_PRO_MONTHLY)')
      return
    }
    setError(null)
    setLoading('checkout')
    try {
      const data = await postJson('/api/stripe/checkout', { price_id: proPriceId })
      if (data?.url) window.location.href = data.url
      else throw new Error('Missing checkout URL')
    } catch (e: any) {
      setError(e.message || 'Failed to start checkout')
      setLoading(null)
    }
  }

  const openPortal = async () => {
    setError(null)
    setLoading('portal')
    try {
      const data = await postJson('/api/stripe/portal')
      if (data?.url) window.location.href = data.url
      else throw new Error('Missing portal URL')
    } catch (e: any) {
      setError(e.message || 'Failed to open billing portal')
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {hasActiveSubscription ? (
          <Button onClick={openPortal} disabled={loading !== null} variant="outline">
            {loading === 'portal' ? 'Opening…' : 'Manage billing'}
          </Button>
        ) : (
          <Button onClick={startCheckout} disabled={loading !== null} className="bg-amber-500 hover:bg-amber-600 text-white">
            {loading === 'checkout' ? 'Redirecting…' : 'Upgrade to Pro'}
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  )
}

