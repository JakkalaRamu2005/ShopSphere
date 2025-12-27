import React from 'react';
import './ShippingInfo.css';

export default function ShippingInfo() {
  return (
    <div className="shipping-page">
      <div className="shipping-hero">
        <h1>🚚 Shipping Information</h1>
        <p>Fast, reliable, and secure delivery across India</p>
      </div>

      <div className="shipping-container">
        
        {/* Shipping Options */}
        <section className="shipping-section">
          <h2>Shipping Options</h2>
          <div className="options-grid">
            
            <div className="option-card">
              <div className="icon-box">🚚</div>
              <h3>Standard Delivery</h3>
              <p className="days">3-7 Business Days</p>
              <p className="price">FREE on orders above ₹999</p>
              <p className="description">
                Regular shipping for most products. Tracking included.
              </p>
            </div>

            <div className="option-card">
              <div className="icon-box">⚡</div>
              <h3>Express Delivery</h3>
              <p className="days">1-2 Business Days</p>
              <p className="price">₹199 extra</p>
              <p className="description">
                Priority shipping for urgent orders. Same-day dispatch available.
              </p>
            </div>

            <div className="option-card">
              <div className="icon-box">🏪</div>
              <h3>Store Pickup</h3>
              <p className="days">Available in 24 hours</p>
              <p className="price">FREE</p>
              <p className="description">
                Collect from our store. We'll notify you when ready.
              </p>
            </div>

          </div>
        </section>

        {/* Shipping Charges */}
        <section className="shipping-section">
          <h2>Shipping Charges</h2>
          <div className="table-wrapper">
            <table className="shipping-table">
              <thead>
                <tr>
                  <th>Order Value</th>
                  <th>Standard Delivery</th>
                  <th>Express Delivery</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below ₹999</td>
                  <td>₹99</td>
                  <td>₹299</td>
                </tr>
                <tr>
                  <td>₹999 - ₹2,999</td>
                  <td className="free">FREE</td>
                  <td>₹199</td>
                </tr>
                <tr>
                  <td>Above ₹3,000</td>
                  <td className="free">FREE</td>
                  <td className="free">FREE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Coverage */}
        <section className="shipping-section">
          <h2>Delivery Coverage</h2>
          <div className="coverage-info">
            <p>✅ We deliver to all major cities and towns across India</p>
            <p>✅ Remote areas may take 2-3 additional days</p>
            <p>✅ Pin code serviceability check available at checkout</p>
          </div>
        </section>

      </div>
    </div>
  );
}
