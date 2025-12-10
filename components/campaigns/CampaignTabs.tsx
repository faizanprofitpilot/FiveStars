'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Settings, Activity, MessageSquare, CheckCircle2, XCircle } from 'lucide-react'
import { CampaignForm } from './CampaignForm'
import { CampaignActivityLog } from './CampaignActivityLog'
import { Badge } from '@/components/ui/badge'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'

interface CampaignTabsProps {
  campaign: {
    id: string
    name: string
    campaign_id: string
    primary_channel: 'sms' | 'email' | 'none'
    secondary_channel: 'sms' | 'email' | 'none' | null
    primary_template: string
    followup_template: string | null
    followup_enabled: boolean
    followup_delay: number | null
  }
}

export function CampaignTabs({ campaign }: CampaignTabsProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'activity'>('settings')
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/campaigns/${campaign.id}/requests`)
        const data = await response.json()
        if (data.requests) {
          const total = data.requests.length
          const sent = data.requests.filter((r: any) => r.primary_sent).length
          const failed = data.requests.filter((r: any) => r.error_message).length
          setStats({ total, sent, failed })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [campaign.id])

  return (
    <div className="space-y-6">
      {/* Campaign Header with ID and Stats */}
      <Card className="border-amber-200 shadow-sm bg-gradient-to-br from-amber-50/50 to-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{campaign.name}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-600">Campaign ID:</p>
                  <code className="text-sm font-mono bg-amber-100 px-3 py-1.5 rounded-md text-amber-900 border border-amber-200">
                    {campaign.campaign_id}
                  </code>
                  <CopyToClipboard text={campaign.campaign_id} />
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-semibold">
                  {campaign.primary_channel.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-600 mt-1">Total</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <p className="text-2xl font-bold text-green-700">{stats.sent}</p>
                <p className="text-xs text-slate-600 mt-1">Sent</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-red-200">
                <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
                <p className="text-xs text-slate-600 mt-1">Failed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-amber-200 bg-white rounded-t-lg">
        <nav className="flex gap-1 px-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 text-sm font-semibold transition-all rounded-t-lg ${
              activeTab === 'settings'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/50'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 text-sm font-semibold transition-all rounded-t-lg relative ${
              activeTab === 'activity'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/50'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Activity Log
            {stats.total > 0 && (
              <Badge className="ml-2 bg-amber-500 text-slate-900 text-xs px-1.5 py-0">
                {stats.total}
              </Badge>
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'settings' && (
          <CampaignForm
            campaign={{
              id: campaign.id,
              name: campaign.name,
              primary_channel: campaign.primary_channel,
              secondary_channel: campaign.secondary_channel,
              primary_template: campaign.primary_template,
              followup_template: campaign.followup_template,
              followup_enabled: campaign.followup_enabled,
              followup_delay: campaign.followup_delay,
            }}
          />
        )}
        {activeTab === 'activity' && <CampaignActivityLog campaignId={campaign.id} />}
      </div>
    </div>
  )
}

