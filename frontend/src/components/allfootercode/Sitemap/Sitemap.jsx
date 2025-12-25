import React from 'react';
import { Link } from 'react-router-dom';
import './Sitemap.css';

export default function Sitemap() {
  return (
    <div className="sitemap-page">
      <div className="sitemap-hero">
        <h1>Sitemap</h1>
        <p>Find everything on ShopSphere</p>
      </div>

      <div className="sitemap-container">
        
        {/* Main Pages */}
        <section className="sitemap-section">
          <h2>🏠 Main Pages</h2>
          <ul className="sitemap-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </section>

        {/* Shopping */}
        <section className="sitemap-section">
          <h2>🛍️ Shopping</h2>
          <ul className="sitemap-links">
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            <li><Link to="/orders">Order History</Link></li>
          </ul>
        </section>

        {/* Customer Support */}
        <section className="sitemap-section">
          <h2>💬 Customer Support</h2>
          <ul className="sitemap-links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns & Refunds</Link></li>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
          </ul>
        </section>

        {/* Account */}
        <section className="sitemap-section">
          <h2>👤 Account</h2>
          <ul className="sitemap-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </section>

        {/* Company */}
        <section className="sitemap-section">
          <h2>🏢 Company</h2>
          <ul className="sitemap-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </section>

        {/* Legal */}
        <section className="sitemap-section">
          <h2>⚖️ Legal</h2>
          <ul className="sitemap-links">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </section>

      </div>
    </div>
  );
}
