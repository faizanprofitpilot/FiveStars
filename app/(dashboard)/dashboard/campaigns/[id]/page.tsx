import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CampaignForm } from '@/components/campaigns/CampaignForm'

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
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Campaign</h1>
        <p className="text-slate-600 mt-2 text-sm">
          Update your campaign settings
        </p>
      </div>
      <CampaignForm
        campaign={{
          id: campaign.id,
          name: campaign.name,
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
