'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Chrome, Github, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { site } from '@/shared/utils/config';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get error from URL params
  const authError = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    // If user is already signed in, redirect them
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
      return;
    }

    // Set available providers based on configuration
    const availableProviders = {
      google: {
        id: 'google',
        name: 'Google',
      },
      github: {
        id: 'github',
        name: 'GitHub',
      },
    };
    
    setProviders(availableProviders);
  }, [session, status, router, callbackUrl]);

  // Handle error messages
  useEffect(() => {
    if (authError) {
      switch (authError) {
        case 'Configuration':
          setError('Authentication service is temporarily unavailable. Please try again later.');
          break;
        case 'AccessDenied':
          setError('Access denied. You may have cancelled the sign-in process.');
          break;
        case 'Verification':
          setError('Unable to verify your account. Please try again.');
          break;
        case 'OAuthSigninFailed':
          setError('OAuth sign-in failed. Please check your account settings.');
          break;
        case 'OAuthCallbackError':
          setError('Authentication callback failed. Please try again.');
          break;
        case 'OAuthConfigurationError':
          setError('OAuth configuration error. Please contact support.');
          break;
        case 'OriginMissing':
          setError('Authentication origin error. Please try again.');
          break;
        default:
          setError('An authentication error occurred. Please try again.');
      }
    }
  }, [authError]);

  const handleSignIn = async (providerId: string) => {
    try {
      setIsLoading(providerId);
      setError(null);
      
      const result = await signIn(providerId, {
        callbackUrl,
        redirect: true,
      });

      // If signIn doesn't redirect, there might be an error
      if (result?.error) {
        setError('Sign-in failed. Please try again.');
        setIsLoading(null);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(null);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return <Chrome className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      default:
        return providerId.charAt(0).toUpperCase() + providerId.slice(1);
    }
  };

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'github':
        return 'bg-gray-900 hover:bg-gray-800 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

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
            
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Sign-in Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="space-y-4">
              {providers && Object.values(providers).map((provider: any) => (
                <button
                  key={provider.id}
                  onClick={() => handleSignIn(provider.id)}
                  disabled={isLoading === provider.id}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getProviderColor(provider.id)}`}
                >
                  {isLoading === provider.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    getProviderIcon(provider.id)
                  )}
                  <span>
                    {isLoading === provider.id
                      ? 'Signing in...'
                      : `Continue with ${getProviderName(provider.id)}`
                    }
                  </span>
                </button>
              ))}

              {!providers && !error && (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading sign-in options...</p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Info Section */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
              
              <div className="flex items-center justify-center gap-4 text-sm">
                <Link 
                  href="/about" 
                  className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  About
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link 
                  href="/blog" 
                  className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Why sign in?
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Join discussions with insightful comments</p>
              <p>• React to posts with likes and dislikes</p>
              <p>• Get personalized content recommendations</p>
              <p>• Track your reading progress and favorites</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 