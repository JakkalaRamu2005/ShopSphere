import React from 'react';
import './AboutUs.css';

export default function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About ShopSphere</h1>
        <p>Your trusted online shopping destination since 2024</p>
      </div>

      <div className="about-container">
        
        {/* Our Story */}
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            ShopSphere was founded with a simple mission: to make quality products accessible to everyone. 
            What started as a small online store has grown into a trusted e-commerce platform serving 
            thousands of happy customers across India.
          </p>
          <p>
            We believe in providing authentic products, exceptional customer service, and a seamless 
            shopping experience. Our team works tirelessly to bring you the best deals and latest trends.
          </p>
        </section>

        {/* Our Values */}
        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Quality First</h3>
              <p>We source only authentic products from trusted brands and suppliers.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Customer Trust</h3>
              <p>Building long-term relationships through transparency and reliability.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Quick and secure delivery to your doorstep across India.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive pricing and regular deals to save you money.</p>
            </div>

          </div>
        </section>

        {/* Our Team */}
        <section className="about-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            
            <div className="team-card">
              <div className="team-avatar">👨‍💼</div>
              <h3>Rajesh Kumar</h3>
              <p className="team-role">Founder & CEO</p>
              <p>Visionary leader with 10+ years in e-commerce</p>
            </div>

            <div className="team-card">
              <div className="team-avatar">👩‍💼</div>
              <h3>Priya Sharma</h3>
              <p className="team-role">Head of Operations</p>
              <p>Ensures smooth delivery and customer satisfaction</p>
            </div>

            <div className="team-card">
              <div className="team-avatar">👨‍💻</div>
              <h3>Amit Patel</h3>
              <p className="team-role">Tech Lead</p>
              <p>Building the best shopping experience</p>
            </div>

            <div className="team-card">
              <div className="team-avatar">👩‍🎨</div>
              <h3>Neha Singh</h3>
              <p className="team-role">Design Head</p>
              <p>Creating beautiful user experiences</p>
            </div>

          </div>
        </section>

        {/* Stats */}
        <section className="about-section stats-section">
          <h2>Our Journey in Numbers</h2>
          <div className="stats-grid">
            
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Products</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">100+</div>
              <div className="stat-label">Cities Covered</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">Customer Rating</div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
