'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Mail, Lock, User, Calendar } from 'lucide-react';


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
MemoizedInputField.displayName = 'InputField';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  }, []);

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
    // Simulating API call
    setTimeout(() => {
      if (isLogin) {
        setMessage(`Login successful for ${formData.email}`);
      } else {
        setMessage(`Registration successful for ${formData.email}`);
      }
      setIsLoading(false);
      // Reset form fields
      setFormData({
        name: '',
        birthday: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }, 2000);
  };

  const PasswordCriterion: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
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


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-800 to-blue-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Brain className="text-purple-500" size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {isLogin ? 'Sign in to DreamDeck' : 'Create your DreamDeck account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-purple-950 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
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
                    isValidatorOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-2 pt-2">
                    <PasswordCriterion met={passwordCriteria.length} text="At least 8 characters long" />
                    <PasswordCriterion met={passwordCriteria.uppercase} text="Contains uppercase letter" />
                    <PasswordCriterion met={passwordCriteria.lowercase} text="Contains lowercase letter" />
                    <PasswordCriterion met={passwordCriteria.number} text="Contains number" />
                    <PasswordCriterion met={passwordCriteria.special} text="Contains special character" />
                  </div>
                </div>
              </>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Brain className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  <>{isLogin ? 'Sign in' : 'Sign up'}</>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm text-purple-300 hover:text-purple-200"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>

          {message && (
            <div className="mt-6 text-center text-sm text-green-400">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;