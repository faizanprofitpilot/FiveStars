#!/usr/bin/env node

/**
 * Test Twilio SMS endpoint
 * Usage: node test-twilio.js <phone-number> [message]
 * Example: node test-twilio.js +14155551234 "Test message"
 */

const phoneNumber = process.argv[2]
const message = process.argv[3] || 'Test message from FiveStars'

if (!phoneNumber) {
  console.error('Usage: node test-twilio.js <phone-number> [message]')
  console.error('Example: node test-twilio.js +14155551234 "Test message"')
  process.exit(1)
}

// Use localhost for local testing, or your production URL
const baseUrl = process.env.APP_URL || 'http://localhost:3000'
const testUrl = `${baseUrl}/api/twilio/test`

console.log('Testing Twilio SMS endpoint...')
console.log('URL:', testUrl)
console.log('To:', phoneNumber)
console.log('Message:', message)
console.log('')

fetch(testUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: phoneNumber,
    body: message,
  }),
})
  .then(async (response) => {
    const data = await response.json()
    console.log('Status:', response.status, response.statusText)
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (response.ok && data.success) {
      console.log('\n✅ SUCCESS! Message sent successfully!')
      console.log('Message SID:', data.messageSid)
      console.log('Status:', data.status)
    } else {
      console.log('\n❌ FAILED!')
      if (data.error) {
        console.log('Error:', data.error)
      }
      if (data.details) {
        console.log('Details:', JSON.stringify(data.details, null, 2))
      }
    }
  })
  .catch((error) => {
    console.error('Request failed:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Could not connect to server.')
      console.error('Make sure your dev server is running: npm run dev')
    }
  })

