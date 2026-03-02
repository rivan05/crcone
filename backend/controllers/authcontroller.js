const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const seedAdmin = require('../seed');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'pending']
    );

    res.json({ msg: 'Signup successful, waiting for admin approval' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  const [existing] = await db.query('SELECT * FROM users LIMIT 1');
    if (existing.length === 0) {
      seedAdmin();
  }

  const { email, password } = req.body;
  try {
    const [existingUsers] = await db.query('SELECT * FROM users  LIMIT 1');
    if (existingUsers.length === 0){
      seedAdmin(); // Ensure admin is seeded if not present
    }

   const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email])
   const user = users[0];
    if (user.status !== 'approved') return res.status(403).json({ msg: 'Account not approved' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ msg: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60000); // 10 mins

    await db.query('UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?', [otp, expiry, email]);
    
    // In real app, send email here. For now, return in response for debug.
    res.json({ msg: 'OTP sent to email', debug_otp: otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ? AND otp = ?', [email, otp]);
    if (users.length === 0) return res.status(400).json({ msg: 'Invalid OTP' });

    const user = users[0];
    if (new Date() > new Date(user.otp_expiry)) return res.status(400).json({ msg: 'OTP expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?', [hashedPassword, email]);

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
