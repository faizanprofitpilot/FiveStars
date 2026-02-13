'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Save, Building2, User, ExternalLink } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [businessName, setBusinessName] = useState('')
  const [reviewLink, setReviewLink] = useState('')
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
          .select('business_name, google_profile_url, review_link')
          .eq('user_id', currentUser.id)
          .single()

        if (businessError) {
          console.error('Error fetching business:', businessError)
          setError('Failed to load business information')
        } else {
          setBusiness(businessData)
          setBusinessName(businessData?.business_name || '')
          setReviewLink(businessData?.review_link || '')
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

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (!businessName.trim()) {
        setError('Business name is required')
        setSaving(false)
        return
      }

      // Validate review link if provided
      if (reviewLink.trim() && !reviewLink.trim().startsWith('http')) {
        setError('Review link must be a valid URL (e.g., https://g.page/r/YOUR_REVIEW_LINK)')
        setSaving(false)
        return
      }

      const { error: updateError } = await supabase
        .from('businesses')
        .update({ 
          business_name: businessName.trim(),
          review_link: reviewLink.trim() || null
        })
        .eq('user_id', user.id)

      if (updateError) {
        throw updateError
      }

      // Update local state
      setBusiness({ ...business, business_name: businessName.trim(), review_link: reviewLink.trim() || null })
      
      // Show success (you could add a toast here)
      alert('Settings updated successfully!')
    } catch (err: any) {
      console.error('Error updating business settings:', err)
      setError(err.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-2xl">
          Manage your account preferences and business profile information.
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-slate-600">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Business Profile</CardTitle>
                <CardDescription className="text-slate-500 mt-0.5">Your public business information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSaveBusiness} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="businessName" className="text-slate-700 font-medium">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  disabled={saving}
                  className="h-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="reviewLink" className="text-slate-700 font-medium">
                    Google Review Link
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    This link will be used in your review request messages. Get your link from Google Business Profile.
                  </p>
                </div>
                <Input
                  id="reviewLink"
                  type="url"
                  value={reviewLink}
                  onChange={(e) => setReviewLink(e.target.value)}
                  placeholder="https://g.page/r/YOUR_REVIEW_LINK"
                  disabled={saving}
                  className="h-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20 font-mono text-sm"
                />
                <p className="text-xs text-slate-400">
                  Example: <span className="font-mono">https://g.page/r/YOUR_REVIEW_LINK</span>
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={saving || !businessName.trim() || 
                    (businessName === business?.business_name && reviewLink === (business?.review_link || ''))}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm h-10 px-6"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </form>

            {business?.google_profile_url && (
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-700 font-medium">Google Business Profile</Label>
                    <p className="text-sm text-slate-500 mt-1">Connected profile URL</p>
                  </div>
                  <a
                    href={business.google_profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium px-3 py-1.5 rounded-md hover:bg-amber-50 transition-colors"
                  >
                    View Profile <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-slate-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Account Details</CardTitle>
                <CardDescription className="text-slate-500 mt-0.5">Your personal account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-1">
              <Label className="text-slate-700 font-medium">Email Address</Label>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-gray-100 mt-2">
                <span className="text-sm text-slate-600 font-mono">{user?.email}</span>
                <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-white rounded border border-gray-100">Primary</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Contact support to change your email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
