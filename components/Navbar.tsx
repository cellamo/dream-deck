"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Moon,
  LogIn,
  UserCircle,
  Settings,
  LogOut,
  Rocket,
  Sun,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../app/AuthContext";
import { useDarkMode } from "@/app/DarkModeContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    if (user) {
      logout();
      router.push("/");
    } else {
      router.push("/auth");
    }
  };

  const launchApp = () => {
    router.push("/dashboard");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? darkMode
            ? "bg-gray-900/95 shadow-lg"
            : "bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Moon className={`h-8 w-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              <span className={`ml-2 text-xl font-bold ${
                darkMode 
                  ? "text-white" 
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
              }`}>
                Dream Deck
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            <DarkModeToggle />
            {user ? (
              <>
                <button
                  onClick={launchApp}
                  className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                  <Rocket className="h-4 w-4 mr-2 text-white" />
                  Launch App
                </button>
                
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-100 focus:ring-purple-500"
                  >
                    <UserCircle className="h-6 w-6 text-white" />
                  </button>
                  {isDropdownOpen && (
                    <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? "bg-gray-900" : "bg-white"} ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                      <div className={`px-4 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                        Signed in as
                        <br />
                        <strong>{user.username}</strong>
                      </div>
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <UserCircle className="inline-block h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className={`block px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <Settings className="inline-block h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleAuth}
                        className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <LogOut className="inline-block h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={handleAuth}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login / Signup
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                darkMode
                  ? "text-purple-300 hover:text-white hover:bg-purple-700"
                  : "text-purple-600 hover:text-purple-900 hover:bg-purple-100"
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div
            className={`
              px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
                darkMode
                  ? "bg-gray-900/95 shadow-lg"
                  : "bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 shadow-lg"
              }
              transition-all duration-300 ease-in-out
              ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }
              animate-fade-in-down-md 
            `}
          >
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#how-it-works">How It Works</MobileNavLink>
            <MobileNavLink href="#pricing">Pricing</MobileNavLink>
            <MobileNavLink href="#contact">Contact</MobileNavLink>
            <div className="px-3 py-2">
              <DarkModeToggle />
            </div>
            {user ? (
              <>
                <div className={`px-3 py-2 text-sm ${darkMode ? "text-purple-300" : "text-purple-600"} border-b ${darkMode ? "border-purple-700" : "border-purple-200"}`}>
                  Signed in as
                  <br />
                  <strong>{user.username}</strong>
                </div>
                <MobileNavLink href="/profile">Profile</MobileNavLink>
                <MobileNavLink href="/settings">Settings</MobileNavLink>
                <button
                  onClick={handleAuth}
                  className={`w-full text-left ${
                    darkMode
                      ? "text-purple-300 hover:bg-purple-700 hover:text-white"
                      : "text-purple-600 hover:bg-purple-100 hover:text-purple-900"
                  } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleAuth}
                className="w-full text-left bg-purple-600 hover:bg-purple-700 text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login / Signup
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  const { darkMode } = useDarkMode();
  return (
    <Link
      href={href}
      className={`${
        darkMode
          ? "text-purple-300 hover:bg-purple-700 hover:text-white"
          : "text-purple-600 hover:bg-purple-100 hover:text-pink-600"
      } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  const { darkMode } = useDarkMode();
  return (
    <Link
      href={href}
      className={`${
        darkMode
          ? "text-purple-300 hover:bg-purple-700 hover:text-white"
          : "text-purple-600 hover:bg-purple-100 hover:text-purple-900"
      } block px-3 py-2 rounded-md text-base font-medium`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
