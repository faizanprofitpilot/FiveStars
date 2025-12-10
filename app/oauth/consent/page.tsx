'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Shield, Zap } from 'lucide-react'

function OAuthConsentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const scope = searchParams.get('scope') || 'read write'
  const state = searchParams.get('state')

  const handleApprove = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/oauth/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved: true,
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          state,
        }),
      })

      if (response.redirected) {
        window.location.href = response.url
      } else {
        const data = await response.json()
        if (data.error) {
          alert(`Error: ${data.error_description || data.error}`)
        }
      }
    } catch (error) {
      console.error('Error approving OAuth request:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeny = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/oauth/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved: false,
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          state,
        }),
      })

      if (response.redirected) {
        window.location.href = response.url
      }
    } catch (error) {
      console.error('Error denying OAuth request:', error)
    } finally {
      setLoading(false)
    }
  }

  // Parse scopes for display
  const scopes = scope.split(' ').filter(Boolean)
  const scopeDescriptions: Record<string, string> = {
    read: 'Read your campaigns and review requests',
    write: 'Send review requests on your behalf',
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="FiveStars"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <CardTitle className="text-2xl">Authorize Application</CardTitle>
          <CardDescription>
            {clientId === 'zapier' ? (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span>Zapier wants to connect to your FiveStars account</span>
              </div>
            ) : (
              <span>An application wants to connect to your FiveStars account</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permissions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Shield className="h-4 w-4 text-amber-600" />
              <span>This application will be able to:</span>
            </div>
            <ul className="space-y-2 pl-6">
              {scopes.map((scopeItem) => (
                <li key={scopeItem} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{scopeDescriptions[scopeItem] || scopeItem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Redirect URI */}
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs font-medium mb-1">Redirecting to:</p>
            <p className="text-xs text-muted-foreground break-all">{redirectUri}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDeny}
              disabled={loading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Deny
            </Button>
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900"
              onClick={handleApprove}
              disabled={loading}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {loading ? 'Authorizing...' : 'Authorize'}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By authorizing, you allow this application to access your FiveStars account.
            You can revoke access at any time from your Settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <OAuthConsentContent />
    </Suspense>
  )
}

