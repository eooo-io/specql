-- MSSQL initialization script for specql development
-- This script runs automatically when the container is first created

-- Create database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'specql_dev')
BEGIN
    CREATE DATABASE specql_dev;
END
GO

USE specql_dev;
GO

-- Example: Create a simple test table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'health_check')
BEGIN
    CREATE TABLE health_check (
        id INT IDENTITY(1,1) PRIMARY KEY,
        message NVARCHAR(255) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
END
GO

INSERT INTO health_check (message) VALUES ('MSSQL initialized successfully');
GO

-- Create test database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'specql_test')
BEGIN
    CREATE DATABASE specql_test;
END
GO

PRINT 'specql MSSQL database initialized';
GO
