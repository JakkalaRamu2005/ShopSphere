const dotenv = require('dotenv');
dotenv.config();

/**
 * Send SMS using Fast2SMS
 * @param {string} phoneNumber - Recipient phone number (including country code)
 * @param {string} message - Message content
 * @returns {Promise<any>} - API response
 */
async function sendSMS(phoneNumber, message) {
    const fast2smsApiKey = process.env.Fast2SMS_API_KEY;

    // Fast2SMS API implementation
    // Cleaning phone number (removing +91 or +)
    const mobile = phoneNumber.replace(/^\+91|^\+/, '');

    // Extract 6-digit OTP from the message using regex
    const otpMatch = message.match(/\b\d{6}\b/);

    if (!otpMatch) {
        console.error('[SMS Service] Could not extract OTP from message');
        throw new Error('Invalid OTP format for Fast2SMS');
    }

    const otp = otpMatch[0];

    console.log(`[SMS Service] Sending OTP via Fast2SMS to ${mobile}...`);

    try {
        // Fast2SMS OTP route
        // authorization: API Key
        // route: 'otp'
        // variables_values: The OTP code itself
        // numbers: Comma separated numbers
        // flash: 0 (normal SMS)
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsApiKey}&route=otp&variables_values=${otp}&flash=0&numbers=${mobile}`;

        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();

        console.log('[SMS Service] Fast2SMS Response:', JSON.stringify(data));

        // Fast2SMS success response usually has "return": true
        if (data.return === false) {
            console.error('[SMS Service] Fast2SMS Error:', data);
            throw new Error(data.message || 'Fast2SMS Provider Error');
        }

        return data;
    } catch (error) {
        console.error('[SMS Service] System Error:', error.message);
        throw new Error(error.message || 'Failed to send SMS');
    }
}

module.exports = { sendSMS };
