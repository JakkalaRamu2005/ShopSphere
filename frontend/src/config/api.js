// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Export both as default and named export for flexibility
export { API_BASE_URL };
export default API_BASE_URL;
