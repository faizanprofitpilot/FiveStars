import { createClient } from '@/lib/supabase/server'
import Script from 'next/script'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <Script 
        type="module" 
        src="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.esm.js"
        strategy="lazyOnload"
      />
      <link rel="stylesheet" href="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.css"/>

      {/* Header Section */}
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Integrations</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-2xl">
          Connect FiveStars with 5,000+ apps to automate your review requests.
        </p>
      </div>

      <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-amber-100/50 pb-6">
          <CardTitle className="text-xl font-bold text-slate-900">Zapier Workflow Automation</CardTitle>
          <CardDescription className="text-slate-600 mt-1">
            Create automated workflows to send review requests when events happen in your other apps.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0 min-h-[600px]">
          <zapier-workflow
            sign-up-email={email}
            sign-up-first-name={firstName || ''}
            sign-up-last-name={lastName || ''}
            client-id="lXzMag97Ld8abTu8pXusknAywkqdo1nFzW3Ftw51"
            theme="light"
            intro-copy-display="show"
            guess-zap-display="show"
          />
        </CardContent>
      </Card>
    </div>
  )
}
