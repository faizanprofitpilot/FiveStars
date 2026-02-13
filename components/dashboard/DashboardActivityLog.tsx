'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, MessageSquare, Mail, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ReviewRequest {
  id: string
  customer_first_name: string
  customer_phone: string | null
  customer_email: string | null
  primary_channel: string | null
  primary_sent: boolean
  error_message: string | null
  sent_at: string | null
  created_at: string
  campaign_id: string
  campaign_name?: string
}

export function DashboardActivityLog() {
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch('/api/dashboard/activity')
        const data = await response.json()
        if (data.requests) {
          setRequests(data.requests)
        }
      } catch (error) {
        console.error('Error fetching activity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRequests, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (request: ReviewRequest) => {
    if (request.primary_sent) {
      const twilioStatusMatch = request.error_message?.match(/Twilio status: (\w+)/)
      const twilioStatus = twilioStatusMatch ? twilioStatusMatch[1] : null
      
      if (twilioStatus === 'delivered' || (!request.error_message && request.primary_sent)) {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        )
      }
      
      if (twilioStatus && ['queued', 'sending', 'sent'].includes(twilioStatus)) {
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      }
      
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Accepted
        </Badge>
      )
    }
    if (request.error_message) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      )
    }
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
  }

  const getChannelIcon = (channel: string | null) => {
    if (channel === 'sms') {
      return <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
    }
    if (channel === 'email') {
      return <Mail className="h-3.5 w-3.5 text-purple-600" />
    }
    return null
  }

  if (loading) {
    return (
      <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">Recent Activity</CardTitle>
          <CardDescription className="text-slate-500">Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <CardHeader className="flex items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">Recent Activity</CardTitle>
          <CardDescription className="text-slate-500 mt-1">
            Latest review requests across all campaigns
          </CardDescription>
        </div>
        {requests.length > 0 && (
          <Link href="/dashboard/campaigns">
            <Badge variant="outline" className="border-gray-200 text-slate-600 hover:border-amber-200 hover:text-amber-600 transition-colors cursor-pointer">
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Badge>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 font-medium">No activity yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Review requests sent through your campaigns will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <Link
                key={request.id}
                href={`/dashboard/campaigns/${request.campaign_id}`}
                className="block border border-gray-100 rounded-lg p-4 hover:border-amber-200 hover:bg-amber-50/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <span className="text-amber-600 font-semibold text-sm">
                        {request.customer_first_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 truncate">{request.customer_first_name}</p>
                        {request.primary_channel && getChannelIcon(request.primary_channel)}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {request.campaign_name && (
                          <span className="text-xs text-slate-500 truncate">{request.campaign_name}</span>
                        )}
                        <span className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 ml-2">
                    {getStatusBadge(request)}
                  </div>
                </div>
                
                {(request.customer_phone || request.customer_email) && (
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    {request.customer_phone && (
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                        <p className="text-xs text-slate-600 font-mono">{request.customer_phone}</p>
                      </div>
                    )}
                    {request.customer_email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <p className="text-xs text-slate-600 truncate">{request.customer_email}</p>
                      </div>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
