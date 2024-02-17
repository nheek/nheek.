-- Create a database if it doesn't exist
CREATE DATABASE IF NOT EXISTS nheek;

-- Create a user and grant privileges
CREATE USER '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON nheek.* TO '${MYSQL_USER}'@'localhost';

-- Flush privileges to apply the changes immediately
FLUSH PRIVILEGES;

-- Use the created database
USE nheek;