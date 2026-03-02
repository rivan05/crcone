import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      onLogin(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-main dark:bg-gray-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card w-full max-w-md p-10 relative overflow-hidden bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="flex justify-center mb-8">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="bg-primary bg-opacity-20 p-5 rounded-3xl"
          >
            <Shield className="w-10 h-10 text-primary" />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-black text-center mb-2 tracking-tight text-gray-800 dark:text-white">
          CRC Portal
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-10 text-sm font-medium">
          Attendance & Employee Management
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 text-red-500 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              className="input-field bg-gray-50 dark:bg-gray-700/50"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:underline font-bold">
                {/* Forgot? */}
              </Link>
            </div>
            <input
              type="password"
              className="input-field bg-gray-50 dark:bg-gray-700/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-3"
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          {/* Don't have an account?{' '} */}
          <Link to="/signup" className="text-primary hover:underline font-bold">
            {/* Request Access */}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
