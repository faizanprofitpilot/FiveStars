'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Megaphone, MessageSquare, TrendingUp } from 'lucide-react'
import { DashboardActivityLog } from '@/components/dashboard/DashboardActivityLog'
import { DateRangePicker } from '@/components/dashboard/DateRangePicker'
import { format } from 'date-fns'

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DashboardStats {
  totalRequests: number
  smsCount: number
  emailCount: number
  campaignCount: number
}

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    smsCount: 0,
    emailCount: 0,
    campaignCount: 0,
  })
  const [loading, setLoading] = useState(true)
  
  // Default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 30)
    return { from, to }
  })

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (dateRange.from) {
          params.set('from', dateRange.from.toISOString())
        }
        if (dateRange.to) {
          params.set('to', dateRange.to.toISOString())
        }

        const response = await fetch(`/api/dashboard/stats?${params.toString()}`)
        const data = await response.json()
        if (data) {
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [dateRange])

  const getDateRangeLabel = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    }
    return 'Last 30 days'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-end justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-2xl">
            Track your review automation performance and campaign metrics.
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

      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        <span className="text-sm text-slate-500">
          Showing data for: <span className="font-medium text-slate-700">{getDateRangeLabel()}</span>
        </span>
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
            <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              {loading ? '...' : stats.totalRequests}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {getDateRangeLabel()}
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
            <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              {loading ? '...' : stats.smsCount}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {getDateRangeLabel()}
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
            <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              {loading ? '...' : stats.emailCount}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {getDateRangeLabel()}
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
            <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              {loading ? '...' : stats.campaignCount}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Total campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Log */}
      <DashboardActivityLog dateRange={dateRange} />

      {/* Empty State */}
      {!loading && stats.campaignCount === 0 && (
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
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
