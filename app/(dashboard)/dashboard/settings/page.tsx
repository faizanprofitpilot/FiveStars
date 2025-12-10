import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('business_name, google_profile_url')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-600 mt-2 text-sm">
          Manage your account and business settings
        </p>
      </div>

      <Card className="border-amber-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Business Information</CardTitle>
          <CardDescription className="text-slate-600">
            Your business profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-900">Business Name</label>
            <p className="text-sm text-slate-600 mt-1">
              {business?.business_name || 'Not set'}
            </p>
          </div>
          {business?.google_profile_url && (
            <div>
              <label className="text-sm font-semibold text-slate-900">Google Business Profile</label>
              <p className="text-sm text-slate-600 mt-1">
                <a
                  href={business.google_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 hover:underline font-medium"
                >
                  View Profile →
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Account</CardTitle>
          <CardDescription className="text-slate-600">
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-semibold text-slate-900">Email</label>
            <p className="text-sm text-slate-600 mt-1">
              {user.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
