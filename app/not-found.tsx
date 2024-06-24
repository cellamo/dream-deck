"use client";

/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import { Moon, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-800 to-blue-900 flex flex-col items-center justify-center text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Moon className="h-24 w-24 text-purple-400 mx-auto mb-6" />
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-xl mb-8">Oops! It seems you've wandered into a dream that doesn't exist.</p>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out">
          <Home className="h-5 w-5 mr-2" />
          Return to Dream Deck
        </Link>
      </motion.div>
    </div>
  );
}
