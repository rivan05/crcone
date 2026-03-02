const db = require('../config/db');

exports.getPendingUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE status = "pending"');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveUser = async (req, res) => {
  const { id, status, role } = req.body;
  try {
    await db.query('UPDATE users SET status = ?, role = ? WHERE id = ?', [status, role, id]);
    res.json({ msg: `User ${status} with role ${role}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*, u.name as changed_by_name 
      FROM history h 
      JOIN users u ON h.changed_by = u.id 
      ORDER BY h.created_at DESC 
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
