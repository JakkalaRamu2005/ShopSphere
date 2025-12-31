
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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
const app = express();
app.use(cookieParser());
app.use(
  express.json()
)

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
// app.use(bodyParser.json());
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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`)
})



