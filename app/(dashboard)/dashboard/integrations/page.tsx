import { createClient } from '@/lib/supabase/server'
import Script from 'next/script'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function IntegrationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Verify user has a business (required for Zapier integration)
  const { data: business } = await supabase
    .from('businesses')
    .select('id, business_name')
    .eq('user_id', user.id)
    .single()

  if (!business) {
    return (
      <div className="animate-fade-in w-full">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-amber-800 font-medium">
            Please complete your business profile setup before connecting Zapier.
          </p>
        </div>
      </div>
    )
  }

  // Check if user has existing OAuth tokens (connected Zapier account)
  const adminSupabase = createAdminClient()
  const { data: existingTokens } = await adminSupabase
    .from('oauth_tokens')
    .select('id, created_at, expires_at')
    .eq('user_id', user.id)
    .eq('client_id', 'zapier')
    .order('created_at', { ascending: false })
    .limit(1)

  // Try to get user details
  const email = user.email || ''
  const name = user.user_metadata?.full_name || ''
  const [firstName, lastName] = name.split(' ')

  return (
    <div className="animate-fade-in w-full">
      <Script 
        type="module" 
        src="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.esm.js"
        strategy="lazyOnload"
      />
      <link rel="stylesheet" href="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.css"/>

      {/* User context info - ensures each user sees their own connection */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-900 mb-1">Your Zapier Connection</p>
        <p>Connected as: <span className="font-mono text-xs">{email}</span></p>
        <p>Business: <span className="font-semibold">{business.business_name}</span></p>
        {existingTokens && existingTokens.length > 0 && (
          <p className="mt-2 text-green-600">
            ✓ Zapier account connected
          </p>
        )}
      </div>

      <div className="min-h-[600px]">
        <zapier-workflow
          sign-up-email={email}
          sign-up-first-name={firstName || ''}
          sign-up-last-name={lastName || ''}
          client-id="lXzMag97Ld8abTu8pXusknAywkqdo1nFzW3Ftw51"
          theme="light"
          intro-copy-display="show"
          guess-zap-display="show"
        />
      </div>
    </div>
  )
}
