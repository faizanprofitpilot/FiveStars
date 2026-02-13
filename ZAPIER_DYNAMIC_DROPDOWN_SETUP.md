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

### Step 3: Create a Hidden Trigger for Campaigns

**Important**: For action input fields, Zapier requires a **hidden trigger** to populate dynamic dropdowns. You cannot use `performList` directly in actions.

1. **Go to your Zapier app** in the Platform UI
2. **Create a new Trigger** (not an action)
3. **Name it**: "Campaign List" or "Get Campaigns" (this will be hidden from users)
4. **Configure the trigger**:
   - Go to **API Configuration** tab
   - **Method**: `GET`
   - **URL**: `https://www.getfivestars.xyz/api/zapier/campaigns`
   - **Headers**: 
     ```
     Authorization: Bearer {{bundle.authData.access_token}}
     ```
5. **Set the trigger as Hidden**:
   - Go to **Settings** tab
   - Find **"Visibility"** or **"Hidden"** option
   - ✅ **Check "Hidden"** - this prevents users from seeing it in the trigger list
6. **Configure Output Fields** (optional but recommended):
   - Add output fields: `value` and `label`
   - This helps Zapier understand the data structure
7. **Save the trigger**

### Step 4: Link the Trigger to Campaign ID Field

1. **Go back to your "Send Review Request" action**
2. **Go to Input Designer**
3. **Edit the "Campaign ID" field**
4. **In the Options section**:
   - ✅ Check **"Dropdown"** checkbox
   - ✅ Check **"Alters Dynamic Fields"** (if you want it to affect other fields)
   - Select **"Dynamic"** as the dropdown type
5. **In "Dropdown Source"**:
   - Select the **hidden trigger** you just created ("Campaign List" or "Get Campaigns")
   - **Value Field**: Select `value` (the campaign_id)
   - **Label Field**: Select `label` (the campaign name)
6. **Click "Save"**

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

