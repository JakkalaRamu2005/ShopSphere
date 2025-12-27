-- ============================================
-- ADMIN DASHBOARD DATABASE SETUP
-- ============================================
-- This script adds admin functionality to the e-commerce application

-- ============================================
-- 1. UPDATE USERS TABLE - Add role and status
-- ============================================
-- ALTER TABLE users 
-- ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user',
-- ADD COLUMN IF NOT EXISTS status ENUM('active', 'blocked') DEFAULT 'active',
-- ADD INDEX idx_role (role),
-- ADD INDEX idx_status (status);

ALTER TABLE users
ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user',
ADD COLUMN status ENUM('active', 'blocked') DEFAULT 'active';

ALTER TABLE users ADD INDEX idx_role (role);
ALTER TABLE users ADD INDEX idx_status (status);

-- ============================================
-- 2. PRODUCTS TABLE (Custom Products)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255),
    image TEXT,
    stock INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. CREATE DEFAULT ADMIN USER
-- ============================================
-- Password: admin123 (hashed with bcrypt)
-- You should change this password after first login
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@shopease.com', '$2b$10$4x3dlphos9N6UH0FqEgs6eQjRB2HLRz9UkyNw9Z/cJwjhbvsZBPay', 'admin')
ON DUPLICATE KEY UPDATE role = 'admin';

-- Note: You need to hash the password using bcrypt before inserting
-- Use this Node.js code to generate the hash:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('admin123', 10);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Check if role column was added
-- DESCRIBE users;

-- Check products table
-- DESCRIBE products;

-- View admin users
-- SELECT id, name, email, role FROM users WHERE role = 'admin';
