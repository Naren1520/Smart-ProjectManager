'use client';

import { signIn } from 'next-auth/react';
import { ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/teams';

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group transition-opacity hover:opacity-80">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                    TeamForge AI
                </span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-neutral-400">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl">
            <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-neutral-900 rounded-xl py-4 px-6 font-semibold flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all active:scale-[0.98] group"
            >
                {/* Google Icon SVG */}
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
            </button>

            <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>Manage multiple projects effortlessly</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>AI-powered task assignment</span>
                </div>
                 <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>Real-time team collaboration</span>
                </div>
            </div>
        </div>
        
        <div className="mt-8 text-center">
             <Link href="/" className="text-neutral-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}