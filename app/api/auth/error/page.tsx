'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.'
      case 'Verification':
        return 'The verification token has expired or has already been used.'
      case 'OAuthSignin':
        return 'Error in OAuth sign-in process.'
      case 'OAuthCallback':
        return 'Error in OAuth callback.'
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account.'
      case 'EmailCreateAccount':
        return 'Could not create account with this email.'
      case 'Callback':
        return 'Error in callback.'
      case 'OAuthAccountNotLinked':
        return 'Email already exists with a different provider.'
      case 'EmailSignin':
        return 'Error sending sign-in email.'
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.'
      case 'SessionRequired':
        return 'Please sign in to access this page.'
      default:
        return 'An error occurred during authentication.'
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Authentication Error</h1>
        <div className="error">
          {getErrorMessage(error)}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Common Solutions:</h3>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>Make sure you have configured Google OAuth credentials</li>
            <li>Check that the redirect URI is set correctly in Google Console</li>
            <li>Verify that NEXTAUTH_URL matches your domain</li>
            <li>Try using the fallback credentials instead</li>
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link href="/login" className="btn">
            Try Again
          </Link>
        </div>

        {/* <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p>Debug Info:</p>
          <p>Error: {error || 'Unknown'}</p>
          <p>Google OAuth configured: {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CONFIGURED || 'false'}</p>
        </div> */}
      </div>
    </div>
  )
}

