"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import DreamFeed from '../../components/DreamFeed';
import InsightsPanel from '../../components/InsightsPanel';
import QuickRecordButton from '../../components/QuickRecordButton';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '../DarkModeContext';

const Dashboard = () => {
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePinChange = (isPinned: boolean) => {
    setIsSidebarPinned(isPinned);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!user) {
        router.push("/403");
      } 
    }, 50);

    return () => clearTimeout(delay);
  }, [user, router]);

  return (
      <div className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900 via-purple-800 to-blue-900'
          : 'bg-gradient-to-b from-blue-100 via-purple-200 to-pink-100'
      }`}>
        <div className="flex">
          <Sidebar onPinChange={handlePinChange} />
          <main className={`flex-1 p-6 transition-all duration-300 ease-in-out ${isSidebarPinned ? 'ml-64' : 'ml-16'}`}>
            <div className="flex justify-between items-center mb-6">
              <h1 className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-indigo-800'
              }`}>Dream Journal</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DreamFeed />
              </div>
              <div className="lg:col-span-1">
                <InsightsPanel />
              </div>
            </div>
          </main>
        </div>
        <QuickRecordButton triggerRefresh={triggerRefresh} />
      </div>
  );
};

export default Dashboard;
