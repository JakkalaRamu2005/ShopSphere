import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './global.css'
import { API_BASE_URL } from './config/api'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
    console.error("VITE_GOOGLE_CLIENT_ID is missing! Please check your environment variables and redeploy.");
}

// Add global fetch interceptor to handle authentication headers
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    let [resource, config] = args;
    const token = localStorage.getItem('token');

    // Check if it's an API request (to our backend)
    // We check if the resource URL starts with our API_BASE_URL or is a relative path starting with /
    const isApiRequest = typeof resource === 'string' &&
        (resource.startsWith(API_BASE_URL) || resource.startsWith('/'));

    if (token && isApiRequest) {
        config = config || {};
        config.headers = config.headers || {};

        // Handle both Headers object and plain object
        if (config.headers instanceof Headers) {
            if (!config.headers.has('Authorization')) {
                config.headers.append('Authorization', `Bearer ${token}`);
            }
        } else if (Array.isArray(config.headers)) {
            const hasAuth = config.headers.some(([key]) => key.toLowerCase() === 'authorization');
            if (!hasAuth) {
                config.headers.push(['Authorization', `Bearer ${token}`]);
            }
        } else {
            if (!config.headers['Authorization'] && !config.headers['authorization']) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
    }
    return originalFetch(resource, config);
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
        </GoogleOAuthProvider>
    </StrictMode>
)
