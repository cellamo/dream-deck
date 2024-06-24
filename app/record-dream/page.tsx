"use client";
import React, { useState } from 'react';
import { Brain, Mic, Image as ImageIcon, Send } from 'lucide-react';
/* import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
 */
import AnimatedSection from '../../components/AnimatedSection'
import Navbar from '@/components/Navbar';
const RecordDreamPage = () => {
  const [dreamText, setDreamText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle dream submission logic here
    console.log('Dream submitted:', { dreamText, emotion });
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const handleAIAnalysis = () => {
    // Implement AI analysis logic here
  };

  const handleArtworkGeneration = () => {
    // Implement artwork generation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-800 to-blue-900 text-white">
        <Navbar />
      <AnimatedSection className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center animate-fade-in-down-slow">
          Record Your Dream
        </h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label htmlFor="dreamText" className="text-lg mb-2 block">Describe your dream</label>
            <div className="flex items-center space-x-2">
              <textarea
                id="dreamText"
                placeholder="Start typing your dream here..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                className="w-full h-40 bg-purple-500/30 text-white placeholder-purple-300 border-purple-400 focus:border-purple-300"
              />
              <button
                type="button"
                onClick={handleVoiceRecording}
                className={`p-2 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                <Mic className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-lg mb-2 block">How did you feel in the dream?</label>
            {/* <RadioGroup onValueChange={setEmotion} className="flex space-x-4">
              {['Happy', 'Sad', 'Scared', 'Anxious', 'Excited'].map((feel) => (
                <div key={feel} className="flex items-center space-x-2">
                  <RadioGroupItem value={feel} id={feel} />
                  <Label htmlFor={feel}>{feel}</Label>
                </div>
              ))}
            </RadioGroup> */}
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Send className="mr-2 h-4 w-4" /> Save Dream
            </button>
            <button type="button" onClick={handleAIAnalysis} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Brain className="mr-2 h-4 w-4" /> AI Analysis
            </button>
            <button type="button" onClick={handleArtworkGeneration} className="flex-1 bg-green-600 hover:bg-green-700">
              <ImageIcon className="mr-2 h-4 w-4" /> Generate Artwork
            </button>
          </div>
        </form>
      </AnimatedSection>
    </div>
  );
};

export default RecordDreamPage;