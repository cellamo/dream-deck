import React, { useState, useEffect } from "react";
import DreamCard from "./DreamCard";
import { Brain, Search, X } from "lucide-react";
import DreamRecordPopup from "./DreamRecordPopup";
import { useDarkMode } from "@/app/DarkModeContext";
import { ENDPOINTS } from "@/app/api";

const DreamFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useDarkMode();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchDreams();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };
  
    fetchData();
  }, [refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token available");
  
    const response = await fetch(ENDPOINTS.TOKEN_REFRESH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  
    if (!response.ok) throw new Error("Failed to refresh token");
  
    const data = await response.json();
    localStorage.setItem("token", data.access);
    return data.access;
  };

  const fetchDreams = async () => {
    try {
      let response = await fetch(ENDPOINTS.DREAMS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log('Fetch response:', response);
      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await refreshToken();
        // Retry the request with the new token
        response = await fetch(ENDPOINTS.DREAMS, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
  
      if (!response.ok) throw new Error("Failed to fetch dreams");
      
      const data = await response.json();
      setDreams(data);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchTerm("");
    }
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDreamCreated = () => {
    triggerRefresh();
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (user.id && token) {
      setUserId(user.id);
    }
  }, []);

  if (!userId) {
    return (
      <div className="animate-pulse flex items-center justify-center h-32">
        <p
          className={`text-lg ${
            darkMode ? "text-purple-200" : "text-indigo-700"
          }`}
        >
          Please log in to view your dreams.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse flex items-center justify-center h-32">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
        </div>
        <p
          className={`text-lg ml-3 ${
            darkMode ? "text-purple-200" : "text-indigo-700"
          }`}
        >
          Loading dreams...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${darkMode ? "bg-red-900/50" : "bg-red-100"} border ${
          darkMode ? "border-red-700" : "border-red-400"
        } ${
          darkMode ? "text-red-200" : "text-red-700"
        } px-4 py-3 rounded relative animate-shake`}
        role="alert"
      >
        <strong className="font-bold">Error loading dreams.</strong>
        <span className="block sm:inline"> Please try again later.</span>
        <p className="text-sm">Error details: {error}</p>
      </div>
    );
  }

  const filteredDreams = dreams.filter(
    (dream: any) =>
      dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`rounded-lg p-6 ${
        darkMode
          ? "bg-purple-900/30 backdrop-blur-lg"
          : "bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-indigo-800"
          }`}
        >
          Recent Dreams
        </h2>
        <div className="relative flex items-center justify-end">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search dreams..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`w-full ${
                  darkMode
                    ? "bg-purple-800/50 text-white placeholder-purple-300"
                    : "bg-white/70 text-indigo-800 placeholder-indigo-400"
                } rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-10`}
                style={{ borderColor: "transparent" }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-border"></div>
            </div>
            {isSearchOpen && (
              <button
                onClick={toggleSearch}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                  darkMode
                    ? "text-purple-300 hover:text-white"
                    : "text-indigo-600 hover:text-indigo-800"
                } z-20`}
              >
                <X size={20} />
              </button>
            )}
          </div>
          {!isSearchOpen && (
            <button
              onClick={toggleSearch}
              className={`${
                darkMode
                  ? "bg-purple-800/50 text-white hover:bg-purple-700/50"
                  : "bg-indigo-300/50 text-indigo-800 hover:bg-indigo-400/50"
              } rounded-full p-2 transition-all duration-300`}
            >
              <Search size={20} />
            </button>
          )}
        </div>
      </div>
      {filteredDreams.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredDreams.map((dream: any, index: number) => (
            <DreamCard key={dream.id} dream={dream} onDelete={triggerRefresh} />
          ))}
        </div>
      ) : (
        <div
          className={`text-center py-8 ${
            darkMode
              ? "bg-purple-800/30 backdrop-blur-lg"
              : "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100"
          } rounded-lg`}
        >
          <Brain
            className={`mx-auto h-16 w-16 ${
              darkMode ? "text-purple-400" : "text-indigo-500"
            } mb-4`}
          />
          <h3
            className={`text-xl font-semibold mb-2 ${
              darkMode ? "text-white" : "text-indigo-800"
            }`}
          >
            No Dreams Recorded Yet
          </h3>
          <p
            className={`mb-4 ${
              darkMode ? "text-purple-200" : "text-indigo-600"
            }`}
          >
            Start your journey of self-discovery by recording your first dream.
          </p>
          <button
            onClick={handleOpenPopup}
            className={`${
              darkMode
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            } font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg`}
          >
            Record Your First Dream
          </button>
        </div>
      )}
      {isPopupOpen && (
        <DreamRecordPopup
          onClose={handleClosePopup}
          onDreamCreated={handleDreamCreated}
        />
      )}
      <style jsx>{`
        .animate-border {
          background-size: 200% 200%;
          animation: gradient-animation 4s ease infinite;
        }

        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default DreamFeed;
