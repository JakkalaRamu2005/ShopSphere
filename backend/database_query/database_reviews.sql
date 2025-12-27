-- ============================================
-- PRODUCT REVIEWS & RATINGS TABLE
-- ============================================
-- This script creates the reviews table for the product review system
-- Execute this script in your MySQL database after running database_setup.sql

-- ============================================
-- REVIEWS TABLE
-- ============================================
-- Stores product reviews and ratings from users
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating),
    UNIQUE KEY unique_user_product_review (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these queries after table creation to verify the setup

-- Show table structure
-- DESCRIBE reviews;

-- Check table count (should be 0 initially)
-- SELECT COUNT(*) as review_count FROM reviews;

-- ============================================
-- END OF SCRIPT
-- ============================================
