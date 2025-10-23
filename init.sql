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
