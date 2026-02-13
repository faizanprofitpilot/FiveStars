'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, ChevronDown } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface DashboardHeaderProps {
  user: SupabaseUser
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          {/* Breadcrumbs or page title could go here */}
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-auto rounded-full px-3 hover:bg-slate-50 transition-colors gap-2 border border-transparent hover:border-gray-200"
              >
                <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ring-2 ring-white shadow-sm">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col items-start text-xs hidden sm:flex">
                  <span className="font-medium text-slate-700 leading-none mb-0.5">
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">
                    {user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs leading-none text-slate-500 mt-1 truncate">
                    {user.email}
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
      </div>
    </header>
  )
}
