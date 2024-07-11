import React, { useState } from "react";
import Link from "next/link";
import { Book, Brain, Users, Moon, Plus } from "lucide-react";
import { useDarkMode } from "../app/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";
import DreamRecordPopup from "./DreamRecordPopup";
import { useRouter, usePathname } from "next/navigation";

const MobileNavbar: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [isRecordDreamOpen, setIsRecordDreamOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", icon: Book, text: "Journal" },
    { href: "/analysis", icon: Brain, text: "Analysis" },
    { href: "/community", icon: Users, text: "Community" },
    { href: "/test", icon: Moon, text: "Lucid" },
  ];

  const handleCreateDream = () => {
    setIsRecordDreamOpen(true);
  };

  const handleDreamCreated = () => {
    setIsRecordDreamOpen(false);
  };

  return (
    <>
      <nav className={`fixed bottom-0 w-full h-16  ${
  darkMode ? 'bg-gray-900/100' : 'bg-white/80'
} backdrop-lg flex justify-around items-center z-50 shadow-lg`}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {index === 2 && (
              <div className="relative -top-8">
                <motion.button
                  onClick={handleCreateDream}
                  className={`w-16 h-16 rounded-full ${
                    darkMode ? "bg-purple-600" : "bg-indigo-500"
                  } flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "linear-gradient(135deg, #8a2be2, #4b0082)",
                    boxShadow: "0 4px 10px rgba(138, 43, 226, 0.5)",
                  }}
                >
                  <Plus size={32} color="white" />
                </motion.button>
              </div>
            )}
            <Link href={item.href} key={item.href}>
  <motion.div
    className="relative flex flex-col items-center justify-center w-16 h-16"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      animate={{
        y: pathname === item.href ? -3 : 0,
        scale: pathname === item.href ? 1.1 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <item.icon 
        size={24} 
        className={`${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        } ${
          pathname === item.href ? 'text-purple-500' : ''
        }`} 
      />
    </motion.div>
    <motion.span 
      className={`text-xs mt-1 ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      } ${
        pathname === item.href ? 'font-bold' : ''
      }`}
      animate={{
        opacity: pathname === item.href ? 1 : 0.7,
      }}
    >
      {item.text}
    </motion.span>
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