const db = require('./db');

async function migrate() {
    console.log('Starting migration...');
    try {
        // Add phoneNumber
        try {
            await db.query("ALTER TABLE users ADD COLUMN phoneNumber VARCHAR(15) UNIQUE");
            console.log("Added phoneNumber column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("phoneNumber column already exists");
            else console.error("Error adding phoneNumber:", e.message);
        }

        // Add otp
        try {
            await db.query("ALTER TABLE users ADD COLUMN otp VARCHAR(255)");
            console.log("Added otp column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("otp column already exists");
            else console.error("Error adding otp:", e.message);
        }

        // Add otpExpiry
        try {
            await db.query("ALTER TABLE users ADD COLUMN otpExpiry DATETIME");
            console.log("Added otpExpiry column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("otpExpiry column already exists");
            else console.error("Error adding otpExpiry:", e.message);
        }

        // Add otpAttempts
        try {
            await db.query("ALTER TABLE users ADD COLUMN otpAttempts INT DEFAULT 0");
            console.log("Added otpAttempts column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("otpAttempts column already exists");
            else console.error("Error adding otpAttempts:", e.message);
        }

        // Add isPhoneVerified
        try {
            await db.query("ALTER TABLE users ADD COLUMN isPhoneVerified BOOLEAN DEFAULT FALSE");
            console.log("Added isPhoneVerified column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("isPhoneVerified column already exists");
            else console.error("Error adding isPhoneVerified:", e.message);
        }

        // Add lastOtpRequest
        try {
            await db.query("ALTER TABLE users ADD COLUMN lastOtpRequest DATETIME");
            console.log("Added lastOtpRequest column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("lastOtpRequest column already exists");
            else console.error("Error adding lastOtpRequest:", e.message);
        }

        console.log("Migration completed.");
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
