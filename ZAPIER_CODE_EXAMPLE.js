// For Platform UI integrations, do NOT wrap in a perform function
// The API configuration automatically handles the perform
// Also, performList is NOT needed for actions (only for triggers)

const options = {
  url: 'https://www.getfivestars.xyz/api/zapier/review-request',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${bundle.authData.access_token}`
  },
  params: {},
  body: {
    'first_name': bundle.inputData.first_name,
    'phone': bundle.inputData.phone,
    'email': bundle.inputData.email,
    'campaign_id': bundle.inputData.campaign_id
  },
  removeMissingValuesFrom: {
    'body': false,
    'params': false
  }
}

return z.request(options)
  .then((response) => {
    const results = response.json
    return results
  })
