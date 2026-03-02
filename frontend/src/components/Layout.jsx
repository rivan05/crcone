import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return 'light';
  });

  return (
    <div className="min-h-screen">
      <Navbar 
        user={user} 
        onLogout={onLogout} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        role={user.role} 
      />
      <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
