import React, { useEffect, useState } from "react";
import "./products.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
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

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [categories, setCategories] = useState([]);

  // New state for advanced features
  const [sortBy, setSortBy] = useState("default");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    // Generate search suggestions
    if (value.trim().length > 0) {
      const searchLower = value.toLowerCase();
      const suggestions = products
        .filter(product =>
          product.title.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        )
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          title: product.title,
          category: product.category
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

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <h1 className="products-heading">All Products</h1>

        {/* Search Bar with Suggestions */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => {
              setSearchQuery("");
              setShowSuggestions(false);
            }} className="clear-search-btn">
              ✕
            </button>
          )}

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map((product) => (
                <div
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <span className="suggestion-title">{product.title}</span>
                  <span className="suggestion-category">{product.category}</span>
                </div>
              ))}
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
                  {currentFilteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => handleCardClick(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="product-image"
                      />
                      <h2 className="product-title">{product.title}</h2>
                      <p className="product-category">{product.category}</p>
                      <ProductRatingBadge productId={product.id} />
                      <p className="product-price">₹{(product.price * 83).toFixed(2)}</p>
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
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
