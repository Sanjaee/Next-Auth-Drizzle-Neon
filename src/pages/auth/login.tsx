import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LoadingOverlay from './LoadingOverlay';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { callbackUrl } = router.query;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl?.toString() || '/');
    }
  }, [status, router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const returnTo = callbackUrl || router.query.returnTo || '/';
      await signIn('google', { callbackUrl: returnTo.toString() });
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const handleBack = (steps = -1) => {
    if (typeof window !== 'undefined') {
      window.history.go(steps);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingOverlay isLoading={true} />
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
      <LoadingOverlay isLoading={isLoading} />
      <button
        onClick={() => handleBack(-2)}
        disabled={isLoading}
        className="absolute top-10 left-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2 md:mt-20 md:ml-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Login to access many features on zacode
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Tolong login dengan browser seperti chrome atau sejenisnya karena Google melarang penggunaan WebView atau browser in-app untuk login
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                ${isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-600'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <Image
                    src="/google.png"
                    alt="Google"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="text-base font-medium">Continue with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              By continuing, you agree to our{' '}
              <a
                href="/terms"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}