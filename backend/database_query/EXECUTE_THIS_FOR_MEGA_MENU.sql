-- ============================================
-- QUICK SETUP - Execute this in your database
-- ============================================
-- Copy and paste this entire script into your MySQL client
-- (phpMyAdmin, MySQL Workbench, or command line)

USE test; -- Change 'test' to your database name if different

-- Step 1: Add new columns to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS parent_id INT DEFAULT NULL AFTER id,
ADD COLUMN IF NOT EXISTS icon_url VARCHAR(500) DEFAULT NULL AFTER image,
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0 AFTER icon_url,
ADD COLUMN IF NOT EXISTS show_in_menu BOOLEAN DEFAULT TRUE AFTER display_order;

-- Step 2: Add foreign key constraint
ALTER TABLE categories 
ADD CONSTRAINT fk_parent_category 
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;

-- Step 3: Insert main categories
INSERT INTO categories (name, description, icon_url, display_order, show_in_menu, parent_id) VALUES
('Electronics', 'Electronic devices and accessories', 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png', 1, TRUE, NULL),
('Fashion', 'Clothing and fashion accessories', 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png', 2, TRUE, NULL),
('Home & Furniture', 'Home decor and furniture', 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png', 3, TRUE, NULL),
('Beauty', 'Beauty and personal care products', 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', 4, TRUE, NULL),
('Grocery', 'Food and grocery items', 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png', 5, TRUE, NULL),
('Mobiles & Tablets', 'Smartphones and tablets', 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png', 6, TRUE, NULL)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    icon_url = VALUES(icon_url),
    display_order = VALUES(display_order);

-- Step 4: Insert Electronics subcategories
SET @electronics_id = (SELECT id FROM categories WHERE name = 'Electronics' AND parent_id IS NULL LIMIT 1);

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Audio', 'Audio devices and accessories', @electronics_id, 1, TRUE),
('Cameras & Accessories', 'Cameras and photography equipment', @electronics_id, 2, TRUE),
('Gaming', 'Gaming consoles and accessories', @electronics_id, 3, TRUE),
('Laptop Accessories', 'Laptop bags, chargers, and accessories', @electronics_id, 4, TRUE)
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Step 5: Insert Audio sub-subcategories
SET @audio_id = (SELECT id FROM categories WHERE name = 'Audio' AND parent_id = @electronics_id LIMIT 1);

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Bluetooth Headphones', 'Wireless Bluetooth headphones', @audio_id, 1, TRUE),
('Wired Headphones', 'Wired headphones and earphones', @audio_id, 2, TRUE),
('True Wireless Earbuds', 'TWS earbuds', @audio_id, 3, TRUE),
('Bluetooth Speakers', 'Portable Bluetooth speakers', @audio_id, 4, TRUE)
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Step 6: Insert Fashion subcategories
SET @fashion_id = (SELECT id FROM categories WHERE name = 'Fashion' AND parent_id IS NULL LIMIT 1);

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Men\'s Clothing', 'Men\'s fashion and clothing', @fashion_id, 1, TRUE),
('Women\'s Clothing', 'Women\'s fashion and clothing', @fashion_id, 2, TRUE),
('Footwear', 'Shoes and sandals', @fashion_id, 3, TRUE),
('Watches', 'Wrist watches', @fashion_id, 4, TRUE),
('Jewellery', 'Fashion jewellery and accessories', @fashion_id, 5, TRUE)
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Step 7: Insert Men's Clothing sub-subcategories
SET @mens_clothing_id = (SELECT id FROM categories WHERE name = 'Men\'s Clothing' AND parent_id = @fashion_id LIMIT 1);

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('T-Shirts', 'Men\'s t-shirts', @mens_clothing_id, 1, TRUE),
('Shirts', 'Men\'s formal and casual shirts', @mens_clothing_id, 2, TRUE),
('Jeans', 'Men\'s jeans and denim', @mens_clothing_id, 3, TRUE),
('Jackets', 'Men\'s jackets and coats', @mens_clothing_id, 4, TRUE)
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Step 8: Verify the setup
SELECT 
    c1.id,
    c1.name AS category,
    c2.name AS parent_category,
    c1.icon_url,
    c1.display_order,
    c1.show_in_menu
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
ORDER BY c1.parent_id, c1.display_order;

-- Done! Your mega menu database is ready.
-- Now restart your backend server if it's running.
