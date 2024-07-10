import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Zap, Sparkles } from 'lucide-react';

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  darkMode: boolean;
  className?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onConfirm, onCancel, darkMode }) => {
  const confirmationRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(() => {
        if (confirmationRef.current && !confirmationRef.current.contains(event.target as Node)) {
          onCancel();
        }
      }, 100);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    console.log('Delete button clicked in confirmation');
    onConfirm();
  };


  return (
    <motion.div
      ref={confirmationRef}
      initial={{ opacity: 0, width: 0, height: 0 }}
      animate={{ opacity: 1, width: "auto", height: "auto" }}
      exit={{ opacity: 0, width: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`absolute top-0 right-0 bg-gradient-to-br ${
        darkMode 
          ? 'from-purple-900 to-indigo-900' 
          : 'from-purple-100 to-indigo-200'
      } rounded-lg shadow-lg overflow-hidden z-20`}
      style={{ transformOrigin: 'top right' }}
    >
      <div className="p-4 text-center">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-3xl mb-2"
        >
        </motion.div>
        <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-indigo-900'}`}>
          Dissolve This Dream?
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-purple-200' : 'text-indigo-700'}`}>
          Once gone, it can&apos;t be recaptured.
        </p>
        <div className="flex justify-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className={`px-3 py-1 ${
              darkMode 
                ? 'bg-purple-700 hover:bg-purple-600' 
                : 'bg-purple-400 hover:bg-purple-500'
            } text-white rounded-full text-sm flex items-center justify-center transition-colors duration-300`}
          >
            <Wind className="w-4 h-4 mr-1" />
            Keep
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirmClick}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm flex items-center justify-center transition-colors duration-300"
          >
            <Zap className="w-4 h-4 mr-1" />
            Delete
          </motion.button>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {[...Array(5)].map((_, i) => (
          <Sparkle key={i} darkMode={darkMode} />
        ))}
      </motion.div>
    </motion.div>
  );
};

const Sparkle: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const randomPosition = () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  });

  return (
    <motion.div
      className="absolute"
      style={randomPosition()}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: Math.random() * 2 + 1,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    >
      <Sparkles className={`${darkMode ? 'text-purple-300' : 'text-indigo-400'} w-3 h-3`} />
    </motion.div>
  );
};

export default DeleteConfirmation;
