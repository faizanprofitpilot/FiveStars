import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Mail, Phone, Database, Lock, AlertCircle, Settings } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - FiveStars',
  description: 'FiveStars Privacy Policy - How we collect, use, and protect your data',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      {/* Header */}
      <header className="border-b border-amber-200 bg-amber-50/80 backdrop-blur-sm sticky top-0 z-50">
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
          <Link href="/">
            <span className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors">
              Back to Home
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Shield className="h-6 w-6 text-amber-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              FiveStars (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
              our service, which enables businesses to send review request messages to their customers via SMS and email.
            </p>
            <p>
              By using FiveStars, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our service.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Database className="h-6 w-6 text-amber-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Information You Provide to Us</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Email address, password, and business name when you create an account</li>
                <li><strong>Business Information:</strong> Business name, Google Business Profile URL, and context documents</li>
                <li><strong>Campaign Data:</strong> Campaign names, messaging templates, and channel preferences</li>
                <li><strong>Customer Contact Information:</strong> Phone numbers and email addresses of customers for review requests (collected by businesses, not directly by us)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Information Automatically Collected</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Usage Data:</strong> How you interact with our service, pages visited, and features used</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                <li><strong>Log Data:</strong> Timestamps, error logs, and system performance metrics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Settings className="h-6 w-6 text-amber-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our service</li>
              <li>Process and send review request messages (SMS and email) on behalf of businesses</li>
              <li>Authenticate users and manage accounts</li>
              <li>Generate AI-powered review replies using business context</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and enforce our terms</li>
              <li>Send administrative communications and service updates</li>
            </ul>
          </CardContent>
        </Card>

        {/* SMS and Phone Number Usage */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Phone className="h-6 w-6 text-amber-600" />
              SMS and Phone Number Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              When businesses use FiveStars to send review request messages via SMS, we process phone numbers on their behalf:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Consent:</strong> Phone numbers are only used when customers have provided explicit consent to the business</li>
              <li><strong>Purpose:</strong> Phone numbers are used solely to send transactional review request messages</li>
              <li><strong>Opt-Out:</strong> Customers can opt out at any time by replying &quot;STOP&quot; to any message</li>
              <li><strong>No Marketing:</strong> We do not use phone numbers for marketing purposes or share them with third parties for marketing</li>
              <li><strong>Storage:</strong> Phone numbers are stored securely and only retained as long as necessary for the service</li>
              <li><strong>Carrier Compliance:</strong> We comply with TCPA, CAN-SPAM, and carrier requirements (A2P 10DLC, Toll-Free verification)</li>
            </ul>
            <p className="mt-4">
              For more information about SMS consent and opt-out procedures, please visit our{' '}
              <Link href="/sms-consent" className="text-amber-600 hover:underline">
                SMS Consent page
              </Link>.
            </p>
          </CardContent>
        </Card>

        {/* Data Sharing and Disclosure */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              Data Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Service Providers:</strong> We use trusted third-party services (Twilio for SMS, Resend for email, Supabase for database, OpenAI for AI features) that process data on our behalf under strict confidentiality agreements</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation</li>
              <li><strong>Protection of Rights:</strong> We may disclose information to protect our rights, property, or safety, or that of our users</li>
              <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Lock className="h-6 w-6 text-amber-600" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encryption of data in transit (HTTPS/TLS) and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Limited access to personal information on a need-to-know basis</li>
              <li>Secure hosting infrastructure with reputable providers</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to use commercially acceptable means to protect your information, we cannot 
              guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Shield className="h-6 w-6 text-amber-600" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
              <li><strong>Opt-Out:</strong> Opt out of SMS messages by replying &quot;STOP&quot; or unsubscribing from emails</li>
              <li><strong>Account Closure:</strong> Delete your account and associated data through account settings</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:admin@getfivestars.xyz" className="text-amber-600 hover:underline">
                admin@getfivestars.xyz
              </a>.
            </p>
          </CardContent>
        </Card>

        {/* Children&apos;s Privacy */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Children&apos;s Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              Our service is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately, and we will take steps to delete such information.
            </p>
          </CardContent>
        </Card>

        {/* Changes to This Policy */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Changes to This Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card className="border-amber-200 shadow-lg bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Mail className="h-6 w-6 text-amber-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:admin@getfivestars.xyz" className="text-amber-600 hover:underline">
                  admin@getfivestars.xyz
                </a>
              </li>
              <li>
                <strong>Website:</strong>{' '}
                <Link href="/" className="text-amber-600 hover:underline">
                  https://www.getfivestars.xyz
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200 bg-white mt-auto">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="FiveStars"
                width={120}
                height={34}
                className="h-7 w-auto"
              />
              <span className="text-sm text-slate-600">© {new Date().getFullYear()} FiveStars. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="text-slate-600 hover:text-amber-600 transition-colors">
                Home
              </Link>
              <Link href="/privacy" className="text-slate-600 hover:text-amber-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-600 hover:text-amber-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
