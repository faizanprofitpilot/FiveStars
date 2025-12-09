import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, MessageSquare, Zap, BarChart3, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">FiveStars</h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Automate Review Requests & Generate AI-Powered Replies
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          FiveStars helps businesses automate review request outreach via SMS and email,
          and generate professional review replies with AI—all in one simple platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Everything You Need</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Automated Review Requests</CardTitle>
              <CardDescription>
                Send personalized SMS and email review requests automatically after every
                service or sale
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Zapier Integration</CardTitle>
              <CardDescription>
                Connect with your CRM, POS, or any tool. Trigger review requests from
                any automation workflow
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI Review Replies</CardTitle>
              <CardDescription>
                Generate professional, personalized replies to customer reviews in seconds
                with AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track review requests sent, follow-ups, and campaign performance with
                detailed analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Check className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Follow-Up Sequences</CardTitle>
              <CardDescription>
                Set up automated follow-up messages to maximize review response rates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multi-Channel Support</CardTitle>
              <CardDescription>
                Send review requests via SMS or email, with fallback options to ensure
                delivery
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Join businesses already automating their review management with FiveStars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup">
              <Button size="lg">Create Your Free Account</Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FiveStars. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}