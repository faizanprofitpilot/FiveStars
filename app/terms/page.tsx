import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, AlertTriangle, Shield, Ban, CreditCard, Gavel } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - FiveStars',
  description: 'FiveStars Terms of Service - Legal terms and conditions for using our service',
}

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-amber-600" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you 
              (&quot;you&quot; or &quot;User&quot;) and FiveStars (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) 
              regarding your use of our service, which enables businesses to send review request messages to 
              customers via SMS and email.
            </p>
            <p>
              By accessing or using FiveStars, you agree to be bound by these Terms. If you disagree with any 
              part of these Terms, you may not access or use our service.
            </p>
          </CardContent>
        </Card>

        {/* Description of Service */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Description of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              FiveStars is a SaaS platform that enables businesses to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Create and manage review request campaigns</li>
              <li>Send automated review request messages to customers via SMS and email</li>
              <li>Generate AI-powered replies to customer reviews</li>
              <li>Integrate with third-party services (e.g., Zapier) for workflow automation</li>
            </ul>
            <p className="mt-4">
              We reserve the right to modify, suspend, or discontinue any part of our service at any time 
              with or without notice.
            </p>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Shield className="h-6 w-6 text-amber-600" />
              User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Account Creation</h3>
              <p>
                To use FiveStars, you must create an account by providing accurate, current, and complete 
                information. You are responsible for maintaining the confidentiality of your account 
                credentials and for all activities that occur under your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Account Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must be at least 18 years old to create an account</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You may not share your account credentials with others</li>
                <li>You may not use another user&apos;s account without permission</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Ban className="h-6 w-6 text-amber-600" />
              Acceptable Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>You agree not to use FiveStars to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Send spam, unsolicited messages, or messages to individuals who have not provided consent</li>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Send messages that are harassing, abusive, defamatory, or otherwise objectionable</li>
              <li>Impersonate any person or entity or falsely state your affiliation with any person or entity</li>
              <li>Interfere with or disrupt the service or servers connected to the service</li>
              <li>Attempt to gain unauthorized access to any portion of the service</li>
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Violate TCPA, CAN-SPAM, or other messaging compliance regulations</li>
            </ul>
          </CardContent>
        </Card>

        {/* SMS and Messaging Compliance */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              SMS and Messaging Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              When using FiveStars to send SMS messages, you agree to comply with all applicable laws and 
              regulations, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>TCPA (Telephone Consumer Protection Act):</strong> You must obtain proper consent before sending SMS messages</li>
              <li><strong>Carrier Requirements:</strong> Compliance with A2P 10DLC, Toll-Free verification, and carrier policies</li>
              <li><strong>Opt-Out Requirements:</strong> Honor all opt-out requests (customers replying &quot;STOP&quot;)</li>
              <li><strong>Consent Documentation:</strong> Maintain records of customer consent for review request messages</li>
              <li><strong>Message Content:</strong> Ensure all messages comply with carrier content policies</li>
            </ul>
            <p className="mt-4">
              <strong>You are solely responsible</strong> for obtaining proper consent from customers before 
              sending review request messages. FiveStars is not liable for any violations of messaging 
              regulations committed by users of our service.
            </p>
            <p className="mt-4">
              For more information about SMS consent requirements, please visit our{' '}
              <Link href="/sms-consent" className="text-amber-600 hover:underline">
                SMS Consent page
              </Link>.
            </p>
          </CardContent>
        </Card>

        {/* Payment and Billing */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-amber-600" />
              Payment and Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              If you purchase a paid subscription or use paid features:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You agree to pay all fees associated with your subscription</li>
              <li>Fees are billed in advance on a recurring basis (monthly or annually)</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>We reserve the right to change our pricing with 30 days&apos; notice</li>
              <li>You are responsible for any taxes applicable to your use of the service</li>
              <li>Failure to pay may result in suspension or termination of your account</li>
            </ul>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Gavel className="h-6 w-6 text-amber-600" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              The service, including its original content, features, and functionality, is owned by FiveStars 
              and is protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
            <p>
              You retain ownership of any content you submit to the service (e.g., business information, 
              campaign templates). By submitting content, you grant us a license to use, store, and process 
              that content as necessary to provide the service.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer of Warranties */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Disclaimer of Warranties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the service will be uninterrupted, secure, or error-free, or that 
              defects will be corrected. We do not guarantee the delivery of SMS or email messages, as 
              delivery depends on third-party services (Twilio, Resend) and carrier networks.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FIVESTARS SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
              WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER 
              INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
            <p>
              Our total liability for any claims arising from or related to the service shall not exceed 
              the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Indemnification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              You agree to indemnify, defend, and hold harmless FiveStars and its officers, directors, 
              employees, and agents from and against any claims, liabilities, damages, losses, and expenses, 
              including reasonable attorneys&apos; fees, arising out of or in any way connected with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your use of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights, including messaging compliance regulations</li>
              <li>Any content you submit or transmit through the service</li>
            </ul>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Termination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              We may terminate or suspend your account and access to the service immediately, without prior 
              notice, for any reason, including if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the service will cease immediately. You may terminate 
              your account at any time through your account settings or by contacting us.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Changes to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any material 
              changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. 
              Your continued use of the service after such changes constitutes acceptance of the modified Terms.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which FiveStars operates, without regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card className="border-amber-200 shadow-lg bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              If you have any questions about these Terms of Service, please contact us:
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
