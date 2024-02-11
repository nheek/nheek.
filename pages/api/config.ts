import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Create a MySQL pool using environment variables
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT)
});

// Function to create table if it doesn't exist
const createTable = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ContactForm (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        subject VARCHAR(100),
        message TEXT
      )
    `);
    connection.release();
    console.log('ContactForm table created or already exists');
  } catch (error) {
    console.error('Error creating ContactForm table:', error);
  }
};

// Call the function to create the table
createTable();

export default pool;
