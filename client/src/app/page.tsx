'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700">
            Shorten. Share. Track.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Create powerful short links in seconds. Join thousands of users who trust ShortLink for their URL shortening needs.
          </p>

          <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 text-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 text-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="lg" className="text-gray-300 hover:text-white px-8 py-4 text-lg border border-white/10 hover:bg-white/5 transition-all hover:scale-105">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-600">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="h-12 w-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-400">Generate short links instantly with our high-performance infrastructure.</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure & Reliable</h3>
            <p className="text-gray-400">Your links are safe with us. We use enterprise-grade security measures.</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="h-12 w-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Analytics Ready</h3>
            <p className="text-gray-400">Track clicks and engagement on your shortened links in real-time.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
