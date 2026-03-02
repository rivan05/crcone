import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      setSuccess(res.data.msg);
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-10 relative overflow-hidden bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
        
        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Login</span>
        </Link>

        <div className="flex justify-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-primary bg-opacity-20 p-5 rounded-3xl"
          >
            <UserPlus className="w-10 h-10 text-primary" />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-black text-center mb-10 tracking-tight text-gray-800 dark:text-white">
          Join CRC Portal
        </h2>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 text-red-500 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center space-y-8 py-4">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-500 bg-opacity-20 p-6 rounded-full"
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold dark:text-white">Request Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Your account is currently <span className="text-primary font-bold">pending admin approval</span>. 
                You will be notified once you're approved.
              </p>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary w-full py-4"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                className="input-field bg-gray-50 dark:bg-gray-700/50"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
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
              className="btn-primary w-full py-4 mt-4"
            >
              {loading ? 'Processing...' : 'Request Registration'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;
