'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TradeFlowLogo } from '@/components/icons/TradeFlowLogo';

const demoAccounts = [
  { 
    email: 'admin@tradeflow.co.uk', 
    label: 'Admin', 
    icon: '👔', 
    description: 'Office Manager — Full Access',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  { 
    email: 'engineer1@tradeflow.co.uk', 
    label: 'Engineer', 
    icon: '🔧', 
    description: 'Field Technician — Job Management',
    color: 'bg-green-500 hover:bg-green-600'
  },
  { 
    email: 'engineer2@tradeflow.co.uk', 
    label: 'Apprentice', 
    icon: '🎓', 
    description: 'Junior Technician — Limited Access',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

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
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setDemoLoading(demoEmail);
    setError('');

    const result = await signIn('credentials', {
      email: demoEmail,
      password: 'demo1234',
      redirect: false,
    });

    if (result?.error) {
      setError('Demo login failed');
      setDemoLoading(null);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <TradeFlowLogo className="h-12 w-auto mx-auto" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[#0F172A] font-[var(--font-dm-sans)]">
            Sign in to TradeFlow
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your field service operations in one place
          </p>
        </div>

        {/* Demo Login Buttons */}
        <div className="mb-6 space-y-3">
          <p className="text-sm font-medium text-slate-600 text-center mb-3">Try Demo Mode:</p>
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((demo) => (
              <button
                key={demo.email}
                onClick={() => handleDemoLogin(demo.email)}
                disabled={demoLoading !== null}
                className={`${demo.color} text-white px-4 py-3 rounded-xl font-medium transition-all min-h-[60px] disabled:opacity-50 flex items-center gap-3 shadow-sm hover:shadow-md`}
              >
                <span className="text-2xl">{demo.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{demo.label}</div>
                  <div className="text-xs opacity-90">{demo.description}</div>
                </div>
                {demoLoading === demo.email && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#F8FAFC] text-slate-500">Or sign in with your account</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-colors text-base min-h-[48px]"
              placeholder="you@company.co.uk"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-colors text-base min-h-[48px]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1E3A5F] text-white font-semibold rounded-xl hover:bg-[#162D4A] transition-colors min-h-[48px] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/" className="text-[#2563EB] font-semibold hover:underline">
            Start Free Trial
          </Link>
        </p>
      </div>
    </div>
  );
}
