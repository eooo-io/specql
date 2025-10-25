-- MySQL initialization script for specql development
-- This script runs automatically when the container is first created

USE specql_dev;

-- Set default character set and collation
ALTER DATABASE specql_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Example: Create a simple test table
CREATE TABLE IF NOT EXISTS health_check (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO health_check (message) VALUES ('MySQL initialized successfully');

-- Create test database
CREATE DATABASE IF NOT EXISTS specql_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON specql_test.* TO 'specql'@'%';

FLUSH PRIVILEGES;

SELECT 'specql MySQL database initialized' AS status;
