'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'

interface CampaignCardProps {
  campaign: {
    id: string
    name: string
    primary_channel: string | null
    campaign_id: string
  }
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="relative">
      <Link href={`/dashboard/campaigns/${campaign.id}`}>
        <Card className="border-amber-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-300">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">{campaign.name}</CardTitle>
            <CardDescription className="text-slate-600">
              Primary: {campaign.primary_channel?.toUpperCase() || 'None'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-500 font-mono flex-1">
                ID: {campaign.campaign_id}
              </div>
              <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                <CopyToClipboard text={campaign.campaign_id} />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

