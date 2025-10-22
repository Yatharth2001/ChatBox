# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`

## Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 3: Test the Configuration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Login with Google"
4. You should be redirected to Google's OAuth consent screen

## Common Issues and Solutions

### Issue: "redirect_uri_mismatch"
**Solution**: Make sure the redirect URI in Google Console exactly matches:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### Issue: "invalid_client"
**Solution**: Check that your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Issue: "access_denied"
**Solution**: Make sure the Google+ API is enabled in your Google Cloud project

### Issue: "OAuth consent screen not configured"
**Solution**: 
1. Go to "APIs & Services" > "OAuth consent screen"
2. Fill out the required fields (App name, User support email, Developer contact)
3. Add your email to test users if in testing mode

## Fallback Authentication

If Google OAuth is not configured, the app will automatically fall back to credential authentication using the seeded users:
- yatharth: `yatharth@gmail.com` / `password`
- manasvi: `manasvi@gmail.com` / `password`

## Testing OAuth Configuration

You can check if OAuth is properly configured by looking at the debug info on the login page. It will show:
- Google OAuth: Configured/Not configured
- GitHub OAuth: Configured/Not configured
- Fallback Auth: Enabled/Disabled

