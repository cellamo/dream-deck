"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/app/DarkModeContext";
import {
  Moon,
  Sun,
  Feather,
  Music,
  Image as ImageIcon,
  Share2,
  MessageCircle,
  Edit3,
  Brain,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ENDPOINTS } from "@/app/api";
import DreamInterpretation from "@/components/DreamInterpretation";
interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  isLucid: boolean;
  audioUrl: string | null;
  emotions: Array<{ name: string; intensity: number }>;
  themes: string[];
  insights: DreamInsight | null;
}

interface DreamInsight {
  summary: string;
  analysis: {
    dream_summary: string;
    emotional_landscape: string;
    symbolic_analysis: string;
    narrative_interpretation: string;
    personal_growth_insights: string;
    cultural_perspective: string;
    recurring_themes: string;
    lucid_dreaming_potential: string;
    artistic_inspiration: string;
    daily_affirmation: string;
  };
}

const DreamCloud: React.FC<{ darkMode: boolean; onClick: () => void }> = ({
  darkMode,
  onClick,
}) => {
  return (
    <motion.div
      className={`fixed top-8 left-8 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
            ${darkMode ? "bg-purple-600" : "bg-blue-400"} shadow-lg z-50`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      animate={{
        y: [0, -10, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        },
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-8 h-8 ${darkMode ? "text-purple-200" : "text-white"}`}
      >
        <path d="M9 13L5 9L9 5" />
        <path d="M5 9H16C17.6569 9 19 10.3431 19 12C19 13.6569 17.6569 15 16 15H15" />
      </svg>
    </motion.div>
  );
};

const DreamDetails = ({ params }: { params: { id: string } }) => {
  const [dream, setDream] = useState<Dream | null>(null);
  const [insights, setInsights] = useState<DreamInsight | null>(null);
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const handleInsightsGenerated = (newInsights: DreamInsight) => {
    setDream((prevDream) => {
      if (prevDream === null) {
        return null; // or handle this case as appropriate for your app
      }
      return {
        ...prevDream,
        insights: newInsights
      };
    });
  };

  const handleBackClick = () => {
    router.push('/dashboard');
  };


  useEffect(() => {
    const fetchDreamData = async () => {
      try {
        // Fetch dream details
        const dreamResponse = await fetch(`${ENDPOINTS.DREAMS}${params.id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!dreamResponse.ok) {
          throw new Error('Failed to fetch dream');
        }
  
        const dreamData = await dreamResponse.json();
  
        // Fetch emotions
        const emotionsResponse = await fetch(`${ENDPOINTS.DREAMS}${params.id}/emotions/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!emotionsResponse.ok) {
          throw new Error('Failed to fetch emotions');
        }
  
        const emotionsData = await emotionsResponse.json();
  
        // Fetch themes
        const themesResponse = await fetch(`${ENDPOINTS.DREAMS}${params.id}/themes/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!themesResponse.ok) {
          throw new Error('Failed to fetch themes');
        }
  
        const themesData = await themesResponse.json();
  
        console.log('Fetched dream data:', dreamData);
        console.log('Fetched emotions:', emotionsData);
        console.log('Fetched themes:', themesData);
  
        setDream({
          id: dreamData.id,
          title: dreamData.title,
          content: dreamData.content,
          date: dreamData.date,
          isLucid: dreamData.is_lucid,
          audioUrl: dreamData.audio_recording,
          emotions: emotionsData.map((emotion: any) => ({
            name: emotion.name,
            intensity: emotion.intensity || 5 // Default intensity if not provided
          })),
          themes: themesData.map((theme: any) => theme.name),
          insights: dreamData.insight ? {
            summary: dreamData.insight.summary,
            analysis: dreamData.insight.analysis
          } : null,
        });
      } catch (error) {
        console.error('Error fetching dream data:', error);
        // Handle error (e.g., set an error state)
      }
    };
  
    fetchDreamData();
  }, [params.id]);
  

  if (!dream) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-purple-900 to-blue-900 text-white"
          : "bg-gradient-to-b from-blue-100 via-purple-200 to-pink-100 text-indigo-900"
      }`}
    >
      <DreamCloud darkMode={darkMode} onClick={handleBackClick} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-4xl mx-auto ${
          darkMode ? "bg-purple-800/30" : "bg-white/70"
        } rounded-lg shadow-2xl overflow-hidden backdrop-blur-lg`}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{dream.title}</h1>
            <div className="flex items-center space-x-2">
              {dream.isLucid ? (
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? "bg-blue-500 text-white"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  Lucid Dream
                </span>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? "bg-purple-500 text-white"
                      : "bg-purple-200 text-purple-800"
                  }`}
                >
                  Regular Dream
                </span>
              )}
              {dream.isLucid ? (
                <Moon className="w-5 h-5 text-yellow-400" />
              ) : (
                <Sun className="w-5 h-5 text-orange-400" />
              )}
            </div>
          </div>

          <p className="text-sm mb-4">
            {new Date(dream.date).toLocaleString()}
          </p>

          <p className="mb-6 text-lg leading-relaxed">{dream.content}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Emotions</h2>
            <div className="flex flex-wrap gap-2">
              {dream.emotions.map((emotion, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-200 text-indigo-800"
                  }`}
                >
                  {emotion.name}
                  {/* {emotion.name} - {emotion.intensity}/10 */}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Themes</h2>
            <div className="flex flex-wrap gap-2">
              {dream.themes.map((theme, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? "bg-purple-600 text-white"
                      : "bg-purple-200 text-purple-800"
                  }`}
                >
                  {theme}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <DreamDivider darkMode={darkMode} />
        <div className="space-y-6">
        <DreamInsightsPanel 
    darkMode={darkMode} 
    insights={dream.insights} 
    dreamId={dream.id}
    dreamContent={dream.content}
    onInsightsGenerated={handleInsightsGenerated}
  />
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm ${
                  darkMode
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white transition duration-300`}
              >
                <Music className="w-4 h-4" />
                <span>Dream Soundtrack</span>
              </button>
              <button
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white transition duration-300`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Visualize Dream</span>
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                className={`p-1.5 rounded-full ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } transition duration-300`}
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className={`p-1.5 rounded-full ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } transition duration-300`}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                className={`p-1.5 rounded-full ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } transition duration-300`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {dream.audioUrl && (
          <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <h3 className="text-lg font-semibold mb-2">Dream Recording</h3>
            <audio controls className="w-full">
              <source src={dream.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DreamDetails;

const DreamDivider: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
  <div className="relative my-12">
    <div className="absolute inset-0 flex items-center">
      <div
        className={`w-full border-t ${
          darkMode ? "border-purple-600" : "border-purple-300"
        }`}
      ></div>
    </div>
    <div className="relative flex justify-center">
      <span
        className={`${
          darkMode
            ? "bg-gradient-to-r from-purple-800 to-blue-800 text-white"
            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        } px-4 py-1 rounded-full shadow-lg`}
      >
        ✨ Dream Deck AI ✨
      </span>
    </div>
  </div>
);

const DreamInsightsPanel: React.FC<{
  darkMode: boolean;
  insights: DreamInsight | null;
  dreamId: string;
  dreamContent: string;
  onInsightsGenerated: (newInsights: DreamInsight) => void;
}> = ({ darkMode, insights, dreamId, dreamContent, onInsightsGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(ENDPOINTS.GET_DREAM_INSIGHT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dream_id: dreamId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate insights');
      }

      const data = await response.json();
      onInsightsGenerated(data.insight);
    } catch (err) {
      console.error('Error generating insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate insights. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderInsightSection = (title: string, content: string) => (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>{title}</h3>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} bg-opacity-50 p-4 rounded-lg ${darkMode ? 'bg-purple-800' : 'bg-purple-200'}`}>{content}</p>
    </div>
  );

  const extractContent = (content: string, tag: string) => {
    if (!content) return '';
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-purple-900/30" : "bg-purple-100"}`}>
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Brain className="w-6 h-6 mr-2" />
        Dream Insights
      </h2>
      {insights && insights.analysis ? (
        <div>
          {renderInsightSection("Dream Summary", extractContent(insights.analysis, 'dream_summary'))}
          {renderInsightSection("Emotional Landscape", extractContent(insights.analysis, 'emotional_landscape'))}
          {renderInsightSection("Symbolic Analysis", extractContent(insights.analysis, 'symbolic_analysis'))}
          {renderInsightSection("Narrative Interpretation", extractContent(insights.analysis, 'narrative_interpretation'))}
          {renderInsightSection("Personal Growth Insights", extractContent(insights.analysis, 'personal_growth_insights'))}
          {renderInsightSection("Cultural Perspective", extractContent(insights.analysis, 'cultural_perspective'))}
          {renderInsightSection("Recurring Themes", extractContent(insights.analysis, 'recurring_themes'))}
          {renderInsightSection("Lucid Dreaming Potential", extractContent(insights.analysis, 'lucid_dreaming_potential'))}
          {renderInsightSection("Artistic Inspiration", extractContent(insights.analysis, 'artistic_inspiration'))}
          {renderInsightSection("Daily Affirmation", extractContent(insights.analysis, 'daily_affirmation'))}
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <p>No AI insights available yet. Click the button below to generate insights for this dream.</p>
        </div>
      )}
      {!insights && (
        <motion.button
          onClick={generateInsights}
          disabled={isGenerating}
          className={`mt-4 flex items-center space-x-1 px-4 py-2 rounded-full text-sm ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition duration-300 relative overflow-hidden`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isGenerating ? 1 : 0 }}
          >
            <motion.div
              className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.span>
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isGenerating ? 0 : 1 }}
          >
            <Brain className="w-4 h-4 mr-1" />
            Generate AI Insights
          </motion.span>
          <motion.div
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={16} className="text-yellow-300" />
          </motion.div>
        </motion.button>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
