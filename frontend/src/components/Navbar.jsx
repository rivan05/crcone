import React from 'react';
import { Menu, X, LogOut, Sun, Moon, Bell, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ user, onLogout, toggleSidebar, darkMode, setDarkMode, sidebarOpen }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass-card bg-opacity-40 dark:bg-opacity-40 rounded-none z-50 flex items-center justify-between px-8 border-b border-white dark:border-gray-700 border-opacity-10 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-primary" />
          )}
        </motion.button>
        <div className="flex items-center gap-2">
          {/* <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-5 h-5 text-white" />
          </div> */}
          {/* <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-100 to-secondary">
            oru pera varalaru
          </h1> */}
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
  Oru pera Varalaru
</h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all text-gray-600 dark:text-gray-300"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button> */}
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right hidden sm:block">
            {/* <p className="text-sm font-medium dark:text-white">{user.user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.user.role}</p> */}
          </div>
          <div className="bg-primary bg-opacity-20 p-2 rounded-full">
          </div>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-red-500 hover:bg-opacity-10 text-red-500 rounded-full transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
