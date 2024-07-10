'use client'
import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight, Brain, Palette, BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';
import Image from 'next/image'
import AnimatedSection from '../components/AnimatedSection'
import { useDarkMode } from './DarkModeContext';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignUpClick = () => {
    router.push('/auth');
  };

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-gray-950 via-purple-800 to-blue-900' : 'bg-gradient-to-br from-pink-50 via-purple-300 to-indigo-300'} text-gray-900 dark:text-white`}>
      <Navbar />
      
      {/* Hero Section */}
      <AnimatedSection className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-down-slow bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-800">
          Unlock the Power of Your Dreams
        </h1>
        <p className={`text-xl md:text-2xl mb-8 ${darkMode ? 'text-purple-200' : 'text-indigo-700'} animate-fade-in-up-slow`}>s
          Record, analyze, and visualize your dreams with AI-powered insights
        </p>
        <button onClick={handleGetStarted} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          Get Started
        </button>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">Discover Dream Deck Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className={`h-12 w-12 ${darkMode ? 'text-purple-300' : 'text-indigo-600'}`} />}
            title="AI Dream Analysis"
            description="Get personalized insights and interpretations of your dreams using advanced AI algorithms."
          />
          <FeatureCard
            icon={<Palette className={`h-12 w-12 ${darkMode ? 'text-purple-300' : 'text-pink-600'}`} />}
            title="Dream Artwork Generation"
            description="Transform your dreams into stunning visual art with our AI-powered image generation."
          />
          <FeatureCard
            icon={<BarChart className={`h-12 w-12 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />}
            title="Pattern Recognition"
            description="Identify recurring themes and symbols in your dreams over time."
          />
        </div>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection id="how-it-works" className={`py-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-blue-900/20' : 'bg-gradient-to-r from-indigo-200 to-purple-200'}`}>
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">How Dream Deck Works</h2>
        <div className="max-w-3xl mx-auto">
          <StepCard
            number={1}
            title="Record Your Dreams"
            description="Use our intuitive interface to jot down or voice record your dreams as soon as you wake up."
          />
          <StepCard
            number={2}
            title="AI Analysis"
            description="Our advanced AI analyzes your dream, providing insights, interpretations, and identifying patterns."
          />
          <StepCard
            number={3}
            title="Visualize and Explore"
            description="View AI-generated artwork based on your dreams and explore your dream patterns over time."
          />
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={darkMode ? 'text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-indigo-300':'text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600'}>Ready to Decode Your Dreams?</h2>
        <p className={`text-xl mb-8 ${darkMode ? 'text-purple-200' : 'text-indigo-700'}`}>
          Join Dream Deck today and start your journey of self-discovery.
        </p>
        <button onClick={handleSignUpClick} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          Sign Up Now
        </button>
      </AnimatedSection>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-purple-200 to-indigo-200'} py-8 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Dream Deck</h3>
            <p className={darkMode ? 'text-purple-300' : 'text-indigo-700'}>Unlock the power of your subconscious</p>
          </div>
          <Image 
            src="/dreamdeck-icon.png" 
            alt="Dream Deck Logo" 
            width={128} 
            height={128}
            className="md:-my-10"
          />
          <div className="flex space-x-4">
            <FooterLink href="#features">Features</FooterLink>
            <FooterLink href="#how-it-works">How It Works</FooterLink>
            <FooterLink href="#pricing">Pricing</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  const { darkMode } = useDarkMode();
  return (
    <div className={`${darkMode ? 'bg-purple-500/30' : 'bg-gradient-to-br from-white to-purple-100'} p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105`}>
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className={darkMode ? 'text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200' : 'text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-200' }>{title}</h3>
      <p className={darkMode ? 'text-purple-200' : 'text-indigo-700'}>{description}</p>
    </div>
  );
};

const StepCard: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => {
  const { darkMode } = useDarkMode();
  return (
    <div className="flex items-start mb-8">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0 text-white shadow-lg">
        {number}
      </div>
      <div>
        <h3 className={darkMode ? 'text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-600': 'text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600'}>{title}</h3>
        <p className={darkMode ? 'text-purple-200' : 'text-indigo-700'}>{description}</p>
      </div>
    </div>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const { darkMode } = useDarkMode();
  return (
    <a href={href} className={`${darkMode ? 'text-purple-300 hover:text-white' : 'text-indigo-700 hover:text-purple-800'} transition duration-300`}>
      {children}
    </a>
  );
};