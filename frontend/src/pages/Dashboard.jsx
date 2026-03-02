import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, UserCheck, UserMinus, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({ stats: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/attendance/analytics?date=${today}`, {
        headers: { 'x-auth-token': token }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    present: '#10B981', 
    absent: '#EF4444',
    SL: '#F59E0B',
    AL: '#3B82F6',
    HFDAL: '#8B5CF6',
    UAL: '#6B7280'
  };

  const chartData = stats.stats.map(s => ({
    name: s.status,
    value: s.count
  }));

  console.log('Stats:', stats);

  const presentCount = stats.stats.find(s => s.status === 'present')?.count || 0;
const absentCount = stats.stats
  .filter(s => s.status !== 'present' && s.status !== 'weekoff')
  .reduce((sum, s) => sum + s.count, 0);
const weekOffCount = stats.stats.find(s => s.status === 'weekoff')?.count || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time attendance analytics for {new Date().toDateString()}</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold dark:text-white">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Employees', value: stats.total, icon: <Users />, color: 'bg-blue-500' },
          { label: 'Present Today', value: presentCount, icon: <UserCheck />, color: 'bg-green-500' },
          { label: 'Absent Today', value: absentCount, icon: <UserMinus />, color: 'bg-red-500' },
          { label: 'Week Off Today', value: weekOffCount, icon: <UserMinus />, color: 'bg-yellow-500' },
          { label: 'Attendance Rate', value: stats.total > 0 ? `${Math.round((presentCount / stats.total) * 100)}%` : '0%', icon: <TrendingUp />, color: 'bg-purple-500' },
        ].map((item, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="glass-card p-6 flex items-center gap-6 group hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className={`${item.color} p-4 rounded-2xl text-white shadow-lg shadow-${item.color.split('-')[1]}-200 dark:shadow-none`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-3xl font-black text-gray-800 dark:text-white">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-card p-8"
        >
          <h3 className="text-xl font-black mb-8 dark:text-white">Daily Attendance Breakdown</h3>
          <div className="h-[400px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#CBD5E1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <PieChart className="w-10 h-10" />
                </div>
                <p className="font-bold">No attendance marked yet for today</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 flex flex-col justify-between"
        >
          {/* <div className="space-y-6">
            <h3 className="text-xl font-black dark:text-white">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div>
                    <p className="text-sm font-bold dark:text-white">Admin approved a new user</p>
                    <p className="text-xs text-gray-400 font-medium">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          <button className="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white text-gray-600 dark:text-gray-300 font-bold rounded-2xl transition-all">
            View All History
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
