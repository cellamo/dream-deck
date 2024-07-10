"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import DreamFeed from "../../components/DreamFeed";
import InsightsPanel from "../../components/InsightsPanel";
import QuickRecordButton from "../../components/QuickRecordButton";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";
import { useDarkMode } from "../DarkModeContext";
import MobileNavbar from "@/components/MobileNavbar";

const Dashboard = () => {
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePinChange = (isPinned: boolean) => {
    setIsSidebarPinned(isPinned);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  /*   useEffect(() => {
    const delay = setTimeout(() => {
      if (!user) {
        router.push("/403");
      } 
    }, 50);

    return () => clearTimeout(delay);
  }, [user, router]); */

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-purple-800 to-blue-900"
          : "bg-gradient-to-b from-blue-100 via-purple-200 to-pink-100"
      }`}
    >
      <div className="flex">
        {!isMobile && (
          <div className="hidden lg:block">
            <Sidebar onPinChange={handlePinChange} />
          </div>
        )}
        <main
          className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
            isSidebarPinned ? "lg:ml-64" : "lg:ml-16"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-indigo-800"
              } ${isMobile ? "text-center w-full" : ""}`}
            >
              Dream Journal
            </h1>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="w-full lg:w-2/3 flex justify-center">
              <DreamFeed />
            </div>
            <div className="w-full lg:w-1/3 flex justify-center">
              <InsightsPanel />
            </div>
          </div>
        </main>
      </div>
      {isMobile ? (
        <MobileNavbar />
      ) : (
        <div className="hidden md:block">
          <QuickRecordButton triggerRefresh={triggerRefresh} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
