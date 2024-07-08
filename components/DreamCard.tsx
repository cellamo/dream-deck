import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import DeleteConfirmation from './DeleteConfirmation';
import { useDarkMode } from '@/app/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ENDPOINTS } from '@/app/api';
import { useRouter } from 'next/navigation';

type Dream = {
  id: string;
  title: string;
  date: string;
  userId: string;
};

interface DreamCardProps {
  dream: Dream;
  onDelete: () => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const darkModeContext = useDarkMode();
  const darkMode = darkModeContext ? darkModeContext.darkMode : false;
  const router = useRouter();

  const readableDate = new Date(parseInt(dream.date)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    console.log('Attempting to delete dream:', dream.id);
    try {
      const response = await fetch(`${ENDPOINTS.DREAMS}${dream.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Delete response:', response);
      
      if (!response.ok) {
        throw new Error(`Failed to delete dream: ${response.status} ${response.statusText}`);
      }
      
      console.log('Successfully deleted dream');
      onDelete();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting dream:', error);
    }
  };
  

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleViewDream = () => {
    router.push(`/dreams/${dream.id}`);
  };

  return (
    <div className={`relative rounded-lg overflow-hidden`}>
      <motion.div
        className={`${
          darkMode 
            ? 'bg-purple-800 bg-opacity-75' 
            : 'bg-purple-100 bg-opacity-75'
        } p-6 shadow-lg relative`}
      >
        <button
          onClick={handleDeleteClick}

          className={`absolute top-2 right-2 p-2 rounded-full ${
            darkMode 
              ? 'bg-gray-700 hover:bg-red-600' 
              : 'bg-gray-200 hover:bg-red-400'
            } transition-all duration-300 ease-in-out transform hover:scale-110 group`} // Lower z-index
            title="Delete dream"
        >
          <Trash2 className={`w-5 h-5 ${
            darkMode 
              ? 'text-red-300 group-hover:text-white' 
              : 'text-red-600 group-hover:text-white'
          } transition-colors duration-300`} />
        </button>
        <AnimatePresence>
            {showDeleteConfirmation && (
              <DeleteConfirmation
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                darkMode={darkMode}
                className="z-[20]"
              />
            )}
          </AnimatePresence>
        <h3 className={`text-2xl font-semibold mb-2 ${
          darkMode ? 'text-white' : 'text-purple-900'
        }`}>
          {dream.title}
        </h3>
        <p className={`text-sm mb-2 ${
          darkMode ? 'text-purple-300' : 'text-purple-700'
        }`}>
          {new Date(parseInt(dream.date)).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <div className="flex justify-center items-center mt-4">
          <button
            className={`px-4 py-2 ${
              darkMode 
                ? 'bg-blue-700 hover:bg-blue-600' 
                : 'bg-blue-500 hover:bg-blue-400'
            } text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105`}
            onClick={handleViewDream}
          >
            View Dream
          </button>
        </div>
      </motion.div>
      <AnimatePresence>
        {showDeleteConfirmation && (
          <DeleteConfirmation
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DreamCard;