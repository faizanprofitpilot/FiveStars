import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CampaignTabs } from '@/components/campaigns/CampaignTabs'
import { DeleteCampaignButton } from '@/components/campaigns/DeleteCampaignButton'

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch campaign
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      businesses!inner (
        id,
        user_id
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !campaign) {
    redirect('/dashboard/campaigns')
  }

  // Verify ownership
  if (campaign.businesses.user_id !== user.id) {
    redirect('/dashboard/campaigns')
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="pb-6 border-b border-gray-100 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/dashboard/campaigns">
            <Button variant="outline" size="icon" className="h-9 w-9 border-gray-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{campaign.name}</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Campaign ID: <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-xs ml-1">{campaign.campaign_id}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <DeleteCampaignButton 
            campaignId={campaign.id} 
            campaignName={campaign.name}
          />
        </div>
      </div>

      {/* Campaign Tabs */}
      <CampaignTabs
        campaign={{
          id: campaign.id,
          name: campaign.name,
          campaign_id: campaign.campaign_id,
          primary_channel: campaign.primary_channel,
          secondary_channel: campaign.secondary_channel,
          primary_template: campaign.primary_template,
          followup_template: campaign.followup_template,
          followup_enabled: campaign.followup_enabled,
          followup_delay: campaign.followup_delay,
        }}
      />
    </div>
  )
}
