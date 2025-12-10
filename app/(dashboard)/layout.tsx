import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has completed onboarding
  try {
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    // If table doesn't exist or business not found, redirect to onboarding
    if (businessError || !business) {
      redirect('/onboarding')
    }
  } catch (error) {
    // If database error (table doesn't exist), redirect to onboarding
    console.error('Database error in layout:', error)
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen bg-amber-50">
      {/* Top border */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-amber-500 z-50" />
      
      <DashboardSidebar />
      <div className="flex-1 flex flex-col pt-1">
        <DashboardHeader user={user} />
        <main className="flex-1 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
