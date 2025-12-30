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
const app = express();
app.use(cookieParser());
app.use(
    express.json()
)

// CORS Configuration for Development
// ---- CORS SETUP ---- //
const FRONTEND_URL = process.env.FRONTEND_URL; // your live frontend
const EXTRA_FRONTEND_URL = process.env.EXTRA_FRONTEND_URL; // optional extra

const allowedOrigins = [
  FRONTEND_URL,
  EXTRA_FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean); // remove empty values

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / same origin

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`❌ Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Apply CORS to all routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));



app.use(express.urlencoded({ extended: true }));
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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`)
})

