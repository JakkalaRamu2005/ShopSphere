import React from "react";
import { useNavigate } from "react-router-dom";
import "./about.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About Us</h1>
          <p className="about-subtitle">
            Your trusted destination for quality products and exceptional service
          </p>
        </section>

        {/* Main Content */}
        <section className="about-content">
          {/* Our Story */}
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              Welcome to our online store! We started with a simple mission: to provide customers
              with high-quality products at competitive prices, all from the comfort of their homes.
            </p>
            <p>
              What began as a small venture has grown into a trusted e-commerce platform, serving
              customers across the country with a wide range of products from electronics to fashion,
              jewelry, and more.
            </p>
          </div>

          {/* Our Mission */}
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              We believe shopping should be easy, enjoyable, and accessible to everyone. Our mission
              is to create a seamless online shopping experience that combines quality products,
              competitive pricing, and outstanding customer service.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="about-section">
            <h2>Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">✓</div>
                <h3>Quality Products</h3>
                <p>We carefully select every item to ensure it meets our high standards</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚚</div>
                <h3>Fast Shipping</h3>
                <p>Quick and reliable delivery to your doorstep</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure Shopping</h3>
                <p>Your data and payments are always protected</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Customer Support</h3>
                <p>Our team is here to help you 24/7</p>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="about-section">
            <h2>Our Values</h2>
            <div className="values-list">
              <div className="value-item">
                <strong>Customer First:</strong> Your satisfaction is our top priority
              </div>
              <div className="value-item">
                <strong>Quality:</strong> We never compromise on product quality
              </div>
              <div className="value-item">
                <strong>Transparency:</strong> Honest pricing and clear communication
              </div>
              <div className="value-item">
                <strong>Innovation:</strong> Always improving our platform and services
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <h2>Ready to Start Shopping?</h2>
          <p>Discover our wide range of quality products today!</p>
          <button onClick={() => navigate("/products")} className="cta-button">
            Explore Products
          </button>
        </section>
      </div>
    </div>
  );
}

export default About;
