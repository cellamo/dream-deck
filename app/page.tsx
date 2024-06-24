'use client'
import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight, Brain, Palette, BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';
import Image from 'next/image'
import AnimatedSection from '../components/AnimatedSection'

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignUpClick = () => {
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-800 to-blue-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <AnimatedSection className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-down-slow">
          Unlock the Power of Your Dreams
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-purple-200 animate-fade-in-up-slow">
          Record, analyze, and visualize your dreams with AI-powered insights
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          Get Started
        </button>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Discover Dream Deck Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="h-12 w-12 text-purple-400" />}
            title="AI Dream Analysis"
            description="Get personalized insights and interpretations of your dreams using advanced AI algorithms."
          />
          <FeatureCard
            icon={<Palette className="h-12 w-12 text-purple-400" />}
            title="Dream Artwork Generation"
            description="Transform your dreams into stunning visual art with our AI-powered image generation."
          />
          <FeatureCard
            icon={<BarChart className="h-12 w-12 text-purple-400" />}
            title="Pattern Recognition"
            description="Identify recurring themes and symbols in your dreams over time."
          />
        </div>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-900/30">
        <h2 className="text-4xl font-bold text-center mb-12">How Dream Deck Works</h2>
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
        <h2 className="text-4xl font-bold mb-4">Ready to Decode Your Dreams?</h2>
        <p className="text-xl mb-8 text-purple-200">
          Join Dream Deck today and start your journey of self-discovery.
        </p>
        <button onClick={handleSignUpClick} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          Sign Up Now
        </button>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">Dream Deck</h3>
            <p className="text-purple-300">Unlock the power of your subconscious</p>
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

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-purple-500/30 p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-purple-200">{description}</p>
  </div>
);

const StepCard: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
  <div className="flex items-start mb-8">
    <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0">
      {number}
    </div>
    <div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-purple-200">{description}</p>
    </div>
  </div>
);

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-purple-300 hover:text-white transition duration-300">
    {children}
  </a>
);
