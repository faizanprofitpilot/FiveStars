import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Megaphone, MessageSquare, TrendingUp } from 'lucide-react'

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-600 mt-2 text-sm">
            Overview of your review request automation
          </p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Total Requests
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Megaphone className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalRequests}</div>
            <p className="text-xs text-slate-500">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              SMS Sent
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{smsCount}</div>
            <p className="text-xs text-slate-500">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Emails Sent
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{emailCount}</div>
            <p className="text-xs text-slate-500">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Active Campaigns
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{campaignCount}</div>
            <p className="text-xs text-slate-500">
              Total campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {campaignCount === 0 && (
        <Card className="border-amber-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Get Started</CardTitle>
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
      )}
    </div>
  )
}