'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedSection } from '@/components/landing/AnimatedSection'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import {
  Send,
  Zap,
  Sparkles,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  Play,
  Settings,
  Plug,
  Brain,
} from 'lucide-react'

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Check current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      {/* Header */}
      <header className="border-b border-amber-200 bg-amber-50/80 backdrop-blur-sm sticky top-0 z-50 animate-fade-in-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FiveStars"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <h1 className="text-2xl font-bold text-amber-600 pt-0.5">
              FiveStars
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {loading ? (
              // Show nothing while loading to avoid flash
              <div className="w-32 h-10" />
            ) : user ? (
              <Link href="/dashboard">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 max-w-6xl">
        <AnimatedSection animation="fade-in-up" delay={100}>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-slate-900 leading-tight">
              Get More 5-Star Reviews.
              <br />
              Reply in Seconds.
            </h2>
            <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              FiveStars automates review requests and generates perfect AI-powered replies
              in your brand&apos;s tone.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8 py-6 text-lg shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8 py-6 text-lg shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-amber-50 px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Hero Screenshot - Dashboard Illustration */}
        <AnimatedSection animation="scale-in" delay={300}>
          <div className="mt-16 mb-8">
            <div className="relative max-w-5xl mx-auto">
              <Image
                src="/hero-dashboard.png"
                alt="FiveStars dashboard - overview of review automation and campaign metrics"
                width={1200}
                height={720}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24 max-w-6xl bg-amber-50 scroll-mt-20">
        <AnimatedSection animation="fade-in-up" delay={0}>
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Everything You Need to Succeed
            </h3>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto">
              Powerful features designed to save you time and boost your reputation
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1: Automated Review Requests */}
          <AnimatedSection animation="fade-in-up" delay={100}>
            <Card className="border border-amber-200 hover:shadow-xl hover:border-amber-300 transition-all bg-white hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900">Automated Review Requests</CardTitle>
                <CardDescription className="text-base text-slate-700">
                  Send personalized SMS and email review requests automatically after every
                  service or sale. Never miss an opportunity to collect feedback.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          {/* Feature 2: Zapier-Powered Integrations */}
          <AnimatedSection animation="fade-in-up" delay={200}>
            <Card className="border border-amber-200 hover:shadow-xl hover:border-amber-300 transition-all bg-white hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900">Zapier-Powered Integrations</CardTitle>
                <CardDescription className="text-base text-slate-700">
                  Connect with your CRM, POS, or any tool. Trigger review requests from
                  any automation workflow seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          {/* Feature 3: AI Review Replies */}
          <AnimatedSection animation="fade-in-up" delay={300}>
            <Card className="border border-amber-200 hover:shadow-xl hover:border-amber-300 transition-all bg-white hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-yellow-700" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900">AI Review Replies</CardTitle>
                <CardDescription className="text-base text-slate-700">
                  Generate professional, personalized replies to customer reviews in seconds
                  with AI. Match your brand&apos;s voice perfectly.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          {/* Feature 4: Smart Follow-Up Sequences */}
          <AnimatedSection animation="fade-in-up" delay={400}>
            <Card className="border border-amber-200 hover:shadow-xl hover:border-amber-300 transition-all bg-white hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <RefreshCw className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900">Smart Follow-Up Sequences</CardTitle>
                <CardDescription className="text-base text-slate-700">
                  Set up automated follow-up messages to maximize review response rates.
                  Convert more customers into reviewers.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          {/* Feature 5: Simple Dashboard Analytics */}
          <AnimatedSection animation="fade-in-up" delay={500}>
            <Card className="border border-amber-200 hover:shadow-xl hover:border-amber-300 transition-all bg-white hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900">Simple Dashboard Analytics</CardTitle>
                <CardDescription className="text-base text-slate-700">
                  Track review requests sent, follow-ups, and campaign performance with
                  beautiful, easy-to-read analytics.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          {/* Feature 6: Works With Any Business */}
          <AnimatedSection animation="fade-in-up" delay={600}>
            <Card className="border border-amber-200 hover:shadow-xl hover:border-amber-300 transition-all bg-white hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900">Works With Any Business</CardTitle>
                <CardDescription className="text-base text-slate-700">
                  No Google Business Profile approval needed. Works immediately with any
                  business type and review platform.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-24 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="fade-in-up" delay={0}>
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                How It Works
              </h3>
              <p className="text-xl text-slate-700 max-w-2xl mx-auto">
                Get started in minutes, not hours
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <AnimatedSection animation="fade-in-up" delay={100}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-amber-500/30 hover:scale-110 transition-transform">
                  1
                </div>
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform">
                  <Settings className="h-10 w-10 text-amber-600" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-900">Set up your campaign</h4>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Create your first campaign in minutes. Add templates, choose SMS or email,
                  and customize your messaging.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection animation="fade-in-up" delay={200}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-amber-500/30 hover:scale-110 transition-transform">
                  2
                </div>
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform">
                  <Plug className="h-10 w-10 text-orange-600" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-900">Connect through Zapier</h4>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Connect your existing tools with our Zapier integration. Automatically trigger
                  review requests from any workflow.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection animation="fade-in-up" delay={300}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-amber-500/30 hover:scale-110 transition-transform">
                  3
                </div>
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform">
                  <Brain className="h-10 w-10 text-yellow-700" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-900">Respond to reviews with AI</h4>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Use our AI reply generator to craft perfect responses in seconds. Save hours
                  every week on review management.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Feature Details Section - Replaces Screenshot Showcase */}
      <section className="container mx-auto px-4 py-24 max-w-6xl bg-amber-50">
        <AnimatedSection animation="fade-in-up" delay={0}>
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Built for Modern Businesses
            </h3>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto">
              Everything you need to manage reviews efficiently and grow your reputation
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up" delay={100}>
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-slate-900">Campaign Management</h4>
              <p className="text-lg text-slate-700 leading-relaxed">
                Create unlimited campaigns with custom messaging templates. Choose between SMS or email channels, 
                set up automated follow-ups, and track performance all from one intuitive dashboard.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Personalize every message with dynamic variables like customer names, business information, 
                and direct review links. Your campaigns work automatically once connected to your workflow.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" delay={200}>
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-slate-900">AI-Powered Reply Generation</h4>
              <p className="text-lg text-slate-700 leading-relaxed">
                Never struggle with responding to reviews again. Our AI analyzes each review and generates 
                professional, personalized replies that match your brand&apos;s tone and voice.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Choose from multiple response styles—professional, friendly, apology-focused, or short and sweet. 
                Edit and customize before sending, or copy directly to your review platform.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" delay={300}>
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-slate-900">Seamless Integrations</h4>
              <p className="text-lg text-slate-700 leading-relaxed">
                Connect FiveStars to your existing tools through Zapier. Automatically trigger review requests 
                when customers make purchases, complete services, or any other event in your workflow.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Works with 5,000+ apps including HubSpot, Square, Salesforce, and more. No coding required—just 
                connect and automate.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" delay={400}>
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-slate-900">Real-Time Analytics</h4>
              <p className="text-lg text-slate-700 leading-relaxed">
                Track your review request performance with detailed analytics. See how many requests you&apos;ve sent, 
                monitor SMS vs email delivery rates, and measure campaign effectiveness.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                View activity logs for every campaign, track follow-up sequences, and identify opportunities to 
                improve your review collection strategy.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-24 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="fade-in-up" delay={0}>
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Simple, Affordable Pricing
              </h3>
              <p className="text-xl text-slate-700 max-w-2xl mx-auto">
                One plan. Everything included. No hidden fees.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="scale-in" delay={200}>
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-amber-500 shadow-2xl bg-white hover:shadow-amber-500/30 transition-shadow">
                <CardHeader className="text-center pb-8 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 rounded-t-lg">
                  <CardTitle className="text-3xl mb-2 text-slate-900">Pro Plan</CardTitle>
                  <div className="flex items-baseline justify-center gap-2 mb-6">
                    <span className="text-5xl font-bold text-slate-900">$49</span>
                    <span className="text-xl text-slate-800">/mo</span>
                  </div>
                  <CardDescription className="text-base text-slate-800">
                    Perfect for growing businesses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Unlimited review requests</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">SMS & Email channels</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">AI reply generation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Zapier integration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Follow-up sequences</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Analytics dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Priority support</span>
                    </li>
                  </ul>
                  {user ? (
                    <Link href="/dashboard" className="block">
                      <Button
                        size="lg"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-6 text-lg font-semibold shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signup" className="block">
                      <Button
                        size="lg"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-6 text-lg font-semibold shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"
                      >
                        Start Free Trial
                      </Button>
                    </Link>
                  )}
                  <p className="text-center text-sm text-slate-600">
                    No credit card required. Cancel anytime.
                  </p>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-24 max-w-6xl bg-amber-50">
        <AnimatedSection animation="fade-in-up" delay={0}>
          <Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-100 to-amber-50 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Start Automating Your Reviews Today
              </CardTitle>
              <CardDescription className="text-xl text-slate-700 max-w-2xl mx-auto">
                Join businesses already using FiveStars to boost reviews and save time.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {user ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-10 py-6 text-lg font-semibold shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-10 py-6 text-lg font-semibold shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"
                  >
                    Create Your Free Account
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-200 bg-white mt-auto">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <Image
                src="/logo.png"
                alt="FiveStars"
                width={120}
                height={35}
                className="h-7 w-auto mb-2"
              />
              <p className="text-sm text-slate-700">
                &copy; {new Date().getFullYear()} FiveStars. All rights reserved.
              </p>
            </div>
            <nav className="flex gap-6 flex-wrap justify-center">
              <Link
                href="/privacy"
                className="text-sm text-slate-700 hover:text-amber-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-slate-700 hover:text-amber-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="mailto:admin@getfivestars.xyz"
                className="text-sm text-slate-700 hover:text-amber-600 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
