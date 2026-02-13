'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Mail } from 'lucide-react'

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
    <Link href={`/dashboard/campaigns/${campaign.id}`} className="block h-full group">
      <Card className="h-full border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-amber-200 hover:ring-1 hover:ring-amber-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
              {campaign.name}
            </CardTitle>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors shrink-0">
              {campaign.primary_channel === 'email' ? (
                <Mail className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-600" />
              ) : (
                <MessageSquare className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-600" />
              )}
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider group-hover:text-amber-700">
                {campaign.primary_channel || 'None'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 pt-2 border-t border-gray-50 mt-2">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">ID</div>
            <code className="text-xs font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex-1 truncate group-hover:bg-amber-50 group-hover:border-amber-100 group-hover:text-amber-800 transition-colors">
              {campaign.campaign_id}
            </code>
            <div 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="flex-shrink-0 relative z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <CopyToClipboard text={campaign.campaign_id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
