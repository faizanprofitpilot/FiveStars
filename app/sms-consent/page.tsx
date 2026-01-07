import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, MessageSquare, Shield, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'SMS Consent & Opt-In - FiveStars',
  description: 'Review request SMS consent and opt-in information',
}

export default function SMSConsentPage() {
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
            SMS Review Request Consent
          </h1>
          <p className="text-lg text-slate-600">
            Information about receiving review request messages via SMS
          </p>
        </div>

        {/* Consent Information Card */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-amber-600" />
              What Messages Will You Receive?
            </CardTitle>
            <CardDescription className="text-base">
              By providing your phone number, you consent to receive transactional review request messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Message Types:</h3>
              <p className="mb-4">
                You will receive SMS messages requesting feedback and reviews after completing a transaction, 
                service appointment, or purchase with businesses using FiveStars. These messages are sent 
                as a follow-up to your interaction with the business.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">When Will You Receive Messages?</h3>
              <p className="mb-4">
                Messages are sent after you complete a transaction or service with a business. You may 
                receive:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>An initial review request message shortly after your transaction</li>
                <li>A follow-up reminder message (if you haven't left a review) after a delay period set by the business</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Message Frequency:</h3>
              <p>
                You will typically receive 1-2 messages per transaction or service appointment. Messages 
                are only sent in relation to transactions you have completed with businesses using FiveStars.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Consent Process Card */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-amber-600" />
              How Do You Consent?
            </CardTitle>
            <CardDescription className="text-base">
              Your consent is obtained when you provide your phone number during a transaction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              By providing your phone number during any of the following interactions, you consent to 
              receive review request messages:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Making a purchase in-store or online and providing your phone number at checkout</li>
              <li>Booking an appointment or service and providing your phone number as part of the booking process</li>
              <li>Creating an account with a business and including your phone number in your profile</li>
              <li>Completing a transaction where you voluntarily provide your contact information</li>
            </ul>
            <p className="mt-4">
              <strong>Your consent is voluntary.</strong> You are not required to provide your phone number 
              to complete a transaction. However, if you choose to provide it, you consent to receive 
              transactional and follow-up communications related to your purchase or service, including 
              review requests.
            </p>
          </CardContent>
        </Card>

        {/* Opt-Out Instructions Card */}
        <Card className="border-amber-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <Shield className="h-6 w-6 text-amber-600" />
              How to Opt-Out
            </CardTitle>
            <CardDescription className="text-base">
              You can stop receiving messages at any time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">To Stop Receiving Messages:</h3>
              <p className="mb-3">
                Reply <strong className="text-amber-600">STOP</strong> to any message you receive. 
                You will receive a confirmation message that you have been unsubscribed.
              </p>
              <p>
                After opting out, you will no longer receive review request messages from businesses 
                using FiveStars. You can opt back in at any time by providing your phone number again 
                during a future transaction.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-amber-200">
              <h3 className="font-semibold text-slate-900 mb-2">For Help:</h3>
              <p>
                Reply <strong className="text-amber-600">HELP</strong> to any message to receive 
                assistance and contact information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Important Information Card */}
        <Card className="border-amber-200 shadow-lg bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Message and Data Rates:</h3>
              <p>
                Message and data rates may apply. Standard messaging charges from your mobile carrier 
                will apply to messages you send and receive. Check with your carrier for details 
                about your messaging plan.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Carrier Support:</h3>
              <p>
                This service is available on major U.S. carriers including AT&T, T-Mobile, Verizon, 
                Sprint, and others. Message delivery is subject to your carrier&apos;s availability 
                and network coverage.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Privacy:</h3>
              <p>
                Your phone number will only be used to send review request messages related to 
                transactions you have completed. We do not sell or share your phone number with 
                third parties for marketing purposes. For more information, please review our 
                Privacy Policy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Questions or Concerns:</h3>
              <p>
                If you have questions about these messages or need assistance, you can:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Reply <strong className="text-amber-600">HELP</strong> to any message</li>
                <li>Contact the business directly</li>
                <li>Email us at <a href="mailto:admin@getfivestars.xyz" className="text-amber-600 hover:underline">admin@getfivestars.xyz</a></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-slate-600">
          <p>
            This consent page is provided for informational purposes. By providing your phone number 
            during a transaction, you acknowledge that you have read and understood this consent 
            information.
          </p>
          <p className="mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
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
              <Link href="/login" className="text-slate-600 hover:text-amber-600 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

