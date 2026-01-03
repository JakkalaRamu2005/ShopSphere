-- ============================================
-- MEGA MENU DATABASE SETUP
-- ============================================
-- This script updates the categories table to support nested mega menu structure

-- ============================================
-- 1. ADD PARENT_ID COLUMN FOR NESTED CATEGORIES
-- ============================================
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS parent_id INT DEFAULT NULL AFTER id,
ADD COLUMN IF NOT EXISTS icon_url VARCHAR(500) DEFAULT NULL AFTER image,
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0 AFTER icon_url,
ADD COLUMN IF NOT EXISTS show_in_menu BOOLEAN DEFAULT TRUE AFTER display_order,
ADD FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;

-- ============================================
-- 2. CLEAR EXISTING CATEGORIES (OPTIONAL - COMMENT OUT IF YOU WANT TO KEEP EXISTING DATA)
-- ============================================
-- TRUNCATE TABLE categories;

-- ============================================
-- 3. INSERT MAIN CATEGORIES (TOP LEVEL)
-- ============================================
INSERT INTO categories (name, description, icon_url, display_order, show_in_menu, parent_id) VALUES
('Electronics', 'Electronic devices and accessories', 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png', 1, TRUE, NULL),
('Fashion', 'Clothing and fashion accessories', 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png', 2, TRUE, NULL),
('Home & Furniture', 'Home decor and furniture', 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png', 3, TRUE, NULL),
('Beauty', 'Beauty and personal care products', 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', 4, TRUE, NULL),
('Grocery', 'Food and grocery items', 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png', 5, TRUE, NULL),
('Mobiles & Tablets', 'Smartphones and tablets', 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png', 6, TRUE, NULL),
('Sports & Fitness', 'Sports equipment and fitness gear', 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png', 7, TRUE, NULL),
('Toys & Games', 'Toys and gaming products', 'https://cdn-icons-png.flaticon.com/512/3050/3050426.png', 8, TRUE, NULL)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    icon_url = VALUES(icon_url),
    display_order = VALUES(display_order);

-- ============================================
-- 4. INSERT ELECTRONICS SUBCATEGORIES (LEVEL 1)
-- ============================================
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Audio', 'Audio devices and accessories', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Electronics' AND parent_id IS NULL) AS temp), 1, TRUE),
('Cameras & Accessories', 'Cameras and photography equipment', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Electronics' AND parent_id IS NULL) AS temp), 2, TRUE),
('Gaming', 'Gaming consoles and accessories', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Electronics' AND parent_id IS NULL) AS temp), 3, TRUE),
('Laptop Accessories', 'Laptop bags, chargers, and accessories', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Electronics' AND parent_id IS NULL) AS temp), 4, TRUE),
('Smart Home Automation', 'Smart home devices', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Electronics' AND parent_id IS NULL) AS temp), 5, TRUE),
('Wearable Technology', 'Smartwatches and fitness trackers', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Electronics' AND parent_id IS NULL) AS temp), 6, TRUE)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    display_order = VALUES(display_order);

-- ============================================
-- 5. INSERT AUDIO SUBCATEGORIES (LEVEL 2)
-- ============================================
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Bluetooth Headphones', 'Wireless Bluetooth headphones', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL) AS temp), 1, TRUE),
('Wired Headphones', 'Wired headphones and earphones', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL) AS temp), 2, TRUE),
('True Wireless Earbuds', 'TWS earbuds', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL) AS temp), 3, TRUE),
('Bluetooth Speakers', 'Portable Bluetooth speakers', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL) AS temp), 4, TRUE),
('Soundbars', 'Home theater soundbars', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL) AS temp), 5, TRUE)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    display_order = VALUES(display_order);

-- ============================================
-- 6. INSERT FASHION SUBCATEGORIES (LEVEL 1)
-- ============================================
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Men\'s Clothing', 'Men\'s fashion and clothing', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Fashion' AND parent_id IS NULL) AS temp), 1, TRUE),
('Women\'s Clothing', 'Women\'s fashion and clothing', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Fashion' AND parent_id IS NULL) AS temp), 2, TRUE),
('Footwear', 'Shoes and sandals', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Fashion' AND parent_id IS NULL) AS temp), 3, TRUE),
('Watches', 'Wrist watches', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Fashion' AND parent_id IS NULL) AS temp), 4, TRUE),
('Bags & Luggage', 'Bags, backpacks, and luggage', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Fashion' AND parent_id IS NULL) AS temp), 5, TRUE),
('Jewellery', 'Fashion jewellery and accessories', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Fashion' AND parent_id IS NULL) AS temp), 6, TRUE)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    display_order = VALUES(display_order);

-- ============================================
-- 7. INSERT MEN'S CLOTHING SUBCATEGORIES (LEVEL 2)
-- ============================================
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('T-Shirts', 'Men\'s t-shirts', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Men\'s Clothing' AND parent_id IS NOT NULL) AS temp), 1, TRUE),
('Shirts', 'Men\'s formal and casual shirts', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Men\'s Clothing' AND parent_id IS NOT NULL) AS temp), 2, TRUE),
('Jeans', 'Men\'s jeans and denim', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Men\'s Clothing' AND parent_id IS NOT NULL) AS temp), 3, TRUE),
('Jackets', 'Men\'s jackets and coats', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Men\'s Clothing' AND parent_id IS NOT NULL) AS temp), 4, TRUE),
('Ethnic Wear', 'Men\'s ethnic and traditional wear', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Men\'s Clothing' AND parent_id IS NOT NULL) AS temp), 5, TRUE)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    display_order = VALUES(display_order);

-- ============================================
-- 8. INSERT WOMEN'S CLOTHING SUBCATEGORIES (LEVEL 2)
-- ============================================
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Dresses', 'Women\'s dresses', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Women\'s Clothing' AND parent_id IS NOT NULL) AS temp), 1, TRUE),
('Tops & Tunics', 'Women\'s tops and tunics', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Women\'s Clothing' AND parent_id IS NOT NULL) AS temp), 2, TRUE),
('Sarees', 'Traditional sarees', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Women\'s Clothing' AND parent_id IS NOT NULL) AS temp), 3, TRUE),
('Kurtas & Kurtis', 'Ethnic kurtas and kurtis', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Women\'s Clothing' AND parent_id IS NOT NULL) AS temp), 4, TRUE),
('Western Wear', 'Women\'s western wear', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Women\'s Clothing' AND parent_id IS NOT NULL) AS temp), 5, TRUE)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    display_order = VALUES(display_order);

-- ============================================
-- 9. INSERT HOME & FURNITURE SUBCATEGORIES
-- ============================================
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Living Room Furniture', 'Sofas, tables, and living room items', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Home & Furniture' AND parent_id IS NULL) AS temp), 1, TRUE),
('Bedroom Furniture', 'Beds, wardrobes, and bedroom items', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Home & Furniture' AND parent_id IS NULL) AS temp), 2, TRUE),
('Kitchen & Dining', 'Kitchen furniture and dining sets', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Home & Furniture' AND parent_id IS NULL) AS temp), 3, TRUE),
('Home Decor', 'Decorative items and accessories', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Home & Furniture' AND parent_id IS NULL) AS temp), 4, TRUE),
('Lighting', 'Lamps and lighting solutions', (SELECT id FROM (SELECT id FROM categories WHERE name = 'Home & Furniture' AND parent_id IS NULL) AS temp), 5, TRUE)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    display_order = VALUES(display_order);

-- ============================================
-- 10. VERIFICATION QUERIES
-- ============================================
-- View all categories with their parent relationships
-- SELECT c1.id, c1.name, c1.parent_id, c2.name as parent_name, c1.display_order
-- FROM categories c1
-- LEFT JOIN categories c2 ON c1.parent_id = c2.id
-- ORDER BY c1.parent_id, c1.display_order;

-- View category hierarchy
-- SELECT 
--     c1.name AS main_category,
--     c2.name AS subcategory,
--     c3.name AS sub_subcategory
-- FROM categories c1
-- LEFT JOIN categories c2 ON c2.parent_id = c1.id
-- LEFT JOIN categories c3 ON c3.parent_id = c2.id
-- WHERE c1.parent_id IS NULL
-- ORDER BY c1.display_order, c2.display_order, c3.display_order;

-- ============================================
-- END OF SCRIPT
-- ============================================
