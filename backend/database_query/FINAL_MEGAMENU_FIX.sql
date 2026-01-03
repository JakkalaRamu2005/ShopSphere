-- ============================================
-- MEGA MENU FINAL FIX - Handles duplicates
-- Execute this entire script
-- ============================================

USE test;

-- Step 1: First, let's clean up - delete all mega menu related categories
DELETE FROM categories WHERE show_in_menu = 1;
DELETE FROM categories WHERE icon_url IS NOT NULL;
DELETE FROM categories WHERE name IN (
    'Electronics', 'Fashion', 'Home & Furniture', 'Beauty Products', 'Grocery Store', 'Mobiles & Tablets',
    'Audio', 'Cameras & Accessories', 'Gaming', 'Laptop Accessories',
    'Bluetooth Headphones', 'Wired Headphones', 'True Wireless Earbuds', 'Bluetooth Speakers',
    'Mens Clothing', 'Womens Clothing', 'Footwear', 'Watches',
    'T-Shirts', 'Shirts', 'Jeans', 'Jackets'
);

-- Step 2: Set all remaining categories to NOT show in menu
UPDATE categories SET show_in_menu = 0;

-- Step 3: Insert main categories with icons
INSERT INTO categories (name, description, icon_url, display_order, show_in_menu, parent_id) VALUES
('Electronics', 'Electronic devices and accessories', 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png', 1, 1, NULL),
('Fashion', 'Clothing and fashion accessories', 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png', 2, 1, NULL),
('Home & Furniture', 'Home decor and furniture', 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png', 3, 1, NULL),
('Beauty Products', 'Beauty and personal care', 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', 4, 1, NULL),
('Grocery Store', 'Food and grocery items', 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png', 5, 1, NULL),
('Mobiles & Tablets', 'Smartphones and tablets', 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png', 6, 1, NULL);

-- Step 4: Get Electronics ID and insert subcategories
SET @electronics_id = (SELECT id FROM categories WHERE name = 'Electronics' AND parent_id IS NULL ORDER BY id DESC LIMIT 1);

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Audio', 'Audio devices and accessories', @electronics_id, 1, 1),
('Cameras & Accessories', 'Cameras and photography', @electronics_id, 2, 1),
('Gaming', 'Gaming consoles and accessories', @electronics_id, 3, 1),
('Laptop Accessories', 'Laptop accessories', @electronics_id, 4, 1);

-- Step 5: Get Audio ID and insert sub-subcategories
SET @audio_id = (SELECT id FROM categories WHERE name = 'Audio' AND parent_id = @electronics_id ORDER BY id DESC LIMIT 1);

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Bluetooth Headphones', 'Wireless headphones', @audio_id, 1, 1),
('Wired Headphones', 'Wired headphones', @audio_id, 2, 1),
('True Wireless Earbuds', 'TWS earbuds', @audio_id, 3, 1),
('Bluetooth Speakers', 'Portable speakers', @audio_id, 4, 1);

-- Step 6: Get Fashion ID and insert subcategories
SET @fashion_id = (SELECT id FROM categories WHERE name = 'Fashion' AND parent_id IS NULL ORDER BY id DESC LIMIT 1);

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('Mens Clothing', 'Men fashion', @fashion_id, 1, 1),
('Womens Clothing', 'Women fashion', @fashion_id, 2, 1),
('Footwear', 'Shoes and sandals', @fashion_id, 3, 1),
('Watches', 'Wrist watches', @fashion_id, 4, 1);

-- Step 7: Get Mens Clothing ID and insert sub-subcategories
SET @mens_id = (SELECT id FROM categories WHERE name = 'Mens Clothing' AND parent_id = @fashion_id ORDER BY id DESC LIMIT 1);

INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
('T-Shirts', 'Mens t-shirts', @mens_id, 1, 1),
('Shirts', 'Mens shirts', @mens_id, 2, 1),
('Jeans', 'Mens jeans', @mens_id, 3, 1),
('Jackets', 'Mens jackets', @mens_id, 4, 1);

-- Step 8: Verify
SELECT 
    c1.id,
    c1.name AS category,
    c1.icon_url,
    c2.name AS parent,
    c1.display_order,
    c1.show_in_menu
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
WHERE c1.show_in_menu = 1
ORDER BY COALESCE(c1.parent_id, c1.id), c1.display_order;

-- Done! Refresh browser at http://localhost:5173
