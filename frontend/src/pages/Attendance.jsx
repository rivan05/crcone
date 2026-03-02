import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Download, Check, X, AlertCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Attendance = ({ user }) => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState('daily'); // daily, weekly, monthly
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFrom, setExportFrom] = useState(fromDate);
  const [exportTo, setExportTo] = useState(toDate);
  const [exporting, setExporting] = useState(false);

  const isAdmin = user.user.role === 'admin';

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [fromDate, toDate]);

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

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/attendance?from=${fromDate}&to=${toDate}`, {
        headers: { 'x-auth-token': token }
      });
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMark = async (empId, status, reason = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/attendance/mark', {
        emp_id: empId,
        date: fromDate,
        status,
        reason
      }, {
        headers: { 'x-auth-token': token }
      });
      fetchAttendance();
    } catch (err) {
      alert('Error marking attendance');
    }
  };

  const exportToCSV = () => {
    const headers = ['Employee Name', 'Code', 'Date Range', 'Status', 'Reason', 'Location'];
    const data = employees.map(emp => {
      const att = attendance.find(a => a.emp_id === emp.id);
      return [
        emp.emp_name,
        emp.emp_code,
        `${fromDate} to ${toDate}`,
        att ? att.status : 'Not Marked',
        att ? att.reason || '-' : '-',
        emp.location
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + data.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    console.log('Status:', status);
    switch(status) {
      case 'present': return 'bg-green-500';
      case 'weekoff': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      case 'SL': return 'bg-amber-500';
      case 'AL': return 'bg-blue-500';
      case 'HFDAL': return 'bg-purple-500';
      case 'UAL': return 'bg-gray-500';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  const filtered = employees.filter(emp => 
    emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.emp_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-800 dark:text-white">Attendance Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Daily record tracking and management</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => {
                const f = new Date(fromDate);
                const t = new Date(toDate);
                f.setDate(f.getDate() - 1);
                t.setDate(t.getDate() - 1);
                setFromDate(f.toISOString().split('T')[0]);
                setToDate(t.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
            </button>
            <input 
              type="date" 
              className="bg-transparent font-bold dark:text-white outline-none cursor-pointer"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => { setExportFrom(fromDate); setExportTo(toDate); setShowExportModal(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>

          {showExportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowExportModal(false)} />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-7 w-full max-w-lg shadow-lg z-10">
                <h3 className="text-lg font-black mb-4 dark:text-white">Export Attendance CSV</h3>
                <div className="flex items-center gap-2 mb-4">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-300">From</label>
                  <input type="date" className="ml-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900" value={exportFrom} onChange={e => setExportFrom(e.target.value)} />
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-300 ml-4">To</label>
                  <input type="date" className="ml-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900" value={exportTo} onChange={e => setExportTo(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700" onClick={() => setShowExportModal(false)}>Cancel</button>
                  <button
                    className="px-4 py-2 rounded-lg bg-primary text-white"
                    onClick={async () => {
                      setExporting(true);
                      try {
                        const token = localStorage.getItem('token');
                        const res = await axios.get(`http://localhost:5000/api/attendance?from=${exportFrom}&to=${exportTo}`, { headers: { 'x-auth-token': token } });
                        const rows = res.data;
                        // Build CSV with required headers and include Not Marked for missing entries
                        const headers = ['Employee Name','Code','Date','Status','Reason'];
                        const lines = [headers.join(',')];

                        // Map attendance by emp_id|date for quick lookup
                        const attMap = new Map();
                        rows.forEach(r => {
                          if (r.emp_id && r.date) attMap.set(`${r.emp_id}|${r.date}`, r);
                        });

                        // build array of dates in range (inclusive)
                        const dates = [];
                        const start = new Date(exportFrom);
                        const end = new Date(exportTo);
                        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                          dates.push(new Date(d).toISOString().split('T')[0]);
                        }

                        // For each employee and each date, output a row
                        employees.forEach(emp => {
                          dates.forEach(date => {
                            const key = `${emp.id}|${date}`;
                            const r = attMap.get(key);
                            const status = r ? (r.status || '') : 'Not Marked';
                            const reason = r && r.reason ? `"${(r.reason+'').replace(/"/g,'""') }"` : '';
                            const vals = [emp.emp_name || '', emp.emp_code || '', date, status, reason];
                            lines.push(vals.join(','));
                          });
                        });

                        const csvContent = lines.join('\n');

                        // Try File System Access API first
                        if (window.showSaveFilePicker) {
                          try {
                            const opts = {
                              suggestedName: `attendance_${exportFrom}_to_${exportTo}.csv`,
                              types: [{ description: 'CSV', accept: { 'text/csv': ['.csv'] } }]
                            };
                            const handle = await window.showSaveFilePicker(opts);
                            const writable = await handle.createWritable();
                            await writable.write(new Blob([csvContent], { type: 'text/csv' }));
                            await writable.close();
                          } catch (err) {
                            // fallback to download
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `attendance_${exportFrom}_to_${exportTo}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }
                        } else {
                          // fallback: blob download
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', `attendance_${exportFrom}_to_${exportTo}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                        }

                        setShowExportModal(false);
                      } catch (err) {
                        console.error(err);
                        alert('Failed to fetch attendance for selected range');
                      } finally {
                        setExporting(false);
                      }
                    }}
                    disabled={exporting}
                  >
                    {exporting ? 'Exporting...' : 'Export'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by name or code..."
              className="input-field pl-12 bg-gray-50 dark:bg-gray-900/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Legend:</span>
            {['present', 'absent', 'weekoff', 'SL', 'AL', 'HFDAL', 'UAL'].map(s => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(s)}`} />
                <span className="text-[10px] font-black uppercase dark:text-gray-400">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-5">Employee Info</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5">Current Status</th>
                {isAdmin && <th className="px-8 py-5 text-center">Action Panel</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((emp,idx) => {
                const att = attendance.find(a => a.emp_id === emp.id);
                return (
                  <motion.tr 
                    layout
                    key={emp.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary bg-opacity-10 flex items-center justify-center text-primary font-black">
                          {idx+1}
                        </div>
                        <div>
                          <p className="font-black text-gray-800 dark:text-white">{emp.emp_name}</p>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{emp.emp_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{emp.location}</span>
                    </td>
                    <td className="px-8 py-6">
                      {att ? (
                        <div className="flex flex-col gap-1">
                          <span className={`px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase w-fit ${getStatusColor(att.status)} shadow-lg shadow-opacity-20`}>
                            {att.status}
                          </span>
                          {att.reason && <p className="text-[10px] text-gray-400 font-bold ml-1 bold">{att.reason}</p>}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase">Not Marked</span>
                        </div>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            defaultValue={att?.status || 'not_marked'}
                            onChange={e => {
                              const status = e.target.value;
                              if (status === 'not_marked') return;
                              // Prompt for reason only for leave-like statuses
                              if (['SL', 'AL', 'HFDAL', 'UAL'].includes(status)) {
                                const reason = prompt(`Reason for ${status}:`);
                                if (reason) handleMark(emp.id, status, reason);
                                else e.target.value = att?.status || 'not_marked';
                              } else {
                                handleMark(emp.id, status);
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-bold"
                          >
                            <option value="not_marked">-- Action --</option>
                            {['present', 'absent', 'weekoff', 'SL', 'AL', 'HFDAL', 'UAL'].map(s => (
                              <option key={s} value={s}>{s.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
