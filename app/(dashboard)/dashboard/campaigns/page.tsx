import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default async function CampaignsPage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
      return null
    }

    // Get user's business - handle errors gracefully
    let business
    try {
      const { data, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (businessError || !data) {
        redirect('/onboarding')
        return null
      }
      business = data
    } catch (error) {
      console.error('Database error in campaigns page:', error)
      redirect('/onboarding')
      return null
    }

    // Get campaigns - handle errors gracefully
    let campaignList: any[] = []
    try {
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id, name, primary_channel, campaign_id, created_at')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })

      campaignList = campaignsError ? [] : (campaigns || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      campaignList = []
    }

    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campaigns</h1>
            <p className="text-slate-600 mt-2 text-sm">
              Manage your review request campaigns
            </p>
          </div>
          <Link href="/dashboard/campaigns/new">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Campaigns Grid or Empty State */}
        {!campaignList || campaignList.length === 0 ? (
          <Card className="border-amber-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">No campaigns yet</CardTitle>
              <CardDescription className="text-slate-600">
                Create your first campaign to start automating review requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/campaigns/new">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaignList.map((campaign) => (
              <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`}>
                <Card className="border-amber-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900">{campaign.name}</CardTitle>
                    <CardDescription className="text-slate-600">
                      Primary: {campaign.primary_channel?.toUpperCase() || 'None'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-slate-500 font-mono">
                      ID: {campaign.campaign_id}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Unexpected error in campaigns page:', error)
    // Redirect to dashboard on any unexpected error
    redirect('/dashboard')
    return null
  }
}