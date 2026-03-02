import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, MapPin, Calendar, User, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Employees = ({ user }) => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    emp_name: '',
    emp_code: '',
    doj: '',
    location: ''
  });

  const isAdmin = user.user.role === 'admin';
  console.log('user is ',user)
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { 'x-auth-token': token }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingEmp) {
        await axios.put(`http://localhost:5000/api/employees/${editingEmp.id}`, formData, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post('http://localhost:5000/api/employees', formData, {
          headers: { 'x-auth-token': token }
        });
      }
      setShowModal(false);
      fetchEmployees();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving employee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ emp_name: '', emp_code: '', doj: '', location: '' });
    setEditingEmp(null);
  };

  const filtered = employees.filter(emp => 
    emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.emp_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-800 dark:text-white">Employee Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Manage and view all registered employees</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or code..."
              className="input-field pl-12 bg-white dark:bg-gray-800 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((emp, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              key={emp.id}
              className="glass-card p-6 group hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-all" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary bg-opacity-10 p-4 rounded-2xl text-primary">
                  <User className="w-8 h-8" />
                </div>
                {isAdmin && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => { setEditingEmp(emp); setFormData(emp); setShowModal(true); }}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 rounded-xl transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(emp.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-gray-800 dark:text-white truncate">{emp.emp_name}</h3>
                  <p className="text-primary font-black text-sm uppercase tracking-tighter">Code: {emp.emp_code}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className= "flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">{new Date(emp.doj).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold">{emp.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card w-full max-w-lg p-8 shadow-2xl relative"
          >
            <button 
              onClick={() => { setShowModal(false); resetForm(); }}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              <X className="w-6 h-6 dark:text-white" />
            </button>

            <h2 className="text-2xl font-black mb-8 dark:text-white">
              {editingEmp ? 'Update Employee' : 'Add New Employee'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Name</label>
                  <input 
                    required 
                    className="input-field"
                    value={formData.emp_name}
                    onChange={e => setFormData({...formData, emp_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Code</label>
                  <input 
                    required 
                    className="input-field"
                    value={formData.emp_code}
                    onChange={e => setFormData({...formData, emp_code: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Joining Date</label>
                  <input 
                    type="date" 
                    required 
                    className="input-field"
                    value={formData.doj ? formData.doj.split('T')[0] : ''}
                    onChange={e => setFormData({...formData, doj: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Location</label>
                  <input 
                    required 
                    className="input-field"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20"
                >
                  {editingEmp ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Employees;
