import React, { useEffect, useState } from "react";
import "./products.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import ProductRatingBadge from "./ProductRatingBadge";
import API_BASE_URL from "../../config/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsPerpage] = useState(8);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

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

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Fetch FakeStore API products
        const fakeStoreResponse = await fetch("https://fakestoreapi.com/products");
        const fakeStoreData = await fakeStoreResponse.json();

        // Fetch custom admin products
        const customResponse = await fetch(`${API_BASE_URL}/admin/products`);
        const customData = await customResponse.json();

        // Merge both product lists
        let allProducts = [...fakeStoreData];

        if (customData.success && customData.products.length > 0) {
          // Convert custom products to match FakeStore format
          const formattedCustomProducts = customData.products.map(p => ({
            id: `custom-${p.id}`, // Prefix to distinguish from FakeStore
            title: p.title,
            price: parseFloat(p.price) / 83, // Convert back to USD for consistency
            description: p.description,
            category: p.category || 'custom',
            image: p.image || 'https://via.placeholder.com/200',
            rating: { rate: 0, count: 0 }
          }));

          allProducts = [...allProducts, ...formattedCustomProducts];
        }

        setProducts(allProducts);

        // Extract unique categories
        const uniqueCategories = [...new Set(allProducts.map(product => product.category))];
        setCategories(uniqueCategories);

        // Calculate price range
        const prices = allProducts.map(product => product.price * 83);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange({ min: minPrice, max: maxPrice });

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

  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation();
    const result = await addToWishlist(product);
    if (result.success) {
      alert('Successfully added to wishlist!');
    } else {
      alert(result.message || 'Failed to add to wishlist');
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
      {/* Page Header */}
      <div className="products-header">
        <h1 className="products-heading">All Products</h1>

        {/* Enhanced Search Bar with Suggestions */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>

            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => {
                if (searchSuggestions.length > 0 || recentSearches.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(searchQuery);
                }
              }}
              className="search-input"
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
                className="clear-search-btn"
              >
                ✕
              </button>
            )}

            {/* Voice Search Button */}
            <button
              onClick={handleVoiceSearch}
              className={`voice-search-btn ${showVoiceSearch ? 'active' : ''}`}
              title="Voice Search"
            >
              {showVoiceSearch ? (
                <span className="voice-pulse">🎤</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          {/* Enhanced Search Suggestions Dropdown */}
          {showSuggestions && (
            <div className="search-suggestions-dropdown">
              {/* Recent Searches */}
              {recentSearches.length > 0 && !searchQuery && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <h4>Recent Searches</h4>
                    <button onClick={clearRecentSearches} className="clear-btn">Clear All</button>
                  </div>
                  <div className="recent-searches-list">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="recent-search-item"
                        onClick={() => {
                          setSearchQuery(search);
                          setCurrentPage(1);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {!searchQuery && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <h4>Trending Searches</h4>
                  </div>
                  <div className="trending-searches-list">
                    {trendingSearches.map((trend, index) => (
                      <button
                        key={index}
                        className="trending-chip"
                        onClick={() => handleTrendingClick(trend)}
                      >
                        🔥 {trend}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Suggestions with Images */}
              {searchQuery && searchSuggestions.length > 0 && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <h4>Products</h4>
                  </div>
                  <div className="product-suggestions-list">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        className="product-suggestion-item"
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <img src={product.image} alt={product.title} className="suggestion-image" />
                        <div className="suggestion-details">
                          <span className="suggestion-title">{product.title}</span>
                          <div className="suggestion-meta">
                            <span className="suggestion-category">{product.category}</span>
                            <span className="suggestion-price">₹{product.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchQuery && searchSuggestions.length === 0 && (
                <div className="no-suggestions">
                  <p>No products found for "{searchQuery}"</p>
                  <p className="suggestion-hint">Try searching for categories like Electronics, Clothing, or Jewelry</p>
                </div>
              )}
            </div>
          )}
        </div>
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

          {/* Sort By */}
          <div className="filter-section">
            <h3 className="filter-title">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Default</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </aside>

        {/* Right Side - Products Grid */}
        <main className="products-content">
          {/* Results Info */}
          <div className="results-info">
            <p>
              {loading
                ? "Loading products..."
                : `Showing ${currentFilteredProducts.length} of ${filteredProducts.length} products`}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
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
                              🛒 Add to Cart
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

              {/* Pagination */}
              {filteredProducts.length > 0 && totalFilteredPages > 1 && (
                <>
                  <div className="pagination-container">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      Previous
                    </button>
                    <div className="page-numbers">
                      {[...Array(totalFilteredPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={currentPage === index + 1 ? "page-btn-active" : "page-btn"}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalFilteredPages}
                      className="pagination-btn"
                    >
                      Next
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
