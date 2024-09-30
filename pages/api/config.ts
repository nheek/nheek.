import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create a MySQL pool using environment variables
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT),
});

export default pool;
