"use client";
// components/Navbar.tsx
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    if (isAuthenticated) {
      setIsAuthenticated(false);
    } else {
      router.push("/auth");
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/95 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Moon className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold text-white">
                Dream Deck
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#contact">Contact</NavLink>
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <UserCircle className="h-6 w-6 text-white" />
                  </button>
                  {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
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
              ) : (
                <button
                  onClick={handleAuth}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  {isAuthenticated ? "Logout" : "Login / Signup"}
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-300 hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
        px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 shadow-lg
        transition-all duration-300 ease-in-out bg-transparent
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        animate-fade-in-down-md 
      `}
          >
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#how-it-works">How It Works</MobileNavLink>
            <MobileNavLink href="#pricing">Pricing</MobileNavLink>
            <MobileNavLink href="#contact">Contact</MobileNavLink>
            {isAuthenticated ? (
              <>
                <MobileNavLink href="/profile">Profile</MobileNavLink>
                <MobileNavLink href="/settings">Settings</MobileNavLink>
                <button
                  onClick={handleAuth}
                  className="w-full text-left text-purple-300 hover:bg-purple-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
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
}) => (
  <Link
    href={href}
    className="text-purple-300 hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Link
    href={href}
    className="text-purple-300 hover:bg-purple-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
  >
    {children}
  </Link>
);

export default Navbar;
