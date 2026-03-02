import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Shield, Check, X, Clock, User, CheckCircle, AlertTriangle, UserCheck, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const authConfig = { headers: { 'x-auth-token': token } };
      const [pendingRes, historyRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/pending-users', authConfig),
        axios.get('http://localhost:5000/api/admin/history', authConfig)
      ]);
      setPendingUsers(pendingRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, status, role = 'employee') => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/approve-user', 
        { id: userId, status, role },
        { headers: { 'x-auth-token': token } }
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Loading Admin Control...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-800 dark:text-white">Admin Control Panel</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Manage user access and monitor system changes</p>
        </div>
        
        <div className="flex bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'pending' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Pending Requests ({pendingUsers.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'history' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            System Audit Log
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'pending' ? (
          <motion.div 
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pendingUsers.length === 0 ? (
              <div className="col-span-full py-24 text-center glass-card border-dashed border-2 bg-transparent">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-400">All caught up!</h3>
                <p className="text-gray-500 font-medium">No pending user requests found at the moment.</p>
              </div>
            ) : (
              pendingUsers.map(user => (
                <div key={user.id} className="glass-card p-8 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-all">
                    <UserCheck className="w-20 h-20 -mr-10 -mt-10" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary bg-opacity-10 p-4 rounded-3xl text-primary">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-gray-800 dark:text-white">{user.name}</h4>
                      <p className="text-sm font-bold text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApprove(user.id, 'approved', 'employee')}
                        className="flex-1 py-4 bg-green-500 bg-opacity-10 text-green-500 border border-green-500/20 rounded-2xl hover:bg-green-500 hover:text-white transition-all font-black text-xs uppercase flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Employee</span>
                      </button>
                      <button 
                        onClick={() => handleApprove(user.id, 'approved', 'admin')}
                        className="flex-1 py-4 bg-primary bg-opacity-10 text-primary border border-primary/20 rounded-2xl hover:bg-primary hover:text-white transition-all font-black text-xs uppercase flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Approve Admin</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => handleApprove(user.id, 'rejected')}
                      className="w-full py-4 bg-red-500 bg-opacity-5 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-xs uppercase flex items-center justify-center gap-2 rounded-2xl border border-red-500/10"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject Access</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
              <h3 className="text-xl font-black flex items-center gap-3 dark:text-white">
                <History className="text-primary w-6 h-6" />
                System Audit Trail
              </h3>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl text-primary font-black text-[10px] uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Monitoring Real-time Activity</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
              {history.map(item => (
                <div key={item.id} className="p-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all flex items-start gap-8 group">
                  <div className="mt-1">
                    <div className={`p-4 rounded-2xl ${
                      item.action === 'CREATE' ? 'bg-green-500' : 
                      item.action === 'DELETE' ? 'bg-red-500' : 
                      'bg-blue-500'
                    } bg-opacity-10 shadow-inner`}>
                      <Clock className={`w-6 h-6 ${
                        item.action === 'CREATE' ? 'text-green-500' : 
                        item.action === 'DELETE' ? 'text-red-500' : 
                        'text-blue-500'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-black text-lg text-gray-800 dark:text-white">
                          {item.action} on <span className="text-primary uppercase tracking-tighter">{item.table_name}</span>
                        </h4>
                        <p className="text-sm font-bold text-gray-400">
                          Executed by <span className="text-primary">{item.changed_by_name}</span>
                        </p>
                      </div>
                      <span className="text-xs font-black text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {item.old_value && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-1">Previous Data</p>
                          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-500/10">
                            <code className="text-[10px] text-red-600 dark:text-red-400 font-bold block overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(JSON.parse(item.old_value), null, 2)}
                            </code>
                          </div>
                        </div>
                      )}
                      {item.new_value && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase text-green-500 tracking-widest ml-1">Modified Data</p>
                          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-500/10">
                            <code className="text-[10px] text-green-600 dark:text-green-400 font-bold block overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(JSON.parse(item.new_value), null, 2)}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
