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
import { Loader2 } from 'lucide-react'

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>
            Give your campaign a name to identify it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Campaign Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="After Service Follow-up"
              required
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Primary Channel</CardTitle>
          <CardDescription>
            Choose how you want to send review requests initially
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryChannel">Primary Channel</Label>
            <Select
              value={primaryChannel}
              onValueChange={(value: 'sms' | 'email' | 'none') => setPrimaryChannel(value)}
              disabled={loading}
            >
              <SelectTrigger id="primaryChannel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryTemplate">Primary Template</Label>
            <Textarea
              id="primaryTemplate"
              value={primaryTemplate}
              onChange={(e) => setPrimaryTemplate(e.target.value)}
              placeholder="Hi {{first_name}}, thanks for choosing {{business_name}}!"
              rows={4}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Available variables: {'{{first_name}}'}, {'{{business_name}}'}, {'{{review_link}}'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Secondary Channel (Optional)</CardTitle>
          <CardDescription>
            Fallback channel if primary fails or as a follow-up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secondaryChannel">Secondary Channel</Label>
            <Select
              value={secondaryChannel}
              onValueChange={(value: 'sms' | 'email' | 'none') => setSecondaryChannel(value)}
              disabled={loading}
            >
              <SelectTrigger id="secondaryChannel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Follow-Up Sequence (Optional)</CardTitle>
          <CardDescription>
            Automatically send a follow-up message after a delay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="followupEnabled"
              checked={followupEnabled}
              onChange={(e) => setFollowupEnabled(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="followupEnabled">Enable follow-up sequence</Label>
          </div>

          {followupEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="followupDelay">Send follow-up after (days)</Label>
                <Input
                  id="followupDelay"
                  type="number"
                  min="1"
                  max="30"
                  value={followupDelay}
                  onChange={(e) => setFollowupDelay(parseInt(e.target.value) || 7)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followupTemplate">Follow-up Template</Label>
                <Textarea
                  id="followupTemplate"
                  value={followupTemplate}
                  onChange={(e) => setFollowupTemplate(e.target.value)}
                  placeholder="Hi {{first_name}}, just a friendly reminder..."
                  rows={4}
                  disabled={loading}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Campaign'
          )}
        </Button>
      </div>
    </form>
  )
}

