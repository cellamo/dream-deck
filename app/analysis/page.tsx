"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart, Zap, Sparkles } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import MobileNavbar from '../../components/MobileNavbar';
import Sidebar from '../../components/Sidebar';

const AnalysisPage: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarPinned, setIsSidebarPinned] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarPinned');
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-gray-900 via-purple-800 to-blue-900 text-white' : 'bg-gradient-to-b from-blue-100 via-purple-200 to-pink-100 text-gray-900'}`}>
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar onPinChange={setIsSidebarPinned} />
        </div>
        <div className={`flex-1 transition-all duration-300 ${isSidebarPinned ? 'md:ml-64' : 'md:ml-16'}`}>
          <div className="container mx-auto px-4 py-8 pb-24 md:pb-8"> {/* Adjusted padding for mobile */}
            <motion.h1 
              className={`text-4xl font-bold mb-8 text-center ${
                darkMode ? 'text-purple-300' : 'text-indigo-800'
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Dream Analysis Dashboard
            </motion.h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnalysisCard 
                title="Emotion Trends" 
                icon={<BarChart className="w-8 h-8" />}
                description="Visualize your emotional patterns across dreams."
              />
              <AnalysisCard 
                title="Theme Insights" 
                icon={<Brain className="w-8 h-8" />}
                description="Discover recurring themes and symbols in your dreams."
              />
              <AnalysisCard 
                title="Lucidity Score" 
                icon={<Zap className="w-8 h-8" />}
                description="Track your progress in achieving lucid dreams."
              />
              <AnalysisCard 
                title="Dream Predictions" 
                icon={<Sparkles className="w-8 h-8" />}
                description="AI-powered predictions based on your dream patterns."
              />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </div>
  );
};

const AnalysisCard: React.FC<{ title: string; icon: React.ReactNode; description: string }> = ({ title, icon, description }) => {
  const { darkMode } = useDarkMode();
  
  return (
    <motion.div 
      className={`p-6 rounded-lg shadow-lg ${
        darkMode 
          ? 'bg-purple-900/30 backdrop-lg' 
          : 'bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200'
      }`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="flex items-center mb-4">
        <div className={`${darkMode ? 'text-purple-300' : 'text-indigo-600'}`}>
          {icon}
        </div>
        <h2 className={`text-2xl font-semibold ml-2 ${
          darkMode ? 'text-purple-200' : 'text-indigo-800'
        }`}>{title}</h2>
      </div>
      <p className={`${darkMode ? 'text-purple-200' : 'text-indigo-700'}`}>{description}</p>
      <button className={`mt-4 px-4 py-2 rounded-full ${
        darkMode 
          ? 'bg-purple-600 hover:bg-purple-700' 
          : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
      } text-white transition-colors duration-300 transform hover:scale-105`}>
        Explore
      </button>
    </motion.div>
  );
};

export default AnalysisPage;
