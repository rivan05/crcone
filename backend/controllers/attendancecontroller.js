const db = require('../config/db');

exports.getAttendance = async (req, res) => {
  const { date, from, to, month, year, emp_id } = req.query;
  try {
    let query = `
      SELECT a.*, e.emp_name, e.emp_code, e.location 
      FROM attendance a 
      JOIN employees e ON a.emp_id = e.id
      WHERE 1=1
    `;
    let params = [];
    if (date) {
      query += ' AND a.date = ?';
      params.push(date);
    }
    if (from && to) {
      query += ' AND a.date BETWEEN ? AND ?';
      params.push(from, to);
    }
    if (month && year) {
      query += ' AND MONTH(a.date) = ? AND YEAR(a.date) = ?';
      params.push(month, year);
    }
    if (emp_id) {
      query += ' AND a.emp_id = ?';
      params.push(emp_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  const { emp_id, date, status, reason } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM attendance WHERE emp_id = ? AND date = ?', [emp_id, date]);
    if (existing.length > 0) {
      await db.query(
        'UPDATE attendance SET status = ?, reason = ?, marked_by = ? WHERE id = ?',
        [status, reason, req.user.id, existing[0].id]
      );
      
      // History
      await db.query(
        'INSERT INTO history (table_name, record_id, action, old_value, new_value, changed_by) VALUES (?, ?, ?, ?, ?, ?)',
        ['attendance', existing[0].id, 'UPDATE', JSON.stringify(existing[0]), JSON.stringify(req.body), req.user.id]
      );
    } else {
      const [result] = await db.query(
        'INSERT INTO attendance (emp_id, date, status, reason, marked_by) VALUES (?, ?, ?, ?, ?)',
        [emp_id, date, status, reason, req.user.id]
      );
      
      // History
      await db.query(
        'INSERT INTO history (table_name, record_id, action, new_value, changed_by) VALUES (?, ?, ?, ?, ?)',
        ['attendance', result.insertId, 'CREATE', JSON.stringify(req.body), req.user.id]
      );
    }

    res.json({ msg: 'Attendance marked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  const { date } = req.query;
  try {
    const [stats] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM attendance 
      WHERE date = ? 
      GROUP BY status
    `, [date]);
    
    const [totalEmps] = await db.query('SELECT COUNT(*) as total FROM employees');
    
    res.json({ stats, total: totalEmps[0].total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWeeklySummary = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const [rows] = await db.query(`
      SELECT e.emp_name, e.emp_code, a.date, a.status
      FROM employees e
      LEFT JOIN attendance a ON e.id = a.emp_id AND a.date BETWEEN ? AND ?
    `, [startDate, endDate]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
