-- Add isDeleted and rowVersion columns to Roles table
-- Run this against your funeral database

-- Add isDeleted column if it doesn't exist
ALTER TABLE Roles 
ADD COLUMN IF NOT EXISTS isDeleted TINYINT(1) NOT NULL DEFAULT 0;

-- Add RowVersion column if it doesn't exist
ALTER TABLE Roles 
ADD COLUMN IF NOT EXISTS RowVersion VARCHAR(255) NULL;

-- Verify columns were added
DESCRIBE Roles;
