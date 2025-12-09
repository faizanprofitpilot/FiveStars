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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and business settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Your business profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Business Name</label>
            <p className="text-sm text-muted-foreground mt-1">
              {business?.business_name || 'Not set'}
            </p>
          </div>
          {business?.google_profile_url && (
            <div>
              <label className="text-sm font-medium">Google Business Profile</label>
              <p className="text-sm text-muted-foreground mt-1">
                <a
                  href={business.google_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Profile
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground mt-1">
              {user.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
