import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Megaphone, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get user's business
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) {
    return null
  }

  // Get campaigns
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id')
    .eq('business_id', business.id)

  const campaignCount = campaigns?.length || 0

  // Get review requests stats (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  let totalRequests = 0
  let smsCount = 0
  let emailCount = 0

  if (campaigns && campaigns.length > 0) {
    const campaignIds = campaigns.map(c => c.id)

    // Get total requests
    const { count } = await supabase
      .from('review_requests')
      .select('*', { count: 'exact', head: true })
      .in('campaign_id', campaignIds)
      .gte('created_at', thirtyDaysAgo.toISOString())
    
    totalRequests = count || 0

    // Get SMS count
    const { count: sms } = await supabase
      .from('review_requests')
      .select('*', { count: 'exact', head: true })
      .in('campaign_id', campaignIds)
      .eq('primary_channel', 'sms')
      .eq('primary_sent', true)
      .gte('created_at', thirtyDaysAgo.toISOString())
    
    smsCount = sms || 0

    // Get email count
    const { count: email } = await supabase
      .from('review_requests')
      .select('*', { count: 'exact', head: true })
      .in('campaign_id', campaignIds)
      .eq('primary_channel', 'email')
      .eq('primary_sent', true)
      .gte('created_at', thirtyDaysAgo.toISOString())
    
    emailCount = email || 0
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-end justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-2xl">
            Track your review automation performance and campaign metrics for the last 30 days.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/campaigns/new">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/30">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-amber-600 transition-colors">
              Total Requests
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center ring-1 ring-amber-100/50 transition-transform group-hover:scale-110 duration-300">
              <Megaphone className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{totalRequests}</div>
            <p className="text-xs text-slate-400 font-medium">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-amber-600 transition-colors">
              SMS Sent
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center ring-1 ring-amber-100/50 transition-transform group-hover:scale-110 duration-300">
              <MessageSquare className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{smsCount}</div>
            <p className="text-xs text-slate-400 font-medium">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-amber-600 transition-colors">
              Emails Sent
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center ring-1 ring-amber-100/50 transition-transform group-hover:scale-110 duration-300">
              <MessageSquare className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{emailCount}</div>
            <p className="text-xs text-slate-400 font-medium">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-amber-600 transition-colors">
              Active Campaigns
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center ring-1 ring-amber-100/50 transition-transform group-hover:scale-110 duration-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{campaignCount}</div>
            <p className="text-xs text-slate-400 font-medium">
              Total campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State or Recent Activity could go here */}
      {campaignCount === 0 && (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 shadow-none">
          <CardHeader className="text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Megaphone className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle className="text-xl text-slate-900 font-semibold">No campaigns yet</CardTitle>
            <CardDescription className="text-slate-500 max-w-sm mx-auto mt-2">
              Create your first campaign to start automating review requests and growing your business.
            </CardDescription>
            <div className="mt-6">
              <Link href="/dashboard/campaigns/new">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm">
                  Create Campaign
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
