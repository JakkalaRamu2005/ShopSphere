<<<<<<< HEAD
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaBox, FaUserEdit, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import {API_BASE_URL} from "../../config/api";
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

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    if (isProfileDropdownOpen || showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen, showSuggestions]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for debouncing
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(searchQuery)}`, {
            credentials: "include",
          });
          const data = await response.json();
          setSearchResults(data.slice(0, 8)); // Limit to 8 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms debounce delay
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

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

  // Search handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductClick = (productId) => {
    setSearchQuery("");
    setShowSuggestions(false);
    navigate(`/products/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleProductClick(searchResults[selectedIndex].id);
        } else {
          handleSearchSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
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

        {/* Integrated Search Bar with Autocomplete */}
        <div className="navbar-search-container" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="navbar-search-wrapper">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="navbar-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              autoComplete="off"
            />
            <button type="submit" className="navbar-search-btn">
              {isSearching ? (
                <div className="search-spinner"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              )}
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="search-suggestions">
              {searchResults.map((product, index) => (
                <div
                  key={product.id}
                  className={`search-suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleProductClick(product.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <img
                    src={product.image_url || '/placeholder-product.png'}
                    alt={product.name}
                    className="suggestion-image"
                  />
                  <div className="suggestion-details">
                    <div className="suggestion-name">{product.name}</div>
                    <div className="suggestion-price">₹{product.price}</div>
                  </div>
                </div>
              ))}
              {searchQuery && (
                <div
                  className="search-suggestion-item view-all"
                  onClick={handleSearchSubmit}
                >
                  <span>View all results for "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}

          {/* No Results Message */}
          {showSuggestions && searchResults.length === 0 && !isSearching && searchQuery && (
            <div className="search-suggestions">
              <div className="search-no-results">
                No products found for "{searchQuery}"
              </div>
            </div>
          )}
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
=======
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

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    if (isProfileDropdownOpen || showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen, showSuggestions]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for debouncing
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(searchQuery)}`, {
            credentials: "include",
          });
          const data = await response.json();
          setSearchResults(data.slice(0, 8)); // Limit to 8 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms debounce delay
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

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

  // Search handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductClick = (productId) => {
    setSearchQuery("");
    setShowSuggestions(false);
    navigate(`/products/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleProductClick(searchResults[selectedIndex].id);
        } else {
          handleSearchSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
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

        {/* Integrated Search Bar with Autocomplete */}
        <div className="navbar-search-container" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="navbar-search-wrapper">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="navbar-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              autoComplete="off"
            />
            <button type="submit" className="navbar-search-btn">
              {isSearching ? (
                <div className="search-spinner"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              )}
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="search-suggestions">
              {searchResults.map((product, index) => (
                <div
                  key={product.id}
                  className={`search-suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleProductClick(product.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <img
                    src={product.image_url || '/placeholder-product.png'}
                    alt={product.name}
                    className="suggestion-image"
                  />
                  <div className="suggestion-details">
                    <div className="suggestion-name">{product.name}</div>
                    <div className="suggestion-price">₹{product.price}</div>
                  </div>
                </div>
              ))}
              {searchQuery && (
                <div
                  className="search-suggestion-item view-all"
                  onClick={handleSearchSubmit}
                >
                  <span>View all results for "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}

          {/* No Results Message */}
          {showSuggestions && searchResults.length === 0 && !isSearching && searchQuery && (
            <div className="search-suggestions">
              <div className="search-no-results">
                No products found for "{searchQuery}"
              </div>
            </div>
          )}
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
>>>>>>> master
