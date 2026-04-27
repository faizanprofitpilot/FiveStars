import { createClient } from '@/lib/supabase/server'
import Script from 'next/script'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  // CRITICAL: Use createClient() NOT createAdminClient() to respect RLS policies
  // RLS will automatically filter to only this user's tokens
  const { data: existingTokens } = await supabase
    .from('oauth_tokens')
    .select('id, created_at, expires_at')
    .eq('client_id', 'zapier')
    .order('created_at', { ascending: false })
    .limit(1)

  // Try to get user details
  const email = user.email || ''
  const name = user.user_metadata?.full_name || ''
  const [firstName, lastName] = name.split(' ')

  const templates: Array<{
    id: string
    title: string
    description: string
    href: string
  }> = [
    {
      id: 'hubspot',
      title: 'HubSpot → FiveStars',
      description: 'Send a review request from a HubSpot contact event.',
      href: 'https://api.zapier.com/v1/embed/fivestars/create?steps[0][app]=HubSpotCLIAPI@latest&steps[0][action]=contactList&steps[1][app]=App234136CLIAPI@latest&steps[1][action]=send_review_request',
    },
    {
      id: 'salesforce',
      title: 'Salesforce → FiveStars',
      description: 'Send a review request when a Salesforce contact is created.',
      href: 'https://api.zapier.com/v1/embed/fivestars/create?steps[0][app]=SalesforceCLIAPI@latest&steps[0][action]=new_contact&steps[1][app]=App234136CLIAPI@latest&steps[1][action]=send_review_request',
    },
    {
      id: 'shopify',
      title: 'Shopify → FiveStars',
      description: 'Send a review request when a Shopify customer is created.',
      href: 'https://api.zapier.com/v1/embed/fivestars/create?steps[0][app]=ShopifyCLIAPI@latest&steps[0][action]=new_customer&steps[1][app]=App234136CLIAPI@latest&steps[1][action]=send_review_request',
    },
    {
      id: 'square',
      title: 'Square → FiveStars',
      description: 'Send a review request when a Square customer is created.',
      href: 'https://api.zapier.com/v1/embed/fivestars/create?steps[0][app]=SquareCLIAPI@latest&steps[0][action]=customer&steps[1][app]=App234136CLIAPI@latest&steps[1][action]=send_review_request',
    },
    {
      id: 'stripe',
      title: 'Stripe → FiveStars',
      description: 'Send a review request when a Stripe customer is created.',
      href: 'https://api.zapier.com/v1/embed/fivestars/create?steps[0][app]=StripeCLIAPI@latest&steps[0][action]=new_customer&steps[1][app]=App234136CLIAPI@latest&steps[1][action]=send_review_request',
    },
    {
      id: 'jobber',
      title: 'Jobber → FiveStars',
      description: 'Send a review request when a Jobber client event occurs.',
      href: 'https://api.zapier.com/v1/embed/fivestars/create?steps[0][app]=JobberCLIAPI@latest&steps[0][action]=clientHook&steps[1][app]=App234136CLIAPI@latest&steps[1][action]=send_review_request',
    },
    {
      id: 'housecall-pro',
      title: 'Housecall Pro → FiveStars',
      description: 'Send a review request when a job is finished in Housecall Pro.',
      href: 'https://api.zapier.com/v1/embed/fivestars/create?steps[0][app]=HousecallProCLIAPI@latest&steps[0][action]=newFinishedJob&steps[1][app]=App234136CLIAPI@latest&steps[1][action]=send_review_request',
    },
  ]

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

      <div className="mb-6">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Popular templates</p>
            <p className="text-xs text-gray-600">
              Start with a pre-built workflow, then map fields and pick a campaign.
            </p>
          </div>
          <Link href="https://api.zapier.com/v1/embed/fivestars/create" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              Browse all
            </Button>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id} className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3">{t.description}</p>
                <Link href={t.href} target="_blank" rel="noreferrer">
                  <Button className="w-full" size="sm">
                    Use template
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
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
