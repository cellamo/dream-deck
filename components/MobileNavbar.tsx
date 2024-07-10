import React, { useState } from 'react';
import Link from 'next/link';
import { Book, Brain, Users, Moon, Plus } from 'lucide-react';
import { useDarkMode } from '../app/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import DreamRecordPopup from './DreamRecordPopup';

const MobileNavbar: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [isRecordDreamOpen, setIsRecordDreamOpen] = useState(false);

  const menuItems = [
    { href: '/dashboard', icon: Book, text: 'Journal' },
    { href: '/analysis', icon: Brain, text: 'Analysis' },
    { href: '/community', icon: Users, text: 'Community' },
    { href: '/lucid-training', icon: Moon, text: 'Lucid' },
  ];

  const handleCreateDream = () => {
    setIsRecordDreamOpen(true);
  };

  const handleDreamCreated = () => {
    setIsRecordDreamOpen(false);
  };

  return (
    <>
      <nav className={`fixed bottom-0 left-0 right-0 h-16 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      } flex justify-around items-center z-50`}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {index === 2 && (
              <div className="relative -top-8">
                <motion.button
                  onClick={handleCreateDream}
                  className={`w-16 h-16 rounded-full ${
                    darkMode ? 'bg-purple-600' : 'bg-indigo-500'
                  } flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #8a2be2, #4b0082)',
                    boxShadow: '0 4px 10px rgba(138, 43, 226, 0.5)'
                  }}
                >
                  <Plus size={32} color="white" />
                </motion.button>
              </div>
            )}
            <Link href={item.href}>
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon size={24} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</span>
              </motion.div>
            </Link>
          </React.Fragment>
        ))}
      </nav>
      <AnimatePresence>
        {isRecordDreamOpen && (
          <DreamRecordPopup
            onClose={() => setIsRecordDreamOpen(false)}
            onDreamCreated={handleDreamCreated}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavbar;
