'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [businessName, setBusinessName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()

        if (!currentUser) {
          router.push('/login')
          return
        }

        setUser(currentUser)

        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('business_name, google_profile_url')
          .eq('user_id', currentUser.id)
          .single()

        if (businessError) {
          console.error('Error fetching business:', businessError)
          setError('Failed to load business information')
        } else {
          setBusiness(businessData)
          setBusinessName(businessData?.business_name || '')
        }
      } catch (err: any) {
        console.error('Error:', err)
        setError(err.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  const handleSaveBusinessName = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (!businessName.trim()) {
        setError('Business name is required')
        setSaving(false)
        return
      }

      const { error: updateError } = await supabase
        .from('businesses')
        .update({ business_name: businessName.trim() })
        .eq('user_id', user.id)

      if (updateError) {
        throw updateError
      }

      // Update local state
      setBusiness({ ...business, business_name: businessName.trim() })
      
      // Show success (you could add a toast here)
      alert('Business name updated successfully!')
    } catch (err: any) {
      console.error('Error updating business name:', err)
      setError(err.message || 'Failed to update business name')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )
  }

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
            Update your business profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSaveBusinessName} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-semibold text-slate-900">
                Business Name
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  disabled={saving}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={saving || !businessName.trim() || businessName === business?.business_name}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </form>

          {business?.google_profile_url && (
            <div className="pt-4 border-t border-amber-100">
              <Label className="text-sm font-semibold text-slate-900">Google Business Profile</Label>
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
            <Label className="text-sm font-semibold text-slate-900">Email</Label>
            <p className="text-sm text-slate-600 mt-1">
              {user?.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
