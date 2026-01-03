import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/variables.css";
import "./components/App.css";

// Environment Validation
import { validateEnv } from "./utils/validateEnv";

// Error Boundary
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AuthProvider from "./context/AuthContext";

// Layout
import MainLayout from "./components/layout/MainLayout/MainLayout";

// Auth Components
import Login from "./components/Login/Login";
import PhoneLogin from "./components/Login/PhoneLogin";
import Register from "./components/Register/Register";

// Pages
import Home from "./components/Home/Home";
import About from "./components/About/About";
import NotFound from "./components/NotFound/NotFound";

// Product Components
import Products from "./components/Products/Products";
import ProductDetails from "./components/ProductDetails/ProductDetails";

// Cart & Wishlist
import Cart from "./components/Cart/Cart";
import Wishlist from "./components/Wishlist/Wishlist";

// Checkout & Orders
import Checkout from "./components/Checkout/Checkout";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import OrderDetails from "./components/OrderDetails/OrderDetails";

// User Profile
import UserProfile from "./components/UserProfile/UserProfile";

// Admin Components
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminUsers from "./components/Admin/AdminUsers";

// Payment Components
import Payment from "./components/Payment/Payment";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import PaymentFailure from "./components/Payment/PaymentFailure";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// Footer Pages
import ShippingInfo from "./components/allfootercode/ShippingInfo/ShippingInfo";
import ReturnsRefunds from "./components/allfootercode/ReturnsRefunds/ReturnsRefunds";
import TrackOrder from "./components/allfootercode/TrackOrder/TrackOrder";
import SizeGuide from "./components/allfootercode/SizeGuide/SizeGuide";
import FAQ from "./components/allfootercode/FAQ/FAQ";
import ContactUs from "./components/allfootercode/ContactUs/ContactUs";
import AboutUs from "./components/allfootercode/AboutUs/AboutUs";
import Careers from "./components/allfootercode/Careers/Careers";
import Blog from "./components/allfootercode/Blog/Blog";
import PrivacyPolicy from "./components/allfootercode/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "./components/allfootercode/TermsConditions/TermsConditions";
import Sitemap from "./components/allfootercode/Sitemap/Sitemap";

// Validate environment variables on app load
try {
  validateEnv();
} catch (error) {
  console.error(error.message);
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                {/* Auth Routes - No Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/phone-login" element={<PhoneLogin />} />
                <Route path="/register" element={<Register />} />

                {/* Main Layout Routes */}
                <Route element={<MainLayout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/about" element={<About />} />

                  {/* Footer Pages */}
                  <Route path="/shipping" element={<ShippingInfo />} />
                  <Route path="/returns" element={<ReturnsRefunds />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/size-guide" element={<SizeGuide />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/sitemap" element={<Sitemap />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/orders/:orderId" element={<OrderDetails />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failure" element={<PaymentFailure />} />
                  </Route>
                </Route>

                {/* 404 - No Layout */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
