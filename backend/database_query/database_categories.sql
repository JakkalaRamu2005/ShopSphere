-- ============================================
-- CATEGORIES TABLE SETUP
-- ============================================
-- This script creates the categories table and inserts FakeStore API categories

-- ============================================
-- 1. CREATE CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    item_count INT DEFAULT 0,
    image TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. INSERT FAKESTORE API CATEGORIES
-- ============================================
-- These are the 4 main categories from FakeStore API
INSERT INTO categories (name, item_count, description) VALUES
('electronics', 6, 'Electronic devices, gadgets, and accessories'),
('jewelery', 4, 'Jewelry items including rings, necklaces, and bracelets'),
('men''s clothing', 8, 'Clothing and fashion items for men'),
('women''s clothing', 7, 'Clothing and fashion items for women')
ON DUPLICATE KEY UPDATE 
    item_count = VALUES(item_count),
    description = VALUES(description),
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 3. VERIFICATION QUERIES
-- ============================================
-- Check if categories were inserted
-- SELECT * FROM categories;

-- Count total categories
-- SELECT COUNT(*) as total_categories FROM categories;

-- ============================================
-- 4. UPDATE PRODUCTS TABLE (Optional)
-- ============================================
-- If you want to add a foreign key relationship between products and categories
-- Uncomment the following if needed:

-- ALTER TABLE products 
-- ADD COLUMN category_id INT DEFAULT NULL,
-- ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
-- ADD INDEX idx_category_id (category_id);

-- ============================================
-- END OF SCRIPT
-- ============================================
