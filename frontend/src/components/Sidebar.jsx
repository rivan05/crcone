import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, ShieldCheck, Settings, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen, role }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Employees', icon: <Users className="w-5 h-5" />, path: '/employees' },
    { name: 'Attendance', icon: <Calendar className="w-5 h-5" />, path: '/attendance' },
    { name: 'OldEmp', icon: <Shield className="w-5 h-5" />, path: '/old-employees' },
  ];

  if (role === 'admin') {
    menuItems.push({ name: 'Admin Panel', icon: <ShieldCheck className="w-5 h-5" />, path: '/admin' });
  }

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div onClick={e =>{
          e.preventDefault();
          setIsOpen(false);
        }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm sm:hidden"
          />

          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 bottom-0 w-64 glass-card bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 rounded-none z-50 border-r border-gray-200 dark:border-gray-700 pt-20 px-4 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-10 px-2 sm:hidden">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tighter dark:text-white">Attend</h1>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl sm:hidden"
            >
              <X className="w-6 h-6 dark:text-white" />
            </button>

            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                      isActive 
                      ? 'bg-primary bg-opacity-10 text-primary shadow-lg' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                    }`
                  }
                >
                  <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="absolute bottom-8 left-4 right-4">
              {/* <div className="glass-card p-4 bg-gray-50 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 border-none"> */}
                {/* <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Support</p>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-primary cursor-pointer transition-colors">
                  <Settings className="w-4 h-4" />
                 
                </div> */}
              {/* </div> */}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
