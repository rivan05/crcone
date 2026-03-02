const db = require('./db');

const initDB = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'viewer', 'employee') DEFAULT 'employee',
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        otp VARCHAR(6),
        otp_expiry DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Employees table
    await db.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        emp_name VARCHAR(100) NOT NULL,
        emp_code VARCHAR(50) UNIQUE NOT NULL,
        doj DATE NOT NULL,
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Attendance table
    await db.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        emp_id INT NOT NULL,
        date DATE NOT NULL,
        status ENUM('present', 'absent', 'SL', 'AL', 'HFDAL', 'UAL','weekoff') NOT NULL,
        reason VARCHAR(255),
        marked_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY emp_date (emp_id, date),
        FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY (marked_by) REFERENCES users(id)
      )
    `);

    // History table
    await db.query(`
      CREATE TABLE IF NOT EXISTS history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_name VARCHAR(50) NOT NULL,
        record_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        old_value TEXT,
        new_value TEXT,
        changed_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (changed_by) REFERENCES users(id)
      )
    `);

    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = initDB;
