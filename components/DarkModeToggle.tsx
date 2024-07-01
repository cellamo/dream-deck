import { useDarkMode } from '../app/DarkModeContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full ${
        darkMode
          ? 'bg-purple-600 hover:bg-purple-700'
          : 'bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500'
      } transition-all duration-300 shadow-md`}
    >
      {darkMode ? (
        <Sun className="text-yellow-300" size={16} />
      ) : (
        <Moon className="text-white" size={16} />
      )}
    </button>
  );
};

export default DarkModeToggle;
