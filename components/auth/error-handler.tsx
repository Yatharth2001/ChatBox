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
        return 'Could not create OAuth user.'
      case 'EmailCreateAccount':
        return 'Could not create email user.'
      case 'Callback':
        return 'Error in the OAuth callback handler.'
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account.'
      case 'EmailSignin':
        return 'Error sending the sign-in email.'
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.'
      default:
        return 'An error occurred during sign-in.'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2 text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/auth/signin"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
