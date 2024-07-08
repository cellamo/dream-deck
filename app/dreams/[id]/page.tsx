// app/dreams/[id]/page.tsx

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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  isLucid: boolean;
  emotions: { name: string; intensity: number }[];
  themes: string[];
  audioUrl?: string;
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
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  useEffect(() => {
    // Fetch dream details here
    // For now, we'll use mock data
    setDream({
      id: params.id,
      title: "Flying Over a Crystal City",
      content:
        "As I drifted into sleep, I found myself standing on the edge of a cliff overlooking a vast, shimmering ocean. The water below was not blue, but a mesmerizing swirl of colors that seemed to dance and change with each passing moment. I took a deep breath, feeling the salty air fill my lungs, and suddenly realized I could fly. With a thought, I launched myself off the cliff, soaring high above the technicolor sea. The wind rushed through my hair as I glided effortlessly, my body weightless and free. As I flew, I noticed the sky above me was not just one shade of blue, but a tapestry of purples, pinks, and golds, as if multiple sunsets and sunrises were happening simultaneously. In the distance, I saw an island emerging from the colorful waters. As I approached, I realized it was no ordinary island, but a floating city of impossible architecture. Towers of crystal and glass spiraled into the sky, their surfaces reflecting and refracting light in dazzling patterns. Bridges of gossamer thread connected the buildings, swaying gently in the breeze. I landed softly on a platform of what looked like liquid silver, which rippled under my feet but supported my weight. As I walked through the city, I encountered beings of pure light and energy, their forms shifting and changing as they moved. They communicated with me not through words, but through pulses of color and emotion that I somehow understood perfectly. One of these beings guided me to the heart of the city, a massive structure that seemed to be made of living, breathing crystal. As I entered, I felt a surge of knowledge and understanding flood my mind. I suddenly grasped the interconnectedness of all things, the delicate balance of the universe, and my place within it. Just as I felt I was on the verge of unlocking the greatest mysteries of existence, I began to feel a pull, a tug back towards waking consciousness. I tried to hold onto the dream, to stay in this wondrous place, but it slowly faded away. As I opened my eyes, I was left with a profound sense of peace and a lingering feeling that I had touched something truly extraordinary.",
      date: "2023-05-15T08:30:00Z",
      isLucid: false,
      emotions: [
        { name: "Awe", intensity: 9 },
        { name: "Freedom", intensity: 10 },
        { name: "Excitement", intensity: 8 },
      ],
      themes: ["Flying", "Urban landscape", "Control", "Beauty"],
      audioUrl: "/mock-audio.mp3",
    });
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
                  {emotion.name} - {emotion.intensity}/10
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

          <DreamDivider darkMode={darkMode} />
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition duration-300`}
              >
                <Feather className="w-4 h-4" />
                <span>Dream Insights</span>
              </button>
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
              <button
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm ${
                  darkMode
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-teal-500 hover:bg-teal-600"
                } text-white transition duration-300`}
              >
                <Brain className="w-4 h-4" />
                <span>AI Dream Interpretation</span>
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
