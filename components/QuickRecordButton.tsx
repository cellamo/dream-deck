import React, { useState } from 'react';
import { Mic, PenTool } from 'lucide-react';
import Link from 'next/link';
import DreamRecordPopup from './DreamRecordPopup';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_DREAMS } from '../app/graphql/queries';
import { CREATE_DREAM } from '../app/graphql/mutation';

const QuickRecordButton = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { refetch } = useQuery(GET_USER_DREAMS);

  const [createDream] = useMutation(CREATE_DREAM, {
    onCompleted: () => {
      refetch();
      setIsPopupOpen(false);
    },
    onError: (error) => {
      console.error('Error creating dream:', error);
      console.error('GraphQL error details:', error.graphQLErrors);
      console.error('Network error details:', error.networkError);
    },
  });


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
    emotions: string[];
    themes: string[];
  }) => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      await createDream({
        variables: {
          ...dreamData,
          date: formattedDate,
        },
      });
    } catch (error) {
      console.error('Error creating dream:', error);
    }
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
/>      )}

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
