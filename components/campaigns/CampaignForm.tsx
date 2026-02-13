'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, MessageSquare, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CampaignFormProps {
  campaign?: {
    id: string
    name: string
    primary_channel: 'sms' | 'email' | 'none'
    secondary_channel: 'sms' | 'email' | 'none' | null
    primary_template: string
    followup_template: string | null
    followup_enabled: boolean
    followup_delay: number | null
  }
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [name, setName] = useState(campaign?.name || '')
  const [primaryChannel, setPrimaryChannel] = useState<'sms' | 'email' | 'none'>(
    campaign?.primary_channel || 'sms'
  )
  const [secondaryChannel, setSecondaryChannel] = useState<'sms' | 'email' | 'none' | 'none'>(
    campaign?.secondary_channel || 'none'
  )
  const [primaryTemplate, setPrimaryTemplate] = useState(
    campaign?.primary_template || 
    'Hi {{first_name}}, thanks for choosing {{business_name}}! If you had a great experience, we\'d love a review here: {{review_link}}.'
  )
  const [followupEnabled, setFollowupEnabled] = useState(campaign?.followup_enabled || false)
  const [followupDelay, setFollowupDelay] = useState(campaign?.followup_delay || 7)
  const [followupTemplate, setFollowupTemplate] = useState(
    campaign?.followup_template || 
    'Hi {{first_name}}, just a friendly reminder - we\'d love to hear about your experience with {{business_name}}! Leave a review here: {{review_link}}.'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = campaign 
        ? `/api/campaigns/${campaign.id}`
        : '/api/campaigns'
      
      const method = campaign ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          primary_channel: primaryChannel,
          secondary_channel: secondaryChannel === 'none' ? null : secondaryChannel,
          primary_template: primaryTemplate,
          followup_enabled: followupEnabled,
          followup_delay: followupEnabled ? followupDelay : null,
          followup_template: followupEnabled ? followupTemplate : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save campaign')
      }

      router.push('/dashboard/campaigns')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">Campaign Details</CardTitle>
            <CardDescription className="text-slate-500">
              Give your campaign a name to easily identify it in your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Campaign Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Service Follow-up Q1"
                required
                disabled={loading}
                className="max-w-md h-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-full">
          <CardHeader className="pb-4 border-b border-gray-50 bg-slate-50/30">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Primary Channel</CardTitle>
                <CardDescription className="text-slate-500 mt-0.5">Initial review request</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-3">
              <Label htmlFor="primaryChannel" className="text-slate-700 font-medium">Channel Type</Label>
              <Select
                value={primaryChannel}
                onValueChange={(value: 'sms' | 'email' | 'none') => setPrimaryChannel(value)}
                disabled={loading}
              >
                <SelectTrigger id="primaryChannel" className="h-10 border-gray-200 focus:ring-amber-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS (Text Message)</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="none">None (Disabled)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="primaryTemplate" className="text-slate-700 font-medium">Message Template</Label>
                <Badge variant="outline" className="text-[10px] font-normal text-slate-400">
                  Required
                </Badge>
              </div>
              <Textarea
                id="primaryTemplate"
                value={primaryTemplate}
                onChange={(e) => setPrimaryTemplate(e.target.value)}
                placeholder="Hi {{first_name}}, thanks for choosing {{business_name}}!"
                rows={5}
                required
                disabled={loading}
                className="resize-none border-gray-200 focus:border-amber-500 focus:ring-amber-500/20 text-sm leading-relaxed"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['{{first_name}}', '{{business_name}}', '{{review_link}}'].map((v) => (
                  <code key={v} className="text-[10px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono cursor-copy hover:bg-slate-200 transition-colors" title="Click to copy">
                    {v}
                  </code>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <CardHeader className="pb-4 border-b border-gray-50 bg-slate-50/30">
               <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Secondary Channel</CardTitle>
                  <CardDescription className="text-slate-500 mt-0.5">Optional fallback channel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Label htmlFor="secondaryChannel" className="text-slate-700 font-medium">Channel Type</Label>
                <Select
                  value={secondaryChannel}
                  onValueChange={(value: 'sms' | 'email' | 'none') => setSecondaryChannel(value)}
                  disabled={loading}
                >
                  <SelectTrigger id="secondaryChannel" className="h-10 border-gray-200 focus:ring-amber-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Disabled)</SelectItem>
                    <SelectItem value="sms">SMS (Text Message)</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all ${followupEnabled ? 'ring-1 ring-amber-500/20' : ''}`}>
            <CardHeader className="pb-4 border-b border-gray-50 bg-slate-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${followupEnabled ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Follow-Up</CardTitle>
                    <CardDescription className="text-slate-500 mt-0.5">Automated reminder</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="followupEnabled"
                    checked={followupEnabled}
                    onChange={(e) => setFollowupEnabled(e.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <Label htmlFor="followupEnabled" className="cursor-pointer text-sm font-medium text-slate-700">Enable</Label>
                </div>
              </div>
            </CardHeader>
            {followupEnabled && (
              <CardContent className="pt-6 space-y-5 animate-accordion-down">
                <div className="space-y-3">
                  <Label htmlFor="followupDelay" className="text-slate-700 font-medium">Wait Time (Days)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="followupDelay"
                      type="number"
                      min="1"
                      max="30"
                      value={followupDelay}
                      onChange={(e) => setFollowupDelay(parseInt(e.target.value) || 7)}
                      disabled={loading}
                      className="w-24 h-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
                    />
                    <span className="text-sm text-slate-500">days after primary request</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="followupTemplate" className="text-slate-700 font-medium">Message Template</Label>
                  <Textarea
                    id="followupTemplate"
                    value={followupTemplate}
                    onChange={(e) => setFollowupTemplate(e.target.value)}
                    placeholder="Hi {{first_name}}, just a friendly reminder..."
                    rows={4}
                    disabled={loading}
                    className="resize-none border-gray-200 focus:border-amber-500 focus:ring-amber-500/20 text-sm leading-relaxed"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
          {error}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40 md:static md:bg-transparent md:border-t-0 md:p-0">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={loading}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20 min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Campaign
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
