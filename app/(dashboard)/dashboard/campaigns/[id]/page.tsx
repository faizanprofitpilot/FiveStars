import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CampaignTabs } from '@/components/campaigns/CampaignTabs'

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/campaigns">
            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campaign Details</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage your campaign settings and view activity
            </p>
          </div>
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
