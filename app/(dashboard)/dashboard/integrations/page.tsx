import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'
import { Badge } from '@/components/ui/badge'
import { Plug, Zap, CheckCircle2 } from 'lucide-react'

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
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Integrations</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-2xl">
          Connect FiveStars with your favorite CRM, POS, or other tools to automate review requests.
        </p>
      </div>

      <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-amber-100/50 p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#FF4F00]">
              <Zap className="h-6 w-6 fill-current" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Zapier Integration</CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                Connect with 5,000+ apps without writing any code
              </CardDescription>
            </div>
          </div>
        </div>
        
        <CardContent className="space-y-8 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-slate-900">Webhook URL</Label>
              <Badge variant="outline" className="bg-slate-50 text-slate-500 font-normal">
                Method: POST
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input 
                value={webhookUrl} 
                readOnly 
                className="font-mono text-sm bg-slate-50 border-gray-200 text-slate-600 h-11" 
              />
              <div className="shrink-0">
                <CopyToClipboard text={webhookUrl} />
              </div>
            </div>
            <p className="text-sm text-slate-500 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Use this URL as a &quot;Webhooks by Zapier&quot; action to trigger review requests automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Plug className="h-4 w-4 text-slate-400" />
                Available Campaigns
              </h3>
              {campaigns.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center bg-slate-50/50">
                  <p className="text-sm text-slate-500">
                    No campaigns found. Create a campaign first to use with Zapier.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="group flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-amber-200 hover:bg-amber-50/30 transition-all bg-white shadow-sm"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-medium text-slate-900 truncate">{campaign.name}</p>
                        <p className="text-xs text-slate-500 font-mono truncate mt-0.5">
                          {campaign.campaign_id}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyToClipboard text={campaign.campaign_id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Setup Instructions</h3>
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-lg bg-slate-50 border border-gray-100">
                  <p className="font-medium text-slate-900 mb-2">1. Create Webhook Action</p>
                  <p className="text-slate-600">
                    Add a &quot;Webhooks by Zapier&quot; action and choose &quot;POST&quot; as the event.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-slate-50 border border-gray-100">
                  <p className="font-medium text-slate-900 mb-2">2. Configure Payload</p>
                  <p className="text-slate-600 mb-2">
                    Set the URL to the webhook above and add these fields to the Data section:
                  </p>
                  <ul className="space-y-1.5 text-slate-600 font-mono text-xs bg-white p-3 rounded border border-gray-100">
                    <li className="flex justify-between"><span>campaign_id</span> <span className="text-amber-600">Required</span></li>
                    <li className="flex justify-between"><span>first_name</span> <span className="text-amber-600">Required</span></li>
                    <li className="flex justify-between"><span>phone</span> <span className="text-slate-400">Optional</span></li>
                    <li className="flex justify-between"><span>email</span> <span className="text-slate-400">Optional</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-slate-900 mb-4">Popular Automations</h3>
            <div className="grid sm:grid-cols-3 gap-4">
               {[
                 { name: 'HubSpot', action: 'New Contact' },
                 { name: 'Square', action: 'New Transaction' },
                 { name: 'Salesforce', action: 'Opportunity Won' }
               ].map((item) => (
                 <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-slate-50/50">
                   <div className="h-8 w-8 rounded bg-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-700 border border-gray-100">
                     {item.name[0]}
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-900">{item.name}</p>
                     <p className="text-xs text-slate-500">{item.action}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
