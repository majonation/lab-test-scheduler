-- Create database if it doesn't exist
SELECT 'CREATE DATABASE taskdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskdb')\gexec

-- Connect to the database
\c taskdb;

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Grant privileges
ALTER USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE taskdb TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres; 