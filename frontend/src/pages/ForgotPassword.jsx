import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Key, Mail, CheckCircle, ArrowLeft, Shield, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp/newPassword
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugOtp, setDebugOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setStep(2);
      setDebugOtp(res.data.debug_otp); // For testing as requested
      setSuccess('OTP sent successfully');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      setSuccess('Password reset successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
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
        className="glass-card w-full max-w-md p-10 relative overflow-hidden bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
        
        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Login</span>
        </Link>

        <div className="flex justify-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="bg-primary bg-opacity-20 p-5 rounded-3xl"
          >
            <Key className="w-10 h-10 text-primary" />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-black text-center mb-10 tracking-tight text-gray-800 dark:text-white">
          {step === 1 ? 'Forgot Password?' : 'Reset Password'}
        </h2>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 text-red-500 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 text-green-500 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-2 font-bold">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="input-field pl-12 bg-gray-50 dark:bg-gray-700/50"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-3"
            >
              {loading ? 'Sending...' : (
                <>
                  <span>Send OTP</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="p-4 bg-primary/10 rounded-2xl mb-6">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest text-center">
                Debug Mode: OTP is <span className="text-lg ml-2">{debugOtp}</span>
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Verification OTP</label>
              <input
                type="text"
                className="input-field bg-gray-50 dark:bg-gray-700/50 text-center text-2xl tracking-[1em] font-black"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
              <input
                type="password"
                className="input-field bg-gray-50 dark:bg-gray-700/50"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 mt-4"
            >
              {loading ? 'Resetting...' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm font-bold text-gray-400 hover:text-primary transition-colors"
            >
              Didn't receive code? Try again
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
