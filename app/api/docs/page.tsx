import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FiveStars API Documentation',
  description: 'API documentation for FiveStars Zapier integration',
}

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FiveStars API Documentation</h1>
          <p className="text-lg text-gray-600">
            Complete API reference for integrating with FiveStars via Zapier
          </p>
        </div>

        <div className="space-y-12">
          {/* Authentication */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-600 mb-4">
              FiveStars uses OAuth 2.0 for authentication. All API requests require a valid OAuth access token
              in the Authorization header.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <code className="text-sm">
                Authorization: Bearer {'{access_token}'}
              </code>
            </div>
            <p className="text-sm text-gray-500">
              Access tokens expire after 1 hour. Use the refresh token to obtain a new access token.
            </p>
          </section>

          {/* OAuth Endpoints */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">OAuth 2.0 Endpoints</h2>
            
            <div className="space-y-6">
              {/* Authorize */}
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Authorization Endpoint</h3>
                <div className="mb-2">
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">GET /api/oauth/authorize</code>
                </div>
                <p className="text-gray-600 mb-3">
                  Initiates the OAuth 2.0 authorization flow. Redirects users to login and consent pages.
                </p>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Query Parameters:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li><code className="bg-gray-100 px-1 rounded">response_type</code> (required): Must be <code className="bg-gray-100 px-1 rounded">code</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">client_id</code> (required): Client identifier (e.g., <code className="bg-gray-100 px-1 rounded">zapier</code>)</li>
                    <li><code className="bg-gray-100 px-1 rounded">redirect_uri</code> (required): Where to redirect after authorization</li>
                    <li><code className="bg-gray-100 px-1 rounded">scope</code> (optional): Requested permissions (default: <code className="bg-gray-100 px-1 rounded">read write</code>)</li>
                    <li><code className="bg-gray-100 px-1 rounded">state</code> (optional): CSRF protection token</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-semibold mb-1">Example:</p>
                  <code className="text-xs">
                    GET /api/oauth/authorize?response_type=code&client_id=zapier&redirect_uri=https://zapier.com/callback
                  </code>
                </div>
              </div>

              {/* Token */}
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Token Endpoint</h3>
                <div className="mb-2">
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">POST /api/oauth/token</code>
                </div>
                <p className="text-gray-600 mb-3">
                  Exchanges authorization codes for access tokens, or refreshes access tokens using refresh tokens.
                </p>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Content-Type:</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">application/x-www-form-urlencoded</code>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Form Parameters (Authorization Code Grant):</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li><code className="bg-gray-100 px-1 rounded">grant_type</code> (required): <code className="bg-gray-100 px-1 rounded">authorization_code</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">code</code> (required): Authorization code from authorize endpoint</li>
                    <li><code className="bg-gray-100 px-1 rounded">redirect_uri</code> (required): Same redirect_uri used in authorization</li>
                    <li><code className="bg-gray-100 px-1 rounded">client_id</code> (required): Client identifier</li>
                  </ul>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Form Parameters (Refresh Token Grant):</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li><code className="bg-gray-100 px-1 rounded">grant_type</code> (required): <code className="bg-gray-100 px-1 rounded">refresh_token</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">refresh_token</code> (required): Refresh token from previous token response</li>
                    <li><code className="bg-gray-100 px-1 rounded">client_id</code> (required): Client identifier</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm mb-2">
                  <p className="font-semibold mb-1">Response (Success):</p>
                  <pre className="text-xs overflow-x-auto">{JSON.stringify({
                    access_token: "eyJhbGc...",
                    token_type: "Bearer",
                    expires_in: 3600,
                    refresh_token: "refresh_token_here",
                    scope: "read write"
                  }, null, 2)}</pre>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-semibold mb-1">Response (Error):</p>
                  <pre className="text-xs overflow-x-auto">{JSON.stringify({
                    error: "invalid_grant",
                    error_description: "Invalid or expired authorization code"
                  }, null, 2)}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* API Endpoints */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
            
            <div className="space-y-6">
              {/* Test Endpoint */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Test Authentication</h3>
                <div className="mb-2">
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">GET /api/zapier/test</code>
                </div>
                <p className="text-gray-600 mb-3">
                  Verifies OAuth token validity and returns authenticated user information.
                </p>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Headers:</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">Authorization: Bearer {'{access_token}'}</code>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-semibold mb-1">Response:</p>
                  <pre className="text-xs overflow-x-auto">{JSON.stringify({
                    id: "user-uuid",
                    email: "user@example.com",
                    business: {
                      id: "business-uuid",
                      name: "Business Name"
                    }
                  }, null, 2)}</pre>
                </div>
              </div>

              {/* Get Campaigns */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Campaigns</h3>
                <div className="mb-2">
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">GET /api/zapier/campaigns</code>
                </div>
                <p className="text-gray-600 mb-3">
                  Returns a list of campaigns for the authenticated user. Used for dynamic dropdowns in Zapier.
                </p>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Headers:</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">Authorization: Bearer {'{access_token}'}</code>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-semibold mb-1">Response:</p>
                  <pre className="text-xs overflow-x-auto">{JSON.stringify([
                    {
                      value: "campaign-id-32-chars",
                      label: "Campaign Name"
                    },
                    {
                      value: "another-campaign-id",
                      label: "Another Campaign"
                    }
                  ], null, 2)}</pre>
                </div>
              </div>

              {/* Send Review Request */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Send Review Request</h3>
                <div className="mb-2">
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">POST /api/zapier/review-request</code>
                </div>
                <p className="text-gray-600 mb-3">
                  Sends a review request to a customer via SMS or email based on the campaign configuration.
                </p>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Headers:</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">Authorization: Bearer {'{access_token}'}</code>
                  <br />
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">Content-Type: application/json</code>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Request Body:</p>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <pre className="text-xs overflow-x-auto">{JSON.stringify({
                      campaign_id: "campaign-id-32-chars",
                      first_name: "John",
                      phone: "+1234567890",
                      email: "john@example.com"
                    }, null, 2)}</pre>
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li><code className="bg-gray-100 px-1 rounded">campaign_id</code> (required): 32-character campaign identifier</li>
                    <li><code className="bg-gray-100 px-1 rounded">first_name</code> (required): Customer&apos;s first name</li>
                    <li><code className="bg-gray-100 px-1 rounded">phone</code> (optional): Customer&apos;s phone number in E.164 format</li>
                    <li><code className="bg-gray-100 px-1 rounded">email</code> (optional): Customer&apos;s email address</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm mb-2">
                  <p className="font-semibold mb-1">Response (Success):</p>
                  <pre className="text-xs overflow-x-auto">{JSON.stringify({
                    success: true,
                    review_request_id: "request-uuid",
                    primary_sent: true
                  }, null, 2)}</pre>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-semibold mb-1">Response (Error):</p>
                  <pre className="text-xs overflow-x-auto">{JSON.stringify({
                    success: false,
                    error: "Campaign not found with ID: invalid-id",
                    primary_sent: false
                  }, null, 2)}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Error Codes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Codes</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Status Code</th>
                    <th className="text-left py-2 px-2">Error</th>
                    <th className="text-left py-2 px-2">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b">
                    <td className="py-2 px-2">400</td>
                    <td className="py-2 px-2"><code className="bg-gray-100 px-1 rounded">invalid_request</code></td>
                    <td className="py-2 px-2">Missing or invalid required parameters</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2">400</td>
                    <td className="py-2 px-2"><code className="bg-gray-100 px-1 rounded">invalid_grant</code></td>
                    <td className="py-2 px-2">Invalid or expired authorization code or refresh token</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2">401</td>
                    <td className="py-2 px-2"><code className="bg-gray-100 px-1 rounded">unauthorized</code></td>
                    <td className="py-2 px-2">Invalid or missing OAuth token</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2">404</td>
                    <td className="py-2 px-2"><code className="bg-gray-100 px-1 rounded">not_found</code></td>
                    <td className="py-2 px-2">Campaign or resource not found</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2">500</td>
                    <td className="py-2 px-2"><code className="bg-gray-100 px-1 rounded">server_error</code></td>
                    <td className="py-2 px-2">Internal server error</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Rate Limits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rate Limits</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-gray-700">
                Rate limits are currently not enforced but may be implemented in the future. 
                Please use the API responsibly.
              </p>
            </div>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Support</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-2">
                For API support or questions, please contact:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Email: <a href="mailto:support@getfivestars.xyz" className="text-amber-600 hover:underline">support@getfivestars.xyz</a></li>
                <li>Website: <a href="https://www.getfivestars.xyz" className="text-amber-600 hover:underline">https://www.getfivestars.xyz</a></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

