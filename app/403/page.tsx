"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotAuthorized() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      router.push('/');
    }, 7000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-800 to-blue-900 flex flex-col items-center justify-center text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative">
          <Lock className="h-24 w-24 text-purple-400 mx-auto mb-6" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold"
          >
            !
          </motion.div>
        </div>
        <h1 className="text-6xl font-bold mb-4">403</h1>
        <h2 className="text-3xl font-semibold mb-6">Access Denied</h2>
        <p className="text-xl mb-8">Oops! You don&apos;t have permission to enter this dream realm.</p>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="relative inline-block p-4 bg-purple-700 rounded-full">
            <svg className="w-24 h-24">
              <circle
                className="text-gray-300"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <circle
                className="text-purple-500"
                strokeWidth="5"
                strokeDasharray={283}
                strokeDashoffset={283 - (283 * countdown) / 7}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
              {countdown}
            </span>
          </div>
        </motion.div>

        <p className="text-lg mb-6">Redirecting to home in {countdown} seconds...</p>
        
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out">
          <Home className="h-5 w-5 mr-2" />
          Return to Dream Deck Now
        </Link>
      </motion.div>
    </div>
  );
}
