import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BillingActions } from '@/components/billing/BillingActions'

export const dynamic = 'force-dynamic'

function isActiveStatus(status?: string | null) {
  return status === 'active' || status === 'trialing'
}

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sub } = await supabase
    .from('billing_subscriptions')
    .select('status, current_period_end, cancel_at_period_end, price_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const active = isActiveStatus(sub?.status)
  const proPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY || null

  const planName = active ? 'Pro' : 'Free'
  const statusText = sub?.status ? sub.status.replace('_', ' ') : 'none'

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Billing</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-2xl">
          Manage your plan and payment details.
        </p>
      </div>

      <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-gray-100 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Current plan</CardTitle>
              <CardDescription className="text-slate-500 mt-0.5">
                Your subscription status and renewal details.
              </CardDescription>
            </div>
            <Badge className={active ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-slate-700 hover:bg-slate-700'}>
              {planName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <p className="text-xs text-slate-500">Status</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {active ? 'Active' : 'Not active'}{' '}
                <span className="text-xs font-normal text-slate-500">({statusText})</span>
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <p className="text-xs text-slate-500">Renews / ends</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '—'}
              </p>
              {sub?.cancel_at_period_end && (
                <p className="text-xs text-amber-700 mt-1">Cancels at period end</p>
              )}
            </div>
          </div>

          <BillingActions hasActiveSubscription={active} proPriceId={proPriceId} />

          <div className="rounded-lg border border-gray-100 bg-slate-50 p-4 text-xs text-slate-600">
            <p className="font-medium text-slate-900 mb-1">Notes</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Upgrades are handled through Stripe Checkout.</li>
              <li>Manage payment methods and cancellations in the billing portal.</li>
              <li>Webhook updates keep your plan status in sync.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

