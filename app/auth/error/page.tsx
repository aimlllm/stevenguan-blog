'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Home, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { site } from '@/lib/config';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [errorDescription, setErrorDescription] = useState<string>('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    
    if (errorParam) {
      switch (errorParam) {
        case 'Configuration':
          setError('Configuration Error');
          setErrorDescription('There is a problem with the server configuration. Please try again later or contact support.');
          break;
        case 'AccessDenied':
          setError('Access Denied');
          setErrorDescription('You cancelled the authentication process or access was denied by the provider.');
          break;
        case 'Verification':
          setError('Verification Failed');
          setErrorDescription('Unable to verify your identity. The verification token may have expired.');
          break;
        case 'OAuthSigninFailed':
          setError('OAuth Sign-in Failed');
          setErrorDescription('Failed to sign in with the OAuth provider. Please check your account settings and try again.');
          break;
        case 'OAuthCallbackError':
          setError('OAuth Callback Error');
          setErrorDescription('There was an error during the OAuth callback. This might be due to misconfigured redirect URLs.');
          break;
        case 'OAuthConfigurationError':
          setError('OAuth Configuration Error');
          setErrorDescription('The OAuth provider is not properly configured. Please contact support.');
          break;
        case 'OriginMissing':
          setError('Origin Missing');
          setErrorDescription('The authentication request is missing required origin information.');
          break;
        case 'Signin':
          setError('Sign-in Error');
          setErrorDescription('An error occurred during the sign-in process. Please try again.');
          break;
        case 'OAuthAccountNotLinked':
          setError('Account Not Linked');
          setErrorDescription('This account is associated with a different sign-in method. Please use the original method you signed up with.');
          break;
        case 'EmailCreateAccount':
          setError('Email Account Creation Failed');
          setErrorDescription('Could not create an account with this email address.');
          break;
        case 'Callback':
          setError('Callback Error');
          setErrorDescription('An error occurred in the OAuth callback handler.');
          break;
        case 'OAuthCreate':
          setError('OAuth Account Creation Failed');
          setErrorDescription('Could not create a user account with this OAuth provider.');
          break;
        case 'SessionRequired':
          setError('Session Required');
          setErrorDescription('You need to be signed in to access this page.');
          break;
        default:
          setError('Authentication Error');
          setErrorDescription('An unexpected authentication error occurred. Please try again.');
      }
    } else {
      setError('Unknown Error');
      setErrorDescription('An unknown authentication error occurred.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {site.name}
            </Link>
            
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {error}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Something went wrong during authentication
            </p>
          </div>

          {/* Error Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="text-center mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {errorDescription}
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Link>
              
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Common Solutions
              </h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p>• Make sure you're using the same browser that started the sign-in</p>
                <p>• Clear your browser cache and cookies</p>
                <p>• Disable ad blockers or privacy extensions temporarily</p>
                <p>• Try signing in from an incognito/private browsing window</p>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>
                Still having trouble?{' '}
                <a 
                  href="mailto:support@stevenguan.com" 
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 