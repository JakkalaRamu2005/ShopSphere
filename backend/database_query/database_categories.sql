-- ============================================
-- CATEGORIES TABLE SETUP
-- ============================================
-- This script creates the categories table and inserts API categories

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
-- 2. INSERT API CATEGORIES
-- ============================================
INSERT INTO categories (name, item_count, description) VALUES
('beauty', 5, 'Beauty products'),
('fragrances', 5, 'Fragrances products'),
('furniture', 5, 'Furniture products'),
('groceries', 27, 'Groceries products'),
('home-decoration', 5, 'Home Decoration products'),
('kitchen-accessories', 30, 'Kitchen Accessories products'),
('laptops', 5, 'Laptops products'),
('mens-shirts', 5, 'Mens Shirts products'),
('mens-shoes', 5, 'Mens Shoes products'),
('mens-watches', 6, 'Mens Watches products'),
('mobile-accessories', 14, 'Mobile Accessories products'),
('motorcycle', 5, 'Motorcycle products'),
('skin-care', 3, 'Skin Care products'),
('smartphones', 16, 'Smartphones products'),
('sports-accessories', 17, 'Sports Accessories products'),
('sunglasses', 5, 'Sunglasses products'),
('tablets', 3, 'Tablets products'),
('tops', 5, 'Tops products'),
('vehicle', 5, 'Vehicle products'),
('womens-bags', 5, 'Womens Bags products'),
('womens-dresses', 5, 'Womens Dresses products'),
('womens-jewellery', 3, 'Womens Jewellery products'),
('womens-shoes', 5, 'Womens Shoes products'),
('womens-watches', 5, 'Womens Watches products')
ON DUPLICATE KEY UPDATE 
    item_count = item_count + VALUES(item_count),
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 3. VERIFICATION QUERIES
-- ============================================
-- Check if categories were inserted
-- SELECT * FROM categories;

-- Count total categories
-- SELECT COUNT(*) as total_categories FROM categories;

-- ============================================
-- END OF SCRIPT
-- ============================================
