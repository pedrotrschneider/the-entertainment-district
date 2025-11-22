# Trakt.tv Setup Instructions

## Getting Your Trakt API Credentials

Follow these steps to register your application with Trakt and get your API credentials:

### 1. Create a Trakt Account
- Go to [trakt.tv](https://trakt.tv)
- Sign up for a free account if you don't have one

### 2. Create an Application
1. Navigate to [trakt.tv/oauth/applications](https://trakt.tv/oauth/applications)
2. Click **"New Application"**

### 3. Fill Out Application Details

**Name**: `The Entertainment District` (or any name you prefer)

**Description**: `Personal media management application`

**Redirect URI**: `urn:ietf:wg:oauth:2.0:oob`
> ⚠️ **Important**: This exact URI is required for device authentication

**Permissions**: Leave all boxes checked (default)

**JavaScript Origins**: Leave blank (not needed for device flow)

### 4. Save and Copy Credentials

After saving, you'll see:
- **Client ID**: A long alphanumeric string (e.g., `abc123...`)
- **Client Secret**: Another long string (keep this private)

### 5. Enter Credentials in TED

1. Open **Settings** in The Entertainment District
2. Scroll to the **Trakt Integration** section
3. Paste your **Client ID** in the input field
4. (Optional) Paste your **Client Secret** if requested
5. Click **Save**
6. Click **"Connect to Trakt"** to authenticate

### 6. Device Authentication

When you connect:
1. You'll see a **device code** (e.g., `ABCD-EFGH`)
2. Open [trakt.tv/activate](https://trakt.tv/activate) in your browser
3. Enter the device code
4. Authorize the application
5. Return to TED - it will automatically detect the authorization!

## Troubleshooting

**"Invalid Client"**: Double-check your Client ID is correct

**"Code Expired"**: Device codes expire after 10 minutes - click "Connect to Trakt" again

**"Not Syncing"**: Make sure you clicked "Authorize" on the Trakt website

## Features After Connection

Once connected, you can:
- ✅ Add/remove items from your Trakt watchlist
- ✅ Mark movies/shows as watched
- ✅ Sync watch progress
- ✅ View trending content from Trakt
- ✅ See your watchlist in the app
