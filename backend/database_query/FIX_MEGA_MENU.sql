-- ============================================
-- MEGA MENU FIX - Execute this to fix the categories
-- ============================================

USE test;

-- First, let's clear the broken data and start fresh
DELETE FROM categories WHERE parent_id IS NOT NULL OR icon_url IS NOT NULL;

-- Step 1: Insert MAIN categories with icons
INSERT INTO categories (name, description, icon_url, display_order, show_in_menu, parent_id) VALUES
('Electronics', 'Electronic devices and accessories', 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png', 1, 1, NULL),
('Fashion', 'Clothing and fashion accessories', 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png', 2, 1, NULL),
('Home & Furniture', 'Home decor and furniture', 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png', 3, 1, NULL),
('Beauty', 'Beauty and personal care products', 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', 4, 1, NULL),
('Grocery', 'Food and grocery items', 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png', 5, 1, NULL),
('Mobiles & Tablets', 'Smartphones and tablets', 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png', 6, 1, NULL);

-- Step 2: Get the IDs we just inserted
SELECT id, name FROM categories WHERE parent_id IS NULL AND icon_url IS NOT NULL ORDER BY id DESC LIMIT 6;

-- Now manually insert subcategories - REPLACE THE IDs BELOW with the actual IDs from the SELECT above

-- For Electronics (replace XXXXX with actual Electronics id)
-- INSERT INTO categories (name, description, parent_id, display_order, show_in_menu) VALUES
-- ('Audio', 'Audio devices', XXXXX, 1, 1),
-- ('Cameras', 'Cameras and accessories', XXXXX, 2, 1),
-- ('Gaming', 'Gaming products', XXXXX, 3, 1);

-- EASIER APPROACH: Let me create a version that works automatically
