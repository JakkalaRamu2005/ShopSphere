-- ============================================
-- MEGA MENU COMPLETE FIX
-- Execute this entire script in one go
-- ============================================

USE test;

-- Step 1: Update existing categories to hide them from mega menu
UPDATE categories SET show_in_menu = 0 WHERE show_in_menu IS NULL OR show_in_menu = 1;

-- Step 2: Insert main categories with icons (these will be visible in mega menu)
INSERT INTO categories (name, description, icon_url, display_order, show_in_menu, parent_id) VALUES
('Electronics', 'Electronic devices and accessories', 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png', 1, 1, NULL),
('Fashion', 'Clothing and fashion accessories', 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png', 2, 1, NULL),
('Home & Furniture', 'Home decor and furniture', 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png', 3, 1, NULL),
('Beauty Products', 'Beauty and personal care', 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', 4, 1, NULL),
('Grocery Store', 'Food and grocery items', 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png', 5, 1, NULL),
('Mobiles & Tablets', 'Smartphones and tablets', 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png', 6, 1, NULL)
ON DUPLICATE KEY UPDATE 
    icon_url = VALUES(icon_url),
    display_order = VALUES(display_order),
    show_in_menu = VALUES(show_in_menu);

-- Step 3: Add subcategories for Electronics
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Audio', 'Audio devices and accessories', id, 1, 1 FROM categories WHERE name = 'Electronics' AND parent_id IS NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Cameras & Accessories', 'Cameras and photography', id, 2, 1 FROM categories WHERE name = 'Electronics' AND parent_id IS NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Gaming', 'Gaming consoles and accessories', id, 3, 1 FROM categories WHERE name = 'Electronics' AND parent_id IS NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Laptop Accessories', 'Laptop accessories', id, 4, 1 FROM categories WHERE name = 'Electronics' AND parent_id IS NULL LIMIT 1;

-- Step 4: Add sub-subcategories for Audio
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Bluetooth Headphones', 'Wireless headphones', id, 1, 1 FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Wired Headphones', 'Wired headphones', id, 2, 1 FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'True Wireless Earbuds', 'TWS earbuds', id, 3, 1 FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Bluetooth Speakers', 'Portable speakers', id, 4, 1 FROM categories WHERE name = 'Audio' AND parent_id IS NOT NULL LIMIT 1;

-- Step 5: Add subcategories for Fashion
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Mens Clothing', 'Men fashion', id, 1, 1 FROM categories WHERE name = 'Fashion' AND parent_id IS NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Womens Clothing', 'Women fashion', id, 2, 1 FROM categories WHERE name = 'Fashion' AND parent_id IS NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Footwear', 'Shoes and sandals', id, 3, 1 FROM categories WHERE name = 'Fashion' AND parent_id IS NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Watches', 'Wrist watches', id, 4, 1 FROM categories WHERE name = 'Fashion' AND parent_id IS NULL LIMIT 1;

-- Step 6: Add sub-subcategories for Men's Clothing
INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'T-Shirts', 'Mens t-shirts', id, 1, 1 FROM categories WHERE name = 'Mens Clothing' AND parent_id IS NOT NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Shirts', 'Mens shirts', id, 2, 1 FROM categories WHERE name = 'Mens Clothing' AND parent_id IS NOT NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Jeans', 'Mens jeans', id, 3, 1 FROM categories WHERE name = 'Mens Clothing' AND parent_id IS NOT NULL LIMIT 1;

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu)
SELECT 'Jackets', 'Mens jackets', id, 4, 1 FROM categories WHERE name = 'Mens Clothing' AND parent_id IS NOT NULL LIMIT 1;

-- Step 7: Verify the setup
SELECT 
    c1.id,
    c1.name AS category,
    c1.icon_url,
    c2.name AS parent_category,
    c1.display_order,
    c1.show_in_menu
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
WHERE c1.show_in_menu = 1
ORDER BY c1.parent_id, c1.display_order;

-- Done! Now refresh your browser at http://localhost:5173
