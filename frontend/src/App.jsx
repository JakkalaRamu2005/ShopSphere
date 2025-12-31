import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext"
import { WishlistProvider } from "./components/WishlistContext";
import AuthProvider from "./components/AuthContext";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound/NotFound";
import About from "./components/About/About"
import Cart from "./components/Cart/Cart"
import Wishlist from "./components/Wishlist/Wishlist";
import Products from "./components/Products/Products";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Checkout from "./components/Checkout/Checkout";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import UserProfile from "./components/UserProfile/UserProfile";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminUsers from "./components/Admin/AdminUsers";
import Payment from "./components/Payment/Payment";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import PaymentFailure from "./components/Payment/PaymentFailure";
import Carousel from "./components/Carousel/Carousel";
import ChatbotWrapper from "./components/Chatbot/ChatbotWrapper";

// Footer-related components

import Footer from "./components/allfootercode/Footer/Footer";
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




function App() {
  return (

    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>

              {/* Public Routes - No Login Required */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Home and Product Browsing - Public */}
              <Route path="/" element={<><Home /><Footer /></>} />
              <Route path="/products" element={<><Products /><Footer /></>} />
              <Route path="/products/:id" element={<><ProductDetails /><Footer /></>} />
              <Route path="/about" element={<><About /><Footer /></>} />

              {/* Footer Pages - Public */}
              <Route path="/shipping" element={<><ShippingInfo /><Footer /></>} />
              <Route path="/returns" element={<><ReturnsRefunds /><Footer /></>} />
              <Route path="/track-order" element={<><TrackOrder /><Footer /></>} />
              <Route path="/size-guide" element={<><SizeGuide /><Footer /></>} />
              <Route path="/faq" element={<><FAQ /><Footer /></>} />
              <Route path="/contact" element={<><ContactUs /><Footer /></>} />
              <Route path="/about-us" element={<><AboutUs /><Footer /></>} />
              <Route path="/careers" element={<><Careers /><Footer /></>} />
              <Route path="/blog" element={<><Blog /><Footer /></>} />
              <Route path="/privacy" element={<><PrivacyPolicy /><Footer /></>} />
              <Route path="/terms" element={<><TermsConditions /><Footer /></>} />
              <Route path="/sitemap" element={<><Sitemap /><Footer /></>} />

              {/* Protected Routes - Login Required */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<><Cart /><Footer /></>} />
                <Route path="/wishlist" element={<><Wishlist /><Footer /></>} />
                <Route path="/checkout" element={<><Checkout /><Footer /></>} />
                <Route path="/orders" element={<><OrderHistory /><Footer /></>} />
                <Route path="/orders/:orderId" element={<><OrderDetails /><Footer /></>} />
                <Route path="/profile" element={<><UserProfile /><Footer /></>} />
                <Route path="/admin" element={<><AdminDashboard /><Footer /></>} />
                <Route path="/admin/products" element={<><AdminProducts /><Footer /></>} />
                <Route path="/admin/orders" element={<><AdminOrders /><Footer /></>} />
                <Route path="/admin/users" element={<><AdminUsers /><Footer /></>} />
                <Route path="/payment" element={<><Payment /><Footer /></>} />
                <Route path="/payment/success" element={<><PaymentSuccess /><Footer /></>} />
                <Route path="/payment/failure" element={<><PaymentFailure /><Footer /></>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatbotWrapper />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>


  );
}

export default App;
