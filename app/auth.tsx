"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Brain, Mail, Lock, User, Calendar, Home, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { ENDPOINTS } from "./api";

const isAtLeast18YearsOld = (birthday: string): boolean => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
};

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

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000); // Error disappears after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    usernameOrEmail: "",
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

  const isPasswordStrong = (password: string): boolean => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    );
  };

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
    console.log(formData);
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!isLogin) {
        // Add age validation for signup
        if (!isAtLeast18YearsOld(formData.birthday)) {
          throw new Error(dreamErrors.underage);
        }

        // Check password strength before sending to backend
        if (!isPasswordStrong(formData.password)) {
          throw new Error(dreamErrors.weakPassword);
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
          throw new Error(dreamErrors.passwordMismatch);
        }
      }

      let result;
      const endpoint = isLogin ? ENDPOINTS.LOGIN : ENDPOINTS.SIGNUP;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isLogin
            ? {
                usernameOrEmail: formData.usernameOrEmail,
                password: formData.password,
              }
            : {
                username: formData.username,
                email: formData.email,
                name: formData.name,
                birthday: formData.birthday,
                password: formData.password,
                confirm_password: formData.confirmPassword,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (data.error) {
          case "weakPassword":
            throw new Error(dreamErrors.weakPassword);
          case "userExists":
            throw new Error(dreamErrors.userExists);
          case "invalidEmail":
            throw new Error(dreamErrors.invalidEmail);
          case "passwordMismatch":
            throw new Error(dreamErrors.passwordMismatch);
          case "invalidCredentials":
            throw new Error(dreamErrors.invalidCredentials);
          case "serverError":
            throw new Error(dreamErrors.serverError);
          default:
            throw new Error(data.error || "An unknown error occurred");
        }
      }

      result = data;
      localStorage.setItem("token", result.access);
      localStorage.setItem("refresh_token", result.refresh);
      localStorage.setItem("user", JSON.stringify(result.user));
      setUser(result.user); // Update the user in AuthContext
      setMessage(
        `${isLogin ? "Login" : "Registration"} successful for ${
          result.user.email
        }`
      );
      router.push("/");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
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
      {error && <DreamError message={error} />}
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
              id="usernameOrEmail"
              type="text"
              placeholder="Username or Email"
              value={formData.usernameOrEmail}
              onChange={handleInputChange}
              icon={<User className="text-purple-400" size={20} />}
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

const DreamError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-purple-500/50 animate-float">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Brain className="h-6 w-6 text-purple-300 animate-pulse" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-purple-100">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const dreamErrors = {
  underage:
    "Your dream journey begins at 18. Please come back when you're ready!",
  invalidEmail: "This email doesn't exist in the dream realm. Try another!",
  passwordMismatch:
    "Your dream keys don't match. Try synchronizing them again!",
  weakPassword:
    "Your dream gate needs a stronger lock. Make your password more complex!",
  userExists:
    "A dreamer with this username already exists in our realm. Choose another!",
  serverError: "The dream servers are in a deep sleep. Please try again later!",
  invalidCredentials:
    "Your dream key doesn't fit. Check your credentials and try again!",
};
