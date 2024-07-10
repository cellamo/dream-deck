import React, { useState } from 'react';
import { Mic, PenTool } from 'lucide-react';
import DreamRecordPopup from './DreamRecordPopup';

interface QuickRecordButtonProps {
  triggerRefresh: () => void;
}

const QuickRecordButton: React.FC<QuickRecordButtonProps> = ({ triggerRefresh }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);


  const handleRecording = () => {
    setIsRecording(!isRecording);
    // Implement recording logic here
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDreamCreated = async (dreamData: {
    title: string;
    content: string;
    is_lucid: boolean;
    emotions: { emotion: string; intensity: number }[]; // Updated property name
    themes: string[];
  }) => {
    // Handle dream creation logic here
    triggerRefresh(); // Refresh dreams after successful creation
    setIsPopupOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4">
      <button
        onClick={handleOpenPopup}
        className="p-4 rounded-full shadow-lg bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300 hover:scale-110"
      >
        <PenTool className="h-6 w-6 text-white" />
      </button>
      {isPopupOpen && (
        <DreamRecordPopup 
          onClose={handleClosePopup} 
          onDreamCreated={handleDreamCreated} 
        />
      )}

      <button
        onClick={handleRecording}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
          isRecording
            ? 'bg-red-500 animate-pulse'
            : 'bg-gradient-to-r from-teal-400 to-blue-500'
        }`}
      >
        <Mic className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default QuickRecordButton;