import React, { useEffect, useState } from "react";
import "./products.css";
import "./breadcrumbs-styles.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductRatingBadge from "./ProductRatingBadge";
import { API_BASE_URL } from "../../config/api";
import SkeletonCard from "../Skeleton/SkeletonCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsPerpage] = useState(8);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [categories, setCategories] = useState([]);

  // New state for advanced features
  const [sortBy, setSortBy] = useState("default");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState([
    "Electronics",
    "Men's Clothing",
    "Jewelry",
    "Women's Fashion",
    "Accessories"
  ]);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Fetch all products from backend (includes both FakeStore and admin products)
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (data.success && data.products) {
          // Format products to match expected structure
          const formattedProducts = data.products.map(p => ({
            id: p.id,
            title: p.title,
            price: parseFloat(p.price) / 83, // Convert INR to USD for consistency
            description: p.description,
            category: p.category,
            // Use the first image from the array, or a placeholder if empty
            image: (p.images && p.images.length > 0) ? p.images[0] : 'https://via.placeholder.com/300x300?text=No+Image',
            images: p.images || [],
            rating: {
              rate: parseFloat(p.rating_rate) || 0,
              count: parseInt(p.rating_count) || 0
            },
            stock: p.stock || 0,
            source: p.source || 'fakestore'
          }));

          setProducts(formattedProducts);

          // Extract unique categories from formatted products
          const uniqueCategories = [...new Set(formattedProducts.map(product => product.category))];
          setCategories(uniqueCategories);

          // Calculate price range
          const prices = formattedProducts.map(product => product.price * 83);
          if (prices.length > 0) {
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange({ min: minPrice, max: maxPrice });
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();

    // Load recently viewed from localStorage
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }

    // Load recent searches from localStorage
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Read category from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [location.search]);

  // Update search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q) {
      setSearchQuery(q);
      // Ensure we clear any selected category if we are searching (optional, but good UX)
      // setSelectedCategory("all"); 
    }
  }, [location.search]);

  const handleCardClick = (id) => {
    // Track recently viewed
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
      let viewed = [...recentlyViewed];
      // Remove if already exists
      viewed = viewed.filter(p => p.id !== product.id);
      // Add to beginning
      viewed.unshift(product);
      // Keep only last 6
      viewed = viewed.slice(0, 6);
      setRecentlyViewed(viewed);
      localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
    }
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const getFilteredProducts = () => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        return (
          product.title.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const priceINR = product.price * 83;
      return priceINR >= priceRange.min && priceINR <= priceRange.max;
    });

    // Rating filter (4+ stars)
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => {
        // Since we don't have ratings in FakeStore API, we'll use product.rating.rate if available
        return product.rating && product.rating.rate >= ratingFilter;
      });
    }

    // Sorting
    if (sortBy === "priceLowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighToLow") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => {
        const ratingA = a.rating?.rate || 0;
        const ratingB = b.rating?.rate || 0;
        return ratingB - ratingA;
      });
    } else if (sortBy === "newest") {
      // Since FakeStore doesn't have dates, we'll sort by ID (higher ID = newer)
      filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("default");
    setRatingFilter(0);

    if (products.length > 0) {
      const prices = products.map(product => product.price * 83);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange({ min: minPrice, max: maxPrice });
    }
    setCurrentPage(1);
  };

  const filteredProducts = getFilteredProducts();
  const totalFilteredPages = Math.ceil(filteredProducts.length / productsPerpage);
  const indexOfLastFilteredProduct = currentPage * productsPerpage;
  const indexOfFirstFilteredProduct = indexOfLastFilteredProduct - productsPerpage;
  const currentFilteredProducts = filteredProducts.slice(indexOfFirstFilteredProduct, indexOfLastFilteredProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalFilteredPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Smart pagination: Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = totalFilteredPages;
    const current = currentPage;

    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const startPage = Math.max(2, current - 1);
      const endPage = Math.min(totalPages - 1, current + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation();
    const result = await toggleWishlist(product);

    if (result.success) {
      // Show notification
      setNotification({
        show: true,
        message: result.message,
        type: result.action === 'added' ? 'success' : 'info'
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } else {
      // Show error notification
      setNotification({
        show: true,
        message: result.message || 'Failed to update wishlist',
        type: 'error'
      });

      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    // Generate search suggestions with images
    if (value.trim().length > 0) {
      const searchLower = value.toLowerCase();
      const suggestions = products
        .filter(product =>
          product.title.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        )
        .slice(0, 6)
        .map(product => ({
          id: product.id,
          title: product.title,
          category: product.category,
          image: product.image,
          price: product.price * 83
        }));
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.title);
    setShowSuggestions(false);
    setCurrentPage(1);

    // Save to recent searches
    saveRecentSearch(product.title);
  };

  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      saveRecentSearch(query);
      setShowSuggestions(false);
    }
  };

  const saveRecentSearch = (query) => {
    let searches = [...recentSearches];
    // Remove if already exists
    searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    // Add to beginning
    searches.unshift(query);
    // Keep only last 5
    searches = searches.slice(0, 5);
    setRecentSearches(searches);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
  };

  const handleTrendingClick = (trend) => {
    setSearchQuery(trend);
    setCurrentPage(1);
    saveRecentSearch(trend);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setShowVoiceSearch(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        saveRecentSearch(transcript);
        setShowVoiceSearch(false);
      };

      recognition.onerror = () => {
        setShowVoiceSearch(false);
        alert('Voice search not available. Please try typing instead.');
      };

      recognition.onend = () => {
        setShowVoiceSearch(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in your browser.');
    }
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: parseInt(value) }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Helper function to count products per category
  const getProductCountByCategory = (category) => {
    if (category === "all") return products.length;
    return products.filter(product => product.category === category).length;
  };

  return (
    <div className="products-page">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: '', type: '' })}>✕</button>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="breadcrumbs-container">
        <nav className="breadcrumbs">
          <a href="/" className="breadcrumb-link">Home</a>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Products</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="products-header">
        <h1 className="products-heading">All Products</h1>
      </div>

      {/* Main Content: Sidebar + Products */}
      <div className="products-main-layout">
        {/* Left Sidebar - Filters */}
        <aside className="filters-sidebar">
          <div className="sidebar-header">
            <h2>Filters</h2>
            {(searchQuery || selectedCategory !== "all") && (
              <button onClick={clearAllFilters} className="clear-all-btn">
                Clear All
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="active-filters-section">
              <h3>Active Filters:</h3>
              <div className="active-filters-tags">
                {searchQuery && (
                  <span className="filter-tag">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}>✕</button>
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="filter-tag">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")}>✕</button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Category</h3>
            <div className="filter-options">
              <label className={`filter-option ${selectedCategory === "all" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === "all"}
                  onChange={() => handleCategoryChange("all")}
                />
                <span>All Categories</span>
                <span className="filter-count">{getProductCountByCategory("all")}</span>
              </label>
              {categories.map(category => (
                <label key={category} className={`filter-option ${selectedCategory === category ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="filter-count">{getProductCountByCategory(category)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Price Range</h3>
            <div className="price-range-inputs">
              <div className="price-input-group">
                <label htmlFor="min-price">Min (₹)</label>
                <input
                  type="number"
                  id="min-price"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceRangeChange}
                  className="price-input"
                  min="0"
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-group">
                <label htmlFor="max-price">Max (₹)</label>
                <input
                  type="number"
                  id="max-price"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                  className="price-input"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Minimum Rating</h3>
            <div className="filter-options">
              <label className={`filter-option ${ratingFilter === 0 ? "active" : ""}`}>
                <input
                  type="radio"
                  name="rating"
                  checked={ratingFilter === 0}
                  onChange={() => setRatingFilter(0)}
                />
                <span>All Ratings</span>
              </label>
              <label className={`filter-option ${ratingFilter === 4 ? "active" : ""}`}>
                <input
                  type="radio"
                  name="rating"
                  checked={ratingFilter === 4}
                  onChange={() => setRatingFilter(4)}
                />
                <span>⭐ 4+ Stars</span>
              </label>
              <label className={`filter-option ${ratingFilter === 3 ? "active" : ""}`}>
                <input
                  type="radio"
                  name="rating"
                  checked={ratingFilter === 3}
                  onChange={() => setRatingFilter(3)}
                />
                <span>⭐ 3+ Stars</span>
              </label>
            </div>
          </div>


        </aside>

        {/* Right Side - Products Grid */}
        <main className="products-content">
          {/* Products Toolbar - Results Info & Sort */}
          <div className="products-toolbar">
            <div className="results-info">
              <p>
                {loading
                  ? "Loading products..."
                  : `Showing ${currentFilteredProducts.length} of ${filteredProducts.length} products`}
              </p>
            </div>
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select-toolbar"
              >
                <option value="default">Relevance</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
              {currentFilteredProducts.length > 0 ? (
                <div className="products-grid">
                  {currentFilteredProducts.map((product) => {
                    const originalPrice = product.price * 83;
                    const discount = Math.floor(Math.random() * 40) + 10; // 10-50% discount
                    const discountedPrice = originalPrice * (1 - discount / 100);
                    const stock = Math.floor(Math.random() * 20) + 1;
                    const isNew = product.id % 5 === 0;
                    const isBestseller = product.id % 7 === 0;
                    const rating = product.rating?.rate || (Math.random() * 2 + 3).toFixed(1);
                    const reviewCount = product.rating?.count || Math.floor(Math.random() * 500) + 50;

                    return (
                      <div
                        key={product.id}
                        className="product-card enhanced"
                        onClick={() => handleCardClick(product.id)}
                      >
                        {/* Badges Container */}
                        <div className="product-badges">
                          {discount >= 30 && (
                            <span className="badge badge-discount">-{discount}%</span>
                          )}
                          {isNew && <span className="badge badge-new">New</span>}
                          {isBestseller && <span className="badge badge-bestseller">Bestseller</span>}
                        </div>

                        {/* Wishlist Icon */}
                        <button
                          className={`wishlist-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
                          onClick={(e) => handleAddToWishlist(e, product)}
                          aria-label="Add to wishlist"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>

                        {/* Product Image Container */}
                        <div className="product-image-container">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="product-image"
                          />

                          {/* Quick View Overlay */}
                          <div className="quick-view-overlay">
                            <button
                              className="quick-view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(product.id);
                              }}
                            >
                              👁️ Quick View
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="product-info">
                          <h2 className="product-title" title={product.title}>
                            {product.title}
                          </h2>

                          <p className="product-category">{product.category}</p>

                          {/* Rating Display */}
                          <div className="product-rating">
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={i < Math.floor(rating) ? 'star filled' : 'star'}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="rating-text">
                              {rating} ({reviewCount.toLocaleString()})
                            </span>
                          </div>

                          {/* Price Section */}
                          <div className="price-section">
                            <div className="price-row">
                              <span className="current-price">₹{discountedPrice.toFixed(2)}</span>
                              <span className="original-price">₹{originalPrice.toFixed(2)}</span>
                            </div>
                            <span className="discount-text">{discount}% off</span>
                          </div>

                          {/* Stock Indicator */}
                          {stock < 10 && (
                            <div className="stock-indicator low-stock">
                              ⚡ Only {stock} left in stock!
                            </div>
                          )}
                          {stock >= 10 && (
                            <div className="stock-indicator in-stock">
                              ✓ In Stock
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="product-actions">
                            <button
                              className="add-to-cart-btn primary"
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              Add to Cart
                            </button>

                            {/* Quick Actions on Hover */}
                            <div className="quick-actions">
                              <button
                                className="icon-btn share-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Share feature coming soon!');
                                }}
                                title="Share"
                                aria-label="Share product"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="18" cy="5" r="3"></circle>
                                  <circle cx="6" cy="12" r="3"></circle>
                                  <circle cx="18" cy="19" r="3"></circle>
                                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect Indicator */}
                        <div className="card-shine"></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-products">
                  <p>No products found with current filters</p>
                  <button onClick={clearAllFilters} className="btn-secondary">
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Smart Pagination */}
              {filteredProducts.length > 0 && totalFilteredPages > 1 && (
                <>
                  <div className="pagination-container">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      ← Previous
                    </button>
                    <div className="page-numbers">
                      {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="page-ellipsis">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={currentPage === page ? "page-btn-active" : "page-btn"}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalFilteredPages}
                      className="pagination-btn"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="page-info">
                    Page {currentPage} of {totalFilteredPages}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <div className="recently-viewed-section">
          <h2 className="recently-viewed-title">Recently Viewed</h2>
          <div className="recently-viewed-grid">
            {recentlyViewed.map((product) => (
              <div
                key={product.id}
                className="recently-viewed-card"
                onClick={() => handleCardClick(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="recently-viewed-image"
                />
                <h3 className="recently-viewed-product-title">{product.title}</h3>
                <p className="recently-viewed-price">₹{(product.price * 83).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
