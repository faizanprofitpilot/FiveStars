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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen shadow-[1px_0_20px_0_rgba(0,0,0,0.05)] z-10">
      <div className="p-6 pb-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="FiveStars"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            FiveStars
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname?.startsWith(item.href + '/'))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-amber-600" : "text-slate-400 group-hover:text-slate-600")} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
