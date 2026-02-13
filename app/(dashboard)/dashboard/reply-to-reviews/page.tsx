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
import { Loader2, Copy, Check, Sparkles, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reply to Reviews</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-2xl">
          Generate personalized, AI-powered responses to customer reviews in seconds.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-full flex flex-col">
          <CardHeader className="bg-slate-50/50 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-slate-600">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Customer Review</CardTitle>
                <CardDescription className="text-slate-500 mt-0.5">Paste the review you received</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col space-y-6">
            <div className="space-y-3 flex-1">
              <Label htmlFor="reviewText" className="text-slate-700 font-medium">Review Content</Label>
              <Textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="e.g. 'Great service but slightly expensive...'"
                className="min-h-[200px] resize-none border-gray-200 focus:border-amber-500 focus:ring-amber-500/20 text-base leading-relaxed p-4"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tone" className="text-slate-700 font-medium">Response Tone</Label>
              <Select
                value={tone}
                onValueChange={(value: 'professional' | 'friendly' | 'apology' | 'short') =>
                  setTone(value)
                }
                disabled={loading}
              >
                <SelectTrigger id="tone" className="h-11 border-gray-200 focus:ring-amber-500/20">
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
              <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                {error}
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={loading || !reviewText.trim()} 
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Response...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Reply
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className={`border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-full flex flex-col transition-all duration-500 ${generatedReply ? 'bg-white' : 'bg-slate-50/30 border-dashed'}`}>
          <CardHeader className={`${generatedReply ? 'bg-amber-50/50 border-b border-amber-100/50' : 'bg-transparent border-b border-transparent'} pb-4 transition-colors`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg shadow-sm border flex items-center justify-center transition-colors ${generatedReply ? 'bg-amber-100 border-amber-200 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">AI Response</CardTitle>
                  <CardDescription className="text-slate-500 mt-0.5">Your generated reply</CardDescription>
                </div>
              </div>
              {generatedReply && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
                  Ready to copy
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col relative">
            {!generatedReply ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-center font-medium">Ready to generate</p>
                <p className="text-center text-sm mt-1 max-w-xs">
                  Paste a review and select a tone to generate a professional response.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="relative flex-1">
                  <Textarea
                    value={generatedReply}
                    onChange={(e) => setGeneratedReply(e.target.value)}
                    placeholder="Your generated reply will appear here..."
                    className="min-h-[280px] h-full resize-none border-amber-100 focus:border-amber-500 focus:ring-amber-500/20 text-base leading-relaxed p-5 bg-amber-50/10 font-medium text-slate-700"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-3 right-3 h-8 w-8 bg-white hover:bg-slate-50 border border-gray-200 shadow-sm"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>

                <div className="rounded-lg bg-slate-50 border border-gray-100 p-4">
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">Next Steps</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Review the response above, edit if needed, then copy and paste it to your review platform (Google, Yelp, etc).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
