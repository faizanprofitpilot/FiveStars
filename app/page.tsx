'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedSection } from '@/components/landing/AnimatedSection'
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
  MessageSquareReply,
  Megaphone,
  Brain,
  TrendingUp,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      {/* Header */}
      <header className="border-b border-amber-200 bg-amber-50/80 backdrop-blur-sm sticky top-0 z-50 animate-fade-in-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <h1 className="text-2xl font-bold text-amber-600">
            FiveStars
          </h1>
          <div className="flex items-center gap-4">
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
              in your brand's tone.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
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
            </div>
          </div>
        </AnimatedSection>

        {/* Hero Screenshot Mockup */}
        <AnimatedSection animation="scale-in" delay={300}>
          <div className="mt-16 mb-8">
            <div className="relative max-w-5xl mx-auto">
              <div className="rounded-xl shadow-2xl border border-amber-200 bg-gradient-to-br from-amber-100 to-amber-50 p-2 hover:shadow-amber-500/20 transition-shadow">
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="flex-1"></div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-24 w-24 mx-auto text-amber-600 opacity-30 mb-4 animate-float" />
                      <p className="text-sm text-slate-600 font-medium">Dashboard Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Trust Section */}
      <AnimatedSection animation="fade-in" delay={0}>
        <section className="py-12 border-y border-amber-200 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-center text-sm font-semibold text-slate-600 uppercase tracking-wider mb-8">
              Trusted by businesses nationwide
            </p>
            <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
              {['Company A', 'Company B', 'Company C', 'Company D'].map((name, i) => (
                <div
                  key={i}
                  className="text-2xl font-bold text-slate-800 tracking-tight hover:opacity-60 transition-opacity"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 max-w-6xl bg-amber-50">
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
                  with AI. Match your brand's voice perfectly.
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
      <section className="bg-white py-24">
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

      {/* Screenshot Showcase */}
      <section className="container mx-auto px-4 py-24 max-w-6xl bg-amber-50">
        <AnimatedSection animation="fade-in-up" delay={0}>
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              See FiveStars in Action
            </h3>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto">
              Beautiful, intuitive interfaces designed for speed
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Screenshot 1: Campaign Builder */}
          <AnimatedSection animation="slide-in-left" delay={100}>
            <div className="space-y-4">
              <div className="rounded-xl shadow-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-2 overflow-hidden hover:scale-105 transition-transform">
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
                    <Megaphone className="h-16 w-16 text-amber-600 opacity-30" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-lg text-slate-900 mb-2">Campaign Builder</h4>
                <p className="text-slate-700">Create and manage review campaigns effortlessly</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Screenshot 2: AI Reply Generator */}
          <AnimatedSection animation="fade-in-up" delay={200}>
            <div className="space-y-4">
              <div className="rounded-xl shadow-xl border border-amber-200 bg-gradient-to-br from-yellow-50 to-white p-2 overflow-hidden hover:scale-105 transition-transform">
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="aspect-[4/3] bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
                    <MessageSquareReply className="h-16 w-16 text-yellow-700 opacity-30" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-lg text-slate-900 mb-2">AI Reply Generator</h4>
                <p className="text-slate-700">Generate perfect replies in seconds with AI</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Screenshot 3: Dashboard */}
          <AnimatedSection animation="slide-in-right" delay={300}>
            <div className="space-y-4">
              <div className="rounded-xl shadow-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-2 overflow-hidden hover:scale-105 transition-transform">
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
                    <TrendingUp className="h-16 w-16 text-amber-600 opacity-30" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-lg text-slate-900 mb-2">Analytics Dashboard</h4>
                <p className="text-slate-700">Track performance and insights at a glance</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-24">
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
                  <Link href="/signup" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-6 text-lg font-semibold shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
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
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-10 py-6 text-lg font-semibold shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"
                >
                  Create Your Free Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-200 bg-white mt-auto">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="text-xl font-bold mb-2 text-amber-600">FiveStars</h4>
              <p className="text-sm text-slate-700">
                &copy; {new Date().getFullYear()} FiveStars. All rights reserved.
              </p>
            </div>
            <nav className="flex gap-6 flex-wrap justify-center">
              <Link
                href="#"
                className="text-sm text-slate-700 hover:text-amber-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-700 hover:text-amber-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
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
