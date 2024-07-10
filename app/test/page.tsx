"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, BarChart2, Share2, Check, Globe, UserCircle, Settings, LogOut } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAuth = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-800 to-blue-900 text-white">
      <Navbar />
      <header className="flex justify-between items-center p-4 bg-purple-900">
        <div className="text-2xl font-bold">Dream Deck</div>
        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            <UserCircle className="h-6 w-6 text-white" />
          </button>
          {isDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                Signed in as
                <br />
                <strong>{user?.username}</strong>
              </div>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserCircle className="inline-block h-4 w-4 mr-2" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="inline-block h-4 w-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={handleAuth}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="inline-block h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="p-6">
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Today&apos;s Dream Entry</h2>
          <div className="bg-purple-500/30 p-4 rounded-lg flex items-center space-x-4">
            <Mic className="w-10 h-10 text-purple-300" />
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">
              Record Dream
            </button>
            <div className="flex space-x-2">
              <EmotionTag emotion="Happy" />
              <EmotionTag emotion="Sad" />
              <EmotionTag emotion="Anxious" />
              {/* More emotion tags */}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Dream Insights</h2>
          <div className="bg-purple-500/30 p-4 rounded-lg">
            <BarChart2 className="w-10 h-10 text-purple-300 mb-4" />
            {/* Graphs and charts component */}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Dream Challenges</h2>
          <div className="bg-purple-500/30 p-4 rounded-lg flex items-center space-x-4">
            <Check className="w-10 h-10 text-purple-300" />
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">
              View Challenges
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Community Highlights</h2>
          <div className="bg-purple-500/30 p-4 rounded-lg">
            <Share2 className="w-10 h-10 text-purple-300 mb-4" />
            {/* Community shared dreams and artwork */}
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 p-4 flex justify-between items-center">
        <div>
          <a href="#" className="text-purple-300 hover:text-white">Contact Us</a>
          <a href="#" className="ml-4 text-purple-300 hover:text-white">Privacy Policy</a>
          <a href="#" className="ml-4 text-purple-300 hover:text-white">Terms of Service</a>
        </div>
        <div className="flex space-x-4">
          <a href="#"><Globe className="w-6 h-6 text-purple-300 hover:text-white" /></a>
          <a href="#"><Globe className="w-6 h-6 text-purple-300 hover:text-white" /></a>
          <a href="#"><Globe className="w-6 h-6 text-purple-300 hover:text-white" /></a>
        </div>
      </footer>
    </div>
  );
}

const EmotionTag: React.FC<{ emotion: string }> = ({ emotion }) => (
  <button className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-1 px-3 rounded-full">
    {emotion}
  </button>
);
