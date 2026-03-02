const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const initDb = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
};

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testConnection = async () => {
  try {
    await initDb();
    const connection = await db.getConnection();
    console.log('MySQL connected successfully');
    connection.release();
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
};

testConnection();

module.exports = db;

