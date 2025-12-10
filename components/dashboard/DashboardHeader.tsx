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
    <header className="bg-white border-b border-amber-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {user.email}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="border-amber-300 text-slate-700 hover:bg-amber-50">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}

