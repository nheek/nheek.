import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create a PostgreSQL pool using environment variables
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database successfully');
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error('Error connecting to PostgreSQL database', error);
  }
};

testConnection();
