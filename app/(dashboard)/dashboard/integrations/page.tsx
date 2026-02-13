import { createClient } from '@/lib/supabase/server'
import Script from 'next/script'

export default async function IntegrationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

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
