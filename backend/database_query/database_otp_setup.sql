-- ============================================
-- PHONE OTP AUTHENTICATION SETUP
-- ============================================

ALTER TABLE users 
ADD COLUMN phoneNumber VARCHAR(15) UNIQUE,
ADD COLUMN otp VARCHAR(255),
ADD COLUMN otpExpiry DATETIME,
ADD COLUMN otpAttempts INT DEFAULT 0,
ADD COLUMN isPhoneVerified BOOLEAN DEFAULT FALSE,
ADD COLUMN lastOtpRequest DATETIME,
ADD INDEX idx_phoneNumber (phoneNumber);
