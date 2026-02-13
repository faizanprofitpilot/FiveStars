const perform = async (z, bundle) => {
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
}

const performList = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: 'https://www.getfivestars.xyz/api/zapier/campaigns',
    headers: {
      'Authorization': `Bearer ${bundle.authData.access_token}`
    }
  })
  
  return response.json
}

module.exports = {
  perform: perform,
  performList: performList
}

