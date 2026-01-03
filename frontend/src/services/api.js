import axios from 'axios';

/**
 * Centralized API Service
 * Handles all HTTP requests with interceptors for auth, errors, and loading states
 */

// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        // Return data directly for successful responses
        return response.data;
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    // Forbidden
                    console.error('Access forbidden:', data.message);
                    break;

                case 404:
                    // Not found
                    console.error('Resource not found:', data.message);
                    break;

                case 500:
                    // Server error
                    console.error('Server error:', data.message);
                    break;

                default:
                    console.error('API Error:', data.message || 'Unknown error');
            }

            // Return structured error
            return Promise.reject({
                status,
                message: data.message || 'An error occurred',
                data: data,
            });
        } else if (error.request) {
            // Request made but no response received
            return Promise.reject({
                status: 0,
                message: 'Network error. Please check your connection.',
                data: null,
            });
        } else {
            // Something else happened
            return Promise.reject({
                status: 0,
                message: error.message || 'An unexpected error occurred',
                data: null,
            });
        }
    }
);

/**
 * API Service Methods
 */

// Auth Services
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    googleLogin: (token) => api.post('/auth/google', { token }),
    phoneLogin: (phoneData) => api.post('/auth/phone-login', phoneData),
    verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
    getCurrentUser: () => api.get('/auth/me'),
};

// Product Services
export const productService = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (productData) => api.post('/products', productData),
    update: (id, productData) => api.put(`/products/${id}`, productData),
    delete: (id) => api.delete(`/products/${id}`),
    search: (query) => api.get('/products/search', { params: { q: query } }),
};

// Category Services
export const categoryService = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    getProducts: (categoryId) => api.get(`/categories/${categoryId}/products`),
};

// Cart Services
export const cartService = {
    get: () => api.get('/cart'),
    add: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
    update: (productId, quantity) => api.put('/cart', { productId, quantity }),
    remove: (productId) => api.delete(`/cart/${productId}`),
    clear: () => api.delete('/cart'),
};

// Wishlist Services
export const wishlistService = {
    get: () => api.get('/wishlist'),
    add: (productId) => api.post('/wishlist', { productId }),
    remove: (productId) => api.delete(`/wishlist/${productId}`),
    check: (productId) => api.get(`/wishlist/check/${productId}`),
};

// Order Services
export const orderService = {
    create: (orderData) => api.post('/orders', orderData),
    getAll: () => api.get('/orders'),
    getById: (orderId) => api.get(`/orders/${orderId}`),
    updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
    cancel: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

// Checkout Services
export const checkoutService = {
    validateCart: () => api.post('/checkout/validate'),
    applyCoupon: (code) => api.post('/checkout/coupon', { code }),
    calculateTotal: (data) => api.post('/checkout/calculate', data),
};

// Payment Services
export const paymentService = {
    createOrder: (amount) => api.post('/payment/create-order', { amount }),
    verifyPayment: (paymentData) => api.post('/payment/verify', paymentData),
    getStatus: (orderId) => api.get(`/payment/status/${orderId}`),
};

// Review Services
export const reviewService = {
    getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
    create: (reviewData) => api.post('/reviews', reviewData),
    update: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
    delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Address Services
export const addressService = {
    getAll: () => api.get('/address'),
    create: (addressData) => api.post('/address', addressData),
    update: (addressId, addressData) => api.put(`/address/${addressId}`, addressData),
    delete: (addressId) => api.delete(`/address/${addressId}`),
    setDefault: (addressId) => api.put(`/address/${addressId}/default`),
};

// Admin Services
export const adminService = {
    // Users
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

    // Products
    getProducts: (params) => api.get('/admin/products', { params }),
    createProduct: (productData) => api.post('/admin/products', productData),
    updateProduct: (productId, productData) => api.put(`/admin/products/${productId}`, productData),
    deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),

    // Orders
    getOrders: (params) => api.get('/admin/orders', { params }),
    updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),

    // Dashboard
    getStats: () => api.get('/admin/stats'),
};

// Chatbot Services
export const chatbotService = {
    sendMessage: (message) => api.post('/chatbot', { message }),
};

// Coupon Services
export const couponService = {
    validate: (code) => api.post('/coupon/validate', { code }),
    apply: (code, cartTotal) => api.post('/coupon/apply', { code, cartTotal }),
};

// Export the base API instance for custom requests
export default api;

// Export API_BASE_URL for direct fetch calls if needed
export { API_BASE_URL };
