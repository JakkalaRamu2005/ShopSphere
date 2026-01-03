const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require("./routes/wishlist");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment");
const addressRoutes = require("./routes/address");
const couponRoutes = require("./routes/coupon");
const chatbotRoutes = require("./routes/chatbot");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// CORS Configuration
const FRONTEND_URL = process.env.FRONTEND_URL;
const allowedOrigins = [
  FRONTEND_URL,
  'https://shopsphere-store.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

app.use(cors(corsOptions));

// Routes
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);
app.use("/address", addressRoutes);
app.use("/coupon", couponRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 Handler - must be after all routes
app.use(notFoundHandler);

// Error Handler - must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}/`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
