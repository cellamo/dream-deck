import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Book, Brain, Image as ImageIcon, Music, Users, Target, Moon, ChevronRight, HelpCircle, Settings, LogOut, Home, Pin } from 'lucide-react';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '../app/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import { usePathname } from 'next/navigation';

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


export default Sidebar;