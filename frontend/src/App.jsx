import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees user={user} />} />
          <Route path="/attendance" element={<Attendance user={user} />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
