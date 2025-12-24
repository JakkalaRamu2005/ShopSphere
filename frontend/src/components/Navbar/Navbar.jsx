import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaBox, FaUserEdit, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import API_URL from "../../config/api";
import { useState, useRef, useEffect } from "react";
import "./navbar.css";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Early return AFTER all hooks
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
  const wishlistCount = getWishlistCount();

  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle profile dropdown navigation
  const handleProfileNavigation = (path) => {
    navigate(path);
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand/Logo */}
        <Link to="/" className="nav-brand" onClick={handleLinkClick}>
          <span className="brand-icon">🛒</span>
          <span className="brand-text">ShopEase</span>
        </Link>

        {/* Integrated Search Bar */}
        <div className="navbar-search-container">
          <div className="navbar-search-wrapper">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="navbar-search-input"
            />
            <button className="navbar-search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
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

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <button
              className="profile-btn"
              onClick={toggleProfileDropdown}
              aria-label="Profile menu"
            >
              <FaUser size={18} />
              <span className="profile-name">{user?.name || 'Profile'}</span>
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <FaUser size={20} />
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-name">{user?.name || 'User'}</span>
                    <span className="dropdown-user-email">{user?.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => handleProfileNavigation('/orders')}
                >
                  <FaBox size={16} />
                  <span>My Orders</span>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleProfileNavigation('/profile')}
                >
                  <FaUserEdit size={16} />
                  <span>Edit Profile</span>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleProfileNavigation('/wishlist')}
                >
                  <FaHeart size={16} />
                  <span>My Wishlist</span>
                </button>
                {user?.role === 'admin' && (
                  <button
                    className="dropdown-item"
                    onClick={() => handleProfileNavigation('/admin')}
                  >
                    <span>⚙️</span>
                    <span>Admin Dashboard</span>
                  </button>
                )}
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
