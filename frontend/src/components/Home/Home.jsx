import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import Carousel from "../Carousel/Carousel";
import "./home.css";
import {API_BASE_URL} from "../../config/api";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch featured products (high-rated products)
  useEffect(() => {
    fetch(`${API_BASE_URL}/products/featured?limit=4`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          // Format products to match expected structure
          const formattedProducts = data.products.map(p => ({
            id: p.id,
            title: p.title,
            price: parseFloat(p.price) / 83, // Convert INR to USD
            description: p.description,
            category: p.category,
            image: p.image,
            rating: {
              rate: parseFloat(p.rating_rate) || 0,
              count: parseInt(p.rating_count) || 0
            }
          }));
          setFeaturedProducts(formattedProducts);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCategoryClick = (category) => {
    navigate("/products", { state: { category } });
  };

  // Format price properly
  const formatPrice = (price) => {
    const inrPrice = price * 83;
    return `₹${inrPrice.toFixed(2)}`;
  };

  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
      description: "Latest gadgets & tech"
    },
    {
      name: "Jewelery",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
      description: "Elegant jewelry pieces"
    },
    {
      name: "Men's Clothing",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=500",
      description: "Trendy fashion for men"
    },
    {
      name: "Women's Clothing",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500",
      description: "Stylish women's wear"
    }
  ];

  return (
    <div className="home-page">
      {/* Carousel Hero Section */}
      <Carousel />

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (

            <div
              key={index}
              className="category-card"
              onClick={() => handleCategoryClick(category.name.toLowerCase())}
            >
              <div className="category-image-wrapper">

                <img
                  src={category.image}
                  alt={category.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=' + category.name;
                  }}
                />
              </div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <p className="loading-text">Loading featured products...</p>
        ) : (
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              console.log(product.image),
              <div
                key={product.id}
                className="featured-card"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="featured-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/200x200?text=No+Image";
                    }}
                  />
                </div>

                <h3 className="featured-title" title={product.title}>
                  {product.title}
                </h3>
                <p className="featured-category">{product.category}</p>
                <p className="featured-price">{formatPrice(product.price)}</p>
                <button
                  className="featured-btn"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="view-all-container">
          <button className="view-all-btn" onClick={handleShopNow}>
            View All Products
          </button>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>On orders over ₹500</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>100% secure transactions</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">💬</div>
            <h3>24/7 Support</h3>
            <p>Always here to help</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Ready to Start Shopping?</h2>
        <p>Join thousands of happy customers today!</p>
        <button className="cta-btn" onClick={handleShopNow}>
          Explore Products
        </button>
      </section>
    </div>
  );
}

export default Home;
