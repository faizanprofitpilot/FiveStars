'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Plug,
  Settings,
  User,
  LogOut,
  ChevronUp,
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
  { name: 'Reply to Reviews', href: '/dashboard/reply-to-reviews', icon: MessageSquare },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

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
      
      {/* User Menu at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-auto py-2.5 px-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ring-2 ring-white shadow-sm shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start text-xs min-w-0 flex-1">
                  <span className="font-medium text-slate-700 leading-none mb-0.5 truncate w-full">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-slate-500 text-[10px] leading-none truncate w-full">
                    {user?.email || ''}
                  </span>
                </div>
              </div>
              <ChevronUp className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="end" side="top" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-slate-900">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs leading-none text-slate-500 mt-1 truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
