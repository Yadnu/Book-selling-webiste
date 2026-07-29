'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Compass, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@arthurmilton.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full gothic-card p-8 rounded-xl border border-brass/40 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded bg-brass/10 border border-brass/40 flex items-center justify-center text-brass mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl text-fog font-semibold">Writer Studio Login</h1>
          <p className="font-mono text-xs text-seafoam">Author & Content Management System</p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/40 rounded text-red-200 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="block text-seafoam uppercase">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-storm text-fog p-3 pl-10 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
              />
              <Mail className="w-4 h-4 text-seafoam absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-seafoam uppercase">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-storm text-fog p-3 pl-10 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
              />
              <Lock className="w-4 h-4 text-seafoam absolute left-3 top-3.5" />
            </div>
            <p className="text-[10px] text-seafoam/60">Demo Credentials: admin@arthurmilton.com / admin123</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass hover:bg-brass-hover text-abyssal font-bold py-3 rounded transition-colors text-sm uppercase tracking-wider"
          >
            {loading ? 'Authenticating...' : 'Enter Studio'}
          </button>
        </form>
      </div>
    </div>
  );
}
