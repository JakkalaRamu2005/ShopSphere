-- ============================================
-- E-Commerce Database Setup Script
-- ============================================
-- This script creates all necessary tables for the e-commerce application
-- Execute this script in your MySQL database to set up the schema

-- ============================================
-- 1. USERS TABLE
-- ============================================
-- Stores user authentication and profile information
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. CART TABLE
-- ============================================
-- Stores shopping cart items for each user
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT,
    category VARCHAR(255),
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    UNIQUE KEY unique_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. WISHLIST TABLE
-- ============================================
-- Stores wishlist items for each user
CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    UNIQUE KEY unique_user_wishlist_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ORDERS TABLE
-- ============================================
-- Stores order information
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address JSON NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_status (order_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. ORDER_ITEMS TABLE
-- ============================================
-- Stores individual items within each order
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these queries after table creation to verify the setup

-- Show all tables
-- SHOW TABLES;

-- Describe each table structure
-- DESCRIBE users;
-- DESCRIBE cart;
-- DESCRIBE wishlist;
-- DESCRIBE orders;
-- DESCRIBE order_items;

-- Check table counts (should be 0 initially)
-- SELECT COUNT(*) as user_count FROM users;
-- SELECT COUNT(*) as cart_count FROM cart;
-- SELECT COUNT(*) as wishlist_count FROM wishlist;
-- SELECT COUNT(*) as orders_count FROM orders;
-- SELECT COUNT(*) as order_items_count FROM order_items;

-- ============================================
-- SAMPLE TEST DATA (OPTIONAL)
-- ============================================
-- Uncomment the following to insert test data

-- Insert a test user (password is hashed version of "test123")
-- INSERT INTO users (name, email, password) VALUES 
-- ('Test User', 'test@example.com', '$2b$10$YourHashedPasswordHere');

-- ============================================
-- CLEANUP QUERIES (USE WITH CAUTION)
-- ============================================
-- Uncomment these only if you need to drop all tables and start fresh

-- DROP TABLE IF EXISTS order_items;
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS wishlist;
-- DROP TABLE IF EXISTS cart;
-- DROP TABLE IF EXISTS users;

-- ============================================
-- END OF SCRIPT
-- ============================================
