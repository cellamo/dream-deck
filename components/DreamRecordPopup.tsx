import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Cloud,
  Sparkles,
  Moon,
  Sun,
  Star,
  Feather,
  Volume2,
  Tag,
  Heart,
} from "lucide-react";
import { useDarkMode } from "@/app/DarkModeContext";
import { ENDPOINTS } from "@/app/api";
import { motion, AnimatePresence } from "framer-motion";

interface DreamRecordPopupProps {
  onClose: () => void;
  onDreamCreated: (dreamData: {
    title: string;
    content: string;
    is_lucid: boolean;
    emotions: { emotion: string; intensity: number }[];
    themes: string[];
  }) => void;
}

interface Emotion {
  id: number;
  name: string;
  isAISuggested?: boolean;
}

interface SelectedEmotion extends Emotion {
  intensity: number;
}

interface Theme {
  id: number;
  name: string;
  isAISuggested?: boolean;
}

const DreamRecordPopup: React.FC<DreamRecordPopupProps> = ({
  onClose,
  onDreamCreated,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLucid, setIsLucid] = useState(false);

  const [emotions, setEmotions] = useState<
    { emotion: string; intensity: number }[]
  >([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { darkMode } = useDarkMode();

  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>(
    []
  );
  const [availableEmotions, setAvailableEmotions] = useState<Emotion[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isAIThinkingEmotions, setIsAIThinkingEmotions] = useState(false);
  const [aiSuggestedEmotions, setAiSuggestedEmotions] =
    useState<boolean>(false);
  const [aiSuggestedThemes, setAiSuggestedThemes] = useState<boolean>(false);
  const [isAIThinkingTitle, setIsAIThinkingTitle] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    fetchEmotionsAndThemes();
  }, []);

  const fetchEmotionsAndThemes = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [emotionsResponse, themesResponse] = await Promise.all([
        fetch(ENDPOINTS.EMOTIONS, { headers }),
        fetch(ENDPOINTS.THEMES, { headers }),
      ]);
      const emotions = await emotionsResponse.json();
      const themes = await themesResponse.json();
      setAvailableEmotions(emotions);
      setAvailableThemes(themes);
    } catch (error) {
      console.error("Error fetching emotions and themes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const dreamData = {
      title,
      content,
      is_lucid: isLucid,
      audio_recording: null,
      emotions: selectedEmotions.map((e) => ({
        name: e.name,
        intensity: e.intensity,
      })),
      themes: themes,
    };

    try {
      let response;
      if (audioBlob) {
        const formData = new FormData();
        formData.append("audio_recording", audioBlob, "dream_recording.webm");
        formData.append("data", JSON.stringify(dreamData));

        response = await fetch(ENDPOINTS.DREAMS, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(ENDPOINTS.DREAMS, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dreamData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to create dream");
      }

      const createdDream = await response.json();
      onDreamCreated({
        title: createdDream.title,
        content: createdDream.content,
        is_lucid: createdDream.is_lucid,
        emotions: createdDream.emotions,
        themes: createdDream.themes,
      });
      onClose();
    } catch (err) {
      console.error("Error creating dream:", err);
      setError("Failed to create dream. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmotionChange = (emotionId: number, intensity: number) => {
    const emotion = availableEmotions.find((e) => e.id === emotionId);
    if (emotion) {
      setEmotions((prev) => {
        const existing = prev.findIndex((e) => e.emotion === emotion.name);
        if (existing !== -1) {
          return prev.map((e, i) => (i === existing ? { ...e, intensity } : e));
        }
        return [...prev, { emotion: emotion.name, intensity }];
      });
    }
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotions((prev) => {
      const existing = prev.find((e) => e.id === emotion.id);
      if (existing) {
        return prev.filter((e) => e.id !== emotion.id);
      }
      return [...prev, { ...emotion, intensity: 5 }];
    });
  };

  const handleEmotionIntensityChange = (id: number, intensity: number) => {
    setSelectedEmotions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, intensity } : e))
    );
  };

  const suggestEmotionsWithAI = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (content.length < 50) {
      setError(
        "Please enter at least 50 characters in your dream description before suggesting emotions."
      );
      return;
    }
    setIsAIThinkingEmotions(true);
    try {
      const response = await fetch(ENDPOINTS.SUGGEST_EMOTIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to suggest emotions");
      }

      const data = await response.json();
      console.log("Suggested emotions:", data);

      if (Array.isArray(data.suggested_emotions)) {
        const newEmotions: Emotion[] = data.suggested_emotions.map(
          (emotion: { name: string }) => ({
            id: Date.now() + Math.random(),
            name: emotion.name.charAt(0).toUpperCase() + emotion.name.slice(1),
            isAISuggested: true,
          })
        );

        setAvailableEmotions((prevEmotions) => {
          const updatedEmotions = [...prevEmotions];
          newEmotions.forEach((newEmotion) => {
            const existingIndex = updatedEmotions.findIndex(
              (e) => e.name.toLowerCase() === newEmotion.name.toLowerCase()
            );
            if (existingIndex === -1) {
              updatedEmotions.push(newEmotion);
            } else {
              updatedEmotions[existingIndex] = {
                ...updatedEmotions[existingIndex],
                isAISuggested: true,
              };
            }
          });
          return updatedEmotions;
        });

        setSelectedEmotions((prevSelected) => {
          const updatedSelected = [...prevSelected];
          newEmotions.forEach((newEmotion) => {
            if (!updatedSelected.some((e) => e.id === newEmotion.id)) {
              updatedSelected.push({ ...newEmotion, intensity: 5 });
            }
          });
          return updatedSelected;
        });

        setAiSuggestedEmotions(true);
      } else {
        console.error("Unexpected format for suggested emotions:", data);
      }
    } catch (error) {
      console.error("Error suggesting emotions:", error);
      setError("Failed to suggest emotions. Please try again.");
    } finally {
      setIsAIThinkingEmotions(false);
    }
  };

  const suggestThemesWithAI = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (content.length < 50) {
      setError(
        "Please enter at least 50 characters in your dream description before suggesting themes."
      );
      return;
    }
    setIsAIThinking(true);
    try {
      const response = await fetch(ENDPOINTS.SUGGEST_THEMES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to suggest themes");
      }

      const data = await response.json();
      console.log("Suggested themes:", data);

      if (Array.isArray(data.suggested_themes)) {
        const newThemes = data.suggested_themes.map((theme: string) => ({
          id: Date.now() + Math.random(),
          name: theme.charAt(0).toUpperCase() + theme.slice(1),
          isAISuggested: true,
        }));

        setAvailableThemes((prevThemes) => {
          const updatedThemes = [...prevThemes];
          newThemes.forEach((newTheme: Theme) => {
            const existingIndex = updatedThemes.findIndex(
              (t) => t.name.toLowerCase() === newTheme.name.toLowerCase()
            );
            if (existingIndex === -1) {
              updatedThemes.push(newTheme);
            } else {
              updatedThemes[existingIndex] = {
                ...updatedThemes[existingIndex],
                isAISuggested: true,
              };
            }
          });
          return updatedThemes;
        });

        setSelectedThemes((prevSelected) => {
          const updatedSelected = [...prevSelected];
          newThemes.forEach((newTheme: { name: string }) => {
            if (!updatedSelected.includes(newTheme.name)) {
              updatedSelected.push(newTheme.name);
            }
          });
          return updatedSelected;
        });

        setAiSuggestedThemes(true);
      } else {
        console.error("Unexpected format for suggested themes:", data);
      }
    } catch (error) {
      console.error("Error suggesting themes:", error);
      setError("Failed to suggest themes. Please try again.");
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleThemeChange = (themeId: number, checked: boolean) => {
    const theme = availableThemes.find((t) => t.id === themeId);
    if (theme) {
      setSelectedThemes((prev) =>
        checked ? [...prev, theme.name] : prev.filter((t) => t !== theme.name)
      );
    }
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedThemes((prev) => {
      if (prev.includes(theme.name)) {
        return prev.filter((t) => t !== theme.name);
      }
      return [...prev, theme.name];
    });
  };

  const suggestTitleWithAI = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (content.length < 50) {
      setError(
        "Please enter at least 50 characters in your dream description before suggesting a title."
      );
      return;
    }
    setIsAIThinkingTitle(true);
    try {
      const response = await fetch(ENDPOINTS.SUGGEST_TITLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to suggest title");
      }

      const data = await response.json();
      setTitle(data.suggested_title);
    } catch (error) {
      console.error("Error suggesting title:", error);
      setError("Failed to suggest title. Please try again.");
    } finally {
      setIsAIThinkingTitle(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      >
        <motion.div
          ref={popupRef}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className={`${
            darkMode ? "bg-purple-900" : "bg-white"
          } rounded-lg p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md relative overflow-hidden z-[70]`}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-purple-900"
              } flex items-center`}
            >
              <Feather className="mr-2" size={24} />
              Record Your Dream
            </h2>
            <button
              onClick={onClose}
              className={`${
                darkMode
                  ? "text-white hover:text-purple-300"
                  : "text-purple-900 hover:text-purple-700"
              } transition-colors duration-300`}
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label
                htmlFor="title"
                className={`block text-sm font-medium ${
                  darkMode ? "text-purple-200" : "text-purple-700"
                } flex items-center`}
              >
                <Moon className="mr-2" size={16} />
                Dream Title
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`flex-grow rounded-l-md ${
                    darkMode
                      ? "bg-purple-800 border-purple-600 text-white"
                      : "bg-purple-100 border-purple-300 text-purple-900"
                  } transition-colors duration-300`}
                  required
                />
                <motion.button
                  onClick={suggestTitleWithAI}
                  disabled={content.length < 50 || isAIThinkingTitle}
                  className={`inline-flex items-center px-3 rounded-r-md border-l-0 ${
                    content.length < 50 || isAIThinkingTitle
                      ? "text-gray-400 cursor-not-allowed"
                      : darkMode
                      ? "bg-purple-800 border-purple-600 text-white"
                      : "bg-purple-100 border-purple-300 text-purple-900"
                  } text-sm transition-colors duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAIThinkingTitle ? (
                    <motion.div
                      className="w-4 h-4 border-t-2 border-b-2 border-current rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <>
                      Suggest
                      <Sparkles size={12} className="ml-1 text-yellow-300" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            <div>
              <label
                htmlFor="content"
                className={`block text-sm font-medium ${
                  darkMode ? "text-purple-200" : "text-purple-700"
                } flex items-center`}
              >
                <Sun className="mr-2" size={16} />
                Dream Description
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className={`mt-1 block w-full rounded-md ${
                    darkMode
                      ? "bg-purple-800 border-purple-600 text-white"
                      : "bg-purple-100 border-purple-300 text-purple-900"
                  } transition-colors duration-300 pr-16`}
                  required
                ></textarea>
                <span
                  className={`absolute bottom-2 right-2 text-xs ${
                    darkMode ? "text-purple-300" : "text-purple-600"
                  }`}
                >
                  {content.length}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label
                className={`flex items-center text-sm font-medium ${
                  darkMode ? "text-purple-200" : "text-purple-700"
                } cursor-pointer hover:opacity-80 transition-opacity duration-300`}
              >
                <input
                  type="checkbox"
                  checked={isLucid}
                  onChange={(e) => setIsLucid(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
                    isLucid ? (darkMode ? "bg-green-400" : "bg-green-600") : ""
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                      isLucid ? "translate-x-4" : ""
                    }`}
                  ></div>
                </div>
                <span className="ml-3">
                  Did you journey through a lucid dreamscape?
                </span>
              </label>
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-purple-200" : "text-purple-700"
                } flex items-center mb-4`}
              >
                <Cloud className="mr-2" size={16} />
                Emotions
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableEmotions.map((emotion) => (
                  <button
                    key={emotion.id}
                    type="button"
                    onClick={() => handleEmotionSelect(emotion)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedEmotions.some((e) => e.id === emotion.id)
                        ? "bg-purple-600 text-white"
                        : darkMode
                        ? "bg-purple-800 text-purple-200"
                        : "bg-purple-100 text-purple-700"
                    } transition-colors duration-300 flex items-center`}
                  >
                    {selectedEmotions.some((e) => e.id === emotion.id) ? (
                      <X className="inline-block mr-1" size={12} />
                    ) : (
                      <Heart className="inline-block mr-1" size={12} />
                    )}
                    {emotion.name}
                    {emotion.isAISuggested !== undefined && (
                      <>
                        <Sparkles size={12} className="ml-1 text-yellow-400" />
                      </>
                    )}
                  </button>
                ))}
              </div>
              <motion.button
                onClick={suggestEmotionsWithAI}
                disabled={
                  content.length < 50 ||
                  isAIThinkingEmotions ||
                  aiSuggestedEmotions
                }
                className={`text-xs ${
                  content.length < 50 ||
                  isAIThinkingEmotions ||
                  aiSuggestedEmotions
                    ? "bg-gray-400 cursor-not-allowed"
                    : darkMode
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-400 hover:bg-purple-500"
                } text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 mt-2 mb-3 relative overflow-hidden`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isAIThinkingEmotions ? { opacity: 0.7 } : { opacity: 1 }
                }
              >
                <motion.span
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isAIThinkingEmotions ? 1 : 0 }}
                >
                  <motion.div
                    className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.span>
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isAIThinkingEmotions ? 0 : 1 }}
                >
                  {aiSuggestedEmotions
                    ? "Emotions Suggested"
                    : "Suggest Emotions with AI"}
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
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-purple-200" : "text-purple-700"
                } flex items-center mb-4`}
              >
                <Star className="mr-2" size={16} />
                Themes
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleThemeSelect(theme)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedThemes.includes(theme.name)
                        ? "bg-purple-600 text-white"
                        : darkMode
                        ? "bg-purple-800 text-purple-200"
                        : "bg-purple-100 text-purple-700"
                    } transition-colors duration-300 flex items-center`}
                  >
                    {selectedThemes.includes(theme.name) ? (
                      <X className="inline-block mr-1" size={12} />
                    ) : (
                      <Tag className="inline-block mr-1" size={12} />
                    )}
                    {theme.name}
                    {theme.isAISuggested && (
                      <Sparkles size={12} className="ml-1 text-yellow-400" />
                    )}
                  </button>
                ))}
              </div>
              <motion.button
                onClick={suggestThemesWithAI}
                disabled={
                  content.length < 50 || isAIThinking || aiSuggestedThemes
                }
                className={`text-xs ${
                  content.length < 50 || isAIThinking || aiSuggestedThemes
                    ? "bg-gray-400 cursor-not-allowed"
                    : darkMode
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-400 hover:bg-purple-500"
                } text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 mt-2 mb-3 relative overflow-hidden`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isAIThinking ? { opacity: 0.7 } : { opacity: 1 }}
              >
                <motion.span
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isAIThinking ? 1 : 0 }}
                >
                  <motion.div
                    className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.span>
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isAIThinking ? 0 : 1 }}
                >
                  {aiSuggestedThemes
                    ? "Themes Suggested"
                    : "Suggest Themes with AI"}
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
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              className={`w-full ${
                darkMode
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"
              } text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 relative overflow-hidden`}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">
                {isSubmitting ? "Saving Dream..." : "Capture Dream"}
              </span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  isSubmitting
                    ? { scale: 1, opacity: 0.2 }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DreamRecordPopup;
