"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Brain, Mail, Lock, User, Calendar, Home, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signup, login } from './authClient';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

// Move InputField component outside of AuthPage
const InputField: React.FC<{
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
}> = ({ id, type, placeholder, value, onChange, icon, required = true }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      id={id}
      type={type}
      required={required}
      className="bg-purple-900/70 text-white placeholder-purple-300 w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

// Memoize the InputField component and set its display name
const MemoizedInputField = React.memo(InputField);
MemoizedInputField.displayName = "InputField";

const AuthPage: React.FC = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    },
    []
  );

  useEffect(() => {
    if (!isLogin) {
      setPasswordCriteria({
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      });
      setIsValidatorOpen(formData.password.length > 0);
    } else {
      setIsValidatorOpen(false);
    }
  }, [formData.password, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.username, formData.email, formData.password);
      }
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user); // Update the user in AuthContext
      setMessage(`${isLogin ? 'Login' : 'Registration'} successful for ${result.user.email}`);
      router.push('/'); 
    } catch (error : any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordCriterion: React.FC<{ met: boolean; text: string }> = ({
    met,
    text,
  }) => (
    <div className="flex items-center text-purple-200">
      {met ? (
        <Lock className="mr-2 text-green-500" size={16} />
      ) : (
        <Lock className="mr-2 text-red-500" size={16} />
      )}
      <span className="text-sm">{text}</span>
    </div>
  );

  const InputField: React.FC<{
    id: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    required?: boolean;
  }> = ({ id, type, placeholder, value, onChange, icon, required = true }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        required={required}
        className="bg-purple-900/70 text-white placeholder-purple-300 w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic here
    console.log("Google Sign-In clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-800 to-blue-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex justify-center">
        <Image 
  src="/dreamdeck-icon.png" 
  alt="Dream Deck Logo" 
  width={192} 
  height={192} 
  className="opacity-80 hover:opacity-100 transition-opacity duration-300"

/>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {isLogin ? "Sign in to DreamDeck" : "Create your DreamDeck account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-purple-950 py-8 px-6 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <MemoizedInputField
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  icon={<User className="text-purple-400" size={20} />}
                />
                <MemoizedInputField
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  icon={<User className="text-purple-400" size={20} />}
                />
                <MemoizedInputField
                  id="birthday"
                  type="date"
                  placeholder="Birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  icon={<Calendar className="text-purple-400" size={20} />}
                />
              </>
            )}
            <MemoizedInputField
              id="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              icon={<Mail className="text-purple-400" size={20} />}
            />
            <MemoizedInputField
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              icon={<Lock className="text-purple-400" size={20} />}
            />
            {!isLogin && (
              <>
                <MemoizedInputField
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  icon={<Lock className="text-purple-400" size={20} />}
                />
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isValidatorOpen
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-2 pt-2">
                    <PasswordCriterion
                      met={passwordCriteria.length}
                      text="At least 8 characters long"
                    />
                    <PasswordCriterion
                      met={passwordCriteria.uppercase}
                      text="Contains uppercase letter"
                    />
                    <PasswordCriterion
                      met={passwordCriteria.lowercase}
                      text="Contains lowercase letter"
                    />
                    <PasswordCriterion
                      met={passwordCriteria.number}
                      text="Contains number"
                    />
                    <PasswordCriterion
                      met={passwordCriteria.special}
                      text="Contains special character"
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Brain className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    <span>{isLogin ? "Sign in" : "Sign up"}</span>
                  </>
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="h-4 w-4 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-purple-950 text-purple-300">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 group"
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                <span>Sign in with Google</span>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="h-4 w-4 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm text-purple-300 hover:text-purple-200"
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {message && (
            <div className="mt-6 text-center text-sm text-green-400">
              {message}
            </div>
          )}
        </div>
      </div>
      <Link
        href="/"
        className="fixed top-4 left-4 bg-purple-600 hover:bg-purple-700 text-white font-bold p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 group"
      >
        <Home className="h-6 w-6 group-hover:animate-pulse" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-purple-800 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Go Home
        </span>
      </Link>
    </div>
  );
};

export default AuthPage;
