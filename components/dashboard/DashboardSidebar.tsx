'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Plug,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
  { name: 'Reply to Reviews', href: '/dashboard/reply-to-reviews', icon: MessageSquare },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-amber-50 border-r border-amber-200 flex flex-col pt-1">
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="FiveStars"
            width={140}
            height={40}
            className="h-8 w-auto pt-0.5"
            priority
          />
          <h1 className="text-2xl font-bold text-amber-600 pt-0.5">
            FiveStars
          </h1>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-amber-100 text-slate-900 font-medium'
                  : 'text-slate-700 hover:bg-amber-100/50'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
