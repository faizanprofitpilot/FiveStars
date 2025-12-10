'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
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
    <header className="bg-white border-b border-amber-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <User className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 leading-none">
                {user.email?.split('@')[0] || 'User'}
              </span>
              <span className="text-xs text-slate-500 leading-none mt-0.5">
                {user.email}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut} 
            className="text-slate-700 hover:bg-amber-50 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}

