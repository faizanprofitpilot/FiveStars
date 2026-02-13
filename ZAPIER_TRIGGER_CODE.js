// Code for the "Get Campaigns" hidden trigger
// This fetches campaigns for the dynamic dropdown
// In Zapier Code Mode, just define the function - no module.exports needed

const perform = async (z, bundle) => {
  return z.request({
    method: 'GET',
    url: 'https://www.getfivestars.xyz/api/zapier/campaigns',
    headers: {
      'Authorization': `Bearer ${bundle.authData.access_token}`
    }
  }).then(response => {
    // In Zapier, response.json contains the parsed JSON
    // For polling triggers, we need to return an array
    const data = response.json
    return Array.isArray(data) ? data : []
  })
}

