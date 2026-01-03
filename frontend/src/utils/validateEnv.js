/**
 * Environment Variable Validation
 * Validates required environment variables on app startup
 */

const requiredEnvVars = [
    'VITE_API_URL',
];

const optionalEnvVars = [
    'VITE_GOOGLE_CLIENT_ID',
    'VITE_RAZORPAY_KEY_ID',
];

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnv() {
    const missing = [];
    const warnings = [];

    // Check required variables
    requiredEnvVars.forEach((varName) => {
        if (!import.meta.env[varName]) {
            missing.push(varName);
        }
    });

    // Check optional variables (warnings only)
    optionalEnvVars.forEach((varName) => {
        if (!import.meta.env[varName]) {
            warnings.push(varName);
        }
    });

    // Log warnings for optional variables
    if (warnings.length > 0) {
        console.warn(
            '⚠️ Optional environment variables not set:',
            warnings.join(', ')
        );
        console.warn('Some features may not work correctly.');
    }

    // Throw error for missing required variables
    if (missing.length > 0) {
        const errorMessage = `
❌ Missing required environment variables:
${missing.map((v) => `  - ${v}`).join('\n')}

Please create a .env file in the frontend directory with these variables.
Example .env file:

VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key
    `.trim();

        throw new Error(errorMessage);
    }

    console.log('✅ Environment variables validated successfully');
}

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value if not set
 * @returns {string} Environment variable value or fallback
 */
export function getEnv(key, fallback = '') {
    return import.meta.env[key] || fallback;
}

/**
 * Check if running in development mode
 * @returns {boolean}
 */
export function isDevelopment() {
    return import.meta.env.DEV;
}

/**
 * Check if running in production mode
 * @returns {boolean}
 */
export function isProduction() {
    return import.meta.env.PROD;
}

export default {
    validateEnv,
    getEnv,
    isDevelopment,
    isProduction,
};
