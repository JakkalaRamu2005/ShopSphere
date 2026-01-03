import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaLock, FaUndo, FaHeadset } from "react-icons/fa";
import Carousel from "../Carousel/Carousel";

import DealsSection from "../DealsSection/DealsSection";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleCategoryClick = (category) => {
    navigate("/products", { state: { category } });
  };

  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
      description: "Latest gadgets & tech"
    },
    {
      name: "Jewelry",
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
        <div className="home-categories-grid">
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

      {/* Deals of the Day Section */}
      <section className="deals-section">
        <div className="deals-header">
          <h2 className="section-title">⚡ Deals of the Day</h2>
          <div className="deals-timer">
            <span className="timer-label">Ends in:</span>
            <div className="timer-display">
              <div className="timer-unit">
                <span className="timer-value">12</span>
                <span className="timer-label-small">Hours</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-unit">
                <span className="timer-value">34</span>
                <span className="timer-label-small">Mins</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-unit">
                <span className="timer-value">56</span>
                <span className="timer-label-small">Secs</span>
              </div>
            </div>
          </div>
        </div>
        <DealsSection limit={4} />
      </section>



      {/* Trust Signals Section */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-icon">
              <FaTruck />
            </div>
            <h3>Free Shipping</h3>
            <p>On orders over ₹500</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <FaLock />
            </div>
            <h3>Secure Payment</h3>
            <p>100% secure transactions</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <FaUndo />
            </div>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <FaHeadset />
            </div>
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
