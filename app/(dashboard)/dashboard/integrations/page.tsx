import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'

async function getCampaigns() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) return []

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, name, campaign_id')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  return campaigns || []
}

export default async function IntegrationsPage() {
  const campaigns = await getCampaigns()
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/zapier/review-request`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-1">
          Connect FiveStars with your favorite tools via Zapier
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zapier Integration</CardTitle>
          <CardDescription>
            Automate review requests by connecting FiveStars to your CRM, POS, or other tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input value={webhookUrl} readOnly className="font-mono text-sm" />
              <CopyToClipboard text={webhookUrl} />
            </div>
            <p className="text-xs text-muted-foreground">
              Use this URL as a webhook action in your Zapier Zap
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Available Campaigns</h3>
            {campaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No campaigns found. Create a campaign first to use with Zapier.
              </p>
            ) : (
              <div className="space-y-2">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        Campaign ID: {campaign.campaign_id}
                      </p>
                    </div>
                    <CopyToClipboard text={campaign.campaign_id} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold">Zapier Webhook Setup</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">1. Create a Webhook by Zapier Action</p>
                <p className="text-muted-foreground">
                  In your Zapier Zap, add a &quot;Webhooks by Zapier&quot; action and choose
                  &quot;POST&quot; as the method.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">2. Configure the Webhook</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>URL: Use the webhook URL above</li>
                  <li>Method: POST</li>
                  <li>
                    Data: Send a JSON object with: campaign_id, first_name, phone (optional), email
                    (optional)
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">3. Example JSON Payload</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(
                    {
                      campaign_id: 'your-campaign-id',
                      first_name: 'John',
                      phone: '+1234567890',
                      email: 'john@example.com',
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold">Example Zap Templates</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>When a new customer is created in HubSpot</strong> → Send review request
                from FiveStars
              </p>
              <p>
                <strong>When a job is completed in Jobber</strong> → Send review request from
                FiveStars
              </p>
              <p>
                <strong>When a sale is made in Square</strong> → Send review request from FiveStars
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
