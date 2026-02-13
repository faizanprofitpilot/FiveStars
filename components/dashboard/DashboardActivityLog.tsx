'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, MessageSquare, Mail, ArrowRight, Trash2, Loader2 } from 'lucide-react'
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

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DashboardActivityLogProps {
  dateRange?: DateRange
}

export function DashboardActivityLog({ dateRange }: DashboardActivityLogProps) {
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const params = new URLSearchParams()
        if (dateRange?.from) {
          params.set('from', dateRange.from.toISOString())
        }
        if (dateRange?.to) {
          params.set('to', dateRange.to.toISOString())
        }

        const response = await fetch(`/api/dashboard/activity?${params.toString()}`)
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
  }, [dateRange])

  const getStatusBadge = (request: ReviewRequest) => {
    if (request.primary_sent) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Sent
        </Badge>
      )
    }
    if (request.error_message && !request.error_message.includes('Twilio status:')) {
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

  const handleDelete = async (requestId: string) => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/review-requests/${requestId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete review request')
      }

      // Remove from local state
      setRequests(requests.filter(r => r.id !== requestId))
      setDeleteDialogOpen(null)
    } catch (error: any) {
      console.error('Delete error:', error)
      alert(error.message || 'Failed to delete review request')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <CardHeader className="text-left">
          <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 text-left">Recent Activity</CardTitle>
          <CardDescription className="text-slate-500 text-left">Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">Recent Activity</CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              Latest review requests across all campaigns
            </CardDescription>
          </div>
          {requests.length > 0 && (
            <Link href="/dashboard/campaigns" className="shrink-0 ml-4">
              <Badge variant="outline" className="border-gray-200 text-slate-600 hover:border-amber-200 hover:text-amber-600 transition-colors cursor-pointer">
                View All
                <ArrowRight className="h-3 w-3 ml-1" />
              </Badge>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-left">
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
              <div
                key={request.id}
                className="relative border border-gray-100 rounded-lg p-4 hover:border-amber-200 hover:bg-amber-50/30 transition-all group"
              >
                <Link
                  href={`/dashboard/campaigns/${request.campaign_id}`}
                  className="block"
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
                    <div className="shrink-0 ml-2 flex items-center gap-2">
                      {getStatusBadge(request)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setDeleteDialogOpen(request.id)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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

                <Dialog open={deleteDialogOpen === request.id} onOpenChange={(open) => !open && setDeleteDialogOpen(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Review Request</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this review request for <span className="font-semibold text-slate-900">{request.customer_first_name}</span>?
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(null)}
                        disabled={deleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(request.id)}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
