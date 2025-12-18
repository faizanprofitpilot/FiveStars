# Zapier Dynamic Dropdown Setup for Campaign ID

## Overview

The Campaign ID field in the "Send Review Request" action should be configured as a dynamic dropdown so users can select from their available campaigns directly in the Zapier editor.

## Endpoint

The dynamic dropdown endpoint is already implemented and available at:

```
GET https://www.getfivestars.xyz/api/zapier/campaigns
```

**Authentication**: OAuth Bearer token (required)

**Response Format**:
```json
[
  {
    "value": "campaign-id-32-chars",
    "label": "Campaign Name"
  },
  {
    "value": "another-campaign-id",
    "label": "Another Campaign"
  }
]
```

## Configuration in Zapier Platform

### Step 1: Edit the Action Input Field

1. Go to your Zapier app in the Platform UI
2. Navigate to your "Send Review Request" action
3. Go to **Input Designer**
4. Find the "Campaign ID" field
5. Click to edit it

### Step 2: Enable "Alters Dynamic Fields" (Don't Use Dropdown Checkbox)

**Important**: When using `altersDynamicFields`, you should NOT check the "Dropdown" checkbox in Input Designer. Instead, configure the dropdown in API Configuration.

In the **Options** section at the bottom of the field configuration:

1. ❌ **Do NOT check "Dropdown"** (this causes schema validation errors with `altersDynamicFields`)
2. ✅ **Check the "Alters Dynamic Fields" checkbox** (this is key!)
3. Keep "Required" checked (since Campaign ID is required)
4. Leave "Allows Multiples" unchecked
5. **Leave "Type" as "String"** (don't change it)
6. Click **"Save"**

**Note**: The dropdown will be configured in the API Configuration tab, not here.

### Step 3: Configure Dynamic Dropdown in API Configuration

1. **In the API Configuration tab**, look for a checkbox that says **"Switch to Code Mode"**
2. ✅ **Check "Switch to Code Mode"** - this will show you the code editor
3. You'll see the code for your action. You need to add a `performList` function for the `campaign_id` field

**Add the performList Function:**

In the code editor, you should see something like:

```javascript
const perform = async (z, bundle) => {
  // Your existing POST request code for sending review request
  return z.request({
    method: 'POST',
    url: 'https://www.getfivestars.xyz/api/zapier/review-request',
    // ... rest of your code
  })
}
```

**Add this new function** (for the dropdown):

```javascript
const performList = async (z, bundle) => {
  // This populates the dropdown for campaign_id field
  const response = await z.request({
    method: 'GET',
    url: 'https://www.getfivestars.xyz/api/zapier/campaigns',
    headers: {
      'Authorization': `Bearer ${bundle.authData.access_token}`
    }
  })
  
  // Return the campaigns array directly (already in correct format: [{value, label}])
  return response.json
}
```

**Then update your module.exports** to include `performList`:

```javascript
module.exports = {
  // ... your existing exports
  perform: perform,
  performList: performList, // This makes campaign_id a dynamic dropdown
  // ... other exports
}
```

**Important**: The `performList` function is automatically called by Zapier when a field has `altersDynamicFields: true`. It should return an array of objects with `value` and `label` properties, which your API already provides.

4. **Save the code**
5. **Switch back to UI mode** (uncheck "Switch to Code Mode") if you want, or test it in Code Mode
6. **Test the dropdown** - it should now show your campaigns when you test the action

### Step 4: Test the Dynamic Dropdown

1. Go to **Test Setup** in your action
2. Connect your FiveStars account (OAuth)
3. Test the "Campaign ID" field
4. You should see a dropdown with your campaigns listed by name
5. Selecting a campaign should populate the `campaign_id` value

## Alternative: Using "Alters Dynamic Fields"

If the above doesn't work, you can use the "Alters Dynamic Fields" approach:

1. In **Input Designer**, keep Campaign ID as a regular field
2. Go to **API Configuration**
3. Add a **pre-request hook** or use **Dynamic Fields**
4. Configure it to call `/api/zapier/campaigns` before the main request
5. Map the response to populate the Campaign ID dropdown

## Verification

After configuration:

✅ Users should see a dropdown instead of a text input  
✅ Campaigns are listed by name (user-friendly)  
✅ Selecting a campaign populates the correct `campaign_id`  
✅ The dropdown updates based on the authenticated user's campaigns  

## Troubleshooting

### Dropdown is Empty
- Verify OAuth token is being sent correctly
- Check that the user has at least one campaign
- Verify the endpoint returns the correct format

### Wrong Format Error
- Ensure the endpoint returns `[{ value: "...", label: "..." }]`
- Check that `value` contains the `campaign_id` (32-char string)
- Verify `label` contains the campaign name

### Authentication Error
- Verify OAuth is configured correctly
- Check that the token is included in the Authorization header
- Test the endpoint manually with a valid token

## Current Implementation Status

✅ Endpoint exists: `/api/zapier/campaigns`  
✅ Returns correct format: `[{ value, label }]`  
✅ Uses OAuth authentication  
✅ Returns user's campaigns only  
⏳ Needs to be configured in Zapier Platform UI (this document)

