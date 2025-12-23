import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext"
import AuthProvider from "./components/AuthContext";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound/NotFound";
import About from "./components/About/About"
import Cart from "./components/Cart/Cart"
import Products from "./components/Products/Products";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Checkout from "./components/Checkout/Checkout";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import UserProfile from "./components/UserProfile/UserProfile";




function App() {
  return (

    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />

              <Route path="/cart" element={<Cart />}></Route>
              <Route path="products" element={<Products />}></Route>
              <Route path="/about" element={<About />}></Route>
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>


            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>


  );
}

export default App;
