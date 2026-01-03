import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaBox, FaUserEdit, FaSignOutAlt, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import API_URL from "../../config/api";
import { useState, useRef, useEffect } from "react";
import "./navbar.css";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Check if current page is home
  const isHomePage = location.pathname === '/';

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
          const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(searchQuery)}`, {
            credentials: "include",
          });
          const data = await response.json();
          if (data.success && data.products) {
            setSearchResults(data.products.slice(0, 8)); // Limit to 8 suggestions
            setShowSuggestions(true);
          } else {
            setSearchResults([]);
          }
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

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
          <FaShoppingBag className="brand-icon" />
          <span className="brand-text">ShopSphere</span>
        </Link>

        {/* Categories Dropdown - Show only on home page */}
        {isHomePage && (
          <div className="categories-dropdown-container">
            <button
              className="categories-dropdown-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars size={16} />
              <span>Categories</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9L1 4h10z" />
              </svg>
            </button>

            {isMobileMenuOpen && (
              <div className="categories-mega-menu">
                <div className="mega-menu-content">
                  <div className="category-column">
                    <h4>Fashion</h4>
                    <Link to="/products?category=men's clothing" onClick={handleLinkClick}>Men's Clothing</Link>
                    <Link to="/products?category=women's clothing" onClick={handleLinkClick}>Women's Clothing</Link>
                    <Link to="/products?category=jewelry" onClick={handleLinkClick}>Jewelry</Link>
                  </div>
                  <div className="category-column">
                    <h4>Electronics</h4>
                    <Link to="/products?category=electronics" onClick={handleLinkClick}>All Electronics</Link>
                    <Link to="/products?category=laptops" onClick={handleLinkClick}>Laptops</Link>
                    <Link to="/products?category=mobiles" onClick={handleLinkClick}>Mobiles</Link>
                  </div>
                  <div className="category-column">
                    <h4>Accessories</h4>
                    <Link to="/products?category=accessories" onClick={handleLinkClick}>All Accessories</Link>
                    <Link to="/products?category=bags" onClick={handleLinkClick}>Bags</Link>
                    <Link to="/products?category=watches" onClick={handleLinkClick}>Watches</Link>
                  </div>
                  <div className="category-column">
                    <h4>More</h4>
                    <Link to="/products" onClick={handleLinkClick}>View All Products</Link>
                    <Link to="/products?sort=newest" onClick={handleLinkClick}>New Arrivals</Link>
                    <Link to="/products?sort=rating" onClick={handleLinkClick}>Best Sellers</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
                    src={product.images?.[0] || '/placeholder-product.png'}
                    alt={product.title}
                    className="suggestion-image"
                  />
                  <div className="suggestion-details">
                    <div className="suggestion-name">{product.title}</div>
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
          {isLoggedIn ? (
            <>
              {/* Wishlist Icon with Badge */}
              <Link to="/wishlist" className="wishlist-link" onClick={handleLinkClick}>
                <div className="wishlist-icon-wrapper">
                  <FaHeart size={22} />
                  {wishlistCount > 0 && (
                    <span className="wishlist-badge">{wishlistCount}</span>
                  )}
                </div>
                <span className="wishlist-text">Wishlist</span>
              </Link>

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
            </>
          ) : (
            /* Login Button for Non-Authenticated Users */
            <button
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav >
  );
}

export default Navbar;
