import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Book, Brain, Image as ImageIcon, Music, Users, Target, Moon, ChevronRight, HelpCircle, Settings, LogOut, Home, Pin, Plus } from 'lucide-react';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '../app/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import { usePathname } from 'next/navigation';
import DreamRecordPopup from './DreamRecordPopup';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarProps {
  onPinChange: (isPinned: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onPinChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isUserSectionOpen, setIsUserSectionOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useDarkMode();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isRecordDreamOpen, setIsRecordDreamOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const togglePin = () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    setIsOpen(true);
    onPinChange(newPinnedState);
  };

  const toggleUserSection = () => {
    setIsUserSectionOpen(!isUserSectionOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  

  useEffect(() => {
    const handleMouseEnter = () => !isPinned && setIsOpen(true);
    const handleMouseLeave = () => !isPinned && setIsOpen(false);

    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      sidebarElement.addEventListener('mouseenter', handleMouseEnter);
      sidebarElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener('mouseenter', handleMouseEnter);
        sidebarElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isPinned]);


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
    // Optionally, you can add logic here to refresh the dream list or navigate to the new dream
  };

  if (isMobile) {
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
  }
  return (
<aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-screen ${
        darkMode
          ? 'bg-gray-950 bg-opacity-30'
          : 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
      } transition-all duration-300 ease-in-out 
                  ${isOpen ? 'w-64' : 'w-16'} 
                  shadow-2xl backdrop-blur-lg overflow-hidden z-50`}
    >
      <div className="p-4 flex justify-between items-center">
        {isOpen && (
          <Image 
            src="/dreamdeck-icon.png" 
            alt="Dream Deck Logo" 
            width={92} 
            height={92}
          />
        )}
        <div className="flex items-center">
        <button 
  onClick={togglePin} 
  className={`p-2 rounded-full ${
    darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-300'
  } transition-all duration-300 mr-2`}
>
  <Pin 
    size={20} 
    className={`${isPinned ? 'transform rotate-45' : ''} ${
      darkMode 
        ? isPinned ? 'text-purple-400' : 'text-purple-200' 
        : isPinned ? 'text-indigo-600' : 'text-indigo-800'
    }`}
  />
</button>
          {isOpen && <DarkModeToggle />}
        </div>
      </div>

      <nav className="mt-8">
      <ul className="space-y-2">
  <SidebarLink href="/dashboard" icon={Book} text="Dream Journal" isOpen={isOpen} darkMode={darkMode} isActive={pathname === '/dashboard'} />
  <SidebarLink href="/analysis" icon={Brain} text="AI Analysis" isOpen={isOpen} darkMode={darkMode} isActive={pathname === '/analysis'} />
  <SidebarLink href="/artwork" icon={ImageIcon} text="Dream Artwork" isOpen={isOpen} darkMode={darkMode} isActive={pathname === '/artwork'} />
  <SidebarLink href="/soundscapes" icon={Music} text="Dream Soundtracks" isOpen={isOpen} darkMode={darkMode} isActive={pathname === '/soundscapes'} />
  <SidebarLink href="/community" icon={Users} text="Dream Community" isOpen={isOpen} darkMode={darkMode} isActive={pathname === '/community'} />
  <SidebarLink href="/challenges" icon={Target} text="Dream Challenges" isOpen={isOpen} darkMode={darkMode} isActive={pathname === '/challenges'} />
  <SidebarLink href="/lucid-training" icon={Moon} text="Lucid Dreaming" isOpen={isOpen} darkMode={darkMode} isActive={pathname === '/lucid-training'} />
</ul>

      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className={`flex items-center justify-between ${isOpen ? '' : 'flex-col'} relative`}>
          <div className="flex items-center cursor-pointer" onClick={toggleUserSection}>
            <div className={`w-8 h-8 ${
              darkMode ? 'bg-purple-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            } rounded-full flex items-center justify-center text-white`}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isOpen && <span className={`ml-2 text-sm ${darkMode ? 'text-white' : 'text-indigo-800'}`}>{user?.email || 'user@example.com'}</span>}
            {isOpen && (
              <ChevronRight size={20} className={`transform ${isUserSectionOpen ? '-rotate-90' : ''} ${darkMode ? 'text-white' : 'text-indigo-800'}`} />
            )}
          </div>
          <div className="text-center">
            {isOpen && <Link href="/help-and-support" className={`${
              darkMode ? 'text-purple-200 hover:text-white' : 'text-indigo-700 hover:text-indigo-900'
            }`}>
              <HelpCircle size={20} />
            </Link>}
          </div>
          
          {isUserSectionOpen && isOpen && (
            <div className={`absolute bottom-full mb-2 right-0 ${
              darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-100 to-purple-100'
            } rounded-lg p-4 w-full shadow-lg backdrop-blur-md`}>
              <Link href="/" className={`flex items-center space-x-2 ${
                darkMode ? 'text-purple-200 hover:text-white' : 'text-indigo-700 hover:text-indigo-900'
              } mb-2`}>
                <Home size={16} />
                <span>Home</span>
              </Link>
              <Link href="/settings" className={`flex items-center space-x-2 ${
                darkMode ? 'text-purple-200 hover:text-white' : 'text-indigo-700 hover:text-indigo-900'
              } mb-2`}>
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className={`flex items-center space-x-2 ${
                darkMode ? 'text-purple-200 hover:text-white' : 'text-indigo-700 hover:text-indigo-900'
              } w-full text-left`}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
        
        {isOpen && (
          <div className="mt-2 text-center">
            <button className={`text-sm ${
              darkMode
                ? 'text-purple-200 hover:text-white bg-purple-600 hover:bg-purple-700'
                : 'text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            } rounded-full py-1 px-4 w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md`}>
              Upgrade Plan
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: any;
  text: string;
  isOpen: boolean;
  darkMode: boolean;
  isActive: boolean;
}

const SidebarLink: React.FunctionComponent<SidebarLinkProps> = ({ href, icon: Icon, text, isOpen, darkMode, isActive }) => (
  <li>
    <Link 
      href={href}
      className={`flex items-center space-x-4 px-6 py-3 ${
        darkMode
          ? isActive
            ? 'text-white bg-purple-800/50'
            : 'text-purple-200 hover:text-white hover:bg-purple-600/30'
          : isActive
            ? 'text-indigo-900 bg-indigo-400/50'
            : 'text-indigo-800 hover:text-indigo-900 hover:bg-indigo-300/50'
      } transition-all duration-200 ${isOpen ? 'rounded-l-full' : 'justify-center'}`}
    >
      <Icon size={24} className="text-center" />
      {isOpen && <span className="font-medium">{text}</span>}
    </Link>
  </li>
);

const CircularMenuItem: React.FC<{
  href: string;
  icon: any;
  text: string;
  index: number;
  total: number;
  darkMode: boolean;
}> = ({ href, icon: Icon, text, index, total, darkMode }) => {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 120; // Adjust this value to change the size of the circular menu

  return (
    <Link href={href}>
      <motion.div
        className={`absolute flex flex-col items-center justify-center w-16 h-16 rounded-full ${
          darkMode ? 'bg-purple-800 text-white' : 'bg-indigo-100 text-indigo-800'
        }`}
        style={{
          left: `calc(50% + ${Math.cos(angle) * radius}px - 32px)`,
          top: `calc(50% + ${Math.sin(angle) * radius}px - 32px)`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon size={24} />
        <span className="text-xs mt-1">{text}</span>
      </motion.div>
    </Link>
  );
};

export default Sidebar;