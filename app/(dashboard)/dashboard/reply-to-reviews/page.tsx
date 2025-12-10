'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Copy, Check } from 'lucide-react'

export default function ReplyToReviewsPage() {
  const [reviewText, setReviewText] = useState('')
  const [tone, setTone] = useState<'professional' | 'friendly' | 'apology' | 'short'>('professional')
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!reviewText.trim()) {
      setError('Please paste a review first')
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedReply('')
    setCopied(false)

    try {
      const response = await fetch('/api/reviews/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review_text: reviewText,
          tone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reply')
      }

      setGeneratedReply(data.reply)
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedReply) return

    try {
      await navigator.clipboard.writeText(generatedReply)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reply to Reviews</h1>
        <p className="text-slate-600 mt-2 text-sm">
          Generate AI-powered responses to customer reviews
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-amber-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Review</CardTitle>
            <CardDescription className="text-slate-600">
              Paste the customer review you want to respond to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviewText">Review Text</Label>
              <Textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste the customer review here..."
                rows={10}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={tone}
                onValueChange={(value: 'professional' | 'friendly' | 'apology' | 'short') =>
                  setTone(value)
                }
                disabled={loading}
              >
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="apology">Apology-Focused</SelectItem>
                  <SelectItem value="short">Short & Sweet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Reply'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-amber-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Generated Reply</CardTitle>
            <CardDescription className="text-slate-600">
              Copy and paste this reply on your review platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={generatedReply}
                onChange={(e) => setGeneratedReply(e.target.value)}
                placeholder="Your generated reply will appear here..."
                rows={10}
                className="pr-10"
              />
              {generatedReply && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            {generatedReply && (
              <div className="text-sm text-slate-600">
                <p className="text-slate-700">✓ Reply generated! You can edit it above, then click the copy button or select all to copy.</p>
                <p className="mt-2 text-slate-600">
                  <strong className="text-slate-900">Note:</strong> You&apos;ll need to manually paste this reply on Google
                  Business, Yelp, Facebook, or your review platform.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
