import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import API_URL from "../../config/api";
import { useState } from "react";
import "./navbar.css";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isLoggedIn) return null;

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const cartCount = getCartCount();

  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand/Logo */}
        <Link to="/" className="nav-brand" onClick={handleLinkClick}>
          <span className="brand-icon">🛒</span>
          <span className="brand-text">ShopEase</span>
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Navigation Links - Mobile Menu */}
        <div className={`nav-links-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            About
          </Link>
          <Link
            to="/products"
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Products
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
          <Link
            to="/products"
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          >
            Products
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="nav-actions">
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="cart-link" onClick={handleLinkClick}>
            <div className="cart-icon-wrapper">
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
            <span className="cart-text">Cart</span>
          </Link>

          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}

export default Navbar;
