# GitHub Authentication Setup Guide

## Overview

LandingVille now includes GitHub authentication to enhance your experience with the GitHub API. Without authentication, some endpoints (like teams, projects, and packages) return 403 Forbidden errors, and the rate limit is restricted to 60 requests per hour. With authentication, you get:

- ✅ Access to organization teams, projects, and packages
- ✅ Increased API rate limit (5,000 requests/hour)
- ✅ Access to private repositories (if token has permissions)

## How to Create a GitHub Personal Access Token

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens

2. **Click "Generate new token"** 
   - Choose "Generate new token (classic)"

3. **Configure your token**
   - Give it a descriptive name (e.g., "LandingVille")
   - Set an expiration date (recommended: 90 days)
   - Select the following scopes:
     - `read:org` - Read organization data
     - `read:user` - Read user profile data
     - `repo` - Access repositories (for detailed stats)

4. **Generate and copy the token**
   - Click "Generate token"
   - **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## How to Use Authentication in LandingVille

1. **Access the Login Page**
   - Click the login icon in the navigation bar (top right)
   - Or navigate directly to: `/login`

2. **Enter Your Token**
   - Paste your GitHub Personal Access Token
   - Click "Login with Token"

3. **Verification**
   - The app will verify your token with GitHub
   - If successful, you'll be redirected to the home page
   - The login icon will change to a logout icon

4. **Using the App**
   - All GitHub API requests will now include your token
   - You'll see teams, projects, and packages on organization pages
   - No more rate limit issues!

5. **Logout**
   - Click the logout icon in the navigation bar to remove your token

## Security Notes

⚠️ **Important Security Information**:

- Your token is stored locally in your browser's localStorage
- The token is never sent to any server except GitHub's API
- Always keep your token secret and never share it
- Use the minimum required scopes
- Set an expiration date on your token
- Revoke tokens you're no longer using

## Troubleshooting

### "Invalid token" error
- Make sure you copied the entire token
- Verify the token hasn't expired
- Check that you selected the correct scopes

### Still seeing authentication prompts
- Make sure you're logged in (check the navbar icon)
- Try logging out and logging in again
- Clear your browser's localStorage and create a new token

### Rate limit still exceeded
- Wait for the rate limit to reset (check response headers)
- Ensure your token is being used (check network requests in browser DevTools)

## Alternative: Continue Without Authentication

You can still use LandingVille without authentication:
- Click "Continue without Authentication" on the login page
- Most features will work, but with limitations:
  - No access to teams, projects, or packages
  - Rate limit of 60 requests/hour
  - Some organization data may be incomplete

## API Endpoints That Require Authentication

The following GitHub API endpoints require authentication:
- `/orgs/{org}/teams` - Organization teams
- `/orgs/{org}/projects` - Organization projects  
- `/orgs/{org}/packages` - Organization packages

All other endpoints work without authentication but have lower rate limits.
