import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { Plus, ArrowRight, Megaphone } from 'lucide-react'

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
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex items-end justify-between pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Campaigns</h1>
            <p className="text-slate-500 mt-2 text-sm max-w-2xl">
              Manage your review request campaigns and track their performance.
            </p>
          </div>
          <Link href="/dashboard/campaigns/new">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/30">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Campaigns Grid or Empty State */}
        {!campaignList || campaignList.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 shadow-none">
            <CardHeader className="text-center py-16">
              <div className="mx-auto h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mb-4 ring-1 ring-amber-100">
                <Megaphone className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl text-slate-900 font-semibold">No campaigns yet</CardTitle>
              <CardDescription className="text-slate-500 max-w-sm mx-auto mt-2">
                Create your first campaign to start automating review requests and growing your business.
              </CardDescription>
              <div className="mt-8">
                <Link href="/dashboard/campaigns/new">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm h-11 px-8">
                    Create Campaign
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaignList.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
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
