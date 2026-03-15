'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TradeFlowLogo } from '@/components/icons/TradeFlowLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password. Try demo: james@oakfieldfarm.co.uk / demo1234');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <TradeFlowLogo className="h-12 w-auto mx-auto" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[#1E293B] font-[var(--font-dm-sans)]">
            Sign in to TradeFlow
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your farm compliance in one place
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 outline-none transition-colors text-base min-h-[48px]"
              placeholder="you@farm.co.uk"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 outline-none transition-colors text-base min-h-[48px]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1B5E20] text-white font-semibold rounded-xl hover:bg-[#145218] transition-colors min-h-[48px] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Demo: james@oakfieldfarm.co.uk / demo1234
            </p>
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/" className="text-[#1B5E20] font-semibold hover:underline">
            Start Free Trial
          </Link>
        </p>
      </div>
    </div>
  );
}
