'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const [businessName, setBusinessName] = useState('')
  const [googleProfileUrl, setGoogleProfileUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/business/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: businessName,
          google_profile_url: googleProfileUrl || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete onboarding')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="FiveStars"
                width={140}
                height={40}
                className="h-10 w-auto pt-0.5"
                priority
              />
              <h1 className="text-2xl font-bold text-amber-600 pt-0.5">
                FiveStars
              </h1>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome to FiveStars</CardTitle>
          <CardDescription className="text-center">
            Let&apos;s set up your business profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">
                Business Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Acme Corporation"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleProfileUrl">
                Google Business Profile URL (Optional)
              </Label>
              <Input
                id="googleProfileUrl"
                type="url"
                placeholder="https://www.google.com/maps/place/..."
                value={googleProfileUrl}
                onChange={(e) => setGoogleProfileUrl(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                We&apos;ll use this to personalize your campaigns and review replies
              </p>
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

