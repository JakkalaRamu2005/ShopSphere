-- ============================================
-- PAYMENT INTEGRATION DATABASE SETUP
-- ============================================

-- Add payment columns to orders table
ALTER TABLE orders
ADD COLUMN payment_id VARCHAR(255),
ADD COLUMN payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
ADD COLUMN razorpay_order_id VARCHAR(255),
ADD COLUMN razorpay_payment_id VARCHAR(255),
ADD COLUMN razorpay_signature VARCHAR(255);

-- Create payments table for detailed payment history
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method VARCHAR(50),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
