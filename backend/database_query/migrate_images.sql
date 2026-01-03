-- Step 1: Migrate existing data from image to images column
UPDATE products 
SET images = JSON_ARRAY(image) 
WHERE images IS NULL AND image IS NOT NULL;

-- Step 2: Drop the old image column
ALTER TABLE products 
DROP COLUMN image;
