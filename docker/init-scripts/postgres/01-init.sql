-- PostgreSQL initialization script for specql development
-- This script runs automatically when the container is first created

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a test schema (optional)
CREATE SCHEMA IF NOT EXISTS specql_test;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO specql;
GRANT ALL PRIVILEGES ON SCHEMA specql_test TO specql;

-- Example: Create a simple test table
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO health_check (message) VALUES ('PostgreSQL initialized successfully');

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'specql PostgreSQL database initialized';
END $$;
