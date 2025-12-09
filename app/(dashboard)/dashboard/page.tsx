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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your review request automation
          </p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SMS Sent
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smsCount}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Emails Sent
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailCount}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignCount}</div>
            <p className="text-xs text-muted-foreground">
              Total campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {campaignCount === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Create your first campaign to start automating review requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/campaigns/new">
              <Button>
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