-- Database initialization script
-- This file will be executed when PostgreSQL container starts for the first time

-- Create database if not exists (this is usually handled by POSTGRES_DB env var)
-- CREATE DATABASE IF NOT EXISTS bills_db;

-- Switch to bills_db
\c bills_db;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample data (optional)
-- You can add initial data here if needed

-- Example: Create an admin user
-- INSERT INTO users (username, password, firstName, lastName, role, "createdAt", "updatedAt") 
-- VALUES ('admin', '$2b$10$example.hash.here', 'Admin', 'User', 'admin', NOW(), NOW())
-- ON CONFLICT (username) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE bills_db TO bills_user;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    role VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    amount VARCHAR(255),
    status VARCHAR(50),
    create_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bill_logs (
    id SERIAL PRIMARY KEY,
    billId INTEGER REFERENCES bills(id) ON DELETE CASCADE,
    action VARCHAR(50),
    userId INTEGER REFERENCES users(id) ON DELETE SET NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    note TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bill_followers (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER REFERENCES bills(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
