const db = require('./config/db');
const bcrypt = require('bcryptjs');

module.exports = async () => { 
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@crc.com']);
    
    if (existing.length === 0) {
      await db.query(
        'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        ['Super Admin', 'admin@crc.com', hashedPassword, 'admin', 'approved']
      );
      console.log('Admin user seeded: admin@crc.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

// seedAdmin();
