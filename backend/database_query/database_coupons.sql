-- ============================================
-- COUPON/DISCOUNT SYSTEM DATABASE SETUP
-- ============================================

CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add coupon_code column to orders table
ALTER TABLE orders
ADD COLUMN coupon_code VARCHAR(50),
ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0;

-- Sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, is_active)
VALUES 
('WELCOME10', '10% off on first order', 'percentage', 10, 500, TRUE),
('SAVE100', 'Flat ₹100 off', 'fixed', 100, 1000, TRUE),
('MEGA20', '20% off on orders above ₹2000', 'percentage', 20, 2000, TRUE);
