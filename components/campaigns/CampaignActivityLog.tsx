'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Clock, MessageSquare, Mail, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ReviewRequest {
  id: string
  customer_first_name: string
  customer_phone: string | null
  customer_email: string | null
  primary_channel: string | null
  primary_sent: boolean
  secondary_sent: boolean
  error_message: string | null
  sent_at: string | null
  created_at: string
}

interface CampaignActivityLogProps {
  campaignId: string
}

export function CampaignActivityLog({ campaignId }: CampaignActivityLogProps) {
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/requests`)
        const data = await response.json()
        if (data.requests) {
          setRequests(data.requests)
        }
      } catch (error) {
        console.error('Error fetching review requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRequests, 30000)
    return () => clearInterval(interval)
  }, [campaignId])

  const getStatusBadge = (request: ReviewRequest) => {
    if (request.primary_sent) {
      // Check Twilio status from error_message
      const twilioStatusMatch = request.error_message?.match(/Twilio status: (\w+)/)
      const twilioStatus = twilioStatusMatch ? twilioStatusMatch[1] : null
      
      // If status is "delivered", show as delivered
      if (twilioStatus === 'delivered' || (!request.error_message && request.primary_sent)) {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        )
      }
      
      // If status is queued/sent, show in progress
      if (twilioStatus && ['queued', 'sending', 'sent'].includes(twilioStatus)) {
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      }
      
      // Default to accepted if sent but no status info
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Accepted
        </Badge>
      )
    }
    if (request.error_message) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      )
    }
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
  }

  const getChannelIcon = (channel: string | null) => {
    if (channel === 'sms') {
      return <MessageSquare className="h-4 w-4 text-blue-600" />
    }
    if (channel === 'email') {
      return <Mail className="h-4 w-4 text-purple-600" />
    }
    return null
  }

  if (loading) {
    return (
      <Card className="border-amber-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Activity Log</CardTitle>
          <CardDescription className="text-slate-600">Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-slate-900">Activity Log</CardTitle>
            <CardDescription className="text-slate-600">
              All review requests sent through this campaign
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-amber-300 text-slate-700">
            {requests.length} {requests.length === 1 ? 'request' : 'requests'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 font-medium">No activity yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Review requests sent through Zapier will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border border-amber-200 rounded-lg p-4 hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600 font-semibold text-sm">
                        {request.customer_first_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{request.customer_first_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {request.primary_channel && getChannelIcon(request.primary_channel)}
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(request)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-amber-100">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Contact Info</p>
                    <div className="space-y-2">
                      {request.customer_phone && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <p className="text-sm text-slate-700 font-mono">{request.customer_phone}</p>
                        </div>
                      )}
                      {request.customer_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-purple-600" />
                          <p className="text-sm text-slate-700">{request.customer_email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Delivery Status</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {request.primary_sent ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <p className="text-sm text-slate-700">
                          Primary: <span className={request.primary_sent ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                            {request.primary_sent ? 'Sent' : 'Not sent'}
                          </span>
                        </p>
                      </div>
                      {request.sent_at && (
                        <p className="text-xs text-slate-500 ml-6">
                          {new Date(request.sent_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Zapier Data</p>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600">
                        Received: {new Date(request.created_at).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-600">
                        Channel: <span className="font-medium">{request.primary_channel?.toUpperCase() || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {request.error_message && (
                  <div className="mt-3 pt-3 border-t border-red-200 bg-red-50/50 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-red-900 mb-1 uppercase tracking-wide">Error Details</p>
                        <p className="text-sm text-red-700 font-mono bg-red-100/50 p-2 rounded border border-red-200">
                          {request.error_message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {request.primary_sent && request.sent_at && (
                  <div className="mt-3 pt-3 border-t border-amber-200 bg-amber-50/30 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-amber-900 mb-1">Message Accepted by Twilio</p>
                        <p className="text-xs text-amber-700 mb-2">
                          Accepted at {new Date(request.sent_at).toLocaleString()}
                        </p>
                        {request.error_message && request.error_message.includes('Twilio status:') && (() => {
                          const twilioStatusMatch = request.error_message.match(/Twilio status: (\w+)/)
                          const twilioStatus = twilioStatusMatch ? twilioStatusMatch[1] : null
                          
                          // Only show warning if status is queued or sent (not delivered)
                          if (twilioStatus && ['queued', 'sending', 'sent'].includes(twilioStatus)) {
                            return (
                              <div className="mt-2 pt-2 border-t border-amber-200">
                                <p className="text-xs text-amber-800 font-medium mb-1">⚠️ Important:</p>
                                <p className="text-xs text-amber-700">
                                  {request.error_message}
                                </p>
                                <p className="text-xs text-amber-600 mt-1 italic">
                                  If you didn&apos;t receive the message, it may still be queued or the carrier may have blocked it.
                                </p>
                              </div>
                            )
                          }
                          return null
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

